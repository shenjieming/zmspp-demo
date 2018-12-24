import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Table, Avatar, Input } from 'antd'

const Search = Input.Search
const confirm = Modal.confirm
function OrgManageTransfer({
  searchData,
  orgPersonList,
  orgPersonVisible,
  dispatch,
  loading,
  orgPersonListPagination,
}) {
  // 搜索条件
  const handleSearch = (value) => {
    dispatch({
      type: 'organInfo/getOrgPerson',
      payload: {
        keywords: value,
        current: 1,
        pageSize: 10,
      },
    })
  }
  const columns = [
    {
      title: '用户名',
      dataIndex: 'realName',
      key: 'realName',
      render: (value, record) => (
        <span>
          <Avatar src={record.imgUrl} />
          <span
            style={{
              height: '32px',
              display: 'inline-block',
              verticalAlign: 'bottom',
              marginLeft: '10px',
            }}
          >
            {value}
          </span>
        </span>
      ),
    },
    {
      title: '部门',
      dataIndex: 'deptName',
      key: 'deptName',
      className: 'aek-text-center',
    },
    {
      title: '手机号码',
      dataIndex: 'mobile',
      key: 'mobile',
      className: 'aek-text-center',
    },
  ]
  const modalProps = {
    visible: orgPersonVisible,
    footer: null,
    title: '组织管理权转让',
    maskClosable: false,
    onCancel() {
      dispatch({
        type: 'organInfo/updateState',
        payload: {
          orgPersonVisible: false,
        },
      })
    },
  }
  // 表格单击事件
  function showConfirm(record) {
    confirm({
      title: '',
      content: `确定选择 ${record.realName} 为新组织管理员，你将自动放弃组织管理员身份！`,
      onOk() {
        dispatch({
          type: 'organInfo/setPogPersonTrans',
          payload: {
            receiveUserId: record.userId,
          },
        })
      },
    })
  }
  const tableProps = {
    showHeader: false,
    columns,
    dataSource: orgPersonList,
    rowKey: 'userId',
    loading,
    pagination: orgPersonListPagination,
    border: true,
    wrapClassName: 'aek-modal',
    onChange(pagination) {
      dispatch({
        type: 'organInfo/getOrgPerson',
        payload: {
          ...searchData,
          ...pagination,
        },
      })
    },
    onRowClick(record) {
      showConfirm(record)
    },
  }
  return (
    <Modal {...modalProps}>
      <Search onSearch={handleSearch} style={{ width: '100%' }} placeholder="姓名/手机号" />
      <p style={{ margin: '10px 0' }}>
        人员<span>（管理权转让只能赋予一个人）</span>
      </p>
      <Table {...tableProps} />
    </Modal>
  )
}

OrgManageTransfer.propTypes = {
  loading: PropTypes.bool,
  dispatch: PropTypes.func,
  searchData: PropTypes.object,
  orgPersonList: PropTypes.array,
  orgPersonVisible: PropTypes.bool,
  orgPersonListPagination: PropTypes.object,
}

export default OrgManageTransfer
