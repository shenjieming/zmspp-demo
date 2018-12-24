import { generateRequest } from '../utils/'
import { baseURL, rapMockURL } from '../utils/config'

export default {
  // 判断是否需要补全信息
  afterLogin: generateRequest(`${baseURL}/organization/afterLogin`, 'post'),
  // 根据字典唯一关键字获取字典值列表
  dicKey: generateRequest(`${baseURL}/system/dicValue/dicKey`, 'post'),
  // 获取审核机构详情
  getOrgAuditDetail: generateRequest(`${baseURL}/organization/getOrgAuditDetail`, 'post'),
  // 提交审核
  complementInfo: generateRequest(`${baseURL}/organization/complementInfo`, 'post'),
  // 上级机构
  getParentOrgList: generateRequest(`${baseURL}/organization/completionOrgName`, 'post'),
}
