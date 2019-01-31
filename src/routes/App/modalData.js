import moment from 'moment'
import { getOption, asyncValidate } from '../../utils'
import { REGEXP_FAX } from '../../utils/constant'

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
}

const typeId = {
  hospital: '02',
  supplier: '03',
}

const orgType = {
  [typeId.hospital]: '医院',
  [typeId.supplier]: '供应商',
}

const orgProfit = [{
  id: '1',
  name: '营利',
}, {
  id: '0',
  name: '非营利',
}]

const certificateTypeObj = {
  1: '营业执照',
  2: '医疗器械经营许可证',
  3: '税务登记证',
  4: '医疗器械生产许可证',
  5: '医疗机构执业许可证',
  6: '医疗器械经营备案证',
}

// 获取证件Item
const getCertificateForm = ({
  required, // 不传,或传true, 不要传false
  checked,
  checkedBoxOnchange,
  exclude,
  initialValue: {
    certificateType,
    imageUrls,
    certificateCode,
    startDate,
    endDate,
    eternalLife,
  },
} = { initialValue: {} }) => [{
  label: '证件名称',
  layout: formItemLayout,
  view: true,
  exclude,
  otherProps: {
    style: {
      marginTop: 16,
      fontWeight: 'bold',
      color: '#555',
    },
  },
  options: {
    initialValue: `${certificateTypeObj[certificateType - 0]}`,
  },
}, {
  label: '证件上传',
  layout: formItemLayout,
  field: `imageUrls_${certificateType}`,
  exclude,
  options: {
    imgSrc: imageUrls,
    rules: required && [{ required: true, message: '必填项不能为空' }],
  },
  component: {
    name: 'UploadButton',
  },
}, {
  label: '证号',
  layout: formItemLayout,
  field: `certificateCode_${certificateType}`,
  exclude,
  options: {
    initialValue: certificateCode,
    rules: required && [{ required: true, message: '必填项不能为空' }],
  },
  component: {
    name: 'Input',
    props: {
      placeholder: '请输入证号',
    },
  },
}, {
  label: '有效期',
  layout: {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  },
  field: `time_${certificateType}`,
  col: 18,
  exclude: exclude || (checked === undefined ? eternalLife : checked),
  options: {
    initialValue: startDate && endDate &&
      [moment(startDate, 'YYYY-MM-DD'), moment(endDate, 'YYYY/MM/DD')],
    rules: required && [{
      required: true,
      validator: (_, value, callback) => {
        if (!value) {
          callback('请选择时间段')
        } else if (!value[0]) {
          callback('请选择起始时间')
        } else if (!value[1]) {
          callback('请选择结束时间')
        }
        callback()
      },
    }],
  },
  component: {
    name: 'TimeQuantum',
    props: {
      isRequired: true,
      isMoment: true,
    },
  },
}, {
  label: '开始时间',
  layout: {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  },
  field: `startDate_${certificateType}`,
  col: 18,
  exclude: exclude || !(checked === undefined ? eternalLife : checked),
  options: {
    initialValue: startDate && moment(startDate, 'YYYY-MM-DD'),
    rules: required && [{ required: true, message: '请选择时间段' }],
  },
  component: {
    name: 'DatePicker',
  },
}, {
  field: `eternalLife_${certificateType}`,
  exclude,
  col: 6,
  layout: {
    wrapperCol: {
      span: 20,
      offset: 4,
    },
  },
  options: {
    valuePropName: 'checked',
    initialValue: eternalLife,
  },
  component: {
    name: 'Checkbox',
    props: {
      onChange: checkedBoxOnchange,
      children: '长期有效',
    },
  },
}]

// 医院特有表单元素
const hospitalForm = (orgTypeId, {
  parentGrade,
  secondGrade,
  orgProfitOnChange,
  initialValue: {
    orgGrade,
    orgParentGrade,
    profit,
  },
}) => {
  if (orgTypeId === typeId.hospital) {
    return [{
      label: '机构等级',
      layout: {
        labelCol: { span: 12 },
        wrapperCol: { span: 12 },
      },
      field: 'orgGrade',
      col: 12,
      options: {
        initialValue: orgGrade,
        rules: [{ required: true, message: '必填项不能为空' }],
      },
      component: {
        name: 'Select',
        props: {
          placeholder: '请选择',
          children: getOption(parentGrade),
        },
      },
    }, {
      layout: {
        wrapperCol: { span: 18, offset: 6 },
      },
      field: 'orgParentGrade',
      col: 8,
      options: {
        initialValue: orgParentGrade,
        rules: [{ required: true, message: '必填项不能为空' }],
      },
      component: {
        name: 'Select',
        props: {
          placeholder: '请选择',
          children: getOption(secondGrade),
        },
      },
    }, {
      label: '营利性质',
      layout: formItemLayout,
      field: 'profit',
      options: {
        initialValue: profit === undefined ? '1' : String(profit & 1),
        rules: [{ required: true, message: '必填项不能为空' }],
      },
      component: {
        name: 'Select',
        props: {
          placeholder: '请选择',
          onChange: orgProfitOnChange,
          children: getOption(orgProfit),
        },
      },
    }]
  }
  return []
}

// 供应商特有表单元素
const getOrgCertificateType = ({
  orgCertificateTypeOnChange,
  initialValue: { orgCertificateType },
} = {}) => [{
  label: '证件类型',
  layout: formItemLayout,
  field: 'orgCertificateType',
  options: {
    initialValue: orgCertificateType || 1,
  },
  component: {
    name: 'RadioGroup',
    props: {
      options: [
        { label: '多证合一', value: 1 },
        { label: '传统三证', value: 2 },
      ],
      onChange: orgCertificateTypeOnChange,
    },
  },
}]

const asyncValidateFn = orgIdSign => asyncValidate({
  message: '该机构名称已存在',
  url: '/organization/checkOrgName',
  callback: orgName => ({ orgName, orgIdSign }),
})

// 主表单Item
const formItemData = ({
  orgType: orgTypeId,
  parentGrade,
  secondGrade,
  addressList,
  orgProfitOnChange,
  asyncParentOrgList,
  orgIdSign,
  initialValue: {
    orgName,
    orgGrade,
    orgParentGrade,
    profit,
    legalPerson,
    arrayOrgRegAddr,
    registeredAddress,
    phone,
    orgParentId,
  },
}) => [{
  label: '机构名称',
  layout: formItemLayout,
  field: 'orgName',
  options: {
    initialValue: orgName,
    rules: [
      { required: true, message: '必填项不能为空' },
      { validator: asyncValidateFn(orgIdSign) },
    ],
  },
  component: {
    name: 'Input',
    props: {
      placeholder: '请输入机构名称',
    },
  },
}, {
  label: '上级机构',
  layout: formItemLayout,
  field: 'orgParentId',
  options: {
    initialValue: orgParentId,
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
    },
  },
}, {
  label: '机构类型',
  layout: formItemLayout,
  view: true,
  options: {
    initialValue: `${orgType[orgTypeId]}`,
  },
}, {
  field: 'orgTypeCode',
  otherProps: {
    style: { display: 'none' },
  },
  options: {
    initialValue: orgTypeId,
  },
  component: {
    name: 'Input',
  },
},
  // 获取医院特有表单元素
hospitalForm(orgTypeId, {
  parentGrade,
  secondGrade,
  orgProfitOnChange,
  initialValue: {
    orgGrade,
    orgParentGrade,
    profit,
  },
}),
{
  label: '法人',
  layout: formItemLayout,
  field: 'legalPerson',
  options: {
    initialValue: legalPerson,
    rules: [{ required: true, message: '必填项不能为空' }],
  },
  component: {
    name: 'Input',
    props: {
      placeholder: '请输入法人姓名',
    },
  },
}, {
  label: '机构注册地址',
  field: 'arrayOrgRegAddr',
  layout: formItemLayout,
  options: {
    rules: [{ required: true, message: '必填项不能为空' }],
    initialValue: arrayOrgRegAddr || [],
    getValueFromEvent: (val, selectedOptions) => {
      const addressArray = [...val]
      for (const item of selectedOptions) {
        addressArray.push(item.label)
      }
      return addressArray
    },
  },
  component: {
    name: 'Cascader',
    props: {
      placeholder: '请选择省市区',
      options: addressList,
    },
  },
}, {
  label: '详细地址',
  field: 'registeredAddress',
  layout: formItemLayout,
  options: {
    rules: [{ required: true, message: '必填项不能为空' },  { max: 40, message: '字符不超过40字符' }],
    initialValue: registeredAddress,
  },
  component: {
    name: 'TextArea',
    props: {
      placeholder: '请填写详细注册地址，如街道名称、门牌号、楼层等信息',
    },
  },
}, {
  label: '固话',
  layout: formItemLayout,
  field: 'phone',
  options: {
    initialValue: phone,
    rules: [
      { required: true, message: '必填项不能为空' },
      { pattern: REGEXP_FAX, message: '请输入正确的号码格式' },
    ],
  },
  component: {
    name: 'Input',
    props: {
      placeholder: '例：0571-58796324',
    },
  },
}]

const getViowArrItem = certificateType => ({
  certificateType: `0${certificateType}`,
  imageUrls: undefined,
  certificateCode: undefined,
  startDate: undefined,
  endDate: undefined,
  eternalLife: undefined,
})

// 是否填写完整
const intactItem = ({
  imageUrls,
  certificateCode,
  startDate,
  endDate,
  eternalLife,
}) => !!(imageUrls && certificateCode && startDate && (endDate || eternalLife)) & 1

export default {
  typeId,
  formItemData,
  getCertificateForm,
  getViowArrItem,
  intactItem,
  getOrgCertificateType,
}
