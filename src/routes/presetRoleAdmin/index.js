import React from 'react'
import PropTypes from 'prop-types'
import { Button, Table, Select, Input } from 'antd'
import { connect } from 'dva'

import SearchForm from '../../components/SearchFormFilter'
import Breadcrumb from '../../components/Breadcrumb'
import { tableColumns } from './props'
import RoleModal from './roleModal/'
import { getBasicFn, getPagination } from '../../utils/index'

const namespace = 'presetRoleAdmin'
const PresetRoleAdmin = ({ dispatch, presetRoleAdmin, loading }) => {
  const { pagination, searchParams } = presetRoleAdmin
  const { dispatchAction, getLoading } = getBasicFn({ namespace, loading })

  const newRoleHandler = (value) => {
    dispatch({ type: 'presetRoleAdmin/addOne', payload: value })
  }

  const searchHandler = (value) => {
    dispatchAction({ payload: { searchParams: { ...value }, pagination: { current: 1 } } })
    dispatch({ type: 'presetRoleAdmin/getData', payload: { ...value } })
  }

  const showAddModal = () => {
    dispatch({ type: 'presetRoleAdmin/showOrHideModal', payload: { addModalVisible: true } })
  }

  const hideAddModal = () => {
    dispatch({ type: 'presetRoleAdmin/showOrHideModal', payload: { addModalVisible: false } })
  }

  const onPageChange = (current, pageSize) => {
    dispatch({ type: 'presetRoleAdmin/getData', payload: { current, pageSize } })
  }
  // 搜索
  const searchProps = [
    {
      field: 'orgTypeValue',
      component: (
        <Select optionLabelProp="title">
          <Select.Option title="机构类型: 全部" value={null}>
            全部
          </Select.Option>
          {presetRoleAdmin.orgType.map(item => (
            <Select.Option
              title={`机构类型: ${item.dicValueText}`}
              key={item.dicValueId}
              value={item.dicValue}
            >
              {item.dicValueText}
            </Select.Option>
          ))}
        </Select>
      ),
      options: {
        initialValue: searchParams.orgTypeValue,
      },
    },
    {
      field: 'roleStatus',
      component: (
        <Select optionLabelProp="title">
          <Select.Option title="角色状态: 全部" value={null}>
            全部
          </Select.Option>
          <Select.Option title="角色状态: 启用" value="0">
            启用
          </Select.Option>
          <Select.Option title="角色状态: 停用" value="1">
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
    dispatchAction,
    title: '添加角色',
    visible: presetRoleAdmin.addModalVisible,
    orgType: presetRoleAdmin.orgType,
    totalMenus: presetRoleAdmin.totalMenusCopy,
    onOk: newRoleHandler,
    onHide: hideAddModal,
  }

  return (
    <div className="aek-layout">
      <div className="bread">
        <Breadcrumb />
        <div className="aek-fr">
          <Button icon="plus" type="primary" onClick={showAddModal}>
            新增预设角色
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
          dataSource={presetRoleAdmin.data}
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

PresetRoleAdmin.propTypes = {
  presetRoleAdmin: PropTypes.object,
  dispatch: PropTypes.func,
  routes: PropTypes.array,
  loading: PropTypes.object,
}

export default connect(({ presetRoleAdmin, loading }) => ({ presetRoleAdmin, loading }))(
  PresetRoleAdmin,
)
