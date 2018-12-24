/** 详情 */
import React from 'react'
import { connect } from 'dva'
import { routerRedux, withRouter } from 'dva/router'
import PropTypes from 'prop-types'
import { Form, Button, Spin, message, Modal } from 'antd'
import { isEmpty } from 'lodash'

import Breadcrumb from '../../components/Breadcrumb'
import GetFormItem from '../../components/GetFormItem'
import BusinessDetail from '../business/shared/businessDetail'
import SessionList from '../business/shared/sessionList'
import ReplyList from '../business/shared/replyList'

import { getBasicFn } from '../../utils'
import Styles from '../business/shared/index.less'
import { detailForm } from './props'
import ReachModal from '../business/shared/reachModal'

const confirm = Modal.confirm
const propTypes = {
  businessExamineDetail: PropTypes.object,
  loading: PropTypes.object,
  form: PropTypes.object,
  history: PropTypes.object,
}
const namespace = 'businessExamineDetail'
const PurchaseDetail = ({
  businessExamineDetail,
  loading,
  history,
  form: {
    validateFields,
    resetFields,
  },
}) => {
  const {
    chanceId,
    showReplyList,
    replyList,
    detail,
    sessionList,
    modalVisible, // 达成合作
  } = businessExamineDetail
  const { dispatchAction, getLoading } = getBasicFn({ namespace, loading })

  const showConfirm = (content, callback) => {
    confirm({
      content,
      onOk() {
        callback()
      },
    })
  }

  // 提交事件
  const submit = (type, payload = {}) => dispatchAction({
    type,
    payload,
  })
  // 第一次审核
  const firstButton = (
    <div className="aek-m20">
      <Button
        type="primary"
        className="aek-mr20"
        disabled={!detail.canReview}
        onClick={() => {
          validateFields((error, values) => {
            if (!error) {
              submit('refulsedSubmit', {
                ...values,
                chanceId,
                chanceVersionGuid: detail.chanceVersionGuid,
              }).then(() => {
                dispatchAction({
                  type: 'getDetail',
                  payload: {
                    chanceId,
                  },
                })
                message.success('操作成功')
              })
            }
          })
        }}
      >审核未通过</Button>
      <Button
        type="primary"
        className="aek-mr20"
        disabled={!detail.canReview}
        onClick={() => {
          validateFields((error, values) => {
            if (!error) {
              submit('pastSubmit', {
                ...values,
                chanceId,
                chanceVersionGuid: detail.chanceVersionGuid,
              }).then(() => {
                dispatchAction({
                  type: 'getDetail',
                  payload: {
                    chanceId,
                  },
                })
                message.success('操作成功')
              })
            }
          })
        }}
      >审核通过</Button>
      <Button
        type="primary"
        className="aek-mr20"
        disabled={detail.canReview}
        onClick={() => {
          submit('nextSubmit').then((content) => {
            resetFields()
            if (!isEmpty(content)) {
              dispatchAction(routerRedux.push(`/businessExamine/${content.chanceId}${showReplyList ? '?isPublisher=true' : ''}`))
            }
          })
        }}
      >下一条</Button>
    </div>
  )

  // 第二次审核按钮
  const buttons = [{
    type: 'canDelete',
    name: '删除',
    handleClick: () => {
      validateFields((error, values) => {
        if (!error) {
          showConfirm('确定要删除该条数据吗？', () => {
            submit('deleteSubmit', {
              ...values,
              chanceId,
              chanceVersionGuid: detail.chanceVersionGuid,
            }).then(() => {
              message.success('操作成功')
              history.go(-1)
            })
          })
        }
      })
    },
  }, {
    type: 'canGetCombine',
    name: '达成合作',
    handleClick: () => {
      dispatchAction({
        payload: {
          modalVisible: true,
        },
      })
    },
  }, {
    type: 'canManuallyEnd',
    name: '手动结束',
    handleClick: () => {
      validateFields((error, values) => {
        if (!error) {
          submit('handleEndSubmit', {
            ...values,
            chanceId,
            chanceVersionGuid: detail.chanceVersionGuid,
          }).then(() => {
            message.success('操作成功')
            history.go(-1)
          })
        }
      })
    },
  }, {
    type: 'canShield',
    name: '屏蔽',
    handleClick: () => {
      validateFields((error, values) => {
        if (!error) {
          submit('shieldSubmit', {
            ...values,
            chanceId,
            chanceVersionGuid: detail.chanceVersionGuid,
          }).then(() => {
            message.success('操作成功')
            history.go(-1)
          })
        }
      })
    },
  }, {
    type: 'canTopFlag',
    name: '置顶',
    handleClick: () => {
      validateFields((error, values) => {
        if (!error) {
          submit('topSubmit', {
            ...values,
            chanceId,
            chanceVersionGuid: detail.chanceVersionGuid,
            chanceTopFlag: !detail.chanceTopFlag,
          }).then(() => {
            message.success('操作成功')
            history.go(-1)
          })
        }
      })
    },
  }, {
    type: 'canGetCombineAgain',
    name: '重选机构',
    handleClick: () => {
      dispatchAction({
        payload: {
          modalVisible: true,
        },
      })
    },
  }]

  const getButton = () => {
    if (!isEmpty(detail)) {
      if (showReplyList) {
        const retArr = []
        for (const [key, value] of Object.entries(detail)) {
          buttons.forEach((items) => {
            if (key === items.type && value) {
              if (key === 'canTopFlag') {
                retArr.push(<Button className="aek-mr20" key={items.type} type="primary" onClick={items.handleClick}>
                  {detail.chanceTopFlag ? '取消置顶' : '置顶'}
                </Button>)
              } else {
                retArr.push(<Button className="aek-mr20" key={items.type} type="primary" onClick={items.handleClick}>
                  {items.name}
                </Button>)
              }
            }
          })
        }
        return (<div className="aek-m20">
          {retArr}
        </div>)
      }
      return firstButton
    }
    return undefined
  }

  const replyProps = {
    replyList,
    itemClick: (replayId) => {
      dispatchAction({
        type: 'getSessionList',
        payload: {
          replayId,
        },
      })
    },
    loading: getLoading('getReplyList'),
  }


  // 达成合作 弹框
  const reachModalProps = {
    loading: getLoading('combineSubmit'),
    modalVisible,
    handleCancel() {
      dispatchAction({
        payload: {
          modalVisible: false,
        },
      })
    },
    handleOk(values) {
      dispatchAction({
        type: 'combineSubmit',
        payload: {
          ...values,
          chanceId,
          chanceVersionGuid: detail.chanceVersionGuid,
        },
      }).then((() => {
        dispatchAction({
          payload: {
            modalVisible: false,
          },
        })
        message.success('操作成功')
        history.go(-1)
      }))
    },
    detail: {
      chanceIntentionOrgId: detail.chanceIntentionOrgId,
      chanceIntentionOrgName: detail.chanceIntentionOrgName,
      chanceRemark: detail.chanceRemark,
    },
  }
  return (
    <div className="aek-layout">
      <div className="bread">
        <Breadcrumb />
      </div>
      <div className={Styles.layout}>
        <div className={Styles.container}>
          <div
            className={showReplyList ? Styles.left : Styles.both}
            style={{ boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', backgroundColor: '#FAFAFA' }}
          >
            <BusinessDetail detail={detail} loading={getLoading('getDetail', 'nextSubmit')} />
            <SessionList data={sessionList} loading={getLoading('getSessionList')} />
            <Spin spinning={
              getLoading(['deleteSubmit',
                'getSessionList',
                'handleEndSubmit',
                'nextSubmit',
                'pastSubmit',
                'refulsedSubmit',
                'topSubmit',
                'shieldSubmit',
                'combineSubmit',
              ])
            }
            >
              <Form className="aek-p10">
                <GetFormItem
                  formData={detailForm(detail.chanceRemark)}
                />
              </Form>
              {getButton()}
            </Spin>
          </div>
          {showReplyList && (
            <div
              className={Styles.right}
              style={{ backgroundColor: '#ffffff', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}
            >
              <ReplyList {...replyProps} />
            </div>
          )}
        </div>
        <ReachModal {...reachModalProps} />
      </div>
    </div>
  )
}

const createForm = Form.create()(PurchaseDetail)

PurchaseDetail.propTypes = propTypes
export default connect(({ businessExamineDetail, loading, history }) => ({
  businessExamineDetail,
  loading,
  history,
}))(withRouter(createForm))
