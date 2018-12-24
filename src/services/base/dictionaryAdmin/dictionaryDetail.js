import { generateRequest } from '../../../utils'
import { baseURL, rapMockURL } from '../../../utils/config'

const requestURL = baseURL

export default {
  // 分页获取字典值列表
  listDicValues: generateRequest(`${requestURL}/system/listDicValues`, 'post'),
  // 新增字典值
  saveDicValue: generateRequest(`${requestURL}/system/saveDicValue`, 'post'),
  // 修改、停用字典值
  updateDicValue: generateRequest(`${requestURL}/system/updateDicValue`, 'post'),
}
