/* eslint-disable */
import { REGEXP_FAX, REGEXP_TELEPHONE, REGEXP_EMAIL } from '@utils/constant'

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 16,
  },
}
const form = ({ orgDetail, addressList, asyncParentOrgList, parentGradeList, secondGradeList }) => [
  {
    label: '机构名称',
    layout: formItemLayout,
    field: 'orgName',
    view: true,
    options: {
      rules: [{ required: true, message: '请输入' }],
      initialValue: orgDetail.orgName,
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
    label: '机构类型',
    layout: formItemLayout,
    field: 'orgType',
    view: true,
    options: {
      initialValue: orgDetail.orgTypeText,
    },
    col: 24,
    component: {
      name: 'Select',
      props: {
        placeholder: '请选择',
      },
    },
  },
  {
    label: '机构等级',
    exclude: !(orgDetail.orgTypeCode === '02'),
    options: {
      initialValue: orgDetail.orgGrade,
    },
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
    component: {
      name: 'Select',
      props: {
        placeholder: '请选择',
        ...parentGradeList,
      },
    },
  },
  {
    label: '',
    exclude: !(orgDetail.orgTypeCode === '02'),
    options: {
      initialValue: orgDetail.orgParentGrade,
    },
    layout: {
      wrapperCol: {
        span: 11,
        offset: 1,
      },
    },
    field: 'orgParentGrade',
    col: 12,
    component: {
      name: 'Select',
      props: {
        placeholder: '请选择',
        ...secondGradeList,
      },
    },
  },
  {
    label: '营利性质',
    exclude: orgDetail.orgTypeCode !== '02',
    layout: formItemLayout,
    options: {
      initialValue: orgDetail.profit,
    },
    col: 24,
    field: 'profit',
    component: {
      name: 'RadioGroup',
      props: {
        options: [{ label: '营利性', value: true }, { label: '非营利性', value: false }],
      },
    },
  },
  {
    label: '上级机构',
    layout: formItemLayout,
    field: 'orgParentId',
    options: {
      initialValue: orgDetail.orgParentId,
    },
    col: 24,
    component: {
      name: 'Select',
      props: {
        placeholder: '无',
        ...asyncParentOrgList,
        showSearch: true,
        allowClear: true,
      },
    },
  },
  {
    label: '法人',
    layout: formItemLayout,
    field: 'legalPerson',
    options: {
      initialValue: orgDetail.legalPerson,
      rules: [{ required: true, message: '请输入' }],
    },
    col: 24,
    component: {
      name: 'Input',
      props: {
        placeholder: '输入法人姓名',
      },
    },
  },
  {
    label: '法人身份证',
    layout: formItemLayout,
    exclude: !(orgDetail.orgTypeCode === '03'),
    field: 'orgLegalPersonUrls',
    options: {
      rules: [{ required: true, message: '必填项不能为空' }],
      imgSrc: orgDetail.orgLegalPersonUrls,
    },
    component: {
      name: 'UploadButton',
      props: {
        placeholder: '请输入',
      },
    },
  },
  {
    label: '机构注册地',
    layout: formItemLayout,
    field: 'arrayOrgRegAddr',
    options: {
      initialValue: orgDetail.arrayOrgRegAddr,
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
        placeholder: '请选择省市区',
        options: addressList,
      },
    },
  },
  {
    label: '',
    options: {
      initialValue: orgDetail.registeredAddress,
      rules: [ { max: 255, message: '字符不超过255字符' }],
    },
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
    label: orgDetail.orgTypeCode === '02' ? '诊疗科目' : '经营范围',
    layout: formItemLayout,
    field: 'businessScope',
    options: {
      initialValue: orgDetail.businessScope,
    },
    col: 24,
    component: {
      name: 'TextArea',
      props: {
        placeholder: '输入企业经营范围（字数不超过300字）',
        maxLength: 300,
      },
    },
  },
  {
    label: '办公地址',
    layout: formItemLayout,
    field: 'arrayOrgOfficeAddr',
    options: {
      initialValue: orgDetail.arrayOrgOfficeAddr,
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
        placeholder: '请选择省市区',
        options: addressList,
      },
    },
  },
  {
    label: '详细地址',
    layout: formItemLayout,
    field: 'officeAddress',
    options: {
      initialValue: orgDetail.officeAddress,
      rules: [ { max: 255, message: '字符不超过255字符' }],
    },
    col: 24,
    component: {
      name: 'TextArea',
      props: {
        placeholder: '请填写详细地址，如街道名称、楼层和门牌号等信息',
      },
    },
  },
  {
    label: '固话',
    layout: formItemLayout,
    field: 'phone',
    options: {
      initialValue: orgDetail.phone,
      rules: [
        {
          pattern: REGEXP_FAX,
          message: '格式错误',
        },
      ],
    },
    col: 24,
    component: {
      name: 'Input',
      props: {
        placeholder: '例：0571 - 58796324',
      },
    },
  },
  {
    label: '传真',
    layout: formItemLayout,
    field: 'fax',
    options: {
      initialValue: orgDetail.fax,
      rules: [
        {
          pattern: REGEXP_FAX,
          message: '格式错误',
        },
      ],
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
    label: '联系人',
    layout: formItemLayout,
    field: 'principal',
    options: {
      initialValue: orgDetail.principal,
    },
    col: 24,
    component: {
      name: 'Input',
      props: {
        placeholder: '输入负责人姓名',
      },
    },
  },
  {
    label: '联系人手机号',
    layout: formItemLayout,
    field: 'mobile',
    options: {
      initialValue: orgDetail.mobile,
      rules: [
        {
          pattern: REGEXP_TELEPHONE,
          message: '格式错误',
        },
      ],
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
    label: '邮箱',
    layout: formItemLayout,
    field: 'email',
    options: {
      initialValue: orgDetail.email,
      rules: [
        {
          pattern: REGEXP_EMAIL,
          message: '格式错误',
        },
      ],
    },
    col: 24,
    component: {
      name: 'Input',
      props: {
        placeholder: '输入邮箱',
      },
    },
  },
]
export default {
  form,
}
