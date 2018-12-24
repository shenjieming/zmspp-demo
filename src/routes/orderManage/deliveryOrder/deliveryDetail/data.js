import React from 'react'
import { Input, DatePicker } from 'antd'
import moment from 'moment'
import { Link } from 'dva/router'
import Decimal from 'decimal.js-light'
import { formatNum } from '../../../../utils'

const genColumns = ({ formType, invoiceChange }) =>
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
      title: '发票号码/发票日期',
      dataIndex: 'invoiceNo',
      width: 210,
      key: 'invoiceNo',
      exclude: Number(formType) !== 1,
      render: (text, record) => {
        const { invoiceDate } = record
        return (
          <div>
            <Input
              style={{ width: 200, marginBottom: 5, display: 'block' }}
              placeholder="请输入发票号码"
              onChange={e => invoiceChange(e.target.value, record, 'invoiceNo')}
              value={text}
            />
            <DatePicker
              style={{ width: 200, display: 'block' }}
              onChange={(e, val) => invoiceChange(val, record, 'invoiceDate')}
              disabledDate={(startValue) => {
                const endValue = moment(new Date())
                if (!startValue || !endValue) {
                  return false
                }
                return startValue.valueOf() >= endValue.valueOf()
              }}
              value={invoiceDate && moment(invoiceDate)}
            />
          </div>
        )
      },
    },
    {
      title: '单价',
      dataIndex: 'materialsPrice',
      key: 'materialsPrice',
      width: 100,
      className: 'aek-text-right',
      render: text => <span>¥{text}</span>,
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
      key: 'sterilizationDate',
      render: (text, { sterilizationDate }) => (
        <span>
          <p>{text || <span>&nbsp;</span>}</p>
          <p>{sterilizationDate || <span>&nbsp;</span>}</p>
        </span>
      ),
    },
    {
      title: '跟踪码/生产日期',
      dataIndex: 'trackCode',
      key: 'trackCode',
      render: (text, { produceDate }) => (<span>
        <p>{text}</p>
        <p>{produceDate}</p>
      </span>),
    },
  ].filter(item => !item.exclude)
const getDetailTopData = (detailPageData) => {
  const {
    receiveDeptName, // 接收科室
    customerOrgName, // 客户机构名称',
    formAmount, // 配送单金额',
    formType, // 1-普耗；2-寄售；3-跟台
    originalFormNo, // 客户订单号',
    purchaseRemark, // 采购备注',
    purchaseTime, // 采购时间',
    receiveName, // 收货人姓名',
    receivePhone, // 收货人电话',
    customerContactName,
    customerContactPhone,
  } = detailPageData
  if (Number(formType) !== 3) {
    // 普耗--寄销配送明细
    return {
      客户名称: customerOrgName,
      联系人: customerContactName,
      联系电话: customerContactPhone,
      客户订单号: originalFormNo,
      采购时间: purchaseTime,
      合计金额: <span>¥{formAmount}</span>,
      '采购备注|fill': <span className="aek-word-break">{purchaseRemark}</span>,
    }
  }
  // 跟台--配送明细
  return {
    客户名称: customerOrgName,
    接收科室: receiveDeptName,
    收货人: receiveName,
    联系电话: receivePhone,
    合计金额: <span>¥{formAmount}</span>,
  }
}
const getDetailBottomData = (detailData) => {
  const {
    deliverCompany, // 物流公司',
    deliverName, // 配送人',
    deliverNo, // 物流单号',
    deliverPhone, // 配送人电话',
    deliverRemark, // 发货备注',
    senderTime,
    senderName,
    deliverType,
    formNo, // 配送单号',
    formId,
  } = detailData
  return {
    配送单号: formNo,
    发货人: senderName,
    发货时间: senderTime,
    '配送方式|fill': (
      <Link to={`/orderManage/deliveryOrder/logistics/${formId}`} className="aek-link">
        {Number(deliverType) === 1 ? (
          <span>
            {deliverNo} {deliverCompany}
          </span>
        ) : (
          <span>
            自送{deliverName && <span>-{deliverName}</span>}
            {deliverPhone && <span>-{deliverPhone}</span>}
          </span>
        )}
      </Link>
    ),
    '发货备注|fill': <span className="aek-word-break">{deliverRemark}</span>,
  }
}
export default {
  genColumns,
  getDetailTopData,
  getDetailBottomData,
}
