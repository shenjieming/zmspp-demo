import pathToRegexp from 'path-to-regexp'
import { cloneDeep, isEmpty } from 'lodash'
import { message, Modal } from 'antd'
import Decimal from 'decimal.js-light'
import { parse } from 'qs'

import { modelExtend } from '../../../utils'
import orderDeliveryService from '../../../services/orderManage/orderDelivery'

const initialState = {
  orderBean: { data: [] }, // 整个使用的订单详情
  deliveryDetail: { data: [] }, // 配送单详情
  originalOrderBean: {}, // 基本信息时候的备份
  deliveryCompanies: [], // 物流公司
  tempMainCodePsc: undefined, // 主码临时Psc
  tempMainCodeBarcode: '', // 主码临时barcode
  rfidModalData: {}, // rfid数组
  scanResult: {}, // 扫描结果
  deliverType: '1', // 配送方式
  fullScreen: false,
  RFIDvisible: false,
  printPurchaseVisible: false,
  printModalVisible: false,
  allFull: false,
  confirmVisible: false,
  confirmfunc: {},
  personalColumns: [],
  modalVisible: false, // 重复弹框
  barcodeList: [], // 重复弹框列表
  personalMobile: '', // 操作人联系号码
  sameBatch: false,
}

const isSameBatch = (item, payload, dataType) => {
  let isSame = true
  let compareArr
  if (dataType === 'temp') {
    compareArr = [
      'inviteNo',
      'sterilizationNo',
      'sterilizationDate',
      'invoiceNo',
      'invoiceDate',
      'barcode',
      'batchNo',
    ]
  } else {
    compareArr = ['barcode', 'batchNo']
  }
  compareArr.forEach((key) => {
    if (item[key] && item[key] !== payload[key]) {
      isSame = false
    }
  })
  return isSame
}
export default modelExtend({
  namespace: 'orderDelivery',
  state: initialState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname, search }) => {
        const match = pathToRegexp('/orderManage/customerOrder/delivery/:id').exec(pathname)
        if (match) {
          dispatch({ type: 'updateState', payload: { ...initialState } })
          /**
           * @desc 新增作废单再次发货功能 作废单可能会有暂存的信息 但是订单详情没有返回deliverTempFormId
           * 因此只能从路由中获取deliverTempFormId
           */
          const obj = parse(search, { ignoreQueryPrefix: true })
          let againTempFlag = false
          if (!isEmpty(obj)) {
            againTempFlag = true
          }

          dispatch({
            type: 'getOrderDetail',
            payload: {
              formId: match[1],
              againTempFlag,
              deliveryFromId: againTempFlag ? obj.formId : undefined,
            },
          }).then(() => {
            dispatch({ type: 'getTableColumns' })
            if (againTempFlag) {
              dispatch({
                type: 'getTempInfo',
                payload: obj,
              })
            }
          })
          // dispatch({ type: 'getOrderDetail', payload: { formId: match[1] } })
          dispatch({ type: 'fetchDeliveryCompany' })
        }
      })
    },
  },
  effects: {
    // 订单详情
    * getOrderDetail({ payload }, { put, call, update }) {
      const {
        content,
        content: {
          deliverTempFormId,
          orgManagementCertificate,
          saleType,
          customerOrgId,
          barcodeCustomerOrgId,
        },
      } = yield call(orderDeliveryService.orderDetailApi, { ...payload })
      content.data.forEach((item, index) => {
        item.items.forEach((dtem, dindex) => {
          dtem.serial = index
        })
      })
      yield update({ orderBean: content }) // 更新订单详情
      yield put({ type: 'setBarcodeOnly', payload: { orderBean: content } }) // 根据医院科室决定是否只能扫码发货
      yield put({ type: 'app/getPersonalityConfig', payload: { orgId: barcodeCustomerOrgId } }) // 获取机构个性化配置
      const sameBatch = yield call(orderDeliveryService.getAscription, { })
      yield update({ sameBatch: sameBatch.content }) // 更新订单详情
      let params
      if (saleType === 2) {
        params = {
          orgManagementCertificate,
          supplierOrgId: customerOrgId,
          keywords: '',
        }
      } else {
        params = {
          orgManagementCertificate,
          keywords: '',
        }
      }
      // 然后根据是否管控获取注册证数据源
      const { content: certificateList } = yield call(orderDeliveryService.certificateApi, {
        ...params,
        orgManagementCertificate: false,
      })
      // 对每一个item都添加注册证信息
      yield put({ type: 'fillCertificate', payload: { certificateList } })
      // 将返回的信息复制一份，用在添加批次/重置
      yield update({ originalOrderBean: cloneDeep(content) })
      if (deliverTempFormId && !payload.againTempFlag) {
        // 如果有暂存ID的，获取暂存信息
        yield put({ type: 'getTempInfo', payload: { formId: deliverTempFormId } })
      }
    },
    // 获取动态表头
    // * getTableColumns(_, { select, call, update }) {
    //   const {
    //     app: {
    //       personalityConfig: { deliveryPrintDynamicConfigFlag },
    //     },
    //     orderDelivery: {
    //       orderBean: { barcodeCustomerOrgId },
    //     },
    //   } = yield select(({ app, orderDelivery }) => ({ app, orderDelivery }))
    //   if (deliveryPrintDynamicConfigFlag) {
    //     const { content } = yield call(orderDeliveryService.getTableColumns, {
    //       orgId: barcodeCustomerOrgId,
    //     })
    //     yield update({
    //       personalColumns: content || [],
    //     })
    //   }
    // },
    // 异步加载注册证
    * getCertificateList({ payload }, { select, call, put }) {
      const { keywords, itemBean } = payload
      const {
        orderBean: { orgManagementCertificate },
      } = yield select(({ orderDelivery }) => orderDelivery)
      const { content: certificateList } = yield call(orderDeliveryService.certificateApi, {
        orgManagementCertificate: false,
        keywords,
      })
      yield put({ type: 'fillCertificate', payload: { itemBean, certificateList } })
    },
    // 物流公司
    * fetchDeliveryCompany(_, { call, update }) {
      const { content } = yield call(orderDeliveryService.deliveryCompanyApi)
      yield update({ deliveryCompanies: content })
    },
    // 暂存
    * tempSave({ payload }, { select, call, update }) {
      const { orderBean } = yield select(({ orderDelivery }) => orderDelivery)
      const { content } = yield call(orderDeliveryService.tempInfoApi, { ...payload })
      const newOrderBean = Object.assign(orderBean, { deliverTempFormId: content })
      yield update({ orderBean: newOrderBean })
      message.success('暂存成功!')
    },
    // 发货
    * deliverSubmit({ payload }, { select, call, update }) {
      const { orderBean } = yield select(({ orderDelivery }) => orderDelivery)
      const { content } = yield call(orderDeliveryService.deliverSubmitApi, { ...payload })
      const newOrderBean = Object.assign(orderBean, { deliveryFormId: content })
      yield update({ orderBean: newOrderBean })
    },
    // 获取配送详情
    * queryDeliveryDetail({ payload }, { call, update }) {
      const { content } = yield call(orderDeliveryService.getDeliveryDetailApi, { ...payload })
      yield update({ deliveryDetail: content })
    },
    // 获取暂存信息
    * getTempInfo({ payload }, { put, call, update }) {
      const { content } = yield call(orderDeliveryService.getDeliveryDetailApi, { ...payload })
      message.success('获取暂存信息成功!')
      yield put({ type: 'fillTempInfo', payload: content })
      yield update({ deliveryDetail: content, deliverType: String(content.deliverType) })
    },
    // 扫描解析
    * analysisBarcode({ payload }, { select, put, call, update }) {
      const {
        tempMainCodePsc,
        tempMainCodeBarcode,
        orderBean: { barcodeCustomerOrgId },
      } = yield select(({ orderDelivery }) => orderDelivery)
      const { content } = yield call(orderDeliveryService.deliveryBarcodeApi, {
        ...payload,
        barcodeCustomerOrgId,
      })
      // 全，主，副 判断
      const {
        primaryBarcode,
        secondaryBarcode,
        barcodeType,
        pscId,
        batchNo,
        produceDate,
        trackCode,
        expiredDate,
      } = content

      if (content.displayCatalogBarcode && content.displayCatalogBarcode.customCode === 203) {
        message.error(content.displayCatalogBarcode.customMessages)
        yield put({
          type: 'updateState',
          payload: {
            modalVisible: true,
            barcodeList: content.displayCatalogBarcode.useData,
          },
        })
        return
      }
      if (!barcodeType) {
        message.error('未查询到对应条码')
        yield update({
          tempMainCodePsc: undefined,
          tempMainCodeBarcode: '',
          allFull: false,
          scanResult: {},
        })
      } else if (barcodeType === 1 && !pscId) {
        message.error('该条码未绑定物资')
        yield update({
          tempMainCodePsc: undefined,
          tempMainCodeBarcode: '',
          allFull: false,
          scanResult: {},
        })
      } else if (barcodeType === 1) {
        // 类型为主码并且有副码的四个信息，则判断为全码
        if (batchNo || expiredDate || produceDate || trackCode) {
          content.barcode = content.primaryBarcode
          yield put({ type: 'fillInfo', payload: { ...content } })
          const {
            isExist,
            scanResult: { formIndex },
          } = yield select(({ orderDelivery }) => orderDelivery)
          if (isExist) {
            message.success('扫描成功')
          }
          yield update({
            tempMainCodePsc: undefined,
            tempMainCodeBarcode: '',
            scanResult: { ...content, formIndex },
          })
        } else {
          message.warning('请继续扫描副码')
          yield update({
            tempMainCodePsc: pscId,
            tempMainCodeBarcode: primaryBarcode,
            allFull: false,
            scanResult: {},
          })
        }
      } else if (tempMainCodePsc) {
        content.barcode = `${tempMainCodeBarcode}##${secondaryBarcode}`
        yield put({ type: 'fillInfo', payload: { ...content, pscId: tempMainCodePsc } })
        const {
          isExist,
          scanResult: { formIndex },
        } = yield select(({ orderDelivery }) => orderDelivery)
        if (isExist) {
          message.success('扫描成功')
        }
        yield update({
          tempMainCodePsc: undefined,
          tempMainCodeBarcode: '',
          scanResult: { ...content, pscId: tempMainCodePsc, formIndex },
        })
      } else {
        message.error('请先扫描主码')
        yield update({
          tempMainCodePsc: undefined,
          tempMainCodeBarcode: '',
          allFull: false,
          scanResult: {},
        })
      }
    },
    * forceAdd({ payload }, { select, update }) {
      const state = yield select(({ orderDelivery }) => orderDelivery)
      const formList = state.orderBean.data
      let newItem
      formList.every((form, formIndex) => {
        const sameMetrialList = form.items.filter(item => item.pscId === payload.pscId)
        let isSame = false
        let insertIndex = 0
        let indexInSame = 0
        // 如果当前form没有对应物资，continue
        if (sameMetrialList.length === 0) {
          return true
        }
        // 先获取出未有过改动的item
        let originalItem = {}
        const originalList = state.originalOrderBean.data
        form.items.every((item, itemIndex) => {
          // 找到相同物资
          if (item.pscId === payload.pscId) {
            originalList[formIndex].items.every((oItem) => {
              if (oItem.pscId === payload.pscId) {
                originalItem = Object.assign(
                  cloneDeep(oItem),
                  JSON.parse(JSON.stringify(payload)),
                  { deliverQty: 1, materialsPrice: oItem.materialsPrice },
                )
                return false
              }
              return true
            })
            if (isSameBatch(item, payload)) {
              // 直接填充
              isSame = true
              newItem = Object.assign(cloneDeep(item), JSON.parse(JSON.stringify(payload)), {
                deliverQty: item.deliverQty ? item.deliverQty + 1 : 1,
                materialsPrice: item.materialsPrice,
              })
              formList[formIndex].items[itemIndex] = newItem
              state.scanResult = { ...payload, formIndex }
              return false
            }
            insertIndex = itemIndex
            indexInSame += 1
            originalItem.indexInSame = indexInSame
          }
          return true
        })
        if (!isSame) {
          // 插入
          formList[formIndex].items.splice(insertIndex + 1, 0, originalItem)
          state.scanResult = { ...payload, formIndex }
          // 筛选出pscId相同的 在第一个加一个SameNum
          sameMetrialList[0].sameNum = sameMetrialList[0].sameNum
            ? sameMetrialList[0].sameNum + 1
            : 1
        }
        return false
      })
      yield update({ state })
      return newItem
    },
    * getPersonalMobile({ payload }, { call, update }) {
      const { content } = yield call(orderDeliveryService.getPersonalMobile, payload)
      yield update({
        personalMobile: content && content.mobile ? content.mobile : '',
      })
    },
    * fillTempInfo({ payload }, { update, select }) {
      const { orderBean, originalOrderBean } = yield select(({ orderDelivery }) => orderDelivery)
      // 单个的插入方法
      function fillSingleInfo(item, index) {
        let exist = false
        const formList = orderBean.data
        formList[index].items.every((itm) => {
          if (itm.pscId === item.pscId) {
            exist = true
          }
          return true
        })
        if (!exist) {
          // 不存在直接return
          message.error('暂存信息有误!')
          return
        }
        // 否则先获取出未有改动的Item
        let originalItem = {}
        const originalList = originalOrderBean.data
        originalList[index].items.every((itm) => {
          if (itm.pscId === item.pscId) {
            originalItem = Object.assign(cloneDeep(itm), JSON.parse(JSON.stringify(item)))
            // 将原采购单的itemId替换回去
            originalItem.itemId = itm.itemId
            return false
          }
          return true
        })
        // 遍历对应的form
        let isSame = false
        let insertIndex = 0
        let indexInSame = 0
        let firstMatchedItem = null
        let sameNum = 0
        formList[index].items.every((itm, itemIndex) => {
          if (itm.pscId === item.pscId) {
            if (!firstMatchedItem) {
              firstMatchedItem = itm
            }
            if (isSameBatch(itm, item, 'temp')) {
              // 直接填充
              isSame = true
              formList[index].items[itemIndex] = {
                ...cloneDeep(originalItem),
                deliverQty: (itm.deliverQty || 0) + (originalItem.deliverQty || 0) || undefined,
              }
            } else {
              sameNum += 1
              // itm.sameNum = itm.sameNum ? itm.sameNum + 1 : 1
              insertIndex = itemIndex
              indexInSame += 1
            }
            originalItem.indexInSame = indexInSame
          }
          return true
        })
        firstMatchedItem.sameNum = sameNum
        if (!isSame) {
          // 插入
          formList[index].items.splice(insertIndex + 1, 0, originalItem)
        }
      }
      for (let index = 0; index < payload.data.length; index += 1) {
        const items = payload.data[index].items
        for (let itemIndex = 0; itemIndex < items.length; itemIndex += 1) {
          const item = items[itemIndex]
          fillSingleInfo(item, index)
        }
      }
      yield update({})
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload }
    },
    // 填充注册证数据源
    fillCertificate(state, { payload }) {
      const { certificateList, itemBean } = payload
      const formList = state.orderBean.data
      if (itemBean) {
        // 如果有itemBean只对对应的做修改
        formList.every((form) => {
          form.items.every((item) => {
            if (item === itemBean) {
              item.certificateList = certificateList
              return false
            }
            return true
          })
          return true
        })
      } else {
        // 否则全部修改
        formList.every((form) => {
          form.items.every((item) => {
            item.certificateList = certificateList
            return true
          })
          return true
        })
      }
      return { ...state }
    },
    // 判断是否只能扫码发货
    setBarcodeOnly(state, { payload }) {
      const {
        orderBean: { barcodeCustomerOrgId, data },
      } = payload
      const shouldSet = ({ orgId, deptName }) => {
        if (
          orgId === '9395C427D83D4986AB0932A33D1C75BB' &&
          deptName &&
          (deptName.match('门诊化验室') || deptName.match('检验科'))
        ) {
          // 浙二 门诊化验室
          return true
        } else if (
          orgId === 'FFC2C2C944444040A718D018CE2CBC23' &&
          deptName &&
          (deptName.match('生化检验室') || deptName.match('检验科'))
        ) {
          // 杭二滨江
          return true
        } else if (
          orgId === 'ECEB0925E451615AE040007F010003DC' &&
          deptName &&
          deptName.match('中心实验室')
        ) {
          // 杭州市一 中心实验室
          return true
        }
        return false
      }
      if (
        barcodeCustomerOrgId === '9395C427D83D4986AB0932A33D1C75BB' ||
        barcodeCustomerOrgId === 'ECEB0925E451615AE040007F010003DC' ||
        barcodeCustomerOrgId === 'FFC2C2C944444040A718D018CE2CBC23'
      ) {
        const formList = data
        formList.every((form) => {
          form.items.every((item) => {
            item.notBarcodeOnly = shouldSet({
              orgId: barcodeCustomerOrgId,
              deptName: item.intranetDirectDeptName,
            })
            return true
          })
          return true
        })
      }
      return { ...state }
    },
    // 填充信息
    fillInfo(state, { payload }) {
      let exist = false
      let newItem
      const checkRfid = (value, target) => {
        if (target.rfids && target.rfids.length) {
          const rfidsLength = target.rfids.length
          if (value !== rfidsLength && value) {
            Modal.warning({
              content:
                '系统检测到该批次已经维护过了RFID，您刚刚调整了发货数量，请注意核对和维护RFID数据！',
            })
          }
          if (!value) {
            delete target.rfids
          } else if (value < target.rfids.length) {
            target.rfids.splice(value, target.rfids.length - value)
          }
        }
      }
      const formList = state.orderBean.data
      formList.every((form) => {
        form.items.every((item) => {
          if (item.pscId === payload.pscId) {
            exist = true
          }
          return true
        })
        return true
      })
      if (!exist) {
        // 不存在直接return
        message.error('当前物资列表中无该物资!')
        state.allFull = false
        return { ...state }
      }
      let allFull = true
      formList.every((form, formIndex) => {
        // 筛选出pscId相同的
        const sameMetrialList = form.items.filter(item => item.pscId === payload.pscId)
        // 如果当前form没有对应物资，或者数量已经满了，continue
        if (sameMetrialList.length === 0) {
          return true
        }
        let currentDeliverQty = 0
        sameMetrialList.forEach((item) => {
          currentDeliverQty = new Decimal(currentDeliverQty).plus(
            item.deliverQty ? item.deliverQty : 0,
          )
        })
        if (
          new Decimal(currentDeliverQty)
            .plus(1)
            .plus(sameMetrialList[0].deliveredQty)
            .gt(sameMetrialList[0].purchaseQty)
        ) {
          return true
        }
        // 否则遍历form的内容
        allFull = false
        let isSame = false
        let insertIndex = 0
        let indexInSame = 0
        // 先获取出未有过改动的item
        let originalItem = {}
        const originalList = state.originalOrderBean.data
        form.items.every((item, itemIndex) => {
          // 找到相同物资
          if (item.pscId === payload.pscId) {
            originalList[formIndex].items.every((oItem) => {
              if (oItem.pscId === payload.pscId) {
                originalItem = Object.assign(
                  cloneDeep(oItem),
                  JSON.parse(JSON.stringify(payload)),
                  { deliverQty: 1, materialsPrice: oItem.materialsPrice },
                )
                return false
              }
              return true
            })
            if (isSameBatch(item, payload)) {
              // 直接填充
              isSame = true
              newItem = Object.assign(cloneDeep(item), JSON.parse(JSON.stringify(payload)), {
                deliverQty: item.deliverQty ? item.deliverQty + 1 : 1,
                materialsPrice: item.materialsPrice,
              })
              formList[formIndex].items[itemIndex] = newItem
              checkRfid(newItem.deliverQty, newItem)
              state.scanResult.formIndex = formIndex
              return false
            }
            insertIndex = itemIndex
            indexInSame += 1
            originalItem.indexInSame = indexInSame
          }
          return true
        })
        if (!isSame) {
          // 插入
          formList[formIndex].items.splice(insertIndex + 1, 0, originalItem)
          state.scanResult.formIndex = formIndex
          // 筛选出pscId相同的 在第一个加一个SameNum
          sameMetrialList[0].sameNum = sameMetrialList[0].sameNum
            ? sameMetrialList[0].sameNum + 1
            : 1
        }
        return false
      })
      if (allFull) {
        state.allFull = true
      } else {
        state.allFull = false
      }
      return { ...state }
    },
    checkRfidNum(state, { payload }) {
      const { value, row: target } = payload
      if (target.rfids && target.rfids.length) {
        const rfidsLength = target.rfids.length
        if (value !== rfidsLength && value) {
          Modal.warning({
            content:
              '系统检测到该批次已经维护过了RFID，您刚刚调整了发货数量，请注意核对和维护RFID数据！',
          })
        }
        if (!value) {
          delete target.rfids
        } else if (value < target.rfids.length) {
          target.rfids.splice(value, target.rfids.length - value)
        }
      }
      return { ...state }
    },
    updateMaterialItem(state, { payload }) {
      const { target, prop, value } = payload
      target[prop] = value
      return { ...state }
      // const { target: { pscId, indexInSame }, prop, value } = payload
      // const formList = state.orderBean.data
      // const newFormList = formList.map((form) => {
      //   const items = form.items.map((item) => {
      //     if (item.pscId === pscId && item.indexInSame === indexInSame) {
      //       if (prop === 'deliverQty') {
      //         const amount = parseFloat(item.materialsPrice) * parseInt(value, 10)
      //         return { ...item, [prop]: value, amount }
      //       }
      //       return { ...item, [prop]: value }
      //     }
      //     return item
      //   })
      //   return { ...form, items }
      // })
      // const newOrderBean = Object.assign(state.orderBean, { data: newFormList })
      // return { ...state, orderBean: newOrderBean }
    },
    addBatch(state, { payload }) {
      const { formIndex } = payload
      // 先获取出未有过改动的item
      let originalItem = {}
      const originalList = state.originalOrderBean.data
      originalList[formIndex].items.forEach((item) => {
        if (item.pscId === payload.pscId) {
          originalItem = cloneDeep(item)
        }
      })
      // 在当前orderBean中遍历，找到最后一个itemId相同的，插在后面
      const nowList = state.orderBean.data
      let insertIndex
      let indexInSame = 0
      nowList[formIndex].items.forEach((item, index) => {
        if (item.pscId === originalItem.pscId) {
          item.sameNum = item.sameNum ? item.sameNum + 1 : 1
          insertIndex = index
          indexInSame += 1
        }
      })
      originalItem.indexInSame = indexInSame
      nowList[formIndex].items.splice(insertIndex + 1, 0, originalItem)
      return { ...state }
    },
    deleteBatch(state, { payload }) {
      const { pscId, index, formIndex, indexInSame } = payload
      const nowList = state.orderBean.data
      nowList[formIndex].items.forEach((item) => {
        if (item.pscId === pscId) {
          item.sameNum -= 1
          // if (item.indexInSame && item.indexInSame > indexInSame) {
          //   item.indexInSame -= 1
          // }
        }
      })
      nowList[formIndex].items.splice(index, 1)
      return { ...state }
    },
    resetForm(state) {
      const originalOrderBean = cloneDeep(state.originalOrderBean)
      return { ...state, orderBean: originalOrderBean }
    },
  },
})
