import { message } from 'antd'
import { modelExtend, getSetup } from '../../../utils'
import * as services from '../../../services/base/dictionaryAdmin/dictionaryDetail'

const initState = {
  modalVisible: false,
  modalType: 'create',
  searchKeys: {
    current: 1,
    pageSize: 10,
    dicValueStatus: null,
    keywords: null,
    dicId: null,
  },
  tableData: [],
  modalInitValue: {},
  pageConfig: {
    current: 1,
    pageSize: 10,
    total: null,
  },
  checked: false,
}

export default modelExtend({
  namespace: 'dictionaryDetail',
  state: initState,
  subscriptions: getSetup({
    path: '/base/dictionaryAdmin/detail/:id',
    initFun({ toAction, id }) {
      toAction(initState)
      toAction({
        ...initState.searchKeys,
        dicId: id,
      }, 'listDicValues')
    },
  }),

  effects: {
    // 分页获取字典值列表
    * listDicValues({ payload }, { call, toAction, select }) {
      const req = payload ||
        (yield select(({ dictionaryDetail }) => dictionaryDetail.searchKeys))
      const { content } = yield call(services.listDicValues, req)
      yield toAction({
        tableData: content.dictionaryValues,
        searchKeys: req,
        modalInitValue: {
          dicId: req.dicId,
        },
        pageConfig: {
          current: content.current,
          pageSize: content.pageSize,
          total: content.total,
        },
      })
    },
    // 新增字典值
    * saveDicValue({ payload }, { call, toAction }) {
      yield call(services.saveDicValue, payload)
      yield toAction('listDicValues')
      yield toAction({
        modalVisible: false,
        checked: false,
      })
      message.success('保存成功')
    },
    // 连续新增字典值
    * saveAdd({ payload }, { call, toAction }) {
      yield call(services.saveDicValue, payload.data)
      yield toAction('listDicValues')
      yield toAction({
        checked: false,
      })
      payload.fun()
      message.success('保存成功')
    },
    // 修改、停用字典值
    * updateDicValue({ payload }, { call, toAction }) {
      yield call(services.updateDicValue, payload)
      yield toAction('listDicValues')
      yield toAction({ modalVisible: false })
      message.success('保存成功')
    },
  },
})
