import pathToRegexp from 'path-to-regexp'
import { Modal, message } from 'antd'
import { modelExtend } from '../../../utils'
import orderDetailService from '../../../services/purchaseManage/orderDetail'

const initialState = {
  orderBean: {
    formStatus: 1,
    data: [],
  },
  deliveryInfo: [],
}

export default modelExtend({
  namespace: 'purchaseDetail',
  state: initialState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const match = pathToRegexp('/businessQuery/purchaseOrderQuery/detail/:id').exec(pathname)
        if (match) {
          dispatch({ type: 'getOrderDetail', payload: { formId: match[1] } })
          dispatch({ type: 'deliverList', payload: { formId: match[1] } })
        }
      })
    },
  },
  effects: {
    // 订单详情
    * getOrderDetail({ payload }, { call, update }) {
      const { content } = yield call(orderDetailService.orderDetailApi, { ...payload })
      const pscIds = []
      content.data.forEach((form) => {
        form.items.forEach((item) => {
          pscIds.push(item.pscId)
        })
      })
      const { content: statesArr } = yield call(orderDetailService.usingStatus, { pscIds })
      content.data.forEach((form) => {
        form.items.forEach((item) => {
          const statusObj = statesArr.filter(statusItem => statusItem.pscId === item.pscId)
          if (statusObj.length > 0) {
            item.itemStatus = statusObj[0].pscStatus
          }
        })
      })
      yield update({ orderBean: content })
    },
    // 配送跟踪
    * deliverList({ payload }, { call, update }) {
      const { content } = yield call(orderDetailService.deliverListApi, { ...payload })
      yield update({ deliveryInfo: content })
    },
    // 催单
    * remind({ payload }, { call }) {
      const { content: { canContinueRemindFlag } } = yield call(orderDetailService.remindApi, {
        ...payload,
      })
      if (canContinueRemindFlag) {
        Modal.success({
          title: '催单成功',
          content: '我们已经通过短信通知到供应商尽快发货',
        })
      } else {
        message.warning('你今天已提醒过供应商了哦！')
      }
    },
    // 终止，作废
    * updateOrderStatus({ payload }, { select, call, put }) {
      const { orderBean: { formId } } = yield select(({ purchaseDetail }) => purchaseDetail)
      yield call(orderDetailService.updateStatusApi, { ...payload })
      yield put({ type: 'getOrderDetail', payload: { formId } })
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload }
    },
  },
})
