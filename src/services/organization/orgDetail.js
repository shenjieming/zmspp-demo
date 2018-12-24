import { generateRequest } from '../../utils/'
import { mockURL, baseURL, rapMockURL } from '../../utils/config'
// const rapMockURL = mockURL
export default {
  // 获取一级甲等
  dicKey: generateRequest(`${baseURL}/system/dicValue/dicKey`, 'post'),
  // 分页查询子机构
  getSonOrgList: generateRequest(`${baseURL}/organization/getSonOrgList`, 'post'),
  // 分页获取所有组织机构
  getOrgList: generateRequest(`${baseURL}/organization/getOrgList`, 'post'),
  // 审核机构
  updateOrgStatus: generateRequest(`${baseURL}/organization/updateOrgStatus`, 'post'),
  // 审核机构详情页
  getOrgAuditDetail: generateRequest(`${baseURL}/organization/getOrgAuditDetail`, 'post'),
  // 异步校验机构名称是否已存在
  checkOrgName: generateRequest(`${baseURL}/organization/checkOrgName`, 'post'),
  // 新增机构
  saveOrg: generateRequest(`${baseURL}/organization/saveOrg`, 'post'),
  // 新增证书
  saveCertificate: generateRequest(`${baseURL}/organization/saveCertificate`, 'post'),
  // 查看机构详情
  getOrgDetail: generateRequest(`${baseURL}/organization/getOrgDetail`, 'post'),
  // 查看证件列表
  getCertificateList: generateRequest(`${baseURL}/organization/getCertificateList`, 'post'),
  // 查看证件详情
  getCertificateDetail: generateRequest(`${baseURL}/organization/getCertificateDetail`, 'post'),
  // 注册后补全信息
  saveAfterRegist: generateRequest(`${baseURL}/organization/saveAfterRegist`, 'post'),
  // 编辑机构基础设置
  updateOrgBasis: generateRequest(`${baseURL}/organization/updateOrgBasis`, 'post'),
  // 编辑机构证书
  updateCertificate: generateRequest(`${baseURL}/organization/updateCertificate`, 'post'),
  // 分页查询机构人员
  queryPerson: generateRequest(`${baseURL}/organization/listUser`, 'post'),
  // 获取68码分类树
  getSixEightCodeTree: generateRequest(`${baseURL}/org/business/scope/tree/option`, 'post'),
  // 查看机构默认经营范围
  queryRunScope: generateRequest(`${baseURL}/org/business/scope/tree/list`, 'post'),
  // 编辑机构经营范围
  updateRunScope: generateRequest(`${baseURL}/org/business/scope/tree/save`, 'post'),
  // 停用启用组织机构
  stopOrganization: generateRequest(`${baseURL}/organization/stopOrganization`, 'post'),
  // 设置标签
  updateUserTag: generateRequest(`${baseURL}/organization/updateUserTag`, 'post'),
  // 生成管理员账号
  genAccount: generateRequest(`${baseURL}/generator/admin/account`, 'post'),
  // 异步校验手机号是否存在
  verifyPhone: generateRequest(`${baseURL}/generator/admin/account/verify`, 'post'),
  // 绑定管理员账号
  bindAccount: generateRequest(`${baseURL}/bind/admin/account`, 'post'),
  // 获取上级机构
  getParentOrgList: generateRequest(`${baseURL}/organization/completionOrgName`, 'post'),
  // 获取token
  turnOther: generateRequest(`${baseURL}/login/getToken`, 'post'),
  // 更改机构类型
  changeOrgType: generateRequest(`${baseURL}/account-org/org-type-value-change`, 'post'),
}
