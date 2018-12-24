import { message } from 'antd'
import pathToRegexp from 'path-to-regexp'
import { find } from 'lodash'
import { modelExtend, getServices } from '../../../utils'

const services = getServices({
  customerList: { url: '/account/vip/list', type: 'post' },
  createOrder: '/account/vip/add-order',
  getPurchasedOrder: '/account/vip/pay-list',
})
const initState = {
  customerListData: [], // 客户列表数据
  selectedCustomer: {}, // 选中的医院
  selectedCombination: {
    id: '1',
    serviceAmount: '175',
    serviceMth: '3',
  }, // 选中的套餐,默认三个月的
  combinations: [
    // 套餐列表
    {
      id: '1',
      serviceAmount: '175',
      serviceMth: '3',
    },
    {
      id: '2',
      serviceAmount: '349',
      serviceMth: '6',
    },
    {
      id: '3',
      serviceAmount: '525',
      serviceMth: '9',
    },
    {
      id: '4',
      serviceAmount: '698',
      serviceMth: '12',
    },
  ],
  purchasedVips: [], // 单据列表数据
  initCustomerId: '', // url带入的Id
  createdOrderNo: '',
}

export default modelExtend({
  namespace: 'vipPage',
  state: initState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const match = pathToRegexp('/vipPage/:id').exec(pathname)
        if (pathname === '/vipPage' || match) {
          if (history.action !== 'POP') {
            dispatch({ type: 'updateState', payload: { ...initState } })
          }
          dispatch({ type: 'updateState', payload: { initCustomerId: match ? match[1] : '' } })
          dispatch({ type: 'getCustomerData' })
        }
      })
    },
  },
  effects: {
    // 客户列表
    * getCustomerData(_, { call, update, put }) {
      const { content } = yield call(services.customerList)
      yield update({ customerListData: content })
      yield put({ type: 'setChoosedCustomer' })
      if (content[0]) {
        yield update({ selectedCustomer: content[0] })
      }
    },
    // 获取已购订单
    * getPurchasedOrder(_, { call, update }) {
      const { content } = yield call(services.getPurchasedOrder)
      yield update({ purchasedVips: content })
    },
    // 创建订单
    * buyCombination(_, { call, select, update }) {
      const { selectedCustomer, selectedCombination } = yield select(({ vipPage }) => vipPage)
      const { content } = yield call(services.createOrder, {
        ...selectedCustomer,
        ...selectedCombination,
      })
      message.success('下单成功')
      yield update({ type: 'updateState', successVisible: true, createdOrderNo: content })
    },
  },
  reducers: {
    resetCombination(state) {
      return { ...state, selectedCombination: initState.selectedCombination }
    },
    setChoosedCustomer(state) {
      const customerListData = state.customerListData
      const selectedCustomer =
        find(customerListData, item => item.hplId === state.initCustomerId) || {}
      return { ...state, selectedCustomer }
    },
  },
})
