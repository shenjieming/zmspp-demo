import { message } from 'antd'
import axios from '../../../utils/axiosInstance'
import { generateRequest } from '../../../utils/'
import { baseURL, mockURL, rapMockURL } from '../../../utils/config'

async function downFile() {
  return axios.get(`${baseURL}/organization/key`).catch((error) => {
    message.error('激活文件下载失败！')
    return error
  })
}
export default {
  // 获取组织机构详细信息
  orgDetailData: generateRequest(`${baseURL}/organization/getOrgDetail`, 'post'),
  // 获取组织机构下的证件信息
  orgDetailCertifiData: generateRequest(`${baseURL}/organization/getCertificateList`, 'post'),
  // 获取组织下的人员
  orgPersonData: generateRequest(`${baseURL}/account/user/power/move/list`, 'post'),
  // 设置组织管理权转让
  orgPersonTransData: generateRequest(`${baseURL}/account/user/power/move`, 'post'),
  // 编辑企业信息
  editOrgDetailData: generateRequest(`${baseURL}/organization/updateOrgInfo`, 'post'),
  // 获取企业详情和扩展信息
  certificatesListData: generateRequest(`${baseURL}/organization/getOrgEditDetail`, 'post'),
  // 编辑企业证件
  editCertificateForFront: generateRequest(
    `${baseURL}/organization/updateCertificateForFront`,
    'post',
  ),
  // 获取68码分类树
  getSixEightCodeTree: generateRequest(`${baseURL}/org/business/scope/tree/option`, 'post'),
  // 默认选中的68码树
  queryRunScope: generateRequest(`${baseURL}/org/business/scope/tree/list`, 'post'),
  // 设置选中的68码树
  updateRunScope: generateRequest(`${baseURL}/org/business/scope/tree/save`, 'post'),
  // 更换企业LOGO
  changeLogoImage: generateRequest(`${baseURL}/organization/stopOrganization`, 'post'),
  // 下载激活文件
  downloadFileData: downFile,
}
