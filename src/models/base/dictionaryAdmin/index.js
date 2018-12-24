import { message } from 'antd'
import { modelExtend, getSetup } from '../../../utils'
import * as services from '../../../services/base/dictionaryAdmin'

const initState = {
  modalVisible: false,
  modalType: 'create',
  tableData: [],
  modalInitValue: {},
  pageConfig: {
    current: 1,
    pageSize: 10,
    total: null,
  },
}
const unstableState = {
  searchKeys: {
    current: 1,
    pageSize: 10,
    dicType: null,
    keywords: null,
  },
}

export default modelExtend({
  namespace: 'dictionaryAdmin',
  state: { ...initState, ...unstableState },
  subscriptions: getSetup({
    path: '/base/dictionaryAdmin',
    initFun({ toAction, history }) {
      toAction(initState)
      if (history.action !== 'POP') {
        toAction(unstableState)
      }
      toAction('listDics')
    },
  }),

  effects: {
    // 分页获取字典列表
    * listDics({ payload }, { call, toAction, select }) {
      const req = payload ||
        (yield select(({ dictionaryAdmin }) => dictionaryAdmin.searchKeys))
      const { content } = yield call(services.listDics, req)
      yield toAction({
        tableData: content.dictionarys,
        searchKeys: req,
        modalInitValue: {},
        pageConfig: {
          current: content.current,
          pageSize: content.pageSize,
          total: content.total,
        },
      })
    },
    // 新增字典
    * saveDic({ payload }, { call, toAction }) {
      yield call(services.saveDic, payload)
      yield toAction('listDics')
      yield toAction({ modalVisible: false })
      message.success('保存成功')
    },
    // 连续新增字典
    * saveAdd({ payload }, { call, toAction }) {
      yield call(services.saveDic, payload.data)
      yield toAction('listDics')
      payload.fun()
      message.success('保存成功')
    },
    // 修改、停用字典
    * updateDic({ payload }, { call, toAction }) {
      yield call(services.updateDic, payload)
      yield toAction('listDics')
      yield toAction({ modalVisible: false })
      message.success('保存成功')
    },
  },

})
