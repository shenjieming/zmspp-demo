import React from 'react'

let topData = {}
const dataDetail = (auditDetailObj) => {
  const {
    legalPerson,
    orgName,
    orgParentGradeText,
    orgTypeCode,
    orgTypeText,
    phone,
    profit,
    registeredAddress,
    arrayOrgRegAddr,
  } = auditDetailObj
  if (orgTypeCode === '02') {
    // 医疗机构
    topData = {
      机构名称: orgName,
      机构类型: orgTypeText,
      机构等级: orgParentGradeText,
      营利性质: profit ? '是' : '否',
      法人: legalPerson,
      机构注册地址: arrayOrgRegAddr && (
        <span>
          {arrayOrgRegAddr.slice(3).join('')} {registeredAddress}
        </span>
      ),
    }
  } else {
    topData = {
      机构名称: orgName,
      机构类型: orgTypeText,
      法人: legalPerson,
      机构注册地址: arrayOrgRegAddr && (
        <span>
          {arrayOrgRegAddr.slice(3).join('')} {registeredAddress}
        </span>
      ),
      固话: phone,
    }
  }
  return { topData }
}
export default dataDetail
