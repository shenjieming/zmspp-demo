import qs from 'qs'
import { isEmpty, inRange } from 'lodash'
import axios from './axiosInstance'
import { REQUEST_SUCCESS_REGION } from './config'

const fetch = (options) => {
  const { method = 'get', data = {}, headers, url } = options

  switch (method.toLowerCase()) {
    case 'get':
      return axios.get(`${url}${!isEmpty(data) ? `?${qs.stringify(data)}` : ''}`)
    case 'delete':
      return axios.delete(`${url}${!isEmpty(data) ? `?${qs.stringify(data)}` : ''}`)
    case 'head':
      return axios.head(url, { headers })
    case 'post':
      return axios.post(url, data)
    case 'put':
      return axios.put(url, data)
    case 'patch':
      return axios.patch(url, data)
    default:
      return axios(options)
  }
}

export default function request(options) {
  const tempOptions = { ...options }

  return fetch(tempOptions)
    .then((response) => {
      const { data } = response
      const { code } = data

      if (inRange(code, ...REQUEST_SUCCESS_REGION)) {
        return data
      }
      throw response
    })
}
