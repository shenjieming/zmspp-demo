/** 商机后台审核 */
import { cloneDeep, isArray } from 'lodash'
import moment from 'moment'
import modelExtend from '../../utils/modelExtend'
import { getServices } from '../../utils'

const services = getServices({
  list: '/business-chance/review', // 审批列表
  pendList: '/business-chance/pending-review', // 待审核列表
  accountNum: { url: '/business-chance/platform-statistics', type: 'get' }, // 数量统计
  refresh: { url: '/business-chance/platform/history-count/refresh', type: 'get' }, // 刷新事件
})
const initState = {
  // 推送列表
  data: [],
  // 分页信息
  pagination: {
    current: 1,
    pageSize: 10,
    total: undefined,
  },
  // 搜索参数
  searchParams: {},
  accountNum: {}, // 统计数量
  tabType: 'pending', // all 全部列表 pending 带审核状态
}

const handleData = (params = {}) => {
  const obj = cloneDeep(params)
  if (params &&
    params.releaseTimeRangeStart &&
    isArray(params.releaseTimeRangeStart) &&
    params.releaseTimeRangeStart.length) {
    obj.releaseTimeRangeEnd = moment(params.releaseTimeRangeStart[1]).format('YYYY-MM-DD')
    obj.releaseTimeRangeStart = moment(params.releaseTimeRangeStart[0]).format('YYYY-MM-DD')
  } else {
    obj.releaseTimeRangeEnd = undefined
    obj.releaseTimeRangeStart = undefined
  }
  return obj
}

export default modelExtend({
  namespace: 'businessExamine',
  state: initState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/businessExamine') {
          if (history.action !== 'POP') {
            // 初始化数据
            dispatch({ type: 'updateState', payload: initState })
          }
          // 获取我的发布
          dispatch({ type: 'backJudge' })
          // 获取统计数量
          dispatch({
            type: 'getAccount',
          })
        }
      })
    },
  },
  effects: {
    * backJudge({ payload }, { select, put }) {
      const { tabType } = yield select(({ businessExamine }) => businessExamine)
      let url = 'getPendData'
      if (tabType === 'all') {
        url = 'getData'
      }
      yield put({
        type: url,
        payload,
      })
    },
    /** 商机审核列表 */
    * getData({ payload }, { call, update, select }) {
      const { searchParams, pagination } = yield select(({ businessExamine }) => businessExamine)

      const {
        content: { data, current, total, pageSize },
      } = yield call(services.list, { ...handleData(searchParams), ...pagination, ...payload })
      yield update({ data, pagination: { current, total, pageSize } })
    },
    /** 待审核列表 */
    * getPendData({ payload }, { call, update, select }) {
      const { searchParams, pagination } = yield select(({ businessExamine }) => businessExamine)
      const {
        content: { data, current, total, pageSize },
      } = yield call(services.pendList, { ...handleData(searchParams), ...pagination, ...payload })
      yield update({ data, pagination: { current, total, pageSize } })
    },
    /** 获取统计数量 */
    * getAccount({ payload }, { call, update }) {
      const { content } = yield call(services.accountNum, payload)
      yield update({
        accountNum: content,
      })
    },
    // 刷新
    * refresh({ payload }, { call }) {
      yield call(services.refresh, payload)
    },
  },
  reducers: {},
})

