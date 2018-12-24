import React from 'react'

const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    className: 'aek-text-center',
    width: 50,
    render: (text, _, idx) => idx + 1,
  },
  {
    title: '入库单号',
    dataIndex: 'formNo',
    key: 'formNo',
    width: 100,
  },
  {
    title: '入库日期',
    dataIndex: 'stockInTime',
    key: 'stockInTime',
    width: 100,
  },
  {
    title: '入库单金额',
    dataIndex: 'formAmount',
    key: 'formAmount',
    width: 100,
  },
  {
    title: '可贷余额',
    dataIndex: 'balance',
    key: 'balance',
    width: 100,
  },
]
const columnsInner = [
  {
    title: '产品名称/规格',
    dataIndex: 'goodsName',
    key: 'goodsName',
    render: (text, { specSize }) => (
      <span>
        {text}/{specSize}
      </span>
    ),
  },
  { title: '单价', dataIndex: 'stockInPrice', key: 'stockInPrice' },
  {
    title: '数量/单位',
    dataIndex: 'stockInQty',
    key: 'stockInQty',
    render: (text, { specUnit }) => (
      <span>
        {text}/{specUnit}
      </span>
    ),
  },
  { title: '发票号码', dataIndex: 'invoiceNo', key: 'invoiceNo' },
]
export default {
  columns,
  columnsInner,
}
