import {
  request,
} from '../utils'
import {
  baseURL,
} from '../utils/config'

export async function getTree() {
  return request({
    url: `${baseURL}/menu/tree`,
    method: 'post',
  })
}
export async function getForm(params) {
  return request({
    url: `${baseURL}/menu/theMenuDetail`,
    method: 'post',
    data: params,
  })
}
export async function update(params) {
  return request({
    url: `${baseURL}/menu/updateInfo`,
    method: 'post',
    data: params,
  })
}
export async function create(params) {
  return request({
    url: `${baseURL}/menu/saveInfo`,
    method: 'post',
    data: params,
  })
}

export async function drop(params) {
  return request({
    url: `${baseURL}/menu/menuMove`,
    method: 'post',
    data: params,
  })
}

export async function remove(params) {
  return request({
    url: `${baseURL}/menu/deleteMenu`,
    method: 'post',
    data: params,
  })
}

export async function getTable(params) {
  return request({
    url: `${baseURL}/menu/function/list`,
    method: 'post',
    data: params,
  })
}

export async function updateTable(params) {
  return request({
    url: `${baseURL}/menu/function/update`,
    method: 'post',
    data: params,
  })
}

export async function createTable(params) {
  return request({
    url: `${baseURL}/menu/saveInfo`,
    method: 'post',
    data: params,
  })
}

export async function funStatus(params) {
  return request({
    url: `${baseURL}/menu/function/update-status`,
    method: 'post',
    data: params,
  })
}
export async function removeTable(params) {
  return request({
    url: `${baseURL}/menu/function/delete`,
    method: 'post',
    data: params,
  })
}
