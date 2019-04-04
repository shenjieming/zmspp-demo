import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Link } from 'dva/router'
import { Row, Col, Icon, Table, Modal, Avatar } from 'antd'
import Bread from '../../components/Breadcrumb'
import PlainForm from '../../components/PlainForm'
import AddRole from './addRole'
import ChangeModal from './changeDept'
import Style from './index.less'

const confirm = Modal.confirm
const PersonDetail = ({ personAdminDetail, routes, dispatch, effects }) => {
  const {
    roleList,
    personDetail,
    addRoleVisible,
    orgRoleList,
    personDeptVisible,
    deptSelect,
    orgName,
  } = personAdminDetail
  const {
    addTime,
    addName,
    birthday,
    email,
    gender,
    imageUrl = undefined,
    lastLoginTime,
    mobile,
    realName,
    status,
    userName,
    deptName,
    deptId,
    userId,
    adminFlag,
  } = personDetail
  let genderText = ''
  if (gender === 0) {
    genderText = '女'
  } else if (gender === 1) {
    genderText = '男'
  } else {
    genderText = '不详'
  }
  const handleChange = () => {
    dispatch({
      type: 'personAdminDetail/updateState',
      payload: {
        personDeptVisible: true,
      },
    })
  }
  const leftData = {
    '用户名|fill': userName,
    '头像|fill': <Avatar size="large" src={imageUrl} />,
    '手机|fill': mobile,
    // '邮箱|fill': email,
    '真实姓名|fill': realName,
    '出生日期|fill': birthday,
    '性别|fill': genderText,
    '部门|fill': (
      <span>
        {deptName}
        <a onClick={handleChange} style={{ marginLeft: '20px' }}>
          更改
        </a>
      </span>
    ),
  }
  const rightData = {
    '创建人|fill': addName,
    '创建时间|fill': addTime,
    '最后登录时间|fill': lastLoginTime,
  }
  // 移除角色
  function roleConfirm(record) {
    confirm({
      title: '确定要移除该用户的此角色吗？',
      content: <span className="aek-red">移除后，该人员将不再拥有此角色所包含权限！</span>,
      okText: '确认',
      closable: false,
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'personAdminDetail/delPersonRole',
          payload: { roleId: record.roleId, userId },
        })
      },
    })
  }
  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      className: 'aek-text-center',
      width: 30,
      render: (value, record, index) => index + 1,
    },
    {
      title: '角色名',
      dataIndex: 'roleName',
      key: 'roleName',
    },
    {
      title: '角色类型',
      dataIndex: 'roleType',
      key: 'roleType',
      render: (value) => {
        if (value === 1) {
          return '预设角色'
        }
        return '自定义角色'
      },
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      width: 100,
      className: 'aek-text-center',
      render: (value, record) => (
        <span>
          <Link to={`/roleAdmin/detail/${record.roleId}`} target="_blank">
            查看
          </Link>
          <span className="ant-divider" />
          <a
            onClick={() => {
              roleConfirm(record)
            }}
          >
            移除
          </a>
        </span>
      ),
    },
  ]
  // 移除人员
  function personConfirm() {
    confirm({
      title: '确定要将该人员从本组织机构移除吗？',
      content: <span className="aek-red">移除后，该员工将不能再登录到本组织机构进行操作！</span>,
      okText: '确认',
      closable: false,
      cancelText: '取消',
      onOk() {
        dispatch({ type: 'personAdminDetail/delPerson' })
      },
    })
  }

  const addRoleProps = {
    roleList,
    dispatch,
    effects,
    addRoleVisible,
    orgRoleList,
    deptName,
    orgName,
  }
  const changeProps = {
    dispatch,
    effects,
    userId,
    deptName,
    personDeptVisible,
    deptSelect,
    orgName,
    deptId,
  }
  return (
    <div className="aek-layout">
      <div className="bread">
        <div style={{ float: 'left' }}>
          <Bread routes={routes} />
        </div>
        {adminFlag ? (
          ''
        ) : (
          <div style={{ float: 'right' }}>
            <a onClick={personConfirm}>
              <Icon type="minus-circle-o" />移除人员
            </a>
          </div>
        )}
      </div>
      <div className="content">
        <div className="aek-content-title">人员详情</div>
        <p>
          {realName}
          <span className="aek-status-on aek-ml20">
            {status ? '停用中' : '启用中'}
          </span>
        </p>
        <Row>
          <Col span={12}>
            <PlainForm data={leftData} itemSpacing="10px" />
          </Col>
          <Col span={12}>
            <PlainForm data={rightData} />
          </Col>
        </Row>
        <div style={{ borderBottom: '1px solid #ccc', margin: '20px 0px' }}>
          <span
            className={Style['aek-person-title']}
          >
            此用户拥有的角色
          </span>
          <a
            onClick={() => {
              dispatch({ type: 'personAdminDetail/getOrgRole' })
            }}
            style={{ float: 'right', marginTop: '5px' }}
          >
            <Icon type="plus" />编辑角色
          </a>
        </div>
        <Table
          columns={columns}
          dataSource={roleList}
          bordered
          rowKey="roleId"
          pagination={false}
          loading={!!effects['personAdminDetail/getPersonRole']}
        />
      </div>
      <AddRole {...addRoleProps} />
      <ChangeModal {...changeProps} />
    </div>
  )
}
PersonDetail.propTypes = {
  personAdminDetail: PropTypes.object,
  dispatch: PropTypes.func,
  effects: PropTypes.object,
  routes: PropTypes.array,
}
export default connect(({ personAdminDetail, loading: { effects } }) => ({
  personAdminDetail,
  effects,
}))(PersonDetail)
