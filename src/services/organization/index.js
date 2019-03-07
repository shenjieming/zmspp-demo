import { generateRequest } from '../../utils/'
import { mockURL, baseURL, rapMockURL } from '../../utils/config'
// const rapMockURL = mockURL
export default {
  savePoolId: generateRequest(`${baseURL}/organization/updateWH`, 'post'),
  // 分页获取所有组织机构
  getOrgList: generateRequest(`${baseURL}/organization/getOrgList`, 'post'),
  // 新增机构
  saveOrg: generateRequest(`${baseURL}/organization/saveOrg`, 'post'),
  // 审核机构
  updateOrgStatus: generateRequest(`${baseURL}/organization/updateOrgStatus`, 'post'),
  // 审核机构详情页
  getOrgAuditDetail: generateRequest(`${baseURL}/organization/getOrgAuditDetail`, 'post'),
  // 异步校验机构名称是否已存在
  checkOrgName: generateRequest(`${baseURL}/organization/checkOrgName`, 'post'),
  // 获取一级甲等
  dicKey: generateRequest(`${baseURL}/system/dicValue/dicKey`, 'post'),
  // 获取上级机构
  getParentOrgList: generateRequest(`${baseURL}/organization/completionOrgName`, 'post'),
  // 生成管理员账号
  genAccount: generateRequest(`${baseURL}/generator/admin/account`, 'post'),
  // 异步校验手机号是否存在
  verifyPhone: generateRequest(`${baseURL}/generator/admin/account/verify`, 'post'),
  // 绑定管理员账号
  bindAccount: generateRequest(`${baseURL}/bind/admin/account`, 'post'),
  // 获取token
  turnOther: generateRequest(`${baseURL}/login/getToken`, 'post'),
}
