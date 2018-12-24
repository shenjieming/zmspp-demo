import { message, Modal } from 'antd'
import { modelExtend, getSetup } from '@utils'
import { COMMON_REDUCER } from '@utils/constant'
import * as services from '@services/home/personInfo'
import md5 from 'md5'

const initState = {
  personInfoObj: {},
  modalVisible: false,
  modalType: 'editPersonInfo',
  modalInitValue: {},
  moreLength: 1,
  mobileTime: true,
  emailTime: true,
}

export default modelExtend({
  namespace: 'personInfo',
  state: initState,
  subscriptions: getSetup({
    path: '/personInfo',
    initFun({ toAction }) {
      toAction(initState)
      toAction('getPersonInfo')
    },
  }),

  effects: {
    // 个人信息详情
    * getPersonInfo({ payload }, { call, toAction }) {
      const { content } = yield call(services.getPersonInfo, {})
      yield toAction({ personInfoObj: content })
    },
    // 修改个人信息
    * editPersonInfo({ payload }, { call, toAction }) {
      const req = payload
      if (req.birthday) {
        req.birthday = req.birthday.format('YYYY-MM-DD')
      }
      yield call(services.editPersonInfo, req)
      message.success('修改成功')
      yield toAction('getPersonInfo')
      yield toAction({ modalVisible: false })
    },
    // 修改密码
    * rePassword({ payload }, { call, toAction }) {
      const req = payload
      req.oldPassword = md5(req.oldPassword).toUpperCase()
      req.newPassword = md5(req.newPassword).toUpperCase()
      delete req.reNewPassword
      yield call(services.rePassword, req)
      yield toAction({ modalVisible: false })
      message.success('密码修改成功')
      // yield toAction('app/logout')
    },
    // 更换邮箱/绑定邮箱
    * reMail({ payload }, { call, toAction }) {
      const req = payload
      req.password = md5(req.password).toUpperCase()
      yield call(services.reMail, req)
      yield toAction('getPersonInfo')
      message.success('修改成功')
      yield toAction({ modalVisible: false })
    },
    // 更换手机
    * rePhone({ payload }, { call, toAction }) {
      const req = payload
      req.password = md5(req.password).toUpperCase()
      yield call(services.rePhone, req)
      yield toAction('getPersonInfo')
      message.success('修改成功')
      yield toAction({ modalVisible: false })
    },
    // 获取手机验证码
    * bymobile({ payload }, { call, toAction }) {
      yield call(services.bymobile, payload)
      yield toAction({ mobileTime: false })
      message.success('发送成功，请注意查收')
    },
    // 获取邮箱验证码
    * byemail({ payload }, { call, toAction }) {
      yield call(services.byemail, payload)
      yield toAction({ emailTime: false })
      message.success('发送成功，请注意查收')
    },
    // 上传头像
    * imgUrl({ payload }, { call, toAction }) {
      yield call(services.imgUrl, payload)
      yield [
        toAction('getPersonInfo'),
        toAction({ user: { userImageUrl: payload.imgUrl } }, `app/${COMMON_REDUCER}`, true),
      ]
      yield toAction('app/saveUserData')
      message.success('上传成功')
    },
  },
})
