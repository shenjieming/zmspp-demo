import React from 'react'
import PropTypes from 'prop-types'
import { Button, Table, Input, Select } from 'antd'
import { connect } from 'dva'

import SearchForm from '../../components/SearchFormFilter'
import Breadcrumb from '../../components/Breadcrumb'
import { tableColumns } from './props'
import RoleModal from './roleModal/'
import { getBasicFn, getPagination } from '../../utils/index'

const namespace = 'roleAdmin'
const RoleAdmin = ({ dispatch, roleAdmin, loading }) => {
  const { pagination, searchParams } = roleAdmin
  const { dispatchAction, getLoading } = getBasicFn({ namespace, loading })

  const newRoleHandler = (value) => {
    dispatch({ type: 'roleAdmin/addOne', payload: value })
  }

  const searchHandler = (value) => {
    dispatchAction({ payload: { searchParams: { ...value }, pagination: { current: 1 } } })
    dispatch({ type: 'roleAdmin/getData', payload: { ...value } })
  }

  const showAddModal = () => {
    dispatch({ type: 'roleAdmin/showOrHideModal', payload: { addModalVisible: true } })
  }

  const hideAddModal = () => {
    dispatch({ type: 'roleAdmin/showOrHideModal', payload: { addModalVisible: false } })
  }

  const onPageChange = (current, pageSize) => {
    dispatch({ type: 'roleAdmin/getData', payload: { current, pageSize } })
  }

  // 搜索
  const searchProps = [
    {
      field: 'roleType',
      component: (
        <Select optionLabelProp="title">
          <Select.Option title="角色类型: 全部" value={null}>
            全部
          </Select.Option>
          <Select.Option title="角色类型: 自定义角色" value="0">
            自定义角色
          </Select.Option>
          <Select.Option title="角色类型: 预设角色" value="1">
            预设角色
          </Select.Option>
        </Select>
      ),
      options: {
        initialValue: searchParams.roleType,
      },
    },
    {
      field: 'roleStatus',
      component: (
        <Select optionLabelProp="title">
          <Select.Option title="状态: 全部" value={null}>
            全部
          </Select.Option>
          <Select.Option title="状态: 启用" value="0">
            启用
          </Select.Option>
          <Select.Option title="状态: 停用" value="1">
            停用
          </Select.Option>
        </Select>
      ),
      options: {
        initialValue: searchParams.roleStatus,
      },
    },
    {
      field: 'roleName',
      component: <Input placeholder="角色名称" />,
      options: {
        initialValue: searchParams.roleName,
      },
    },
  ]
  const modalParam = {
    title: '添加角色',
    visible: roleAdmin.addModalVisible,
    totalMenus: roleAdmin.totalMenusCopy,
    dispatchAction,
    roleName: roleAdmin.roleName,
    onOk: newRoleHandler,
    onHide: hideAddModal,
  }

  return (
    <div className="aek-layout">
      <div className="bread">
        <Breadcrumb />
        <div className="aek-fr">
          <Button icon="plus" type="primary" onClick={showAddModal}>
            新增角色
          </Button>
        </div>
      </div>
      <div className="content">
        <SearchForm components={searchProps} onSearch={searchHandler} />
        <Table
          bordered
          rowKey="roleId"
          loading={getLoading('getData')}
          columns={tableColumns}
          dataSource={roleAdmin.data}
          pagination={getPagination(onPageChange, pagination)}
          rowClassName={({ roleStatus }) => {
            if (roleStatus) {
              return 'aek-text-disable'
            }
            return ''
          }}
        />
      </div>
      <RoleModal {...modalParam} />
    </div>
  )
}

RoleAdmin.propTypes = {
  roleAdmin: PropTypes.object,
  dispatch: PropTypes.func,
  routes: PropTypes.array,
  loading: PropTypes.object,
}
export default connect(({ roleAdmin, loading }) => ({ roleAdmin, loading }))(RoleAdmin)
