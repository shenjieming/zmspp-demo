import { message } from 'antd'
import { generateRequest } from '../../../utils/'
import { baseURL, mockURL, rapMockURL } from '../../../utils/config'


export default {
  // 供应商详情 已建立联系
  getCustomerDetailData: generateRequest(`${baseURL}/contacts/customer/relation/finish/org`, 'post'),
  // 供应商详情 未建立联系
  getEmptyCustomerDetailData: generateRequest(`${baseURL}/contacts/relation/empty/org`, 'post'),
  // 获取详细评价列表
  getDetailListData: generateRequest(`${baseURL}/contacts/appraises`, 'post'),
}

