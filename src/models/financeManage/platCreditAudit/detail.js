import pathToRegexp from 'path-to-regexp'
import { modelExtend, getServices } from '../../../utils'

const services = getServices({
  getDetail: '/finance/loan-apply/credit-mgmt/credit-detail',
})
const initalState = {
  detail: {},
}
export default modelExtend({
  namespace: 'platCreditDetail',
  state: initalState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const { pathname } = location
        const match = pathToRegexp('/financeManage/platCreditAudit/detail/:id').exec(pathname)
        if (match) {
          dispatch({ type: 'app/queryAddress' })
          const creditId = match[1]
          if (history.action !== 'POP') {
            dispatch({ type: 'updateState', payload: initalState })
          }
          dispatch({ type: 'queryData', payload: { creditId } })
        }
      })
    },
  },
  effects: {
    * queryData({ payload }, { call, update }) {
      const { content } = yield call(services.getDetail, { ...payload })
      yield update({ detail: content })
    },
  },
  reducers: {},
})
