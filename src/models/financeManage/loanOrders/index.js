import { modelExtend, getSetup, getServices, dispatchUrl } from '../../../utils'
import { tabInfoArr } from '../../../routes/financeManage/loanOrders/data'

const services = getServices({
  // 运营后台 贷款单申请列表【周祀雄】
  financeManage: '/finance/loan-mgmt/loan-order/list-page',
  // 供应商 贷款单申请列表【周祀雄】
  financeLoan: '/finance/loan-apply/loan-order/list-page',
  // 银行 贷款单申请列表【周祀雄】
  financeAudit: '/finance/loan-audit/loan-order/list-page',
})

const initState = {
  pageType: undefined,
  tableData: [],
  statistics: {},
  pageConfig: {
    current: 1,
    pageSize: 10,
    total: null,
  },
  form: undefined,
}

const unstableState = {
  tabType: tabInfoArr[0].tabKey,
  searchKeys: {
    current: 1,
    pageSize: 10,
    formStatus: tabInfoArr[0].tabKey,
  },
}

const pageTypeArr = Object.keys(services)

export default modelExtend({
  namespace: 'loanOrders',
  state: { ...initState, ...unstableState },
  subscriptions: getSetup({
    path: pageTypeArr.map(type => `/${type}/loanOrders`),
    initFun({ toAction, history, query }) {
      toAction(initState)
      if (history.action !== 'POP') {
        toAction(unstableState)
      }
      if (query.tabType) {
        const tabKayArr = tabInfoArr.map(itm => itm.tabKey)
        if (tabKayArr.includes(query.tabType)) {
          toAction({ tabType: query.tabType })
          toAction({
            searchKeys: { formStatus: query.tabType - 0 },
          }, true)
        }
      }
      const pathname = history.location.pathname
      toAction({ pageType: pathname.split('/')[1] })
      toAction('tableList')
    },
  }),
  effects: {
    // 分页查询供应商贷款单申请列表【周祀雄】
    * tableList({ payload }, { call, toAction, select }) {
      const { searchKeys, pageType } = yield select(({ loanOrders }) => loanOrders)
      const req = payload || searchKeys
      if (req.applyOrg) {
        req.applyOrgId = req.applyOrg.key
      }
      const { content } = yield call(services[pageType], req)
      const { data, current, pageSize, total, ...statistics } = content
      yield toAction({
        statistics,
        tableData: data,
        searchKeys: req,
        pageConfig: {
          current,
          pageSize,
          total,
        },
      })
    },
    // 查看明细跳转
    * view({ payload }, { select }) {
      const { pageType } = yield select(({ loanOrders }) => loanOrders)
      dispatchUrl({
        pathname: `/${pageType}/loanOrders/loanOrderDetail/${payload.formId}`,
      })
    },
  },
})
