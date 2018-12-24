/** 我的发布 */
import qs from 'qs'
import pathToRegexp from 'path-to-regexp'
import modelExtend from '../../utils/modelExtend'
import { getServices } from '../../utils'

const services = getServices({
  detail: { url: '/business-chance/platform-review-detail', type: 'get' }, // 我的发布详情
  replyList: { url: '/business-chance/my-release/replay-org-list', type: 'get' }, // 回复机构列表
  publishSessionList: { url: '/business-chance/platform-communicate-detail', type: 'get' }, // 发布方回话详情
  deleteSubmit: { url: '/business-chance/platform-delete', type: 'put' }, // 删除
  handleEndSubmit: { url: '/business-chance/platform-manually-end', type: 'put' }, // 手动结束
  nextSubmit: { url: '/business-chance/platform-review-next', type: 'get' }, // 下一条
  pastSubmit: { url: '/business-chance/review-pass', type: 'put' }, // 审核通过
  refulsedSubmit: { url: '/business-chance/review-refuse', type: 'put' }, // 审核拒绝
  topSubmit: { url: '/business-chance/set-top', type: 'put' }, // 置顶
  shieldSubmit: { url: '/business-chance/shield', type: 'put' }, // 屏蔽
  combineSubmit: { url: '/business-chance/platform-combine', type: 'put' }, // 达成合作
})
const initState = {
  chanceId: '',
  showReplyList: false, // 是否展示回复列表
  detail: {}, // 发布详情
  replyList: [], // 回复机构列表
  sessionList: [], // 回复对话详情列表
  replyModalVisible: false, // 回复弹窗可见
  btnDisabled: false,
  modalVisible: false, // 达成合作弹框visible
}

export default modelExtend({
  namespace: 'businessExamineDetail',
  state: initState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname, search }) => {
        const query = qs.parse(search, { ignoreQueryPrefix: true })
        const match = pathToRegexp('/businessExamine/:id').exec(pathname)
        if (match) {
          if (history.action !== 'POP') {
            // 初始化数据
            dispatch({ type: 'updateState', payload: initState })
          }
          const { isPublisher } = query
          if (isPublisher === 'true') {
            dispatch({ type: 'updateState', payload: { showReplyList: true } })
          } else {
            dispatch({ type: 'updateState', payload: { showReplyList: false } })
          }
          dispatch({
            type: 'updateState',
            payload: {
              chanceId: match[1],
            },
          })
          // 获取商机详情
          dispatch({
            type: 'getDetail',
            payload: {
              chanceId: match[1],
            },
          })
          if (isPublisher === 'true') {
            // 发布方需要获取回复详情
            dispatch({
              type: 'getReplyList',
              payload: {
                chanceId: match[1],
              },
            })
          }
          // } else {
          //   dispatch({ type: 'getSessionList', payload: match[1] })
          // }
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
    // 获取回复机构列表
    * getReplyList({ payload }, { call, update }) {
      const { content } = yield call(services.replyList, payload)
      yield update({ replyList: content })
    },
    // 获取会话列表
    * getSessionList({ payload }, { call, update }) {
      const { content } = yield call(services.publishSessionList, payload)
      yield update({ sessionList: content.replyItemsList })
    },
    // 删除
    * deleteSubmit({ payload }, { call }) {
      yield call(services.deleteSubmit, payload)
    },
    // 手动结束
    * handleEndSubmit({ payload }, { call }) {
      yield call(services.handleEndSubmit, payload)
    },
    // 下一条
    * nextSubmit({ payload }, { call }) {
      const { content } = yield call(services.nextSubmit, payload)
      return content
      // yield update({ detail: content })
    },
    // 审核通过
    * pastSubmit({ payload }, { call }) {
      yield call(services.pastSubmit, payload)
    },
    // 审核拒绝
    * refulsedSubmit({ payload }, { call }) {
      yield call(services.refulsedSubmit, payload)
    },
    // 置顶
    * topSubmit({ payload }, { call }) {
      yield call(services.topSubmit, payload)
    },
    // 屏蔽
    * shieldSubmit({ payload }, { call }) {
      yield call(services.shieldSubmit, payload)
    },
    // 达成合作
    * combineSubmit({ payload }, { call }) {
      yield call(services.combineSubmit, payload)
    },
  },
  reducers: {},
})
