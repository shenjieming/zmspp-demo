import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'

const propTypes = {
  rows: PropTypes.array,
  dataSource: PropTypes.array,
  tableProps: PropTypes.object,
  columns: PropTypes.array,
  titleRender: PropTypes.func,
  loading: PropTypes.bool,
}

function RowTable({
  rows,
  dataSource,
  loading,
  tableProps,
  columns = [],
  titleRender = (item, index) => index,
}) {
  const getColumns = () => {
    const firstCol = {
      title: '字段',
      dataIndex: 'title',
      key: 'title',
      className: 'aek-bg-columns',
      ...columns[0],
    }
    const mainCol = dataSource.map((item, index) => ({
      title: titleRender(item, index),
      dataIndex: `ORDER_${index}`,
      key: `ORDER_${index}`,
      className: 'aek-text-center',
      ...columns[index + 1],
    }))
    return [firstCol].concat(mainCol)
  }
  const getDataSource = () => rows.map((item) => {
    const data = {}
    const render = item.render || (_ => _)
    dataSource.forEach((itm, idx) => {
      data[`ORDER_${idx}`] = render(itm[item.dataIndex], itm)
    })
    return {
      title: item.title,
      ...data,
    }
  })
  const tableParam = {
    columns: getColumns(),
    dataSource: getDataSource(),
    loading,
    pagination: false,
    bordered: true,
    size: 'small',
    rowKey: (record, idx) => idx,
    ...tableProps,
  }
  return <Table {...tableParam} />
}
RowTable.propTypes = propTypes
export default RowTable
