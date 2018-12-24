import { isEmpty } from 'lodash'
import {
  customerListData,
} from '../../services/supplyCatalogue'
import dvaModelExtend from '../../utils/modelExtend'

const initState = {
  searchData: { current: 1, pageSize: 10 }, // 搜索条件
  dataSource: [], // 客户列表
  pagination: {}, // 客户列表分页
  LkcTableColumns: [], //
}

export default dvaModelExtend({
  namespace: 'supplyCatalogue',
  state: {},
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/supplyCatalogue') {
          if (history.action !== 'POP') {
            // 初始化数据
            dispatch({
              type: 'updateState',
              payload: initState,
            })
          }

          dispatch({ type: 'getTableColumns' })

          // 获取我的客户列表数据
          dispatch({ type: 'getCustomerList' })
        }
      })
    },
  },
  effects: {
    // 获取客户列表
    * getCustomerList({ payload }, { call, put, select }) {
      const searchData = yield select(({ supplyCatalogue }) => supplyCatalogue.searchData)
      const { content } = yield call(customerListData, { ...searchData, ...payload })
      yield put({
        type: 'updateState',
        payload: {
          searchData: {
            ...searchData,
            ...payload,
          },
          dataSource: content.data,
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
    * getTableColumns(_, { select, update }) {
      const { user } = yield select(({ app }) => app)
      const obj = JSON.parse(localStorage.getItem(user.userId))
      if (!isEmpty(obj) && !isEmpty(obj.config) && obj.config.supplyCatalogue.length) {
        yield update({
          LkcTableColumns: obj.config.supplyCatalogue,
        })
      }
    },
  },
  reducers: {

  },
})
