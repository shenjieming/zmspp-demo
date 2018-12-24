import { modelExtend, getServices } from '../../../utils'

const services = getServices({
  // 列表数据
  getData: '/home/hire-mgmt/staff-hired/list-page',
  // 单条详情
  getDetail: '/home/hire-mgmt/staff-hired/detail',
  // 状态改变
  changeStatus: '/home/hire-mgmt/staff-hired/status-update',
  // 信息提交
  submitRecruit: '/home/hire-mgmt/staff-hired/save-or-update',
  // 字典接口
  dictionary: '/system/dicValue/dicKey',
})
const initalState = {
  data: [],
  currentDetail: {},
  searchParam: {
    hirePostStatus: 'false',
  },
  degreeList: [],
  modalVisible: false,
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
  },
}
export default modelExtend({
  namespace: 'recruitManage',
  state: initalState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const { pathname } = location
        if (pathname === '/websiteManage/recruitManage') {
          if (history.action !== 'POP') {
            dispatch({ type: 'updateState', payload: initalState })
          }
          dispatch({ type: 'getDegrees' })
          dispatch({ type: 'queryData' })
        }
      })
    },
  },
  effects: {
    * queryData(_, { call, select, update }) {
      const { pagination, searchParam } = yield select(({ recruitManage }) => recruitManage)
      const param = {
        ...pagination,
        ...searchParam,
        applyOrgId: searchParam.applyOrgId && searchParam.applyOrgId.key,
      }
      const { content: { data, current, pageSize, total } } = yield call(services.getData, {
        ...param,
      })
      yield update({ data, pagination: { current, pageSize, total } })
    },
    * searchData({ payload }, { call, update }) {
      const param = { ...payload, applyOrgId: payload.applyOrgId && payload.applyOrgId.key }
      const { content: { data, current, pageSize, total } } = yield call(services.getData, {
        ...param,
      })
      yield update({ data, pagination: { current, pageSize, total } })
      yield update({ searchParam: payload })
    },
    * pageChange({ payload }, { call, update }) {
      const { content: { data, current, pageSize, total } } = yield call(services.getData, {
        ...payload,
      })
      yield update({ data, pagination: { current, pageSize, total } })
    },
    // 获取单条详情
    * getDetail({ payload }, { call, update }) {
      const { content } = yield call(services.getDetail, { ...payload })
      yield update({ currentDetail: content })
    },
    // 改变招聘信息状态
    * changeStatus({ payload }, { call, put }) {
      yield call(services.changeStatus, { ...payload })
      yield put({ type: 'queryData' })
    },
    // 获取学历字典表
    * getDegrees(_, { call, update }) {
      const { content } = yield call(services.dictionary, { dicKey: 'EDUCATION_RANGE' })
      yield update({ degreeList: content })
    },
    // 提交修改
    * submitRecruit({ payload }, { call, update, put }) {
      yield call(services.submitRecruit, { ...payload })
      yield update({ modalVisible: false })
      yield put({ type: 'queryData' })
    },
  },
  reducers: {},
})
