import { message } from 'antd'
import {
  getCustomerListData,
  customerContrastData,
  removeRelation,
  recoverRelation,
  addCustomerListData,
  recoverRelationSync,
  addCustomerApplyData,
} from '../../../services/contacts/myCustomer'
import modelExtend from '../../../utils/modelExtend'
// 初始化数据
const initState = {
  searchData: { current: 1, pageSize: 10 }, // 搜索条件
  pagination: {}, // 我的客户分页
  dataSource: [], // 我的客户列表分页数据
  editContactVisible: false, // 编辑联系人
  defaultContactObj: {}, // 默认的联系人
  addCustSearchData: {}, // 新增客户搜索
  addCustomerVisible: false, // 增加客户
  addCustomerList: [], // 添加客户列表
  applyVisible: false, // 申请
  customerId: '', // 我的客户Id
  applyType: 0, // 0是 我的客户主页申请恢复关系弹框  1是添加客户的申请弹框
  addCustomerDetail: {}, // 添加客户列表详情
}

export default modelExtend({
  namespace: 'myCustomer',
  state: initState,
  subscriptions: {
    setup({ dispatch, history }) {
      // 获取地址
      history.listen(({ pathname }) => {
        if (pathname === '/contacts/myCustomer') {
          dispatch({ type: 'app/queryAddress' })
          if (history.action !== 'POP') {
            // 初始化数据
            dispatch({ type: 'updateState', payload: initState })
          }
          // 获取我的客户列表
          dispatch({ type: 'getCustomerList' })
        }
      })
    },
  },
  effects: {
    // 获取我的客户列表
    * getCustomerList({ payload }, { call, update, select }) {
      const searchData = yield select(({ myCustomer }) => myCustomer.searchData)
      const { content } = yield call(getCustomerListData, { ...searchData, ...payload })
      yield update({
        searchData: {
          ...searchData,
          ...payload,
        },
        dataSource: content.customers,
        pagination: {
          current: content.current,
          total: content.total,
          pageSize: content.pageSize,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: total => `共有 ${total} 条数据`,
        },
      })
    },
    // 设置我的客户联系信息
    * setCustomerContrast({ payload }, { call, put, select }) {
      const data = yield call(customerContrastData, payload)
      const searchData = yield select(({ myCustomer }) => myCustomer.searchData)
      message.success('操作成功', 3)
      yield put({
        type: 'updateState',
        payload: {
          editContactVisible: false,
        },
      })
      yield put({
        type: 'getCustomerList',
        payload: {
          ...searchData,
        },
      })
    },
    // 解除我的客户关系
    * setRemoveRelation({ payload }, { call, put, select }) {
      const data = yield call(removeRelation, payload)
      const searchData = yield select(({ myCustomer }) => myCustomer.searchData)
      message.success('解除成功', 3)
      yield put({
        type: 'getCustomerList',
        payload: {
          ...searchData,
        },
      })
    },
    // 恢复我的客户关系 异步校验
    * setRecoverRelationSync({ payload }, { call, put }) {
      const data = yield call(recoverRelationSync, payload)
      if (data.code === 201) {
        yield put({
          type: 'updateState',
          payload: {
            applyVisible: true,
            ...payload,
            customerId: payload.customerOrgId,
          },
        })
      } else if (data.code === 202) {
        message.error('你已经申请，请勿重复申请', 3)
      }
    },
    // 恢复我的客户关系
    * setRecoverRelation({ payload }, { call, put, select }) {
      const relationData = yield call(recoverRelation, payload)
      yield put({
        type: 'updateState',
        payload: {
          applyVisible: false,
        },
      })
      const searchData = yield select(({ myCustomer }) => myCustomer.searchData)
      message.success(relationData.message, 3)
      yield put({
        type: 'getCustomerList',
        payload: {
          ...searchData,
        },
      })
    },
    // 添加客户列表
    * getAddCustomerList({ payload }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          addCustomerVisible: true,
        },
      })
      const { content } = yield call(addCustomerListData, payload)
      yield put({
        type: 'updateState',
        payload: {
          addCustSearchData: payload,
          addCustomerList: content.applyList,
          addCustomerDetail: content,
        },
      })
    },
    // 申请
    * getApply({ payload }, { call, put, select }) {
      const data = yield call(addCustomerApplyData, payload)
      message.success('申请成功', 3)
      yield put({
        type: 'updateState',
        payload: {
          applyVisible: false,
        },
      })
      const addCustSearchData = yield select(({ myCustomer }) => myCustomer.addCustSearchData)
      yield put({
        type: 'getAddCustomerList',
        payload: {
          ...addCustSearchData,
        },
      })
    },
  },
  reducers: {},
})
