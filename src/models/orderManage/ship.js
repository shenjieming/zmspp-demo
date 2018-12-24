import { message } from 'antd'
import { isPlainObject, defaults, trim, isEmpty } from 'lodash'
import { parse } from 'qs'
import modelExtend from '../../utils/modelExtend'
import { getServices } from '../../utils'
import { queryDeliveryDetail } from '../../services/orderManage/deliveryOrder'

const namespace = 'ship'

const services = getServices({
  // 获取总代
  getAgents: { url: '/surgery-deliver/distributor-option', type: 'get' },
  // 获取客户
  getCustomers: { url: '/surgery-deliver/customer-option', type: 'get' },
  // 获取科室
  getDepts: 'delivery/withTable/dept',
  // 扫描条码
  scanBarcode: 'delivery/scan/barcode/other',
  // 扫描条码(分销模式)
  scanBarcodeDistribute: '/delivery/scan/barcode/other/dispatch',
  // 发货
  delivery: 'delivery/withtable/save',
  // 暂存
  tempsave: 'delivery/withtable/tempsave',
  // 获取暂存信息
  getTempInfo: 'delivery/withTable/info',
  // 获取注册证
  getCertificate: 'sender/register/certificate/option/list',
  // 获取配送单个性化配置
  getTableColumns: { url: 'base/print/config/deliver', type: 'get' },
  // 获取分销模式
  getDistributeType: '/distribute-customer/get-distribute-type',

  // 再次发货获取 总代商 客户名称 接收科室
  againTempQuery: '/deliver/order/temp-query',
})

const initialState = {
  // 总代列表
  agents: [],
  // 客户列表
  customers: [],
  // 科室
  depts: [],
  // 发货明细
  items: [],
  // 配送信息对象
  distribute: undefined,
  // 客户信息对象
  customer: undefined,
  // 客户列表对象：另有是否管控证件，orderType
  customerData: undefined,
  // 是否全屏
  isFullScreen: false,
  // 主码
  mainCode: false,
  // 打印数据
  printDetails: {
    data: [],
  },
  // 打印modal
  printVisible: false,
  // 注册证自动补全
  certificateNos: [],
  // 当前扫描行的barcode
  curBarcode: undefined,
  // 个性化表头
  personalColumns: [],
  // 重复的物资码列表
  modalVisible: false, // 重复弹框
  barcodeList: [], // 重复弹框列表
  // 暂存单 iD
  tempFormId: undefined,
  distributeType: 1, // 分销模式，1-代配 2-分销，在选择客户的时候更新

  againTempData: {}, // 再次发货获取 总代商 客户名称 接收科室
}

export default modelExtend({
  namespace,

  state: initialState,

  subscriptions: {
    setup({ history, dispatch }) {
      history.listen(({ pathname, search }) => {
        if (pathname === '/orderManage/ship') {
          const data = parse(search, { ignoreQueryPrefix: true })

          /**
           * @desc 订单管理中的配送单作废单再次发货
           * 级联选择 调用
           */
          if (!isEmpty(data)) {
            dispatch({ type: 'againTempQuery', payload: data }).then((response) => {
              if (response.customerOrgId) {
                dispatch({
                  type: 'getCustomers',
                  payload: { distributorOrgId: response.customerOrgId, keywords: response.customerOrgName },
                })
                dispatch({
                  type: 'updateState',
                  payload: {
                    distribute: {
                      key: response.generalOrgId,
                    },
                    customer: {
                      label: response.customerOrgName,
                      key: response.customerOrgId,
                    },
                    customerData: {
                      customerOrgId: response.customerOrgId,
                      customerOrgName: response.customerOrgName,
                      orgManagementCertificate: response.orgManagementCertificate,
                    },
                  },
                })
              }

              if (response.receiveOrgId) {
                dispatch({
                  type: 'getDepts',
                  payload: response.receiveOrgId,
                })
              }

              dispatch({
                type: 'getTempSaveInfo',
                payload: {
                  ...response,
                  ...data,
                },
              }).then((content) => {
                if (content) {
                  dispatch({
                    type: 'updateState',
                    payload: { tempFormId: content.formId, items: content.items || [] },
                  })
                } else {
                  dispatch({
                    type: 'updateState',
                    payload: { tempFormId: undefined, items: [] },
                  })
                }
              })
            })
          }
          dispatch({ type: 'reset' })
          dispatch({ type: 'getAgents' })
          dispatch({ type: 'getCustomers' })
        }
      })
    },
  },

  effects: {
    // 获取暂存信息
    * getTempSaveInfo({ payload }, { call }) {
      const { content } = yield call(services.getTempInfo, { ...payload })
      return content
    },
    // 获取总代列表
    * getAgents({ payload }, { call, update, select }) {
      const {
        orgInfo: { orgId },
      } = yield select(({ app }) => app)
      const { content } = yield call(services.getAgents, { carrierOrgId: orgId, ...payload })
      yield update({ agents: content, distribute: { key: orgId, label: '自供' } })
    },
    // 获取客户列表
    * getCustomers({ payload }, { call, update, select }) {
      const {
        orgInfo: { orgId },
      } = yield select(({ app }) => app)
      const { content } = yield call(services.getCustomers, {
        carrierOrgId: orgId,
        distributorOrgId: orgId,
        ...payload,
      })
      yield update({ customers: content })
    },
    // 获取科室列表
    * getDepts({ payload }, { call, update }) {
      const { content } = yield call(services.getDepts, { customerOrgId: payload })
      yield update({ depts: content })
    },
    * getTableColumns(_, { select, call, update }) {
      const {
        printDetails: { barcodeCustomerOrgId },
      } = yield select(({ ship }) => ship)
      const { content } = yield call(services.getTableColumns, {
        orgId: barcodeCustomerOrgId,
      })
      yield update({
        personalColumns: content || [],
      })
    },
    // 扫描条码
    * scanBarcode({ payload }, { call, put, select }) {
      const {
        distributeType,
        distribute: { key: distributorOrgId },
        customerData: { customerOrgId, orgManagementCertificate },
      } = yield select(store => store[namespace])
      const {
        orgInfo: { orgId: selfOrgId },
      } = yield select(({ app }) => app)
      const barcodeCode = trim(payload)
      let response = {}
      if (selfOrgId === distributorOrgId) {
        response = yield call(services.scanBarcode, {
          barcode: barcodeCode,
          customerOrgId: distributorOrgId,
          receiveOrgId: customerOrgId,
          orgManagementCertificate,
        })
      } else {
        response = yield call(services.scanBarcodeDistribute, {
          barcode: barcodeCode,
          customerOrgId: distributorOrgId,
          receiveOrgId: customerOrgId,
          orgManagementCertificate,
          distributeType,
        })
      }
      const { content } = response
      if (!content) {
        message.error('该条码未绑定规则')
        return
      }
      if (content.displayCatalogBarcode && content.displayCatalogBarcode.customCode === 203) {
        yield put({
          type: 'updateState',
          payload: {
            modalVisible: true,
            barcodeList: content.displayCatalogBarcode.useData,
          },
        })
        return
      }
      yield put({ type: 'scanSuccess', payload: { barcodeCode, content } })
    },
    // 获取分销模式
    * getDistributeType({ payload }, { call, update }) {
      const { content } = yield call(services.getDistributeType, payload)
      yield update({ distributeType: content })
    },
    // 发货
    * delivery({ payload }, { select, call, update, put }) {
      const { distributeType } = yield select(({ ship }) => ship)
      const param = {
        ...payload,
        distributeType,
      }
      const { content } = yield call(services.delivery, param)
      yield update({ ...initialState })
      yield put({ type: 'getAgents' })
      yield put({ type: 'getCustomers' })
      // const printDetail = yield put({
      //   type: 'getPrintDetail',
      //   payload: {
      //     formId: content.formId,
      //     saleType: content.saleType,
      //     distributeType: content.distributeType,
      //   },
      // })
      return { ...param, formId: content.formId }
    },
    // 暂存
    * tempSave({ payload }, { call, update }) {
      const { content } = yield call(services.tempsave, payload)
      message.success('暂存成功')
      yield update({
        tempFormId: content.formId,
      })
    },
    // 获取注册证
    * getCertificate({ payload }, { call, select, update }) {
      const { keywords, customerOrgId, idx, orgManagementCertificate } = payload
      const { content } = yield call(services.getCertificate, {
        keywords,
        customerOrgId,
        orgManagementCertificate,
      })
      const certificateNos = yield select(store => store[namespace].certificateNos)
      const temp = [...certificateNos]
      temp[idx] = content
      yield update({ certificateNos: temp })
    },
    * getPrintDetail({ payload }, { call, update }) {
      const { content } = yield call(queryDeliveryDetail, payload)
      yield update({
        printDetails: content,
      })
      return content
    },
    // 再次发货获取 总代商 客户名称 接收科室
    * againTempQuery({ payload }, { call, update }) {
      const { content } = yield call(services.againTempQuery, payload)
      yield update({
        againTempData: content,
      })
      return content
    },
  },

  reducers: {
    // 扫码成功, (包含处理主副码逻辑)
    scanSuccess(state, { payload }) {
      const { mainCode, items } = state
      const { barcodeCode, content } = payload
      const { barcodeType, batchNo, produceDate, expiredDate, trackCode, pscId } = content
      if (barcodeType === 1) {
        if (!pscId) {
          message.error('该条码未绑定物资')
          return { ...state }
        }

        if (batchNo || produceDate || expiredDate || trackCode) {
          message.success('扫描成功')
          let isExist = false
          const mapedItems = items.map((x) => {
            if (x.barcodeCode === barcodeCode) {
              isExist = true
              return { ...x, deliverQty: Number(x.deliverQty) + 1 }
            }
            return x
          })
          if (isExist) {
            return { ...state, items: mapedItems, mainCode: false, curBarcode: barcodeCode }
          }
          const item = { ...content, barcodeCode, deliverQty: 1 }
          delete item.barcodeType
          return {
            ...state,
            items: items.concat(item),
            mainCode: false,
            curBarcode: barcodeCode,
          }
        }
        message.warning('请继续扫描副码')
        return {
          ...state,
          mainCode: { ...content, barcodeCode },
        }
      }
      if (isPlainObject(mainCode)) {
        const scanBarcodeCode = `${mainCode.barcodeCode}##${barcodeCode}`

        message.success('扫描成功')
        let isExist = false
        const mapedItems = items.map((x) => {
          if (x.barcodeCode === scanBarcodeCode) {
            isExist = true
            return { ...x, deliverQty: Number(x.deliverQty) + 1 }
          }
          return x
        })
        if (isExist) {
          return { ...state, items: mapedItems, mainCode: false, curBarcode: barcodeCode }
        }
        const item = defaults({ deliverQty: 1, barcodeCode: scanBarcodeCode }, mainCode, content)
        return {
          ...state,
          items: items.concat(item),
          mainCode: false,
          curBarcode: barcodeCode,
        }
      }
      message.error('请先扫描主码')
      return { ...state }
    },
    // 更新条码明细
    updateItemDetail(state, { payload }) {
      const { barcodeCode, prop, value } = payload
      const { items } = state
      const mapedItems = items.map((x) => {
        if (x.barcodeCode === barcodeCode) {
          return { ...x, [prop]: value }
        }
        return x
      })

      return {
        ...state,
        items: mapedItems,
      }
    },
    // 删除条码
    remove(state, { payload }) {
      const { items } = state
      return {
        ...state,
        items: items.filter(x => payload !== x.barcodeCode),
      }
    },
  },
})
