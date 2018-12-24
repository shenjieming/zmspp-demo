import { generateRequest } from '../../utils/'
import { baseURL } from '../../utils/config'

const api = baseURL
export default {
  // 获取角色详情
  getDetailApi: generateRequest(`${api}/account/role`, 'post'),
  // 获取当前用户的功能总树
  getMenusApi: generateRequest(`${api}/account/role/has/menu`, 'post'),
  // 获取角色包含的用户
  getUsersApi: generateRequest(`${api}/account/role/users`, 'post'),
  // 更新角色状态
  updateRoleStateApi: generateRequest(`${api}/account/updateStatus`, 'post'),
  // 编辑角色
  editRoleApi: generateRequest(`${api}/account/updateRole`, 'post'),
  // 获取单个用户信息
  getSingleUserApi: generateRequest(`${api}/account/user`, 'post'),
  // 移除用户
  removeUserApi: generateRequest(`${api}/account/role/remove/user`, 'post'),
}
