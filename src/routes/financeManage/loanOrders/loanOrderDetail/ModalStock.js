import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Table } from 'antd'
import { modalColumns } from './data'
import { getPagination } from '../../../../utils'

const propTypes = {
  stockModalVisible: PropTypes.bool,
  loading: PropTypes.bool,
  modalList: PropTypes.array,
  onCancel: PropTypes.func,
  pageChange: PropTypes.func,
  pageConfig: PropTypes.object,
}

const ModalStock = ({
  stockModalVisible,
  loading,
  onCancel,
  modalList,
  pageChange,
  pageConfig,
}) => {
  const modalProps = {
    title: '入库单明细',
    visible: stockModalVisible,
    maskClosable: false,
    footer: null,
    onCancel,
    wrapClassName: 'aek-modal',
    width: 1000,
  }
  const tableProps = {
    loading,
    dataSource: modalList || [],
    rowKey: 'stockInItemId',
    bordered: true,
    columns: modalColumns,
    pagination: getPagination(pageChange, pageConfig),
  }
  return (
    <Modal {...modalProps}>
      <Table {...tableProps} />
    </Modal>
  )
}

ModalStock.propTypes = propTypes

export default ModalStock
