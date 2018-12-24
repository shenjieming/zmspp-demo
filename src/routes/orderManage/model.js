import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Spin, Table } from 'antd'

const propTypes = {
  modalVisible: PropTypes.bool,
  onCancel: PropTypes.func,
  tableList: PropTypes.array,
  spin: PropTypes.bool,
}
const PrintModal = ({
  onCancel,
  modalVisible: visible,
  tableList,
  spin,
}) => {
  const modalOpts = {
    title: '条码绑定的物资',
    visible,
    wrapClassName: 'aek-modal',
    width: 550,
    maskClosable: false,
    footer: null,
    zIndex: 1100,
    onCancel,
    onOk() {
      onCancel()
    },
    afterClose: onCancel,
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
      key: 'materialsName',
      dataIndex: 'materialsName',
      title: '物资名称',
    },
    {
      key: 'materialsUnitText',
      dataIndex: 'materialsUnitText',
      title: '单位/规格型号',
      render: (value, record) => <span>{value}/{record.materialsSku}</span>,
    },
  ]
  return (<Modal {...modalOpts}>
    <Spin spinning={spin}>
      <p className="aek-mtb10">请至“供货目录”找到该物资，删除其中一个条码，再重新扫码！</p>
      <Table
        style={{ marginTop: '20px' }}
        columns={columns}
        pagination={false}
        dataSource={tableList}
        rowKey="barcode"
      />
    </Spin>
  </Modal>)
}

PrintModal.propTypes = propTypes

export default PrintModal
