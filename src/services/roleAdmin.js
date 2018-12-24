import { generateRequest } from '../utils'
import { baseURL } from '../utils/config'

const api = baseURL

export default {
  getRoleList: generateRequest(`${api}/account/listrole`, 'post'),
}
