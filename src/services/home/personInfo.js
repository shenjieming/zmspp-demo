import { generateRequest } from '../../utils'
import { baseURL, rapMockURL } from '../../utils/config'

const requestURL = baseURL

export default {
  // 个人信息详情
  getPersonInfo: generateRequest(`${requestURL}/account/user/personal`, 'post'),
  // 修改个人信息
  editPersonInfo: generateRequest(`${requestURL}/account/user/updateDetail`, 'post'),
  // 更换手机
  rePhone: generateRequest(`${requestURL}/account/user/change/mobile`, 'post'),
  // 更换密码
  rePassword: generateRequest(`${requestURL}/account/user/change/password`, 'post'),
  // 更换邮箱
  reMail: generateRequest(`${requestURL}/account/user/change/email`, 'post'),
  // 获取手机验证码
  bymobile: generateRequest(`${requestURL}/account/user/send/mobile/verifycode
`, 'post'),
  // 获取邮箱验证码
  byemail: generateRequest(`${requestURL}/account/user/send/email/verifycode
`, 'post'),
  // 上传头像
  imgUrl: generateRequest(`${requestURL}/account/user/change/imgUrl
`, 'post'),
}
