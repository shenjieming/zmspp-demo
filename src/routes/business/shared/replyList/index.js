import React from 'react'
import { Badge, Spin } from 'antd'
import propTypes from 'prop-types'
import styles from './index.less'

const PropTypes = {
  replyList: propTypes.array,
  loading: propTypes.bool,
  itemClick: propTypes.func,
  currentReplyId: propTypes.string,
}
const ReplyList = ({ replyList = [], loading, itemClick, currentReplyId }) => (
  <div>
    <div className={styles.listTitle}>回复列表</div>
    <Spin spinning={loading}>
      {replyList.map(item => (
        <div
          className={`${styles.item} ${currentReplyId === item.replayId ? styles.current : ''}`}
          key={item.replayOrgId}
          onClick={() => {
            item.releaseNewReplyNumber = 0
            itemClick(item.replayId)
          }}
        >
          {!!item.releaseNewReplyNumber && <Badge status="error" className={styles.badge} />}
          {item.replayOrgName}
        </div>
      ))}
    </Spin>
  </div>
)

ReplyList.propTypes = PropTypes
export default ReplyList
