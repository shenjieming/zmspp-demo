import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'dva/router'
import styles from './index.less'
import logo from '../../assets/logo-white.png'
import { footerText } from '../../utils/config'

function LoginPage({ children }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <img className={styles.logo} src={logo} alt="零库存" />
        <span className={styles.title}>
          <Link to="/login">登录</Link><span className="aek-plr15">|</span><Link to="/regist">注册</Link>
        </span>
      </div>
      <div className={styles.content}>
        <div className={styles.contentWrap}>
          <div className={styles.innerWrap}>
            <div className={styles.text}>
              {/*<div className="aek-pb20">用智慧服务优化医疗产业链</div>*/}
              {/*<div>通过“互联网+”时代的“医疗智慧服务”</div>*/}
              {/*<div>采用信息和通信技术手段感测、分析、整合医疗产业运行核心的关键信息</div>*/}
              {/*<div>从而为医疗机构、企业提供全方位医疗物资供应链信息服务</div>*/}
            </div>
            <div className={styles.form}>{children}</div>
          </div>
        </div>
      </div>
      {/*<div className={styles.footer}>*/}
        {/*<div className={styles.footerText}>*/}
          {/*{footerText.split('\n').map((text, i) => <div key={i}>{text}</div>)}*/}
        {/*</div>*/}
      {/*</div>*/}
    </div>
  )
}

LoginPage.propTypes = {
  children: PropTypes.node.isRequired,
}

export default LoginPage
