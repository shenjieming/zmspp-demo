import React from 'react'
import Ellipsis from '../../components/Ellipsis'

const FORM_ITEM_LAYOUT = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
}

const fromData = searData => [
  {
    label: '目标医院',
    layout: FORM_ITEM_LAYOUT,
    field: 'hplId',
    width: 350,
    component: {
      name: 'LkcSelect',
      props: {
        url: 'organization/option/3-after-review-list',
        optionConfig: { idStr: 'orgId', nameStr: 'orgName' },
        placeholder: '所有客户',
      },
    },
    options: {
      initialValue: searData.customerOrgId,
    },
  },
  {
    label: '回复时间',
    layout: FORM_ITEM_LAYOUT,
    width: 350,
    field: 'shipTime',
    component: {
      name: 'RangePicker',
      props: {
        className: 'aek-mr20',
      },
    },
    options: {
      initialValue: searData.receiptTime || null,
    },
  },
]
const getColumns = handleDetailClick => [{
  title: '序号',
  dataIndex: 'index',
  key: 'index',
  className: 'aek-text-center',
  width: 80,
  render: (text, _, idx) => idx + 1,
}, {
  title: '目标医院',
  dataIndex: 'hplName',
  key: 'hplName',
}, {
  title: 'SQL',
  dataIndex: 'sql',
  key: 'sql',
  render: (text, record) => (<a
    onClick={() => {
      handleDetailClick(record.apiId, record)
    }}
  ><Ellipsis length={100} tooltip>{text}</Ellipsis></a>),
}, {
  title: '提交时间',
  dataIndex: 'sendTime',
  key: 'sendTime',
}, {
  title: '回复状态',
  dataIndex: 'replyStatus',
  key: 'replyStatus',
  render: (text) => {
    if (text) {
      return '已回复'
    }
    return '未回复'
  },
}, {
  title: '回复时间',
  dataIndex: 'receiveTime',
  key: 'receiveTime',
}, {
  title: '代码',
  dataIndex: 'code',
  key: 'code',
}, {
  title: '描述',
  dataIndex: 'remark',
  key: 'remark',
}]

const modalForm = () => [
  {
    label: '目标医院',
    layout: {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
    },
    field: 'hplId',
    component: {
      name: 'LkcSelect',
      props: {
        url: 'organization/option/3-after-review-list',
        optionConfig: { idStr: 'orgId', nameStr: 'orgName' },
        placeholder: '所有客户',
      },
    },
    options: {
      initialValue: undefined,
      rules: [{
        required: true,
        message: '必填项不能为空',
      }],
    },
  },
  {
    label: 'SQL',
    layout: {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
    },
    field: 'sql',
    component: {
      name: 'TextArea',
    },
    options: {
      initialValue: null,
      rules: [
        {
          required: true,
          whitespace: true,
          message: '必填项不能为空',
        },
      ],
    },
  },
]

export default {
  getColumns,
  fromData,
  modalForm,
}
