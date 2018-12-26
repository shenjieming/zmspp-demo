import React from 'react'
import { Avatar, Upload } from 'antd'
import { includes } from 'lodash'
import Logo from '../../assets/lkc-org-logo.png'

const leftData = ({ data, LogoProps }) => {
  const {
    orgName,
    orgTypeText,
    orgTypeCode,
    orgGradeText,
    orgParentGradeText,
    profit,
    parentOrgName,
    legalPerson,
    arrayOrgRegAddr,
    registeredAddress,
    logoUrl,
    businessScope,
  } = data

  const dataArr = [
    {
      name: '机构名称',
      value: orgName,
    },
    {
      name: '机构类型',
      value: orgTypeText,
    },
    {
      name: '机构等级',
      exclude: !includes(['02', '05'], orgTypeCode),
      value:
        orgTypeCode === '05'
          ? orgGradeText || ''
          : (orgGradeText || '') + (orgParentGradeText || ''),
    },
    {
      name: '盈利性质',
      exclude: !includes(['02', '05'], orgTypeCode),
      value: profit ? '营利' : '非营利',
    },
    {
      name: '上级机构',
      value: parentOrgName,
    },
    {
      name: '法人',
      value: legalPerson,
    },
    {
      name: '机构注册地',
      value: arrayOrgRegAddr
        ? arrayOrgRegAddr[3] + arrayOrgRegAddr[4] + arrayOrgRegAddr[5] + (registeredAddress || '')
        : registeredAddress || '',
    },
    {
      name: '企业LOGO',
      value: (
        <span>
          <Avatar
            size="large"
            src={(logoUrl ? `${logoUrl}` : '') || Logo}
            style={{ float: 'left' }}
          />
          <div style={{ float: 'left' }}>
            <Upload {...LogoProps} className="aek-plr10">
              <a>更换LOGO</a>
            </Upload>
          </div>
        </span>
      ),
    },
    {
      name: '诊疗科目',
      exclude: orgTypeCode !== '02',
      value: businessScope,
    },
    {
      name: '经营范围',
      exclude: orgTypeCode === '02',
      value: businessScope,
    },
  ]

  const retData = {}
  dataArr.filter(({ exclude }) => !exclude).every((item) => {
    retData[`${item.name}|fill`] = item.value
    return true
  })
  return retData
}

const rightData = ({ data }) => {
  const { officeAddress, principal, mobile, phone, fax, email, arrayOrgOfficeAddr } = data
  return {
    '办公地址|fill': arrayOrgOfficeAddr
      ? arrayOrgOfficeAddr[3] +
        arrayOrgOfficeAddr[4] +
        arrayOrgOfficeAddr[5] +
        (officeAddress || '')
      : officeAddress || '',
    '联系人|fill': principal,
    '联系人手机号|fill': mobile,
    '固话|fill': phone,
    '传真|fill': fax,
    '邮箱|fill': email,
  }
}

export default {
  leftData,
  rightData,
}
