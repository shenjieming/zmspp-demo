import React from 'react'
import { Input, Select } from 'antd'
import { Link } from 'dva/router'

// 搜索
const searchProps = [
  {
    field: 'roleType',
    component: (<Select optionLabelProp="title">
      <Select.Option
        title="机构类型: 全部"
        value={null}
      >全部</Select.Option>
      <Select.Option
        title="机构类型: 自定义角色"
        value="0"
      >自定义角色</Select.Option>
      <Select.Option
        title="机构类型: 预设角色"
        value="1"
      >预设角色</Select.Option>
    </Select>),
    options: {
      initialValue: null,
    },
  },
  {
    field: 'roleStatus',
    component: (<Select optionLabelProp="title">
      <Select.Option
        title="角色状态: 全部"
        value={null}
      >全部</Select.Option>
      <Select.Option
        title="角色状态: 启用"
        value="0"
      >启用</Select.Option>
      <Select.Option
        title="角色状态: 停用"
        value="1"
      >停用</Select.Option>
    </Select>),
    options: {
      initialValue: null,
    },
  }, {
    field: 'roleName',
    component: <Input placeholder="角色名称" />,
  },
]

// 表格数据
const tableColumns = [
  {
    key: 'index',
    title: '序号',
    width: 30,
    render: (_, $, i) => i + 1,
    className: 'aek-text-center',
  },
  {
    dataIndex: 'roleName',
    key: 'roleName',
    title: '角色名称',
    className: 'aek-text-center',
    render: (text, row) => (text + (row.adminFlag ? '【管】' : '')),
  },
  {
    dataIndex: 'orgType',
    key: 'orgType',
    width: 160,
    className: 'aek-text-center',
    title: '机构类型',
  },
  {
    dataIndex: 'roleStatus',
    key: 'roleStatus',
    title: '角色状态',
    className: 'aek-text-center',
    width: 120,
    render: (text) => {
      if (!text) {
        return <span>启用</span>
      }
      return <span className="aek-text-disable">停用</span>
    },
  },
  {
    title: '操作',
    key: 'action',
    className: 'aek-text-center',
    render: (_, row) => <Link to={`/presetRoleAdmin/detail/${row.roleId}`}>查看</Link>,
  },
]

export default {
  searchProps,
  tableColumns,
}
