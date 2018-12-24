import { generateRequest } from '../../utils/'
import { mockURL, baseURL, rapMockURL } from '../../utils/config'
// const rapMockURL = mockURL
export default {
  // 分页获取物料
  getMaterialList: generateRequest(`${baseURL}/materials/list`, 'post'),
  // 新增物料
  addMaterial: generateRequest(`${baseURL}/materials/save`, 'post'),
  // 新增物料
  editMaterialSave: generateRequest(`${baseURL}/materials/update`, 'post'),
  // 导入保存
  importFile: generateRequest(`${baseURL}/materials/excel/import/save`, 'post'),
  // 停用启用
  onOffStatus: generateRequest(`${baseURL}/materials/update/status`, 'post'),
  // 批量停用启用
  mountOnOffStatus: generateRequest(`${baseURL}/materials/batch/update/status`, 'post'),
  // 导入进度
  importSchedule: generateRequest(`${baseURL}/materials/excel/import/list`, 'post'),
  // 查询物料详情
  queryMaterialDetail: generateRequest(`${baseURL}/materials/detail`, 'post'),
  // 查询版本列表
  getVersionList: generateRequest(`${baseURL}/materials/version/list`, 'post'),
  // 查询版本对比列表
  getCompareList: generateRequest(`${baseURL}/materials/version/compare`, 'post'),
  // 查询版本详情
  queryVersionDetail: generateRequest(`${baseURL}/materials/version/detail`, 'post'),
  // 下拉分类树
  queryOptionTree: generateRequest(`${baseURL}/materials/category68/option/tree/list`, 'post'),
  // 注册证option
  queryOptionRegList: generateRequest(
    `${baseURL}/materials/register/certificate/option/materials/list`,
    'post',
  ),
  // 品牌option
  getBrandList: generateRequest(`${baseURL}/materials/brand/option/list`, 'post'),
  // 品牌option
  getProduceFacList: generateRequest(
    `${baseURL}/organization/getProduceFactoryCompositionInfo`,
    'post',
  ),
}
