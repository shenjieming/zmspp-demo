import axios from '../utils/axiosInstance'
import { baseURL, mockURL } from '../utils/config'
import { stringify } from 'qs'
import request from '../utils/request'
import { message } from 'antd'

// 第一步获取图片验证码
export async function imageCaptcha(data) {
  return axios.post(`${baseURL}/password/forget/image/captcha`, data).catch((error) => {
    message.error('验证码获取错误！')
    return error
  })
}
// 第一步提交
export async function firstSubmit(data) {
  return axios.post(`${baseURL}/password/forget/username/verify`, data).catch((error) => {
    message.error('提交失败！')
    return error
  })
}
// 第二步手机验证码提交
export async function secondMobileSubmit(data) {
  return axios.post(`${baseURL}/password/forget/verify/bymobile`, data).catch((error) => {
    message.error('提交失败！')
    return error
  })
}

// 第二步邮箱验证码提交
export async function secondEmailSubmit(data) {
  return axios.post(`${baseURL}/password/forget/verify/byemail`, data).catch((error) => {
    message.error('提交失败！')
    return error
  })
}

// 第二步 获取手机验证码
export async function secondMobileCaptcha(data) {
  return axios.post(`${baseURL}/password/forget/send/captcha/bymobile`, data).catch((error) => {
    message.error('手机验证码获取失败！')
    return error
  })
}
// 第二步 获取邮箱验证码
export async function secondEmailCaptcha(data) {
  return axios.post(`${baseURL}/password/forget/send/captcha/byemail`, data).catch((error) => {
    message.error('邮箱验证码获取失败！')
    return error
  })
}
// 第三步提交
export async function thirdSubmit(data) {
  return axios.post(`${baseURL}/password/forget/password/reset`, data).catch((error) => {
    message.error('提交失败！')
    return error
  })
}
