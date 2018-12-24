import React from 'react'
import { Modal, Table, Button, Alert } from 'antd'
import PropTypes from 'prop-types'

const propTypes = {
  loading: PropTypes.bool,
  failedList: PropTypes.array,
  onCancel: PropTypes.func,
  repeatSend: PropTypes.func,
  visible: PropTypes.bool,
  currentDetail: PropTypes.object,
}
const FailedModal = ({ visible, onCancel, loading, failedList, repeatSend }) => {
  const modalParam = {
    title: '上传失败的明细',
    visible,
    width: 1000,
    onCancel,
    footer:
      failedList.length > 0
        ? [
          <Button
            type="primary"
            loading={loading}
            key="1"
            onClick={() => repeatSend(failedList[0].formId)}
          >
              重发
          </Button>,
        ]
        : false,
  }
  const columns = [
    {
      title: '错误原因',
      dataIndex: 'reason',
      key: 'reason',
      width: 120,
    },
    {
      title: '省标编号',
      dataIndex: 'inviteNo',
      key: 'inviteNo',
      width: 120,
    },
    {
      title: '物资名称',
      dataIndex: 'goodsName',
      key: 'goodsName',
      width: 120,
    },
    {
      title: '规格型号',
      dataIndex: 'specSize',
      key: 'specSize',
      width: 120,
    },
    {
      title: '通用名称',
      dataIndex: 'commonName',
      key: 'commonName',
      width: 120,
    },
    {
      title: '批号',
      dataIndex: 'batchNo',
      key: 'batchNo',
      width: 120,
    },
    {
      title: '效期',
      dataIndex: 'expiredDate',
      key: 'expiredDate',
      width: 120,
    },
    {
      title: '跟踪码',
      dataIndex: 'lotNo',
      key: 'lotNo',
      width: 120,
    },
    {
      title: '数量',
      dataIndex: 'stockInQty',
      key: 'stockInQty',
      width: 80,
    },
    {
      title: '单价',
      dataIndex: 'stockInPrice',
      key: 'stockInPrice',
      className: 'aek-text-right',
      width: 80,
      render: text => <span>￥ {text}</span>,
    },
    {
      title: '金额',
      dataIndex: 'itemAmount',
      key: 'itemAmount',
      width: 80,
      className: 'aek-text-right',
      render: text => <span>￥ {text}</span>,
    },
    {
      title: '发票日期',
      dataIndex: 'invoiceDate',
      key: 'invoiceDate',
      width: 120,
    },
    {
      title: '发票号码',
      dataIndex: 'invoiceNo',
      key: 'invoiceNo',
      width: 120,
    },
    {
      title: '厂家',
      dataIndex: 'factoryName',
      key: 'factoryName',
      width: 120,
    },
    {
      title: '品牌/产地',
      dataIndex: 'specBrand',
      key: 'specBrand',
      width: 120,
      render: (text, { factoryAddr }) => (
        <span>
          <p>{text || <span>&nbsp;</span>}</p>
          <p>{factoryAddr || <span>&nbsp;</span>}</p>
        </span>
      ),
    },
    {
      title: '注册证号',
      dataIndex: 'regNo',
      key: 'regNo',
      width: 100,
    },
  ]
  const tableParam = {
    loading,
    columns,
    bordered: true,
    scroll: { x: 2000, y: 360 },
    rowKey: 'id',
    dataSource: failedList,
    pagination: false,
  }
  return (
    <Modal {...modalParam}>
      <Alert
        message="如下明细信息上传至采购平台失败，请查看错误原因，并逐个进行处理，处理完成后点击重发按钮，我们会将信息重发至省平台"
        type="warning"
        className="aek-mb20"
      />
      <Table {...tableParam} />
    </Modal>
  )
}

FailedModal.propTypes = propTypes
export default FailedModal
