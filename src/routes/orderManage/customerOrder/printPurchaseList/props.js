import React from 'react'

const formTypeText = ['', '普耗', '寄销', '跟台']
const tableColumns = [
  {
    title: '物资名称',
    dataIndex: 'materialsName',
    key: 'materialsName',
    className: 'aek-word-break',
  },
  {
    title: '规格型号',
    width: 400,
    dataIndex: 'materialsSku',
    key: 'materialsSku',
    className: 'aek-word-break',
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

const getDetailData = (detailPageData) => {
  const {
    customerOrgName,
    formAmount,
    formType,
    saleType,
    formNo,
    originalFormNo,
    purchaseTime,
    purchaseName,
    customerContactPhone,
    urgentFlag,
    purchaseRemark,
  } = detailPageData
  if (Number(formType) !== 3) {
    // 普耗--寄销配送明细
    if (saleType === 2) {
      return {
        客户名称: customerOrgName,
        客户订单号: formNo,
        原采购订单号: originalFormNo,
        采购时间: purchaseTime,
        采购人: purchaseName,
        联系电话: customerContactPhone,
        合计金额: `￥${formAmount}`,
        是否加急: urgentFlag ? '是' : '否',
        '采购备注|fill': <span className="aek-word-break">{purchaseRemark}</span>,
      }
    }
    return {
      客户名称: customerOrgName,
      客户订单号: formNo,
      采购时间: purchaseTime,
      采购人: purchaseName,
      联系电话: customerContactPhone,
      合计金额: `￥${formAmount}`,
      是否加急: urgentFlag ? '是' : '否',
      '采购备注|fill': <span className="aek-word-break">{purchaseRemark}</span>,
    }
  }
}
export default {
  tableColumns,
  getDetailData,
}
