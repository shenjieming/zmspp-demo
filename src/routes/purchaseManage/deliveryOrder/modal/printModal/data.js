import React from 'react'
import Decimal from 'decimal.js-light'
import { formatNum } from '../../../../../utils'

const genColumns = ({ formType }) =>
  [
    {
      title: '物资名称/通用名称',
      dataIndex: 'materialsName',
      key: 'materialsName',
      render: (text, { materialsCommonName }) => (
        <span>
          <p>{text || <span>&nbsp;</span>}</p>
          <p>{materialsCommonName || <span>&nbsp;</span>}</p>
        </span>
      ),
    },
    {
      title: '规格型号',
      dataIndex: 'materialsSku',
      key: 'materialsSku',
    },
    {
      title: '单价',
      dataIndex: 'materialsPrice',
      key: 'materialsPrice',
      className: 'aek-text-right',
      width: 100,
      exclude: Number(formType) === 3,
      render: text => <span>¥{text}</span>,
    },
    {
      title: '配送数量/验收数量',
      dataIndex: 'deliverQty',
      key: 'deliverQty',
      render: (text, { acceptQty, skuUnitText }) => (
        <span>
          {text && (
            <span>
              {text}
              {skuUnitText}
            </span>
          )}
          {!!acceptQty && (
            <span>
              /{acceptQty}
              {skuUnitText}
            </span>
          )}
        </span>
      ),
    },
    {
      title: '配送金额/验收金额',
      dataIndex: 'concatPrice',
      key: 'concatPrice',
      className: 'aek-text-right',
      render: (text, { deliverQty, acceptQty, materialsPrice }) => (
        <span>
          <p>{formatNum(new Decimal(materialsPrice).times(deliverQty)) || <span>&nbsp;</span>}</p>
          <p>{formatNum(new Decimal(materialsPrice).times(acceptQty)) || <span>&nbsp;</span>}</p>
        </span>
      ),
    },
    {
      title: '发票号码/发票日期',
      dataIndex: 'invoiceNo',
      key: 'invoiceNo',
      exclude: Number(formType) !== 1,
      render: (text, { invoiceDate }) => (
        <span>
          <p>{text || <span>&nbsp;</span>}</p>
          <p>{invoiceDate || <span>&nbsp;</span>}</p>
        </span>
      ),
    },
    {
      title: '注册证号/省标编号',
      dataIndex: 'certificateNo',
      key: 'certificateNo',
      render: (text, { inviteNo }) => (
        <span>
          <p>{text || <span>&nbsp;</span>}</p>
          <p>{inviteNo || <span>&nbsp;</span>}</p>
        </span>
      ),
    },
    {
      title: '批号/有效期',
      dataIndex: 'batchNo',
      key: 'batchNo',
      render: (text, { expiredDate }) => (
        <span>
          <p>{text || <span>&nbsp;</span>}</p>
          <p>{expiredDate || <span>&nbsp;</span>}</p>
        </span>
      ),
    },
    {
      title: '灭菌批次/灭菌效期',
      dataIndex: 'sterilizationNo',
      key: 'sterilizationNo',
      render: (text, { sterilizationDate }) => (
        <span>
          <p>{text || <span>&nbsp;</span>}</p>
          <p>{sterilizationDate || <span>&nbsp;</span>}</p>
        </span>
      ),
    },
    {
      title: '跟踪码',
      dataIndex: 'trackCode',
      key: 'trackCode',
    },
  ].filter(item => !item.exclude)
const getDetailData = (detailPageData) => {
  const {
    supplierOrgName, // 客户机构名称',
    formAmount, // 配送单金额',
    formType, // 1-普耗；2-寄售；3-跟台
    originalFormNo, // 客户订单号',
    deliverRemark, // 发货备注',
    senderName, // 发货人
    senderPhone, // 发货电话
    senderTime, // 发货人
    initialFormNo,
    customerOrgName,
    saleType,
  } = detailPageData
  if (Number(formType) !== 3) {
    // 普耗--寄销配送明细
    if (saleType === 1) {
      return {
        供应商名称: supplierOrgName,
        发货人: senderName,
        联系电话: senderPhone,
        订单编号: originalFormNo,
        合计金额: <span>¥ {formAmount}</span>,
        发货时间: senderTime,
        '发货备注|fill': <span className="aek-word-break">{deliverRemark}</span>,
      }
    } else if (saleType === 2) {
      return {
        供应商名称: customerOrgName,
        配送商名称: supplierOrgName,
        发货人: senderName,
        联系电话: senderPhone,
        订单编号: originalFormNo,
        原采购单号: initialFormNo,
        合计金额: <span>¥ {formAmount}</span>,
        发货时间: senderTime,
        '发货备注|fill': <span className="aek-word-break">{deliverRemark}</span>,
      }
    }
  }
  // 跟台--配送明细
  return {
    供应商名称: supplierOrgName,
    发货人: senderName,
    联系电话: senderPhone,
    合计金额: <span>¥ {formAmount}</span>,
    发货时间: senderTime,
    '发货备注|fill': <span className="aek-word-break">{deliverRemark}</span>,
  }
}
export default {
  genColumns,
  getDetailData,
}
