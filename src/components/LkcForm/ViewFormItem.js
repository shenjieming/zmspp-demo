import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'antd'
import PhotoWall from '../../components/PhotoWall'

const propTypes = {
  initialValue: PropTypes.any,
  label: PropTypes.string,
  labelCol: PropTypes.object,
  wrapperCol: PropTypes.object,
  initValueObj: PropTypes.object,
  viewRender: PropTypes.func,
  style: PropTypes.object,
  view: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape({
    render: PropTypes.func,
    type: PropTypes.oneOf(['img']),
    subside: PropTypes.bool,
  })]),
}

const defaultRender = (value) => {
  let reValue = value
  if (Array.isArray(value) && value.length) {
    reValue = value.join(',')
  } else if (typeof value === 'boolean') {
    reValue = value ? '是' : '否'
  } else if (React.isValidElement(value)) {
    reValue = value
  } else if (value && typeof value === 'object') {
    reValue = value.title || value.label
  }
  return reValue
}

const typeJudge = (value, type) => {
  if (type) {
    if (type === 'img') {
      return <PhotoWall urls={value} />
    }
  }
  return value
}

const ViewFormItem = ({
  label, labelCol, wrapperCol, initialValue, style,
  initValueObj, view,
}) => {
  const {
    render = defaultRender,
    type,
    subside = true,
  } = typeof view === 'object' ? view : {}
  return (
    <Row className="ant-form-item" style={style}>
      {
        labelCol && (
          <Col
            {...labelCol}
            className="ant-form-item-label aek-text-help"
            style={subside ? { lineHeight: 'normal' } : undefined}
          >
            {label}<span style={{ margin: '0 8px 0 2px' }}>:</span>
          </Col>
        )
      }
      <Col {...wrapperCol} className="ant-form-item-control-wrapper">
        <div className={subside ? undefined : 'ant-form-item-control'}>
          {typeJudge(render(initialValue, initValueObj), type)}
        </div>
      </Col>
    </Row>
  )
}

ViewFormItem.propTypes = propTypes

export default ViewFormItem
