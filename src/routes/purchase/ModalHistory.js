import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Button, Table, Alert } from 'antd'
import { getPagination } from '../../utils'
import { historyColumns } from './data'

const propTypes = {
  toAction: PropTypes.func,
  loading: PropTypes.bool,
  historyModalVisible: PropTypes.bool,
  historyPagination: PropTypes.object,
  historyList: PropTypes.array,
  checkedHistoryArr: PropTypes.array,
}
const ModalHistory = ({
  historyModalVisible,
  toAction,
  loading,
  historyPagination,
  historyList,
  checkedHistoryArr,
}) => {
  const modalOpts = {
    title: '修改历史',
    visible: historyModalVisible,
    onCancel() {
      toAction({
        historyModalVisible: false,
        checkedHistoryArr: [],
      })
    },
    width: 700,
    footer: <Button
      type="primary"
      disabled={checkedHistoryArr.length !== 2}
      onClick={() => {
        toAction({ compareModalVisible: true })
        toAction({
          id: checkedHistoryArr[0],
          comparaId: checkedHistoryArr[1],
        }, 'historysCompare')
      }}
    >版本对比</Button>,
    maskClosable: false,
    wrapClassName: 'aek-modal',
  }

  const tableParam = {
    loading,
    rowKey: 'id',
    dataSource: historyList,
    columns: historyColumns(({ id }) => {
      toAction({ compareModalVisible: true })
      toAction({ id }, 'historysDetail')
    }),
    pagination: getPagination((current, pageSize) => {
      toAction({ historyPagination: { current, pageSize } }, true)
      toAction({ current, pageSize, pscId: historyPagination.pscId }, 'historys')
    }, historyPagination),
    rowSelection: {
      selectedRowKeys: checkedHistoryArr,
      onChange: (selectedRowKeys) => {
        toAction({ checkedHistoryArr: selectedRowKeys.slice(-2) })
      },
    },
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

ModalHistory.propTypes = propTypes
export default ModalHistory
