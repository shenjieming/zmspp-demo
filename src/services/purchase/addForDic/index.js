import { generateRequest } from '../../../utils'
import { baseURL, rapMockURL } from '../../../utils/config'

const requestURL = baseURL

export default {
  // 平台标准字典查询
  terrace: generateRequest(`${requestURL}/purchase/catalog/standard`, 'post'),
  // 我的供应商下拉列表
  suppliers: generateRequest(`${requestURL}/contacts/option/suppliers`, 'post'),
  // 标准字典加入采购目录
  addStandardMaterial: generateRequest(`${requestURL}/purchase/catalog/use/addStandardMaterial`, 'post'),
  // 获取生产厂家信息
  getProduceFactoryInfo: generateRequest(`${requestURL}/organization/getProduceFactoryInfo`, 'post'),
  // 获取注册证选项
  certificate: generateRequest(`${requestURL}/materials/register/certificate/option/list`, 'post'),
  // 物料68分类选项查询
  category68: generateRequest(`${requestURL}/materials/category68/option/tree/list`, 'post'),
}
