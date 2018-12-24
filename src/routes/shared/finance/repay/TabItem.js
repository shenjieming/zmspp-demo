import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'dva/router'
import { Table } from 'antd'
import { SearchFormFilter } from '../../../../components'
import { getOption } from '../../../../utils'

const repayStatusText = {
  1: '还款申请中',
  2: '申请失败',
  3: '还款成功',
  4: '还款失败',
}
const propTypes = {
  dataSource: PropTypes.array,
  pagination: PropTypes.object,
  loading: PropTypes.bool,
  initialValues: PropTypes.object,
  onSearch: PropTypes.func,
  type: PropTypes.string, // 'supplier' 'bank' 'manage'
}
const ItemTable = ({
  type = 'manage',
  loading,
  pagination,
  dataSource,
  initialValues,
  onSearch,
}) => {
  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      className: 'aek-text-center',
      render: (text, _, idx) => idx + 1,
    },
    {
      title: '还款时间',
      dataIndex: 'repayTime',
      key: 'repayTime',
    },
    {
      title: '还款申请编号',
      dataIndex: 'formNo',
      key: 'formNo',
    },
    {
      title: '还款本金',
      dataIndex: 'loanAmount',
      key: 'loanAmount',
      render: (text, { formStatus, repayAmount, interestAmount }) => {
        if (formStatus !== 1) {
          return (
            <span>
              {text} （总还款金额{repayAmount} 利息{interestAmount}）
            </span>
          )
        }
        return text
      },
    },
    {
      title: '状态',
      dataIndex: 'formStatus',
      key: 'formStatus',
      render: text => text && repayStatusText[text],
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      className: 'aek-text-center',
      render: (text, { formId }) => {
        // 供应商
        if (type === 'supplier') {
          return (
            <Link className="aek-link" to={`/financeLoan/repayLoan/repayLoanDetail/${formId}`}>
              明细
            </Link>
          )
        }
        // 银行
        if (type === 'bank') {
          return (
            <Link className="aek-link" to={`/financeAudit/repayAudit/repayAuditDetail/${formId}`}>
              明细
            </Link>
          )
        }
        // 运营后台
        if (type === 'manage') {
          return (
            <Link
              className="aek-link"
              to={`/financeManage/repayManage/repayManageDetail/${formId}`}
            >
              明细
            </Link>
          )
        }
        return ''
      },
    },
  ]
  const formData = [
    {
      field: 'repayTimeRangeType',
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
                id: '5',
                name: '两个月以上',
              },
            ],
            { prefix: '还款时间' },
          ),
        },
      },
      options: {
        initialValue: null,
      },
    },
    {
      exclude: type !== 'supplier',
      field: 'formStatus',
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
                name: '申请中',
              },
              {
                id: '4',
                name: '还款失败',
              },
              {
                id: '3',
                name: '还款成功',
              },
            ],
            { prefix: '还款状态' },
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
          placeholder: '还款申请编号',
        },
      },
    },
  ].filter(({ exclude }) => !exclude)
  const tableParam = {
    loading,
    columns,
    dataSource,
    pagination,
    rowKey: 'formId',
    // scroll: { x: 1100 },
    bordered: true,
  }
  const searchParams = {
    initialValues,
    onSearch,
    formData,
  }
  return (
    <div>
      <SearchFormFilter {...searchParams} />
      <Table {...tableParam} />
    </div>
  )
}
ItemTable.propTypes = propTypes
export default ItemTable
