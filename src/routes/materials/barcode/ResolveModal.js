import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Input, Table } from 'antd'

const columns = [
  {
    title: '条码',
    key: 'barcode',
    dataIndex: 'barcode',
  },
  {
    title: '长度',
    key: 'barcodeLength',
    dataIndex: 'barcodeLength',
  },
  {
    title: '前导符',
    key: 'barcodePrefix',
    dataIndex: 'barcodePrefix',
  },
  {
    title: '特征码1',
    key: 'feature1Content',
    dataIndex: 'feature1Content',
  },
  {
    title: '特征码2',
    key: 'feature2Content',
    dataIndex: 'feature2Content',
  },
  {
    title: '特征码3',
    key: 'feature3Content',
    dataIndex: 'feature3Content',
  },
  {
    title: '特征码4',
    key: 'feature4Content',
    dataIndex: 'feature4Content',
  },
  {
    title: '条码类型',
    key: 'barcodeType',
    dataIndex: 'barcodeType',
    render: (text) => {
      if (text === 1) {
        return '主码'
      } else if (text === 2) {
        return '副码'
      }
      return ''
    },
  },
  {
    title: '物资编码',
    key: 'materialsCode',
    dataIndex: 'materialsCode',
  },
  {
    title: '物资名称',
    key: 'materialsName',
    dataIndex: 'materialsName',
  },
  {
    title: '规格型号',
    key: 'materialsSku',
    dataIndex: 'materialsSku',
  },
  {
    title: '有效期',
    key: 'expiredDate',
    dataIndex: 'expiredDate',
  },
  {
    title: '跟踪码',
    key: 'trackCode',
    dataIndex: 'trackCode',
  },
  {
    title: '生产批号',
    key: 'batchNo',
    dataIndex: 'batchNo',
  },
]

let searchInput = null

function ResolveModal(props) {
  const tableProps = {
    bordered: true,
    columns,
    dataSource: props.dataSource,
    pagination: false,
    rowKey: (_, i) => i,
    loading: props.tableLoading,
  }

  const modalProps = {
    maskClosable: false,
    visible: props.visible,
    title: '条码解析',
    onCancel: props.onCancel,
    width: 1366,
    footer: null,
  }

  return (
    <Modal {...modalProps}>
      {props.visible ? (
        <Input.Search
          size="large"
          defaultValue=""
          style={{
            width: 400,
            margin: '0 0 10px',
          }}
          onSearch={(value) => {
            props.onSearch(value).then(() => {
              const input = searchInput.input.refs.input
              input.value = ''
              input.focus()
            })
          }}
          placeholder="请输入条码"
          ref={(node) => {
            searchInput = node
          }}
        />
      ) : (
        ''
      )}
      <Table {...tableProps} />
    </Modal>
  )
}

ResolveModal.propTypes = {
  onSearch: PropTypes.func.isRequired,
  dataSource: PropTypes.array.isRequired,
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  tableLoading: PropTypes.bool.isRequired,
}

export default ResolveModal
