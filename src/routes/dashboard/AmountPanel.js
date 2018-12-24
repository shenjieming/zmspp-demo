import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'antd'
import Styles from './AmountPanel.less'

function Panel(props) {
  const { data = {}, todayText } = props
  const { today = 0, lastWeek = 0, yesterday = 0 } = data

  return (
    <div className={Styles.wrap}>
      <div className="aek-text-help">
        <div className={Styles.circle} />
        <span>
          今日
          {todayText}
        </span>
      </div>
      <div className={Styles.today}>{today}</div>
      <Row>
        <Col span="12">
          <div className="aek-text-disable">昨日</div>
          <div className="aek-text-help">{yesterday}</div>
        </Col>
        <Col span="12">
          <div className="aek-text-disable">上周同期</div>
          <div className="aek-text-help">{lastWeek}</div>
        </Col>
      </Row>
    </div>
  )
}

Panel.propTypes = {
  data: PropTypes.object,
  todayText: PropTypes.string.isRequired,
}

export default Panel
