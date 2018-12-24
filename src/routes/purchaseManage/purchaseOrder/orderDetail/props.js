import React from 'react'
import { Link } from 'dva/router'

const renderDeliveryInfo = (row) => {
  if (row.deliverType === 2) {
    if (!row.deliverPhone) {
      return '自送'
    }
    return `自送-${row.deliverPhone}`
  }
  return `${row.deliverCompany}-${row.deliverNo}`
}
const traceColumns = dataLength => [
  {
    title: '配送序号',
    dataIndex: 'index',
    width: 100,
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
      <Link to={`/purchaseManage/purchaseOrder/logistics/${row.formId}`}>
        {renderDeliveryInfo(row)}
      </Link>
    ),
  },
  {
    title: '配送单号',
    dataIndex: 'formNo',
    className: 'aek-text-center',
    render: (value, row) => (
      <Link to={`/purchaseManage/deliveryOrder/deliveryDetail/${row.formId}`} target="_blank">
        {row.formNo}
      </Link>
    ),
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
    render: (value, row) => {
      if (row.formStatus === 2) {
        return (
          <Link to={`/purchaseManage/scanAcceptance?formNo=${row.formNo}`} target="_blank">
            确认收货
          </Link>
        )
      }
      return (
        <Link to={`/purchaseManage/deliveryOrder/deliveryDetail/${row.formId}`} target="_blank">
          配送明细
        </Link>
      )
    },
  },
]
const materialColumns = [
  {
    title: '物资名称',
    dataIndex: 'materialsName',
    key: 'materialsName',
    render: (text, row) => {
      if (row.itemStatus === 2) {
        return {
          children: text,
          props: {
            className: 'aek-disabled',
          },
        }
      }
      return text
    },
  },
  {
    title: '规格型号',
    dataIndex: 'materialsSku',
    key: 'materialsSku',
    width: 300,
    className: 'aek-text-center',
  },
  {
    title: '采购数量',
    dataIndex: 'purchaseQty',
    className: 'aek-text-center',
    render: (value, record) => (
      <div>
        {value}
        {record.skuUnitText}
        {record.transformValue === 1 || !record.transformValue
          ? ''
          : `(${record.purchaseQty / record.transformValue}${record.packageUnitText})`}
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
