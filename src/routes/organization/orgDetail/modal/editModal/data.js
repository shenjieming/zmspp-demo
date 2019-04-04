import { asyncValidate } from '../../../../../utils'
import { REGEXP_TELEPHONE, REGEXP_FAX } from '../../../../../utils/constant'

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 12,
  },
}

const form = ({
  parentGradeList,
  secondGradeList,
  bankLevelList,
  asyncParentOrgList,
  organizeTypeComp,
  hideItems: { sort1, sort2, sort3, sort4 },
  currentOrgDetail: {
    orgIdSign,
    orgTypeCode,
    businessScope,
    phone,
    email,
    fax,
    legalPerson,
    mobile,
    orgName,
    arrayOrgOfficeAddr,
    officeAddress,
    profit,
    arrayOrgRegAddr,
    registeredAddress,
    orgGrade,
    orgParentId,
    parentOrgName,
    principal,
    orgParentGrade,
  },
  addressRegList,
  addressWorkList,
}) => {
  const levelList = !sort4 ? bankLevelList : parentGradeList
  const asyFun = asyncValidate({
    url: '/organization/checkOrgName',
    message: '机构已存在',
    // key: 'orgName',
    callback(value) {
      return { orgName: value, orgIdSign }
    },
  })
  return [{
    label: '机构名称',
    layout: formItemLayout,
    field: 'orgName',
    options: {
      rules: [
        { required: true, message: '请输入' },
        { max: 40, message: '字符不超过40字符' },
        { validator: asyFun },
      ],
      initialValue: orgName,
    },
    col: 24,
    component: {
      name: 'Input',
      props: {
        placeholder: '输入机构全称',
      },
    },
  }, {
    label: '上级机构',
    layout: formItemLayout,
    field: 'orgParentId',
    options: {
      initialValue: orgParentId ? { key: orgParentId, label: parentOrgName } : undefined,
    },
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
  }, {
    label: '机构类型',
    layout: formItemLayout,
    field: 'orgTypeCode',
    options: {
      initialValue: orgTypeCode,
      rules: [{ required: true, message: '请选择' }],
    },
    col: 24,
    component: {
      name: 'Select',
      props: {
        ...organizeTypeComp,
        disabled: true,
      },
    },
  }, {
    label: '营利性质',
    layout: formItemLayout,
    col: 24,
    field: 'profit',
    exclude: sort2,
    options: {
      initialValue: profit,
      rules: [{ required: true, message: '请选择' }],
    },
    component: {
      name: 'RadioGroup',
      props: {
        disabled: true,
        options: [
          { label: '营利性', value: true },
          { label: '非营利性', value: false },
        ],
      },
    },
  }, {
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
      initialValue: orgGrade,
    },
    component: {
      name: 'Select',
      props: {
        placeholder: '请选择',
        ...levelList,
      },
    },
  }, {
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
      initialValue: orgParentGrade,
    },
    component: {
      name: 'Select',
      props: {
        placeholder: '请选择',
        ...secondGradeList,
      },
    },
  }, {
    label: '法人',
    layout: formItemLayout,
    field: 'legalPerson',
    exclude: sort1 && sort2 && sort4,
    options: {
      initialValue: legalPerson,
    },
    col: 24,
    component: {
      name: 'Input',
      props: {
        placeholder: '输入法人姓名',
      },
    },
  }, {
    label: '联系负责人',
    layout: formItemLayout,
    field: 'principal',
    options: {
      initialValue: principal,
    },
    col: 24,
    component: {
      name: 'Input',
      props: {
        placeholder: '输入负责人姓名',
      },
    },
  }, {
    label: '手机号',
    layout: formItemLayout,
    field: 'mobile',
    options: {
      initialValue: mobile,
      rules: [{ pattern: REGEXP_TELEPHONE, message: '格式错误' }],
    },
    col: 24,
    component: {
      name: 'Input',
      props: {
        placeholder: '输入11位手机号',
      },
    },
  }, {
    label: '固话',
    layout: formItemLayout,
    field: 'phone',
    options: {
      initialValue: phone,
      rules: [{ pattern: REGEXP_FAX, message: '格式错误' }],
    },
    col: 24,
    component: {
      name: 'Input',
      props: {
        placeholder: '输入固话',
      },
    },
  }, {
    label: '传真',
    layout: formItemLayout,
    exclude: sort1 && sort2,
    field: 'fax',
    options: {
      initialValue: fax,
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
  //   {
  //   label: '邮箱',
  //   layout: formItemLayout,
  //   field: 'email',
  //   options: {
  //     initialValue: email,
  //     rules: [{ type: 'email', message: '格式错误' }],
  //   },
  //   col: 24,
  //   component: {
  //     name: 'Input',
  //     props: {
  //       placeholder: '输入邮箱',
  //     },
  //   },
  // },
    {
    label: '注册地址',
    layout: formItemLayout,
    exclude: sort1 && sort2 && sort4,
    field: 'arrayOrgRegAddr',
    options: {
      initialValue: arrayOrgRegAddr,
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
  }, {
    label: '',
    exclude: sort1 && sort2 && sort4,
    layout: {
      wrapperCol: {
        span: 12,
        offset: 6,
      },
    },
    field: 'registeredAddress',
    options: {
      initialValue: registeredAddress,
    },
    col: 24,
    component: {
      name: 'Input',
      props: {
        placeholder: '详细地址',
      },
    },
  }, {
    label: '办公地址',
    layout: formItemLayout,
    exclude: sort1 && sort3 && sort4,
    field: 'arrayOrgOfficeAddr',
    options: {
      initialValue: arrayOrgOfficeAddr,
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
  }, {
    label: '',
    exclude: sort1 && sort3 && sort4,
    layout: {
      wrapperCol: {
        span: 12,
        offset: 6,
      },
    },
    field: 'officeAddress',
    options: {
      initialValue: officeAddress,
    },
    col: 24,
    component: {
      name: 'Input',
      props: {
        placeholder: '详细地址',
      },
    },
  }, {
    label: !sort1 ? '经营范围' : '诊疗科目',
    layout: formItemLayout,
    exclude: !sort3 || !sort4,
    field: 'businessScope',
    options: {
      initialValue: businessScope,
      rules: [{ max: 300, message: '字数不超过300字' }],
    },
    col: 24,
    component: {
      name: 'TextArea',
      props: {
        placeholder: !sort1 ? '输入企业经营范围（字数不超过300字）' : '输入诊疗科目',
        maxLength: 300,
      },
    },
  }]
}
export default {
  form,
}
