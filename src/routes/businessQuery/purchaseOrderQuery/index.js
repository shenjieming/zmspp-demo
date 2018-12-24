import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Table } from 'antd'
import { cloneDeep } from 'lodash'
import moment from 'moment'

import Breadcrumb from '../../../components/Breadcrumb'
import SearchFormFillter from '../../../components/SearchFormFilter'
import { getBasicFn, getPagination } from '../../../utils/index'

import { formData, tableColumns } from './props'

const namespace = 'platPurchaseOrder'
const PlatPurchaseOrder = ({ platPurchaseOrder, loading, routes }) => {
  const { dispatchAction, getLoading } = getBasicFn({ namespace, loading })
  const { orderList, searchParams, pagination } = platPurchaseOrder
  const formatDate = (date) => {
    const result = date.map(item => item.format('YYYY-MM-DD'))
    return result.toString() ? result.toString() : null
  }
  // 翻页
  const pageChange = (current, pageSize) => {
    dispatchAction({ type: 'pageChange', payload: { current, pageSize } })
  }
  // 搜索
  const searchHandler = (value) => {
    const param = cloneDeep(value)
    param.purchaseTime = param.purchaseTime && formatDate(param.purchaseTime)
    dispatchAction({ type: 'searchOrder', payload: { ...param } }).then(() => {
      dispatchAction({ payload: { searchParams: param } })
    })
  }
  const initialValues = cloneDeep(searchParams)
  if (searchParams.purchaseTime) {
    const [startDate, endDate] = searchParams.purchaseTime.split(',')
    initialValues.purchaseTime = [
      moment(startDate, 'YYYY-MM-DD'),
      moment(endDate, 'YYYY/MM/DD'),
    ]
  }
  // 搜索参数
  const searchParam = {
    initialValues,
    components: formData,
    onSearch: searchHandler,
  }
  return (
    <div className="aek-layout">
      <div className="bread">
        <Breadcrumb routes={routes} />
      </div>
      <div className="content">
        <SearchFormFillter {...searchParam} />
        <Table
          bordered
          rowKey="formId"
          loading={getLoading('orderList', 'searchOrder', 'pageChange')}
          columns={tableColumns}
          pagination={getPagination(pageChange, pagination)}
          dataSource={orderList}
        />
      </div>
    </div>
  )
}

PlatPurchaseOrder.propTypes = {
  children: PropTypes.node,
  platPurchaseOrder: PropTypes.object,
  loading: PropTypes.object,
  dispatch: PropTypes.func,
  routes: PropTypes.array,
}
export default connect(({ platPurchaseOrder, loading }) => ({
  platPurchaseOrder,
  loading,
}))(PlatPurchaseOrder)
