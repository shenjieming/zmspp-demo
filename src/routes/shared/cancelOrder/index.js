import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import { cloneDeep, pick } from 'lodash'

import Breadcrumb from '../../../components/Breadcrumb'
import SearchFormFillter from '../../../components/SearchFormFilter'
import { getBasicFn } from '../../../utils/index'

import { formData, tableColumns } from './props'

const CancelOrderList = ({ namespace, orderListBean, loading }) => {
  const { dispatchAction, getLoading } = getBasicFn({ namespace, loading })
  const { orderList, searchParams, pagination } = orderListBean
  const pageChange = (page, filters, sorter) => {
    // 处理pagination
    const pageParam = pick(page, ['current', 'pageSize', 'total'])
    // 处理sort
    const { columnKey, order } = sorter
    const value = {
      descend: 2,
      ascend: 1,
    }
    let reqSort = {}
    if (Object.keys(sorter).length) {
      reqSort = {
        sortBy: columnKey,
        sortValue: value[order],
      }
    }
    dispatchAction({ type: 'pageChange', payload: { pagination: pageParam, sorter: reqSort } })
  }
  // 搜索
  const searchHandler = (value) => {
    const param = cloneDeep(value)
    param.keywords = param.keywords && param.keywords.trim()
    param.startTime = param.timeRange && param.timeRange[0]
    param.endTime = param.timeRange && param.timeRange[1]
    delete param.timeRange
    dispatchAction({ type: 'searchOrder', payload: { ...param } })
  }
  const initialValues = cloneDeep(searchParams)
  if (initialValues.unDeliverOverDaysType) {
    initialValues.unDeliverOverDaysType = true
  }
  // 搜索参数
  const searchParam = {
    initialValues,
    components: formData(namespace),
    onSearch: searchHandler,
  }
  return (
    <div className="aek-layout">
      <div className="bread">
        <Breadcrumb />
      </div>
      <div className="content">
        <SearchFormFillter {...searchParam} />
        <Table
          bordered
          rowKey="formId"
          loading={getLoading('orderList', 'searchOrder', 'pageChange')}
          columns={tableColumns(namespace)}
          pagination={{
            current: pagination.current,
            total: pagination.total,
            pageSize: pagination.pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: total => `共有 ${total} 条数据`,
          }}
          dataSource={orderList}
          onChange={pageChange}
        />
      </div>
    </div>
  )
}

CancelOrderList.propTypes = {
  orderListBean: PropTypes.object,
  loading: PropTypes.object,
  namespace: PropTypes.string,
}
export default CancelOrderList
