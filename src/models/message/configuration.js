import { message as Message } from 'antd'
import modelExtend from '../../utils/modelExtend'
import services from '../../services/message/configuration'

// 默认表格参数
const defaultTableProps = {
  keywords: '',
  pageSize: 10,
  current: 1,
}

const initialState = {
  configList: [],
  dataSource: [],
  total: 0,
  ...defaultTableProps,
  visible: false,
  currentSwitchTemplate: {},
}

export default modelExtend({
  namespace: 'msgConfig',

  state: initialState,

  subscriptions: {
    setup({ history, dispatch }) {
      history.listen(({ pathname }) => {
        if (pathname === '/message/configuration') {
          dispatch({ type: 'getMsgConfigList' })
        }
      })
    },
  },

  effects: {
    // 获取消息列表配置
    * getMsgConfigList(_, { call, update }) {
      const { content } = yield call(services.getMsgConfigList)
      yield update({ configList: content })
    },
    // 获取所有人员名单
    * getAllUser({ payload }, { call, update }) {
      const {
        content: { current, pageSize, total, data },
      } = yield call(services.getAllUser, payload)
      yield update({ dataSource: data, current, pageSize, total })
    },
    // 重置并查询
    * resetAndSearch(_, { put, update }) {
      yield update({ keywords: defaultTableProps.keywords })
      yield put({ type: 'getAllUser', payload: defaultTableProps })
    },
    // 高级搜索
    * advancedSeach({ payload }, { put }) {
      yield put({
        type: 'getAllUser',
        payload: { ...defaultTableProps, keywords: payload },
      })
    },
    // 打开更换窗口并查询
    * openAndSearch({ payload }, { put, update }) {
      yield update({ currentSwitchTemplate: payload, visible: true })
      yield put({ type: 'resetAndSearch' })
    },
    // 更换人员
    * recevierUpdate({ payload }, { call, update, put }) {
      yield call(services.receiverUpdate, payload)
      Message.success('更换成功')
      yield update({ visible: false })
      yield put({ type: 'getMsgConfigList' })
    },
    // 改变配置状态
    * changeConfigStatus({ payload }, { call, put }) {
      yield call(services.changeConfigStatus, payload)
      Message.success('操作成功')
      yield put({ type: 'getMsgConfigList' })
    },
  },
})
