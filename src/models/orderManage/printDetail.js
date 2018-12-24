import { modelExtend, getServices } from '../../utils'

const services = getServices({
  // 获取总代
  getPrintDetail: '/customer/deliver/order/detail/print',
  // 获取个性化配置
  getPersonalityConfig: { url: '/organization/custom-data', type: 'get' },
  // 获取个性化表头
  getTableColumns: { url: '/base/print/config/deliver', type: 'get' },
})

const initState = {
  detailPageData: {},
  printFormData: [],
  personalityConfig: {
    deliveryQtyCanOverPurchaseQtyFlag: true, // 配送数量是否可以超出采购数量标记
    displayPurchaseItemRemarkFlag: false, // 采购明显是否显示备注标记
    deliveryCanEnterRfidFlag: true, // 发货时是否可以录入RFID
    deliveryBarcodeShape: 1, // 配送单条码样式 1是一维码 2是二维码
    deliveryCanCancelFlag: true, // 配送单是否可以作废标记
    deliveryPrintDynamicConfigFlag: false, // 配送单打印动态配置标记
  },
  personalColumns: [],
}

export default modelExtend({
  namespace: 'printDetail',
  state: initState,
  subscriptions: {},
  effects: {
    // 获取打印详情
    * getPrintDetail({ payload }, { call, update }) {
      const { content } = yield call(services.getPrintDetail, { ...payload })
      yield update({ detailPageData: content, printFormData: content.data })
    },
    // 获取个性化配置
    * getPersonalityConfig(_, { select, call, update }) {
      const {
        detailPageData: { distributeType, customerOrgId, barcodeCustomerOrgId },
      } = yield select(({ printDetail }) => printDetail)
      const { content } = yield call(services.getPersonalityConfig, {
        orgId: distributeType === 2 ? customerOrgId : barcodeCustomerOrgId,
      })
      yield update({ personalityConfig: content })
    },
    // 获取自定义表头
    * getTableColumns(_, { select, call, update }) {
      const {
        personalityConfig: { deliveryPrintDynamicConfigFlag },
        detailPageData: { distributeType, customerOrgId, barcodeCustomerOrgId },
      } = yield select(({ printDetail }) => printDetail)
      if (deliveryPrintDynamicConfigFlag) {
        const { content } = yield call(services.getTableColumns, {
          orgId: distributeType === 2 ? customerOrgId : barcodeCustomerOrgId,
        })
        yield update({ personalColumns: content })
      }
    },
  },
})
