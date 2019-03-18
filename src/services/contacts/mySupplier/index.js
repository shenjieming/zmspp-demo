import { generateRequest } from '../../../utils'
import { baseURL, rapMockURL } from '../../../utils/config'

const requestURL = baseURL

export default {
  // 分页显示我的供应商列表
  suppliers: generateRequest(`${requestURL}/contacts/suppliers`, 'post'),
  // 编辑供应商联系人信息
  contact: generateRequest(`${requestURL}/contacts/supplier/information/contact`, 'post'),
  // 解除供应商关系
  remove: generateRequest(`${requestURL}/contacts/supplier/relation/remove`, 'post'),
  // 恢复供应商关系异步校验
  check: generateRequest(`${requestURL}/contacts/customer/relation/recover/check`, 'post'),
  // 申请恢复供应商
  recover: generateRequest(`${requestURL}/contacts/customer/relation/recover`, 'post'),
  // 添加供应商列表
  addSuppliersList: generateRequest(`${requestURL}/contacts/apply/suppliers`, 'post'),
  // 申请添加供应商列表
  applyAddSuppliers: generateRequest(`${requestURL}/contacts/apply/supplier`, 'post'),
  // 开启证件修改
  open: generateRequest(`${requestURL}/contacts/supplier/relation/edit-open`, 'post'),
  // 关闭证件修改
  close: generateRequest(`${requestURL}/contacts/supplier/relation/edit-close`, 'post'),
}
