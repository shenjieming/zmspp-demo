import { modelExtend, getServices } from '../../../utils'
import windowNewOpen from '../../../shared/windowNewOpen'


const services = getServices({
  // 查询余额
  getBalanceDetailData: 'finance/out-cash/amount/submit-detail',
  // 提交申请
  submitApplyData: 'finance/out-cash/amount/out',
})
const initalState = {
  accountDetail: {}, // 账户详情
}
export default modelExtend({
  namespace: 'accountApply',
  state: initalState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const { pathname } = location
        if (pathname === '/financeLoan/accountBalance/detail') {
          if (history.action !== 'POP') {
            dispatch({ type: 'updateState', payload: initalState })
          }
          dispatch({
            type: 'getBalanceDetail',
          })
        }
      })
    },
  },
  effects: {
    // 查询余额
    * getBalanceDetail({ payload }, { call, update }) {
      const { content } = yield call(services.getBalanceDetailData, payload)
      yield update({
        accountDetail: content,
      })
    },
    * submitApply({ payload }, { call }) {
      const { content } = yield call(services.submitApplyData, payload)
      if (content) {
        windowNewOpen(content)
      }
    },
  },
  reducers: {
  },
})
