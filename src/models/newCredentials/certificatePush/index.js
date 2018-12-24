import modelExtend from '../../../utils/modelExtend'
import { getServices } from '../../../utils'

const services = getServices({
  list: '/certificate/supplier/register/push/statistics',
})
const initState = {
  data: [],
  pagination: {
    current: 1,
    pageSize: 10,
    total: undefined,
  },
  searchParams: {},
  searchSaveParams: {},
}

export default modelExtend({
  namespace: 'certificatePush',
  state: initState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/newCredentials/certificatePush') {
          if (history.action !== 'POP') {
            // 初始化数据
            dispatch({ type: 'updateState', payload: initState })
          }
          dispatch({ type: 'getData' })
        }
      })
    },
  },
  effects: {
    * getData({ payload }, { select, call, update }) {
      const { pagination, searchParams } = yield select(({ certificatePush }) => certificatePush)
      const params = { ...pagination, ...searchParams, ...payload }
      const {
        content: { data, current, total, pageSize },
      } = yield call(services.list, { ...params })
      yield update({ data, pagination: { current, total, pageSize } })
    },
  },
  reducers: {},
})
