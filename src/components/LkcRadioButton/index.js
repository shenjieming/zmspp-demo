import React from 'react'
import PropTypes from 'prop-types'
import { Tooltip } from 'antd'
import Styles from './index.less'

const propTypes = {
  options: PropTypes.array,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ]),
  defaultValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ]),
  onChange: PropTypes.func,
  handClick: PropTypes.func,
}

class LkcRadioButton extends React.Component {
  constructor(props) {
    super(props)
    const value = this.props.value || this.props.defaultValue
    this.state = { value }
  }

  componentWillMount() {
    const { onChange } = this.props
    const { value } = this.state
    if (onChange && value) {
      onChange(value)
    }
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const value = nextProps.value
      this.setState({ value })
    }
  }

  getTagList = () => {
    const handClick = (e, item) => {
      e.preventDefault()
      this.handleClick(item)
    }
    const { value } = this.state
    const { options } = this.props
    return options.map((item) => {
      let flag = false
      if (value && value.key && item.value === value.key) {
        flag = true
      }
      const retDom = (
        <div
          key={item.value}
          className={`${Styles['tag-list']} ${flag ? Styles['tag-list-selected'] : ''}`}
        >
          <a onClick={
            (e) => {
              handClick(e, { key: item.value, label: item.label })
            }
          }
          >{item.label}</a>
        </div>
      )
      // 判断时候有title 从而有文字提示
      if (item.title) {
        return (<Tooltip trigger="hover" key={item.value}>
          {retDom}
        </Tooltip>)
      }
      return retDom
    })
  }

  handleClick = (item) => {
    const { onChange, handClick } = this.props
    if (handClick) {
      handClick()
    }
    if (onChange) {
      onChange(item)
    }
  }

  render() {
    return (
      <div>
        {this.getTagList()}
      </div>
    )
  }
}

LkcRadioButton.propTypes = propTypes
export default LkcRadioButton
