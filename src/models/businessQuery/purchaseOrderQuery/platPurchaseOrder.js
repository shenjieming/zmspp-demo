import { modelExtend, getServices } from '../../../utils'

const services = getServices({
  purchaOrderListApi: '/platform/purchase/orders',
})

const initialState = {
  orderList: [],
  pagination: {
    pageSize: 10,
    current: 1,
    total: 0,
  },
  searchParams: {},
}

export default modelExtend({
  namespace: 'platPurchaseOrder',
  state: initialState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/businessQuery/purchaseOrderQuery') {
          if (history.action !== 'POP') {
            dispatch({ type: 'updateState', payload: { ...initialState } })
          }
          dispatch({ type: 'orderList' })
        }
      })
    },
  },
  effects: {
    // 列表
    * orderList(_, { select, call, update }) {
      const { searchParams, pagination } = yield select(
        ({ platPurchaseOrder }) => platPurchaseOrder,
      )
      const {
        content: { data, current, pageSize, total },
      } = yield call(services.purchaOrderListApi, { ...searchParams, ...pagination })
      yield update({ orderList: data, pagination: { current, pageSize, total } })
    },
    // 翻页（带上搜索参数）
    * pageChange({ payload }, { select, call, update }) {
      const { searchParams } = yield select(({ platPurchaseOrder }) => platPurchaseOrder)
      const param = { ...searchParams, ...payload }
      const {
        content: { data, current, pageSize, total },
      } = yield call(services.purchaOrderListApi, { ...param })
      yield update({ orderList: data, pagination: { current, pageSize, total } })
    },
    // 搜索
    * searchOrder({ payload }, { call, update }) {
      const {
        content: { data, current, pageSize, total },
      } = yield call(services.purchaOrderListApi, { ...payload })
      yield update({
        orderList: data,
        pagination: { current, pageSize, total },
        searchParams: { ...payload },
      })
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload }
    },
  },
})
