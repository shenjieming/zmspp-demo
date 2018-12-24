import { modelExtend, getServices } from '../../../utils'

const services = getServices({
  orderList: '/return-order/customer/page-list',
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
  namespace: 'purchaseCancel',
  state: initialState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/purchaseManage/purchaseCancel') {
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
      const { searchParams, pagination } = yield select(({ purchaseCancel }) => purchaseCancel)
      const { content: { data, current, pageSize, total } } = yield call(services.orderList, {
        ...searchParams,
        ...pagination,
      })
      yield update({ orderList: data, pagination: { current, pageSize, total } })
    },
    // 翻页（带上搜索参数）
    * pageChange({ payload }, { select, call, update }) {
      const { searchParams } = yield select(({ purchaseCancel }) => purchaseCancel)
      const { pagination, sorter } = payload
      const param = { ...searchParams, ...pagination, ...sorter }
      const { content: { data, current, pageSize, total } } = yield call(services.orderList, {
        ...param,
      })
      yield update({
        orderList: data,
        pagination: { current, pageSize, total },
        searchParams: { ...searchParams, ...sorter },
      })
    },
    // 搜索
    * searchOrder({ payload }, { select, call, update }) {
      const { searchParams } = yield select(({ purchaseCancel }) => purchaseCancel)
      const param = { ...searchParams, ...payload }
      const { content: { data, current, pageSize, total } } = yield call(services.orderList, {
        ...param,
      })
      yield update({
        orderList: data,
        pagination: { current, pageSize, total },
        searchParams: { ...searchParams, ...payload },
      })
    },
  },
})
