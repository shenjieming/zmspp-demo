import React from 'react'
import { Badge } from 'antd'
import propTypes from 'prop-types'
import moment from 'moment'
import CountDown from '../countDown'
import styles from './index.less'
import Ellipsis from '../../../../components/Ellipsis'

const PropTypes = {
  detail: propTypes.object,
  onClick: propTypes.func,
  optionBtnGroup: propTypes.node,
  isCommon: propTypes.bool,
}
const Item = ({ detail, onClick, optionBtnGroup, isCommon = false }) => {
  const {
    chanceContent,
    chanceStatus,
    addTime,
    chanceId,
    chanceReleaseOrgName,
    chanceLookTotalNum,
    chanceReplyTotalNum,
    currentOrgReleaseFlag,
    chanceTopFlag,
    canShowTime,
    chanceTagText,
    replyNewReplyNumber,
    releaseNewReplyNumber,
    timeLeftMs,
    notGetCombineFlag,
  } = detail
  const rightTop = () => {
    const statusText = [
      '',
      '草稿',
      '待审核',
      '审核未过',
      '发布中',
      '手动结束',
      '逾期结束',
      '达成合作',
      '已屏蔽',
    ]
    let text = statusText[chanceStatus]
    if (notGetCombineFlag) {
      text = '未达成合作'
    }
    if (isCommon) {
      text = ''
    }
    let showBar = true
    if (isCommon && timeLeftMs > 604800000) {
      // 大于七天毫秒数
      showBar = false
    }
    let style = {}
    if (chanceStatus === 5 || chanceStatus === 6) {
      style = { backgroundColor: '#e2dade' }
    }
    if (chanceStatus === 8) {
      style = { backgroundColor: '#cd1616' }
    }
    return (
      showBar && (
        <div className={styles.rightTop} style={style}>
          {text}
          {canShowTime && (
            <CountDown
              start={timeLeftMs}
              end={0}
              useEasing
              onComplete={() => {
              }}
            />
          )}
        </div>
      )
    )
  }
  const viewAndReply = (
    <span>
      <span className={styles.iconBlock}>
        <span className={styles.eyesIcon} />
        <span className="aek-gray aek-ml-10 aek-font-middle">
          {' '}
          {chanceLookTotalNum > 999
            ? `${(chanceLookTotalNum / 1000).toFixed(1)}K`
            : chanceLookTotalNum}
        </span>
      </span>
      <span className={styles.divider} />
      <span className={styles.iconBlock}>
        <span className={styles.replyIcon} />
        <span className="aek-gray aek-ml-10 aek-font-middle">
          {' '}
          {chanceReplyTotalNum > 999
            ? `${(chanceReplyTotalNum / 1000).toFixed(1)}K`
            : chanceReplyTotalNum}
        </span>
      </span>
    </span>
  )
  const newMessage = () => {
    let showMessage
    if (currentOrgReleaseFlag) {
      showMessage = releaseNewReplyNumber > 0
    } else {
      showMessage = replyNewReplyNumber > 0
    }
    return (
      showMessage && (
        <div className={styles.newMessage}>
          <Badge status="error" />有新消息
        </div>
      )
    )
  }
  return (
    <div className={styles.item} style={chanceStatus === 8 ? { backgroundColor: '#fbfbfb' } : {}}>
      <div
        className={styles.main}
        onClick={() => {
          onClick({ chanceId, isPublisher: currentOrgReleaseFlag, replyNum: replyNewReplyNumber })
        }}
      >
        <div className={styles.title}>
          <div>
            {chanceTopFlag && <span className={styles.topIcon}>置顶</span>}
            <span className="aek-primary-color aek-font-large"> 【{chanceTagText}】 </span>
            <span className="aek-font-large aek-text-bold">{chanceReleaseOrgName}</span>
          </div>
          {rightTop()}
          <div className="aek-gray aek-font-small">
            {moment(new Date(addTime)).format('YYYY年MMMD日')}
          </div>
        </div>
        <div className={styles.content}>
          <Ellipsis length={300}>{chanceContent}</Ellipsis>
        </div>
      </div>
      <div className={styles.footer}>
        {viewAndReply}
        <div style={{ float: 'right', marginTop: '5px' }}>
          {optionBtnGroup}
          {newMessage()}
        </div>
      </div>
    </div>
  )
}

Item.propTypes = PropTypes
export default Item
