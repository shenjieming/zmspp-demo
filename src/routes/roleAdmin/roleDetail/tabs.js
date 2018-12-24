import React from 'react'
import PropTypes from 'prop-types'
import { Table, Tabs, Icon, Spin, Select, Input } from 'antd'
import { Link } from 'dva/router'

import MenusTree from '../../../components/menusTree'
import RoleModal from '../roleModal/'
import SearchForm from '../../../components/SearchFormFilter'

const TabPane = Tabs.TabPane
const Tab = ({
  getLoading,
  dispatchAction,
  roleDetail,
  onTabChnage,
  editBtnVisible,
  // menus
  showEditModal,
  editRoleVisible,
  totalMenus,
  totalMenusCopy,
  editRoleHandler,
  hideEditModal,
  // users
  roleUsers,
  removeUserHandler,
  onPageChange,
  searchHandler,
}) => {
  // 搜索
  const searchProps = [
    {
      field: 'status',
      component: (<Select optionLabelProp="title">
        <Select.Option
          title="状态: 全部"
          value={null}
        >全部</Select.Option>
        <Select.Option
          title="状态: 启用"
          value="0"
        >启用</Select.Option>
        <Select.Option
          title="状态: 停用"
          value="1"
        >停用</Select.Option>
      </Select>),
      options: {
        initialValue: null,
      },
    }, {
      field: 'keywords',
      component: <Input placeholder="用户名/手机号/真实姓名" />,
    },
  ]
  // 表格数据
  const usersColumns = [
    {
      key: 'index',
      title: '序号',
      render: (_, $, i) => i + 1,
      className: 'aek-text-center',
    },
    {
      dataIndex: 'userName',
      key: 'userName',
      title: '用户名',
    },
    {
      dataIndex: 'realName',
      key: 'realName',
      title: '真实姓名',
    },
    {
      dataIndex: 'gender',
      key: 'gender',
      title: '性别',
      render: (value) => {
        if (value === 0) {
          return '女'
        } else if (value === 1) {
          return '男'
        }
        return '不详'
      },
    },
    {
      dataIndex: 'mobile',
      key: 'mobile',
      title: '联系手机',
    },
    {
      dataIndex: 'deptName',
      key: 'deptName',
      title: '部门',
    },
    {
      dataIndex: 'addTime',
      key: 'addTime',
      title: '创建时间',
    },
    {
      dataIndex: 'status',
      key: 'status',
      title: '账号状态',
      render: (text) => {
        if (text === false) {
          return '启用中'
        }
        return '已停用'
      },
    },
    {
      title: '操作',
      key: 'action',
      className: 'aek-text-center',
      render: row => (
        <div>
          <Link to={`/personAdmin/detail/${row.userId}`} target="_blank">查看</Link>
          <span className="ant-divider" />
          <a onClick={() => removeUserHandler(row.userId)}>移除该用户</a>
        </div>
      ),
    },
  ]
  // 分页
  const pagination = {
    current: roleUsers.current,
    pageSize: roleUsers.pageSize,
    total: roleUsers.total,
  }

  const modalParam = {
    title: '编辑角色',
    nameEditable: false,
    visible: editRoleVisible,
    totalMenus: totalMenusCopy,
    roleDetail,
    dispatchAction,
    onOk: editRoleHandler,
    onHide: hideEditModal,
  }
  const viewMenusParam = {
    total: totalMenus,
    showType: 'view',
  }
  return (
    <div>
      <Tabs
        onChange={onTabChnage}
        animated={false}
        defaultActiveKey="1"
        tabBarExtraContent={
          !roleDetail.roleType && editBtnVisible && <a onClick={showEditModal}><Icon type="edit" /> 编辑角色权限</a>
        }
      >
        <TabPane tab="此角色包含功能权限" key="1">
          <Spin spinning={getLoading('getDetail')}>
            <MenusTree {...viewMenusParam} />
          </Spin>
        </TabPane>
        <TabPane tab="此角色包含用户" key="2">
          <SearchForm components={searchProps} onSearch={searchHandler} />
          <Table
            bordered
            rowKey="userId"
            columns={usersColumns}
            dataSource={roleUsers.data}
            loading={getLoading('getUsers', 'removeUser')}
            pagination={{
              ...pagination,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: total => `共 ${total} 条`,
            }}
            rowClassName={({ status }) => {
              if (status) {
                return 'aek-text-disable'
              }
              return ''
            }}
            onChange={onPageChange}
          />
        </TabPane>
      </Tabs>
      <RoleModal {...modalParam} />
    </div>
  )
}
Tab.propTypes = {
  editHandler: PropTypes.func,
  dispatchAction: PropTypes.func,
  editRoleVisible: PropTypes.bool,
  totalMenus: PropTypes.array,
  totalMenusCopy: PropTypes.array,
  roleDetail: PropTypes.object,
  roleUsers: PropTypes.object,
  editRoleHandler: PropTypes.func,
  removeUserHandler: PropTypes.func,
  hideEditModal: PropTypes.func,
  onPageChange: PropTypes.func,
  loading: PropTypes.object,
  onTabChnage: PropTypes.func,
  editBtnVisible: PropTypes.bool,
  showEditModal: PropTypes.func,
  getLoading: PropTypes.func,
  searchHandler: PropTypes.func,
}
export default Tab
