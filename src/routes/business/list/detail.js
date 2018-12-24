/** 详情 */
import React from 'react'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import { Button, Tag } from 'antd'

import Breadcrumb from '../../../components/Breadcrumb'
import BusinessDetail from '../shared/businessDetail'
import SessionList from '../shared/sessionList'
import ReplyList from '../shared/replyList'
import ReplyModal from '../shared/replyModal'

import { getBasicFn } from '../../../utils'
import Styles from '../shared/index.less'

const propTypes = {
  businessPurchaseDetail: PropTypes.object,
  loading: PropTypes.object,
}
const namespace = 'businessPurchaseDetail'
const PurchaseDetail = ({ businessPurchaseDetail, loading }) => {
  const {
    showReplyList,
    detail,
    sessionList,
    replyList,
    replyVisible,
    replyModalVisible,
    currentReplyId,
    isPublisher,
    showNumber,
    publisherInfo,
  } = businessPurchaseDetail
  const { chanceId, chanceContactOpenFlag } = detail
  const { dispatchAction, getLoading } = getBasicFn({ namespace, loading })
  const replyBtn = replyVisible && (
    <span
      onClick={() => {
        dispatchAction({ type: 'updateState', payload: { replyModalVisible: true } })
      }}
    >
      回复
    </span>
  )
  const contactBtn = isPublisher === 'false' &&
    chanceContactOpenFlag && (
      <span>
        {showNumber ? (
          <Button type="primary">
            {publisherInfo.chanceContactName} - {publisherInfo.chanceContactPhone}
          </Button>
        ) : (
          <Button
            type="primary"
            loading={getLoading('getContact')}
            onClick={() => {
              dispatchAction({ type: 'getContact', payload: { chanceId } })
            }}
          >
            获取联系方式
          </Button>
        )}
      </span>
    )
  const replyModalprops = {
    visible: replyModalVisible,
    cancelHandler: () => {
      dispatchAction({ type: 'updateState', payload: { replyModalVisible: false } })
    },
    okHandler: (values) => {
      dispatchAction({ type: 'reply', payload: values })
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
            <BusinessDetail detail={detail} loading={getLoading('getDetail')} replyBtn={replyBtn} />
            <div className={Styles.contact}>{contactBtn}</div>
            <SessionList data={sessionList} loading={getLoading('getSessionList')} />
          </div>
          {showReplyList && (
            <div
              className={Styles.right}
              style={{ backgroundColor: '#ffffff', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}
            >
              <ReplyList
                replyList={replyList}
                loading={getLoading('getReplyList')}
                itemClick={(replayId) => {
                  dispatchAction({ type: 'updateState', payload: { currentReplyId: replayId } })
                  dispatchAction({ type: 'getSessionList', payload: { replayId } })
                }}
                currentReplyId={currentReplyId}
              />
            </div>
          )}
        </div>
        <ReplyModal {...replyModalprops} />
      </div>
    </div>
  )
}

PurchaseDetail.propTypes = propTypes
export default connect(({ businessPurchaseDetail, loading }) => ({
  businessPurchaseDetail,
  loading,
}))(PurchaseDetail)
