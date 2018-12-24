import { baseURL } from '../../../utils/config'
import axios from '../../../utils/axiosInstance'

const requestURL = baseURL

export default {
  // 客户订单详情查看（短链接）
  getOrderDetail: async function f(data) {
    return axios
      .post(`${requestURL}/customer/order/detail/shorter`, data)
      .then(res => res)
      .catch(() => false)
  },
  // 提交确认信息（短链接）
  confirmOrder: async function f(data) {
    return axios
      .post(`${requestURL}/customer/order/confirm/shorter`, data)
      .then(res => res)
      .catch(() => false)
  },
}
