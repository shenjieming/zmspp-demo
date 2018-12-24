import React from 'react'

const genColumns = ({ viewModal }) => [
  {
    title: '版本号',
    dataIndex: 'materialsSkuVersionCode',
    key: 'materialsSkuVersionCode',
  },
  {
    title: '修改时间',
    dataIndex: 'lastEditTime',
    key: 'lastEditTime',
  },
  {
    title: '修改人',
    dataIndex: 'lastEditName',
    key: 'lastEditName',
  },
  {
    title: '操作',
    key: 'action',
    width: 160,
    className: 'aek-text-center',
    render: (text, record) => <a onClick={() => viewModal(record)}>查看</a>,
  },
]

export default {
  genColumns,
}
