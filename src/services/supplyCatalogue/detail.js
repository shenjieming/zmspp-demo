import { generateRequest } from '../../utils/'
import { mockURL, baseURL, rapMockURL } from '../../utils/config'
// const rapMockURL = mockURL
export default {
  // 字典表
  manageType: generateRequest(`${baseURL}/system/dicValue/dicKey`, 'post'),
  // 保存供应商条码
  setCustomerCodeBarListData: generateRequest(`${baseURL}/customer/save/catalog/barcodes`, 'post'),
  customerDetailData: generateRequest(`${baseURL}/supply/catalog/customer/statistic`, 'post'),
  // 分页获取客户列表
  customerListData: generateRequest(`${baseURL}/supply/catalog/customers`, 'post'),
  // 使用中/已停用 获取数据列表
  catalogDisList: generateRequest(`${baseURL}/supply/catalog/use/status`, 'post'),
  // 待审核/已拒绝 获取数据列表
  catalogRefuseList: generateRequest(`${baseURL}/supply/catalog/review/status`, 'post'),
  // 查看包装规格维护
  packageListData: generateRequest(`${baseURL}/supply/catalog/package/detail`, 'post'),
  // 编辑包装规格维护
  editPackageListData: generateRequest(`${baseURL}/supply/catalog/package`, 'post'),
  // 查看物料详情
  editMaterialListData: generateRequest(`${baseURL}/supply/catalog/detail`, 'post'),
  // 编辑物料
  setEditMaterialListData: generateRequest(`${baseURL}/supply/update/catalog/detail`, 'post'),
  // 查看物资码
  getCodeBarListData: generateRequest(`${baseURL}/supply/catalog/barcodes`, 'post'),
  // 绑定物资码
  setCodeBarListData: generateRequest(`${baseURL}/supply/save/catalog/barcodes`, 'post'),
  // 获取历史列表
  historyListData: generateRequest(`${baseURL}/supply/catalog/historys`, 'post'),
  // 版本对比
  compareHistoryData: generateRequest(`${baseURL}/supply/catalog/compare/history`, 'post'),
  // 查看单个历史
  singleCompareHistoryData: generateRequest(`${baseURL}/supply/catalog/history/detail`, 'post'),
  // 查看注册证列表
  getRegistListData: generateRequest(`${baseURL}/certificate/supplier/register/bind/list`, 'post'),
  // 保存单个或者批量的注册证
  registSubmitData: generateRequest(`${baseURL}/supply/batch/bind/certificate`, 'post'),
  // 删除条码
  delSkuBarcodeData: generateRequest(`${baseURL}/supply/delete/catalog/barcodes`, 'post'),

  // 全部
  allTableData: generateRequest(`${baseURL}/supply/catalog/review/all`, 'post'),
  // 使用中
  useTableData: generateRequest(`${baseURL}/supply/catalog/use/status/enable`, 'post'),
  // 待审核
  pendingTableData: generateRequest(`${baseURL}/supply/catalog/review/status/pending-audit`, 'post'),
  // 待推送
  pushTableData: generateRequest(`${baseURL}/supply/catalog/review/status/pending-push`, 'post'),
  // 已拒绝
  refusedTableData: generateRequest(`${baseURL}/supply/catalog/review/status/refused`, 'post'),
  // 已停用
  disabledTableData: generateRequest(`${baseURL}/supply/catalog/use/status/disable`, 'post'),
  // 品牌option
  getBrandList: generateRequest(`${baseURL}/materials/brand/option/unique-list`, 'post'),

  // 使用中和已停用保存至待推送
  saveUseToPushData: generateRequest(`${baseURL}/supply/update/use/catalog/batch/pending-push`, 'post'),
  // 待审核、已拒绝、待推送 推送到待推送
  saveUnseToPushData: generateRequest(`${baseURL}/supply/update/un-use/catalog/batch/pending-push`, 'post'),


  // 使用中和已停用 推送到待审核
  pushUseToExamineData: generateRequest(`${baseURL}/supply/update/use/catalog/batch/pending-audit`, 'post'),
  // 待审核、已拒绝、待推送 推送到待审核
  pushUnseToExamineData: generateRequest(`${baseURL}/supply/update/un-use/catalog/batch/pending-audit`, 'post'),

  getCompareData: generateRequest(`${baseURL}/supply/purchase/catalog/compare`, 'get'),

  batchCancel: generateRequest(`${baseURL}/supply/cancel/un-use/catalog/batch`, 'post'),

  // 删除待推送
  pendingPushDel: generateRequest(`${baseURL}/supply/delete/un-use/catalog`, 'post'),

  // 注册证下拉列表
  getCertificateList: generateRequest(`${baseURL}/certificate/my/register/options`, 'post'),

}
