import React from 'react'
import PropTypes from 'prop-types'
import { DatePicker } from 'antd'
import moment from 'moment'

const propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.object])),
  defaultValue: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.object])),
  isMoment: PropTypes.bool,
}

const getValue = (value) => {
  let [momentValueArr, strValueArr] = [[], []]
  if (Array.isArray(value) && value.length === 2) {
    value.forEach((item, index) => {
      if (typeof item === 'string') {
        momentValueArr[index] = moment(item, 'YYYY-MM-DD')
        strValueArr[index] = item
      } else if (typeof item === 'object' && item) {
        momentValueArr[index] = item
        strValueArr[index] = item.format('YYYY-MM-DD')
      }
    })
  }
  momentValueArr = momentValueArr.length ? momentValueArr : undefined
  strValueArr = strValueArr.length ? strValueArr : undefined
  return [momentValueArr, strValueArr]
}

class LkcRangePicker extends React.Component {
  constructor(props) {
    super(props)

    const value = this.props.value || this.props.defaultValue
    const [momentValueArr, strValueArr] = getValue(value)
    this.state = { momentValueArr, strValueArr }
  }
  componentWillMount() {
    const { onChange, value, isMoment } = this.props
    const { momentValueArr, strValueArr } = this.state
    if (onChange && Array.isArray(value) && value.length === 2) {
      const haveStrItem = value.some(item => (typeof item === 'string'))
      const haveMomentItem = value.some(item => (typeof item === 'object'))
      if (isMoment && haveStrItem) {
        onChange(momentValueArr, strValueArr)
      } else if (!isMoment && haveMomentItem) {
        onChange(strValueArr, momentValueArr)
      }
    }
  }
  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const value = nextProps.value || nextProps.defaultValue
      const [momentValueArr, strValueArr] = getValue(value)
      this.setState({ momentValueArr, strValueArr })
    }
  }
  RPChange = (momentValueArr, strValueArr) => {
    const { onChange, isMoment } = this.props
    let [momentArr, strArr] = []
    if (momentValueArr.length) {
      momentArr = momentValueArr
      strArr = strValueArr
    }
    if (!('value' in this.props)) {
      this.setState({ momentValueArr, strValueArr })
    }
    if (onChange) {
      if (isMoment) {
        onChange(momentArr, strArr)
      } else {
        onChange(strArr, momentArr)
      }
    }
  }
  render() {
    const { isMoment, ...otherProps } = this.props
    const { momentValueArr } = this.state
    const props = {
      ...otherProps,
      onChange: this.RPChange,
      value: momentValueArr,
    }

    return <DatePicker.RangePicker {...props} />
  }
}

LkcRangePicker.propTypes = propTypes
export default LkcRangePicker
