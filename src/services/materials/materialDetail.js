import { generateRequest } from '../../utils/'
import { mockURL, baseURL, rapMockURL } from '../../utils/config'
// const rapMockURL = mockURL
export default {


  // 新增规格
  saveSku: generateRequest(`${baseURL}/materials/sku/save`, 'post'),
  // 新增规格
  updateSku: generateRequest(`${baseURL}/materials/sku/update`, 'post'),
  // 查询规格列表
  querySkuList: generateRequest(`${baseURL}/materials/sku/list`, 'post'),
  // 查询物料详情
  queryMaterialDetail: generateRequest(`${baseURL}/materials/detail`, 'post'),
  // 查询规格详情
  querySkuDetail: generateRequest(`${baseURL}/materials/sku/detail`, 'post'),
  // 异步获取规格单位
  getSkuDicValueList: generateRequest(`${baseURL}/system/dicValue/dicKey`, 'post'),
  // 停用启用
  onOffStatus: generateRequest(`${baseURL}/materials/sku/update/status`, 'post'),
  // 批量停用启用
  mountOnOffStatus: generateRequest(`${baseURL}/materials/sku/batch/update/status`, 'post'),
  // 查询版本列表
  getVersionList: generateRequest(`${baseURL}/materials/sku/version/list`, 'post'),
  // 查询版本对比列表
  getCompareList: generateRequest(`${baseURL}/materials/sku/version/compare`, 'post'),
  // 查询版本详情
  queryVersionDetail: generateRequest(`${baseURL}/materials/sku/version/detail`, 'post'),
  // 查询包装规格列表
  queryPackageList: generateRequest(`${baseURL}/materials/sku/package/list`, 'post'),
  // 查询包装规格列表
  savePackage: generateRequest(`${baseURL}/materials/sku/package/save`, 'post'),
  // 物料规格查询物资码列表
  queryBarCodeList: generateRequest(`${baseURL}/materials/sku/bind/barcode/list`, 'post'),
  // 物料规格批量绑定物资码
  saveBarCodeList: generateRequest(`${baseURL}/materials/sku/bind/barcode/batch/save`, 'post'),
  // 解析物资码
  resoleCodeBarData: generateRequest(`${baseURL}/barcode/resolve`, 'post'),
  // 查看条码规则详情
  queryRuleDetail: generateRequest(`${baseURL}/materials/barcode/detail`, 'post'),
}
