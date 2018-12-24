import React from 'react'
import { Link } from 'dva/router'

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
  },
  {
    dataIndex: 'roleType',
    key: 'roleType',
    width: 120,
    title: '角色类型',
    className: 'aek-text-center',
    render: (text) => {
      if (text === 0) {
        return '自定义角色'
      }
      return '预设角色'
    },
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
    dataIndex: 'countUser',
    key: 'countUser',
    width: 90,
    className: 'aek-text-center',
    title: '用户数',
  },
  {
    title: '操作',
    key: 'action',
    className: 'aek-text-center',
    render: (_, row) => <Link to={`roleAdmin/detail/${row.roleId}`}>查看</Link>,
  },
]

export default {
  tableColumns,
}
