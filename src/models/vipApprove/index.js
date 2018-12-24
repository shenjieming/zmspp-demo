import { message } from 'antd'
import { modelExtend, getServices } from '../../utils/index'

const services = getServices({
  getDataApi: 'account/vip/order/list',
  getOrderDetail: { url: '/account/vip/order/detail', type: 'get' },
  approveOrder: '/account/vip/order/audit',
})
const initState = {
  tableData: [],
  pagination: {
    pageSize: 10,
    current: 1,
    total: null,
  },
  searchParams: {
    status: '1',
  },
  modalVisible: false,
  modalType: 'view',
  orderDetail: {},
}

export default modelExtend({
  namespace: 'vipApprove',
  state: initState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/vipApprove') {
          if (history.action !== 'POP') {
            dispatch({ type: 'updateState', payload: { ...initState } })
          }
          dispatch({ type: 'getData' })
        }
      })
    },
  },
  effects: {
    // 加载列表数据
    * getData({ payload }, { select, call, update }) {
      const { pagination, searchParams } = yield select(({ vipApprove }) => vipApprove)
      const param = { ...pagination, ...searchParams, ...payload }
      const {
        content: { data, current, pageSize, total },
      } = yield call(services.getDataApi, param)
      yield update({ tableData: data, pagination: { current, pageSize, total } })
    },
    // 获取订单详情
    * getOrderDetail({ payload }, { call, update }) {
      const { content } = yield call(services.getOrderDetail, { ...payload })
      yield update({ orderDetail: content })
    },
    // 审核订单
    * approveOrder({ payload }, { call, select, update, put }) {
      const {
        orderDetail: { orderId, serviceMth },
      } = yield select(({ vipApprove }) => vipApprove)
      yield call(services.approveOrder, { ...payload, orderId, serviceMth })
      message.success('审核成功!')
      yield update({ modalVisible: false })
      yield put({ type: 'getData' })
    },
  },
  reducers: {},
})
