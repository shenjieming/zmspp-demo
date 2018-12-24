import { message } from 'antd'
import * as services from '../../services/certificateAudit/certificateAudit'
import { modelExtend, getSetup } from '../../utils'

const initState = {
  searchKeys: {
    backPageType: 1,
    current: 1,
    pageSize: 10,
  },
  backPageType: '1',
  tableData: [],
  suppliersSelect: [],
  statistics: {},
  pageConfig: {
    current: 1,
    pageSize: 10,
    total: null,
  },
  currentId: undefined,
  certificateDetail: {},
  refuseTypeArr: [],
  oprateType: 'edit',
  registVisible: false,
  factoryAgentVisible: false,
  authVisible: false,
  entrustVisible: false,
  otherVisible: false,
}

export default modelExtend({
  namespace: 'certificateAudit',
  state: initState,
  subscriptions: getSetup({
    path: '/certificateAudit',
    initFun({ toAction }) {
      toAction(initState)
      toAction('statistics')
      toAction({ keywords: null }, 'suppliersSelect')
      toAction('tableList')
      toAction('refuseType')

      // 获取注册证配置
      toAction('app/getRegistList')
    },
  }),
  effects: {
    // 列表目录统计数查询
    * statistics({ payload }, { call, toAction }) {
      const { content } = yield call(services.statistics, payload)
      yield toAction({ statistics: content })
    },
    // 我的供应商下拉列表
    * suppliersSelect({ payload }, { call, toAction }) {
      const { content } = yield call(services.suppliers, payload)
      yield toAction({ suppliersSelect: content })
    },
    // 分页获取表格数据
    * tableList({ payload }, { call, toAction, select }) {
      const { searchKeys } = yield select(({ certificateAudit }) => certificateAudit)
      const req = payload || { ...searchKeys, current: 1, pageSize: 10 }
      const { content } = yield call(services.tableList, req)
      const { registerData, factoryAgentData, businessData } = content
      const getData = (...props) => {
        for (const item of props) {
          if (item.length) {
            return item
          }
        }
        return []
      }
      yield toAction({
        tableData: getData(registerData, factoryAgentData, businessData),
        searchKeys: req,
        pageConfig: {
          current: content.current,
          pageSize: content.pageSize,
          total: content.total,
        },
      })
    },
    // 拒绝说明
    * refuseType(_, { call, update }) {
      const { content } = yield call(services.refuseType, { dicKey: 'BGREFUSEREASON' })
      yield update({ refuseTypeArr: content })
    },
    // 注册证详情
    * registDetail({ payload }, { call, update }) {
      const { content } = yield call(services.registDetail, payload)
      yield update({ certificateDetail: content })
    },
    // 注册证审核
    * registReview({ payload }, { call, update, put }) {
      yield call(services.registReview, payload)
      yield update({ registVisible: false })
      yield put({ type: 'tableList' })
    },
    // 厂家三证详情
    * factoryAgentDetail({ payload }, { call, update }) {
      const { content } = yield call(services.factoryAgentDetail, payload)
      yield update({ certificateDetail: content })
    },
    // 厂家三证审核
    * factoryAgentReview({ payload }, { call, update, put }) {
      yield call(services.factoryAgentReview, payload)
      yield update({ factoryAgentVisible: false })
      yield put({ type: 'tableList' })
    },
    // 授权书详情
    * authDetail({ payload }, { call, update }) {
      const { content } = yield call(services.authDetail, payload)
      yield update({ certificateDetail: content })
    },
    // 授权书审核
    * authReview({ payload }, { call, update, put }) {
      yield call(services.authReview, payload)
      yield update({ authVisible: false })
      yield put({ type: 'tableList' })
    },
    // 委托书详情
    * entrustDetail({ payload }, { call, update }) {
      const { content } = yield call(services.entrustDetail, payload)
      yield update({ certificateDetail: content })
    },
    // 委托书审核
    * entrustReview({ payload }, { call, update, put }) {
      yield call(services.entrustReview, payload)
      yield update({ entrustVisible: false })
      yield put({ type: 'tableList' })
    },
    // 其他证详情
    * otherDetail({ payload }, { call, update }) {
      const { content } = yield call(services.otherDetail, payload)
      yield update({ certificateDetail: content })
    },
    // 其他证审核
    * otherReview({ payload }, { call, update, put }) {
      yield call(services.otherReview, payload)
      yield update({ otherVisible: false })
      yield put({ type: 'tableList' })
    },
  },
})
