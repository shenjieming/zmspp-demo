import { generateRequest } from '../../../utils/'
import { baseURL } from '../../../utils/config'


export default {
  // 获取供应商对比列表
  getContrastListData: generateRequest(`${baseURL}/contacts/compare/suppliers`, 'post'),
  // 模糊匹配搜索供应商名称
  getOrgListData: generateRequest(`${baseURL}/contacts/option/compare/suppliers`, 'post'),
  // 供应商对照 重新对照
  setContrastData: generateRequest(`${baseURL}/contacts/supplier/compare`, 'post'),
}

