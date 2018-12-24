import { mockURL, baseURL, rapMockURL } from '../../utils/config'
import { generateRequest } from '../../utils/index'

const api = baseURL

export default {
  // 查询机构下的业务员
  getList: generateRequest(`${api}/purchase/user/list`, 'post'),
  // 获取客户列表
  getCustomersList: generateRequest(`${api}/purchase/user/customers`, 'post'),
  // 保存设置
  saveEdit: generateRequest(`${api}/purchase/user/save`, 'post'),
}
