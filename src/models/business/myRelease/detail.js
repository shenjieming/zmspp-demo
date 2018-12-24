/** 我的发布 */
import qs from 'qs'
import pathToRegexp from 'path-to-regexp'
import { message } from 'antd'
import modelExtend from '../../../utils/modelExtend'
import { getServices } from '../../../utils'

const services = getServices({
  detail: { url: '/business-chance/detail', type: 'get' }, // 我的发布详情
  replyList: { url: '/business-chance/my-release/replay-org-list', type: 'get' }, // 回复列表
  publishSessionList: { url: '/business-chance/my-release/communicate-detail', type: 'get' }, // 发布方回话详情
  publisherApi: '/business-chance/my-release/replay',
})
const initState = {
  detail: {}, // 发布详情
  replyList: [], // 回复列表
  sessionList: [],
  replyModalVisible: false, // 回复弹窗可见
  replyVisible: false, // 回复按钮可见
  currentReplyId: '',
}

export default modelExtend({
  namespace: 'myReleaseDetail',
  state: initState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname, search }) => {
        const query = qs.parse(search, { ignoreQueryPrefix: true })
        const match = pathToRegexp('/business/myRelease/detail').exec(pathname)
        if (match) {
          if (history.action !== 'POP') {
            // 初始化数据
            dispatch({ type: 'updateState', payload: initState })
          }
          const { chanceId } = query
          // 获取商机详情
          dispatch({ type: 'getDetail', payload: { chanceId } })
          // 发布方需要获取回复详情
          dispatch({ type: 'getReplyList', payload: { chanceId } })
        }
      })
    },
  },
  effects: {
    /** 我的发布详情 */
    * getDetail({ payload }, { call, update }) {
      const { content } = yield call(services.detail, payload)
      yield update({ detail: content })
    },
    // 获取回复列表
    * getReplyList({ payload }, { call, update }) {
      const { content } = yield call(services.replyList, payload)
      yield update({ replyList: content })
    },
    // 获取会话列表
    * getSessionList({ payload }, { select, call, update }) {
      const {
        detail: { chanceStatus },
      } = yield select(({ myReleaseDetail }) => myReleaseDetail)
      const {
        content: { replyItemsList },
      } = yield call(services.publishSessionList, payload)
      yield update({ sessionList: replyItemsList, replyVisible: chanceStatus === 4 })
    },
    // 回复
    * reply({ payload }, { select, call, put, update }) {
      const {
        detail: { chanceId },
        currentReplyId,
      } = yield select(({ myReleaseDetail }) => myReleaseDetail)
      yield call(services.publisherApi, { chanceId, replayId: currentReplyId, ...payload })
      message.success('回复成功!')
      yield update({ replyModalVisible: false })
      yield put({ type: 'getSessionList', payload: { replayId: currentReplyId } })
    },
  },
  reducers: {},
})
