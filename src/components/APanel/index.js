import React from 'react'
import PropTypes from 'prop-types'
import Styles from './index.less'

function APanel({ title, children, style = {}, extra }) {
  return (
    <section className={Styles.wrap} style={{ ...style }}>
      {title && (
        <div className={Styles.titleWrap}>
          <h2 className={Styles.title}>{title}</h2>
          <div className={Styles.extra}>{extra}</div>
        </div>
      )}
      <div className={Styles.content}>{children}</div>
    </section>
  )
}

APanel.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  extra: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  style: PropTypes.object,
}

export default APanel
