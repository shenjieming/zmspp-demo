import React from 'react'
import { ORG_TYPE } from '../../../utils/constant'
import { manageFlag } from '../../../utils/index'

const arr = ['03', '04', '07']
const auditStatusText = [
  <span className="aek-red">待完善</span>,
  <span className="aek-red">待审核</span>,
  <span className="aek-green">已审核</span>,
  <span className="aek-red">已拒绝</span>,
  <span className="aek-red">无账号</span>,
]
let leftData = {}
let rightData = {}

const data = (currentOrgDetail) => {
  const {
    addName,
    addTime,
    auditStatus,
    businessScope,
    email,
    fax,
    lastLoginTime,
    legalPerson,
    mobile,
    officeAddress,
    arrayOrgOfficeAddr,
    orgName,
    orgStatus,
    orgTypeCode,
    parentOrgName,
    phone,
    principal,
    registerSource,
    registeredAddress,
    arrayOrgRegAddr,
  } = currentOrgDetail
  const scopeShowStatus = manageFlag(orgTypeCode)
  const getOrgTypeText = () => {
    for (const item of ORG_TYPE) {
      if (item.id === orgTypeCode) {
        return item.name
      }
    }
    return ''
  }
  const officeArr = arrayOrgOfficeAddr || ''
  const regArr = arrayOrgRegAddr || ''
  if (arr.includes(orgTypeCode)) {
    leftData = {
      机构名称: orgName,
      上级机构: parentOrgName,
      机构类型: getOrgTypeText(),
      法人: legalPerson,
      联系负责人: principal,
      手机号: mobile,
      固话: phone,
      传真: fax,
      邮箱: email,
      注册地址: `${regArr && regArr.slice(3).join('')}  ${registeredAddress || ''}`,
      办公地址: `${officeArr && officeArr.slice(3).join('')}  ${officeAddress || ''}`,
      经营范围: <span className="aek-word-break">{businessScope}</span>,
    }
    rightData = {
      来源: Number(registerSource) === 1 ? '后台创建' : '前台创建',
      创建人: addName,
      创建时间: addTime,
      机构状态: orgStatus ? '已停用' : '启用中',
      审核状态: auditStatusText[auditStatus],
    }
  } else if (orgTypeCode === '02') { // 医疗机构
    leftData = {
      机构名称: orgName,
      上级机构: parentOrgName,
      机构类型: getOrgTypeText(),
      法人: legalPerson,
      联系负责人: principal,
      手机号: mobile,
      固话: phone,
      传真: fax,
      邮箱: email,
      注册地址: `${regArr && regArr.slice(3).join('')}  ${registeredAddress || ''}`,
      办公地址: `${officeArr && officeArr.slice(3).join('')}  ${officeAddress || ''}`,
      诊疗科目: <span className="aek-word-break">{businessScope}</span>,
    }
    rightData = {
      来源: Number(registerSource) === 1 ? '后台创建' : '前台创建',
      创建人: addName,
      创建时间: addTime,
      机构状态: orgStatus ? '已停用' : '启用中',
      审核状态: auditStatusText[auditStatus],
    }
  } else {
    leftData = { // 监管机构
      机构名称: orgName,
      上级机构: parentOrgName,
      机构类型: getOrgTypeText(),
      联系负责人: principal,
      手机号: mobile,
      固话: phone,
      邮箱: email,
      办公地址: `${officeArr && officeArr.slice(3).join('')}  ${officeAddress || ''}`,
    }
    rightData = {
      来源: Number(registerSource) === 1 ? '后台创建' : '前台创建',
      创建人: addName,
      创建时间: addTime,
      最后登录时间: lastLoginTime,
      机构状态: orgStatus ? '已停用' : '启用中',
    }
  }
  return { leftData, rightData, scopeShowStatus }
}
export default data
