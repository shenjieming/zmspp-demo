import { message } from 'antd'
import { cloneDeep } from 'lodash'
import { modelExtend } from '../../utils/index'
import roleAdminService from '../../services/presetRoleAdmin/roleAdmin'

const initState = {
  data: [],
  orgType: [],
  totalMenus: [],
  totalMenusCopy: [],
  pagination: {
    pageSize: 10,
    current: 1,
    total: null,
  },
  searchParams: {
    orgTypeValue: null,
    roleStatus: null,
    roleName: '',
  },
  addModalVisible: false,
}

export default modelExtend({
  namespace: 'presetRoleAdmin',
  state: initState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/presetRoleAdmin') {
          if (history.action !== 'POP') {
            dispatch({ type: 'updateState', payload: { ...initState } })
          }
          dispatch({ type: 'getData' })
          dispatch({ type: 'getOrgType', payload: { dicKey: 'ORGANIZATION_TYPE' } })
          dispatch({ type: 'getMenus' })
        }
      })
    },
  },
  effects: {
    // 加载列表数据
    * getData({ payload }, { select, call, update }) {
      const { pagination, searchParams } = yield select(({ presetRoleAdmin }) => presetRoleAdmin)
      const param = { ...pagination, ...searchParams, ...payload }
      const { content: { data, current, pageSize, total } } = yield call(
        roleAdminService.getDataApi,
        param,
      )
      yield update({ data, pagination: { current, pageSize, total } })
    },
    // 获取机构类型
    * getOrgType({ payload }, { call, update }) {
      const { content } = yield call(roleAdminService.getOrgTypeApi, payload)
      yield update({ orgType: content })
    },
    // 获取菜单总树（内含选择状态）
    * getMenus(_, { call, update }) {
      const { content } = yield call(roleAdminService.getMenusApi)
      yield update({ totalMenus: content, totalMenusCopy: cloneDeep(content) })
    },
    // 添加角色
    * addOne({ payload }, { call, put }) {
      yield call(roleAdminService.addOneApi, { ...payload })
      message.success('操作成功')
      yield put({ type: 'showOrHideModal', payload: { addModalVisible: false } })
      yield put({ type: 'getData', payload: { ...initState } })
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
