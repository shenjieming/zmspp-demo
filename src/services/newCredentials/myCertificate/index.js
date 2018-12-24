import { generateRequest } from '../../../utils/'
import { mockURL, baseURL, rapMockURL } from '../../../utils/config'
// const rapMockURL = mockURL
export default {
  // 分页获取效期提醒列表
  certificateListData: generateRequest(`${baseURL}/certificate/my/list`, 'post'),
  // 分页获取注册证列表
  registListData: generateRequest(`${baseURL}/certificate/my/register/list`, 'post'),
  // 获取注册证详情
  registDetailListData: generateRequest(`${baseURL}/certificate/my/register/detail`, 'post'),
  // 注册证证号判断供应商自己是否已经维护
  checkRegistDetailData: generateRequest(`${baseURL}/certificate/supplier/check`, 'post'),
  // 注册证号模糊匹配查询
  registDetailSelectData: generateRequest(`${baseURL}/archive/register/certificate/option/list`, 'post'),
  // 注册证延期
  setRegistDelayData: generateRequest(`${baseURL}/certificate/my/register/delay`, 'post'),
  // 注册证换证
  setRegistReplaceData: generateRequest(`${baseURL}/certificate/my/register/replace`, 'post'),
  // 注册证新增编辑
  setRegistSubmitData: generateRequest(`${baseURL}/certificate/my/register/save`, 'post'),
  // 更改注册证状态
  setRegistStatusData: generateRequest(`${baseURL}/certificate/my/register/status`, 'post'),
  // 分页获取厂家总代三证列表
  prodFactoryListData: generateRequest(`${baseURL}/certificate/my/factory-agent/list`, 'post'),
  // 厂家总代三证详情
  prodFactoryDetailData: generateRequest(`${baseURL}/certificate/my/factory-agent/detail`, 'post'),
  // 厂家总代三证更改状态
  setProdFactoryStatusData: generateRequest(`${baseURL}/certificate/my/factory-agent/status`, 'post'),
  // 厂家总代三证编辑提交
  setProdFactorySubmitData: generateRequest(`${baseURL}/certificate/my/factory-agent/edit`, 'post'),
  // 厂家总代三证换证
  setProdFactoryReplaceData: generateRequest(`${baseURL}/certificate/my/factory-agent/edit`, 'post'),
  // 分页获取授权书列表
  authListData: generateRequest(`${baseURL}/certificate/my/auth/list`, 'post'),
  // 获取授权书详情
  authDetailData: generateRequest(`${baseURL}/certificate/my/auth/detail`, 'post'),
  // 授权书停用启用
  setAuthStatusData: generateRequest(`${baseURL}/certificate/my/auth/status`, 'post'),
  // 授权书换证
  setAuthReplaceData: generateRequest(`${baseURL}/certificate/my/auth/replace`, 'post'),
  // 授权书新增编辑
  setAuthSubmitData: generateRequest(`${baseURL}/certificate/my/auth/saveOrUpdate`, 'post'),
  // 授权客户列表
  setAuthCustomerData: generateRequest(`${baseURL}/certificate/my/auth/customers`, 'post'),
  // 授权客户提交
  setAuthCustomerSubData: generateRequest(`${baseURL}/certificate/my/auth/hospital`, 'post'),
  // 总代下拉列表
  agentOptionsData: generateRequest(`${baseURL}/certificate/agent/options`, 'post'),
  // 生产厂家下拉列表
  factoryOptionsData: generateRequest(`${baseURL}/certificate/factory/options`, 'post'),
  // 分页获取委托书列表
  powerListData: generateRequest(`${baseURL}/certificate/my/entrust/list`, 'post'),
  // 获取委托书详情
  powerDetailData: generateRequest(`${baseURL}/certificate/my/entrust/detail`, 'post'),
  // 获取委托书客户名称
  powerDetailCustData: generateRequest(`${baseURL}/contacts/options/customers`, 'post'),
  // 获取委托书详情人员名称
  powerDetailPersonData: generateRequest(`${baseURL}/account/user/options`, 'post'),
  // 委托书停用启用
  powerStatusData: generateRequest(`${baseURL}/certificate/my/entrust/status`, 'post'),
  // 委托书换证
  powerReplaceData: generateRequest(`${baseURL}/certificate/my/entrust/replace`, 'post'),
  // 委托书新增编辑
  powerSubmitData: generateRequest(`${baseURL}/certificate/my/entrust/saveOrUpdate`, 'post'),
  // 分页获取其他证件
  otherListData: generateRequest(`${baseURL}/certificate/my/other/list`, 'post'),
  // 获取其他证件详情
  otherDetailData: generateRequest(`${baseURL}/certificate/my/other/detail`, 'post'),
  // 其他证件停用启用
  otherStatusData: generateRequest(`${baseURL}/certificate/my/other/status`, 'post'),
  // 其他证件换证
  otherReplaceData: generateRequest(`${baseURL}/certificate/my/other/replace`, 'post'),
  // 其他证件新增编辑
  otherSubmitData: generateRequest(`${baseURL}/certificate/my/other/saveOrUpdate`, 'post'),
  // 其他证件客户名称
  otherCustomerData: generateRequest(`${baseURL}/contacts/options/customers`, 'post'),
  // 获取证件数量
  getCertificateNumData: generateRequest(`${baseURL}/certificate/my/statistics`, 'post'),
  // 授权书上级授权单位
  getAuthTypeInfoData: generateRequest(`${baseURL}/organization/getAllTypeInfo`, 'post'),
  // 获取企业证件
  getCompanyDetailData: generateRequest(`${baseURL}/organization/my/certificateList`, 'post'),
  // 企业证件换证
  updateCerticicate: generateRequest(`${baseURL}/organization/updateCertificateForFront`, 'post'),
  // 拒绝原因
  getRefuseReasonListData: generateRequest(`${baseURL}/system/dicValue/dicKey`, 'post'),

  // 授权产品列表
  getAuthProductData: generateRequest(`${baseURL}/certificate/my/auth/products`, 'post'),
  // 授权产品提交
  setAuthProductData: generateRequest(`${baseURL}/certificate/my/auth/register`, 'post'),
  // 其他证件获取证件类型下拉
  getOtherTypeOptions: generateRequest(`${baseURL}/system/dicValue/dicKey/map`, 'post'),

  // 解除换证
  replaceUnbind: generateRequest(`${baseURL}/certificate/supplier/replace/unbind`, 'post'),

  // 标准注册证对照
  getCompareModalList: generateRequest(`${baseURL}/certificate/supplier/compare`, 'post'),

  // 注册证更新
  updateRegist: generateRequest(`${baseURL}/certificate/supplier/register/sync`, 'post'),
  // 注册证删除
  deleteRegist: generateRequest(`${baseURL}/certificate/supplier/register/delete`, 'post'),
}
