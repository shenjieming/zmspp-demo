import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Link } from 'dva/router'
import { cloneDeep } from 'lodash'
import { Table, Select, Input } from 'antd'

import { getBasicFn, getPagination } from '../../../utils'
import { SALE_TYPE, MANAGE_MODEL, NO_LABEL_LAYOUT } from '../../../utils/constant'
import Breadcrumb from '../../../components/Breadcrumb'
import SearchFormFilter from '../../../components/SearchFormFilter'
import LkcSelect from '../../../components/LkcSelect'

const propTypes = {
  distributeList: PropTypes.object,
  loading: PropTypes.object,
  orderDistribute: PropTypes.object,
}
const namespace = 'distributeList'
const DistributeList = ({ loading, distributeList }) => {
  const { dispatchAction, getLoading } = getBasicFn({ namespace, loading })
  const { data, pagination, searchSaveParams } = distributeList
  const pageChange = (current, pageSize) => {
    dispatchAction({ type: 'getOrderList', payload: { current, pageSize } })
  }
  const searchHandler = (value) => {
    dispatchAction({ payload: { searchSaveParams: value } })
    const params = cloneDeep(value)
    params.customerOrgId = params.customerOrgId && params.customerOrgId.key
    dispatchAction({ type: 'search', payload: { ...params } })
  }
  const searchParam = {
    initialValues: searchSaveParams,
    components: [
      {
        layout: NO_LABEL_LAYOUT,
        field: 'customerOrgId',
        width: 220,
        options: {
          initialValue: undefined,
        },
        component: (
          <LkcSelect
            url="/distribute/customer/option-list"
            optionConfig={{
              idStr: 'customerOrgId',
              nameStr: 'customerOrgName',
            }}
            placeholder="请选择客户"
          />
        ),
      },
      {
        layout: NO_LABEL_LAYOUT,
        field: 'keywords',
        width: 220,
        options: {
          initialValue: null,
        },
        component: <Input placeholder="订单编号" />,
      },
    ],
    onSearch: (value) => {
      searchHandler(value)
    },
  }
  const columns = [
    {
      title: '序号',
      key: 'index',
      className: 'aek-text-center',
      width: 50,
      render: (value, row, index) => index + 1,
    },
    {
      title: '订单编号',
      dataIndex: 'formNo',
      render: (_, row) => (
        <Link
          className="aek-link"
          to={`/orderManage/customerOrder/detail/${row.formId}`}
          target="_blank"
        >
          {row.formNo}
        </Link>
      ),
    },
    {
      title: '订单类型',
      key: 'type',
      className: 'aek-text-center',
      render: (_, record) => {
        const saleType = SALE_TYPE[record.saleType]
        const formType = MANAGE_MODEL[record.formType]
        return `${saleType}-${formType}`
      },
    },
    {
      title: '采购单位',
      dataIndex: 'customerOrgName',
    },
    {
      title: '采购时间',
      dataIndex: 'purchaseTime',
    },
    {
      title: '金额',
      dataIndex: 'formAmount',
      className: 'aek-text-right',
      render: text => `￥${text}`,
    },
    {
      title: '操作',
      key: 'operation',
      className: 'aek-text-center',
      render: (_, row) => (
        <Link
          className="aek-link"
          to={`/distributeManage/orderDistribute/distribute/${row.formId}`}
        >
          分发
        </Link>
      ),
    },
  ]
  return (
    <div className="aek-layout">
      <div className="bread">
        <Breadcrumb />
      </div>
      <div className="content">
        <SearchFormFilter {...searchParam} />
        <Table
          bordered
          rowKey="formId"
          loading={getLoading('getOrderList', 'search')}
          columns={columns}
          pagination={getPagination(pageChange, pagination)}
          dataSource={data}
        />
      </div>
    </div>
  )
}
DistributeList.propTypes = propTypes
export default connect(({ loading, distributeList }) => ({ loading, distributeList }))(
  DistributeList,
)
