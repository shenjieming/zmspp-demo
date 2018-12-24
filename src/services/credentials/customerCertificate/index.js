import { generateRequest } from '../../../utils/'
import { mockURL, baseURL, rapMockURL } from '../../../utils/config'
// const rapMockURL = mockURL
export default {
  // 分页获取效期提醒列表
  certificateListData: generateRequest(`${baseURL}/certificate/supplier/list`, 'post'),
  // 客户提醒供应商证件过期
  certificateRemindData: generateRequest(`${baseURL}/certificate/valid-date/remind`, 'post'),
  // 分页获取注册证列表
  registListData: generateRequest(`${baseURL}/certificate/supplier/register/list`, 'post'),
  // 获取注册证详情
  registDetailData: generateRequest(`${baseURL}/certificate/my/register/detail`, 'post'),
  // 分页获取厂家总代三证列表
  prodFactoryListData: generateRequest(`${baseURL}/certificate/supplier/factory-agent/list`, 'post'),
  // 厂家总代三证详情
  prodFactoryDetailData: generateRequest(`${baseURL}/certificate/supplier/factory-agent/detail`, 'post'),
  // 分页获取授权书列表
  authListData: generateRequest(`${baseURL}/certificate/supplier/auth/list`, 'post'),
  // 获取授权书详情
  authDetailData: generateRequest(`${baseURL}/certificate/supplier/auth/detail`, 'post'),
  // 分页获取委托书列表
  powerListData: generateRequest(`${baseURL}/certificate/supplier/entrust/list`, 'post'),
  // 获取委托书详情
  powerDetailData: generateRequest(`${baseURL}/certificate/supplier/entrust/detail`, 'post'),
  // 分页获取其他证件
  otherListData: generateRequest(`${baseURL}/certificate/supplier/other/list`, 'post'),
  // 获取其他证件详情
  otherDetailData: generateRequest(`${baseURL}/certificate/supplier/other/detail`, 'post'),
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
}
