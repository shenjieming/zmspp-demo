import { baseURL, rapMockURL } from '../../utils/config'
import { generateRequest } from '../../utils/'

const api = baseURL

export default {
  // 获取消息类型
  getMsgTypes: generateRequest(`${api}/msg/info/msgTypes`, 'post'),
  // 获取消息列表
  getMsgList: generateRequest(`${api}/msg/info/list`, 'post'),
  // 全部设为已读
  setReadAll: generateRequest(`${api}/msg/info/readAll`, 'post'),
  // 标记单行为已读
  setReadOne: generateRequest(`${api}/msg/popup/read`, 'post'),
}
