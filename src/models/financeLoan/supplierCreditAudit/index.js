import { modelExtend, getServices } from '../../../utils'

const services = getServices({
  getDetail: '/finance/loan-apply/credit-mgmt/credit-history',
  submitInfo: '/finance/loan-apply/credit-mgmt/credit-submit',
})
const initalState = {
  detail: {},
  currentFileList: [],
  viewModel: undefined,
}
export default modelExtend({
  namespace: 'creditManage',
  state: initalState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const { pathname } = location
        if (pathname === '/financeLoan/supplierCreditAudit') {
          if (history.action !== 'POP') {
            dispatch({ type: 'updateState', payload: initalState })
          }
          // 获取地址
          dispatch({ type: 'app/queryAddress' })
          dispatch({ type: 'queryData' })
        }
      })
    },
  },
  effects: {
    * queryData(_, { call, update }) {
      const { content } = yield call(services.getDetail)
      yield update({ viewModel: content.creditApplyExistFlag })
      let currentFileList = []
      if (content.applyDataName) {
        currentFileList = [
          {
            uid: 1,
            name: content.applyDataName,
            status: 'done',
            url: content.applyDataUrl,
          },
        ]
      }
      yield update({ detail: content, currentFileList })
    },
    * submitInfo({ payload }, { call, put }) {
      yield call(services.submitInfo, { ...payload })
      yield put({ type: 'queryData' })
    },
  },
  reducers: {},
})
