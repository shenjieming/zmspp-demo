import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import styles from './index.less'
import ErrorPage from './errorPage'
import OrderDtail from './orderInfo'
import ConfirmText from './confirmText'

const ConfirmOrder = ({ confirmOrder, dispatch, loading }) => {
  const { confirmText, confirmStatus, orderInfo, pageStatus } = confirmOrder

  //
  const confirmTextObj = {
    1: '准时发货，',
    2: '延迟发货，',
    3: '暂时缺货，',
  }

  const onConfirm = (type) => {
    let text = confirmText
    if (confirmStatus !== type) {
      text = confirmTextObj[type]
    }

    dispatch({
      type: 'confirmOrder/updateState',
      payload: {
        pageStatus: 2,
        confirmStatus: type,
        confirmText: text,
      },
    })
  }

  const onBack = (confirmRemark = confirmTextObj[confirmStatus]) => {
    dispatch({
      type: 'confirmOrder/updateState',
      payload: {
        pageStatus: 1,
        confirmText: confirmRemark,
      },
    })
  }

  const onSubmit = (confirmRemark) => {
    dispatch({
      type: 'confirmOrder/submit',
      payload: {
        confirmStatus,
        confirmText: confirmRemark,
      },
    })
  }

  const onRefresh = () => {
    window.location.reload()
  }

  const getComponent = () => {
    switch (pageStatus) {
      case 0:
        return <ErrorPage onRefresh={onRefresh} />
      case 1:
        return <OrderDtail orderInfo={orderInfo} onConfirm={onConfirm} />
      case 2:
        return (
          <ConfirmText
            confirmText={confirmText}
            onBack={onBack}
            onSubmit={onSubmit}
            loading={loading}
          />
        )
      default:
        return '参数错误！'
    }
  }

  return <div className={styles.wrap}>{getComponent()}</div>
}

ConfirmOrder.propTypes = {
  confirmOrder: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ confirmOrder, loading }) => ({ confirmOrder, loading }))(ConfirmOrder)
