import { REGEXP_TELEPHONE } from '../../../utils/constant'

const getAddress = str =>
  (str ? str.split(' ') : [])

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 15 },
}

const formItemData = ({
  addressList,
  initValue: {
    receiptId,
    receiptContactName,
    receiptContactPhone,
    receiptMasterAddress,
    receiptDetailAddress,
    receiptDefaultFlag,
  } = {},
}) => [{
  field: 'receiptId',
  options: { initialValue: receiptId },
  otherProps: { style: { display: 'none' } },
  component: { name: 'Input' },
}, {
  label: '收货人',
  field: 'receiptContactName',
  layout: formItemLayout,
  options: {
    initialValue: receiptContactName,
    rules: [{ required: true, message: '请输入收货人' }],
  },
  component: {
    name: 'Input',
    props: {
      placeholder: '请输入',
    },
  },
}, {
  label: '手机号',
  field: 'receiptContactPhone',
  layout: formItemLayout,
  options: {
    initialValue: receiptContactPhone,
    rules: [
      { pattern: REGEXP_TELEPHONE, message: '请输入正确的号码格式' },
      { required: true, message: '联系方式' },
    ],
  },
  component: {
    name: 'Input',
    props: {
      placeholder: '请输入',
    },
  },
}, {
  label: '收货地址',
  field: 'receiptMasterAddress',
  layout: formItemLayout,
  options: {
    initialValue: getAddress(receiptMasterAddress),
    rules: [{ required: true, message: '请选择收货地址' }],
    getValueFromEvent: (val, sel) => val.concat(sel.map(({ label }) => label)),
  },
  component: {
    name: 'Cascader',
    props: {
      placeholder: '请选择',
      options: addressList,
    },
  },
}, {
  label: '详细地址',
  field: 'receiptDetailAddress',
  layout: formItemLayout,
  options: {
    initialValue: receiptDetailAddress,
    rules: [
      { required: true, message: '请输入详细地址' },
      { max: 100, message: '请不要超过100字符' },
    ],
  },
  component: {
    name: 'TextArea',
    props: {
      placeholder: '请输入',
    },
  },
}, {
  label: '',
  field: 'receiptDefaultFlag',
  layout: {
    wrapperCol: { span: 12, offset: 6 },
  },
  options: {
    initialValue: !!receiptDefaultFlag,
    valuePropName: 'checked',
  },
  component: {
    name: 'Checkbox',
    props: {
      children: '设置为默认收货地址',
    },
  },
}]

export default {
  formItemData,
}
