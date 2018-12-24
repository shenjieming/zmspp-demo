import moment from 'moment'

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
}

const typeId = {
  hospital: '02',
  supplier: '03',
  factory: '04',
  factoryOrSupplier: '07',
}

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
  defaultView,
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
  view: defaultView,
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
  view: defaultView,
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
  field: `time_${certificateType}`,
  col: 18,
  view: defaultView,
  exclude: exclude || (checked === undefined ? eternalLife : checked),
  options: {
    initialValue: startDate && endDate &&
      [moment(startDate, 'YYYY-MM-DD'), moment(endDate, 'YYYY/MM/DD')],
    rules: required && [{ required: true, message: '必填项不能为空' }],
  },
  viewRender() {
    return `${moment(startDate).format('YYYY-MM-DD')}至${moment(endDate).format('YYYY-MM-DD')}`
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
  view: defaultView,
  exclude: exclude || !(checked === undefined ? eternalLife : checked),
  options: {
    initialValue: startDate && moment(startDate, 'YYYY-MM-DD'),
    rules: required && [{ required: true, message: '必填项不能为空' }],
  },
  viewRender() {
    return `${moment(startDate).format('YYYY-MM-DD')}至长期有效`
  },
  component: {
    name: 'DatePicker',
  },
}, {
  field: `eternalLife_${certificateType}`,
  col: 6,
  exclude: exclude || defaultView,
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
