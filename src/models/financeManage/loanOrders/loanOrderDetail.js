import { modelExtend, getSetup, getServices } from '../../../utils'

const services = getServices({
  // 运营后台 贷款单详情【周祀雄】
  financeManage: '/finance/loan-mgmt/loan-order/detail',
  // 供应商 贷款单详情【周祀雄】
  financeLoan: '/finance/loan-apply/loan-order/detail',
  // 银行 贷款单详情【周祀雄】
  financeAudit: '/finance/loan-audit/loan-order/detail',
})

const modalService = getServices({
  // 入库单明细【孟强】
  modalList: '/finance/loan-apply/receivable-order-item/list-page',
})

const initState = {
  pageType: undefined,
  formId: undefined,
  modalFormId: undefined,
  stockModalVisible: false,
  lightBoxVisible: false,
  lightBoxUrl: '',
  headInfoItem: {}, // 顶部信息
  loanOrderItem: {}, // 贷款单信息
  baseItem: {}, // 基础信息
  repayItem: null, // 还款信息
  stockSummary: {}, // 入库单与发票信息
  invoiceList: [], // 发票列表
  operationRecordList: [], // 操作记录
  modalList: [],
  pageConfig: {
    current: 1,
    pageSize: 10,
    total: null,
  },
}

const pageTypeArr = Object.keys(services)

export default modelExtend({
  namespace: 'loanOrderDetail',
  state: initState,
  subscriptions: getSetup({
    path: pageTypeArr.map(type => `/${type}/loanOrders/loanOrderDetail/:id`),
    initFun({ toAction, history, id }) {
      toAction(initState)
      const pathname = history.location.pathname
      pageTypeArr.forEach((pageType) => {
        if (pathname.includes(pageType)) {
          toAction({ pageType, formId: id })
          toAction('getPageInfo', { pageType, formId: id })
        }
      })
    },
  }),
  effects: {
    // 供应商贷款单详情【周祀雄】
    * getPageInfo({ payload }, { call, toAction }) {
      const { pageType, formId } = payload
      const { content } = yield call(services[pageType], { formId })
      yield toAction({ ...content })
    },
    // 入库单明细【孟强】
    * getModalList({ payload }, { call, toAction, select }) {
      const { modalFormId: formId } = yield select(({ loanOrderDetail }) => loanOrderDetail)
      const req = { ...payload, formId }
      const { content } = yield call(modalService.modalList, req)
      yield toAction({
        modalList: content.data,
        pageConfig: {
          current: content.current,
          pageSize: content.pageSize,
          total: content.total,
        },
      })
    },
  },
})
