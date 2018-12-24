import React from 'react'
import PropTypes from 'prop-types'
import { Tabs, Icon, Spin, Select, Input } from 'antd'
import { Link } from 'dva/router'

import MenusTree from '../../../components/menusTree'
import RoleModal from '../roleModal/'

const TabPane = Tabs.TabPane
const Tab = ({
  getLoading,
  dispatchAction,
  roleDetail,
  onTabChnage,
  // menus
  showEditModal,
  editRoleVisible,
  totalMenus,
  totalMenusCopy,
  editRoleHandler,
  hideEditModal,
}) => {
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
          <a onClick={showEditModal}><Icon type="edit" /> 编辑角色权限</a>
        }
      >
        <TabPane tab="此角色包含功能权限" key="1">
          <Spin spinning={getLoading('getDetail')}>
            <MenusTree {...viewMenusParam} />
          </Spin>
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
