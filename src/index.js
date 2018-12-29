import 'babel-polyfill'
import dva from 'dva'
import axios from 'axios'
import { message, Modal } from 'antd'
import { inRange } from 'lodash'
import createLoading from 'dva-loading'
import moment from 'moment'
import { config as uploadConfig } from 'aek-upload'
import momentLocale from './utils/momentLocale'
import effectsEnhancer from './utils/effectsEnhancer'
import {
  LOGIN_TIMEOUT_CODE,
  REQUEST_FAIL_REGION,
  BACK_REQUEST_FAIL,
  CONSUMER_HOTLINE,
  prodEnv,
  IMG_UPLOAD,
  IMG_ORIGINAL,
  IMG_COMPRESS,
  IMG_WATERMARK,
  UPLOAD_KEY,
  UPYUN_BUCKET,
  UPYUN_SAVE_KEY,
  IMG_SIZE_LIMIT,
  EXCEL_SIZE_LIMIT,
  UPYUN_SAVE_KEY_EXCEL,
  UPYUN_BUCKET_EXCEL,
  UPLOAD_KEY_EXCEL,
  ZIP_SIZE_LIMIT,
  UPYUN_SAVE_KEY_ZIP,
  UPYUN_BUCKET_ZIP,
  UPLOAD_KEY_ZIP,
} from './utils/config'


uploadConfig({
  action: IMG_UPLOAD,
  img: {
    compressTaskName: IMG_COMPRESS,
    watermarkTaskName: IMG_WATERMARK,
    saveKey: UPYUN_SAVE_KEY,
    bucket: UPYUN_BUCKET,
    uploadKey: UPLOAD_KEY,
    sizeLimit: IMG_SIZE_LIMIT,
    cdn: IMG_ORIGINAL,
  },
  excel: {
    saveKey: UPYUN_SAVE_KEY_EXCEL,
    bucket: UPYUN_BUCKET_EXCEL,
    uploadKey: UPLOAD_KEY_EXCEL,
    sizeLimit: EXCEL_SIZE_LIMIT,
  },
  zip: {
    saveKey: UPYUN_SAVE_KEY_ZIP,
    bucket: UPYUN_BUCKET_ZIP,
    uploadKey: UPLOAD_KEY_ZIP,
    sizeLimit: ZIP_SIZE_LIMIT,
  },
})

// 设置全局配置
moment.defineLocale('zh-cn', momentLocale)
moment.locale('zh-cn')
message.config({ top: 100, duration: 3 })

let confirmFlag = false

const modalCloseFn = () => {
  confirmFlag = false
}

// 弹出确认窗口
const openConfirm = (props) => {
  if (!confirmFlag) {
    confirmFlag = true
    Modal.error({
      maskClosable: !prodEnv,
      onCancel: modalCloseFn,
      onOk: modalCloseFn,
      closable: true,
      zIndex: 9999, // 根据业务需要可能设置zIndex 到时全局的弹框被遮照 因此加大全局的zIndex
      ...props,
    })
  }
}
// 返回上一步错误弹框
const backConfirm = (props) => {
  if (!confirmFlag) {
    confirmFlag = true
    Modal.error({
      maskClosable: !prodEnv,
      onCancel: modalCloseFn,
      onOk: modalCloseFn,
      zIndex: 9999, // 根据业务需要可能设置zIndex 到时全局的弹框被遮照 因此加大全局的zIndex
      ...props,
    })
  }
}
// 警告确认弹框
const openWarningConfirm = (props) => {
  if (!confirmFlag) {
    confirmFlag = true
    Modal.warning({
      maskClosable: !prodEnv,
      onCancel: modalCloseFn,
      onOk: modalCloseFn,
      zIndex: 9999, // 根据业务需要可能设置zIndex 到时全局的弹框被遮照 因此加大全局的zIndex
      ...props,
    })
  }
}

// 1. Initialize
const app = dva({
  // 处理所有请求失败或者异常
  onError(error, dispatch) {
    // prevent promise reject
    error.preventDefault()
    // 开发模式时输出错误信息
    /* eslint-disable no-console */
    if (!prodEnv) {
      console.error(error)
    }

    if (!error.stack) {
      const { status } = error

      if (status >= 200 && status < 300) {
        const data = error.data
        const { code } = data

        // 登陆超时
        if (code === LOGIN_TIMEOUT_CODE) {
          openConfirm({
            title: '登录超时',
            content: '当前用户登录已失效, 点击确定以重新登录',
            onOk: () => {
              modalCloseFn()
              dispatch({ type: 'app/pushToLogin' })
            },
          })
        } else if (code === BACK_REQUEST_FAIL) {
          backConfirm({
            content: data.message,
            title: '操作失败',
            okText: '返回上一步',
            onOk: () => {
              /* eslint-disable no-underscore-dangle */
              modalCloseFn()
              app._history.go(-1)
            },
          })
        } else if (inRange(code, ...REQUEST_FAIL_REGION)) {
          openConfirm({ content: data.message, title: '操作失败' })
        } else {
          openConfirm({ content: `系统异常, 请联系客服: ${CONSUMER_HOTLINE}`, title: '操作失败' })
        }
      } else if (!status) {
        openWarningConfirm({ content: '网络开小差了, 请检查网络环境' })
      } else {
        openWarningConfirm({ content: `系统异常, 如果需要帮助请联系客服: ${CONSUMER_HOTLINE}` })
      }
    } else {
      openConfirm({ content: `系统异常, 请联系客服: ${CONSUMER_HOTLINE}` })
    }
  },
})

// 增强effects
app.use(effectsEnhancer)

app.use(createLoading({ effects: true }))

// 2. Model
app.model(require('./models/app'))

// 3. Router
app.router(require('./router'))

// 4. Start
app.start('#root')
if (module.hot) {
  module.hot.accept();
}
/* eslint-disable no-underscore-dangle */
export default app._store.dispatch
