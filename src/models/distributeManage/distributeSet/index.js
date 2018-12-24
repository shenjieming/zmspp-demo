import { message } from 'antd'
import { modelExtend, getSetup, getServices } from '../../../utils'

const services = getServices({
  // 分销配送设置客户列表（周）
  pageList: '/distribute/customer/page-list',
  // 分销客户的配送商机构列表（周）
  distributorList: '/distribute/distributor/list',
  // 获取分销客户列表（周）
  getCustomerList: '/distribute/customer/setting-option-list',
  // 获取分销客户配送商列表（周）
  getDeliveryList: '/distribute/delivery/setting-option-list',
  // 移除分销客户（周）
  delCustomer: '/distribute/customer/delete',
  // 移除分销客户配送商（周）
  delDistributor: '/distribute/distributor/delete',
  // 添加分销客户（周）
  addCustomer: '/distribute/customer/save',
  // 添加分销客户配送商（周）
  addDelivery: '/distribute/distributor/save',
  // 更新分销客户的配送商分发状态（周）
  distributorState: '/distribute/distributor/update',
  // 打开关闭分销开关
  setDistributeFlag: '/distribute-customer/use-distribute-flag',
  // 打开关闭分销模式
  setDistributeMode: '/distribute-customer/distribute-type',
})

const initState = {
  modalVisible: false,
  modalType: '',
  modalTableData: [],
  leftTableData: [],
  rightTableData: [],
  pageConfigLeft: {
    current: 1,
    pageSize: 10,
    total: null,
  },
  form: {},
  modalChecked: false, // 弹窗中的单选框是否勾选
}

const unstableState = {
  selectedCustomerId: null,
  selectedCustomerName: '',
  searchKeysLeft: {
    current: 1,
    pageSize: 10,
    keywords: null,
  },
  searchKeysRight: {
    customerOrgId: undefined,
    keywords: null,
  },
}

export default modelExtend({
  namespace: 'distributeSet',
  state: { ...initState, ...unstableState },
  subscriptions: getSetup({
    path: '/distributeManage/distributeSet',
    initFun({ toAction, history }) {
      toAction(initState)
      if (history.action !== 'POP') {
        toAction(unstableState)
      }
      toAction('pageList')
      toAction('distributorList')
    },
  }),

  effects: {
    // 分销配送设置客户列表（周）
    * pageList({ payload }, { call, toAction, select }) {
      const { searchKeysLeft } = yield select(({ distributeSet }) => distributeSet)
      const req = payload || searchKeysLeft
      const { content } = yield call(services.pageList, req)
      yield toAction({
        searchKeysLeft: req,
        leftTableData: content.data,
        pageConfigLeft: {
          current: content.current,
          pageSize: content.pageSize,
          total: content.total,
        },
      })
    },
    // 分销客户的配送商机构列表（周）
    * distributorList({ payload }, { call, toAction, select }) {
      const { searchKeysRight } = yield select(({ distributeSet }) => distributeSet)
      const req = payload || searchKeysRight
      if (req.customerOrgId) {
        const { content } = yield call(services.distributorList, req)
        yield toAction({
          searchKeysRight: req,
          rightTableData: content,
        })
      }
    },
    // 获取添加 分销客户/配送商 列表（周）
    * getModalList({ payload }, { call, toAction, select }) {
      const { selectedCustomerId, modalType } = yield select(({ distributeSet }) => distributeSet)
      let modalTableData = []
      if (modalType === 'left') {
        const { content } = yield call(services.getCustomerList, payload)
        modalTableData = content
      } else if (modalType === 'right' && selectedCustomerId) {
        const { content } = yield call(services.getDeliveryList, {
          ...payload,
          customerOrgId: selectedCustomerId,
        })
        modalTableData = content
      }
      yield toAction({ modalTableData })
    },
    // 添加 分销客户/配送商（周）
    * addForModal({ payload }, { call, toAction, select }) {
      const { selectedCustomerId, modalType } = yield select(({ distributeSet }) => distributeSet)
      if (modalType === 'left') {
        yield call(services.addCustomer, payload)
      } else if (modalType === 'right' && selectedCustomerId) {
        yield call(services.addDelivery, {
          ...payload,
          customerOrgId: selectedCustomerId,
        })
        yield toAction('distributorList')
      }
      yield toAction('getModalList')
      yield toAction('pageList')
      message.success('添加成功')
    },
    // 移除分销客户（周）
    * delCustomer({ payload }, { call }) {
      yield call(services.delCustomer, payload)
      message.success('移除成功')
    },
    // 移除分销客户配送商（周）
    * delDistributor({ payload }, { call, toAction }) {
      yield call(services.delDistributor, payload)
      yield [toAction('pageList'), toAction('distributorList')]
      message.success('移除成功')
    },
    // 更新分销客户的配送商分发状态（周）
    * distributorState({ payload }, { call }) {
      yield call(services.distributorState, payload)
      message.success('分发状态更新成功')
    },
    // 打开关闭分销开关
    * setDistributeFlag({ payload }, { call, put }) {
      yield call(services.setDistributeFlag, payload)
      yield put({ type: 'pageList' })
      message.success('更新成功')
    },
    // 打开关闭分销开关
    * setDistributeMode({ payload }, { update, select, call, put }) {
      const { selectedCustomerId, modalChecked } = yield select(
        ({ distributeSet }) => distributeSet,
      )
      if (!modalChecked) {
        return
      }
      yield call(services.setDistributeMode, payload)
      yield put({ type: 'pageList' })
      if (payload.customerOrgId === selectedCustomerId) {
        yield update({ selectedDistributeMode: payload.distributeType })
      }
      message.success('更新成功')
    },
  },
})
