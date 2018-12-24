import { baseURL, mockURL, rapMockURL } from '../../utils/config'
import { stringify } from 'qs'
import request from '../../utils/request'

// 获取人员管理 部门树数据
export async function deptTreeData(data) {
  return request({
    url: `${baseURL}/account/dept/tree`,
    method: 'post',
    data,
  })
}
// 获取人员管理 部门下人员列表
export async function personTableData(data) {
  return request({
    url: `${baseURL}/account/user/listUser`,
    method: 'post',
    data,
  })
}
// 获取部门详情
export async function deptDetailData(data) {
  return request({
    url: `${baseURL}/account/dept`,
    method: 'post',
    data,
  })
}
// 获取组织下上级部门下拉数据
export async function deptSelectData(data) {
  return request({
    url: `${baseURL}/account/dept/options`,
    method: 'post',
    data,
  })
}
// 修改部门信息
export async function putDeptData(data) {
  return request({
    url: `${baseURL}/account/updateDept`,
    method: 'post',
    data,
  })
}
// 新增部门信息
export async function postDeptData(data) {
  return request({
    url: `${baseURL}/account/saveDept`,
    method: 'post',
    data,
  })
}
// 删除部门
export async function delDeptData(data) {
  return request({
    url: `${baseURL}/account/removeDept`,
    method: 'post',
    data,
  })
}
// 判断用户是否已经注册
export async function registFlagData(data) {
  return request({
    url: `${baseURL}/account/user/mobile`,
    method: 'post',
    data,
  })
}
// 人员已注册关联人员 , noRegistPersonData
export async function registPersonData(data) {
  return request({
    url: `${baseURL}/account/user/build/relation`,
    method: 'post',
    data,
  })
}
// 人员未注册关联人员
export async function noRegistPersonData(data) {
  return request({
    url: `${baseURL}/account/user/saveUser`,
    method: 'post',
    data,
  })
}
// 用户名唯一性校验
export async function usernameUniqueData(data) {
  return request({
    url: `${baseURL}/account/loginName/unique/verify`,
    method: 'post',
    data,
  })
}
