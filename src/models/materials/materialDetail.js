import { message } from 'antd'
import pathToRegexp from 'path-to-regexp'
import {
  queryRuleDetail,
  resoleCodeBarData,
  saveBarCodeList,
  queryBarCodeList,
  savePackage,
  queryPackageList,
  queryVersionDetail,
  getCompareList,
  getVersionList,
  onOffStatus,
  mountOnOffStatus,
  queryMaterialDetail,
  querySkuList,
  saveSku,
  updateSku,
  querySkuDetail,
} from '../../services/materials/materialDetail'
import modelExtend from '../../utils/modelExtend'

const initState = {
  addSkuModalVisible: false,
  addModalType: '',
  skuList: [], // 规格列表
  checkedArr: [], // 选中操作的规格
  pagination: {
    current: 1,
    total: null,
  },
  materialsId: '',
  searchSaveParam: {}, // 保存搜索条件
  currentPageData: {}, // 进入详情页默认查询
  currentItem: {}, // 进入详情页默认查询
  skuUnitList: [], // 异步补全的规格单位列表
  barCodeModalVisible: false,
  barCodeList: [],
  historyModalVisible: false, // 历史记录弹框
  historyPagination: {
    current: 1,
    total: null,
  },
  historyList: [],
  checkedHistoryArr: [],
  versionDoubleList: [{}, {}],
  compareModalVisible: false,
  materialsSkuId: '',
  viewModalVisible: false,
  viewCurrentData: {},
  packageList: {}, // 渲染表格数据
  packageModalVisible: false,
  barCodeRuleObj: {},
  ruleModalVisible: false,
}
export default modelExtend({
  namespace: 'materialDetail',
  state: initState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const { pathname } = location
        const match = pathToRegexp('/materials/material/materialDetail/:id').exec(pathname)
        if (match) {
          dispatch({ type: 'app/getPackageUnit' })
          const materialsId = match[1]
          dispatch({ type: 'updateState', payload: initState })
          dispatch({ type: 'updateState', payload: { materialsId } })
          dispatch({ type: 'queryMaterialDetail' })
          dispatch({ type: 'querySkuList' })
        }
      })
    },
  },
  effects: {
    // 获取物料详情
    * queryMaterialDetail({ payload }, { call, select, update }) {
      const { materialsId } = yield select(({ materialDetail }) => materialDetail)
      const { content } = yield call(queryMaterialDetail, { ...payload, materialsId })
      yield update({ currentPageData: content, materialsCode: content.materialsCode })
    },
    // 获取规格详情
    * querySkuDetail({ payload }, { call, update }) {
      yield update({
        addSkuModalVisible: true,
        addModalType: 'update',
        materialsSkuId: payload.materialsSkuId,
      })
      const { content } = yield call(querySkuDetail, payload)
      yield update({ currentItem: content })
    },
    // 获取规格列表
    * querySkuList({ payload }, { call, select, update }) {
      const { materialsId, searchSaveParam } = yield select(({ materialDetail }) => materialDetail)
      const { content: { data, current, total } } = yield call(querySkuList, {
        ...payload,
        ...searchSaveParam,
        materialsId,
      })
      yield update({
        skuList: data,
        pagination: { current, total },
      })
    },
    // 新增规格保存
    * saveSku({ payload }, { call, select, update }) {
      const { materialsId, materialsCode, searchSaveParam } = yield select(
        ({ materialDetail }) => materialDetail,
      )
      yield call(saveSku, { ...payload, materialsId, materialsCode })
      message.success('添加成功')
      yield update({
        addSkuModalVisible: false,
      })
      const { content: { data, current, total } } = yield call(querySkuList, {
        ...searchSaveParam,
        materialsId,
      })
      yield update({ skuList: data, pagination: { current, total } })
    },
    // update规格保存
    * updateSku({ payload }, { call, select, update }) {
      const { materialsId, materialsCode, searchSaveParam, materialsSkuId } = yield select(
        ({ materialDetail }) => materialDetail,
      )
      yield call(updateSku, { ...payload, materialsId, materialsCode, materialsSkuId })
      message.success('保存成功')
      yield update({
        addSkuModalVisible: false,
      })
      const { content: { data, current, total } } = yield call(querySkuList, {
        ...searchSaveParam,
        materialsId,
      })
      yield update({ skuList: data, pagination: { current, total } })
    },
    // 停用启用
    * onOffStatus({ payload }, { call, select, update }) {
      const { searchSaveParam, materialsId } = yield select(({ materialDetail }) => materialDetail)
      yield call(onOffStatus, payload)
      message.success('操作成功')
      const { content: { data, current, total } } = yield call(querySkuList, {
        ...searchSaveParam,
        materialsId,
      })
      yield update({ skuList: data, pagination: { current, total } })
    },
    // 批量停用启用
    * mountOnOffStatus({ payload }, { call, select, update }) {
      const { searchSaveParam, materialsId } = yield select(({ materialDetail }) => materialDetail)
      yield call(mountOnOffStatus, payload)
      message.success('操作成功')
      const { content: { data, current, total } } = yield call(querySkuList, {
        ...searchSaveParam,
        materialsId,
      })
      yield update({ skuList: data, pagination: { current, total } })
    },
    // 规格版本列表
    * getVersionList({ payload }, { call, select, update }) {
      const { materialsSkuId } = yield select(({ materialDetail }) => materialDetail)
      yield update({
        historyModalVisible: true,
        checkedHistoryArr: [],
      })
      const { content: { data, total, current } } = yield call(getVersionList, {
        ...payload,
        materialsSkuId,
      })
      yield update({
        historyPagination: { total, current },
        historyList: data,
      })
    },
    // 规格版本对比列表
    * getCompareList({ payload }, { call, update }) {
      yield update({
        compareModalVisible: true,
      })
      const { content } = yield call(getCompareList, payload)
      yield update({
        versionDoubleList: content,
      })
    },
    // 规格版本详情
    * queryVersionDetail({ payload }, { call, update }) {
      yield update({ viewModalVisible: true })
      const { content } = yield call(queryVersionDetail, payload)
      yield update({ viewCurrentData: content })
    },
    // 获取包装规格
    * queryPackageList({ payload }, { call, update }) {
      yield update({ packageModalVisible: true, materialsSkuId: payload.materialsSkuId })
      const { content } = yield call(queryPackageList, payload)
      yield update({ packageList: content })
    },
    // 保存包装规格
    * savePackage({ payload }, { call, select, update }) {
      const { materialsSkuId } = yield select(({ materialDetail }) => materialDetail)
      yield call(savePackage, { ...payload, materialsSkuId })
      message.success('保存成功')
      yield update({
        packageModalVisible: false,
      })
    },
    // 绑定条码
    * saveBarCodeList({ payload }, { call, update, select }) {
      const { materialsSkuId } = yield select(({ materialDetail }) => materialDetail)
      const data = yield call(saveBarCodeList, { ...payload, materialsSkuId })
      message.success('绑定成功')
      yield update({
        barCodeModalVisible: false,
      })
    },
    // 获取条码列表
    * queryBarCodeList({ payload }, { call, update, select }) {
      yield update({
        barCodeModalVisible: true,
        materialsSkuId: payload.materialsSkuId,
        barCodeList: [],
      })
      const { materialsSkuId } = yield select(({ materialDetail }) => materialDetail)
      const { content: { data } } = yield call(queryBarCodeList, { materialsSkuId })
      yield update({
        barCodeList: data,
      })
    },
    // 获取规则详情
    * queryRuleDetail({ payload }, { call, update }) {
      yield update({
        ruleModalVisible: true,
      })
      const { content } = yield call(queryRuleDetail, payload)
      yield update({
        barCodeRuleObj: content,
      })
    },
    // 解析条码
    * resoleCodeBar({ payload }, { call, update, select }) {
      const { barCodeList } = yield select(({ materialDetail }) => materialDetail)
      const { content } = yield call(resoleCodeBarData, payload.data)
      if (content.barcodeType === 2) {
        message.error('请扫描主码或全码', 3)
        return
      } else if (!content.barcodeType) {
        message.error('条码不存在', 3)
        return
      }
      let flag = false
      for (const mapObj of barCodeList) {
        if (
          mapObj.materialsBarcode === payload.data.barcode &&
          mapObj.materialsSkuBarcode === content.materialsSkuBarcode
        ) {
          flag = true
        }
      }
      if (flag) {
        message.error('已存在')
        return
      }
      message.success('解析成功')
      barCodeList.push({
        ...content,
        materialsBarcode: content.barcode,
        materialsBarcodeId: content.barcodeId,
      })
      yield update({
        barCodeList,
      })
      payload.fun()
    },
  },
  reducers: {},
})
