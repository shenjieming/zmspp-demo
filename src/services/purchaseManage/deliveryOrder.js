import { generateRequest } from '../../utils/'
import { mockURL, baseURL, rapMockURL } from '../../utils/config'

export default {
  // 分页获取配送单
  queryDeliveryList: generateRequest(`${baseURL}/deliver/order/list`, 'post'),
  // 获取配送单详情
  queryDeliveryDetail: generateRequest(`${baseURL}/deliver/order/detail`, 'post'),
  // 获取物流信息
  queryLogisticsMsg: generateRequest(`${baseURL}/order/deliver/trace/list`, 'post'),
  // 异步下拉供应商
  querySupplierOPList: generateRequest(`${baseURL}/contacts/option/suppliers`, 'post'),
  // 打印验收单
  printCheckOrder: generateRequest(`${baseURL}/delivery/scan/print`, 'post'),
}
