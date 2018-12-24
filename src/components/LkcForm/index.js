import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Form } from 'antd'
import { isPlainObject } from 'lodash'
import ViewFormItem from './ViewFormItem'
import scrollToTop from './scrollToTop'
import getComponent from './getComponent'
import { getConfig } from '../UploadButton'

const propTypes = {
  formData: PropTypes.array,
  allView: PropTypes.bool,
  style: PropTypes.object,
  className: PropTypes.string,
  getFieldDecorator: PropTypes.func,
  onSubmit: PropTypes.func,
}

const LkcForm = ({
  formData,
  className,
  allView = false,
  style = {},
  getFieldDecorator,
  onSubmit,
}) => {
  const FormItem = Form && Form.Item
  const getCol = ({ col, width, style: itemStyle }) => {
    if (width) {
      return { style: {
        float: 'left',
        verticalAlign: 'top',
        display: 'inline-block',
        ...itemStyle,
        width,
      } }
    }
    if (typeof col === 'number') {
      return { span: col }
    } else if (Array.isArray(col)) {
      return { sm: col[0], xs: col[0], md: col[0], lg: col[1], xl: col[2] }
    }
    return { span: 24 }
  }
  const getInitValueObj = (fmData) => {
    const retObj = {}
    fmData.forEach((item) => {
      if (item && !React.isValidElement(item)) {
        const { field, options: { initialValue } = {} } = item
        retObj[field] = initialValue
      }
    })
    return retObj
  }
  const initValueObj = getInitValueObj(formData)
  const getFormItem = (fmData) => {
    const formItemArr = []
    fmData.forEach((itm, index) => {
      const item = itm
      if (React.isValidElement(item)) {
        formItemArr.push(<div style={{ clear: 'both' }} key={index}>{item}</div>)
      } else if (item && !item.exclude) {
        const baseProps = {
          label: item.label,
          ...item.layout,
          ...item.otherProps,
        }
        if (isPlainObject(item.options) && ('imgSrc' in item.options)) {
          if (!allView && !item.view) {
            const validator = {
              validator: (_, value, callback) => {
                if (value.some(({ status }) => status !== 'done')) {
                  callback('图片上传中，请稍等')
                }
                callback()
              },
            }
            if (item.options.rules) {
              item.options.rules.push(validator)
            } else {
              item.options.rules = [validator]
            }
            item.options = {
              ...item.options,
              ...getConfig(item.options.imgSrc),
            }
          } else {
            item.options.initialValue = item.options.imgSrc
            item.viewType = 'img'
          }
          delete item.options.imgSrc
        }
        formItemArr.push(
          <Col style={{ verticalAlign: 'top', display: 'inline-block', ...item.style }} {...getCol(item)} key={item.field || index}>
            {!allView && !item.view ?
              <FormItem {...baseProps}>
                {typeof item.field === 'string' ?
                  getFieldDecorator(item.field, item.options)(getComponent(item.component)) :
                  getComponent(item.component)}
              </FormItem> :
              <ViewFormItem
                {...baseProps}
                initialValue={item.options.initialValue}
                initValueObj={initValueObj}
                view={item.view}
              />
            }
          </Col>,
        )
      }
    })
    return formItemArr
  }
  return (
    <Form
      className={className}
      style={style}
      onSubmit={onSubmit ? (e) => { e.preventDefault(); onSubmit() } : undefined}
    >
      <Row style={{ overflow: 'hidden', verticalAlign: 'top' }}>
        {getFormItem(formData)}
      </Row>
    </Form>
  )
}

LkcForm.propTypes = propTypes
LkcForm.scrollToTop = scrollToTop
export default LkcForm
