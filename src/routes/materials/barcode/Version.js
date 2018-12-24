import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Table, Button, Alert } from 'antd'
import { getPagination } from '../../../utils'

const propTypes = {
  visible: PropTypes.bool.isRequired,
  viewDetail: PropTypes.func.isRequired,
  dataSource: PropTypes.array.isRequired,
  onCancel: PropTypes.func.isRequired,
  tablePagination: PropTypes.object.isRequired,
  pageChange: PropTypes.func.isRequired,
  tableLoading: PropTypes.bool.isRequired,
  compareClick: PropTypes.func.isRequired,
  selectedKeysChange: PropTypes.func.isRequired,
  selectedKeys: PropTypes.array.isRequired,
}

class Version extends React.Component {
  getColumns = () => [
    {
      title: '版本号',
      key: 'barcodeRuleVersionCode',
      dataIndex: 'barcodeRuleVersionCode',
    },
    {
      title: '上传时间',
      key: 'lastEditTime',
      dataIndex: 'lastEditTime',
    },
    {
      title: '修改人',
      key: 'lastEditName',
      dataIndex: 'lastEditName',
    },
    {
      title: '审核人',
      dataIndex: 'barcodeRuleReviewName',
    },
    {
      title: '审核时间',
      dataIndex: 'barcodeRuleReviewTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, row) => <a onClick={() => this.props.viewDetail(row)}>查看</a>,
      className: 'aek-text-center',
    },
  ]

  render() {
    const props = this.props
    const selectedKeys = props.selectedKeys

    const modalProps = {
      title: '修改历史',
      visible: props.visible,
      onCancel: props.onCancel,
      maskClosable: false,
      footer: (
        <Button
          disabled={selectedKeys.length !== 2}
          size="large"
          type="primary"
          onClick={props.compareClick}
        >
          版本对比
        </Button>
      ),
      width: 700,
      wrapClassName: 'aek-modal',
    }

    const tableProps = {
      rowKey: 'barcodeRuleVersionId',
      columns: this.getColumns(),
      dataSource: props.dataSource,
      bordered: true,
      pagination: getPagination((current, pageSize) => {
        props.pageChange(current, pageSize)
      }, props.tablePagination),
      rowSelection: {
        onChange: props.selectedKeysChange,
        selectedRowKeys: selectedKeys,
      },
      loading: props.tableLoading,
      className: 'aek-table-no-allcheck',
    }

    return (
      <Modal {...modalProps}>
        <Alert message="可选择其中两个版本进行对比" type="info" showIcon className="aek-mb15" />
        <Table {...tableProps} />
      </Modal>
    )
  }
}

Version.propTypes = propTypes

export default Version
