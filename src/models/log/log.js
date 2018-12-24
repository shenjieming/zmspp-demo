import { getServices, modelExtend } from '@utils'
import { namespace, PATHNAME, GET_LIST, RESEND } from '@shared/log/log'
import { update } from 'lodash'

const services = getServices({
  getList: '/log/mq/list',
  resend: '/log/mq/resend',
})

export default modelExtend({
  namespace,

  state: {
    dataSource: [],

    searchParam: {
      apiType: '1',
      keyword: '',
      responseCode: '1',
    },

    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
    },

    detail: {},
    detailVisible: false,
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === PATHNAME) {
          dispatch({ type: 'reset' })
          dispatch({ type: 'getList' })
        }
      })
    },
  },

  effects: {
    // 获取列表
    * [GET_LIST]({ payload }, { call, update, select, put }) {
      yield update(payload)
      const { searchParam, pagination } = yield select(store => store[namespace])
      const { content: { data, ...others } } = yield call(services.getList, {
        ...searchParam,
        ...pagination,
      })
      yield update({ pagination: others })
      yield put({ type: 'getListSuccess', payload: data })
    },
    // 消息重发
    * [RESEND]({ payload }, { call }) {
      yield call(services.resend, { apiId: payload })
    },
  },

  reducers: {
    getListSuccess(state, { payload }) {
      const dataSource = payload.map((item) => {
        const rs = { ...item }

        update(rs, 'apiType', (text) => {
          switch (text) {
            case 1:
              return 'herp上传'
            case 2:
              return '平台下发'
            default:
              return '平台内部消息'
          }
        })

        update(rs, 'responseCode', (text) => {
          if (text === 0) {
            return '正常'
          }
          return '异常'
        })

        return rs
      })
      return { ...state, dataSource }
    },
  },
})
