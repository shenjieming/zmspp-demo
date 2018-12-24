import pathToRegexp from 'path-to-regexp'
import { message } from 'antd'

import { modelExtend } from '../../../utils'
import orderDetailService from '../../../services/orderManage/orderDetail'

const initialState = {
  orderBean: {
    formStatus: 1,
    data: [],
  },
  confirmOrderVisible: false,
  printPurchaseVisible: false,
  deliveryInfo: [],
}

export default modelExtend({
  namespace: 'orderDetail',
  state: initialState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const match = pathToRegexp('/orderManage/customerOrder/detail/:id').exec(pathname)
        if (match) {
          dispatch({ type: 'updateState', payload: { ...initialState } })
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
      yield update({ orderBean: content })
    },
    // 配送跟踪
    * deliverList({ payload }, { call, update }) {
      const { content } = yield call(orderDetailService.deliverListApi, { ...payload })
      yield update({ deliveryInfo: content })
    },
    // 订单确认
    * confirmOrder({ payload }, { select, call, put, update }) {
      const { orderBean: { formId } } = yield select(({ orderDetail }) => orderDetail)
      yield call(orderDetailService.confirmOrderApi, { ...payload })
      message.success('确认成功!')
      yield update({ confirmOrderVisible: false })
      yield put({ type: 'getOrderDetail', payload: { formId } })
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload }
    },
  },
})
