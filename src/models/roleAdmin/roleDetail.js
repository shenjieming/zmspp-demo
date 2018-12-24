import pathToRegexp from 'path-to-regexp'
import { message } from 'antd'
import { modelExtend } from '../../utils/index'
import roleDetailService from '../../services/roleAdmin/roleDetail'
import { cloneDeep } from 'lodash'

const initState = {
  roleDetail: {
    roleType: undefined,
    addName: '',
    addTime: '',
    menus: [],
    orgType: null,
    roleId: '',
    roleName: '',
    roleStatus: false,
  },
  totalMenus: [],
  // 因为页面上的展示部分不能跟随改变，所以需要一个copy
  totalMenusCopy: [],
  roleUsers: {
    data: [],
    current: 1,
    pageSize: 1,
    total: null,
    roleId: '',
    status: undefined,
    keywords: '',
  },
  menuTree: [],
  editRoleVisible: false,
  editBtnVisible: true,
}


export default modelExtend({
  namespace: 'roleDetail',
  state: initState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const match = pathToRegexp('/roleAdmin/detail/:id').exec(pathname)
        if (match) {
          // dispatch({ type: 'getMenus', payload: {
          //   roleId: match[1],
          // } })
          dispatch({ type: 'getDetail',
            payload: {
              roleId: match[1],
            } })
          // 用户信息没必要再页面加载之初就请求
          // dispatch({ type: 'getUsers', payload: {
          //   current: 1,
          //   pageSize: 10,
          //   roleId: match[1],
          // } })
        }
      })
    },
  },
  effects: {
    // 获取角色详情
    * getDetail({ payload }, { call, update }) {
      const { content } = yield call(roleDetailService.getDetailApi, { ...payload })
      yield update({ roleDetail: content, totalMenus: content.menus, totalMenusCopy: cloneDeep(content.menus) })
    },
    // 获取菜单总树（内含选择状态）
    * getMenus({ payload }, { call, update }) {
      const { content: { menus } } = yield call(roleDetailService.getMenusApi, { ...payload })
      yield update({ totalMenus: menus, totalMenusCopy: cloneDeep(menus) })
    },
    // 获取角色用户
    * getUsers({ payload }, { call, update }) {
      const { content } = yield call(roleDetailService.getUsersApi, { ...payload })
      yield update({ roleUsers: { ...content, ...payload } })
    },
    // 用户筛选
    * filterUser({ payload }, { select, put }) {
      const { roleDetail: { roleId } } = yield select(({ roleDetail }) => roleDetail)
      const param = { ...payload, roleId, current: 1, pageSize: 10 }
      yield put({ type: 'getUsers', payload: param })
    },
    // 切换tab
    * tabChange({ payload }, { select, put, update }) {
      const {
        roleDetail: { roleId },
        // roleUsers: { status, keywords, current, pageSize },
      } = yield select(({ roleDetail }) => roleDetail)
      if (payload === '1') {
        yield update({ editBtnVisible: true })
        yield put({ type: 'getDetail', payload: { roleId } })
      } else {
        yield update({ editBtnVisible: false })
        yield put({ type: 'getUsers', payload: { roleId } })
      }
    },
    // 用户翻页
    * pagination({ payload }, { select, put }) {
      const { roleUsers: { keywords, status } } = yield select(({ roleDetail }) => roleDetail)
      const param = { ...payload, keywords, status }
      yield put({ type: 'getUsers', payload: param })
    },
    // 更新角色状态
    * updateRoleState({ payload }, { select, call, put }) {
      const { roleDetail: { roleId } } = yield select(({ roleDetail }) => roleDetail)
      yield call(roleDetailService.updateRoleStateApi, { ...payload })
      message.success('操作成功')
      yield put({ type: 'getDetail', payload: { roleId } })
    },
    // 编辑角色
    * editRole({ payload }, { select, call, put }) {
      const { roleDetail: { roleId } } = yield select(({ roleDetail }) => roleDetail)
      yield call(roleDetailService.editRoleApi, { ...payload })
      message.success('操作成功')
      yield put({ type: 'showOrHideModal', payload: { editRoleVisible: false } })
      yield put({ type: 'getDetail', payload: { roleId } })
    },
    // 移除用户
    * removeUser({ payload }, { select, call, put }) {
      const { roleDetail: { roleId } } = yield select(({ roleDetail }) => roleDetail)
      yield call(roleDetailService.removeUserApi, { ...payload })
      message.success('操作成功')
      yield put({ type: 'getUsers',
        payload: { current: 1, pageSize: 10, roleId } })
    },
  },
  reducers: {
    showOrHideModal(state, { payload }) {
      // 打开关闭modal的时候对totalMenus做一次clone
      const totalMenusCopy = cloneDeep(state.totalMenus)
      return { ...state, ...payload, totalMenusCopy }
    },
  },
})
