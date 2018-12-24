import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Spin, Button, Table, Alert } from 'antd'

const BatchCancelCatalog = ({
  effects,
  batchCancelModalVisible,
  batchDataList,
  handleCancel,
}) => {
  const addModalProp = {
    title: '撤销提醒',
    visible: batchCancelModalVisible,
    maskClosable: false,
    wrapClassName: 'aek-modal',
    afterClose() {
      handleCancel()
    },
    onCancel() {
      handleCancel()
    },
    footer: [
      <Button
        key="back"
        type="primary"
        onClick={() => {
          handleCancel()
        }}
      >
      确定
      </Button>,
    ],
  }


  const columns = [{
    title: '物资名称',
    key: 'materialsName',
    dataIndex: 'materialsName',
  }, {
    title: '规格型号',
    key: 'materialsSku',
    dataIndex: 'materialsSku',
  }, {
    title: '注册证',
    key: 'supplierCertificateNo',
    dataIndex: 'supplierCertificateNo',
  }]


  const tableProps = {
    columns,
    dataSource: batchDataList,
    pagination: false,
  }

  return (
    <Modal {...addModalProp} >
      <Spin spinning={!!effects['dictionSelect/setDictionAddData']}>
        <Alert
          message="存在如下物料已被审核或者撤销，无法继续操作，其他物料均已撤销。"
          type="warning"
          showIcon
        />
        <Table
          {...tableProps}
        />
      </Spin>
    </Modal>
  )
}
BatchCancelCatalog.propTypes = {
  dispatch: PropTypes.func,
  effects: PropTypes.object,
  batchCancelModalVisible: PropTypes.bool,
  batchDataList: PropTypes.array,
  handleCancel: PropTypes.func,
}
export default BatchCancelCatalog
