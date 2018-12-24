import { message } from 'antd'
import { generateRequest } from '../../../utils'
import { baseURL, mockURL, rapMockURL } from '../../../utils/config'


export default {
  // 获取供应商详情 已建立联系
  supplierDetail: generateRequest(`${baseURL}/contacts/supplier/relation/finish/org`, 'post'),
  // 获取供应商详情 未建立联系
  emptySupplierDetail: generateRequest(`${baseURL}/contacts/relation/empty/org`, 'post'),
  // 恢复供应商关系异步校验
  recoverRelationCheck: generateRequest(`${baseURL}/contacts/customer/relation/recover/check`, 'post'),
  // 恢复供应商关系
  recoverRelation: generateRequest(`${baseURL}/contacts/customer/relation/recover`, 'post'),
  // 解除供应商关系
  removeRelation: generateRequest(`${baseURL}/contacts/supplier/relation/remove`, 'post'),
  // 评价列表
  appraises: generateRequest(`${baseURL}/contacts/appraises`, 'post'),
}

