import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col, Button, Table, Spin } from 'antd'
import { Link } from 'dva/router'

import Breadcrumb from '../../../../components/Breadcrumb'
import APanel from '../../../../components/APanel'
import { getBasicFn } from '../../../../utils'
import { SALE_TYPE, MANAGE_MODEL } from '../../../../utils/constant'

import PrintPurchase from '../../customerOrder/printPurchaseList'
import ConfirmOrder from '../../customerOrder/confirmOrder'
import { traceColumns, materialColumns } from './props'
import styles from './index.less'

const namespace = 'orderDetail'
const OrderDetail = ({ orderDetail, loading, location }) => {
  const { dispatchAction, getLoading } = getBasicFn({ namespace, loading })
  const { orderBean, deliveryInfo, confirmOrderVisible, printPurchaseVisible } = orderDetail
  const deliveryPath = location.pathname.replace('detail', 'delivery')
  const hidePrint = () => {
    dispatchAction({ payload: { printPurchaseVisible: false } })
  }
  const showConfirm = () => {
    dispatchAction({ payload: { confirmOrderVisible: true } })
  }
  const hideConfirm = () => {
    dispatchAction({ payload: { confirmOrderVisible: false } })
  }
  const renderStatus = () => {
    const status = ['', '尚未配送', '部分配送', '配送完结', '订单完结', '已终止', '已作废']
    const statusText = status[orderBean.formStatus ? orderBean.formStatus : 0]
    let confirmOrder
    if (!orderBean.confirmStatus && orderBean.formStatus < 2) {
      confirmOrder = (
        <a
          className="aek-link"
          onClick={() => {
            showConfirm()
          }}
        >
          确认订单
        </a>
      )
    }
    let operation
    if (Number(orderBean.formStatus) <= 2) {
      // 完成配送之前有发货操作
      operation = orderBean.canDeliverFlag ? (
        <Link to={`${deliveryPath}`}>
          <Button type="primary">发货</Button>
        </Link>
      ) : (
        ''
      )
    } else {
      // 完成配送以及后续阶段都有打印采购单
      operation = (
        <a
          onClick={() => {
            dispatchAction({ payload: { printPurchaseVisible: true } })
          }}
        >
          打印采购单
        </a>
      )
    }
    return (
      <div className={styles.statusInnner}>
        <div>
          <span className={styles.orderStatus} style={{ marginRight: '10px' }}>
            {statusText}
          </span>
          {confirmOrder}
        </div>
        <div>{orderBean.purchaseRemark}</div>
        <div>{operation}</div>
      </div>
    )
  }
  const customerInfo = () => (
    <Row>
      <Col span={8}>
        <span className={styles.gray}>客户名称：</span>
        {orderBean.customerOrgName}
      </Col>
      <Col span={8}>
        <span className={styles.gray}>联系人：</span>
        {orderBean.customerContactName}
      </Col>
      <Col span={8}>
        <span className={styles.gray}>联系电话：</span>
        {orderBean.customerContactPhone}
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
          {SALE_TYPE[orderBean.saleType]}-{MANAGE_MODEL[orderBean.formType]}
        </Col>
        <Col span={8}>
          <span className={styles.gray}>是否加急：</span>
          {orderBean.urgentFlag === undefined ? '' : orderBean.urgentFlag ? '是' : '否'}
        </Col>
        <Col span={8}>
          <span className={styles.gray}>订单金额：</span> ￥{orderBean.formAmount}
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
          size="small"
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
        columns={traceColumns(deliveryInfo.length)}
        pagination={false}
        dataSource={deliveryInfo}
      />
    </div>
  )
  const confirmParams = {
    visible: confirmOrderVisible,
    hideHandler: hideConfirm,
    loading: getLoading('confirmOrder'),
    okHandler: (value) => {
      dispatchAction({ type: 'confirmOrder', payload: { ...value, formId: orderBean.formId } })
    },
  }
  const printParams = {
    purchaseListInfo: orderBean,
    visible: printPurchaseVisible,
    hideHandler: hidePrint,
    getLoading,
  }
  return (
    <div className="aek-layout">
      <div className="bread">
        <Breadcrumb />
      </div>
      <Spin spinning={getLoading('getOrderDetail')}>
        <APanel>
          <div className={styles.statusContainer}>{renderStatus()}</div>
        </APanel>
        <APanel title="采购单信息">
          <div className={styles.orderInfo}>
            <div className={styles.infoBox}>
              <div className="aek-gray">客户信息</div>
              {customerInfo()}
            </div>
            {/* {orderBean.saleType === 2 ? (
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
            )} */}
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
      <ConfirmOrder {...confirmParams} />
      <PrintPurchase {...printParams} />
    </div>
  )
}

OrderDetail.propTypes = {
  orderDetail: PropTypes.object,
  loading: PropTypes.object,
  dispatch: PropTypes.func,
  routes: PropTypes.array,
  location: PropTypes.object,
}
export default connect(({ orderDetail, loading }) => ({ orderDetail, loading }))(OrderDetail)
