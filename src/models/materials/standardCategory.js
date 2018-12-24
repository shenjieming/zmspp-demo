import { modelExtend } from '../../utils'
import categoryService from '../../services/materials/standardCategory'

const initialState = {
  treeData: [],
  currentNode: {},
  editPanelVisible: false,
  addPanelVisible: false,
}

const riskTypeArr = ['I类', 'II类', 'III类']
const riskTypeHelperArr = ['IL', 'IIL', 'IIIL']

const formData = (data) => {
  data.forEach((item, index) => {
    let label = ''
    label += item.categoryRiskType ? `${riskTypeArr[item.categoryRiskType - 1]} ` : ''
    if (item.categoryCode && item.parentCode) {
      item.categoryCode = item.categoryCode.replace(item.parentCode, '')
    }
    label += item.categoryCode ? `[${item.categoryCode}] ` : ''
    label += item.label
    item.label = label
    let helper = ''
    helper += item.categoryRiskType ? `${riskTypeHelperArr[item.categoryRiskType - 1]} ` : ''
    helper += item.categoryCode ? `[${item.categoryCode}] ` : ''
    helper += item.nameHelper
    item.nameHelper = helper
    item.index = index + 1
    if (item.children && item.children.length > 0) {
      formData(item.children)
    }
  })
}

export default modelExtend({
  namespace: 'standardCategory',
  state: initialState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/materials/standardCategory') {
          dispatch({ type: 'getCategoryTree' })
        }
      })
    },
  },
  effects: {
    * getCategoryTree(_, { call, update }) {
      const { content } = yield call(categoryService.getTreeDataApi)
      yield formData(content)
      yield update({ treeData: content })
    },
    * getNodeDetail({ payload }, { call, update }) {
      const { categoryId } = payload
      const { content } = yield call(categoryService.getNodeDetailApi, { categoryId })
      yield update({ currentNode: content })
      yield update({ editPanelVisible: true })
    },
    * updateCategory({ payload }, { select, call, put }) {
      const { currentNode: { categoryId } } = yield select(({ standardCategory }) => standardCategory)
      const { values } = payload
      yield call(categoryService.updateCategoryApi, { ...values, categoryId })
      yield put({ type: 'getNodeDetail', payload: { categoryId } })
      yield put({ type: 'getCategoryTree' })
    },
    * saveCategory({ payload }, { select, call, put, update }) {
      const { currentNode: { categoryId } } = yield select(({ standardCategory }) => standardCategory)
      const { values } = payload
      yield call(categoryService.saveCategoryApi, { ...values, parentId: categoryId || null })
      yield update({ addPanelVisible: false, editPanelVisible: true })
      yield put({ type: 'getCategoryTree' })
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload }
    },
  },
})
