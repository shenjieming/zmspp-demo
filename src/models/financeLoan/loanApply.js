import { message } from 'antd'
import { routerRedux } from 'dva/router'
import { modelExtend, getServices } from '../../utils'
import windowNewOpen from '../../shared/windowNewOpen'
import { tabInfoArr } from '../../routes/financeManage/loanOrders/data'

const services = getServices({
  // 获取所有医院列表
  getCustomerListData: 'finance/loan-apply/receivable-customer/list-option',
  // 医院下应收单列表
  getReceivableOrderListData: 'finance/loan-apply/receivable-order/list-page',
  // 入库单详情
  getReceivableOrderDetailData: 'finance/loan-apply/receivable-order-item/list-page',
  // 第二步确定提交 返回第三部的应收单列表
  setSecondSubmitData: 'finance/loan-apply/receivable-order-mortgage/list',
  // 获取贷款资质信息列表
  getMortgageListData: 'finance/loan-apply/loan-mortgage/list',
  // 新增资质
  getAddMortgageData: 'finance/loan-apply/loan-mortgage/save',
  // 删除资质信息
  getDeleteMortgageData: 'finance/loan-apply/loan-mortgage/remove',
  // 新增资质类型
  getMortgageTypeData: 'system/dicValue/dicKey',
  // 第三部确认提交
  setThirdSubmitData: 'finance/loan-apply/receivable-mortgage/submit',
  // 第四部确认提交
  setFourthSubmitData: 'finance/loan-apply/loan-mortgage/confirm',
})
const initalState = {
  stepIndex: 1, // 默认步骤条从第一步开始
  customerList: [], // 医院列表
  customerSelected: [], // 供应商选择的医院
  receivableOrderList: [], // 入库单列表
  receivableOrderListPag: {}, // 入库单列表分页
  receivableOrderSearchdata: {}, // 入库单查询条件
  receivableOrderSelected: [], // 医院入库单
  receivableOrderMoney: 0, // 入库单可贷款总额
  receivableOrderSelectedList: [], // 第三步应收单列表
  orderDetailVisible: false, // 入库单详情弹框modal
  orderDetailList: [], // 入库单详情弹框列表
  orderDetailPag: {}, // 入库单详情弹框分页
  photoSelectedList: [],
  photoListDetail: [], // 弹框中的资质信息
  photoTypeList: [], // 资质类型
  invoiceCapitalList: [{
    invoiceCapital: '零元整',
    invoiceNo: '',
    invoiceDate: '',
    invoiceAmount: '',
    invoiceUrl: {},
    radomKey: 1,
  }], // 发票信息查询的列表
  popoverVisible: false,
  payMoneySum: 0,
  orderId: '', // 第四部提交订单Id
  radomKey: 1, // 发票信息随机key
}
export default modelExtend({
  namespace: 'loanApply',
  state: initalState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const { pathname } = location
        if (pathname === '/financeLoan/loanDashboard/loanApply') {
          dispatch({ type: 'updateState', payload: initalState })
          dispatch({ type: 'getCustomerList', payload: { keywords: '' } })
          dispatch({ type: 'getMortgageType', payload: { dicKey: 'FINANCE_LOAN_MORTGAGE' } })
        }
      })
    },
  },
  effects: {
    // 获取医院列表
    * getCustomerList({ payload }, { call, update }) {
      const { content } = yield call(services.getCustomerListData, payload)
      yield update({
        customerList: content,
      })
    },
    // 所选择医院下的应收单列表
    * getReceivableOrderList({ payload }, { call, update }) {
      const { content: { data, current, total, pageSize } } =
        yield call(services.getReceivableOrderListData, payload)
      yield update({
        receivableOrderSearchdata: payload,
        receivableOrderList: data,
        receivableOrderListPag: {
          current,
          total,
          pageSize,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: tota => `共有 ${tota} 条数据`,
        },
      })
    },
    // 获取入库单详情
    * getReceivableOrderDetail({ payload }, { call, update }) {
      yield update({
        orderDetailVisible: true,
      })
      const { content: { data, current, total, pageSize } } =
        yield call(services.getReceivableOrderDetailData, payload)
      yield update({
        orderDetailList: data,
        orderDetailPag: {
          formId: payload.formId,
          current,
          total,
          pageSize,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: tota => `共有 ${tota} 条数据`,
        },
      })
    },
    // 第二步确定提交 返回第三部的应收单列表
    * setSecondSubmit({ payload }, { call, update, select }) {
      const { stepIndex } = yield select(({ loanApply }) => loanApply)
      const { content } = yield call(services.setSecondSubmitData, payload)
      yield update({
        stepIndex: stepIndex + 1,
        receivableOrderSelectedList: content,
      })
    },
    // 获取贷款资质信息列表
    * getMortgageList({ payload }, { call, update }) {
      yield update({
        popoverVisible: true,
      })
      const { content } = yield call(services.getMortgageListData, payload)
      yield update({
        photoListDetail: content,
      })
    },
    // 获取资质类型
    * getMortgageType({ payload }, { call, update }) {
      const { content } = yield call(services.getMortgageTypeData, payload)
      yield update({
        photoTypeList: content,
      })
    },
    // 新增资质
    * getAddMortgage({ payload }, { call, put, select }) {
      const { customerSelected } = yield select(({ loanApply }) => loanApply)
      yield call(services.getAddMortgageData, payload)
      message.success('新增成功')
      yield put({
        type: 'getMortgageList',
        payload: {
          customerOrgId: customerSelected[0],
        },
      })
    },
    // 删除资质信息
    * getDeleteMortgage({ payload }, { call, put, select }) {
      const { customerSelected } = yield select(({ loanApply }) => loanApply)
      yield call(services.getDeleteMortgageData, payload)
      message.success('删除成功')
      yield put({
        type: 'getMortgageList',
        payload: {
          customerOrgId: customerSelected[0],
        },
      })
    },
    // 第三部确认提交
    * setThirdSubmit({ payload }, { call, select, update }) {
      const { stepIndex } = yield select(({ loanApply }) => loanApply)
      const { content: { formId } } = yield call(services.setThirdSubmitData, payload)
      yield update({
        stepIndex: stepIndex + 1,
        orderId: formId,
      })
    },
    // 第四部确认提交
    * setFourthSubmit({ payload }, { call, put }) {
      const { content } = yield call(services.setFourthSubmitData, payload)
      message.success('贷款申请成功')
      yield put(routerRedux.push(`/financeLoan/loanOrders?tabType=${tabInfoArr[1].tabKey}`))
      if (content) {
        windowNewOpen(content)
      }
    },
  },
  reducers: {
  },
})
