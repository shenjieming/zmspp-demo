import { generateRequest } from '../../utils'
import { baseURL, rapMockURL } from '../../utils/config'

const requestURL = baseURL

export default {
  // 列表目录统计数查询
  statistics: generateRequest(`${requestURL}/purchase/catalog/statistics`, 'post'),
  // 我的供应商下拉列表
  suppliers: generateRequest(`${requestURL}/contacts/option/suppliers`, 'post'),
  // 使用中/已停用列表
  inUseDisabled: generateRequest(`${requestURL}/purchase/catalog/use/listStatus`, 'post'),
  // 待审核/已拒绝列表
  pendingReviewRefused: generateRequest(`${requestURL}/purchase/catalog/unuse/register-certificate-status`, 'post'),
  // Excel导入
  excelInput: generateRequest(`${requestURL}/materials/excel/import/save`, 'post'),
  // 查看Excel导入进度
  excelSchedule: generateRequest(`${requestURL}/materials/excel/import/list`, 'post'),
  // 新增物料
  addMaterial: generateRequest(`${requestURL}/purchase/catalog/use/addMaterial`, 'post'),
  // 新增物料(供应商)
  splAddMaterial: generateRequest(`${requestURL}/supply/catalog/use/addMaterial`, 'post'),
  // 编辑物料
  updateMaterial: generateRequest(`${requestURL}/purchase/catalog/use/updateMaterial`, 'post'),
  // 批量停用启用
  batchUpdate: generateRequest(`${requestURL}/purchase/catalog/use/batchUpdate`, 'post'),
  // 查看包装规格详情
  viewPackage: generateRequest(`${requestURL}/supply/catalog/package/detail`, 'post'),
  // 编辑包装规格
  editPackage: generateRequest(`${requestURL}/supply/catalog/package`, 'post'),
  // 查看历史列表
  historys: generateRequest(`${requestURL}/supply/catalog/historys`, 'post'),
  // 查看历史详情
  historysDetail: generateRequest(`${requestURL}/supply/catalog/history/detail`, 'post'),
  // 查看历史对比
  historysCompare: generateRequest(`${requestURL}/supply/catalog/compare/history`, 'post'),
  // 查看变更
  seeChange: generateRequest(`${requestURL}/purchase/catalog/unuse/seeChange`, 'post'),
  // 批量接收
  batchReceive: generateRequest(`${requestURL}/purchase/catalog/unuse/batchReceive`, 'post'),
  // 批量拒绝
  batchRefuse: generateRequest(`${requestURL}/purchase/catalog/unuse/batchRefuse`, 'post'),
  // 查看条码
  checkBarcode: generateRequest(`${requestURL}/supply/catalog/barcodes`, 'post'),
  // 查看注册证
  checkCertificate: generateRequest(`${requestURL}/certificate/supplier/register/detail`, 'post'),
}
