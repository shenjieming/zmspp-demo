import React from 'react'

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
}
// 是否长期有效事件
// 厂家授权

const formData = accountDetail => [{
  label: '可提现金额',
  layout: formItemLayout,
  field: 'canUseAmount',
  view: true,
  options: {
    initialValue: `${accountDetail.canUseAmount}元`,
  },
  component: {
    name: 'Input',
    props: {
      placeholder: '请输入',
    },
  },
}, {
  label: '提现至结算账户',
  field: 'settleAccountName',
  layout: formItemLayout,
  view: true,
  options: {
    initialValue: accountDetail.settleAccountName,
  },
  component: {
    name: 'Input',
  },
}, {
  label: '结算账户号',
  layout: formItemLayout,
  field: 'settleAccount',
  view: true,
  options: {
    initialValue: <span>{accountDetail.settleAccount}<span className="aek-ml20">{accountDetail.crossFlag ? '华夏银行' : ''}</span></span>,
  },
  component: {
    name: 'Input',
  },
}, {
  label: '提现金额',
  layout: {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  },
  field: 'outAmount',
  col: 18,
  options: {
    initialValue: '',
    rules: [{ required: true, message: '必填项不能为空' }],
  },
  component: {
    name: 'InputNumber',
    props: {
      placeholder: '请输入提现金额',
      style: { width: '100%' },
      max: parseFloat(accountDetail.canUseAmount),
    },
  },
}, {
  view: true,
  col: 1,
  options: {
    initialValue: '元',
    props: {
      style: { paddingLeft: '10px' },
    },
  },
}, {
  label: '备注',
  layout: formItemLayout,
  field: 'remark',
  component: {
    name: 'TextArea',
    props: {
      placeholder: '最多可输入100字',
    },
  },
}]
export default formData
