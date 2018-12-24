import { modelExtend, getServices } from '../../utils'

const { getRepayRecordList } = getServices({
  // 查询已还贷款列表
  getRepayRecordList: '/finance/loan-audit/repay-order/list-page',
})

export default modelExtend({
  namespace: 'repayAudit',
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
        if (pathname === '/financeAudit/repayAudit') {
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
      const { searchSaveParam, pagination } = yield select(({ repayAudit }) => repayAudit)
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
