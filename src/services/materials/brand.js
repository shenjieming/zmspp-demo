import { generateRequest } from '../../utils'
import { mockURL, baseURL } from '../../utils/config'

const api = baseURL

export default {
  // 获取品牌列表
  getBrandListApi: generateRequest(`${api}/materials/brand/list`, 'post'),
  // 获取厂家列表
  getFactoryListApi: generateRequest(`${api}/organization/getProduceFactoryInfo`, 'post'),
  // 更改品牌状态
  updateBrandStatusApi: generateRequest(`${api}/materials/brand/update/status`, 'post'),
  // 批量更改品牌状态
  batchUpdateBrandStatusApi: generateRequest(`${api}/materials/brand/batch/update/status`, 'post'),
  // 获取品牌详情
  getBrandDetailApi: generateRequest(`${api}/materials/brand/detail`, 'post'),
  // 新增品牌
  newBrandApi: generateRequest(`${api}/materials/brand/save`, 'post'),
  // 编辑品牌
  updateBrandApi: generateRequest(`${api}/materials/brand/update`, 'post'),
}

