import { message } from 'antd'
import md5 from 'md5'
import { mapValues } from 'lodash'
import { parse } from 'qs'
import { accountLogin, quickLogin, getMobileCaptcha, silentLogin } from '../services/login'
import { REQUEST_SUCCESS_CODE } from '../utils/config'

const initialState = {
  // 当前tab
  tab: 'account',
  passwordVisible: false,
  countDownStatus: false,
  quickLoginButtonLoading: false,
  accountLoginButtonLoading: false,
  // 错误信息
  accountErrorText: undefined,
  quickErrorText: undefined,
}

export default {
  namespace: 'login',
  state: initialState,
  subscriptions: {
    setup({ history, dispatch }) {
      const { token } = parse(history.location.search.slice(1))
      if (token) {
        dispatch({ type: 'silentLogin', payload: { token } })
      }
      history.listen(({ pathname }) => {
        if (pathname === '/login') {
          dispatch({ type: 'update', payload: initialState })
        }
      })
    },
  },
  effects: {
    // 免密登录
    * silentLogin({ payload }, { call, put }) {
      const { data, status } = yield call(silentLogin, payload)
      if (status === 200) {
        const { code, content } = data
        if (code === REQUEST_SUCCESS_CODE) {
          yield put({ type: 'app/loginSuccess', payload: { ...content } })
        } else {
          message.error(data.message)
        }
      } else {
        message.error('登录失败')
      }
    },
    // 普通登陆
    * accountLogin({ payload }, { call, put }) {
      yield put({ type: 'update', payload: { accountLoginButtonLoading: true } })
      const values = mapValues(payload, x => x.trim())
      const { data, status } = yield call(accountLogin, {
        ...values,
        password: md5(values.password).toUpperCase(),
      })
      yield put({ type: 'update', payload: { accountLoginButtonLoading: false } })
      if (status === 200) {
        const { code, content } = data
        if (code === REQUEST_SUCCESS_CODE) {
          yield put({ type: 'app/loginSuccess', payload: content })
        } else {
          yield put({ type: 'update', payload: { accountErrorText: data.message } })
        }
      } else {
        yield put({ type: 'update', payload: { accountErrorText: '登录错误' } })
      }
    },
    // 手机登陆
    * quickLogin({ payload }, { call, put }) {
      yield put({ type: 'update', payload: { quickLoginButtonLoading: true } })
      const { data, status } = yield call(quickLogin, mapValues(payload, x => x.trim()))
      yield put({ type: 'update', payload: { quickLoginButtonLoading: false } })
      if (status === 200) {
        const { code, content } = data
        if (code === REQUEST_SUCCESS_CODE) {
          yield put({ type: 'app/loginSuccess', payload: content })
        } else {
          yield put({ type: 'update', payload: { quickErrorText: data.message } })
        }
      } else {
        yield put({ type: 'update', payload: { quickErrorText: '登录错误' } })
      }
    },
    // 获取验证码
    * getMobileCaptcha({ payload }, { call, put }) {
      yield put({ type: 'update', payload: { countDownStatus: true } })
      const { data, status } = yield call(getMobileCaptcha, { mobile: payload.trim() })
      if (status === 200) {
        const { code } = data
        if (code === REQUEST_SUCCESS_CODE) {
          yield put({ type: 'countDownStart' })
          message.success('短信发送成功, 请注意查收')
        } else {
          yield put({ type: 'update', payload: { countDownStatus: false } })
          message.error(data.message)
        }
      } else {
        yield put({ type: 'update', payload: { countDownStatus: false } })
        message.error('验证码获取失败')
      }
    },
  },
  reducers: {
    update(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
    switchPasswordVisble(state) {
      return {
        ...state,
        passwordVisible: !state.passwordVisible,
      }
    },
    countDownComplete(state) {
      return {
        ...state,
        countDownStatus: false,
      }
    },
    countDownStart(state) {
      return {
        ...state,
        countDownStatus: true,
      }
    },
  },
}
