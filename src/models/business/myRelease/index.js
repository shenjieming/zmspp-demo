import { message } from 'antd'
import modelExtend from '../../../utils/modelExtend'
import { getServices } from '../../../utils'

const services = getServices({
  list: '/business-chance/my-releases/list',
  getNums: {
    url: '/business-chance/personal-statistics',
    type: 'get',
  },
  getBroadCast: {
    url: '/business-chance/carousel',
    type: 'get',
  },
  manuallyEnd: {
    url: '/business-chance/my-releases/end',
    type: 'put',
  },
  deleteChance: {
    url: '/business-chance/my-releases/delete',
    type: 'put',
  },
  combine: {
    url: '/business-chance/my-releases/combine',
    type: 'put',
  },
})
const initState = {
  // 商机列表
  dataList: [],
  // 轮播数据
  broadCasts: [],
  // 右侧发布数量集合
  infoNums: {
    chanceCombineNumber: 0, // 达成合作数量
    chanceDraftNumber: 0, // 草稿数量
    chanceIntegralBlance: 0, // 积分数量
    chanceNumber: 0, // 发布数量
  },
  // 翻页参数
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
  },
  // 搜索参数
  searchParams: {},
  currentItem: {},
}
export default modelExtend({
  namespace: 'myRelease',
  state: initState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/business/myRelease') {
          if (history.action !== 'POP') {
            // 设置初始状态
            dispatch({ type: 'updateState', payload: initState })
          }
          dispatch({ type: 'getData' })
          dispatch({ type: 'getNums' })
          dispatch({ type: 'getBroadCast' })
        }
      })
    },
  },
  effects: {
    //  获取商机列表
    * getData({ payload = {} }, { select, call, update }) {
      const { toPrevWhenShould } = payload
      const { dataList, pagination, searchParams } = yield select(({ myRelease }) => myRelease)
      if (toPrevWhenShould && dataList.length === 1) {
        pagination.current = pagination.current - 1 || 1
      }
      const params = { ...pagination, ...searchParams, ...payload }
      const {
        content: { data, current, total, pageSize },
      } = yield call(services.list, { ...params })
      yield update({
        dataList: data,
        pagination: { current, total, pageSize },
      })
    },
    // 获取统计书数据
    * getNums(_, { call, update }) {
      const { content } = yield call(services.getNums)
      yield update({ infoNums: content })
    },
    // 获取广播列表
    * getBroadCast(_, { call, update }) {
      const { content } = yield call(services.getBroadCast)
      yield update({ broadCasts: content })
    },
    // 手动结束
    * manuallyEnd({ payload }, { call, put }) {
      yield call(services.manuallyEnd, { ...payload })
      yield put({ type: 'getData' })
      message.success('操作成功!')
    },
    // 删除
    * deleteChance({ payload }, { call, put }) {
      yield call(services.deleteChance, { ...payload })
      yield put({ type: 'getData' })
      message.success('操作成功!')
    },
    * combine({ payload }, { select, call, put, update }) {
      const {
        currentItem: { chanceId },
      } = yield select(({ myRelease }) => myRelease)
      yield call(services.combine, { chanceId, ...payload })
      yield put({ type: 'getData' })
      yield update({ combineModalVisible: false })
      message.success('操作成功!')
    },
  },
  reducers: {},
})
