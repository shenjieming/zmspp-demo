import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Button, Table, Alert } from 'antd'
import { getPagination } from '../../../../utils'
import { genColumns } from './data'

const propTypes = {
  dispatchAction: PropTypes.func,
  getLoading: PropTypes.func,
  historyModalVisible: PropTypes.bool,
  historyPagination: PropTypes.object,
  historyList: PropTypes.array,
  checkedHistoryArr: PropTypes.array,
}
const HistoryModal = ({
  historyModalVisible,
  dispatchAction,
  getLoading,
  historyPagination,
  historyList,
  checkedHistoryArr,
}) => {
  const compareModalShow = () => {
    dispatchAction({
      type: 'getCompareList',
      payload: { materialsSkuVersionIds: checkedHistoryArr.join() },
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
    width: 700,
    footer: (
      <Button disabled={checkedHistoryArr.length !== 2} onClick={compareModalShow} type="primary">
        版本对比
      </Button>
    ),
    maskClosable: false,
    wrapClassName: 'aek-modal',
  }
  const columnsParam = {
    viewModal({ materialsSkuVersionId }) {
      dispatchAction({
        type: 'queryVersionDetail',
        payload: { materialsSkuVersionId },
      })
    },
  }
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
    loading: getLoading('getVersionList'),
    columns: genColumns(columnsParam),
    // dataSource: certificateList,
    dataSource: historyList,
    pagination: getPagination((current, pageSize) => {
      dispatchAction({
        type: 'getVersionList',
        payload: { current, pageSize },
      })
    }, historyPagination),
    rowKey: 'materialsSkuVersionId',
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
