import { generateRequest } from '../../utils'
import { baseURL } from '../../utils/config'

const api = baseURL

export default {
  // 获取分类树形图数据
  getTreeDataApi: generateRequest(`${api}/materials/category68/tree/list`, 'post'),
  // 获取单个节点详情
  getNodeDetailApi: generateRequest(`${api}/materials/category68/detail`, 'post'),
  // 分类编辑保存
  updateCategoryApi: generateRequest(`${api}/materials/category68/update`, 'post'),
  // 新增分类
  saveCategoryApi: generateRequest(`${api}/materials/category68/save`, 'post'),
}

