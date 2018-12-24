import { generateRequest } from '../../../utils'
import { baseURL, rapMockURL } from '../../../utils/config'

const requestURL = baseURL

export default {
  // 常采购物料列表查询
  commonList: generateRequest(`${requestURL}/purchase/materials/common/list`, 'post'),
  // 采购物料列表查询
  materialsList: generateRequest(`${requestURL}/purchase/materials/list`, 'post'),
  // 查看包装规格详情
  viewPackage: generateRequest(`${requestURL}/supply/catalog/package/detail`, 'post'),
  // 编辑包装规格
  editPackage: generateRequest(`${requestURL}/supply/catalog/package`, 'post'),
  // 查看购物车
  cartDetail: generateRequest(`${requestURL}/purchase/shopping/car/detail`, 'post'),
  // 添加购物车
  addToCart: generateRequest(`${requestURL}/purchase/shopping/materials/save`, 'post'),
  // 移除购物车
  deleteCart: generateRequest(`${requestURL}/purchase/shopping/materials/delete`, 'post'),
  // 获取供应商
  suppliers: generateRequest(`${requestURL}/contacts/option/hepler/suppliers`, 'post'),
  // 常用供应商
  commonSupplier: generateRequest(`${requestURL}/purchase/common/supplier/list`, 'post'),
  // 添加常用供应商
  addCommonSupplier: generateRequest(`${requestURL}/purchase/common/supplier/save`, 'post'),
  // 删除常用供应商
  deleteCommonSupplier: generateRequest(`${requestURL}/purchase/common/supplier/delete`, 'post'),
  // 物资状态
  usingStatus: generateRequest(`${requestURL}/purchase/catalog/using/status`, 'post'),
}
