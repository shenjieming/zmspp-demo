import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Table, Input, Form, Spin, Row, Col } from 'antd'
import Decimal from 'decimal.js-light'

import Apanel from '../../../components/APanel'
import { formatNum } from '../../../utils'

const FormItem = Form.Item
const ConfirmModal = ({
  visible,
  dataList,
  loading,
  hideHandler,
  okHandler,
  form: { getFieldDecorator, validateFields, resetFields },
}) => {
  const modalOpts = {
    title: '预览过票采购单',
    visible,
    onCancel: () => {
      resetFields()
      hideHandler()
    },
    onOk: () => {
      validateFields((errors, values) => {
        if (errors) {
          return
        }
        okHandler(values)
      })
    },
    okText: '提交采购单',
    width: 1100,
    wrapClassName: 'aek-modal',
  }
  const columns = [
    {
      title: '物资名称',
      dataIndex: 'materialsName',
    },
    {
      title: '规格型号',
      dataIndex: 'materialsSku',
    },
    {
      title: '厂家/注册证',
      dataIndex: 'certificateNo',
      render: (value, record) => (
        <div>
          <div>{record.factoryName}</div>
          <div>{record.certificateNo}</div>
        </div>
      ),
    },
    {
      title: '采购数量',
      dataIndex: 'purchaseQty',
    },
    {
      title: '单位',
      dataIndex: 'skuUnitText',
    },
    {
      title: '单价',
      dataIndex: 'distributorPrice',
      className: 'aek-text-right',
      render: text => `￥${text}`,
    },
    {
      title: '金额',
      key: 'materialsAmount',
      className: 'aek-text-right',
      render: (text, row) => formatNum(new Decimal(row.distributorPrice).times(row.purchaseQty)),
    },
  ]
  let allTotalPsc = 0
  let allTotalQty = 0
  let allTotalAmount = 0
  const content = dataList.map((distributorUnit) => {
    const titleContent = (
      <span>
        <span style={{ marginRight: '40px' }}>{distributorUnit.distributorOrgName}</span>
        <span>
          {distributorUnit.contactName}-{distributorUnit.contactPhone}
        </span>
      </span>
    )
    const totalPsc = distributorUnit.orderItems.length
    let totalQty = 0
    let totalAmount = 0
    distributorUnit.orderItems.every((item) => {
      totalQty += item.purchaseQty
      totalAmount += Number(new Decimal(item.distributorPrice).times(item.purchaseQty))
      return true
    })
    allTotalPsc += totalPsc
    allTotalQty += totalQty
    allTotalAmount += totalAmount
    totalAmount = formatNum(totalAmount)
    return (
      <Apanel key={distributorUnit.distributorOrgId} title={titleContent}>
        <Table
          bordered
          rowKey="pscId"
          pagination={false}
          columns={columns}
          dataSource={distributorUnit.orderItems}
        />
        <FormItem style={{ marginTop: '10px', marginBottom: '10px' }}>
          {getFieldDecorator(`${distributorUnit.distributorOrgId}`, {
            initialValue: distributorUnit.purchaseRemark,
          })(<Input placeholder="备注" />)}
        </FormItem>
        <div style={{ textAlign: 'right' }}>
          <span style={{ marginLeft: '20px' }}>合计品规：{totalPsc}</span>
          <span style={{ marginLeft: '20px' }}>合计数量：{totalQty}</span>
          <span style={{ marginLeft: '20px' }}>合计金额：{totalAmount}</span>
        </div>
      </Apanel>
    )
  })
  return (
    <Modal {...modalOpts}>
      <Spin spinning={loading}>
        {content}
        <div style={{ textAlign: 'right', marginTop: '10px' }}>
          <div>
            合计品规：<span className="aek-red" style={{ marginLeft: '5px' }}>
              {allTotalPsc}
            </span>
          </div>
          <div>
            合计数量：<span className="aek-red" style={{ marginLeft: '5px' }}>
              {allTotalQty}
            </span>
          </div>
          <div>
            合计金额：<span className="aek-red" style={{ marginLeft: '5px' }}>
              {formatNum(allTotalAmount)}
            </span>
          </div>
        </div>
      </Spin>
    </Modal>
  )
}

ConfirmModal.propTypes = {
  okHandler: PropTypes.func,
  loading: PropTypes.bool,
  hideHandler: PropTypes.func,
  dataList: PropTypes.array,
  visible: PropTypes.bool,
  form: PropTypes.object,
}

export default Form.create()(ConfirmModal)
