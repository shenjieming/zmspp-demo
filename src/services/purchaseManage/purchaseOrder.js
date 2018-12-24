import { generateRequest } from '../../utils/'
import { baseURL } from '../../utils/config'

const api = baseURL
export default {
  // 采购订单列表
  purchaOrderListApi: generateRequest(`${api}/purchase/order/list`, 'post'),
  // 供应商列表
  supplierListApi: generateRequest(`${api}/contacts/option/suppliers`, 'post'),
  // 催单
  remindApi: generateRequest(`${api}/purchase/order/remind`, 'post'),
  // 更改订单状态
  updateStatusApi: generateRequest(`${api}/purchase/order/status/update`, 'post'),
}
