import React from 'react'
import PropTypes from 'prop-types'
import { withRouter, Link } from 'dva/router'
import styles from './page.less'
import logo from '../../assets/logo-white.png'
import { footerText } from '../../utils/config'

function LoginPage({ children }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <img className={styles.logo} src={logo} alt="医储" />
        <div className={styles.title}>
          <Link to="/login" className={styles.title}>登录</Link>
          <span className={`aek-mlr15 ${styles.title}`}>|</span>
          <Link to="/regist" className={styles.title}>注册</Link>
        </div>
      </div>
      <div className={styles.content}>
        {children}
      </div>
      <div className={styles.footer}>
        <div className={styles.footerText}>
          {footerText.split('\n').map((text, i) => <div key={i}>{text}</div>)}
        </div>
      </div>
    </div>
  )
}

LoginPage.propTypes = {
  children: PropTypes.node.isRequired,
}

export default withRouter(LoginPage)
