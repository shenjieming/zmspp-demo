import qs from 'qs'
import { modelExtend, getServices } from '../../utils'

const { getRepayWillList, getRepayRecordList, getRepayTotal } = getServices({
  // 查询可还贷款列表
  getRepayWillList: '/finance/loan-apply/required-repay-order/list-page',
  // 查询已经还贷款列表
  getRepayRecordList: '/finance/loan-apply/repay-order/list-page',
  // 待还款概要
  getRepayTotal: '/finance/loan-apply/required-repay-order/summary',
})

export default modelExtend({
  namespace: 'repayLoan',
  state: {
    repayWillList: [],
    repayRecordList: [],
    pagination: {
      current: 1,
      pageSize: 10,
      total: null,
    },
    searchSaveParam: {},
    currentTabIndex: -1,
    currentDetail: {},
    repayQty: null, // 待还款总额
    repayAmount: null, // 待还款总额
    checkedList: [], // 选中的待还款 ids
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const { pathname, search } = location
        const { currentTabIndex: index, loanExpireTimeRangeType, formStatus } = qs.parse(search, {
          ignoreQueryPrefix: true,
        })
        if (pathname === '/financeLoan/repayLoan') {
          if (history.action !== 'POP') {
            dispatch({ type: 'reset' })
          }
          if (index) {
            const currentTabIndex = Number(index)
            dispatch({
              type: 'updateState',
              payload: {
                searchSaveParam: { loanExpireTimeRangeType, formStatus },
                currentTabIndex,
              },
            })
          }
          dispatch({ type: 'getRepayWillList' })
          dispatch({ type: 'getRepayRecordList' })
          dispatch({ type: 'getRepayTotal' })
        }
      })
    },
  },
  effects: {
    // 查询可还贷款列表
    * getRepayWillList({ payload }, { call, select, update }) {
      const { searchSaveParam, pagination, currentTabIndex } = yield select(
        ({ repayLoan }) => repayLoan,
      )
      if (!currentTabIndex || Number(currentTabIndex) === -1) {
        const { content: { data, current, total, pageSize } } = yield call(getRepayWillList, {
          ...searchSaveParam,
          ...pagination,
          ...payload,
        })
        yield update({
          repayWillList: data,
          pagination: { current, total, pageSize },
        })
      }
    },
    // 查询已还贷款列表
    * getRepayRecordList({ payload }, { call, select, update }) {
      const { searchSaveParam, pagination, currentTabIndex } = yield select(
        ({ repayLoan }) => repayLoan,
      )
      if (currentTabIndex && Number(currentTabIndex) === 1) {
        const { content: { data, current, total, pageSize } } = yield call(getRepayRecordList, {
          ...searchSaveParam,
          ...pagination,
          ...payload,
        })
        yield update({
          repayRecordList: data,
          pagination: { current, total, pageSize },
        })
      }
    },
    // 待还款概要
    * getRepayTotal({ payload }, { call, update }) {
      const { content: { totalAmount: repayAmount, totalQty: repayQty } } = yield call(
        getRepayTotal,
        payload,
      )
      yield update({ repayAmount, repayQty })
    },
  },
  reducers: {},
})
