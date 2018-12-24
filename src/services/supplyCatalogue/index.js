import { generateRequest } from '../../utils/'
import { mockURL, baseURL, rapMockURL } from '../../utils/config'
// const rapMockURL = mockURL
export default {
  // 分页获取客户列表
  customerListData: generateRequest(`${baseURL}/supply/catalog/customers`, 'post'),
}
