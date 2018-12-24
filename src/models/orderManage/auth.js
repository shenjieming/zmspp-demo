import { message as Message } from 'antd'
import modelExtend from './../../utils/modelExtend'
import services from './../../services/orderManage/auth'

const namespace = 'businessAuth'

const initialState = {
  // 业务员
  userList: [],
  modelVisible: false,
  customersList: [],
  currentUserId: undefined,
  curAdminFlag: false,
}

export default modelExtend({
  namespace,

  state: initialState,

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/orderManage/auth') {
          dispatch({ type: 'updateState', payload: initialState })
          dispatch({ type: 'getList' })
        }
      })
    },
  },

  effects: {
    // 获取机构下的所有业务员
    * getList(_, { call, update }) {
      const { content } = yield call(services.getList)
      yield update({ userList: content })
    },
    // 获取客户列表
    * getCustomersList({ payload }, { call, update }) {
      const { content } = yield call(services.getCustomersList, { userId: payload })
      yield update({ customersList: content })
    },
    // 保存编辑
    * saveEdit({ payload }, { call, put, update }) {
      yield call(services.saveEdit, payload)
      yield update({ modelVisible: false })
      Message.success('保存成功')
      yield put({ type: 'getList' })
    },
  },

  reducers: {},
})
