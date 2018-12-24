import { modelExtend, getServices } from '../../../utils/'

const services = getServices({
  // 获取订单列表
  getOrderList: '/distribute/distribute-order/page-list',
})

const initialState = {
  data: [],
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
  },
  searchParam: {},
  searchSaveParams: {},
}

export default modelExtend({
  namespace: 'distributeList',

  state: initialState,

  subscriptions: {
    setup({ history, dispatch }) {
      history.listen(({ pathname }) => {
        if (pathname === '/distributeManage/orderDistribute') {
          if (history.action !== 'POP') {
            dispatch({ type: 'reset' })
          }
          dispatch({ type: 'getOrderList' })
        }
      })
    },
  },

  effects: {
    * getOrderList({ payload }, { select, call, update }) {
      const { searchParam } = yield select(({ distributeList }) => distributeList)
      const params = { ...payload, ...searchParam }
      const { content: { current, pageSize, total, data } } = yield call(services.getOrderList, {
        ...params,
      })
      yield update({ data, pagination: { current, pageSize, total } })
    },
    * search({ payload }, { select, call, update }) {
      const { pagination } = yield select(({ distributeList }) => distributeList)
      const params = { ...payload, ...pagination }
      const { content: { current, pageSize, total, data } } = yield call(services.getOrderList, {
        ...params,
      })
      yield update({ data, pagination: { current, pageSize, total }, searchParam: payload })
    },
  },

  reducers: {
    reset() {
      return { ...initialState }
    },
  },
})
