import { modelExtend, getServices } from '@utils'
import { namespace, GET_STATISTICS, GET_ORDER, INITIAL_SEARCH_PARAM } from '@shared/home/board'

const services = getServices({
  [GET_STATISTICS]: '/watchboard/statistics/all',
  [GET_ORDER]: '/watchboard/statistics/order',
})

const initialState = {
  todoList: [],
  graph: [],
  amount: {},
  order: {},
  qty: {},
  ...INITIAL_SEARCH_PARAM,
}

export default modelExtend({
  namespace,

  state: initialState,

  subscriptions: {},

  effects: {
    * [GET_STATISTICS](_, { call, update }) {
      const { content } = yield call(services[GET_STATISTICS])
      yield update({ todoList: content })
    },
    * [GET_ORDER]({ payload }, { call, select, update, put }) {
      yield update(payload)
      const { formType, endDate, statisticsType, startDate } = yield select(
        store => store[namespace],
      )
      const { content: { graph, amount, order, qty } } = yield call(services[GET_ORDER], {
        formType,
        endDate: endDate.format('YYYY-MM-DD'),
        statisticsType,
        startDate: startDate.format('YYYY-MM-DD'),
      })
      yield update({ amount, order, qty })
      yield put({ type: 'getGraphSuccess', payload: graph })
    },
  },

  reducers: {
    getGraphSuccess(state, { payload }) {
      const graph = payload.map(item => ({ ...item, value: Number(item.value) }))
      return { ...state, graph }
    },
  },
})
