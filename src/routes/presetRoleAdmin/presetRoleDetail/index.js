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
const namespace = 'presetRoleDetail'

const PresetRoleDetail = ({ dispatch, routes, presetRoleDetail, loading }) => {
  const { dispatchAction, getLoading } = getBasicFn({ namespace, loading })
  const {
    roleType,
    addName,
    addTime,
    roleId,
    orgType,
    roleName,
    adminFlag,
    roleStatus,
  } = presetRoleDetail.roleDetail

  // 更改状态
  const changeStatus = (e, admin) => {
    confirm({
      title: e ? '您确定要停用该角色吗？' : '您确定要启用该角色吗？',
      content: (admin && e) ? <span className="aek-red">机构管理员角色有且只有一个，请慎重停用！</span> : '',
      onOk() {
        dispatchAction({
          type: 'presetRoleDetail/updateRoleState',
          payload: {
            roleId,
            roleStatus: e,
          },
        })
      },
    })
  }
  // 编辑角色
  const editRoleHandler = (data) => {
    dispatch({ type: 'presetRoleDetail/editRole', payload: { ...data } })
  }
  // 显示/隐藏
  const showEditModal = () => {
    dispatch({ type: 'presetRoleDetail/showOrHideModal', payload: { editRoleVisible: true } })
  }
  const hideEditModal = () => {
    dispatch({ type: 'presetRoleDetail/showOrHideModal', payload: { editRoleVisible: false } })
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
    '机构类型|fill': orgType,
    '角色类型|fill': getRoleType(roleType),
    '是否管理员|fill': adminFlag ? '是' : '否',
  }
  const rightData = {
    '创建人|fill': addName,
    '创建时间|fill': addTime,
  }

  const tabParam = {
    dispatchAction,
    roleDetail: presetRoleDetail.roleDetail,
    getLoading,
    onTabChnage: null,
    editBtnVisible: presetRoleDetail.editBtnVisible,
    // menusTab
    editRoleVisible: presetRoleDetail.editRoleVisible,
    totalMenus: presetRoleDetail.totalMenus,
    totalMenusCopy: presetRoleDetail.totalMenusCopy,
    editRoleHandler,
    hideEditModal,
    showEditModal,
  }
  return (
    <div className="aek-layout">
      <div className="bread">
        <Breadcrumb />
        <div className="aek-fr" style={{ display: 'inline-block' }}>
          {
            roleStatus ?
              <a onClick={() => { changeStatus(false, adminFlag) }}><Icon type="minus-circle-o" /> 启用</a> :
              <a onClick={() => { changeStatus(true, adminFlag) }}><Icon type="minus-circle-o" /> 停用</a>
          }
        </div>
      </div>
      <div className="content">
        <div className="aek-content-title">预设角色详情</div>
        <Spin spinning={getLoading('getDetail', 'updateRoleState')}>
          <div className={Style.topContent}>
            <p className="aek-mb10">
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

PresetRoleDetail.propTypes = {
  dispatch: PropTypes.func,
  routes: PropTypes.array,
  presetRoleDetail: PropTypes.object,
  loading: PropTypes.object,
}
export default connect((
  { dispatch, presetRoleDetail, loading },
) => ({ dispatch, presetRoleDetail, loading }))(PresetRoleDetail)
