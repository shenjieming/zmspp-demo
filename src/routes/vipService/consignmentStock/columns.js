import React from 'react'

export default [
  {
    title: '序号',
    key: 'index',
    className: 'aek-text-center',
    render: ($, _, i) => i + 1,
  },
  {
    title: '物料信息',
    key: 'materialsName',
    dataIndex: 'materialsName',
    render: (text, row) => (
      <div>
        {text}
        <div className="aek-text-help">{row.materialsCommonName}</div>
      </div>
    ),
  },
  {
    title: '规格型号',
    key: 'materialsSku',
    dataIndex: 'materialsSku',
  },
  {
    title: '剩余库存',
    key: 'stockQty',
    dataIndex: 'stockQty',
  },
  {
    title: '今日使用',
    key: 'todayUseQty',
    dataIndex: 'todayUseQty',
  },
  {
    title: '本周使用',
    key: 'weekUseQty',
    dataIndex: 'weekUseQty',
  },
  {
    title: '本月使用',
    key: 'monthUseQty',
    dataIndex: 'monthUseQty',
  },
  {
    title: '批次',
    key: 'batchNo',
    dataIndex: 'batchNo',
  },
  {
    title: '效期',
    key: 'expiredDate',
    dataIndex: 'expiredDate',
  },
  {
    title: '跟踪码',
    key: 'trackCode',
    dataIndex: 'trackCode',
  },
  {
    title: '最后更新时间',
    key: 'lastEditTime',
    dataIndex: 'lastEditTime',
  },
]
