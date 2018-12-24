import { update, remove, getAddressList, setDefaultAddress, create } from '../../services/purchaseManage/receiptAddress'
import { modelExtend, getSetup } from '../../utils'

const initState = {
  modalType: 'update',
  modalVisible: false,
  modalForm: {},
  addressArr: [],
}

export default modelExtend({
  namespace: 'receiptAddress',
  state: initState,
  subscriptions: getSetup({
    path: '/purchaseManage/receiptAddress',
    initFun({ toAction }) {
      toAction(initState)
      toAction('getAddressList')
      toAction('app/queryAddress')
    },
  }),

  effects: {
    // 收货地址列表查询
    * getAddressList(_, { call, toAction }) {
      const { content } = yield call(getAddressList, {})
      yield toAction({ addressArr: content })
    },

    // 收货地址删除
    * deleteAddress({ payload }, { call, toAction }) {
      yield call(remove, payload)
      yield toAction('getAddressList')
    },

    // 收货地址设置为默认
    * setDetailed({ payload }, { call, toAction }) {
      yield call(setDefaultAddress, payload)
      yield toAction('getAddressList')
    },

    // 收货地址编辑
    * updateAddress({ payload }, { call, toAction }) {
      yield call(update, payload)
      yield [
        toAction('getAddressList'),
        toAction({ modalVisible: false }),
      ]
    },

    // 收货地址新增
    * createAddress({ payload }, { call, toAction }) {
      yield call(create, payload)
      yield [
        toAction('getAddressList'),
        toAction({ modalVisible: false }),
      ]
    },

  },
})
