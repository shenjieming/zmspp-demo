import React from 'react'
import { Select, Input } from 'antd'
import { Link } from 'dva/router'

import LkcRangePicker from '../../../components/LkcDatePicker/LkcRangePicker'
import { NO_LABEL_LAYOUT, MANAGE_MODEL, CANCEL_STATUS } from '../../../utils/constant'

const Option = Select.Option
const formData = namespace => [
  {
    layout: {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    },
    field: 'timeRange',
    label: '退货日期',
    width: 400,
    options: {
      initialValue: null,
    },
    component: <LkcRangePicker style={{ display: 'inline' }} />,
  },
  {
    layout: NO_LABEL_LAYOUT,
    field: 'formStatus',
    width: 220,
    options: {
      initialValue: null,
    },
    component: (
      <Select optionLabelProp="title" style={{ marginLeft: '10px' }}>
        <Option title="状态: 全部" value={null}>
          全部
        </Option>
        <Option title="状态: 暂存" value="1">
          暂存
        </Option>
        <Option title="状态: 待退货审核" value="2">
          待退货审核
        </Option>
        <Option title="状态: 待退货确认" value="3">
          待退货确认
        </Option>
        <Option title="状态: 已完成" value="4">
          已完成
        </Option>
        <Option title="状态: 审核不通过" value="5">
          审核不通过
        </Option>
        <Option title="状态: 已作废" value="6">
          已作废
        </Option>
      </Select>
    ),
  },
  {
    layout: NO_LABEL_LAYOUT,
    field: 'formType',
    width: 210,
    options: {
      initialValue: null,
    },
    component: (
      <Select optionLabelProp="title">
        <Option title="类型: 全部" value={null}>
          全部
        </Option>
        <Option title="类型: 普耗" value="1">
          普耗
        </Option>
        <Option title="类型: 寄销" value="2">
          寄销
        </Option>
      </Select>
    ),
  },
  {
    layout: NO_LABEL_LAYOUT,
    field: 'keywords',
    width: 220,
    options: {
      initialValue: '',
    },
    component: (
      <Input
        placeholder={`单号、${namespace === 'cancelOrder' ? '客户名称检索' : '供应商名称检索'}`}
        maxLength="30"
      />
    ),
  },
]

const tableColumns = namespace => [
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
  namespace === 'cancelOrder'
    ? {
      title: '退货单号',
      dataIndex: 'formNo',
      key: 'formNo',
      render: (_, row) => (
        <Link className="aek-link" to={`/orderManage/cancelOrder/detail/${row.formId}`}>
          {row.formNo}
        </Link>
      ),
    }
    : {
      title: '退货单号',
      dataIndex: 'formNo',
      key: 'formNo',
      render: (_, row) => (
        <Link className="aek-link" to={`/purchaseManage/purchaseCancel/detail/${row.formId}`}>
          {row.formNo}
        </Link>
      ),
    },
  namespace === 'cancelOrder'
    ? {
      title: '客户名称',
      dataIndex: 'customerOrgName',
      sorter: true,
    }
    : {
      title: '供应商名称',
      dataIndex: 'supplierOrgName',
      sorter: true,
    },
  {
    title: '类型',
    dataIndex: 'formType',
    className: 'aek-text-center',
    render: value => MANAGE_MODEL[value],
    sorter: true,
  },
  {
    title: '金额',
    dataIndex: 'formAmount',
    className: 'aek-text-right',
    render: value => `￥${value}`,
  },
  {
    title: '退货时间',
    dataIndex: 'submitTime',
    className: 'aek-text-center',
    sorter: true,
  },
  {
    title: '状态',
    dataIndex: 'formStatus',
    className: 'aek-text-center',
    render: value => CANCEL_STATUS[value],
  },
  namespace === 'cancelOrder'
    ? {
      title: '操作',
      className: 'aek-text-center',
      render: (value, row) => (
        <Link className="aek-link" to={`/orderManage/cancelOrder/detail/${row.formId}`}>
            查看
        </Link>
      ),
    }
    : {
      title: '操作',
      className: 'aek-text-center',
      render: (value, row) => (
        <Link className="aek-link" to={`/purchaseManage/purchaseCancel/detail/${row.formId}`}>
            查看
        </Link>
      ),
    },
]

export default {
  formData,
  tableColumns,
}
