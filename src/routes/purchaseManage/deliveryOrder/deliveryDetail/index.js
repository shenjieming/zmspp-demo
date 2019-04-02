import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Table, Button, Row, Col } from 'antd'
import { Link } from 'dva/router'
import classnames from 'classnames'
import { getBasicFn } from '../../../../utils/index'
import APanel from '../../../../components/APanel'
import { genColumns } from './data'
import Breadcrumb from '../../../../components/Breadcrumb'
import PrintModal from '../modal/printModal'
import style from './index.less'

const namespace = 'purchaseDeliveryDetail'
const propTypes = {
  purchaseDeliveryDetail: PropTypes.object,
  loading: PropTypes.object,
  routes: PropTypes.array,
  app: PropTypes.object,
}
const DeliveryDetail = ({
  purchaseDeliveryDetail,
  loading,
  app: { orgInfo: { accuracy, orgId, orgName } },
}) => {
  const { dispatchAction, getLoading } = getBasicFn({ namespace, loading })
  const {
    detailPageData,
    wrapData,
    printModalVisible,
    printList,
    printDetailData,
  } = purchaseDeliveryDetail
  const {
    formStatus,
    formAmount, // 配送单金额',
    formType, // 1-普耗；2-寄售；3-跟台
    originalFormNo, // 客户订单号',
    purchaseRemark, // 采购备注',
    purchaseTime, // 采购时间',
    saleType,
    senderName,
    senderTime,
    formNo,
    formId,
    deliverType,
    currentOrgName,
    deliverNo,
    deliverCompany,
    deliverName,
    deliverPhone,
    supplierOrgName,
    receiveOrgId,
    deliverRemark, // 发货备注
  } = detailPageData
  const printDeliverOrder = () => {
    dispatchAction({
      type: 'printCheckOrder',
      payload: { formNo },
    })
  }
  const printModalParam = {
    accuracy,
    printList,
    printDetailData,
    printModalVisible,
    dispatchAction,
    getLoading,
    orgName,
  }
  return (
    <div className="aek-layout">
      <div className="bread">
        <Breadcrumb />
      </div>
      <APanel title="基本信息">
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
            <Row>
              <Col span={24}>
                <p>采购备注：</p>
                {purchaseRemark}
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
                <Link
                  className="aek-link"
                  to={`/purchaseManage/deliveryOrder/purchaseLogistics/${formId}`}
                >
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
                </Link>
              </span>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <p>发货备注：</p>
              {deliverRemark}
            </Col>
          </Row>
        </div>
      </APanel>
      <APanel title="物资信息">
        {wrapData.map((item, idx) => {
          const tableParam = {
            loading: getLoading('queryDeliveryDetail'),
            columns: genColumns({ formType, accuracy }),
            bordered: true,
            footer: () => (
              <Row>
                <Col span={8}>使用科室：{item.receiveDeptName}</Col>
                <Col span={8}>收货人：{item.receiveName}</Col>
                <Col span={8}>联系方式：{item.receivePhone}</Col>
                <Col span={8}>收货库房：{item.receiveAddress}</Col>
              </Row>
            ),
            dataSource: item.items,
            pagination: false,
            rowKey: 'itemId',
            style: { marginBottom: 12 },
            scroll: { x: 1300 },
          }
          return <Table key={idx} {...tableParam} />
        })}
        {Number(formStatus) === 3 &&
          orgId === receiveOrgId && (
            <div style={{ height: 40, marginBottom: 12 }}>
              <div style={{ height: 40, lineHeight: '40px' }}>
                <Button className="aek-mr15 aek-fr" onClick={printDeliverOrder}>
                  打印验收单
                </Button>
              </div>
            </div>
          )}
      </APanel>
      <PrintModal {...printModalParam} />
    </div>
  )
}

DeliveryDetail.propTypes = propTypes
export default connect(({ purchaseDeliveryDetail, loading, app }) => ({
  purchaseDeliveryDetail,
  loading,
  app,
}))(DeliveryDetail)
