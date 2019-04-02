import React from 'react'
import Decimal from 'decimal.js-light'
import { formatNum } from '../../../../utils'

const genColumns = ({ formType }) =>
  [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      className: 'aek-text-center',
      render: (text, record, idx) => idx + 1,
    },
    {
      title: '物资名称/通用名',
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
      title: '规格名称',
      dataIndex: 'materialsSku',
      key: 'materialsSku',
    },
    {
      title: '采购数量',
      dataIndex: 'waitDeliverQty',
      key: 'waitDeliverQty',
      render: (text, row, index) => {
        if (text) {
          return (
            <span>
              {text}
              {row.skuUnitText}
            </span>
          )
        }
      }
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
      title: '单价',
      dataIndex: 'materialsPrice',
      className: 'aek-text-right',
      width: 100,
      key: 'materialsPrice',
      render: text => <span>¥ {text}</span>,
    },
    {
      title: '金额',
      dataIndex: 'concatPrice',
      key: 'concatPrice',
      width: 100,
      className: 'aek-text-right',
      render: (text, { deliverQty, materialsPrice }) => (
        <span>{formatNum(new Decimal(materialsPrice).times(deliverQty))}</span>
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
      title: '注册证号',
      dataIndex: 'certificateNo',
      key: 'certificateNo',
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
export default {
  genColumns,
}
