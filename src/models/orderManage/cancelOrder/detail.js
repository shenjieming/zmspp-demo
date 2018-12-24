import pathToRegexp from 'path-to-regexp'

import { modelExtend, getServices } from '../../../utils'

const services = getServices({
  getOrderDetail: '/return-order/supplier/detail',
})
const initialState = {
  orderBean: {
    // 基本信息
    baseInfo: {},
    // 原始单据信息
    intranetFormInfo: {},
    // 退货列表
    returnItemList: [],
    // 操作列表
    operationItemList: [],
  },
  printVisible: false,
  collapseStatus: false,
}

export default modelExtend({
  namespace: 'cancelDetail',
  state: initialState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const match = pathToRegexp('/orderManage/cancelOrder/detail/:id').exec(pathname)
        if (match) {
          dispatch({ type: 'updateState', payload: { ...initialState } })
          dispatch({ type: 'getOrderDetail', payload: { formId: match[1] } })
        }
      })
    },
  },
  effects: {
    // 订单详情
    * getOrderDetail({ payload }, { call, update }) {
      const { content } = yield call(services.getOrderDetail, { ...payload })
      yield update({ orderBean: content })
    },
  },
})
