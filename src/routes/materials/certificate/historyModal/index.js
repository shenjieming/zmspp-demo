import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Button, Table, Alert } from 'antd'
import { getPagination } from '../../../../utils'

const propTypes = {
  historyPagination: PropTypes.object,
  checkedHistoryArr: PropTypes.array,
  historyList: PropTypes.array,
  dispatchAction: PropTypes.func,
  getLoading: PropTypes.func,
  historyModalVisible: PropTypes.bool,
}
const HistoryModal = (
  {
    historyModalVisible,
    dispatchAction,
    getLoading,
    historyPagination,
    historyList,
    checkedHistoryArr,
  }) => {
  const compareModalShow = () => {
    dispatchAction({
      type: 'viewCertNoCompareList',
      payload: { certificateVersionIds: checkedHistoryArr.join() },
    })
  }
  const modalOpts = {
    title: '修改历史',
    visible: historyModalVisible,
    onCancel() {
      dispatchAction({
        payload: {
          historyModalVisible: false,
        },
      })
    },
    // onOk: handleOk,
    width: 700,
    footer: <Button
      disabled={checkedHistoryArr.length !== 2}
      onClick={compareModalShow}
      type="primary"
    >版本对比</Button>,
    maskClosable: false,
    wrapClassName: 'aek-modal',
  }
  const columns = [
    {
      title: '版本号',
      dataIndex: 'certificateVersionCode',
      key: 'certificateVersionCode',
    },
    {
      title: '修改时间',
      dataIndex: 'lastEditTime',
      key: 'lastEditTime',
    },
    {
      title: '修改人',
      dataIndex: 'lastEditName',
      key: 'lastEditName',
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      className: 'aek-text-center',
      render: (text, { certificateVersionId }) => (<a
        onClick={
          () => {
            dispatchAction({
              type: 'getCertNoDetail',
              payload: { certificateVersionId },
            })
          }
        }
      >查看</a>),
    },
  ]
  const tableParam = {
    rowSelection: {
      onChange: (selectedRowKeys) => {
        dispatchAction({
          payload: {
            checkedHistoryArr: selectedRowKeys.slice(-2),
          },
        })
      },
      selectedRowKeys: checkedHistoryArr,
    },
    loading: getLoading('viewCerNoList'),
    columns,
    dataSource: historyList,
    pagination: getPagination((current, pageSize) => {
      dispatchAction({
        type: 'viewCerNoList',
        payload: { current, pageSize },
      })
    }, historyPagination),
    rowKey: 'certificateVersionId',
  }
  return (
    <Modal {...modalOpts}>
      <div style={{ marginBottom: 15 }}>
        <Alert message="可选择其中两个版本进行对比" type="info" showIcon />
      </div>
      <Table bordered {...tableParam} className="aek-table-no-allcheck" />
    </Modal>
  )
}
HistoryModal.propTypes = propTypes
export default HistoryModal
