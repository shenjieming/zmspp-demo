import { generateRequest } from '../../../utils'
import { baseURL, rapMockURL } from '../../../utils/config'

const requestURL = baseURL

export default {
  // 收货地址列表查询
  receiptList: generateRequest(`${requestURL}/purchase/receipt/list`, 'post'),
  // 收货地址新增
  create: generateRequest(`${requestURL}/purchase/receipt/save`, 'post'),
  // 收货地址编辑
  update: generateRequest(`${requestURL}/purchase/receipt/update`, 'post'),
  // 订单确认详情
  orderDetail: generateRequest(`${requestURL}/purchase/order/confirm/detail`, 'post'),
  // 提交订单
  saveOrder: generateRequest(`${requestURL}/purchase/order/save`, 'post'),
  // 再来一单详情
  agenOrderDetail: generateRequest(`${requestURL}/purchase/order/detail`, 'post'),
  // 物资状态
  usingStatus: generateRequest(`${requestURL}/purchase/catalog/using/status`, 'post'),
}
