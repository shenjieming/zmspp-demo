import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col, Icon, Spin, Modal } from 'antd'

import PlainForm from '../../../components/PlainForm'
import Breadcrumb from '../../../components/Breadcrumb'
import Apanel from '../../../components/APanel'
import { getBasicFn } from '../../../utils/index'
import Tabs from './tabs'
import Style from './index.less'

const { confirm } = Modal
const namespace = 'roleDetail'

const RoleDetail = ({ dispatch, routes, roleDetail, loading }) => {
  const { dispatchAction, getLoading } = getBasicFn({ namespace, loading })
  const {
    roleType,
    addName,
    addTime,
    menus,
    roleId,
    roleName,
    roleStatus,
  } = roleDetail.roleDetail

  // 更改状态
  const changeStatus = (e) => {
    confirm({
      content: e ? '您确定要停用该角色吗？' : '您确定要启用该角色吗？',
      onOk() {
        dispatchAction({
          type: 'roleDetail/updateRoleState',
          payload: {
            roleId,
            roleStatus: e,
          },
        })
      },
    })
  }
  // 移除角色
  const removeUserHandler = (userId) => {
    confirm({
      title: '确定要将该用户从此角色移除吗？',
      content: <span className="aek-red">移除后，该用户将失去此角色的所有权限！</span>,
      onOk() {
        dispatch({ type: 'roleDetail/removeUser', payload: { roleId, userId } })
      },
    })
  }
  // 编辑角色
  const editRoleHandler = (data) => {
    dispatch({ type: 'roleDetail/editRole', payload: { ...data } })
  }
  // 显示/隐藏
  const showEditModal = () => {
    dispatch({ type: 'roleDetail/showOrHideModal', payload: { editRoleVisible: true } })
  }
  const hideEditModal = () => {
    dispatch({ type: 'roleDetail/showOrHideModal', payload: { editRoleVisible: false } })
  }
  // 用户分页
  const onPageChange = (data) => {
    dispatch({ type: 'roleDetail/pagination', payload: data })
  }
  // 搜索用户
  const searchHandler = (value) => {
    if (value.status !== null) {
      value.status = Number(value.status)
    }
    dispatch({ type: 'roleDetail/filterUser', payload: value })
  }
  // 切换Tab
  const onTabChnage = (key) => {
    dispatch({ type: 'roleDetail/tabChange', payload: key })
  }

  const getRoleType = (type) => {
    if (type === 0) {
      return '自定义角色'
    } else if (type === 1) {
      return '预设角色'
    }
    return ''
  }
  const leftData = {
    '角色类型|fill': getRoleType(roleType),
    '创建时间|fill': addTime,
  }
  const rightData = {
    '创建人|fill': addName,
  }

  const tabParam = {
    dispatchAction,
    roleDetail: roleDetail.roleDetail,
    getLoading,
    onTabChnage,
    editBtnVisible: roleDetail.editBtnVisible,
    // menusTab
    editRoleVisible: roleDetail.editRoleVisible,
    totalMenus: roleDetail.totalMenus,
    totalMenusCopy: roleDetail.totalMenusCopy,
    editRoleHandler,
    hideEditModal,
    showEditModal,
    // usersTab
    roleUsers: roleDetail.roleUsers,
    removeUserHandler,
    onPageChange,
    searchHandler,
  }
  return (
    <div className="aek-layout">
      <div className="bread">
        <Breadcrumb />
        {roleType ?
          '' :
          <div className="aek-fr" style={{ display: 'inline-block' }}>
            {
              roleStatus ?
                <a onClick={() => { changeStatus(false) }}><Icon type="minus-circle-o" /> 启用</a> :
                <a onClick={() => { changeStatus(true) }}><Icon type="minus-circle-o" /> 停用</a>
            }
          </div>
        }
      </div>
      <div className="content">
        <div className="aek-content-title">角色详情</div>
        <Spin spinning={getLoading('getDetail', 'updateRoleState')}>
          <div className={Style.topContent}>
            <p className="aek-mb-10">
              {roleName}
              <span
                style={{ marginLeft: '20px' }}
                className="aek-status-on"
              >
                {roleStatus ? '停用中' : '启用中'}
              </span>
            </p>
            <Row>
              <Col span={12}>
                <PlainForm data={leftData} />
              </Col>
              <Col span={12}>
                <PlainForm data={rightData} />
              </Col>
            </Row>
          </div>
        </Spin>
        <div className={Style.bottomContent} style={{ minHeight: '500px' }}>
          <Tabs {...tabParam} />
        </div>
      </div>
    </div>
  )
}

RoleDetail.propTypes = {
  dispatch: PropTypes.func,
  routes: PropTypes.array,
  roleDetail: PropTypes.object,
  loading: PropTypes.object,
}
export default connect((
  { dispatch, roleDetail, loading },
) => ({ dispatch, roleDetail, loading }))(RoleDetail)
