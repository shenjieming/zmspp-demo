import { message } from 'antd'
import qs from 'qs'
import { cloneDeep } from 'lodash'
import {
  getVersionList,
  getProduceFacList,
  queryOptionRegList,
  queryOptionTree,
  queryVersionDetail,
  getCompareList,
  mountOnOffStatus,
  editMaterialSave,
  onOffStatus,
  addMaterial,
  getMaterialList,
  getCertList,
  getBrandList,
  importFile,
  importSchedule,
  queryMaterialDetail,
} from '../../services/materials/material'
import modelExtend from '../../utils/modelExtend'

const handleData = (data) => {
  const copyData = cloneDeep(data)
  if (data.handleProduceFactoryId) {
    copyData.produceFactoryId = data.handleProduceFactoryId.key
  }
  if (data.handleStandardCategoryId) {
    copyData.standardCategoryId = data.handleStandardCategoryId.value
  }
  if (data.handleRegisterCertificateId) {
    copyData.registerCertificateId = data.handleRegisterCertificateId.key
  }
  delete copyData.handleProduceFactoryId
  delete copyData.handleStandardCategoryId
  delete copyData.handleRegisterCertificateId
  return copyData
}
const initState = {
  visible: false,
  materialList: [],
  pagination: {
    current: 1,
    pageSize: 10,
    total: null,
  },
  currentItem: {},
  searchSaveParam: {},
  addModalType: '',
  addModalVisible: false,
  certAddModalList: [], // 注册证异步下拉列表
  produceAddModalList: [], // 厂家异步下拉列表
  brandAddModalList: [], // 厂家异步下拉列表
  excelModalVisible: false,
  importButtonStatus: true,
  scheduleModalVisible: false,
  schedulePagination: {
    // 进度分页
    current: 1,
    pageSize: 10,
    total: null,
  },
  historyPagination: {
    // 历史版本分页
    current: 1,
    pageSize: 10,
    total: null,
  },
  historyModalVisible: false,
  checkedHistoryArr: [],
  versionDoubleList: [{}, {}],
  historyList: [],
  compareModalVisible: false,
  GoodsCategoryTreeData: [],
  regOptionList: [], // 注册证下拉
  selectRegObj: {}, // 注册证下拉选中
  branOptionList: [], // 品牌下拉
  produceList: [], // 厂家列表
  productFacId: '', // 保存厂家id
  materialsId: '', // 编辑的物料id
  scheduleList: [], // 导入进度
  picLength: 0,
  viewCurrentData: {},
  viewModalVisible: false,
}
export default modelExtend({
  namespace: 'material',
  state: initState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const { search, pathname } = location
        const query = qs.parse(search, { ignoreQueryPrefix: true })
        if (pathname === '/materials/material') {
          if (history.action !== 'POP') {
            dispatch({ type: 'updateState', payload: initState })
          }
          if (query.handleRegisterCertificateId) {
            dispatch({ type: 'updateState', payload: { searchSaveParam: query } })
          }
          dispatch({ type: 'getMaterialList' })
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
    // 获取物料表格列表
    * getMaterialList({ payload }, { call, select, update }) {
      const { searchSaveParam, pagination } = yield select(({ material }) => material)
      const { content: { data, current, total, pageSize } } = yield call(getMaterialList, {
        ...handleData(searchSaveParam),
        ...pagination,
        ...payload,
      })
      yield update({
        materialList: data,
        pagination: { current, total, pageSize },
        // searchSaveParam: {
        //   ...handleData(searchSaveParam),
        //   ...payload,
        // },
      })
    },
    // 新增物料
    * addMaterial({ payload }, { call, select, update }) {
      const { searchSaveParam } = yield select(({ material }) => material)
      yield call(addMaterial, payload)
      message.success('添加成功')
      const { content: { data, current, total, pageSize } } = yield call(getMaterialList, {
        ...handleData(searchSaveParam),
      })
      yield update({
        materialList: data,
        pagination: { current, total, pageSize },
        addModalVisible: false,
      })
    },
    // 编辑物料保存
    * editMaterialSave({ payload }, { call, select, update }) {
      const { searchSaveParam, materialsId } = yield select(({ material }) => material)
      yield call(editMaterialSave, { ...payload, materialsId })
      message.success('保存成功')
      const { content: { data, current, total, pageSize } } = yield call(getMaterialList, {
        ...handleData(searchSaveParam),
      })
      yield update({
        materialList: data,
        pagination: { current, total, pageSize },
        addModalVisible: false,
      })
    },
    // 停用启用
    * onOffStatus({ payload }, { call, select, update }) {
      const { searchSaveParam } = yield select(({ material }) => material)
      yield call(onOffStatus, payload)
      message.success('操作成功')
      const { content: { data, current, total, pageSize } } = yield call(getMaterialList, {
        ...handleData(searchSaveParam),
      })
      yield update({ materialList: data, pagination: { current, total, pageSize } })
    },
    // 批量停用启用
    * mountOnOffStatus({ payload }, { call, select, update }) {
      const { searchSaveParam } = yield select(({ material }) => material)
      yield call(mountOnOffStatus, payload)
      message.success('操作成功')
      const { content: { data, current, total, pageSize } } = yield call(getMaterialList, {
        ...payload,
        ...handleData(searchSaveParam),
      })
      yield update({ materialList: data, pagination: { current, total, pageSize } })
    },
    // 异步获取注册证下拉列表
    * getCertList({ payload }, { call, select, update }) {
      const { userId } = yield select(({ material }) => material)
      const { content } = yield call(getCertList, { ...payload, userId })
      yield update({ certAddModalList: content })
    },
    // option下拉分类树
    * queryOptionTree({ payload }, { call, update }) {
      const { content } = yield call(queryOptionTree)
      yield update({ GoodsCategoryTreeData: content })
    },
    // 异步获取品牌下拉列表
    * getBrandList({ payload }, { call, select, update }) {
      const { userId } = yield select(({ material }) => material)
      const { content } = yield call(getBrandList, { ...payload, userId })
      yield update({ branOptionList: content })
    },
    // 导入excel文件
    * importFile({ payload }, { call, update }) {
      yield call(importFile, payload)
      message.success('正在导入中')
      yield update({ excelModalVisible: false })
    },
    // 导入进度查询
    * importSchedule({ payload }, { call, update }) {
      yield update({
        scheduleModalVisible: true,
      })
      const { content: { data, total, current, pageSize } } = yield call(importSchedule, {
        ...payload,
        taskType: 1,
      })
      yield update({
        scheduleList: data,
        schedulePagination: { total, current, pageSize },
      })
    },
    // 物料版本列表
    * getVersionList({ payload }, { call, update }) {
      yield update({
        historyModalVisible: true,
        checkedHistoryArr: [],
      })
      const { content: { data, total, current, pageSize } } = yield call(getVersionList, payload)
      yield update({
        historyPagination: { total, current, pageSize },
        historyList: data,
      })
    },
    // 物料版本对比列表
    * getCompareList({ payload }, { call, update }) {
      yield update({
        compareModalVisible: true,
      })
      const { content } = yield call(getCompareList, payload)
      yield update({
        versionDoubleList: content,
      })
    },
    // 物料版本详情
    * queryVersionDetail({ payload }, { call, update }) {
      yield update({
        viewModalVisible: true,
      })
      const { content: viewCurrentData } = yield call(queryVersionDetail, payload)
      yield update({ viewCurrentData })
    },
    // 查询物料详情
    * queryMaterialDetail({ payload }, { call, update }) {
      yield update({
        addModalVisible: true,
        addModalType: 'update',
        materialsId: payload.materialsId,
        selectRegObj: {},
      })
      const { content } = yield call(queryMaterialDetail, payload)
      yield update({
        currentItem: content,
        productFacId: content.produceFactoryId,
        picLength: content.materialsImageUrls ? content.materialsImageUrls.split(',').length : 0,
      })
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
  },
  reducers: {},
})
