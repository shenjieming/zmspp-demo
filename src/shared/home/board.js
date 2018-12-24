import moment from 'moment'

export default {
  namespace: 'dashboard',
  GET_STATISTICS: 'getStatistics',
  GET_ORDER: 'getOrder',
  INITIAL_SEARCH_PARAM: {
    formType: 1,
    endDate: moment(),
    statisticsType: 1,
    startDate: moment().subtract(6, 'days'),
  },
}
