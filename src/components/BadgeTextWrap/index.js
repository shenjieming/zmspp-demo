import React from 'react'
import PropTypes from 'prop-types'
import { Badge } from 'antd'
import Styles from './index.less'

function BadgeTextWrap({ status = '', text }) {
  return (
    <div className={Styles.wrap}>
      <div className={Styles.leftBadge}>
        <Badge status={status} text="" />
      </div>
      <p className={Styles.rightText}>{text}</p>
    </div>
  )
}

BadgeTextWrap.propTypes = {
  status: PropTypes.string,
  text: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
}

export default BadgeTextWrap
