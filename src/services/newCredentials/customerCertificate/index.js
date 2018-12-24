import { generateRequest } from '../../../utils/'
import { mockURL, baseURL, rapMockURL } from '../../../utils/config'
// const rapMockURL = mockURL
export default {
  // 分页获取效期提醒列表
  certificateListData: generateRequest(`${baseURL}/certificate/supplier/list`, 'post'),
  // 客户提醒供应商证件过期
  certificateRemindData: generateRequest(`${baseURL}/certificate/valid-date/remind`, 'post'),
  // 分页获取注册证列表
  registListData: generateRequest(`${baseURL}/certificate/customer/register/list`, 'post'),
  // 获取注册证详情
  registDetailData: generateRequest(`${baseURL}/certificate/customer/register/detail`, 'get'),
  // 分页获取厂家总代三证列表
  prodFactoryListData: generateRequest(`${baseURL}/certificate/customer/factory-agent/list`, 'post'),
  // 厂家总代三证详情
  prodFactoryDetailData: generateRequest(`${baseURL}/certificate/customer/factory-agent/detail`, 'get'),
  // 分页获取授权书列表
  authListData: generateRequest(`${baseURL}/certificate/customer/auth/list`, 'post'),
  // 获取授权书详情
  authDetailData: generateRequest(`${baseURL}/certificate/customer/auth/detail`, 'get'),
  // 分页获取委托书列表
  powerListData: generateRequest(`${baseURL}/certificate/customer/entrust/list`, 'post'),
  // 获取委托书详情
  powerDetailData: generateRequest(`${baseURL}/certificate/customer/entrust/detail`, 'get'),
  // 分页获取其他证件
  otherListData: generateRequest(`${baseURL}/certificate/customer/other/list`, 'post'),
  // 获取其他证件详情
  otherDetailData: generateRequest(`${baseURL}/certificate/customer/other/detail`, 'get'),
  // 所有供应商下拉列表
  customerOptionsData: generateRequest(`${baseURL}/contacts/option/suppliers`, 'post'),
  // 获取证件数量  TODO
  // getCertificateNumData: generateRequest(`${baseURL}/certificate/supplier/statistics`, 'post'),
  // 获取效期提醒证件数量
  getValidStatisticsData: generateRequest(`${baseURL}/certificate/my-supplier/valid-data-statistics`, 'post'),
  // 厂家总代过期证件数量
  getFactoryAgentData: generateRequest(`${baseURL}/certificate/my-supplier/factory-agent-statistics`, 'post'),
  // 其他档案过期证件数量
  getOtherStatisticsData: generateRequest(`${baseURL}/certificate/my-supplier/other-statistics`, 'post'),
  // 授权书过期证件数量
  getAuthStatisticsData: generateRequest(`${baseURL}/certificate/my-supplier/auth-statistics`, 'post'),
  // 委托书过期证件数量
  getPowerStatisticsData: generateRequest(`${baseURL}/certificate/my-supplier/entrust-statistics`, 'post'),
  // 注册证过期证件数量
  getRegistStatisticsData: generateRequest(`${baseURL}/certificate/my-supplier/register-statistics`, 'post'),
  // 获取企业证件
  getCompanyDetailData: generateRequest(`${baseURL}/organization/my/certificateList`, 'post'),
  // 拒绝原因
  getRefuseReasonListData: generateRequest(`${baseURL}/system/dicValue/dicKey`, 'post'),

  // 授权书停用启用
  authStatusData: generateRequest(`${baseURL}/certificate/customer/auth/status`, 'post'),
  // 委托书停用启用
  powerStatusData: generateRequest(`${baseURL}/certificate/customer/entrust/status`, 'post'),
  // 厂家/总代三证停用启用
  factoryStatusData: generateRequest(`${baseURL}/certificate/customer/factory-agent/status`, 'post'),
  // 其他证件停用启用
  otherStatusData: generateRequest(`${baseURL}/certificate/customer/other/status`, 'post'),
  // 其他证件停用启用
  registeStatusData: generateRequest(`${baseURL}/certificate/customer/register/status`, 'post'),

  // 其他证件获取证件类型下拉
  getOtherTypeOptions: generateRequest(`${baseURL}/system/dicValue/dicKey/map`, 'post'),


  // 回溯列表信息
  getCertificates: generateRequest(`${baseURL}/certificate/customer/register/back-track`, 'get'),
}
