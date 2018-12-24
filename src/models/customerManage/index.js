import { message } from 'antd'
import { modelExtend, getServices } from '../../utils'

const initalState = {
  searchData: {}, // 搜索条件
  fileList: [], // 上传图片列表
  addModalVisible: false, // 添加sql弹框
  detailModalVisible: false, // 详情弹框visible
  splDetail: {}, // 获取sql详情
  selectedRowData: {}, // 选择的行数据
  pageConfig: {
    current: 1,
    pageSize: 10,
    total: null,
  },
}
const services = getServices({
  // 获取列表信息
  getTableListData: 'log/api-sql-list',
  // 新增SQL
  addSqlData: 'mq/send/api-sql',
  // 获取Sql详情
  getSqlDetailData: 'log/api-sql-detail',
})
export default modelExtend({
  namespace: 'customerManage',
  state: initalState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const { pathname } = location
        if (pathname === '/customerManage') {
          if (history.action !== 'POP') {
            dispatch({ type: 'updateState', payload: initalState })
          }
          dispatch({
            type: 'getTableList',
            payload: {
              current: 1,
              pageSize: 10,
            },
          })
        }
      })
    },
  },
  effects: {
    // 获取栏目下拉框数据
    * getTableList({ payload }, { call, update }) {
      const { content } = yield call(services.getTableListData, payload)
      yield update({
        fileList: content.data,
        searchData: payload,
        pageConfig: {
          current: content.current,
          pageSize: content.pageSize,
          total: content.total,
        },
      })
    },
    // 新增SQL
    * addSql({ payload }, { call, update, put, select }) {
      yield call(services.addSqlData, payload)
      yield update({
        addModalVisible: false,
      })
      message.success('新增成功')
      const searchData = yield select(({ customerManage }) => customerManage.searchData)
      yield put({
        type: 'getTableList',
        payload: searchData,
      })
    },
    // 获取SQL详情
    * getSqlDetail({ payload }, { call, update }) {
      const { content } = yield call(services.getSqlDetailData, payload)
      yield update({
        splDetail: content,
      })
    },
  },
  reducers: {
  },
})
