import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col, Icon, Spin, Upload, Modal, Avatar } from 'antd'
import { getBasicFn } from '../../utils'
import ModalForm from './ModalForm'
import PlainForm from '../../components/PlainForm'
import ContentLayout from '../../components/ContentLayout'
import {
  IMG_ORIGINAL,
  IMG_UPLOAD,
  IMG_SIZE_LIMIT,
  IMG_COMPRESS,
} from '../../utils/config'
import UserHead from '../../assets/lkc-user-head.png'

const propTypes = {
  personInfo: PropTypes.object,
  loading: PropTypes.object,
  form: PropTypes.object,
}
function PersonInfo({ personInfo, loading }) {
  const { toAction, getLoading } = getBasicFn({
    namespace: 'personInfo',
    loading,
  })
  const {
    modalVisible,
    modalType,
    modalInitValue,
    moreLength,
    personInfoObj,
    mobileTime,
    emailTime,
  } = personInfo
  const {
    addName,
    addTime,
    birthday,
    email,
    gender,
    imageUrl,
    lastLoginTime,
    mobile,
    realName,
    userName,
    belongsOrg = [],
  } = personInfoObj
  let genderText = ''
  if (gender === 0) {
    genderText = '女'
  } else if (gender === 1) {
    genderText = '男'
  } else {
    genderText = '不详'
  }
  const getBelongsOrg = () => {
    const ret = []
    belongsOrg.some((item, index) => {
      if (index < moreLength) {
        ret.push(<p key={index}>{item}</p>)
        return false
      }
      return true
    })
    return ret
  }
  const formData = new FormData()
  // 限制图片大小
  const handleBeforeUpload = (file) => {
    const isLtLimit = file.size / 1024 / 1024 < IMG_SIZE_LIMIT
    if (!isLtLimit) {
      Modal.error({
        content: `您只能上传小于${IMG_SIZE_LIMIT}MB的文件`,
        maskClosable: true,
      })
    } else {
      formData.append('files[]', file)
    }
    return isLtLimit
  }
  const LogoProps = {
    name: 'file',
    headers: {
      'X-Requested-With': null,
    },
    data: formData,
    action: `${IMG_UPLOAD}`,
    accept: '.jpg,.png,.bmp,.pdf',
    beforeUpload: handleBeforeUpload,
    showUploadList: false,
    onChange(info) {
      if (info.file.status === 'done') {
        toAction({ imgUrl: `${IMG_ORIGINAL}/${info.file.response.content}` }, 'imgUrl')
      } else if (info.file.status === 'error') {
        Modal.error({
          content: '图片上传失败',
          maskClosable: true,
        })
      }
    },
  }
  const leftData = {
    '用户名|fill': userName,
    '头像|fill': (
      <div>
        <div style={{ float: 'left' }}>
          <div>
            <Avatar size="large" src={(imageUrl ? `${imageUrl}` : '') || UserHead} />
          </div>
        </div>
        <div style={{ float: 'left' }}>
          <Upload {...LogoProps} className="aek-plr10">
            <a>{imageUrl ? '更换' : '上传'}</a>
          </Upload>
        </div>
      </div>
    ),
    '邮箱|fill': (
      <div>
        <div>
          {email || '无'}
          {email ? (
            <a
              className="aek-ml10"
              onClick={() => {
                toAction({
                  modalType: 'reMail',
                  modalVisible: true,
                  modalInitValue: {
                    userName,
                  },
                })
              }}
            >
              更换邮箱
            </a>
          ) : (
            <a
              className="aek-ml10"
              onClick={() => {
                toAction({
                  modalType: 'mailForm',
                  modalVisible: true,
                  modalInitValue: {
                    userName,
                  },
                })
              }}
            >
              绑定邮箱
            </a>
          )}
        </div>
      </div>
    ),
    '手机|fill': (
      <div>
        <div>
          {mobile}
          <a
            className="aek-ml10"
            onClick={() => {
              toAction({
                modalType: 'rePhone',
                modalVisible: true,
                modalInitValue: {
                  userName,
                },
              })
            }}
          >
            更换手机号
          </a>
        </div>
      </div>
    ),
    '真实姓名|fill': realName,
    '出生日期|fill': birthday,
    '性别|fill': genderText,
    '所属机构|fill': (
      <div>
        <div>{getBelongsOrg()}</div>
        <div>
          {belongsOrg.length > 1 ? (
            <a
              onClick={() => {
                toAction({ moreLength: moreLength - 1 ? 1 : belongsOrg.length })
              }}
            >
              {moreLength - 1 ? '收起↑' : '更多↓'}
            </a>
          ) : null}
        </div>
      </div>
    ),
  }
  const rightData = {
    '创建人|fill': addName,
    '创建时间|fill': addTime,
    '最后登录时间|fill': lastLoginTime,
  }

  const modalProps = {
    modalType,
    visible: modalVisible,
    modalInitValue,
    confirmLoading: getLoading('editPersonInfo', 'rePassword'),
    mobileTime,
    emailTime,
    timeLoading: getLoading('bymobile', 'byemail'),
    toAction,
    onCancel() {
      toAction({ modalVisible: false })
    },
    onOk(value, type) {
      toAction(value, type === 'mailForm' ? 'reMail' : type)
    },
  }
  const editPersonInfo = () => {
    toAction({
      modalType: 'editPersonInfo',
      modalVisible: true,
      modalInitValue: {
        userName,
        realName,
        birthday,
        gender,
      },
    })
  }
  const rePassword = () => {
    toAction({
      modalType: 'rePassword',
      modalVisible: true,
      modalInitValue: {
        userName,
      },
    })
  }
  const content = (
    <Spin spinning={getLoading('getPersonInfo')}>
      <div className="aek-content-title">个人信息</div>
      <Row>
        <Col span={12}>
          <PlainForm data={leftData} />
        </Col>
        <Col span={12}>
          <PlainForm data={rightData} />
        </Col>
      </Row>
      <ModalForm {...modalProps} />
    </Spin>
  )
  const contentLayoutProps = {
    breadLeft: [{ name: 'Breadcrumb' }],
    breadRight: [
      <a onClick={editPersonInfo}>
        <Icon type="edit" />&nbsp;&nbsp;编辑个人信息
      </a>,
      <a onClick={rePassword}>
        <Icon type="lock" />&nbsp;&nbsp;修改密码
      </a>,
    ],
    content,
  }
  return <ContentLayout {...contentLayoutProps} />
}
PersonInfo.propTypes = propTypes
export default connect(({ personInfo, loading }) => ({ personInfo, loading }))(PersonInfo)
