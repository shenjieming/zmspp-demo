import qs from 'qs'
import { cloneDeep } from 'lodash'
import { modelExtend, transformMomentToString } from '../../../utils'
import {
  queryDeliveryList,
  queryDeliveryDetail,
  queryCustomerOPList,
  getTableColumns,
  againDeliver,
  getLogistInfoData, // 获取物流信息
  updateLogistInforData, // 修改物流信息
  deliveryCompanyApi, // 物流公司
} from '../../../services/orderManage/deliveryOrder'

const handleData = (data) => {
  const copyData = cloneDeep(data)
  if (data.customerOrgId && data.customerOrgId.key) {
    copyData.customerOrgId = data.customerOrgId.key
  }
  return transformMomentToString(copyData)
}
const initState = {
  customerOPList: [], // 客户下拉
  deliveryOrderList: [],
  pagination: {
    current: 1,
    pageSize: 10,
    total: null,
  },
  searchParam: {},
  printModalVisible: false,
  wrapData: [],
  detailPageData: {},
  personalColumns: [], // 配送单个性化列表

  againDeliverVisible: false, // 再次发货弹框
  againDeliverDetail: {}, // 再次发货详情

  logistDetailVisible: false, // 物流信息弹框
  logistDetail: {}, // 物流详情
  deliveryCompanies: [], // 物流公司
  currentForm: {},
}

export default modelExtend({
  namespace: 'deliveryOrder',
  state: initState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const { search, pathname } = location
        const query = qs.parse(search, { ignoreQueryPrefix: true })
        if (pathname === '/orderManage/deliveryOrder') {
          if (history.action !== 'POP') {
            dispatch({ type: 'updateState', payload: initState })
          }
          if (query.formStatus) {
            dispatch({ type: 'updateState', payload: { searchParam: query } })
          }
          dispatch({ type: 'queryDeliveryList' })
          dispatch({ type: 'queryCustomerOPList' })
          // 获取物流公司
          dispatch({ type: 'fetchDeliveryCompany' })
          dispatch({
            type: 'updateState',
            payload: {
              againDeliverVisible: false,
              againDeliverDetail: {},
            },
          })
        }
      })
    },
  },
  effects: {
    // 获取配送单列表
    * queryDeliveryList({ payload }, { call, update, select }) {
      const { searchParam, pagination } = yield select(({ deliveryOrder }) => deliveryOrder)
      const {
        content: { total, current, pageSize, data: deliveryOrderList },
      } = yield call(queryDeliveryList, { ...handleData(searchParam), ...pagination, ...payload })
      yield update({
        pagination: { total, current, pageSize },
        deliveryOrderList,
      })
    },

    // 获取配送单详情(打印)
    * queryDeliveryDetail({ payload }, { call, update, put, select }) {
      yield update({
        printModalVisible: true,
      })
      const { content } = yield call(queryDeliveryDetail, payload)
      yield update({
        wrapData: content.data,
        detailPageData: content,
      })
      return content
    },
    // 获取客户下拉列表
    * queryCustomerOPList({ payload }, { call, update }) {
      const { content } = yield call(queryCustomerOPList, payload)
      yield update({
        customerOPList: content,
      })
      return content
    },
    // 获取用户个性化需求
    * getTableColumns({ payload }, { call, update }) {
      const { content } = yield call(getTableColumns, payload)
      yield update({
        personalColumns: content || [],
      })
    },
    // 再次发货
    * againDeliver({ payload }, { call, update }) {
      const { content } = yield call(againDeliver, payload)
      yield update({
        againDeliverDetail: content,
      })
      return content
    },
    // 获取物流信息
    * getLogistInfo({ payload }, { call, update }) {
      const { content } = yield call(getLogistInfoData, payload)
      yield update({
        logistDetail: content,
      })
    },

    // 提交物流信息
    * saveLogistInfo({ payload }, { call }) {
      yield call(updateLogistInforData, payload)
    },
    // 物流公司
    * fetchDeliveryCompany(_, { call, update }) {
      const { content } = yield call(deliveryCompanyApi)
      yield update({ deliveryCompanies: content })
    },

    * update({ payload }, { update, put }) {
      yield update({
        ...payload,
      })
      yield put({
        type: 'queryDeliveryList',
      })
    },
  },
  reducers: {},
})
