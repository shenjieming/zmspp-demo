import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Table, Row, Col, Spin } from 'antd'
import classnames from 'classnames'
import { getBasicFn } from '../../../../utils/index'
import APanel from '../../../../components/APanel'
import { genColumns } from './data'
import Breadcrumb from '../../../../components/Breadcrumb'
import style from './index.less'

const namespace = 'purchaseDeliveryDetail'
const propTypes = {
  purchaseDeliveryDetail: PropTypes.object,
  loading: PropTypes.object,
  app: PropTypes.object,
}
const DeliveryDetail = ({ purchaseDeliveryDetail, loading, app: { orgInfo: { accuracy } } }) => {
  const { getLoading } = getBasicFn({ namespace, loading })
  const { detailPageData, wrapData } = purchaseDeliveryDetail
  const {
    formAmount, // 配送单金额',
    formType, // 1-普耗；2-寄售；3-跟台
    originalFormNo, // 客户订单号',
    purchaseRemark, // 采购备注',
    purchaseTime, // 采购时间',
    senderName,
    senderTime,
    formNo,
    deliverType,
    deliverNo,
    deliverCompany,
    deliverName,
    deliverPhone,
    supplierOrgName,
  } = detailPageData
  return (
    <div className="aek-layout">
      <div className="bread">
        <Breadcrumb />
      </div>
      <APanel title="基本信息">
        <Spin spinning={getLoading('queryDeliveryDetail')}>
          {Number(formType) !== 3 ? (
            <div className={classnames(style.msgWrap, style.msgBase)}>
              <Row className={style.row}>
                <Col span={8}>
                  <p>订单编号：</p>
                  <span>{originalFormNo}</span>
                </Col>
                <Col span={8}>
                  <p>采购时间：</p>
                  <span>{purchaseTime}</span>
                </Col>
                <Col span={8}>
                  <p>合计金额：</p>
                  <span>￥{formAmount}</span>
                </Col>
              </Row>
              <Row className={style.row}>
                <Col span={24}>
                  <p>采购备注：</p>
                  <span>{purchaseRemark}</span>
                </Col>
              </Row>
            </div>
          ) : (
            ''
          )}
          <div className={classnames(style.msgWrap)}>
            <Row className={style.row}>
              <Col span={8}>
                <p>供应商名称：</p>
                <span>{supplierOrgName}</span>
              </Col>
              <Col span={8}>
                <p>发货人：</p>
                <span>{senderName}</span>
              </Col>
              <Col span={8}>
                <p>发货时间：</p>
                <span>{senderTime}</span>
              </Col>
            </Row>
            <Row className={style.row}>
              <Col span={8}>
                <p>配送单号：</p>
                <span>{formNo}</span>
              </Col>
              <Col span={16}>
                <p>配送方式：</p>
                <span>
                  {Number(deliverType) === 1 ? (
                    <span>
                      {deliverNo} {deliverCompany}
                    </span>
                  ) : (
                    <span>
                      自送{deliverName && <span>-{deliverName}</span>}
                      {deliverPhone && <span>-{deliverPhone}</span>}
                    </span>
                  )}
                </span>
              </Col>
            </Row>
            <Row className={style.row}>
              <Col span={24}>
                <p>发货备注：</p>
                <span>{purchaseRemark}</span>
              </Col>
            </Row>
          </div>
        </Spin>
      </APanel>
      <APanel title="物资信息">
        {wrapData.map((item, idx) => {
          const tableParam = {
            loading: getLoading('queryDeliveryDetail'),
            columns: genColumns({ formType, accuracy }),
            bordered: true,
            footer: () => (
              <span>
                收货地址：{item.receiveAddress} {item.receiveDeptName} {item.receiveName}{' '}
                {item.receivePhone}
              </span>
            ),
            dataSource: item.items,
            pagination: false,
            rowKey: 'itemId',
            style: { marginBottom: 12 },
            scroll: { x: 1300 },
          }
          return <Table key={idx} {...tableParam} />
        })}
      </APanel>
    </div>
  )
}

DeliveryDetail.propTypes = propTypes
export default connect(({ purchaseDeliveryDetail, loading, app }) => ({
  purchaseDeliveryDetail,
  loading,
  app,
}))(DeliveryDetail)
