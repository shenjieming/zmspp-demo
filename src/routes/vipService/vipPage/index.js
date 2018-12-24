import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Tabs, Button, Spin } from 'antd'
import { getBasicFn } from '../../../utils'
import Breadcrumb from '../../../components/Breadcrumb'
import styles from './index.less'
import SuccessModal from './successModal'

const TabPane = Tabs.TabPane
const namespace = 'vipPage'
const VipPage = ({ vipPage, loading }) => {
  const { getLoading, dispatchAction } = getBasicFn({ namespace, loading })
  const {
    purchasedVips,
    selectedCustomer,
    selectedCombination,
    customerListData,
    combinations,
    successVisible,
    createdOrderNo,
  } = vipPage
  const topContent = (
    <div className={styles.topContainer}>
      <span className={styles.vipIcon} />
      <span className={styles.largeFont}>立即加入零库存VIP,享受专属服务:</span>
      <div className={styles.list}>
        <ul>
          <li>客户寄售库存查询:掌握寄售货品的客户使用情况，及时补货，较少资金占压</li>
          <li>客户入库查询、应收查询: 了解开票情况, 回款进度, 回款动态一手掌握</li>
          <li>敬请期待更多功能加入...</li>
        </ul>
      </div>
    </div>
  )
  const selectCustomer = (item) => {
    if (item.hplId === selectedCustomer.hplId) {
      return
    }
    dispatchAction({ type: 'resetCombination' })
    dispatchAction({ type: 'updateState', payload: { selectedCustomer: item } })
  }
  const customerList = () => {
    let lis = ''
    if (customerListData.length === 0) {
      lis = <div className={styles.noSupplier}>—— 暂无可选择客户 ——</div>
    } else {
      lis = (
        <ul>
          {customerListData.map(item => (
            <li
              key={item.hplId}
              className={`${styles.li} ${
                item.hplId === selectedCustomer.hplId ? styles.activeLi : ''
              }`}
            >
              <a
                onClick={() => {
                  selectCustomer(item)
                }}
              >
                {item.hplName}
              </a>
            </li>
          ))}
        </ul>
      )
    }
    return lis
  }
  const timeChoose = () =>
    combinations.map(item => (
      <div
        key={item.id}
        className={`${styles.selector}  ${
          item.id === selectedCombination.id ? styles.selectorSelected : ''
        }`}
        onClick={() => {
          dispatchAction({ type: 'updateState', payload: { selectedCombination: item } })
        }}
      >
        <div className={styles.priceArea}>
          <span className={styles.priceText}>{item.serviceAmount}</span>元
        </div>
        <div className={styles.timeArea}>
          {item.serviceMth}
          个月
        </div>
      </div>
    ))
  const buyCombination = () => {
    dispatchAction({ type: 'buyCombination' })
  }
  const rightForm = () => (
    <div>
      <div className="aek-mb10">
        <span className="aek-font-large">
          医院客户:
          {selectedCustomer.hplName}
        </span>
      </div>
      <p className="aek-font-large">服务时长:</p>
      <div className={styles.timeChoose}>{timeChoose()}</div>
      <Button
        type="primary"
        className="aek-mt20"
        disabled={!selectedCustomer.hplId}
        onClick={buyCombination}
      >
        立即购买
      </Button>
    </div>
  )
  const tabChange = (key) => {
    if (key === '2') {
      dispatchAction({ type: 'getPurchasedOrder' })
    }
  }
  const modalProps = {
    orderDetail: { ...selectedCustomer, ...selectedCombination, orderNo: createdOrderNo },
    visible: successVisible,
    onCancel() {
      dispatchAction({ payload: { successVisible: false, createdOrderNo: '' } })
    },
  }
  const getOrders = () => {
    let orders = ''
    if (purchasedVips.length === 0) {
      orders = <div className={styles.noSupplier}>—— 暂无已购订单 ——</div>
    } else {
      orders = purchasedVips.map(item => (
        <div key={item.orderId} className={styles.line}>
          <span>{item.hplName}</span>
          <span className="aek-fr">
            <span className="aek-orange">{item.endDate}</span>
            到期
          </span>
        </div>
      ))
    }
    return orders
  }
  return (
    <div className="aek-layout">
      <div className="bread">
        <Breadcrumb />
      </div>
      <div className="content">
        {topContent}
        <Tabs type="card" onChange={tabChange}>
          <TabPane tab="购买VIP" key="1">
            <div className={styles.outLine}>
              <Spin spinning={getLoading('getCustomerData')}>{customerList()}</Spin>
            </div>
            <div className={styles.rightForm}>{rightForm()}</div>
          </TabPane>
          <TabPane tab="已购清单" key="2">
            <div className={styles.purchasedList}>
              <Spin spinning={getLoading('getPurchasedOrder')}>{getOrders()}</Spin>
            </div>
          </TabPane>
        </Tabs>
      </div>
      <SuccessModal {...modalProps} />
    </div>
  )
}
VipPage.propTypes = {
  vipPage: PropTypes.object,
  loading: PropTypes.object,
}
export default connect(({ vipPage, loading }) => ({ vipPage, loading }))(VipPage)
