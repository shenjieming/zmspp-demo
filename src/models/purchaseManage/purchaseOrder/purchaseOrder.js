import { Modal, message } from 'antd'
import qs from 'qs'

import { modelExtend } from '../../../utils'
import purchaseOrderService from '../../../services/purchaseManage/purchaseOrder'

const initialState = {
  orderList: [],
  supplierList: [],
  pagination: {
    pageSize: 10,
    current: 1,
    total: 0,
  },
  currentOrderId: '',
  searchSaveParams: {}, // 格式差异导致一份用作请求，一份用作初始值
  searchParams: {},
}

export default modelExtend({
  namespace: 'purchaseOrder',
  state: initialState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname, search }) => {
        if (pathname === '/purchaseManage/purchaseOrder') {
          if (history.action !== 'POP') {
            const query = qs.parse(search, { ignoreQueryPrefix: true })
            dispatch({
              type: 'updateState',
              payload: {
                ...initialState,
                searchParams: { ...query },
                searchSaveParams: { ...query },
              },
            })
          }
          dispatch({ type: 'orderList' })
          dispatch({ type: 'supplierList' })
        }
      })
    },
  },
  effects: {
    // 列表
    * orderList(_, { select, call, update }) {
      const { searchParams, pagination } = yield select(({ purchaseOrder }) => purchaseOrder)
      const {
        content: { data, current, pageSize, total },
      } = yield call(purchaseOrderService.purchaOrderListApi, { ...searchParams, ...pagination })
      yield update({ orderList: data, pagination: { current, pageSize, total } })
    },
    // 翻页（带上搜索参数）
    * pageChange({ payload }, { select, call, update }) {
      const { searchParams } = yield select(({ purchaseOrder }) => purchaseOrder)
      const param = { ...searchParams, ...payload }
      const {
        content: { data, current, pageSize, total },
      } = yield call(purchaseOrderService.purchaOrderListApi, { ...param })
      yield update({ orderList: data, pagination: { current, pageSize, total } })
    },
    // 搜索
    * searchOrder({ payload }, { call, update }) {
      const {
        content: { data, current, pageSize, total },
      } = yield call(purchaseOrderService.purchaOrderListApi, { ...payload })
      yield update({
        orderList: data,
        pagination: { current, pageSize, total },
        searchParams: { ...payload },
      })
    },
    // 供应商列表
    * supplierList({ payload }, { call, update }) {
      const { content } = yield call(purchaseOrderService.supplierListApi, { ...payload })
      yield update({ supplierList: content })
    },
    // 催单
    * remind({ payload }, { call }) {
      const { content: { canContinueRemindFlag } } = yield call(purchaseOrderService.remindApi, {
        ...payload,
      })
      if (canContinueRemindFlag) {
        Modal.success({
          title: '催单成功',
          content: '我们已经通过短信通知到供应商尽快发货',
        })
      } else {
        message.warning('您今天提醒已经超过三次，我们已经成功通知到供应商尽快发货！')
      }
    },
    // 终止，作废
    * updateOrderStatus({ payload }, { select, call, put }) {
      const { pagination } = yield select(({ purchaseOrder }) => purchaseOrder)
      yield call(purchaseOrderService.updateStatusApi, { ...payload })
      yield put({ type: 'pageChange', payload: { ...pagination } })
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload }
    },
  },
})
