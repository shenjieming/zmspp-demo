import { generateRequest } from '../../utils/'
import { baseURL } from '../../utils/config'

const api = baseURL
export default {
  // 查询评价机构
  supplierInfoApi: generateRequest(`${api}/purchase/appraise/supplier`, 'post'),
  // 评价新增
  saveAppraiseApi: generateRequest(`${api}/purchase/appraise/save`, 'post'),
}
