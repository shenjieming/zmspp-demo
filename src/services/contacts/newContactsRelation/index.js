import { generateRequest } from '../../../utils'
import { baseURL, rapMockURL } from '../../../utils/config'

const requestURL = baseURL

export default {
  // 新的往来关系列表
  relationList: generateRequest(`${requestURL}/contacts/org/relation/apply`, 'post'),
  // 新的往来关系状态更改
  relationStatus: generateRequest(`${requestURL}/contacts/org/relation/reply`, 'post'),
}
