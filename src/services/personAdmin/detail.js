import { baseURL, mockURL, rapMockURL } from '../../utils/config'
import { stringify } from 'qs'
import request from '../../utils/request'

// 获取人员详情
export async function personDetailData(data) {
  return request({
    url: `${baseURL}/account/user`,
    method: 'post',
    data,
  })
}
// 获取人员下角色详情
export async function personRoleData(data) {
  return request({
    url: `${baseURL}/account/user/has/role`,
    method: 'post',
    data,
  })
}
// 移除人员下的角色
export async function delpersonRoleData(data) {
  return request({
    url: `${baseURL}/account/user/remove/role`,
    method: 'post',
    data,
  })
}
// 移除人员
export async function delPersonData(data) {
  return request({
    url: `${baseURL}/account/user/remove`,
    method: 'post',
    data,
  })
}
// 获取组织下的全部角色
export async function orgRoleData(data) {
  return request({
    url: `${baseURL}/account/role/org`,
    method: 'post',
    data,
  })
}
// 编辑人员下的角色
export async function setPersonRole(data) {
  return request({
    url: `${baseURL}/account/user/saveRole`,
    method: 'post',
    data,
  })
}
// 编辑人员所在的部门
export async function setPersonDept(data) {
  return request({
    url: `${baseURL}/account/user/change/dept`,
    method: 'post',
    data,
  })
}
// 获取组织下上级部门下拉数据
export async function deptTreeData(data) {
  return request({
    url: `${baseURL}/account/dept/tree`,
    method: 'post',
    data,
  })
}
