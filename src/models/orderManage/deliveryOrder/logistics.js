import { modelExtend } from '../../../utils'
import { queryLogisticsMsg } from '../../../services/orderManage/deliveryOrder'

const initState = {
  formId: '',
  deliverCompanyCode: '',
  currentPageData: {},
  logisticsList: [],
}

export default modelExtend({
  namespace: 'logistics',
  state: initState,
  subscriptions: {},
  effects: {
    // 获取物流信息
    * queryLogisticsMsg(action, { call, update, select }) {
      const { formId } = yield select(({ logistics }) => logistics)
      const { content: currentPageData } = yield call(queryLogisticsMsg, { formId })
      const { traces: logisticsList } = currentPageData
      yield update({ logisticsList, currentPageData })
    },
  },
  reducers: {},
})
