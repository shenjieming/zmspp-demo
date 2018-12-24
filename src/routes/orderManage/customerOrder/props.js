import React from 'react'
import { Select, Input, DatePicker } from 'antd'
import { Link } from 'dva/router'
import { filter } from 'lodash'

import {
  ORDER_STATUS,
  SALE_TYPE,
  MANAGE_MODEL,
  FORM_ITEM_LAYOUT,
  NO_LABEL_LAYOUT,
} from '../../../utils/constant'

const RangePicker = DatePicker.RangePicker
const Option = Select.Option

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

const advancedForm = () => [
  {
    layout: FORM_ITEM_LAYOUT,
    label: '订单状态',
    field: 'formStatus',
    options: {
      initialValue: null,
    },
    component: (
      <Select>
        <Option value={null}>全部</Option>
        {ORDER_STATUS.map(item => (
          <Option key={item.value} value={item.value}>
            {item.label}
          </Option>
        ))}
      </Select>
    ),
  },
  {
    layout: FORM_ITEM_LAYOUT,
    label: '订单类型',
    field: 'saleTypeAndFormType',
    options: {
      initialValue: null,
    },
    component: (
      <Select>
        <Option value={null}>全部</Option>
        <Option value="1-1">直销-普耗</Option>
        <Option value="1-2">直销-寄销</Option>
        <Option value="2-1">过票-普耗</Option>
        <Option value="2-2">过票-寄销</Option>
      </Select>
    ),
  },
  {
    label: '是否加急',
    layout: FORM_ITEM_LAYOUT,
    field: 'urgentFlag',
    component: (
      <Select>
        <Option value={null}>全部</Option>
        <Option value="0">否</Option>
        <Option value="1">是</Option>
      </Select>
    ),
    options: {
      initialValue: null,
    },
  },
  {
    label: '客户',
    layout: FORM_ITEM_LAYOUT,
    field: 'customerOrgId',
    component: {
      name: 'LkcSelect',
      props: {
        url: 'contacts/options/customers',
        optionConfig: { idStr: 'customerOrgId', nameStr: 'customerOrgName' },
        placeholder: '所有客户',
      },
    },
    options: {
      initialValue: undefined,
    },
  },
  {
    label: '关键词',
    layout: FORM_ITEM_LAYOUT,
    field: 'keywords',
    component: <Input placeholder="采购订单编号/采购人/收货单位" />,
    options: {
      initialValue: '',
    },
  },
  {
    label: '物资',
    layout: FORM_ITEM_LAYOUT,
    field: 'materialsInfo',
    component: <Input placeholder="物资" />,
    options: {
      initialValue: '',
    },
  },
  {
    label: '采购时间',
    layout: {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
    },
    field: 'purchaseTime',
    width: '360px',
    component: <RangePicker format="YYYY-MM-DD" />,
    options: {
      initialValue: undefined,
    },
  },
  {
    label: '超过一周未发货',
    layout: {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    },
    field: 'unDeliverOverDaysType',
    width: '360px',
    component: {
      name: 'Checkbox',
    },
    options: {
      valuePropName: 'checked',
      initialValue: false,
    },
  },
]

const formData = () => [
  {
    layout: NO_LABEL_LAYOUT,
    field: 'formStatus',
    width: 220,
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
  // {
  //   layout: NO_LABEL_LAYOUT,
  //   field: 'saleTypeAndFormType',
  //   width: 220,
  //   options: {
  //     initialValue: null,
  //   },
  //   component: (
  //     <Select optionLabelProp="title">
  //       <Option title="订单类型: 全部" value={null}>
  //         全部
  //       </Option>
  //       <Option title="订单类型: 直销-普耗" value="1-1">
  //         直销-普耗
  //       </Option>
  //       <Option title="订单类型: 直销-寄销" value="1-2">
  //         直销-寄销
  //       </Option>
  //       <Option title="订单类型: 过票-普耗" value="2-1">
  //         过票-普耗
  //       </Option>
  //       <Option title="订单类型: 过票-寄销" value="2-2">
  //         过票-寄销
  //       </Option>
  //     </Select>
  //   ),
  // },
  // {
  //   layout: NO_LABEL_LAYOUT,
  //   field: 'urgentFlag',
  //   width: 220,
  //   options: {
  //     initialValue: null,
  //   },
  //   component: (
  //     <Select optionLabelProp="title">
  //       <Option title="是否加急: 全部" value={null}>
  //         全部
  //       </Option>
  //       <Option title="是否加急: 否" value="0">
  //         否
  //       </Option>
  //       <Option title="是否加急: 是" value="1">
  //         是
  //       </Option>
  //     </Select>
  //   ),
  // },
  // {
  //   layout: NO_LABEL_LAYOUT,
  //   field: 'customerOrgId',
  //   width: 220,
  //   options: {
  //     initialValue: undefined,
  //   },
  //   component: {
  //     name: 'LkcSelect',
  //     props: {
  //       url: 'contacts/options/customers',
  //       optionConfig: { idStr: 'customerOrgId', nameStr: 'customerOrgName' },
  //       placeholder: '所有客户',
  //     },
  //   },
  // },
  {
    layout: NO_LABEL_LAYOUT,
    field: 'keywords',
    width: 220,
    options: {
      initialValue: '',
    },
    component: <Input placeholder="采购订单编号/采购人/收货单位" />,
  },
  {
    layout: NO_LABEL_LAYOUT,
    field: 'materialsInfo',
    width: 220,
    options: {
      initialValue: '',
    },
    component: <Input placeholder="物资" />,
  },
  {
    layout: NO_LABEL_LAYOUT,
    field: 'unDeliverOverDaysType',
    width: 150,
    options: {
      valuePropName: 'checked',
      initialValue: false,
    },
    component: {
      name: 'Checkbox',
      props: {
        children: '超过一周未发货',
      },
    },
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
    render: (_, row) => (
      <Link className="aek-link" to={`/orderManage/customerOrder/detail/${row.formId}`}>
        {row.formNo}
      </Link>
    ),
  },
  {
    title: '客户名称',
    dataIndex: 'customerOrgName',
    // render: (value, row) => (
    //   <div>
    //     <div>{value}</div>
    //     {row.saleType === 2 ? <div>收货单位:{row.receiveOrgName}</div> : ''}
    //   </div>
    // ),
  },
  {
    title: '采购金额',
    dataIndex: 'formAmount',
    key: 'formAmount',
    className: 'aek-text-right',
    render: value => `￥${value}`,
  },
  {
    title: '类型',
    key: 'type',
    className: 'aek-text-center',
    render: (value, record) => {
      const saleType = SALE_TYPE[record.saleType]
      const formType = MANAGE_MODEL[record.formType]
      return `${saleType}-${formType}`
    },
  },
  {
    title: '状态',
    dataIndex: 'formStatus',
    className: 'aek-text-center',
    render: text => renderStatus(text),
  },
  {
    title: '采购人',
    dataIndex: 'purchaseName',
  },
  {
    title: '采购时间',
    dataIndex: 'purchaseTime',
  },
]

export default {
  formData,
  advancedForm,
  tableColumns,
}
