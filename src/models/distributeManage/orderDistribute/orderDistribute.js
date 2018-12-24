import pathToRegexp from 'path-to-regexp'
import { groupBy, every } from 'lodash'

import { modelExtend, getServices } from '../../../utils/'

const services = getServices({
  // 获取物料详情
  getMaterialsDetail: '/distribute/distribute-order-item/list',
  // 获取配送商信息(代配)
  getDistributorList: '/distribute/distributor/substitute-option-list',
  // 提交分发列表
  saveDistributeList: '/distribute/distribute-order/distribute-save',
})

const initialState = {
  detail: {
    orderItems: [],
  },
  distributorList: [],
  checkedItems: [],
  distributeConfirmVisible: false,
  groupedData: [],
  successModalVisible: false,
  resultForm: [],
}

export default modelExtend({
  namespace: 'orderDistribute',

  state: initialState,

  subscriptions: {
    setup({ history, dispatch }) {
      history.listen(({ pathname }) => {
        const match = pathToRegexp('/distributeManage/orderDistribute/distribute/:id').exec(
          pathname,
        )
        if (match) {
          dispatch({ type: 'reset' })
          dispatch({ type: 'getMaterialsDetail', payload: { formId: match[1] } })
        }
      })
    },
  },

  effects: {
    * getMaterialsDetail({ payload }, { call, update, put }) {
      const {
        content,
        content: { customerOrgId },
      } = yield call(services.getMaterialsDetail, {
        ...payload,
      })
      yield update({ detail: content })
      if (content.distributeType !== 2) {
        yield put({ type: 'getDistributorList', payload: { customerOrgId } })
      }
    },
    * getDistributorList({ payload }, { call, update }) {
      const { content } = yield call(services.getDistributorList, { ...payload })
      yield update({ distributorList: content })
    },
    * confirmDistribute({ payload }, { select, call, update }) {
      const {
        detail: { formId },
      } = yield select(({ orderDistribute }) => orderDistribute)
      const { content } = yield call(services.saveDistributeList, { ...payload })
      // 是否成功的判断，如果成功将会设置成功modal可见
      yield update({
        resultForm: content,
        distributeConfirmVisible: false,
        successModalVisible: true,
      })
      const { content: detail } = yield call(services.getMaterialsDetail, { formId })
      yield update({ detail })
    },
  },

  reducers: {
    reset() {
      return { ...initialState }
    },
    distributorOrgSelect(state, { payload }) {
      const {
        pscId,
        distributorOrgId,
        distributorOrgName,
        distributorPrice,
        contactName,
        contactPhone,
      } = payload
      const targetItem = state.detail.orderItems.find(item => item.pscId === pscId)
      targetItem.distributorOrgId = distributorOrgId
      targetItem.distributorOrgName = distributorOrgName
      if (distributorPrice) {
        targetItem.distributorPrice = distributorPrice
      }
      targetItem.contactName = contactName
      targetItem.contactPhone = contactPhone
      const newCheckedItem = state.checkedItems.map((item) => {
        if (item.pscId === pscId) {
          return targetItem
        }
        return item
      })
      return { ...state, checkedItems: newCheckedItem }
    },
    groupUpData(state) {
      const dataList = state.checkedItems
      const dataGroupBySupplier = groupBy(dataList, 'distributorOrgId')
      const newDataList = []
      every(dataGroupBySupplier, (items) => {
        const distributorUnit = {}
        distributorUnit.distributorOrgId = items[0].distributorOrgId
        distributorUnit.distributorOrgName = items[0].distributorOrgName
        distributorUnit.contactName = items[0].contactName
        distributorUnit.contactPhone = items[0].contactPhone
        distributorUnit.purchaseRemark = state.detail.purchaseRemark
        distributorUnit.orderItems = items
        if (state.detail.distributeType === 1) {
          const { contactName, contactPhone } =
            state.distributorList.find(
              item => item.distributorOrgId === distributorUnit.distributorOrgId,
            ) || {}
          distributorUnit.contactName = contactName
          distributorUnit.contactPhone = contactPhone
        }
        newDataList.push(distributorUnit)
        return true
      })
      return { ...state, groupedData: newDataList }
    },
  },
})
