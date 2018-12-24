import { message } from 'antd'
import { modelExtend, getServices } from '../../../utils'

const services = getServices({
  getDataApi: '/payable/list/customer',
  customerList: { url: '/account/vip/list', type: 'post' },
  getVipStatus: '/account/vip/ispay',
})
const initState = {
  customerListData: [],
  selectedCustomer: {}, // 选中的医院Id
  tableData: [], // 单据列表数据
  pagination: {
    // 翻页信息
    pageSize: 10,
    current: 1,
    total: null,
  },
  searchParams: {}, // 搜索参数
  searchParamsSave: {},
  vipStatus: {},
  keywords: '',
}

export default modelExtend({
  namespace: 'paymentQuery',
  state: initState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/vipService/paymentQuery') {
          if (history.action !== 'POP') {
            dispatch({ type: 'updateState', payload: { ...initState } })
          }
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
      if (content[0]) {
        yield update({ selectedCustomer: content[0] })
        yield put({ type: 'getVipStatus' })
      }
    },
    // 获取vip状态
    * getVipStatus(_, { select, call, update, put }) {
      const {
        selectedCustomer: { hplId },
      } = yield select(({ paymentQuery }) => paymentQuery)
      const { content } = yield call(services.getVipStatus, { hplId })
      yield update({ vipStatus: content })
      const { status } = content
      if (status === 2 || status === 3) {
        yield put({ type: 'getData', payload: { customerOrgId: hplId } })
      }
    },
    // 加载列表数据
    * getData({ payload }, { select, call, update }) {
      const {
        pagination,
        searchParams,
        selectedCustomer: { hplId },
      } = yield select(({ paymentQuery }) => paymentQuery)
      const param = { ...pagination, ...searchParams, ...payload, customerOrgId: hplId }
      const {
        content: { data, current, pageSize, total },
      } = yield call(services.getDataApi, param)
      yield update({ tableData: data, pagination: { current, pageSize, total } })
    },
    // 添加角色
    * addOne({ payload }, { call, put }) {
      yield call(services.addOneApi, { ...payload })
      message.success('操作成功')
      yield put({ type: 'showOrHideModal', payload: { addModalVisible: false } })
      yield put({ type: 'getData', payload: { ...initState } })
    },
  },
  reducers: {
    resetSearchParams(state) {
      return {
        ...state,
        searchParams: initState.searchParams,
        searchParamsSave: initState.searchParamsSave,
      }
    },
  },
})
