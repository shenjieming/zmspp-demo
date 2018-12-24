import { generateRequest } from '../../utils/'
import { mockURL, baseURL, rapMockURL } from '../../utils/config'

export default {
  // 扫码验收列表
  queryScanList: generateRequest(`${baseURL}/delivery/scan/check`, 'post'),
  // 保存验收结果
  saveCheckOrder: generateRequest(`${baseURL}/deliver/orderCheck`, 'post'),
}
