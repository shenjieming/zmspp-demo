import React from 'react'
import { modelExtend } from '../../utils'
import brandService from '../../services/materials/brand'
import { message, Modal } from 'antd'

const initialState = {
  brandList: [],
  factoryList: [],
  searchingFactory: '',
  addSearchingFactory: '',
  currentBrandDetail: {},
  pagination: {
    current: 1,
    pageSize: 10,
    total: null,
  },
  searchParam: {
    brandName: null,
    brandStatus: null,
    produceFactoryId: undefined,
  },
  addModalVisible: false,
  editModalVisible: false,
  checkedArr: [],
}

export default modelExtend({
  namespace: 'brand',
  state: initialState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/materials/brand') {
          dispatch({ type: 'updateState', payload: { ...initialState } })
          dispatch({ type: 'getNoFilterData', payload: { ...initialState } })
          dispatch({ type: 'getFactoryList' })
        }
      })
    },
  },
  effects: {
    // 无筛选数据
    * getNoFilterData({ payload }, { call, update }) {
      const param = payload.pagination
      const { content: { data, pageSize, total, current } } = yield call(brandService.getBrandListApi, { ...param })
      yield update({ pagination: { pageSize, total, current }, brandList: data })
    },
    // 筛选
    * filterData({ payload }, { call, update }) {
      const { content: { data, pageSize, total, current } } = yield call(brandService.getBrandListApi, { ...payload })
      yield update({ pagination: { pageSize, total, current }, brandList: data, searchParam: payload, checkedArr: [] })
    },
    // 翻页
    * pageChange({ payload }, { call, update, select }) {
      const { searchParam } = yield select(({ brand }) => brand)
      const { content: { data, pageSize, total, current } } = yield call(brandService.getBrandListApi, { ...payload, ...searchParam })
      yield update({ pagination: { pageSize, total, current }, brandList: data, checkedArr: [] })
    },
    // 页数+条件
    * searchCurrentParam(_, { call, update, select }) {
      const { searchParam, pagination } = yield select(({ brand }) => brand)
      const { content: { data, pageSize, total, current } } = yield call(brandService.getBrandListApi, { ...pagination, ...searchParam })
      yield update({ pagination: { pageSize, total, current }, brandList: data, checkedArr: [] })
    },
    // 获取厂商列表
    * getFactoryList({ payload }, { call, update }) {
      const { content } = yield call(brandService.getFactoryListApi, { ...payload })
      yield update({ factoryList: content })
    },
    // 编辑时的详情获取
    * loadDetail({ payload }, { call, update }) {
      const { content } = yield call(brandService.getBrandDetailApi, { ...payload })
      yield update({ currentBrandDetail: content })
    },
    // 更新单个状态
    * updateSingleState({ payload }, { call, put }) {
      yield call(brandService.updateBrandStatusApi, { ...payload })
      message.success('操作成功')
      yield put({ type: 'searchCurrentParam' })
    },
    // 批量更新状态
    * updateBatchStates({ payload }, { call, put }) {
      yield call(brandService.batchUpdateBrandStatusApi, { ...payload })
      message.success('操作成功')
      yield put({ type: 'searchCurrentParam' })
    },
    // 添加品牌
    * addBrand({ payload }, { call, put, update }) {
      const { content: { quantity, repeatNames } } = yield call(brandService.newBrandApi, { ...payload })
      if (repeatNames) {
        const content = (
          <div>
            {`已成功添加${quantity}条品牌新信息`}<br />
            如下品牌存在重复未添加：<br />
            {`${repeatNames}`}
          </div>
        )
        switch (quantity) {
          case 0:
            Modal.error({
              content,
            })
            break
          default:
            Modal.success({
              content,
            })
            break
        }
      } else {
        message.success('操作成功')
        yield put({ type: 'searchCurrentParam' })
      }
      yield update({ addModalVisible: false })
      yield put({ type: 'searchCurrentParam' })
    },
    // 编辑品牌
    * editBrand({ payload }, { call, put, update }) {
      yield call(brandService.updateBrandApi, { ...payload })
      yield update({ editModalVisible: false })
      message.success('操作成功')
      yield put({ type: 'searchCurrentParam' })
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload }
    },
  },
})
