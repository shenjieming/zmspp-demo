/**
 * 该文件创建axios实例，以及设置一些默认配置
 */

import axios, { defaults } from 'axios'
import Cookies from 'js-cookie'
import {
  REQUEST_HEADER_SYSTEM_CODE,
  SYSTEM_CODE,
  TOKEN,
  REQUEST_TIMEOUT,
  REQUEST_HEADER_USER_ID,
} from '../utils/config'

let userId = null

export function setRequestUserId(id) {
  userId = id
}

const instance = axios.create({
  timeout: REQUEST_TIMEOUT,
  headers: {
    [REQUEST_HEADER_SYSTEM_CODE]: SYSTEM_CODE,
  },
  transformRequest: [
    (data, headers) => {
      /* eslint-disable no-param-reassign */
      const token = Cookies.get(TOKEN)
      if (token) {
        headers[TOKEN] = token
      }
      if (userId) {
        headers[REQUEST_HEADER_USER_ID] = userId
      }
      try {
        const res = JSON.parse(JSON.stringify(data), (k, v) => {
          if (typeof v === 'string') {
            return v.trim()
          }
          return v
        })
        return res
      } catch (error) {
        return data
      }
    },
    ...defaults.transformRequest,
  ],
  transformResponse: [
    (data) => {
      /* eslint no-param-reassign:0 */
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data, (k, v) => {
            if (k === '') {
              return v
              // 将null转化为undefined
            } else if (v === null) {
              return undefined
            }
            return v
          })
        } catch (e) {
          /* Ignore */
        }
      }
      return data
    },
  ],
})

export default instance
