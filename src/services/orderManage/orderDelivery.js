import { generateRequest } from '../../utils/'
import { baseURL } from '../../utils/config'

const api = baseURL
export default {
  // 订单详情
  orderDetailApi: generateRequest(`${api}/customer/order/sender/detail`, 'post'),
  // 注册证
  certificateApi: generateRequest(`${api}/sender/register/certificate/option/list`, 'post'),
  // 获取配送单信息
  // getDeliveryDetailApi: generateRequest(`${api}/deliver/order/detail`, 'post'),
  getDeliveryDetailApi: generateRequest(`${api}/customer/deliver/order/detail-resend`, 'post'),
  // 物流公司(字典表查询)
  deliveryCompanyApi: generateRequest(`${api}/system/logistics-company`, 'get'),
  // 缓存信息
  tempInfoApi: generateRequest(`${api}/deliver/temporary/save`, 'post'),
  // 确认发货
  deliverSubmitApi: generateRequest(`${api}/deliver/save`, 'post'),
  // 发货扫码
  deliveryBarcodeApi: generateRequest(`${api}/delivery/scan/barcode`, 'post'),
  // 获取配送单个性化配置
  getTableColumns: generateRequest(`${api}/base/print/config/deliver`, 'get'),
  // 获取操作人联系号码
  getPersonalMobile: generateRequest(`${api}/account/user/personal`, 'post'),
  // 判断是否允许批号相同
  getAscription: generateRequest(`${api}/organization/ascription`, 'get'),
}
