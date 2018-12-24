import React from 'react'
import { Select, Input, DatePicker } from 'antd'
import { Link } from 'dva/router'
import { filter } from 'lodash'

import {
  ORDER_STATUS,
  MANAGE_MODEL,
  SALE_TYPE,
  NO_LABEL_LAYOUT,
} from '../../../utils/constant'

const Option = Select.Option
const RangePicker = DatePicker.RangePicker

const renderStatus = (text) => {
  const statusText = filter(ORDER_STATUS, { value: String(text) })[0].label
  if (text < 4) {
    if (text < 2) {
      return <div className="aek-orange">{statusText}</div>
    }
    return <div className="aek-green">{statusText}</div>
  }
  return statusText
}

const formData = [
  {
    layout: NO_LABEL_LAYOUT,
    field: 'formStatus',
    width: 150,
    options: {
      initialValue: null,
    },
    component: (
      <Select optionLabelProp="title">
        <Select.Option title="订单状态: 全部" value={null}>
          全部
        </Select.Option>
        {ORDER_STATUS.map(item => (
          <Option title={`订单状态: ${item.label}`} key={item.value} value={item.value}>
            {item.label}
          </Option>
        ))}
      </Select>
    ),
  },
  {
    layout: NO_LABEL_LAYOUT,
    field: 'formType',
    width: 150,
    options: {
      initialValue: null,
    },
    component: (
      <Select optionLabelProp="title">
        <Option title="订单类型: 全部" value={null}>
          全部
        </Option>
        <Option title="订单类型: 普耗" value="1">
          普耗
        </Option>
        <Option title="订单类型: 寄销" value="2">
          寄销
        </Option>
      </Select>
    ),
  },
  {
    layout: NO_LABEL_LAYOUT,
    field: 'urgentFlag',
    width: 150,
    options: {
      initialValue: null,
    },
    component: (
      <Select optionLabelProp="title">
        <Option title="是否加急: 全部" value={null}>
          全部
        </Option>
        <Option title="是否加急: 否" value="0">
          否
        </Option>
        <Option title="是否加急: 是" value="1">
          是
        </Option>
      </Select>
    ),
  },
  {
    layout: NO_LABEL_LAYOUT,
    field: 'purchaseTime',
    width: '250px',
    component: <RangePicker format="YYYY-MM-DD" />,
    options: {
      initialValue: undefined,
    },
  },
  {
    layout: NO_LABEL_LAYOUT,
    field: 'customerOrgName',
    width: 150,
    options: {
      initialValue: '',
    },
    component: (
      <Input placeholder="买方" />
    ),
  },
  {
    layout: NO_LABEL_LAYOUT,
    field: 'supplierOrgName',
    width: 150,
    options: {
      initialValue: '',
    },
    component: (
      <Input placeholder="卖方" />
    ),
  },
  {
    layout: NO_LABEL_LAYOUT,
    field: 'formNo',
    width: 150,
    options: {
      initialValue: '',
    },
    component: <Input placeholder="采购订单编号" />,
  },
]

const tableColumns = [
  {
    title: '序号',
    key: 'index',
    className: 'aek-text-center',
    width: 50,
    render: (value, row, index) => {
      const obj = {
        children: index + 1,
        props: {},
      }
      if (row.urgentFlag && row.formStatus < 3) {
        obj.props.className = 'aek-text-center aek-urgent'
      } else {
        obj.props.className = 'aek-text-center'
      }
      return obj
    },
  },
  {
    title: '订单编号',
    dataIndex: 'formNo',
    key: 'formNo',
    render: (value, row) => (
      <Link className="aek-link" to={`/businessQuery/purchaseOrderQuery/detail/${row.formId}`}>
        {value}
      </Link>
    ),
  },
  {
    title: '订单类型',
    dataIndex: 'formType',
    key: 'type',
    className: 'aek-text-center',
    render: (value, record) => {
      const saleType = SALE_TYPE[record.saleType]
      const formType = MANAGE_MODEL[record.formType]
      return `${saleType}-${formType}`
    },
  },
  {
    title: '订单金额',
    dataIndex: 'formAmount',
    key: 'formAmount',
    className: 'aek-text-right',
    render: text => `￥${text}`,
  },
  {
    title: '买方',
    dataIndex: 'customerOrgName',
  },
  {
    title: '卖方',
    dataIndex: 'supplierOrgName',
  },
  {
    title: '采购时间',
    dataIndex: 'purchaseTime',
  },
  {
    title: '订单状态',
    dataIndex: 'formStatus',
    render: text => renderStatus(text),
  },
]

export default {
  formData,
  tableColumns,
}
