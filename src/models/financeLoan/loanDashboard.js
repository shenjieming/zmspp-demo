import { routerRedux } from 'dva/router'
import { modelExtend, getServices } from '../../utils'

const services = getServices({
  getStatistics: 'finance/loan-apply/watch-board/statistics',
  // 立即申请
  getApplyVerify: 'finance/loan-apply/credit-exist/verify',
})
const initalState = {
  data: [],
}
export default modelExtend({
  namespace: 'loanDashboard',
  state: initalState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const { pathname } = location
        if (pathname === '/financeLoan/loanDashboard') {
          if (history.action !== 'POP') {
            dispatch({ type: 'updateState', payload: initalState })
          }
          dispatch({ type: 'queryData' })
        }
      })
    },
  },
  effects: {
    * queryData(_, { call, update }) {
      const { content } = yield call(services.getStatistics)
      yield update({ data: content })
    },
    // 立即申请跳转 判断是否授信
    /**
     * 已经授信时跳转到贷款申请
     * 没有授信时跳转到授信页
     * */
    * getApplyVerify({ payload }, { call, put }) {
      const { code } = yield call(services.getApplyVerify, payload)
      if (code === 201) {
        yield put(routerRedux.push('/financeLoan/loanDashboard/loanApply'))
        return
      }
      yield put(routerRedux.push('/financeLoan/supplierCreditAudit'))
    },
  },
  reducers: {},
})
