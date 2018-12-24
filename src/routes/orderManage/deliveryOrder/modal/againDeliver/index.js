import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Table, Alert, Button, Spin } from 'antd'
import { noop } from 'lodash'

const propTypes = {
  visible: PropTypes.bool,
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
  detail: PropTypes.object,
  loading: PropTypes.bool,
}
const AgainDeliver = ({
  visible,
  onCancel = noop,
  onOk = noop,
  detail,
  loading,
}) => {
  const modalOpts = {
    title: '再次发货提醒',
    visible,
    wrapClassName: 'aek-modal',
    maskClosable: false,
    onCancel,
    onOk,
    afterClose: onCancel,
    okText: '继续发货',
  }

  const getAlert = () => {
    const { deliveryQtyCanOverPurchaseQtyFlag, remindStatus, customerOrgName } = detail
    let str = ''

    if (deliveryQtyCanOverPurchaseQtyFlag) {
      str = '如下物资的配送数量已经超出待发货数量，请注意'
    } else if (remindStatus === 4) {
      str = `"${customerOrgName}"不允许配送数量大于待发货数量，如下物资发货数量超出，需重新输入发货信息，其他物资发货信息可继续沿用发货。`
    } else if (remindStatus === 5) {
      str = `"${customerOrgName}"不允许配送数量大于待发货数量，当前配送单中的物资均已超出，无法使用再次发货。`
      modalOpts.footer = [
        <Button key="cancel" type="primary" onClick={onCancel}>确定</Button>,
      ]
    }
    return (
      <Alert
        message={str}
        type="warning"
        showIcon
      />
    )
  }

  const columns = [{
    title: '物资名称',
    dataIndex: 'materialsName',
  }, {
    title: '规格型号',
    dataIndex: 'materialsSku',
  }, {
    title: '待发货数量',
    dataIndex: 'waitDeliverQty',
  }, {
    title: '配送数量',
    dataIndex: 'deliverQty',
  }]

  const tableProps = {
    columns,
    dataSource: detail.items || [],
    pagination: false,
    loading: false,
    className: 'aek-mt20',
    rowKey: 'pscId',
  }

  return (
    <Modal {...modalOpts}>
      <Spin spinning={loading}>
        {getAlert()}
        <Table {...tableProps} />
      </Spin>
    </Modal>
  )
}

AgainDeliver.propTypes = propTypes

export default AgainDeliver
