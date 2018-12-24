import React from 'react'
import PropTypes from 'prop-types'
import { Button, Row, Col, Table } from 'antd'
import { columns } from './data'

const InfoTable = ({
  addItem,
  update,
  tableData,
  tableLoading,
}) => (
  <div>
    <Row style={{ marginBottom: 24, marginTop: 40 }}>
      <Col style={{ fontSize: 17, color: '#444' }} span={6}>功能</Col>
      <Col style={{ textAlign: 'right' }} span={6} offset={12}>
        <Button type="primary" onClick={addItem}>添加功能</Button>
      </Col>
    </Row>
    <Table
      bordered
      loading={tableLoading}
      dataSource={tableData}
      columns={columns(update)}
      pagination={false}
      simple
    />
  </div>
)
InfoTable.propTypes = {
  tableLoading: PropTypes.bool,
  tableData: PropTypes.array,
  addItem: PropTypes.func,
  update: PropTypes.func,
}

export default InfoTable
