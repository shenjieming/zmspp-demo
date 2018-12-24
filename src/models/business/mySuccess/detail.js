/** 我的发布 */
import qs from 'qs'
import pathToRegexp from 'path-to-regexp'
import { message } from 'antd'
import modelExtend from '../../../utils/modelExtend'
import { getServices } from '../../../utils'

const services = getServices({
  detail: { url: '/business-chance/detail', type: 'get' }, // 我的发布详情
  replyList: { url: '/business-chance/my-release/replay-org-list', type: 'get' }, // 回复列表
  replySessionList: { url: '/business-chance/my-participant/communicate-detail', type: 'get' }, // 发布方回话详情
  publishSessionList: { url: '/business-chance/my-release/communicate-detail', type: 'get' }, // 发布方回话详情
  replyApi: 'business-chance/my-participant/replay',
  publisherApi: '/business-chance/my-release/replay',
  getContact: { url: 'business-chance/my-participant/contact-detail', type: 'get' },
})
const initState = {
  detail: {}, // 发布详情
  showReplyList: false, // 是否展示回复列表
  replyList: [], // 回复列表
  sessionList: [],
  replyModalVisible: false, // 回复弹窗可见
  replyVisible: false, // 回复按钮可见
  currentReplyId: '',
  showNumber: false,
  publisherInfo: {},
}

export default modelExtend({
  namespace: 'mySuccessDetail',
  state: initState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname, search }) => {
        const query = qs.parse(search, { ignoreQueryPrefix: true })
        const match = pathToRegexp('/business/mySuccess/detail').exec(pathname)
        if (match) {
          if (history.action !== 'POP') {
            // 初始化数据
            dispatch({ type: 'updateState', payload: initState })
          }
          const { chanceId, isPublisher } = query
          if (isPublisher === 'true') {
            dispatch({ type: 'updateState', payload: { showReplyList: true } })
          } else {
            dispatch({ type: 'updateState', payload: { showReplyList: false } })
          }
          dispatch({ type: 'updateState', payload: { isPublisher } })
          // 获取商机详情
          dispatch({ type: 'getDetail', payload: { chanceId } }).then(() => {
            if (isPublisher === 'true') {
              // 发布方需要获取回复详情
              dispatch({ type: 'getReplyList', payload: { chanceId } })
            } else {
              dispatch({ type: 'getSessionList', payload: { chanceId } })
            }
          })
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
      const { isPublisher } = yield select(({ mySuccessDetail }) => mySuccessDetail)
      let response
      if (isPublisher === 'true') {
        response = yield call(services.publishSessionList, payload)
      } else {
        response = yield call(services.replySessionList, payload)
      }
      const {
        content: { replyItemsList },
      } = response
      yield update({ sessionList: replyItemsList })
    },
    // 回复
    * reply({ payload }, { select, call, put, update }) {
      const {
        detail: { chanceId },
        currentReplyId,
        isPublisher,
      } = yield select(({ mySuccessDetail }) => mySuccessDetail)
      if (isPublisher === 'true') {
        yield call(services.publisherApi, { chanceId, replayId: currentReplyId, ...payload })
      } else {
        yield call(services.replyerApi, { chanceId, ...payload })
      }
      message.success('回复成功!')
      yield update({ replyModalVisible: false })
      yield put({ type: 'getSessionList', payload: { chanceId, replayId: currentReplyId } })
    },
    // 获取联系方式
    * getContact({ payload }, { call, update }) {
      const { content } = yield call(services.getContact, payload)
      message.success('获取成功!')
      yield update({ showNumber: true, publisherInfo: content })
    },
  },
  reducers: {},
})
