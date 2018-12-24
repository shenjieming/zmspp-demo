import { generateRequest } from '../../utils/'
import { baseURL } from '../../utils/config'

const api = baseURL
export default {
  // 获取列表信息
  getDataApi: generateRequest(`${api}/account/default/roles`, 'post'),
  // 获取组织类型
  getOrgTypeApi: generateRequest(`${api}/system/dicValue/dicKey`, 'post'),
  // 获取权限总树
  getMenusApi: generateRequest(`${api}/menus/functions/tree/all`, 'post'),
  // 添加用户
  addOneApi: generateRequest(`${api}/account/saveDefaultRole`, 'post'),
}
