import pathToRegexp from 'path-to-regexp'
import { modelExtend, getServices } from '../../utils'
import windowNewOpen from '../../shared/windowNewOpen'

const { getApplyDetail, confirmApply } = getServices({
  // 获取还款数据
  getApplyDetail: '/finance/loan-apply/repay-order/preview',
  // 确认申请
  confirmApply: '/finance/loan-apply/repay-order/confirm',
})
export default modelExtend({
  namespace: 'repayApplyDetail',
  state: {
    currentApply: {},
    loanFormIds: '',
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const { pathname } = location
        const match = pathToRegexp('/financeLoan/repayLoan/repayApplyDetail/:id').exec(pathname)
        if (history.action !== 'POP') {
          dispatch({ type: 'reset' })
        }
        if (match) {
          const loanFormIds = match[1]
          dispatch({ type: 'updateState', payload: { loanFormIds } })
          dispatch({ type: 'getApplyDetail', payload: { loanFormIds } })
        }
      })
    },
  },
  effects: {
    // 还款明细
    * getApplyDetail({ payload }, { call, update }) {
      const { content: currentApply } = yield call(getApplyDetail, payload)
      yield update({ currentApply })
    },
    // 还款确认
    * confirmApply({ payload }, { call }) {
      const { content } = yield call(confirmApply, payload)
      if (content) {
        windowNewOpen(content)
      }
    },
  },
  reducers: {},
})
