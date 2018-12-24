import axios from '../utils/axiosInstance'
import { baseURL, mockURL } from '../utils/config'
import { stringify } from 'qs'
import request from '../utils/request'
import { message } from 'antd'

// 获取验证码
export async function mobileCaptcha(data) {
  return axios.post(`${baseURL}/account/register/send/mobile/captcha`, data).catch((error) => {
    message.error('验证码获取错误！')
    return error
  })
}
// 获取供应商列表
export async function supplierData(data) {
  return axios.post(`${baseURL}/organization/getAllTypeInfo`, data).catch((error) => {
    message.error('列表获取错误！')
    return error
  })
}
// 获取医院列表
export async function hospitalData(data) {
  return axios.post(`${baseURL}/organization/getHostpitalInfo`, data).catch((error) => {
    message.error('列表获取错误！')
    return error
  })
}
// 用户名唯一性校验
export async function usernameUniqueData(data) {
  return axios.post(`${baseURL}/account/loginName/unique/verify`, data).catch((error) => {
    message.error('用户名校验错误！')
    return error
  })
}
// 手机号码唯一性校验
export async function mobileUniqueData(data) {
  return axios.post(`${baseURL}/account/mobile/unique/verify`, data).catch((error) => {
    message.error('手机号码校验错误！')
    return error
  })
}
// 注册
export async function registData(data) {
  return axios.post(`${baseURL}/account/register`, data).catch((error) => {
    message.error('注册错误！')
    return error
  })
}
