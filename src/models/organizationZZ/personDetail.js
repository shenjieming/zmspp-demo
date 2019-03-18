import { userDetail, updateStatus, resetPassWord, unlock } from '../../services/organization/person'
import modelExtend from '../../utils/modelExtend'
import { message } from 'antd'
import pathToRegexp from 'path-to-regexp'
import qs from 'qs'

const initState = {
  visible: false,
  currentItem: {},
  accountStatus: 0,
  orgIdSign: '',
  userId: '',

}
export default modelExtend({
  namespace: 'personDetail',
  state: initState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const { search, pathname } = location
        const { orgIdSign } = qs.parse(search.slice(1))
        const match = pathToRegexp('/organization/detail/:id/personDetail/:id').exec(pathname)
        if (match) {
          dispatch({ type: 'updateState', payload: { initState, orgIdSign, userId: match[2] } })
          dispatch({ type: 'userDetail' })
        }
      })
    },
  },
  effects: {
    // 获取人员详情
    * userDetail({ payload }, { call, select, update }) {
      const { userId } = yield select(({ personDetail }) => personDetail)
      // const { orgIdSign, userId } = yield select(({ personDetail }) => personDetail)
      const { content } = yield call(userDetail, { userId })
      yield update({ currentItem: content })
    },
    // 重置密码
    * resetPassWord({ payload }, { call, select }) {
      const { userId } = yield select(({ personDetail }) => personDetail)
      yield call(resetPassWord, { userId })
      message.success('重置成功')
    },
    // 停用启用账号
    * changeStatus({ payload }, { call, select, update }) {
      const { orgIdSign, userId } = yield select(({ personDetail }) => personDetail)
      yield call(updateStatus, { ...payload })
      const { content } = yield call(userDetail, { userId, orgIdSign })
      yield update({ currentItem: content })
    },
    // 解锁账号
    * unlockAccount({ payload }, { call, select, update }) {
      const { userId } = yield select(({ personDetail }) => personDetail)
      yield call(unlock, { userId })
      const { content } = yield call(userDetail, { userId })
      yield update({ currentItem: content })
    },
  },
  reducers: {
    updateState(state, action) {
      return {
        ...state,
        ...action.payload,
      }
    },
  },
})
