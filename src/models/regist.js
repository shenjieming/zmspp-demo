import { mobileCaptcha, registData, supplierData, hospitalData } from '../services/regist'
import { message } from 'antd'
import dvaModelExtend from '../utils/modelExtend'
import { REQUEST_SUCCESS_CODE } from '../utils/config'

const initState = {
  captchaClearVisible: false,
  countDownStatus: false,
  checkCodeStatus: false,
  mobileClearVisible: false,
  supplierList: [], // 供应商列表
  hospitalList: [], // 医院列表
  usernameUnique: false, // 用户名唯一性校验
  usernameUniqueText: '', // 用户名唯一性文本提示
  mobileUnique: true, // 手机号码唯一性校验
  mobileUniqueText: '', // 手机号唯一性文本提示
  pageVisible: false, // 注册成功
  pageDefaultVisible: true, // 默认显示我是供应商
}
export default dvaModelExtend({
  namespace: 'regist',
  state: {},
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/regist') {
          dispatch({
            type: 'updateState',
            payload: {
              ...initState,
            },
          })
        }
      })
    },
  },
  effects: {
    // 注册
    * postResist({ payload }, { call, put }) {
      const { data, status } = yield call(registData, payload)
      if (status === 200) {
        const { code } = data
        if (code === REQUEST_SUCCESS_CODE) {
          message.success('注册成功', 3)
          yield put({
            type: 'updateState',
            payload: {
              pageVisible: true,
            },
          })
        } else {
          message.error(data.message, 3)
        }
      }
    },
    // 获取验证码
    * getMobileCaptcha({ payload }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          countDownStatus: true,
        },
      })
      const { data, status } = yield call(mobileCaptcha, payload)
      if (status === 200) {
        const { code } = data
        if (code === REQUEST_SUCCESS_CODE) {
          message.success('短信验证码发送成功，请注意查收！', 3)
        } else {
          message.error('短信验证码发送失败', 3)
          yield put({
            type: 'updateState',
            payload: {
              countDownStatus: false,
            },
          })
        }
      }
    },
    // 查询供应商
    * getSupplierList({ payload }, { call, put }) {
      const { data, status } = yield call(supplierData, payload)
      if (status === 200) {
        const { code, content } = data
        if (code === REQUEST_SUCCESS_CODE) {
          yield put({
            type: 'updateState',
            payload: {
              supplierList: content,
            },
          })
        } else {
          message.error(data.message, 3)
        }
      }
    },
    // 查询医院
    * getHospitalList({ payload }, { call, put }) {
      const { data, status } = yield call(hospitalData, payload)
      if (status === 200) {
        const { code, content } = data
        if (code === REQUEST_SUCCESS_CODE) {
          yield put({
            type: 'updateState',
            payload: {
              hospitalList: content,
            },
          })
        } else {
          message.error(data.message, 3)
        }
      }
    },
  },
  reducers: {
    initState(state) {
      return {
        ...state,
        ...initState,
      }
    },
  },
})
