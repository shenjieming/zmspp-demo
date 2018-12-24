import React from 'react'
import { Link } from 'dva/router'
import { getOption } from '../../../utils'

const genColumns = () => [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    className: 'aek-text-center',
    render: (text, _, idx) => idx + 1,
  },
  {
    title: '贷款时间',
    dataIndex: 'loanTime',
    key: 'loanTime',
  },
  {
    title: '支付申请单号',
    dataIndex: 'formNo',
    key: 'formNo',
  },
  {
    title: '应还本金',
    dataIndex: 'grantAmount',
    key: 'grantAmount',
    render: (text, { loanAmount }) => (
      <span>
        {text} ( 申请金额{loanAmount} )
      </span>
    ),
  },
  {
    title: '贷款到期时间',
    dataIndex: 'loanExpireTime',
    key: 'loanExpireTime',
    render: (text, { expiredFlag }) => {
      if (expiredFlag) {
        return (
          <span>
            {text}
            <span className="aek-red">( 已逾期 )</span>
          </span>
        )
      }
      return text
    },
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    // render: (_, { formId }) => <a onClick={() => payMoney([formId])}>还款</a>,
    render: (_, { formId }) => (
      <Link className="aek-link" to={`/financeLoan/repayLoan/repayApplyDetail/${formId}`}>
        还款
      </Link>
    ),
  },
]
const formData = [
  {
    field: 'loanTimeRangeType',
    component: {
      name: 'Select',
      props: {
        optionLabelProp: 'title',
        children: getOption(
          [
            {
              id: null,
              name: '全部',
            },
            {
              id: '1',
              name: '近一个星期内',
            },
            {
              id: '2',
              name: '近一个月内',
            },
            {
              id: '3',
              name: '近两个月内',
            },
            {
              id: '4',
              name: '两个月以上',
            },
          ],
          { prefix: '贷款时间' },
        ),
      },
    },
    options: {
      initialValue: null,
    },
  },
  {
    field: 'loanExpireTimeRangeType',
    component: {
      name: 'Select',
      props: {
        optionLabelProp: 'title',
        children: getOption(
          [
            {
              id: null,
              name: '全部',
            },
            {
              id: '5',
              name: '已逾期',
            },
            {
              id: '1',
              name: '一周内还款',
            },
            {
              id: '2',
              name: '一个月内还款',
            },
            {
              id: '3',
              name: '近两个月内',
            },
            {
              id: '4',
              name: '两个月以上',
            },
          ],
          { prefix: '贷款到期时间' },
        ),
      },
    },
    options: {
      initialValue: null,
    },
  },
  {
    field: 'keywords',
    component: {
      name: 'Input',
      props: {
        placeholder: '支付申请单号',
      },
    },
  },
]
export default {
  genColumns,
  formData,
}
