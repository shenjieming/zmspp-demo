import { message as Message } from 'antd'
import modelExtend from '../../utils/modelExtend'
import services from '../../services/message/list'

const tableDefaultProps = {
  current: 1,
  pageSize: 10,
}

const initialState = {
  msgTypes: [],
  dataSource: [],
  ...tableDefaultProps,
  total: 0,
  menuId: undefined,
  msgTemplateId: undefined,
}

const namespace = 'messageList'

export default modelExtend({
  namespace,

  state: initialState,

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/message/list') {
          if (history.action === 'POP') {
            dispatch({ type: 'getMsgTypes' })
            dispatch({ type: 'getMsgListDefault' })
          } else {
            dispatch({ type: 'reset' })
            dispatch({ type: 'getMsgTypes' })
            dispatch({ type: 'getInitialMsgList' })
          }
        }
      })
    },
  },

  effects: {
    // 获取所有消息类型
    * getMsgTypes(_, { call, update }) {
      const { content } = yield call(services.getMsgTypes)
      yield update({ msgTypes: content })
    },
    // 返回时重新查询
    * getMsgListDefault(_, { put, select }) {
      const { current, pageSize, menuId, msgTemplateId } = yield select(store => store[namespace])
      yield put({ type: 'getMsgList', payload: { current, pageSize, menuId, msgTemplateId } })
    },
    // 查询消息
    * getMsgList({ payload }, { call, update }) {
      const {
        content: {
          msgs,
          current,
          pageSize,
          total,
        },
      } = yield call(services.getMsgList, payload)
      yield update({ dataSource: msgs, current, pageSize, total })
    },
    // 清空查询
    * getInitialMsgList(_, { put }) {
      yield put({ type: 'getMsgList', payload: tableDefaultProps })
    },
    // 全部标记为已读
    * setAllRead(_, { call, put, select }) {
      const { menuId,
        msgTemplateId,
        current,
        pageSize } = yield select(({ messageList }) => messageList)
      yield call(services.setReadAll, { menuId, msgTemplateId })
      Message.success('全部标记为已读')
      yield put({
        type: 'getMsgList',
        payload: { menuId, msgTemplateId, current, pageSize },
      })
    },
    // 级联选择器切换
    * cascaderChange({ payload }, { update, put }) {
      const [menuId, msgTemplateId] = payload
      yield update({ menuId, msgTemplateId })
      yield put({ type: 'getMsgList', payload: { menuId, msgTemplateId, ...tableDefaultProps } })
    },
    // 设置单行为已读
    * setReadOne({ payload }, { call, put }) {
      yield call(services.setReadOne, { msgId: payload })
      yield put({ type: 'setRead', payload })
    },
  },
  reducers: {
    reset: () => ({ ...initialState }),
    // 将数据设为已读
    setRead(state, { payload }) {
      let dataSource = state.dataSource
      dataSource = dataSource.map((x) => {
        if (x.msgId === payload) {
          return { ...x, msgReadStatus: true }
        }
        return x
      })
      return { ...state, dataSource }
    },
  },
})
