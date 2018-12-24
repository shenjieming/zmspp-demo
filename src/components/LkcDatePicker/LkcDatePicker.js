import React from 'react'
import PropTypes from 'prop-types'
import { DatePicker } from 'antd'
import moment from 'moment'

const propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  isMoment: PropTypes.bool,
}

const getValue = (value) => {
  let retArr = []
  if (typeof value === 'string') {
    retArr = [moment(value, 'YYYY-MM-DD'), value]
  } else if (typeof value === 'object' && value) {
    retArr = [value, value.format('YYYY-MM-DD')]
  }
  return retArr
}

class LkcDatePicker extends React.Component {
  constructor(props) {
    super(props)

    const value = this.props.value || this.props.defaultValue
    const [momentValue, strValue] = getValue(value)
    this.state = { momentValue, strValue }
  }
  componentWillMount() {
    const { onChange, value, isMoment } = this.props
    const { momentValue, strValue } = this.state
    if (onChange) {
      if (isMoment && (typeof value === 'string')) {
        onChange(momentValue, strValue)
      } else if (!isMoment && (typeof value === 'object')) {
        onChange(strValue, momentValue)
      }
    }
  }
  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const value = nextProps.value || nextProps.defaultValue
      const [momentValue, strValue] = getValue(value)
      this.setState({ momentValue, strValue })
    }
  }
  DPChange = (dateMoment, dateString) => {
    const { onChange, isMoment } = this.props
    let [momentValue, strValue] = []
    if (dateMoment) {
      [momentValue, strValue] = [dateMoment, dateString]
    }
    if (!('value' in this.props)) {
      this.setState({ momentValue, strValue })
    }
    if (onChange) {
      if (isMoment) {
        onChange(momentValue, strValue)
      } else {
        onChange(strValue, momentValue)
      }
    }
  }
  render() {
    const { isMoment, ...otherProps } = this.props
    const { momentValue } = this.state
    const props = {
      ...otherProps,
      onChange: this.DPChange,
      value: momentValue,
    }

    return <DatePicker {...props} />
  }
}

LkcDatePicker.propTypes = propTypes
export default LkcDatePicker
