import { modelExtend, getServices } from '../../utils'

const { getRepayRecordList } = getServices({
  // 查询已经还贷款列表
  getRepayRecordList: '/finance/loan-mgmt/repay-order/list-page',
})

export default modelExtend({
  namespace: 'repayManage',
  state: {
    repayRecordList: [],
    pagination: {
      current: 1,
      pageSize: 10,
      total: null,
    },
    searchSaveParam: {},
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const { pathname } = location
        if (pathname === '/financeManage/repayManage') {
          if (history.action !== 'POP') {
            dispatch({ type: 'reset' })
          }
          dispatch({ type: 'getRepayRecordList' })
        }
      })
    },
  },
  effects: {
    // 查询已还贷款列表
    * getRepayRecordList({ payload }, { call, select, update }) {
      const { searchSaveParam, pagination } = yield select(({ repayManage }) => repayManage)
      const { content: { data, current, total, pageSize } } = yield call(getRepayRecordList, {
        ...searchSaveParam,
        ...pagination,
        ...payload,
      })
      yield update({
        repayRecordList: data,
        pagination: { current, total, pageSize },
      })
    },
  },
  reducers: {},
})
