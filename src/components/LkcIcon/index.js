import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import styles from './index.less'

function LkcIcon({ type }) {
  if (type === 'vipService') {
    return (
      <i
        className={classnames('iconfont', { [`icon-${type}`]: !!type }, styles.vip)}
        style={{
          display: 'inline-block',
          fontSize: 'inherit',
          marginRight: '8px',
          width: '1em',
        }}
      />
    )
  }
  return (
    <i
      className={classnames('iconfont', { [`icon-${type}`]: !!type })}
      style={{
        display: 'inline-block',
        fontSize: 'inherit',
        marginRight: '8px',
        width: '1em',
      }}
    />
  )
}

LkcIcon.propTypes = {
  type: PropTypes.string.isRequired,
}

export default LkcIcon
