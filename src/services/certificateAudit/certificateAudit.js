import { generateRequest } from '../../utils'
import { baseURL } from '../../utils/config'

export default {
  // 获取所有证件数量
  statistics: generateRequest(`${baseURL}/certificate/statistics`, 'get'),
  // 我的供应商下拉列表
  suppliers: generateRequest(`${baseURL}/organization/getAllTypeInfo`, 'post'),
  // 获取表格数据
  tableList: generateRequest(`${baseURL}/certificate/list`, 'post'),
  // 拒绝类型（字典维护）
  refuseType: generateRequest(`${baseURL}/system/dicValue/dicKey`, 'post'),
  // 注册证详情
  registDetail: generateRequest(`${baseURL}/certificate/register/review/detail`, 'post'),
  // 注册证审核
  registReview: generateRequest(`${baseURL}/certificate/register/review`, 'post'),
  // 三证详情
  factoryAgentDetail: generateRequest(`${baseURL}/certificate/factory-agent/review/detail`, 'post'),
  // 三证审核
  factoryAgentReview: generateRequest(`${baseURL}/certificate/factory-agent/review`, 'post'),
  // 授权书详情
  authDetail: generateRequest(`${baseURL}/certificate/auth/review/detail`, 'post'),
  // 授权书审核
  authReview: generateRequest(`${baseURL}/certificate/auth/review`, 'post'),
  // 委托书详情
  entrustDetail: generateRequest(`${baseURL}/certificate/entrust/review/detail`, 'post'),
  // 委托书审核
  entrustReview: generateRequest(`${baseURL}/certificate/entrust/review`, 'post'),
  // 其他档案详情
  otherDetail: generateRequest(`${baseURL}/certificate/other/review/detail`, 'post'),
  // 其他档案审核
  otherReview: generateRequest(`${baseURL}/certificate/other/review`, 'post'),
}
