import { modelExtend, getServices } from '../../utils'

const services = getServices({
  queryData: '/hcapi/watchboard',
})
const initalState = {
  data: [],
  currentData: {
    status: [],
  },
}
export default modelExtend({
  namespace: 'accountBoard',
  state: initalState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const { pathname } = location
        if (pathname === '/provinceControl/accountBoard') {
          if (history.action !== 'POP') {
            dispatch({ type: 'updateState', payload: initalState })
          }
          dispatch({ type: 'queryData' })
        }
      })
    },
  },
  effects: {
    * queryData(_, { call, put, update }) {
      const { content } = yield call(services.queryData)
      yield update({ data: content })
      if (content.length > 0) {
        yield put({ type: 'setCurrentData', payload: { periodNo: content[0].periodNo } })
      }
    },
  },
  reducers: {
    setCurrentData(state, { payload }) {
      const targetItem = state.data.filter(item => item.periodNo === payload.periodNo)[0]
      return { ...state, currentData: targetItem }
    },
  },
})
