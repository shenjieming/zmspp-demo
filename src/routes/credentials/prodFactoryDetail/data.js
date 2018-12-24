import moment from 'moment'

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
}

const certificateTypeObj = {
  8: '营业执照',
  9: '税务登记证',
  10: '医疗器械经营许可证',
  11: '医疗器械生产许可证',
  12: '医疗器械经营备案证',
}
// 获取证件Item
const getCertificateForm = ({
  modalTitle,
  required, // 不传,或传true, 不要传false
  checked,
  checkedBoxOnchange,
  exclude,
  initialValue: {
    certificateType,
    certificateImageUrls,
    certificateNo,
    validDateStart,
    validDateEnd,
    validDateLongFlag,
  },
} = { initialValue: {} }) => {
  const flagJudge = (first, second) => {
    if (first) {
      return true
    }
    return second
  }
  return [{
    label: '证件名称',
    layout: formItemLayout,
    exclude,
    view: true,
    otherProps: {
      style: {
        marginTop: 16,
        fontWeight: 'bold',
        color: '#555',
      },
    },
    options: {
      initialValue: `${certificateTypeObj[certificateType]}`,
    },
  }, {
    label: '证件图片',
    layout: formItemLayout,
    field: `certificateImageUrls_${certificateType}`,
    exclude,
    view: modalTitle === '查看厂家/总代证件' || modalTitle === '查看企业证件',
    options: {
      imgSrc: certificateImageUrls,
      rules: required && [{ required: true, message: '必填项不能为空' }],
    },
    component: {
      name: 'UploadButton',
    },
  }, {
    label: '证号',
    layout: formItemLayout,
    field: `certificateNo_${certificateType}`,
    exclude,
    view: modalTitle === '查看厂家/总代证件' || modalTitle === '查看企业证件',
    options: {
      initialValue: certificateNo,
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
    view: modalTitle === '查看厂家/总代证件' || modalTitle === '查看企业证件',
    field: `time_${certificateType}`,
    col: 18,
    exclude: exclude || !(flagJudge((modalTitle === '查看厂家/总代证件' || modalTitle === '查看企业证件'), (checked === undefined ? !validDateLongFlag : !checked))),
    options: {
      initialValue: validDateStart && validDateEnd &&
      [moment(validDateStart, 'YYYY-MM-DD'), moment(validDateEnd, 'YYYY/MM/DD')],
      rules: required && [{ required: true, message: '必填项不能为空' }],
    },
    viewRender() {
      if (validDateLongFlag) {
        return `${validDateStart}至长期有效`
      }
      return `${validDateStart || ''}至${validDateEnd || ''}`
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
    field: `validDateStart_${certificateType}`,
    col: 18,
    view: modalTitle === '查看厂家/总代证件' || modalTitle === '查看企业证件',
    exclude: exclude || flagJudge((modalTitle === '查看厂家/总代证件' || modalTitle === '查看企业证件'), (checked === undefined ? !validDateLongFlag : !checked)),
    options: {
      initialValue: validDateStart && moment(validDateStart, 'YYYY-MM-DD'),
      rules: required && [{ required: true, message: '必填项不能为空' }],
    },
    component: {
      name: 'DatePicker',
    },
  }, {
    exclude: exclude || modalTitle === '查看厂家/总代证件' || modalTitle === '查看企业证件',
    field: `validDateLongFlag_${certificateType}`,
    col: 6,
    layout: {
      wrapperCol: {
        span: 20,
        offset: 4,
      },
    },
    options: {
      valuePropName: 'checked',
      initialValue: validDateLongFlag,
    },
    component: {
      name: 'Checkbox',
      props: {
        onChange: checkedBoxOnchange,
        children: '长期有效',
      },
    },
  }]
}
const getViowArrItem = certificateType => ({
  certificateType,
  certificateImageUrls: undefined,
  certificateNo: undefined,
  validDateStart: undefined,
  validDateEnd: undefined,
  validDateLongFlag: undefined,
})

// 是否填写完整
const intactItem = ({
  certificateImageUrls,
  certificateNo,
  validDateStart,
  validDateEnd,
  validDateLongFlag,
}) =>
  !!(certificateImageUrls && certificateNo && validDateStart && (validDateEnd || validDateLongFlag)) & 1


export default {
  getCertificateForm,
  getViowArrItem,
  intactItem,
}
