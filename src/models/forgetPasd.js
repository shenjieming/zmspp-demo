import { imageCaptcha, firstSubmit, secondMobileSubmit, secondEmailSubmit, thirdSubmit, secondMobileCaptcha, secondEmailCaptcha } from '../services/forgetPasd'
import { message } from 'antd'
import dvaModelExtend from '../utils/modelExtend'
import axios from 'axios'
import { baseURL, mockURL, REQUEST_SUCCESS_CODE } from '../utils/config'

const initState = {
  stepCurrent: 0, // 步骤数
  imageCaptchaUrl: '', // 图片验证码地址
  userInfo: {}, // 用户信息
  selectType: 0, // 选择类型
  countDownStatus: false, // 倒计时
  customerVisible: false, // 联系客服弹框
  token: '', // 第一次获取验证码时需要
}
export default dvaModelExtend({
  namespace: 'forgetPasd',
  state: {},
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/forgetPasd') {
          // 初始化数据
          dispatch({
            type: 'updateState',
            payload: {
              ...initState,
            },
          })
          // 获取图片验证码
          dispatch({
            type: 'getImageCaptcha',
          })
        }
      })
    },
  },
  effects: {
    // 第一步获取图片验证码
    * getImageCaptcha({ payload }, { call, put, select }) {
      const token = yield select(({ forgetPasd }) => forgetPasd.token)
      const { data, status } = yield call(imageCaptcha, { ...payload, token })
      if (status === 200) {
        const { code, content } = data
        if (code === REQUEST_SUCCESS_CODE) {
          yield put({
            type: 'updateState',
            payload: {
              imageCaptchaUrl: content.imageCaptcha,
              token: content.token,
            },
          })
        } else {
          message.error(data.message)
        }
      }
    },
    // 第一步填写用户名 提交
    * getFirstSubmit({ payload }, { call, put, select }) {
      const token = yield select(({ forgetPasd }) => forgetPasd.token)
      const { data, status } = yield call(firstSubmit, { ...payload, token })
      if (status === 200) {
        const { code, content } = data
        if (code === REQUEST_SUCCESS_CODE) {
          let selectType = 0
          if (content.email && content.mobile) {
            selectType = 0
          } else if (content.email) {
            selectType = 1
          } else if (content.mobile) {
            selectType = 0
          }
          yield put({
            type: 'updateState',
            payload: {
              userInfo: content,
              stepCurrent: 1,
              selectType,
            },
          })
        } else {
          message.error(data.message, 3)
          yield put({
            type: 'getImageCaptcha',
          })
        }
      }
    },
    // 第二步填写用户名 提交
    * getSecondSubmit({ payload }, { call, put, select }) {
      const selectType = yield select(({ forgetPasd }) => forgetPasd.selectType)
      if (selectType === 0) {
        const { data, status } = yield call(secondMobileSubmit, payload)
        if (status === 200) {
          const { code } = data
          if (code === REQUEST_SUCCESS_CODE) {
            yield put({
              type: 'updateState',
              payload: {
                stepCurrent: 2,
              },
            })
          } else {
            message.error(data.message, 3)
          }
        }
      } else {
        const { data, status } = yield call(secondEmailSubmit, payload)
        if (status === 200) {
          const { code } = data
          if (code === REQUEST_SUCCESS_CODE) {
            yield put({
              type: 'updateState',
              payload: {
                stepCurrent: 2,
              },
            })
          } else {
            message.error(data.message, 3)
          }
        }
      }
    },
    // 第二步获取手机验证码
    * getSecondMobileCaptcha({ payload }, { call, put }) {
      const { data, status } = yield call(secondMobileCaptcha, payload)
      if (status === 200) {
        const { code } = data
        if (code === REQUEST_SUCCESS_CODE) {
          yield put({
            type: 'updateState',
            payload: {
              countDownStatus: true,
            },
          })
        } else {
          message.error(data.message, 3)
        }
      }
    },
    // 第二步获取邮箱验证码
    * getSecondEmailCaptcha({ payload }, { call, put }) {
      const { data, status } = yield call(secondEmailCaptcha, payload)
      if (status === 200) {
        const { code } = data
        if (code === REQUEST_SUCCESS_CODE) {
          yield put({
            type: 'updateState',
            payload: {
              countDownStatus: true,
            },
          })
        } else {
          message.error(data.message, 3)
        }
      }
    },
    // 第三步填写用户名 提交
    * getThirdSubmit({ payload }, { call, put }) {
      const { data, status } = yield call(thirdSubmit, payload)
      if (status === 200) {
        const { code } = data
        if (code === REQUEST_SUCCESS_CODE) {
          yield put({
            type: 'updateState',
            payload: {
              stepCurrent: 3,
            },
          })
        } else {
          message.error('密码修改成功！', 3)
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
