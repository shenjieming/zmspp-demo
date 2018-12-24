import { generateRequest } from '../../utils/'
import { baseURL } from '../../utils/config'

const api = baseURL
export default {
  // 客户订单列表
  customerOrderListApi: generateRequest(`${api}/customer/order/list`, 'post'),
  // 客户列表
  customerListApi: generateRequest(`${api}/contacts/options/customers`, 'post'),
  // 订单详情
  orderDetailApi: generateRequest(`${api}/customer/order/detail`, 'post'),
  // 订单确认
  confirmOrderApi: generateRequest(`${api}/customer/order/confirm`, 'post'),
}
