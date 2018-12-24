import { modelExtend, getServices } from '../../../utils'

const services = getServices({
  getData: '/finance/loan-audit/credit-mgmt/list-page',
})
const initalState = {
  data: [],
  searchParam: {},
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
  },
}
export default modelExtend({
  namespace: 'bankCreditAudit',
  state: initalState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const { pathname } = location
        if (pathname === '/financeAudit/bankCreditAudit') {
          if (history.action !== 'POP') {
            dispatch({ type: 'updateState', payload: initalState })
          }
          dispatch({ type: 'queryData' })
        }
      })
    },
  },
  effects: {
    * queryData(_, { call, select, update }) {
      const { pagination, searchParam } = yield select(({ bankCreditAudit }) => bankCreditAudit)
      const param = {
        ...pagination,
        ...searchParam,
        applyOrgId: searchParam.applyOrgId && searchParam.applyOrgId.key,
      }
      const { content: { data, current, pageSize, total } } = yield call(services.getData, {
        ...param,
      })
      yield update({ data, pagination: { current, pageSize, total } })
    },
    * searchLoan({ payload }, { call, update }) {
      const param = { ...payload, applyOrgId: payload.applyOrgId && payload.applyOrgId.key }
      const { content: { data, current, pageSize, total } } = yield call(services.getData, {
        ...param,
      })
      yield update({ data, pagination: { current, pageSize, total } })
      yield update({ searchParam: payload })
    },
    * pageChange({ payload }, { call, update }) {
      const { content: { data, current, pageSize, total } } = yield call(services.getData, {
        ...payload,
      })
      yield update({ data, pagination: { current, pageSize, total } })
    },
  },
  reducers: {},
})
