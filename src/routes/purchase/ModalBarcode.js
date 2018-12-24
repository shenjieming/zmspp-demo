import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Table } from 'antd'

const propTypes = {
  barcodeVisible: PropTypes.bool,
  loading: PropTypes.bool,
  toAction: PropTypes.func,
  barcodeList: PropTypes.array,
}

const ModalBarcode = ({ barcodeVisible, loading, toAction, barcodeList }) => {
  const modalOpts = {
    title: '条码查看',
    visible: barcodeVisible,
    maskClosable: true,
    onCancel() {
      toAction({ barcodeVisible: false })
    },
    wrapClassName: 'aek-modal',
    footer: false,
  }
  const columns = [
    {
      key: 'index',
      dataIndex: 'index',
      title: '序号',
      className: 'aek-text-center',
      width: 50,
      render: (value, record, index) => index + 1,
    },
    {
      title: '条码',
      key: 'barcode',
      dataIndex: 'barcode',
    },
    {
      title: '物资码',
      key: 'materialsSkuBarcode',
      dataIndex: 'materialsSkuBarcode',
    },
  ]
  const tableProps = {
    loading,
    dataSource: barcodeList || [],
    rowKey: 'id',
    bordered: true,
    columns,
    pagination: false,
  }
  return (
    <Modal {...modalOpts}>
      <Table {...tableProps} />
    </Modal>
  )
}

ModalBarcode.propTypes = propTypes

export default Form.create()(ModalBarcode)
