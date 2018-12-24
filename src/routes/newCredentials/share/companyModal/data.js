import moment from 'moment'

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
}

const typeId = {
  hospital: '02',
  supplier: '03',
}

const certificateTypeObj = {
  1: '营业执照',
  2: '医疗器械经营许可证',
  3: '税务登记证',
  4: '医疗器械生产许可证',
  5: '医疗机构执业许可证',
  6: '医疗器械经营备案证',
}
const flagJudge = (first, second) => {
  if (first) {
    return true
  }
  return second
}

// 获取证件Item
const getCertificateForm = ({
  view, // 是否是查看态
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
  view,
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
  view,
  exclude,
  field: `certificateCode_${certificateType}`,
  options: {
    initialValue: certificateCode,
    rules: required && [{ required: true, message: '必填项不能为空' }],
  },
  component: {
    name: 'Input',
    props: {
      placeholder: '请输入',
    },
  },
}, {
  label: '有效期',
  layout: {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  },
  view,
  field: `time_${certificateType}`,
  col: 18,
  exclude: exclude || !(flagJudge(view, (checked === undefined ? !eternalLife : !checked))),
  options: {
    initialValue: startDate && endDate &&
      [moment(startDate, 'YYYY-MM-DD'), moment(endDate, 'YYYY/MM/DD')],
    rules: required && [{ required: true, message: '必填项不能为空' }],
  },
  viewRender() {
    if (eternalLife) {
      return `${startDate || ''}至长期有效`
    }
    return `${startDate || ''}至${endDate || ''}`
  },
  component: {
    name: 'RangePicker',
  },
}, {
  label: '开始时间',
  layout: {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  },
  field: `startDate_${certificateType}`,
  col: 18,
  view,
  exclude: exclude || flagJudge(view, (checked === undefined ? !eternalLife : !checked)),
  options: {
    initialValue: startDate && moment(startDate, 'YYYY-MM-DD'),
    rules: required && [{ required: true, message: '必填项不能为空' }],
  },
  component: {
    name: 'DatePicker',
  },
}, {
  field: `eternalLife_${certificateType}`,
  col: 6,
  layout: {
    wrapperCol: {
      span: 20,
      offset: 4,
    },
  },
  view,
  exclude: exclude || view,
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
  getCertificateForm,
  getViowArrItem,
  intactItem,
}
