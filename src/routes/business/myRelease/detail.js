/** 详情 */
import React from 'react'
import { connect } from 'dva'
import PropTypes from 'prop-types'

import Breadcrumb from '../../../components/Breadcrumb'
import BusinessDetail from '../shared/businessDetail'
import SessionList from '../shared/sessionList'
import ReplyList from '../shared/replyList'
import ReplyModal from '../shared/replyModal'

import { getBasicFn } from '../../../utils'
import Styles from '../shared/index.less'

const propTypes = {
  myReleaseDetail: PropTypes.object,
  loading: PropTypes.object,
}
const namespace = 'myReleaseDetail'
const MyReleaseDetail = ({ myReleaseDetail, loading }) => {
  const {
    detail,
    sessionList,
    replyList,
    replyVisible,
    replyModalVisible,
    currentReplyId,
  } = myReleaseDetail
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
            className={Styles.left}
            style={{ boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', backgroundColor: '#FAFAFA' }}
          >
            <BusinessDetail detail={detail} loading={getLoading('getDetail')} replyBtn={replyBtn} />
            <SessionList data={sessionList} loading={getLoading('getSessionList')} />
          </div>
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
        </div>
        <ReplyModal {...replyModalprops} />
      </div>
    </div>
  )
}

MyReleaseDetail.propTypes = propTypes
export default connect(({ myReleaseDetail, loading }) => ({
  myReleaseDetail,
  loading,
}))(MyReleaseDetail)
