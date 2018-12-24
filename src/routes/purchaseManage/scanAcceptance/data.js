import React from 'react'
import { InputNumber } from 'antd'

const genColumns = ({ handleData, formStatus }) =>
  [
    {
      title: '序号',
      dataIndex: 'itemIndex',
      key: 'itemIndex',
    },
    {
      title: '省标编号',
      dataIndex: 'inviteNo',
      key: 'inviteNo',
    },
    {
      title: '物资名称',
      dataIndex: 'materialsName',
      key: 'materialsName',
    },
    {
      title: '规格型号',
      dataIndex: 'materialsSku',
      key: 'materialsSku',
    },
    {
      title: '厂家/注册证',
      dataIndex: 'factoryName',
      key: 'factoryName',
      render: (text, { certificateNo }) => (
        <span>
          <div>{text || <span>&nbsp;</span>}</div>
          <div>{certificateNo || <span>&nbsp;</span>}</div>
        </span>
      ),
    },
    {
      title: '配送数量',
      dataIndex: 'deliverQty',
      key: 'deliverQty',
    },
    {
      title: '验收',
      dataIndex: 'acceptQty',
      key: 'acceptQty',
      render: (text, record) => {
        const { deliverQty } = record
        if (formStatus === 3) {
          return deliverQty
        }
        return (
          <InputNumber
            min={1}
            precision={2}
            max={deliverQty}
            defaultValue={deliverQty}
            onChange={value => handleData(value, record, 'acceptQty')}
          />
        )
      },
    },
    {
      title: '单价/单位',
      dataIndex: 'materialsPrice',
      key: 'materialsPrice',
      render: (text, { skuUnitText }) => (
        <span>
          {text}/{skuUnitText}
        </span>
      ),
    },
    {
      title: '批号/效期',
      dataIndex: 'batchNo',
      key: 'batchNo',
      render: (text, { expiredDate }) => (
        <span>
          <div>{text || <span>&nbsp;</span>}</div>
          <div>{expiredDate || <span>&nbsp;</span>}</div>
        </span>
      ),
    },
    {
      title: '发票号码/发票日期',
      dataIndex: 'invoiceNo',
      key: 'invoiceNo',
      render: (text, { invoiceDate }) => (
        <span>
          <div>{text || <span>&nbsp;</span>}</div>
          <div>{invoiceDate || <span>&nbsp;</span>}</div>
        </span>
      ),
    },
    {
      title: '跟踪码',
      dataIndex: 'trackCode',
      key: 'trackCode',
    },
    {
      title: '灭菌批号/灭菌效期',
      dataIndex: 'sterilizationNo',
      key: 'sterilizationNo',
      render: (text, { sterilizationDate }) => (
        <span>
          <div>{text || <span>&nbsp;</span>}</div>
          <div>{sterilizationDate || <span>&nbsp;</span>}</div>
        </span>
      ),
    },
  ].filter(_ => !_.exclude)

export default {
  genColumns,
}
