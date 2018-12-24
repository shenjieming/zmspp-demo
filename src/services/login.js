import { stringify } from 'qs'
import axios from '../utils/axiosInstance'
import { baseURL, mockURL, rapMockURL } from '../utils/config'

const api = baseURL

export async function silentLogin(data) {
  return axios.post(`${api}/login/silentLogin`, data).catch(err => err)
}

// 账号登陆
export async function accountLogin(data) {
  return axios.post(`${api}/login/account`, data).catch(error => error)
}

// 快速登陆
export async function quickLogin(params) {
  return axios.get(`${api}/login/fast?${stringify(params)}`).catch(error => error)
}

// 获取验证码
export async function getMobileCaptcha(params) {
  return axios.get(`${api}/login/sendVercode?${stringify(params)}`).catch(error => error)
}
