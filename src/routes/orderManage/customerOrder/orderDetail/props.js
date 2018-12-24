import React from 'react'
import { Link } from 'dva/router'

const renderDeliveryInfo = (row) => {
  if (row.deliverType === 2) {
    if (!row.deliverPhone) {
      return '自送'
    }
    return `自送-${row.deliverPhone}`
  }
  return `${row.deliverCompany || ''}-${row.deliverNo || ''}`
}

const traceColumns = dataLength => [
  {
    title: '配送序号',
    dataIndex: 'index',
    className: 'aek-text-center',
    render: (value, row, index) => (
      <div>
        第<span className="aek-orange" style={{ fontWeight: 'bold' }}>
          {dataLength - index}
        </span>次配送
      </div>
    ),
  },
  {
    title: '状态',
    dataIndex: 'formStatus',
    width: 100,
    className: 'aek-text-center',
    render: (value) => {
      const deliverFormTypes = ['', '暂存', '配送中', '已验收', '已作废']
      return deliverFormTypes[value]
    },
  },
  {
    title: '配送信息',
    key: 'deliverInfo',
    className: 'aek-text-center',
    render: (value, row) => (
      <Link to={`/orderManage/customerOrder/logistics/${row.formId}`}>
        {renderDeliveryInfo(row)}
      </Link>
    ),
  },
  {
    title: '配送单号',
    dataIndex: 'formNo',
    className: 'aek-text-center',
  },
  {
    title: '发货人',
    dataIndex: 'senderName',
    className: 'aek-text-center',
  },
  {
    title: '发货时间',
    dataIndex: 'senderTime',
    className: 'aek-text-center',
  },
  {
    title: '操作',
    key: 'opration',
    className: 'aek-text-center',
    render: (value, row) => (
      <Link to={`/orderManage/deliveryOrder/deliveryDetail/${row.formId}`} target="_blank">
        配送明细
      </Link>
    ),
  },
]
const materialColumns = [
  {
    title: '物资名称',
    dataIndex: 'materialsName',
    key: 'materialsName',
  },
  {
    title: '规格型号',
    dataIndex: 'materialsSku',
    key: 'materialsSku',
    width: 300,
    className: 'aek-text-center',
  },
  {
    title: '生产厂家',
    dataIndex: 'factoryName',
  },
  {
    title: '采购数量',
    dataIndex: 'purchaseQty',
    className: 'aek-text-center',
    render: (value, record) => (
      <div>
        {value}
        {record.skuUnitText}
      </div>
    ),
  },
  {
    title: '已配送数量',
    dataIndex: 'deliveredQty',
    className: 'aek-text-center',
    render: (value, record) => (
      <div>
        {value}
        {record.skuUnitText}
      </div>
    ),
  },
  {
    title: '待配送数量',
    dataIndex: 'waitDeliverQty',
    className: 'aek-text-center',
    render: (value, record) => (
      <div>
        {value}
        {record.skuUnitText}
      </div>
    ),
  },
  {
    title: '单价',
    dataIndex: 'materialsPrice',
    className: 'aek-text-right',
    render: text => `￥${text}`,
  },
  {
    title: '金额',
    dataIndex: 'materialsAmount',
    className: 'aek-text-right',
    render: text => `￥${text}`,
  },
]
export default {
  materialColumns,
  traceColumns,
}
