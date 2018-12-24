import pathToRegexp from 'path-to-regexp'
import { message } from 'antd'
import { modelExtend, getServices } from '../../utils'

const {
  queryPageList,
  skuSave,
  materialSkuSave,
  queryDetail,
  confirmCompare,
  queryOptionTree,
  queryOptionRegList,
  getProduceFacList,
  getBrandList,
} = getServices({
  // 物资对照候选列表分页查询
  queryPageList: '/materials/compare/standard/page-list',
  // 物资对照新增规格
  skuSave: '/materials/compare/add-sku',
  // 物资对照新增物资及规格
  materialSkuSave: '/materials/compare/add-materials-sku',
  // 物资对照详情查询
  queryDetail: '/materials/compare/detail',
  // 物资对照确认
  confirmCompare: '/materials/compare/confirm',
  // option下拉分类树
  queryOptionTree: '/materials/category68/option/tree/list',
  // 注册证异步下拉列表
  queryOptionRegList: '/materials/register/certificate/option/materials/list',
  // 获取厂家列表
  getProduceFacList: '/organization/getProduceFactoryCompositionInfo',
  // 获取品牌列表
  getBrandList: '/materials/brand/option/list',
})
const initState = {
  bringData: {}, // 携带数据
  standardData: {}, // 选择标准数据
  materialList: [],
  pagination: {
    current: 1,
    total: null,
    pageSize: 10,
  },
  searchSaveParam: {}, // 保存搜索条件
  addSkuModalVisible: false,
  currentItem: {},
  addModalType: '',
  deliverItemId: '',
  // add物资和规格
  picLength: 0,
  productFacId: '', // 保存厂家id
  produceList: [], // 厂家列表
  branOptionList: [], // 品牌下拉
  selectRegObj: {}, // 注册证下拉选中
  regOptionList: [], // 注册证下拉
  GoodsCategoryTreeData: [],
  brandAddModalList: [], // 厂家异步下拉列表
  produceAddModalList: [], // 厂家异步下拉列表
  certAddModalList: [], // 注册证异步下拉列表
  addModalVisible: false,
  selectRowId: '',
}
export default modelExtend({
  namespace: 'materialCompareDetail',
  state: initState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const { pathname } = location
        const match = pathToRegexp('/materials/materialCompare/materialCompareDetail/:id').exec(
          pathname,
        )
        if (match) {
          dispatch({ type: 'app/getPackageUnit' })
          const deliverItemId = match[1]
          dispatch({ type: 'updateState', payload: initState })
          dispatch({ type: 'updateState', payload: { deliverItemId } })
          dispatch({ type: 'queryDetail' })
          dispatch({ type: 'queryPageList' })

          dispatch({ type: 'queryOptionTree' })
          dispatch({
            type: 'queryOptionRegList',
            payload: {
              keywords: '',
            },
          })
          dispatch({
            type: 'getProduceFacList',
            payload: {
              keywords: '',
            },
          })
        }
      })
    },
  },
  effects: {
    // 获取规格列表
    * queryPageList({ payload }, { call, select, update }) {
      const { searchSaveParam } = yield select(({ materialCompareDetail }) => materialCompareDetail)
      const { content: { data, current, total, pageSize } } = yield call(queryPageList, {
        ...searchSaveParam,
        ...payload,
      })
      yield update({
        materialList: data,
        pagination: { current, total, pageSize },
      })
    },
    // 物资对照详情查询
    * queryDetail(action, { call, select, update }) {
      const { deliverItemId } = yield select(({ materialCompareDetail }) => materialCompareDetail)
      const { content: [bringData, standardData] } = yield call(queryDetail, {
        deliverItemId,
      })
      yield update({
        bringData,
        standardData: standardData || {},
      })
    },
    // 新增物料和规格
    * addMaterialSku({ payload }, { call, select, update }) {
      const { bringData: { deliverFormId, deliverItemId, pscId } } = yield select(
        ({ materialCompareDetail }) => materialCompareDetail,
      )
      yield call(materialSkuSave, { ...payload, deliverFormId, deliverItemId, pscId })
      message.success('添加成功')
      yield update({
        bringData: {},
        standardData: {},
        addSkuModalVisible: false,
      })
    },
    // 新增规格
    * addSku({ payload }, { call, select, update }) {
      const {
        bringData: { deliverFormId, deliverItemId, pscId },
        standardData: { materialsCode, materialsId },
      } = yield select(({ materialCompareDetail }) => materialCompareDetail)
      yield call(skuSave, {
        ...payload,
        deliverFormId,
        deliverItemId,
        pscId,
        materialsCode,
        materialsId,
      })
      message.success('添加成功')
      yield update({
        bringData: {},
        standardData: {},
        addModalVisible: false,
      })
    },
    // 确认对照
    * confirmCompare({ payload }, { call, select, update }) {
      const {
        bringData: { deliverFormId, deliverItemId, pscId },
        standardData: { materialsId, materialsSkuId },
      } = yield select(({ materialCompareDetail }) => materialCompareDetail)
      yield call(confirmCompare, {
        ...payload,
        materialsSkuId,
        deliverFormId,
        deliverItemId,
        pscId,
        materialsId,
      })
      message.success('操作成功')
      yield update({
        bringData: {},
        standardData: {},
      })
    },
    // option下拉分类树
    * queryOptionTree(action, { call, update }) {
      const { content } = yield call(queryOptionTree)
      yield update({ GoodsCategoryTreeData: content })
    },
    // 注册证异步下拉列表
    * queryOptionRegList({ payload }, { call, update }) {
      const { content } = yield call(queryOptionRegList, payload)
      yield update({ regOptionList: content })
    },
    // 获取厂家列表
    * getProduceFacList({ payload }, { call, update }) {
      const { content } = yield call(getProduceFacList, payload)
      yield update({ produceList: content })
    },
    // 异步获取品牌下拉列表
    * getBrandList({ payload }, { call, update }) {
      const { content } = yield call(getBrandList, payload)
      yield update({ branOptionList: content })
    },
  },
  reducers: {},
})
