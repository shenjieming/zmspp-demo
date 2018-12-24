import pathToRegexp from 'path-to-regexp'
import { modelExtend } from '../../../utils'
import {
  queryDeliveryDetail,
  printCheckOrder,
} from '../../../services/purchaseManage/deliveryOrder'

const initState = {
  formId: '',
  detailPageData: {},
  wrapData: [],
}

export default modelExtend({
  namespace: 'purchaseDeliveryDetail',
  state: initState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const { pathname } = location
        const match = pathToRegexp(
          '/businessQuery/purchaseOrderQuery/detail/:id/deliveryDetail/:id',
        ).exec(pathname)
        if (match) {
          const formId = match[2]
          dispatch({ type: 'updateState', payload: initState })
          dispatch({ type: 'updateState', payload: { formId } })
          dispatch({ type: 'queryDeliveryDetail' })
        }
      })
    },
  },
  effects: {
    // 获取配送单详情
    * queryDeliveryDetail({ payload }, { call, update, select }) {
      const { formId, saleType, distributorType } = yield select(
        ({ purchaseDeliveryDetail }) => purchaseDeliveryDetail,
      )
      const { content } = yield call(queryDeliveryDetail, {
        ...payload,
        formId,
        saleType,
        distributorType,
      })
      yield update({
        wrapData: content.data,
        detailPageData: content,
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
