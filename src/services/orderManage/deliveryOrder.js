import { generateRequest } from '../../utils/'
import { mockURL, baseURL, rapMockURL } from '../../utils/config'

export default {
  // 分页获取配送单
  queryDeliveryList: generateRequest(`${baseURL}/customer/deliver/order/list`, 'post'),
  // 获取配送单详情
  getDeliveryDetail: generateRequest(`${baseURL}/customer/deliver/order/detail`, 'post'),
  // 获取配送单打印详情
  queryDeliveryDetail: generateRequest(`${baseURL}/customer/deliver/order/detail/print`, 'post'),
  // 保存发票补录
  updateInvoice: generateRequest(`${baseURL}/deliver/order/invoice/update`, 'post'),
  // 获取物流信息
  queryLogisticsMsg: generateRequest(`${baseURL}/order/deliver/trace/list`, 'post'),
  // 获取客户下拉列表
  queryCustomerOPList: generateRequest(`${baseURL}/contacts/options/customers`, 'post'),
  // 作废配送单
  voidDelivery: generateRequest(`${baseURL}/delivery/cancel`, 'post'),
  // 获取配送单个性化配置
  getTableColumns: generateRequest(`${baseURL}/base/print/config/deliver`, 'get'),

  // 再次发货
  againDeliver: generateRequest(`${baseURL}/customer/deliver/order/resend`, 'post'),

  // 获取物流信息
  getLogistInfoData: generateRequest(`${baseURL}/deliver/order/logistics/info`, 'post'),
  // 提交修改的物流信息
  updateLogistInforData: generateRequest(`${baseURL}/deliver/order/logistics/replenish`, 'post'),
  // 物流公司(字典表查询)
  deliveryCompanyApi: generateRequest(`${baseURL}/system/logistics-company`, 'get'),

  // 获取打印标签
  getTabPrintData: generateRequest(`${baseURL}/print/internal/barcode`, 'post'),


  // 校验当前机构中的的配送数据是否能找到
  getCheckData: generateRequest(`${baseURL}/check/internal/barcode`, 'post'),
  // 校验之后获取打印标签
  checkDataList: generateRequest(`${baseURL}/print/internal/barcode/add`, 'post'),
}
