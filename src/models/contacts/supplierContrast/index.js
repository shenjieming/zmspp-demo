import { parse } from 'qs'
import {
  getContrastListData,
  getOrgListData,
  setContrastData,
} from '../../../services/contacts/supplierContrast'
import modelExtend from '../../../utils/modelExtend'
import { message } from 'antd'
// 初始化数据
const initState = {
  searchData: {}, // 搜索条件
  pagination: {
    current: 1,
    pageSize: 10,
  }, // 供应商对照列表分页
  modalVisible: false, // 弹框
  modalTitleFlag: false, // 对比和重新对比
  dataSource: [], // 列表数据
  orgNameList: [], // 供应商名称模糊匹配数组
  defaultRowData: {}, // 默认的行数据
}

export default modelExtend({
  namespace: 'supplierContrast',
  state: {},
  subscriptions: {
    setup({ dispatch, history }) {
      // 获取地址
      history.listen(({ pathname, search }) => {
        const query = parse(search, { ignoreQueryPrefix: true })
        if (pathname === '/contacts/supplierContrast') {
          // 初始化数据
          dispatch({ type: 'updateState', payload: initState })
          // 供应商对照列表
          dispatch({ type: 'getContrastList', payload: { comparisonStatus: query ? query.comparisonStatus : null } })
        }
      })
    },
  },
  effects: {
    // 获取供应商对照列表
    * getContrastList({ payload }, { call, update }) {
      const { content } = yield call(getContrastListData, payload)
      yield update({
        searchData: payload,
        dataSource: content.data,
        pagination: {
          current: content.current,
          total: content.total,
          pageSize: content.pageSize,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: total => `共有 ${total} 条数据`,
        },
      })
    },
    // 获取模糊匹配组织名称
    * getOrgList({ payload }, { call, update }) {
      const { content } = yield call(getOrgListData, payload)
      yield update({
        orgNameList: content,
      })
    },
    // 对照  重新对照
    * setContrast({ payload }, { call, put, select }) {
      const data = yield call(setContrastData, payload)
      message.success('对照成功', 3)
      yield put({
        type: 'updateState',
        payload: {
          modalVisible: false,
        },
      })
      const searchData = yield select(({ supplierContrast }) => supplierContrast.searchData)
      yield put({
        type: 'getContrastList',
        payload: searchData,
      })
    },
  },
  reducers: {

  },
})
