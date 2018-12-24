import { generateRequest } from '../../utils/'
import { mockURL, rapMockURL, baseURL } from '../../utils/config'
// const baseURL = rapMockURL
export default {
  // 分页获取注册证
  getCertList: generateRequest(`${baseURL}/materials/register/certificate/list`, 'post'),
  // 新增注册证
  addCert: generateRequest(`${baseURL}/materials/register/certificate/save`, 'post'),
  // 编辑保存注册证
  editCert: generateRequest(`${baseURL}/materials/register/certificate/update`, 'post'),
  // 停用启用注册证
  onOffCert: generateRequest(`${baseURL}/materials/register/certificate/update/status`, 'post'),
  // 批量停用启用注册证
  mountOnOff: generateRequest(
    `${baseURL}/materials/register/certificate/batch/update/status`,
    'post',
  ),
  // 查看注册证详情
  viewDetailCert: generateRequest(`${baseURL}/materials/register/certificate/detail`, 'post'),
  // 查看注册证版本列表
  viewCerNoList: generateRequest(`${baseURL}/materials/register/certificate/version/list`, 'post'),
  // 查看注册证版本比对列表
  viewCertNoCompareList: generateRequest(
    `${baseURL}/materials/register/certificate/version/compare`,
    'post',
  ),
  // 查询注册证版本详情
  getCertNoDetail: generateRequest(
    `${baseURL}/materials/register/certificate/version/detail`,
    'post',
  ),
  // 获取厂家列表
  getProduceFacList: generateRequest(
    `${baseURL}/organization/getProduceFactoryCompositionInfo`,
    'post',
  ),
  // 获取供应商
  getSuppProList: generateRequest(`${baseURL}/organization/getSupplierCompositionInfo`, 'post'),
  // 获取新证件
  getNewCertList: generateRequest(`${baseURL}/materials/register/certificate/option/list`, 'post'),
  // 获取所有供应商/供应商
  getAllTypeInfo: generateRequest(`${baseURL}/organization/getAllTypeInfo`, 'post'),
}
