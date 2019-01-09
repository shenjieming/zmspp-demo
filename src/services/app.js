import SockJS from 'sockjs-client'
import StompJS from 'stompjs'
import { generateRequest } from '../utils/'
// sockURL 11/30删除
import { mockURL, baseURL , subscribeURL } from '../utils/config'
import axios from '../utils/axiosInstance'

const api = baseURL

// let stompClient = null  11/30 删除

export default {
  // 用户注销
  // 不处理错误
  logout: () => {
    axios
      .post(`${api}/loginOut`, {})
      .then(rs => rs.data)
      .catch(e => e)
  },
  // 获取基础代码
  queryBasecode: generateRequest(`${api}/basecode/options`, 'get')  ,
  // 获取物资标准分类
  queryStandardCategoryTree: generateRequest(`${api}/goods/standard/category/tree`, 'get'),
  // 获取用户菜单
  getMenuData: generateRequest(`${api}/menu/own`, 'post'),
  // 切换组织
  switchOrg: generateRequest(`${api}/account/changeOrg`, 'get'),
  // 获取地址
  queryAddress: generateRequest(`${api}/system/address/tree`, 'post'),
  // 获取68码树
  getSexEightCodeTree: generateRequest(`${api}/organization/getGoodsClassList`, 'get'),
  // 打开webSocket连接 11/30删除
  // msgSocketConnect: ({ orgId, userId, action }) => {
  //   if (!stompClient) {
  //     const socket = new SockJS(sockURL)
  //
  //     stompClient = StompJS.over(socket)
  //
  //     stompClient.connect({}, () => {
  //       stompClient.subscribe(
  //         subscribeURL,
  //         (rs) => {
  //           action(JSON.parse(rs.body))
  //         },
  //         { userId: orgId + userId },
  //       )
  //     })
  //   }
  // },
  // 关闭webSocket连接   11/30删除
  // msgSocketDisconnect: () => {
  //   if (stompClient) {
  //     stompClient.disconnect()
  //     stompClient = null
  //   }
  // },
  // 获取所有未读
  getAllNoReadMsg: generateRequest(`${api}/msg/popup/list`, 'post'),
  // 包装单位
  packageUnitData: generateRequest(`${api}/system/dicValue/dicKey`, 'post'),
  // 全部已读
  setReadAll: generateRequest(`${api}/msg/popup/readAll`, 'post'),
  // 单条已读
  setReadOne: generateRequest(`${api}/msg/popup/read`, 'post'),
  // 选择默认供应商
  chooseDefaultOrg: generateRequest(`${api}/account/user/default/org`, 'post'),
  // 获取个性化配置
  getPersonalityConfig: generateRequest(`${api}/organization/custom-data`, 'get'),
  // 获取注册证配置列表
  getRegistList: generateRequest(`${api}/system/dicValue/dicKey`, 'post'),
}
