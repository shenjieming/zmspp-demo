import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Alert, Input, Table } from 'antd'
import { getModalColumns } from './data'

const propTypes = {
  modalVisible: PropTypes.bool,
  loading: PropTypes.bool,
  customerName: PropTypes.string,
  modalType: PropTypes.string,
  onCancel: PropTypes.func,
  onSearch: PropTypes.func,
  afterClose: PropTypes.func,
  addForModal: PropTypes.func,
  modalTableData: PropTypes.array,
  modalInitValue: PropTypes.object,
  form: PropTypes.object,
}

const ModalAdd = ({
  modalVisible,
  customerName,
  modalType,
  loading,
  onCancel,
  onSearch,
  modalTableData,
  afterClose,
  addForModal,
}) => {
  const getAlter = () => {
    if (modalType === 'right') {
      const alertProps = {
        banner: true,
        type: 'info',
        showIcon: false,
        style: { marginBottom: 16 },
        description: '您可以选择与您有往来关系的供应商成为该客户的配送商，后续该客户的订单可直接分发至配送商进行配送。如果您在列表中未找到所需要的配送商，请前往“往来管理 > 我的供应商”中查看，是否需要与该配送商建立供应关系。',
      }
      return <Alert {...alertProps} />
    }
    return null
  }
  const getTitle = () => {
    if (customerName) {
      return `添加 ${customerName} 的配送商`
    }
    return '添加需要分销的客户'
  }
  const modalOpts = {
    title: getTitle(),
    visible: modalVisible,
    wrapClassName: 'aek-modal',
    maskClosable: false,
    footer: null,
    onCancel,
    afterClose,
  }
  const tableProps = {
    loading,
    showHeader: false,
    pagination: false,
    dataSource: modalTableData || [],
    rowKey: 'orgId',
    columns: getModalColumns((orgId) => {
      addForModal(orgId)
    }),
  }
  return (
    <Modal {...modalOpts}>
      {getAlter()}
      <Input.Search
        placeholder={`请输入${modalType === 'left' ? '客户' : '公司'}名称进行检索`}
        style={{ marginBottom: 16 }}
        onSearch={onSearch}
      />
      <Table {...tableProps} />
    </Modal>
  )
}

ModalAdd.propTypes = propTypes

export default ModalAdd
