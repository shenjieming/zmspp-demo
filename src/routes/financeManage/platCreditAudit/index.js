import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Table, Input } from 'antd'
import { Link } from 'dva/router'

import { getBasicFn, getPagination } from '../../../utils/index'
import { NO_LABEL_LAYOUT } from '../../../utils/constant'
import { Breadcrumb, SearchFormFilter, LkcSelect } from '../../../components'

const namespace = 'platCreditAudit'
const propTypes = {
  platCreditAudit: PropTypes.object,
  loading: PropTypes.object,
}
const PlatCreditAudit = ({ platCreditAudit, loading }) => {
  const { dispatchAction, getLoading } = getBasicFn({ namespace, loading })
  const { data, searchParam, pagination } = platCreditAudit
  // dispachAction
  const pageChange = (current, pageSize) => {
    const searchPayload = {
      ...searchParam,
      applyOrgId: searchParam.applyOrgId && searchParam.applyOrgId.key,
    }
    dispatchAction({ type: 'pageChange', payload: { ...searchPayload, current, pageSize } })
  }
  const searchHandler = (values) => {
    dispatchAction({ type: 'searchLoan', payload: values })
  }
  // 搜索参数
  const searchParams = {
    initialValues: searchParam,
    components: [
      {
        layout: NO_LABEL_LAYOUT,
        field: 'keywords',
        width: 220,
        options: {
          initialValue: null,
        },
        component: <Input placeholder="法定代表人/联系电话" />,
      },
      {
        layout: NO_LABEL_LAYOUT,
        field: 'applyOrgId',
        width: 220,
        options: {
          initialValue: null,
        },
        component: (
          <LkcSelect
            url="/finance/loan-mgmt/loan-apply-org/list-option"
            optionConfig={{ idStr: 'key', nameStr: 'label' }}
            placeholder="签约机构"
          />
        ),
      },
    ],
    onSearch: searchHandler,
  }
  // 列表参数
  const tableParam = {
    columns: [
      {
        title: '序号',
        key: 'index',
        width: '50px',
        className: 'aek-text-center',
        render: (text, record, index) => index + 1,
      },
      {
        title: '授信机构',
        dataIndex: 'applyOrgName',
      },
      {
        title: '法人',
        dataIndex: 'legalName',
      },
      {
        title: '联系电话',
        dataIndex: 'legalMobile',
      },
      {
        title: '提交时间',
        dataIndex: 'submitDate',
        className: 'aek-text-center',
      },
      {
        title: '操作',
        key: 'oprate',
        className: 'aek-text-center',
        render: (text, record) => (
          <span>
            <Link to={`/financeManage/platCreditAudit/detail/${record.creditId}`}>查看</Link>
          </span>
        ),
      },
    ],
    bordered: true,
    dataSource: data,
    rowKey: 'creditId',
    loading: getLoading('queryData', 'searchLoan', 'pageChange'),
    pagination: getPagination(pageChange, pagination),
  }
  return (
    <div className="aek-layout">
      <div className="bread">
        <Breadcrumb />
      </div>
      <div className="content">
        <SearchFormFilter {...searchParams} />
        <Table {...tableParam} />
      </div>
    </div>
  )
}

PlatCreditAudit.propTypes = propTypes
export default connect(({ platCreditAudit, loading }) => ({ platCreditAudit, loading }))(
  PlatCreditAudit,
)
