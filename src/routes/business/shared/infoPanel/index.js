import React from 'react'
import { Avatar } from 'antd'
import propTypes from 'prop-types'
import styles from './index.less'
import { thousandSplit } from '../../../../utils'

const PropTypes = {
  data: propTypes.object,
}
const InfoPanel = ({ data }) => {
  const {
    userIcon,
    userRealName,
    chanceCombineNumber,
    chanceDraftNumber,
    chanceIntegralBlance,
    chanceNumber,
    orgName,
  } = data

  const transformNum = (num) => {
    if (num > 999) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num
  }
  return (
    <div className={styles.panel}>
      <Avatar className={styles.userAvatar} size="large" src={userIcon} icon="user" />
      <div className="aek-text-bold aek-font-large">{userRealName}</div>
      <div className="aek-font-middle" style={{ margin: '2px 0px' }}>
        {orgName}
      </div>
      <div className={styles.pointsBlock}>
        积分：{thousandSplit(chanceIntegralBlance, { intergeResult: true })}
      </div>
      <div className={styles.countContainer}>
        <div className={styles.countBlock}>
          <div className="aek-font-large aek-text-bold ">{transformNum(chanceNumber)}</div>
          <div className="aek-gray">需求发布</div>
        </div>
        <span className={styles.divider} />
        <div className={styles.countBlock}>
          <div className="aek-font-large aek-text-bold ">{transformNum(chanceDraftNumber)}</div>
          <div className="aek-gray">商机草稿</div>
        </div>
        <span className={styles.divider} />
        <div className={styles.countBlock}>
          <div className="aek-font-large aek-text-bold ">{transformNum(chanceCombineNumber)}</div>
          <div className="aek-gray">达成合作</div>
        </div>
      </div>
    </div>
  )
}

InfoPanel.propTypes = PropTypes
export default InfoPanel
