import { message } from 'antd'
import qs from 'qs'
import { cloneDeep } from 'lodash'
import modelExtend from '../../utils/modelExtend'
import { getServices } from '../../utils'

const servers = getServices({
  // 获取注册证对照列表
  getRegistListData: 'materials/register-certificate/compare/page-list',
  // 注册证对照详情
  getRegistDetailData: 'materials/register-certificate/compare/detail',
})
const initState = {
  searchData: {
    current: 1,
    pageSize: 10,
  }, // 注册证对照列表搜索条件
  pagination: {}, // 注册证对照列表翻页
  registList: [], // 注册证对照列表
}
export default modelExtend({
  namespace: 'registContrast',
  state: initState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const { pathname } = location
        if (pathname === '/materials/registContrast') {
          const reqObj = {}
          if (history.action !== 'POP') {
            dispatch({ type: 'updateState', payload: initState })
            reqObj.status = '0'
          }
          dispatch({
            type: 'getRegistList',
            payload: reqObj,
          })
        }
      })
    },
  },
  effects: {
    // 获取注册证对照列表
    * getRegistList({ payload }, { call, select, update }) {
      const { searchData } = yield select(({ registContrast }) => registContrast)
      const { content: { data, current, total, pageSize } } = yield call(servers.getRegistListData, { ...searchData, ...payload })
      yield update({
        searchData: {
          ...searchData,
          ...payload,
        },
        registList: data,
        pagination: {
          current,
          total,
          pageSize,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: tota => `共有 ${tota} 条数据`,
        },
      })
    },
  },
  reducers: {},
})
