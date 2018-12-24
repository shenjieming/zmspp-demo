import pathToRegexp from 'path-to-regexp'
import { message } from 'antd'
import { modelExtend } from '../../utils/index'
import roleDetailService from '../../services/presetRoleAdmin/roleDetail'
import { cloneDeep } from 'lodash'

const initState = {
  roleDetail: {
    roleType: undefined,
    addName: '',
    addTime: '',
    menus: [],
    adminFlag: false,
    orgType: null,
    roleId: '',
    roleName: '',
    roleStatus: false,
  },
  totalMenus: [],
  // 因为页面上的展示部分不能跟随改变，所以需要一个copy
  totalMenusCopy: [],
  menuTree: [],
  editRoleVisible: false,
}


export default modelExtend({
  namespace: 'presetRoleDetail',
  state: initState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const match = pathToRegexp('/presetRoleAdmin/detail/:id').exec(pathname)
        if (match) {
          dispatch({ type: 'getDetail',
            payload: {
              roleId: match[1],
            } })
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
    // *getMenus({ payload }, { call, update }) {
    //   const { content: { menus } } = yield call(roleDetailService.getMenusApi, { ...payload })
    //   yield update({ totalMenus: menus, totalMenusCopy: cloneDeep(menus) })
    // },
    // 更新角色状态
    * updateRoleState({ payload }, { select, call, put }) {
      const { roleDetail: { roleId } } = yield select(({ presetRoleDetail }) => presetRoleDetail)
      yield call(roleDetailService.updateRoleStateApi, { ...payload })
      message.success('操作成功')
      yield put({ type: 'getDetail', payload: { roleId } })
    },
    // 编辑角色
    * editRole({ payload }, { select, call, put }) {
      const { roleDetail: { roleId } } = yield select(({ presetRoleDetail }) => presetRoleDetail)
      yield call(roleDetailService.editRoleApi, { ...payload })
      message.success('操作成功')
      yield put({ type: 'showOrHideModal', payload: { editRoleVisible: false } })
      yield put({ type: 'getDetail', payload: { roleId } })
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload }
    },
    showOrHideModal(state, { payload }) {
      // 打开关闭modal的时候对totalMenus做一次clone
      const totalMenusCopy = cloneDeep(state.totalMenus)
      return { ...state, ...payload, totalMenusCopy }
    },
  },
})
