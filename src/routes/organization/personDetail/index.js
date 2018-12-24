import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Icon, Spin, Row, Col, Modal } from 'antd'
import Breadcrumb from '../../../components/Breadcrumb'
import PlainForm from '../../../components/PlainForm'
import { getBasicFn } from '../../../utils/index'
import Style from '../orgDetail/index.less'

const { confirm } = Modal
const namespace = 'personDetail'
function IndexPage({ personDetail, loading }) {
  const { dispatchAction, getLoading } = getBasicFn({ namespace, loading })
  const {
    currentItem: {
      islock,
      userName,
      realName,
      gender,
      birthday,
      mobile,
      email,
      belongsOrg,
      addName,
      addTime,
      lastLoginTime,
      status,
    },
    userId,
  } = personDetail
  const resetPassWord = () => {
    confirm({
      content: '您确定要重置该用户密码吗？',
      onOk() {
        dispatchAction({
          type: 'resetPassWord',
          payload: {},
        })
      },
    })
  }
  const unlockAccount = () => {
    confirm({
      content: '您确定要解锁该账号吗？',
      onOk() {
        dispatchAction({
          type: 'unlockAccount',
        })
      },
    })
  }
  const changeAccountStatus = (data) => {
    confirm({
      content: data.userStatus ? '您确定要停用该用户吗？' : '您确定要启用该用户吗？',
      onOk() {
        dispatchAction({
          type: 'changeStatus',
          payload: data,
        })
      },
    })
  }
  const belongOrg = belongsOrg && (
    <div>
      {belongsOrg.map((item, idx) => (
        <p key={idx}>
          {item}
        </p>
      ))}
    </div>
  )
  const leftData = {
    用户名: userName,
    真实姓名: realName,
    性别: gender ? '男' : '女',
    出生日期: birthday,
    手机号: mobile,
    邮箱: email,
    所属机构: belongOrg,
  }
  const rightData = {
    创建人: addName,
    创建时间: addTime,
    最后登录时间: lastLoginTime,
    账号状态: !status ? '已启用' : '已停用',
    账号锁定状态: islock ? '已锁定' : '未锁定',
  }
  return (
    <div className="aek-layout">
      <div className="bread">
        <div>
          <Breadcrumb />
        </div>
      </div>
      <div className="content">
        <Spin spinning={getLoading('changeStatus')}>
          <div className="aek-content-title">
            <h3 className="aek-title-left">基本信息</h3>
            <div className="aek-title-right">
              {islock ? (
                <a style={{ marginRight: 20 }} onClick={unlockAccount}>
                  <Icon type="unlock" style={{ marginRight: 8 }} />
                  解锁账号
                </a>
              ) : (
                ''
              )}
              <a style={{ marginRight: 20 }} onClick={resetPassWord}>
                <Icon type="edit" style={{ marginRight: 8 }} />
                重置密码
              </a>
              {!status ? (
                <a
                  className={Style.mr}
                  onClick={() => changeAccountStatus({ userStatus: true, userId })}
                >
                  <Icon type="close-circle-o" style={{ marginRight: 8 }} />
                  停用账号
                </a>
              ) : (
                <a
                  className={Style.mr}
                  onClick={() => changeAccountStatus({ userStatus: false, userId })}
                >
                  <Icon type="close-circle-o" style={{ marginRight: 8 }} />
                  启用账号
                </a>
              )}
            </div>
          </div>
          <div style={{ marginTop: 20 }}>
            <Row>
              <Col span={12}>
                <PlainForm size={1} data={leftData} />
              </Col>
              <Col span={12}>
                <PlainForm size={1} data={rightData} />
              </Col>
            </Row>
          </div>
        </Spin>
      </div>
    </div>
  )
}
IndexPage.propTypes = {
  loading: PropTypes.object,
  personDetail: PropTypes.object,
}

export default connect(({ personDetail, loading }) => ({ personDetail, loading }))(IndexPage)
