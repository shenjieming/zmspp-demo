import React from 'react'
import { Link } from 'dva/router'
import { asyncValidate } from '../../../utils'
import { REGEXP_TELEPHONE, REGEXP_FAX } from '../../../utils/constant'

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 12,
  },
}
const asyFun = asyncValidate({
  url: '/organization/checkOrgName',
  message: '机构已存在',
  key: 'orgName',
})
const auditStatusText = [
  <span>待完善</span>,
  <span>待审核</span>,
  <span className="aek-text-help">已审核</span>,
  <span className="aek-text-disable">已拒绝</span>,
]
const orgStatusText = [<span>启用中</span>, <span className="aek-text-disable">已停用</span>]
const form = ({
  organizeTypeComp,
  hideItems: { sort1, sort2, sort3, sort4 },
  addressRegList,
  addressWorkList,
  asyncParentOrgList,
  parentGradeList,
  bankLevelList,
  secondGradeList,
}) => {
  const levelList = !sort4 ? bankLevelList : parentGradeList
  return [
    {
      label: '机构名称',
      layout: formItemLayout,
      field: 'orgName',
      options: {
        firstFields: true,
        rules: [
          { required: true, message: '请输入' },
          { max: 300, message: '字符不超过300字符' },
          { validator: asyFun },
        ],
      },
      col: 24,
      component: {
        name: 'Input',
        props: {
          placeholder: '输入机构全称',
        },
      },
    },
    {
      label: '上级机构',
      layout: formItemLayout,
      field: 'orgParentId',
      col: 24,
      component: {
        name: 'Select',
        props: {
          placeholder: '无',
          ...asyncParentOrgList,
          showSearch: true,
          defaultActiveFirstOption: false,
          filterOption: false,
          notFoundContent: false,
          allowClear: true,
          labelInValue: true,
        },
      },
    },
    {
      label: '机构类型',
      layout: formItemLayout,
      field: 'orgTypeCode',
      options: {
        rules: [{ required: true, message: '请选择' }],
      },
      col: 24,
      component: {
        name: 'Select',
        props: {
          placeholder: '请选择',
          ...organizeTypeComp,
        },
      },
    },
    {
      label: '营利性质',
      layout: formItemLayout,
      col: 24,
      field: 'profit',
      exclude: sort2,
      options: {
        rules: [{ required: true, message: '请选择' }],
      },
      component: {
        name: 'RadioGroup',
        props: {
          options: [{ label: '营利性', value: true }, { label: '非营利性', value: false }],
        },
      },
    },
    {
      label: '机构等级',
      exclude: !(!sort2 || !sort4),
      layout: {
        labelCol: {
          span: 12,
        },
        wrapperCol: {
          span: 11,
        },
      },
      field: 'orgGrade',
      col: 12,
      options: {
        rules: [{ required: true, message: '请选择' }],
      },
      component: {
        name: 'Select',
        props: {
          placeholder: '请选择',
          ...levelList,
        },
      },
    },
    {
      label: '',
      exclude: sort2 || !sort4,
      layout: {
        wrapperCol: {
          span: 11,
          offset: 1,
        },
      },
      field: 'orgParentGrade',
      col: 12,
      options: {
        rules: [{ required: true, message: '请选择' }],
      },
      component: {
        name: 'Select',
        props: {
          placeholder: '请选择',
          ...secondGradeList,
        },
      },
    },
    {
      label: '法人',
      layout: formItemLayout,
      field: 'legalPerson',
      exclude: sort1 && sort2 && sort4,
      col: 24,
      component: {
        name: 'Input',
        props: {
          placeholder: '输入法人姓名',
        },
      },
    },
    {
      label: '联系负责人',
      layout: formItemLayout,
      field: 'principal',
      col: 24,
      component: {
        name: 'Input',
        props: {
          placeholder: '输入负责人姓名',
        },
      },
    },
    {
      label: '手机号',
      layout: formItemLayout,
      field: 'mobile',
      options: {
        rules: [{ pattern: REGEXP_TELEPHONE, message: '格式错误' }],
      },
      col: 24,
      component: {
        name: 'Input',
        props: {
          placeholder: '输入11位手机号',
        },
      },
    },
    {
      label: '固话',
      layout: formItemLayout,
      field: 'phone',
      options: {
        rules: [{ pattern: REGEXP_FAX, message: '格式错误' }],
      },
      col: 24,
      component: {
        name: 'Input',
        props: {
          placeholder: '输入固话',
        },
      },
    },
    {
      label: '传真',
      layout: formItemLayout,
      exclude: sort1 && sort2,
      field: 'fax',
      options: {
        rules: [{ pattern: REGEXP_FAX, message: '格式错误' }],
      },
      col: 24,
      component: {
        name: 'Input',
        props: {
          placeholder: '输入传真号',
        },
      },
    },
    {
      label: '邮箱',
      layout: formItemLayout,
      field: 'email',
      options: {
        rules: [{ type: 'email', message: '格式错误' }],
      },
      col: 24,
      component: {
        name: 'Input',
        props: {
          placeholder: '输入邮箱',
        },
      },
    },
    {
      label: '注册地址',
      layout: formItemLayout,
      exclude: sort1 && sort2 && sort4,
      field: 'arrayOrgRegAddr',
      options: {
        getValueFromEvent: (val, selectedOptions) => {
          const addressArray = [...val]
          for (const item of selectedOptions) {
            addressArray.push(item.label)
          }
          return addressArray
        },
      },
      col: 24,
      component: {
        name: 'Cascader',
        props: {
          placeholder: '请选择',
          ...addressRegList,
        },
      },
    },
    {
      label: '',
      exclude: sort1 && sort2 && sort4,
      layout: {
        wrapperCol: {
          span: 12,
          offset: 6,
        },
      },
      field: 'registeredAddress',
      col: 24,
      component: {
        name: 'Input',
        props: {
          placeholder: '详细地址',
        },
      },
    },
    {
      label: '办公地址',
      layout: formItemLayout,
      exclude: sort1 && sort3 && sort4,
      field: 'arrayOrgOfficeAddr',
      options: {
        getValueFromEvent: (val, selectedOptions) => {
          const addressArray = [...val]
          for (const item of selectedOptions) {
            addressArray.push(item.label)
          }
          return addressArray
        },
      },
      col: 24,
      component: {
        name: 'Cascader',
        props: {
          placeholder: '请选择',
          ...addressWorkList,
        },
      },
    },
    {
      label: '',
      exclude: sort1 && sort3 && sort4,
      layout: {
        wrapperCol: {
          span: 12,
          offset: 6,
        },
      },
      field: 'officeAddress',
      col: 24,
      component: {
        name: 'Input',
        props: {
          placeholder: '详细地址',
        },
      },
    },
    {
      label: !sort1 ? '经营范围' : '诊疗科目',
      layout: formItemLayout,
      exclude: !sort3 || !sort4,
      field: 'businessScope',
      col: 24,
      component: {
        name: 'TextArea',
        props: {
          placeholder: !sort1 ? '输入企业经营范围（字数不超过300字）' : '输入诊疗科目',
          maxLength: 300,
        },
      },
    },
  ]
}

const columns = ({ onCheckOrg }) => [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    width: 50,
    className: 'aek-text-center',
    render: (text, record, idx) => idx + 1,
  },
  {
    title: '机构名称',
    dataIndex: 'orgName',
    key: 'orgName',
    render: (text, { orgIdSign }) => (
      <span>
        {text}
      </span>
    ),
  },
  {
    title: '机构类型',
    dataIndex: 'orgTypeText',
    key: 'orgTypeText',
  },
  {
    title: '联系人',
    dataIndex: 'principal',
    key: 'principal',
  },
  {
    title: '移动电话',
    dataIndex: 'mobile',
    key: 'mobile',
  },
  {
    title: '注册/创建时间',
    dataIndex: 'addTime',
    key: 'addTime',
  },
  {
    title: '审核状态',
    dataIndex: 'auditStatus',
    key: 'auditStatus',
    render: text => auditStatusText[Number(text)],
  },
  {
    title: '机构状态',
    dataIndex: 'orgStatus',
    key: 'orgStatus',
    render: text => orgStatusText[Number(text)],
  },
  {
    title: '操作',
    key: 'action',
    width: 160,
    render: (text, { orgIdSign, auditStatus }) => {
      const status = Number(auditStatus)
      return (
        <span>
          {status === 1 ? (
            <span>
              <a onClick={e => onCheckOrg(e, orgIdSign)}>审核</a>
            </span>
          ) : (
            ''
          )}
        </span>
      )
    },
  },
]

export default {
  form,
  columns,
}
