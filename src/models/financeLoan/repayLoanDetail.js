import pathToRegexp from 'path-to-regexp'
import { modelExtend, getServices } from '../../utils'

const { getLoanDetail, checkBill } = getServices({
  // 还款记录明细
  getLoanDetail: '/finance/loan-apply/repay-order/detail',
  // 发票核对
  checkBill: '/finance/loan-apply/loan-order/invoice-check',
})
export default modelExtend({
  namespace: 'repayLoanDetail',
  state: {
    current: {},
    visible: false,
    formId: '',
    checkData: {}, // 发票核对数据
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const { pathname } = location
        const match = pathToRegexp('/financeLoan/repayLoan/repayLoanDetail/:id').exec(pathname)
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
    // 发票核对
    * checkBill({ payload }, { call, update }) {
      const { content: checkData } = yield call(checkBill, payload)
      yield update({ checkData })
    },
  },
  reducers: {},
})
