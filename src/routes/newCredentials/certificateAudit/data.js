import React from 'react'

const baseColumn = () => [{
  title: '注册证/产品名称',
  dataIndex: 'certificateNo',
  render: (value, { productName }) => (
    <span>
      <p>{value}</p>
      <p className="aek-text-help">{productName || ''}</p>
    </span>
  ),
}, {
  title: '厂家/总代',
  dataIndex: 'produceFactoryName',
  render: (value, { agentSupplierName }) => (
    <span>
      <p>{value}</p>
      <p>{agentSupplierName ? <span className="aek-text-help">总代:{agentSupplierName}</span> : ''}</p>
    </span>
  ),
}]

const tableColumns = (type, handleReview) => ({
  review: [
    ...baseColumn(),
    {
      title: '推送日期',
      dataIndex: 'lastEditTime',
    }, {
      title: '操作',
      dataIndex: 'operation',
      render: (_, record) => (
        <span>
          <a
            onClick={() => {
              handleReview(type, record)
            }}
          >审阅</a>
        </span>
      ),
    },
  ],
  refused: [
    {
      title: '序号',
      dataIndex: 'index',
      className: 'aek-text-center',
      width: 50,
      render: (value, row, index) => index + 1,
    },
    ...baseColumn(),
    {
      title: '操作',
      dataIndex: 'operation',
      render: (_, record) => (
        <span>
          <a
            onClick={() => {
              handleReview(type, record)
            }}
          >重新审阅</a>
        </span>
      ),
    },
  ],
}[type])

export default {
  tableColumns,
}
