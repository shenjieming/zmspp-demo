import { generateRequest } from '../../utils/'
import { baseURL } from '../../utils/config'

const api = baseURL
export default {
  getDataApi: generateRequest(`${api}/account/listrole`, 'post'),
  getMenusApi: generateRequest(`${api}/menu/withFunctionTree`, 'post'),
  addOneApi: generateRequest(`${api}/account/saveRole`, 'post'),
}
