import { generateRequest } from '../../utils/'
import { baseURL } from '../../utils/config'

const api = baseURL
export default {
  // 收货地址列表查询
  getAddressList: generateRequest(`${api}/purchase/receipt/list`, 'post'),
  // 收货地址删除
  remove: generateRequest(`${api}/purchase/receipt/delete`, 'post'),
  // 收货地址新增
  create: generateRequest(`${api}/purchase/receipt/save`, 'post'),
  // 收货地址编辑
  update: generateRequest(`${api}/purchase/receipt/update`, 'post'),
  // 收货地址详情查看
  getAddress: generateRequest(`${api}/purchase/receipt/detail`, 'post'),
  // 收货地址设置为默认
  setDefaultAddress: generateRequest(`${api}/purchase/receipt/default/flag/update`, 'post'),
}
