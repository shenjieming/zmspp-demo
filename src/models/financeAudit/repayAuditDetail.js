import pathToRegexp from 'path-to-regexp'
import { modelExtend, getServices } from '../../utils'

const { getLoanDetail } = getServices({
  // 还款记录明细
  getLoanDetail: '/finance/loan-audit/repay-order/detail',
})
export default modelExtend({
  namespace: 'repayAuditDetail',
  state: {
    current: {},
    visible: false,
    formId: '',
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const { pathname } = location
        const match = pathToRegexp('/financeAudit/repayAudit/repayAuditDetail/:id').exec(pathname)
        if (history.action !== 'POP') {
          dispatch({ type: 'reset' })
        }
        if (match) {
          dispatch({ type: 'getLoanDetail', payload: { formId: match[1] } })
        }
      })
    },
  },
  effects: {
    // 还款记录明细
    * getLoanDetail({ payload }, { call, update }) {
      const { content: current } = yield call(getLoanDetail, payload)
      yield update({ current })
    },
  },
  reducers: {},
})
