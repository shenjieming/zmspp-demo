import React from 'react'
import PropTypes from 'prop-types'
import styles from './index.less'

const errorPage = ({ onRefresh }) => (
  <div style={{ height: '100%', background: '#fff', overflow: 'hidden' }}>
    <div className={styles.nav}>订单确认</div>
    <div className={styles.content} style={{ padding: '10px' }} onClick={onRefresh}>
      <div className={styles.errorContent}>
        <div className={[styles.icon, styles.networkError].join(' ')} />
        <div className={styles.text}>加载失败，轻点屏幕重新加载哦</div>
      </div>
    </div>
  </div>
)

errorPage.propTypes = {
  onRefresh: PropTypes.func,
}

export default errorPage
