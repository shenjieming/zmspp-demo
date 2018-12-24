import { message } from 'antd'
import pathToRegexp from 'path-to-regexp'
import { cloneDeep } from 'lodash'
import { modelExtend } from '../../../utils'
import {
  getDeliveryDetail,
  updateInvoice,
  voidDelivery,
  getTableColumns,
  getTabPrintData,
} from '../../../services/orderManage/deliveryOrder'

const initState = {
  formId: '',
  customerOrgId: '',
  detailPageData: {},
  detailPageDataCopy: {}, // 详情拷贝用于打印
  wrapData: [],
  invoiceUpdateList: [],
  printModalVisible: false,
  personalColumns: [], // 配送单个性化列表
  batchAddInviteVisible: false, // 批量维护发票信息弹窗可见

  tabPrintModalVisible: false, // 标签打印弹框
  tabPrintType: 1, // 默认标签纸打印 1 为标签纸 2 为A4纸
  tabPrintPagination: {
    current: 1,
    pageSize: 100,
  }, // 标签打印翻页数据
  tabPrintData: [], // 标签打印数据
}

export default modelExtend({
  namespace: 'deliveryDetail',
  state: initState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const { pathname } = location
        const match = pathToRegexp('/orderManage/deliveryOrder/deliveryDetail/:id').exec(pathname)
        if (match) {
          const formId = match[1]
          dispatch({ type: 'updateState', payload: initState })
          dispatch({ type: 'updateState', payload: { formId } })
          dispatch({ type: 'queryDeliveryDetail' })
        }
      })
    },
  },
  effects: {
    // 获取配送单详情
    * queryDeliveryDetail({ payload }, { call, update, select, put }) {
      const { formId, saleType, distributeType } = yield select(
        ({ deliveryDetail }) => deliveryDetail,
      )
      const { content } = yield call(getDeliveryDetail, {
        ...payload,
        formId,
        saleType,
        distributeType,
      })
      const { customerOrgId, data } = content
      const empty = []
      for (const item of data) {
        empty.push(...item.items)
      }
      yield update({
        invoiceUpdateList: empty,
        customerOrgId,
        wrapData: content.data,
        detailPageData: content,
        detailPageDataCopy: cloneDeep(content),
      })

      yield put({
        type: 'app/getPersonalityConfig',
        payload: {
          orgId: content.barcodeCustomerOrgId,
        },
      })
    },
    // 发票补录，确认开票
    * updateInvoice({ payload }, { put, call, select }) {
      const { invoiceUpdateList, formId, customerOrgId } = yield select(
        ({ deliveryDetail }) => deliveryDetail,
      )
      yield call(updateInvoice, {
        ...payload,
        formId,
        customerOrgId,
        invoiceInfos: invoiceUpdateList,
      })
      message.success('操作成功')
      yield put({ type: 'queryDeliveryDetail' })
    },
    // 作废配送单
    * voidDelivery({ payload }, { call, select }) {
      const { formId } = yield select(({ deliveryDetail }) => deliveryDetail)
      yield call(voidDelivery, { ...payload, formId })
      message.success('已作废')
    },
    // 获取用户个性化需求
    * getTableColumns({ payload }, { call, update, select }) {
      const { deliveryPrintDynamicConfigFlag } = yield select(({ app }) => app.personalityConfig)

      if (deliveryPrintDynamicConfigFlag) {
        const { content } = yield call(getTableColumns, payload)
        yield update({
          personalColumns: content || [],
        })
      }
    },

    // 获取打印标签
    * getTabPrintData({ payload }, { call, update }) {
      const { content } = yield call(getTabPrintData, payload)
      yield update({
        tabPrintData: content.data,
        tabPrintPagination: {
          current: content.current,
          pageSize: content.pageSize,
          total: content.total,
        },
      })
    },

  },
  reducers: {
    batchAddInvite(state, { payload }) {
      const { invoiceNo, invoiceDate } = payload
      const { wrapData } = state
      const invoiceUpdateList = []
      const newData = wrapData.map((group) => {
        const items = group.items
        const newItems = items.map((item) => {
          const newItem = { ...item, invoiceNo, invoiceDate }
          invoiceUpdateList.push(newItem)
          return newItem
        })
        return { ...group, items: newItems }
      })
      return {
        ...state,
        invoiceUpdateList,
        wrapData: newData,
      }
    },
  },
})
