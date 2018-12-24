import pathToRegexp from 'path-to-regexp'
import { modelExtend, getServices } from '../../../utils'

const services = getServices({
  getDetail: { url: '/stock-in/list/customer/detail', type: 'get' },
})

const initState = {
  detailData: {},
  tableData: [],
}

export default modelExtend({
  namespace: 'stockInQueryDetail',
  state: initState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const match = pathToRegexp('/vipService/stockInQuery/detail/:id').exec(pathname)
        if (match) {
          if (history.action !== 'POP') {
            dispatch({ type: 'updateState', payload: { ...initState } })
          }
          dispatch({ type: 'getDetail', payload: { formId: match[1] } })
        }
      })
    },
  },
  effects: {
    // 加载列表数据
    * getDetail({ payload }, { call, update }) {
      const {
        content: { main, items },
      } = yield call(services.getDetail, payload)
      yield update({ detailData: main, tableData: items })
    },
  },
  reducers: {},
})
