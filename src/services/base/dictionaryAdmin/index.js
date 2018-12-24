import { generateRequest } from '../../../utils'
import { baseURL, rapMockURL } from '../../../utils/config'

const requestURL = baseURL

export default {
  // 分页获取字典列表
  listDics: generateRequest(`${requestURL}/system/listDics`, 'post'),
  // 新增字典
  saveDic: generateRequest(`${requestURL}/system/saveDic`, 'post'),
  // 修改、停用字典
  updateDic: generateRequest(`${requestURL}/system/updateDic`, 'post'),
}
