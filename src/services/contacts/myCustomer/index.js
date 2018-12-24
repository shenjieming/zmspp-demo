import { message } from 'antd'
import { generateRequest } from '../../../utils/'
import { baseURL, mockURL, rapMockURL } from '../../../utils/config'


export default {
  // 获取我的客户列表
  getCustomerListData: generateRequest(`${baseURL}/contacts/customers`, 'post'),
  // 设置我的客户联系人信息
  customerContrastData: generateRequest(`${baseURL}/contacts/customer/information/contact`, 'post'),
  // 解除客户关系
  removeRelation: generateRequest(`${baseURL}/contacts/customer/relation/remove`, 'post'),
  // 恢复客户关系
  recoverRelation: generateRequest(`${baseURL}/contacts/supplier/relation/recover`, 'post'),
  // 我的客户添加列表
  addCustomerListData: generateRequest(`${baseURL}/contacts/apply/customers`, 'post'),
  // 添加客户申请恢复关系
  addCustomerApplyData: generateRequest(`${baseURL}/contacts/apply/customer`, 'post'),
  // 恢复客户关系异步校验
  recoverRelationSync: generateRequest(`${baseURL}/contacts/supplier/relation/recover/check`, 'post'),
}

