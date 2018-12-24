import { generateRequest } from '../../utils/'
import { baseURL } from '../../utils/config'

const api = baseURL
export default {
  // 获取角色详情
  getDetailApi: generateRequest(`${api}/account/defaultRole`, 'post'),
  // 获取当前用户的功能总树
  getMenusApi: generateRequest(`${api}/account/role/has/menu`, 'post'),
  // 更新角色状态
  updateRoleStateApi: generateRequest(`${api}/account/default/role/updateStatus`, 'post'),
  // 编辑角色
  editRoleApi: generateRequest(`${api}/account/updateRole`, 'post'),
}
