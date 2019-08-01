import React from 'react'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import { Link } from 'dva/router'

import { getBasicFn, getPagination } from '../../../utils'
import { NO_LABEL_LAYOUT } from '../../../utils/constant'

import Breadcrumb from '../../../components/Breadcrumb'
import SearchForm from '../../../components/SearchFormFilter'

const propTypes = {
  certificatePush: PropTypes.object,
  loading: PropTypes.object,
}
const namespace = 'certificatePush'
const CertificatePush = ({ certificatePush, loading }) => {
  const { searchSaveParams, data, pagination } = certificatePush
  const { dispatchAction, getLoading } = getBasicFn({ namespace, loading })
  const searchHandlder = (value) => {
    dispatchAction({ type: 'updateState', payload: { searchSaveParams: value } })
    const customerOrgId = value.customerOrgId && value.customerOrgId.key
    dispatchAction({ type: 'updateState', payload: { searchParams: { ...value, customerOrgId } } })
    dispatchAction({ type: 'getData', payload: { ...value, customerOrgId, current: 1 } })
  }
  const pageChange = (current, pageSize) => {
    dispatchAction({ type: 'getData', payload: { current, pageSize } })
  }
  const searhProps = {
    initialValues: searchSaveParams,
    formData: [
      {
        layout: NO_LABEL_LAYOUT,
        field: 'customerOrgId',
        width: 220,
        options: {
          initialValue: undefined,
        },
        component: {
          name: 'LkcSelect',
          props: {
            url: '/contacts/options/customers',
            optionConfig: { idStr: 'customerOrgId', nameStr: 'customerOrgName' },
            placeholder: '选择客户名称',
          },
        },
      },
    ],
    onSearch: searchHandlder,
  }
  const tableColumns = [
    {
      title: '序号',
      key: 'index',
      className: 'aek-text-center',
      width: 50,
      render: (value, row, index) => index + 1,
    },
    {
      title: '客户名称',
      dataIndex: 'customerOrgName',
    },
    {
      title: '待审核',
      dataIndex: 'pendingReviewNumber',
    },
    {
      title: '待主任审核',
      dataIndex: 'secondReviewNumber',
    },
    {
      title: '已拒绝',
      dataIndex: 'refusedNumber',
    },
    {
      title: '已通过',
      dataIndex: 'acceptNumber',
    },
    {
      title: '已撤销',
      dataIndex: 'cancelNumber',
    },
    {
      title: '操作',
      key: 'oprate',
      width: 200,
      render: (item, row) => (
        <Link to={`/newCredentials/certificatePush/detail/${row.customerOrgId}`}>查看推送情况</Link>
      ),
    },
  ]
  const tableProps = {
    bordered: true,
    rowKey: 'customerOrgId',
    loading: getLoading('getData'),
    columns: tableColumns,
    pagination: getPagination(pageChange, pagination),
    dataSource: data,
  }
  return (
    <div className="aek-layout">
      <div className="bread">
        <Breadcrumb />
      </div>
      <div className="content">
        <SearchForm {...searhProps} />
        <Table {...tableProps} />
      </div>
    </div>
  )
}

CertificatePush.propTypes = propTypes
export default connect(({ certificatePush, loading }) => ({ certificatePush, loading }))(
  CertificatePush,
)
