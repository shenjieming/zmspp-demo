import { generateRequest } from '../../utils/'
import { mockURL, baseURL, rapMockURL } from '../../utils/config'
// const rapMockURL = mockURL
export default {
  // 查询人员详情
  userDetail: generateRequest(`${baseURL}/account/user/personal`, 'post'),
  // 停用启用账号
  updateStatus: generateRequest(`${baseURL}/account/user/updateStatus`, 'post'),
  // 重置密码
  resetPassWord: generateRequest(`${baseURL}/account/user/reset/password`, 'post'),
  // 解锁账号
  unlock: generateRequest(`${baseURL}/account/user/unlock`, 'post'),
}
