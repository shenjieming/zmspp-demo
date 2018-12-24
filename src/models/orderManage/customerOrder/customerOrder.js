import { message } from 'antd'
import qs from 'qs'

import { modelExtend } from '../../../utils'
import customerOrderService from '../../../services/orderManage/customerOrder'

const initialState = {
  orderList: [],
  customerList: [],
  purchaseListInfo: {
    data: [],
  },
  pagination: {
    pageSize: 10,
    current: 1,
    total: 0,
  },
  currentOrderId: '',
  searchSaveParams: {}, // 格式差异导致一份用作请求，一份用作初始值
  searchParams: {},
  confirmOrderVisible: false,
  printPurchaseVisible: false,
}

export default modelExtend({
  namespace: 'customerOrder',
  state: initialState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname, search }) => {
        if (pathname === '/orderManage/customerOrder') {
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
          dispatch({ type: 'customerList' })
        }
      })
    },
  },
  effects: {
    // 列表
    * orderList(_, { select, call, update }) {
      const { searchParams, pagination } = yield select(({ customerOrder }) => customerOrder)
      const {
        content: { data, current, pageSize, total },
      } = yield call(customerOrderService.customerOrderListApi, { ...searchParams, ...pagination })
      yield update({ orderList: data, pagination: { current, pageSize, total } })
    },
    // 翻页（带上搜索参数）
    * pageChange({ payload }, { select, call, update }) {
      const { searchParams } = yield select(({ customerOrder }) => customerOrder)
      const param = { ...searchParams, ...payload }
      const {
        content: { data, current, pageSize, total },
      } = yield call(customerOrderService.customerOrderListApi, { ...param })
      yield update({ orderList: data, pagination: { current, pageSize, total } })
    },
    // 搜索
    * searchOrder({ payload }, { call, update }) {
      const {
        content: { data, current, pageSize, total },
      } = yield call(customerOrderService.customerOrderListApi, { ...payload })
      yield update({
        orderList: data,
        pagination: { current, pageSize, total },
        searchParams: { ...payload },
      })
    },
    // 客户列表
    * customerList({ payload }, { call, update }) {
      const { content } = yield call(customerOrderService.customerListApi, { ...payload })
      yield update({ customerList: content })
    },
    // 打印信息（详情接口）
    * printDetail({ payload }, { call, update }) {
      const { content } = yield call(customerOrderService.orderDetailApi, { ...payload })
      yield update({ purchaseListInfo: content })
    },
    // 订单确认
    * confirmOrder({ payload }, { call, put, update }) {
      yield call(customerOrderService.confirmOrderApi, { ...payload })
      message.success('确认成功!')
      yield update({ confirmOrderVisible: false })
      yield put({ type: 'orderList' })
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload }
    },
  },
})
