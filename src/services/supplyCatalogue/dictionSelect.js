import { generateRequest } from '../../utils/'
import { baseURL } from '../../utils/config'
// const rapMockURL = mockURL
export default {
  // 分页获取客户列表
  dictionListData: generateRequest(`${baseURL}/supply/catalog/standard`, 'post'),
  // 加入目录提交
  dictionAddData: generateRequest(`${baseURL}/supply/catalog/save/materials`, 'post'),
  // 获取厂家
  factoryListData: generateRequest(`${baseURL}/organization/getFactoryInfo`, 'post'),
  // 获取标准分类
  categoryListData: generateRequest(`${baseURL}/materials/category68/option/tree/list`, 'post'),
  // 获取注册证
  registListData: generateRequest(`${baseURL}/materials/register/certificate/option/list`, 'post'),
  // 管制证件判断
  materialsCheckData: generateRequest(`${baseURL}/supply/catalog/save/materials/check`, 'post'),
  // 保存至待推送
  saveToPushData: generateRequest(`${baseURL}/supply/catalog/save/materials/batch/push`, 'post'),
  // 推送至审核
  pushToExamineData: generateRequest(`${baseURL}/supply/catalog/save/materials/batch/audit`, 'post'),

  // 品牌option
  getBrandList: generateRequest(`${baseURL}/materials/brand/option/unique-list`, 'post'),

  // 注册证下拉列表
  getCertificateList: generateRequest(`${baseURL}/certificate/my/register/options`, 'post'),
}
