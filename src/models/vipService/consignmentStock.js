import { modelExtend, getServices } from '../../utils/'

const services = getServices({
  // 寄销库存查询
  getDataApi: 'supplier/exchange/list',
  // 客户自动补全
  customerList: '/account/vip/list',
  // 获取科室
  getDepts: 'delivery/withTable/dept',
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
  searchParams: {
    statisticsType: '1',
  }, // 搜索参数
  searchParamsSave: {},
  vipStatus: {},
  keywords: '',
}

export default modelExtend({
  namespace: 'consignmentStock',

  state: initState,

  subscriptions: {
    setup({ history, dispatch }) {
      history.listen(({ pathname }) => {
        if (pathname === '/vipService/consignmentStock') {
          if (history.action !== 'POP') {
            dispatch({ type: 'reset' })
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
    // 加载列表数据
    * getData({ payload }, { select, call, update }) {
      const {
        pagination,
        searchParams,
        selectedCustomer: { hplId },
      } = yield select(({ consignmentStock }) => consignmentStock)
      const param = { ...pagination, ...searchParams, ...payload, customerOrgId: hplId }
      const {
        content: { data, current, pageSize, total },
      } = yield call(services.getDataApi, param)
      yield update({ tableData: data, pagination: { current, pageSize, total } })
    },
    // 获取科室列表
    * getDepts({ payload }, { call, update }) {
      const { content } = yield call(services.getDepts, payload)
      yield update({ depts: content })
    },
    // 获取vip状态
    * getVipStatus(_, { select, call, update, put }) {
      const {
        selectedCustomer: { hplId },
      } = yield select(({ consignmentStock }) => consignmentStock)
      const { content } = yield call(services.getVipStatus, { hplId })
      yield update({ vipStatus: content })
      const { status } = content
      if (status === 2 || status === 3) {
        yield put({ type: 'getData', payload: { customerOrgId: hplId } })
        yield put({ type: 'getDepts', payload: { customerOrgId: hplId } })
      }
    },
  },

  reducers: {
    reset() {
      return { ...initState }
    },
    resetSearchParams(state) {
      return {
        ...state,
        searchParams: initState.searchParams,
        searchParamsSave: initState.searchParamsSave,
      }
    },
  },
})
