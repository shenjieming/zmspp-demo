import { routerRedux } from 'dva/router'
import { modelExtend, getServices } from '../../../utils'

const services = getServices({
  // 查询余额
  getBalanceData: 'finance/out-cash/amount/balance',
  // 提现
  getApplyVerify: 'finance/loan-apply/credit-exist/verify',
})
const initalState = {
  balance: {}, // 账户余额
  buttonVisible: false, // 默认是显示余额
}
export default modelExtend({
  namespace: 'accountBalance',
  state: initalState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const { pathname } = location
        if (pathname === '/financeLoan/accountBalance') {
          if (history.action !== 'POP') {
            dispatch({ type: 'updateState', payload: initalState })
          }
          dispatch({
            type: 'getBalance',
          })
        }
      })
    },
  },
  effects: {
    // 查询余额
    * getBalance({ payload }, { call, update }) {
      const { content } = yield call(services.getBalanceData, payload)
      yield update({
        balance: content,
      })
    },
    // 提现跳转 判断是否授信
    /**
     * 已经授信时跳转到余额查询
     * 没有授信时跳转到授信页
     * */
    * getApplyVerify({ payload }, { call, put }) {
      const { code } = yield call(services.getApplyVerify, payload)
      if (code === 201) {
        yield put(routerRedux.push('/financeLoan/accountBalance/detail'))
        return
      }
      yield put(routerRedux.push('/financeLoan/supplierCreditAudit'))
    },
  },
  reducers: {
  },
})
