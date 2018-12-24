import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col, Table, Spin, Steps } from 'antd'

import Breadcrumb from '../../../../components/Breadcrumb'
import APanel from '../../../../components/APanel'
import { getBasicFn } from '../../../../utils/index'

import { traceColumns, materialColumns } from './props'
import styles from './index.less'

const namespace = 'purchaseDetail'
const Step = Steps.Step
const PurchaseDetail = ({ purchaseDetail, loading }) => {
  const { getLoading } = getBasicFn({ namespace, loading })
  const { orderBean, deliveryInfo } = purchaseDetail
  const orderType = ['普耗', '寄销', '跟台']
  const renderSteps = () => {
    let steps
    if (orderBean.formStatus < 3) {
      steps = [
        { key: 1, name: '尚未配送' },
        { key: 2, name: '部分配送' },
        { key: 3, name: '配送完结' },
        { key: 4, name: '订单完结' },
      ]
    } else if (orderBean.formStatus >= 3 && orderBean.formStatus <= 4) {
      steps = [{ key: 1, name: '尚未配送' }, { key: 3, name: '配送完结' }, { key: 4, name: '订单完结' }]
    } else if (orderBean.formStatus === 5) {
      steps = [{ key: 1, name: '尚未配送' }, { key: 2, name: '部分配送' }, { key: 5, name: '订单终止' }]
    } else if (orderBean.formStatus === 6) {
      steps = [{ key: 1, name: '尚未配送' }, { key: 6, name: '订单废除' }]
    }
    let current = 0
    for (let index = 0; index < steps.length; index++) {
      if (steps[index].key === orderBean.formStatus) {
        current = index
      }
    }
    return (
      <Steps className="aek-p30" current={current}>
        {steps.map(item => <Step key={item.key} title={item.name} />)}
      </Steps>
    )
  }
  const supplierInfo = () => (
    <Row>
      <Col span={8}>
        <span className={styles.gray}>供应商名称：</span>
        {orderBean.supplierOrgName}
      </Col>
      <Col span={8}>
        <span className={styles.gray}>联系人：</span>
        {orderBean.supplierContactName}
      </Col>
      <Col span={8}>
        <span className={styles.gray}>联系电话：</span>
        {orderBean.supplierContactPhone}
      </Col>
    </Row>
  )
  const orderInfo = () => (
    <div>
      <Row>
        <Col span={orderBean.saleType === 2 ? 24 : 8}>
          <span className={styles.gray}>客户订单号：</span>
          {orderBean.formNo}
          {orderBean.saleType === 2 ? (
            <span className={styles.gray}>(原订单号：{orderBean.originalFormNo})</span>
          ) : (
            ''
          )}
        </Col>
        <Col span={8}>
          <span className={styles.gray}>采购人：</span>
          {orderBean.purchaseName}
        </Col>
        <Col span={8}>
          <span className={styles.gray}>采购时间：</span>
          {orderBean.purchaseTime}
        </Col>
      </Row>
      <Row>
        <Col span={8}>
          <span className={styles.gray}>订单类型：</span>
          {orderType[orderBean.formType - 1]}
        </Col>
        <Col span={8}>
          <span className={styles.gray}>是否加急：</span>
          {orderBean.urgentFlag ? '是' : '否'}
        </Col>
        <Col span={8}>
          <span className={styles.gray}>订单金额：</span>
          ￥{orderBean.formAmount}
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <span className={styles.gray}>采购备注：</span>
          {orderBean.purchaseRemark}
        </Col>
      </Row>
    </div>
  )
  const materialsInfo = () => {
    const tableList = orderBean.data
    const info = tableList.map((ele, index) => (
      <Row key={index}>
        <div style={{ marginBottom: '6px' }}>
          <span className={styles.gray}>{`收货地址${tableList.length > 1 ? index + 1 : ''}: `}</span>
          <span className="aek-fill-15" />
          {ele.receiveAddress}
          <span className="aek-fill-15" />
          {ele.receiveName}
          <span className="aek-fill-15" />
          {ele.receivePhone}
        </div>
        <Table
          bordered
          rowKey="itemId"
          size="middle"
          rowClassName={({ itemStatus }) => {
            if (itemStatus === 2) {
              return 'aek-text-disable'
            }
            return ''
          }}
          columns={materialColumns}
          pagination={false}
          dataSource={ele.items}
        />
      </Row>
    ))
    return info
  }
  const renderDeliveryInfo = () => (
    <div className={styles.deliveryInfo}>
      <Table
        bordered
        rowKey="formId"
        size="small"
        columns={traceColumns(orderBean.formId)}
        pagination={false}
        dataSource={deliveryInfo}
      />
    </div>
  )
  return (
    <div className="aek-layout">
      <div className="bread">
        <Breadcrumb />
      </div>
      <Spin spinning={getLoading('getOrderDetail')}>
        <APanel>
          <div className={styles.stepsContainer}>{renderSteps()}</div>
        </APanel>
        <APanel title="采购单信息">
          <div className={styles.orderInfo}>
            <div className={styles.infoBox}>
              <div className="aek-gray">供应商信息</div>
              {supplierInfo()}
            </div>
            {orderBean.saleType === 2 ? (
              <div className={styles.infoBox}>
                <div className="aek-gray">收货信息</div>
                <Row>
                  <Col span={8}>
                    <span className={styles.gray}>收货单位：</span>
                    {orderBean.receiveOrgName}
                  </Col>
                </Row>
              </div>
            ) : (
              ''
            )}
            <div className={styles.infoBox}>
              <div className="aek-gray">订单信息</div>
              {orderInfo()}
            </div>
            <div className={styles.infoBox}>
              <div className="aek-gray">物资信息</div>
              {materialsInfo()}
            </div>
          </div>
        </APanel>
        <APanel title="配送情况">{renderDeliveryInfo()}</APanel>
      </Spin>
    </div>
  )
}

PurchaseDetail.propTypes = {
  purchaseDetail: PropTypes.object,
  loading: PropTypes.object,
}
export default connect(({ purchaseDetail, loading }) => ({ purchaseDetail, loading }))(
  PurchaseDetail,
)
