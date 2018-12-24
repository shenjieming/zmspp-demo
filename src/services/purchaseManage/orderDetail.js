import { generateRequest } from '../../utils/'
import { baseURL } from '../../utils/config'

const api = baseURL
export default {
  // 采购订单详情
  orderDetailApi: generateRequest(`${api}/purchase/order/detail`, 'post'),
  // 配送单跟踪
  deliverListApi: generateRequest(`${api}/purchase/order/deliver/list`, 'post'),
  // 催单
  remindApi: generateRequest(`${api}/purchase/order/remind`, 'post'),
  // 更改订单状态
  updateStatusApi: generateRequest(`${api}/purchase/order/status/update`, 'post'),
  // 物资状态
  usingStatus: generateRequest(`${api}/purchase/catalog/using/status`, 'post'),
}
