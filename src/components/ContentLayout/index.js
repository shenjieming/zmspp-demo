import React from 'react'
import PropTypes from 'prop-types'
import { Card } from 'antd'
import getComponent from '../GetFormItem/getComponent'

const propTypes = {
  breadLeft: PropTypes.array,
  breadRight: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  content: PropTypes.node,
  leftContent: PropTypes.any,
  otherContent: PropTypes.oneOfType([PropTypes.array, PropTypes.node]),
  customContent: PropTypes.arrayOf(PropTypes.shape({
    props: PropTypes.object,
    type: PropTypes.oneOf(['card', 'none', 'content']),
  })),
}

function ContentLayout({
  breadLeft, breadRight, content, leftContent, otherContent, customContent,
}) {
  const topMap = (dataArr, direction) => {
    if (Array.isArray(dataArr) && dataArr.length) {
      return dataArr
        .filter(_ => _)
        .map((item, index) => (
          <span
            style={index !== 0 ? { [`margin${direction}`]: 20 } : {}}
            key={index}
          >
            {getComponent(item)}
          </span>
        ))
    }
    return undefined
  }
  const bread = () => {
    if (breadLeft || breadRight) {
      return (
        <div className="bread">
          <div style={{ float: 'left' }}>{topMap(breadLeft, 'Right')}</div>
          <div style={{ float: 'right' }}>{topMap(breadRight, 'Left')}</div>
        </div>
      )
    }
    return undefined
  }
  const getContent = (arr, key = 0, isArr = false, end = true) => {
    if (React.isValidElement(arr)) {
      return (
        <div
          className="content"
          key={key}
          style={isArr
            ? {
              minHeight: 0,
              marginBottom: end ? 0 : 10,
            } : {}
          }
        >
          {arr}
        </div>
      )
    } else if (Array.isArray(arr)) {
      const length = arr.length
      return arr.map((item, index) => getContent(item, index, true, index === length - 1))
    }
    return null
  }
  const getCustomContent = objArr => Array.isArray(objArr) && objArr.map(({ contentType, exclude, ...props }, idx) => {
    if (exclude) return null
    if (contentType === 'content') {
      return (
        <div
          className="content"
          key={`content${idx}`}
          {...props}
        />
      )
    } else if (contentType === 'card') {
      return (
        <Card
          className="aek-card"
          bordered={false}
          noHovering
          key={`card${idx}`}
          {...props}
        />
      )
    }
    return <div key={`none${idx}`} {...props} />
  })
  const main = (
    leftContent ?
      (<div className="aek-layout-hor">
        <div className="left">{leftContent}</div>
        <div className="right">
          <div className="aek-layout">
            {bread()}
            {getContent(content)}
            {otherContent}
            {getCustomContent(customContent)}
          </div>
        </div>
      </div>) :
      (<div className="aek-layout">
        {bread()}
        {getContent(content)}
        {otherContent}
        {getCustomContent(customContent)}
      </div>)
  )
  return main
}

ContentLayout.propTypes = propTypes

export default ContentLayout
