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
  viewType: PropTypes.string,
  subside: PropTypes.bool,
}

const defaultViewRender = (value) => {
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

const typeJudge = (value, viewType) => {
  if (viewType) {
    if (viewType === 'img') {
      return <PhotoWall urls={value} />
    }
  }
  return value
}

const ViewFormItem = ({
  label, labelCol, wrapperCol, initialValue, style,
  initValueObj, viewRender = defaultViewRender, viewType,
  subside,
}) => (
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
    <Col {...wrapperCol} className="ant-form-item-control-wrapper aek-word-break">
      <div className={subside ? undefined : 'ant-form-item-control'}>
        {typeJudge(viewRender(initialValue, initValueObj), viewType)}
      </div>
    </Col>
  </Row>
)

ViewFormItem.propTypes = propTypes

export default ViewFormItem
