import pathToRegexp from 'path-to-regexp'
import { message } from 'antd'
import { modelExtend, getBasicFn } from '../../../utils'
import orderRateService from '../../../services/purchaseManage/orderRate'

const initialState = {
  supplierInfo: {},
  formId: '',
}
const { dispatchUrl } = getBasicFn({ namespace: 'orderRate' })

export default modelExtend({
  namespace: 'orderRate',
  state: initialState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const match = pathToRegexp('/purchaseManage/purchaseOrder/rate/:id').exec(pathname)
        if (match) {
          dispatch({ type: 'updateState', payload: { formId: match[1] } })
          dispatch({ type: 'getSupplierInfo', payload: { formId: match[1] } })
        }
      })
    },
  },
  effects: {
    // 获取供应商的基本信息
    * getSupplierInfo({ payload }, { call, update }) {
      const { content } = yield call(orderRateService.supplierInfoApi, { ...payload })
      yield update({ supplierInfo: content })
    },
    * saveAppraise({ payload }, { call }) {
      yield call(orderRateService.saveAppraiseApi, { ...payload })
      message.success('评价成功!')
      yield dispatchUrl({ pathname: '/purchaseManage/purchaseOrder' })
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload }
    },
  },
})
