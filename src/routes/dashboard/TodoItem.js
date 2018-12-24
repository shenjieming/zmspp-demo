import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'dva/router'
import classnames from 'classnames'
import Styles from './index.less'

function Items(props) {
  const { list = [] } = props

  if (!list.length) {
    return <div className="aek-text-disable aek-mt10">暂无待办</div>
  }

  return (
    <div>
      {list.map(({ number, name, url, flag }, idx) => (
        <div className="aek-mt10" key={idx}>
          <Link to={url} className={Styles.link}>
            {name}
              (
            <span className={classnames(Styles.number, { 'aek-red': flag })}>{number}</span>
              )
          </Link>
        </div>
      ))}
    </div>
  )
}

Items.propTypes = {
  list: PropTypes.array,
}

export default Items
