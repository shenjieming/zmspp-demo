import { baseURL, rapMockURL } from '../../utils/config'
import { generateRequest } from '../../utils/'

const api = baseURL

export default {
  // 获取消息配置列表
  getMsgConfigList: generateRequest(`${api}/msg/config/list`, 'post'),
  // 获取所有权限切换人员
  getAllUser: generateRequest(`${api}/account/user/sms/power/move/list`, 'post'),
  // 更换接收人
  receiverUpdate: generateRequest(`${api}/msg/config/update`, 'post'),
  // 更改配置状态
  changeConfigStatus: generateRequest(`${api}/msg/config/update/org`, 'post'),
}

