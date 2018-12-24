import { message } from 'antd'
import pathToRegexp from 'path-to-regexp'
import {
  dictionListData,
  dictionAddData,
  factoryListData,
  categoryListData,
  registListData,
  materialsCheckData,
  saveToPushData,
  pushToExamineData,
  getBrandList,
  getCertificateList,
} from '../../services/supplyCatalogue/dictionSelect'
import dvaModelExtend from '../../utils/modelExtend'

const initState = {
  customerId: '', // 详情页的Id
  customerOrgName: '', // 客户名称
  searchData: {}, // 搜索条件
  dataSource: [], // 标准字典表格数据
  pagination: {}, // 标准字典表格表格分页
  rowData: {}, // 一行数据
  addModalVisible: false,
  inviteRequired: false,
  factoryList: [], // 厂家列表
  categoryList: [], // 标准分类
  registList: [], // 注册证列表

  selectedRowKeys: [], // 表格批量操作数据
  selectedRows: [],
  batchAddModalVisible: false, // 批量加入供货目录
  batchDataList: [{
    brandId: null,
    brandName: null,
    catalogFlag: 0,
    certificateId: null,
    certificateNo: null,
    factoryId: '16FDB3CAF5761E6BE050007F01006148',
    factoryName: '广州科莱瑞迪医疗器材公司',
    materialsCommonName: '魔术贴毛面',
    materialsId: 'ECE2B2419EE948F5B49171C4DD4A3DE8',
    materialsName: '魔术贴毛面',
    materialsSku: 'FZ-2338B',
    materialsSkuId: '5EF724B310434372929E0814C9037B2F',
    materialsUnit: '66',
    materialsUnitText: '卷',
  }],

  branOptionList: [],
  allCheck: false, // 默认全选复选框
}

export default dvaModelExtend({
  namespace: 'dictionSelect',
  state: {},
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const match = pathToRegexp('/supplyCatalogue/detail/:id/dictionSelect').exec(pathname)
        if (match) {
          const customerId = match[1]
          // 初始化数据
          dispatch({
            type: 'updateState',
            payload: {
              ...initState,
              customerId,
            },
          })
          dispatch({
            type: 'app/getPackageUnit',
          })
          // 获取字典列表
          dispatch({
            type: 'getDictionList',
            payload: {
              current: 1,
              pageSize: 10,
              customerOrgId: customerId,
            },
          })
          // 获取厂家
          dispatch({
            type: 'getFactoryList',
            payload: {
              keywords: '',
            },
          })
          // 获取注册证
          dispatch({
            type: 'getRegistList',
          })
          // 获取标准分类
          dispatch({
            type: 'getCategoryList',
          })

          // 品牌
          // dispatch({
          //   type: 'getBrandList',
          //   payload: {
          //     keywords: '',
          //   },
          // })
        }
      })
    },
  },
  effects: {
    // 获取标准字典列表
    * getDictionList({ payload }, { call, put }) {
      const { content } = yield call(dictionListData, payload)
      yield put({
        type: 'updateState',
        payload: {
          searchData: payload,
          dataSource: content.data,
          customerOrgName: content.customerOrgName,
          pagination: {
            current: content.current,
            total: content.total,
            pageSize: content.pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: total => `共有 ${total} 条数据`,
          },
        },
      })
    },
    // 加入目录
    * setDictionAddData({ payload }, { call, put, select }) {
      const customerId = yield select(({ dictionSelect }) => dictionSelect.customerId)
      const searchData = yield select(({ dictionSelect }) => dictionSelect.searchData)
      yield call(dictionAddData, { ...payload, customerOrgId: customerId })
      yield put({
        type: 'updateState',
        payload: {
          addModalVisible: false,
        },
      })
      message.success('操作成功')
      yield put({
        type: 'getDictionList',
        payload: {
          ...searchData,
          customerOrgId: customerId,
        },
      })
    },
    // 获取厂家
    getFactoryList: [function* ({ payload }, { call, put }) {
      const { content } = yield call(factoryListData, payload)
      yield put({
        type: 'updateState',
        payload: {
          factoryList: content.data,
        },
      })
    }, { type: 'takeLatest' }],
    // 获取标准分类
    getCategoryList: [function* ({ payload }, { call, put }) {
      const { content } = yield call(categoryListData, payload)
      yield put({
        type: 'updateState',
        payload: {
          categoryList: content,
        },
      })
    }, { type: 'takeLatest' }],
    // 获取注册证
    getRegistList: [function* ({ payload }, { call, put }) {
      const { content } = yield call(registListData, payload)
      yield put({
        type: 'updateState',
        payload: {
          registList: content,
        },
      })
    }, { type: 'takeLatest' }],
    // 证件判断
    * materialsCheck({ payload }, { call }) {
      const { content } = yield call(materialsCheckData, payload)
      return content
    },
    // 推送至待审核
    * saveToPush({ payload }, { call, put, select }) {
      const { customerId, searchData } = yield select(({ dictionSelect }) => dictionSelect)
      yield call(saveToPushData, payload)
      message.success('操作成功')
      yield put({
        type: 'updateState',
        payload: {
          addModalVisible: false,
        },
      })
      yield put({
        type: 'getDictionList',
        payload: {
          ...searchData,
          customerOrgId: customerId,
        },
      })
    },
    // 推送审核
    * pushToExamine({ payload }, { call, put, select }) {
      const { customerId, searchData } = yield select(({ dictionSelect }) => dictionSelect)
      yield call(pushToExamineData, payload)
      message.success('操作成功')
      yield put({
        type: 'updateState',
        payload: {
          addModalVisible: false,
        },
      })
      yield put({
        type: 'getDictionList',
        payload: {
          ...searchData,
          customerOrgId: customerId,
        },
      })
    },
    * getCertificateList({ payload }, { call, update }) {
      const { content } = yield call(getCertificateList, payload)
      yield update({
        certificateOptionList: content,
      })
      return content
    },
    * getBrandList({ payload }, { call, update }) {
      const { content } = yield call(getBrandList, payload)
      yield update({
        branOptionList: content,
      })
      return content
    },
  },
  reducers: {

  },
})
