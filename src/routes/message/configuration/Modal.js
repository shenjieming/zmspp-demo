import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Input, Table, Avatar, Button } from 'antd'
import { IMG_COMPRESS } from '../../../utils/config'

const getColumns = ({ handleBtnClick, receiveUsers = [] }) => [
  {
    key: 'imgUrl',
    dataIndex: 'imgUrl',
    render: text => <Avatar icon="user" src={text && text + IMG_COMPRESS} />,
  },
  {
    key: 'realName',
    dataIndex: 'realName',
  },
  {
    key: 'deptName',
    dataIndex: 'deptName',
  },
  {
    key: 'mobile',
    dataIndex: 'mobile',
  },
  {
    key: 'action',
    render: (_, row) => (
      <Button
        type="primary"
        disabled={receiveUsers.some(x => x.userId === row.userId)}
        onClick={() => handleBtnClick(row)}
      >
        更换
      </Button>
    ),
  },
]

const propTypes = {
  keywords: PropTypes.string.isRequired,
  handleSearchChange: PropTypes.func.isRequired,
  dataSource: PropTypes.array.isRequired,
  onBtnClick: PropTypes.func.isRequired,
  visible: PropTypes.bool,
  pagination: PropTypes.object.isRequired,
  handleSearch: PropTypes.func.isRequired,
  tableLoading: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  currentSwitchTemplate: PropTypes.object.isRequired,
}

function CustomModal(props) {
  const searchProps = {
    value: props.keywords,
    onChange: props.handleSearchChange,
    onSearch: props.handleSearch,
  }

  const tableProps = {
    dataSource: props.dataSource,
    columns: getColumns({
      handleBtnClick: props.onBtnClick,
      receiveUsers: props.currentSwitchTemplate.receiveUser,
    }),
    title: () => '所有人员',
    rowKey: 'userId',
    showHeader: false,
    pagination: props.pagination,
    loading: props.tableLoading,
  }

  const modalProps = {
    title: '更换人员',
    visible: props.visible,
    width: 600,
    footer: null,
    onCancel: props.onClose,
    wrapClassName: 'aek-modal',
  }

  return (
    <Modal {...modalProps}>
      <Input.Search {...searchProps} />
      <Table {...tableProps} />
    </Modal>
  )
}

CustomModal.propTypes = propTypes

export default CustomModal
