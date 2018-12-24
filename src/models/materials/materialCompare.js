import { cloneDeep } from 'lodash'
import { modelExtend, getServices } from '../../utils'

const { queryPageList } = getServices({
  // 物资对照候选列表分页查询
  queryPageList: '/materials/compare/page-list',
})
const handleData = (data) => {
  const copyData = cloneDeep(data)
  if (data.customerOrgId) {
    copyData.customerOrgId = data.customerOrgId.key
  }
  if (data.supplierOrgId) {
    copyData.supplierOrgId = data.supplierOrgId.key
  }
  return copyData
}
const initState = {
  visible: false,
  materialMainList: [],
  pagination: {
    current: 1,
    pageSize: 10,
    total: null,
  },
  currentItem: {},
  searchSaveParam: {
    compareFlag: '0',
  },
}
export default modelExtend({
  namespace: 'materialCompare',
  state: initState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const { pathname } = location
        if (pathname === '/materials/materialCompare') {
          if (history.action !== 'POP') {
            dispatch({ type: 'updateState', payload: initState })
          }
          dispatch({ type: 'getMainList' })
        }
      })
    },
  },
  effects: {
    // 获取物料表格列表
    * getMainList({ payload }, { call, select, update }) {
      const { searchSaveParam, pagination } = yield select(({ materialCompare }) => materialCompare)
      const { content: { data, current, total, pageSize } } = yield call(queryPageList, {
        ...handleData(searchSaveParam),
        ...pagination,
        ...payload,
      })
      yield update({
        materialMainList: data,
        pagination: { current, total, pageSize },
      })
    },
  },
  reducers: {},
})
