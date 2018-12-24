import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Tooltip } from 'antd'
import PhotoWall from '../../components/PhotoWall'
import Styles from './index.less'

function PlainForm({ data = {}, size = 2, itemStyle = {} }) {
  const singeSize = Math.round(24 / size)
  const list = []
  for (const [prop, value] of Object.entries(data)) {
    const filled = prop.includes('|fill')
    const imgFlag = prop.includes('|img')
    const wrapFlag = prop.includes('|nowrap')
    const exclude = prop.includes('|false')
    const colSpan = prop.includes('|colspan') && prop.split('|')[1].split('-')[1]
    const key = prop.split('|')[0]

    if (!exclude) {
      let content
      if (imgFlag) {
        content = <PhotoWall urls={value} />
      } else if (wrapFlag) {
        content = (
          <Tooltip title={value}>
            <p className="aek-text-overflow">{value}</p>
          </Tooltip>
        )
      } else {
        content = value
      }

      let span = singeSize
      if (filled) {
        span = 24
      }
      if (colSpan) {
        span = singeSize * Number(colSpan)
      }
      list.push(
        <Col className={Styles.row} span={span} key={key}>
          <div className={Styles.itemWrap} style={itemStyle}>
            <div className={Styles.itemKey} title={key}>
              {key}
              <span style={{ margin: '0 8px 0 2px' }}>:</span>
            </div>
            <div className={Styles.itemVal}>{content}</div>
          </div>
        </Col>,
      )
    }
  }
  return <Row>{list}</Row>
}

PlainForm.propTypes = {
  data: PropTypes.object,
  size: PropTypes.number,
  itemStyle: PropTypes.object,
}

export default PlainForm
