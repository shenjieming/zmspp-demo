import { Modal } from 'antd'
import Decimal from 'decimal.js-light'
import { modelExtend, getSetup, segmentation, cloneDeep } from '../../../utils'
import * as services from '../../../services/purchaseManage/handPurchase/orderConfirmation'

const initState = {
  addressArr: [],
  modalVisible: false,
  orderFormModalVisible: false,
  formId: null,
  receiptId: '',
  changeArr: [],
  deleIdArr: [],
  addIdArr: [],
  useIdArr: [],
  orderFormData: [],
  orgIdArrLength: 0,
  modalTableData: [],
  receiptData: {},
  modalForm: {},
  modalType: '',
  editId: '',
}

export default modelExtend({
  namespace: 'orderConfirmation',
  state: cloneDeep(initState),
  subscriptions: getSetup({
    path: '/purchaseManage/handPurchase/orderConfirmation',
    initFun({ toAction, state, query, dispatchUrl }) {
      toAction(cloneDeep(initState))
      if (state) {
        toAction(state, 'orderDetail')
        toAction('receiptList')
      } else if (query.formId) {
        toAction({ formId: query.formId })
        toAction({ data: query, dispatchUrl }, 'agenOrderDetail')
        toAction('receiptList')
      } else {
        Modal.error({
          title: '查询页面不存在',
          content: '点击确定返回手工采购',
          okText: '确定',
          onOk() {
            dispatchUrl({
              pathname: '/purchaseManage/handPurchase',
            })
          },
        })
      }
    },
  }),

  effects: {
    // 收货地址列表查询
    * receiptList(_, { call, toAction, select }) {
      const { content } = yield call(services.receiptList, {})
      const { addIdArr, editId } = yield select(({ orderConfirmation }) => orderConfirmation)
      let receiptId = null
      let receiptData = {}
      const getReceiptData = data => ({
        receiveName: data.receiptContactName,
        receivePhone: data.receiptContactPhone,
        receiveAddress: segmentation([
          data.receiptMasterAddress && data.receiptMasterAddress.split(' ').filter((__, idx) => idx > 2).join(' '),
          data.receiptDetailAddress,
        ], ' '),
      })
      content.forEach((data) => {
        const { receiptDefaultFlag, receiptId: id } = data
        if (addIdArr.length) {
          if (!addIdArr.includes(id)) {
            receiptId = id
            receiptData = getReceiptData(data)
          }
        } else if (id === editId) {
          receiptId = id
          receiptData = getReceiptData(data)
        } else if (receiptDefaultFlag) {
          receiptId = id
          receiptData = getReceiptData(data)
        }
        return receiptDefaultFlag
      })
      yield toAction({
        addressArr: content,
        addIdArr: [],
        editId: '',
        receiptId,
        receiptData,
      })
    },
    // 收货地址编辑
    * updateAddress({ payload }, { call, toAction }) {
      yield call(services.update, payload)
      yield [
        toAction('receiptList'),
        toAction({ modalVisible: false }),
      ]
    },
    // 收货地址新增
    * createAddress({ payload }, { call, toAction }) {
      yield call(services.create, payload)
      yield [
        toAction('receiptList'),
        toAction({ modalVisible: false }),
      ]
    },
    // 订单提交
    * saveOrder({ payload }, { call, toAction }) {
      const { data, dispatchUrl, idArr } = payload
      const { content: stateArr } = yield call(services.usingStatus, { pscIds: idArr })
      if (stateArr.some(({ pscStatus }) => pscStatus === 2)) {
        Modal.error({
          title: '订单生成失败',
          content: '该订单中含有被停用物资，点击确定返回手工采购',
          okText: '确定',
          onOk() {
            dispatchUrl({
              pathname: '/purchaseManage/handPurchase',
            })
          },
        })
      }
      const { content } = yield call(services.saveOrder, data)
      let [sumAmount, sumQty] = [new Decimal(0), 0]
      content.forEach(({ formQty, formAmount }) => {
        sumAmount = sumAmount.add(formAmount - 0)
        sumQty += (formQty - 0)
      })
      yield toAction({
        orderFormModalVisible: true,
        modalTableData: content.concat({
          formAmount: sumAmount,
          formId: 'all',
          formNo: '合计',
          formQty: sumQty,
          supplierOrgId: 'none',
          supplierOrgName: '-',
        }),
      })
    },
    // 订单确认详情
    * orderDetail({ payload }, { call, toAction }) {
      const { content } = yield call(services.orderDetail, payload)
      const orgIdArrLength = content.reduce((arr, { items }) => arr.concat(items), []).length
      yield toAction({
        orderFormData: content,
        orgIdArrLength,
      })
    },
    // 再来一单详情
    * agenOrderDetail({ payload }, { call, toAction }) {
      const { data, dispatchUrl } = payload
      const { content } = yield call(services.agenOrderDetail, data)
      const reqObj = content
      reqObj.items = content.data.reduce((arr, { items }) => arr.concat(items), [])
      delete reqObj.data
      const pscIds = reqObj.items.map(({ pscId }) => pscId)
      const { content: stateArr } = yield call(services.usingStatus, { pscIds })
      const useIdArr = []
      stateArr.forEach((item) => {
        if (item.pscStatus === 1) {
          useIdArr.push(item.pscId)
        }
      })
      if (!useIdArr.length) {
        Modal.error({
          title: '该订单所有物资都已停用',
          content: '点击确定返回手工采购',
          okText: '确定',
          onOk() {
            dispatchUrl({
              pathname: '/purchaseManage/handPurchase',
            })
          },
        })
      }
      reqObj.items = reqObj.items.map(item => ({
        ...item,
        purchaseQty: Math.round(item.purchaseQty / (item.transformValue || 1)),
        disabled: !useIdArr.includes(item.pscId),
      }))
      yield toAction({
        useIdArr,
        orderFormData: [reqObj],
        orgIdArrLength: reqObj.items.length,
      })
    },
  },
})
