import { generateRequest } from '../../utils/'
import { baseURL } from '../../utils/config'

const api = baseURL
export default {
  // 采购订单详情
  orderDetailApi: generateRequest(`${api}/customer/order/detail`, 'post'),
  // 配送单跟踪
  deliverListApi: generateRequest(`${api}/customer/order/deliver/list`, 'post'),
  // 订单确认
  confirmOrderApi: generateRequest(`${api}/customer/order/confirm`, 'post'),
}
