import { modelExtend, getSetup } from '../../../utils'
import * as services from '../../../services/contacts/newContactsRelation'

const initState = {
  modalVisible: false,
  tableData: [],
  initValue: {},
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
    keywords: null,
  },
}

export default modelExtend({
  namespace: 'newContactsRelationHQ',
  state: { ...initState, ...unstableState },
  subscriptions: getSetup({
    path: '/contacts/newContactsRelationHQ',
    initFun({ toAction, history }) {
      toAction(initState)
      if (history.action !== 'POP') {
        toAction(unstableState)
      }
      toAction('relationList')
    },
  }),

  effects: {
    // 新的往来关系列表
    * relationList({ payload }, { call, toAction, select }) {
      const req = payload ||
        (yield select(({ newContactsRelationHQ }) => newContactsRelationHQ.searchKeys))
      const { content } = yield call(services.logistics, req)
      yield toAction({
        tableData: content.data || [],
        searchKeys: req,
        initValue: {},
        pageConfig: {
          current: content.current,
          pageSize: content.pageSize,
          total: content.total,
        },
      })
    },
    // 新的往来关系状态更改
    * relationStatus({ payload }, { call, toAction }) {
      yield call(services.relationStatus, payload)
      yield [
        toAction({ modalVisible: false }),
        toAction('relationList'),
      ]
    },
  },
})
