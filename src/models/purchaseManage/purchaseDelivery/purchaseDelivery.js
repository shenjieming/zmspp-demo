import qs from 'qs'
import { cloneDeep } from 'lodash'
import { modelExtend, transformMomentToString } from '../../../utils'
import {
  queryDeliveryList,
  querySupplierOPList,
  printCheckOrder,
} from '../../../services/purchaseManage/deliveryOrder'

const handleData = (data) => {
  const copyData = cloneDeep(data)
  if (data.supplierOrgId && data.supplierOrgId.key) {
    copyData.supplierOrgId = data.supplierOrgId.key
  }
  return transformMomentToString(copyData)
}
const initState = {
  supplierOPList: [],
  deliveryOrderList: [],
  pagination: {
    current: 1,
    pageSize: 10,
    total: null,
  },
  searchParam: {},
  printModalVisible: false,
  printList: [],
  printDetailData: {},
  detailPageData: {},
}

export default modelExtend({
  namespace: 'purchaseDelivery',
  state: initState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const { search, pathname } = location
        const query = qs.parse(search, { ignoreQueryPrefix: true })
        if (pathname === '/purchaseManage/deliveryOrder') {
          if (history.action !== 'POP') {
            dispatch({ type: 'updateState', payload: initState })
          }
          if (query.formStatus) {
            dispatch({ type: 'updateState', payload: { searchParam: query } })
          }
          dispatch({ type: 'queryDeliveryList' })
          dispatch({ type: 'querySupplierOPList' })
        }
      })
    },
  },
  effects: {
    // 获取配送单列表
    * queryDeliveryList({ payload }, { call, update, select }) {
      const { searchParam, pagination } = yield select(({ purchaseDelivery }) => purchaseDelivery)
      const { content: { total, current, pageSize, data: deliveryOrderList } } = yield call(
        queryDeliveryList,
        { ...handleData(searchParam), ...pagination, ...payload },
      )
      yield update({
        pagination: { total, current, pageSize },
        deliveryOrderList,
      })
    },
    // 获取供应商下拉列表
    * querySupplierOPList({ payload }, { call, update }) {
      const { content } = yield call(querySupplierOPList, payload)
      yield update({
        supplierOPList: content,
      })
    },
    // 获取验收单详情(打印)
    * printCheckOrder({ payload }, { call, update }) {
      yield update({
        printModalVisible: true,
      })
      const { content } = yield call(printCheckOrder, payload)
      if (content) {
        yield update({
          printList: content.items,
          printDetailData: content,
        })
      } else {
        yield update({
          printList: [],
          printDetailData: {},
        })
      }
    },
  },
  reducers: {},
})
