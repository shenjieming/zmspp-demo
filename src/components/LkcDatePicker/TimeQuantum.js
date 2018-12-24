import React from 'react'
import PropTypes from 'prop-types'
import { DatePicker } from 'antd'
import { cloneDeep } from 'lodash'
import moment from 'moment'

const propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.object])),
  defaultValue: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.object])),
  isMoment: PropTypes.bool,
  isRequired: PropTypes.bool,
  startRequired: PropTypes.bool,
  timeDifference: PropTypes.arrayOf(PropTypes.number),
  commonProps: PropTypes.object,
  startProps: PropTypes.object,
  endProps: PropTypes.object,
  style: PropTypes.object,
}

const getValue = (value) => {
  let [momentValueArr, strValueArr] = [[], []]
  if (Array.isArray(value) && value.length === 2) {
    value.forEach((item, index) => {
      if (typeof item === 'string' && item) {
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

class TimeQuantum extends React.Component {
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
  setDiffDate = (date, defaultValue, direction) => {
    const { timeDifference } = this.props
    if (timeDifference && timeDifference.length === 3 && date && !defaultValue) {
      const disposeData = typeof date === 'string'
        ? moment(date, 'YYYY-MM-DD')
        : cloneDeep(date)
      const diffArr = timeDifference.map(num => num * direction)
      const retDate = disposeData.add(diffArr[0], 'years').add(diffArr[1], 'months').add(diffArr[2], 'days')
      if (typeof date === 'string') {
        return retDate.format('YYYY-MM-DD')
      }
      return retDate
    }
    return defaultValue
  }
  startOnChange = (dateMoment, dateString) => {
    const { isRequired } = this.props
    let { momentValueArr, strValueArr } = this.state
    if (!strValueArr && isRequired) {
      momentValueArr = [dateMoment, this.setDiffDate(dateMoment, null, 1)]
      strValueArr = [dateString, this.setDiffDate(dateString, null, 1)]
      this.setState({ momentValueArr, strValueArr })
      if (strValueArr[1]) {
        this.triggerChange(momentValueArr, strValueArr)
      }
    } else {
      momentValueArr = [dateMoment, this.setDiffDate(dateMoment, (momentValueArr && momentValueArr[1]), 1)]
      strValueArr = [dateString, this.setDiffDate(dateString, (strValueArr && strValueArr[1]), 1)]
      this.setState({ momentValueArr, strValueArr })
      this.triggerChange(momentValueArr, strValueArr)
    }
  }
  endOnChange = (dateMoment, dateString) => {
    const { startRequired, isRequired } = this.props
    let { momentValueArr, strValueArr } = this.state
    if (!strValueArr && (startRequired || isRequired)) {
      momentValueArr = [this.setDiffDate(dateMoment, null, -1), dateMoment]
      strValueArr = [this.setDiffDate(dateString, null, -1), dateString]
      this.setState({ momentValueArr, strValueArr })
      if (strValueArr[0]) {
        this.triggerChange(momentValueArr, strValueArr)
      }
    } else {
      momentValueArr = [this.setDiffDate(dateMoment, (momentValueArr && momentValueArr[0]), -1), dateMoment]
      strValueArr = [this.setDiffDate(dateString, (strValueArr && strValueArr[0]), -1), dateString]
      this.setState({ momentValueArr, strValueArr })
      this.triggerChange(momentValueArr, strValueArr)
    }
  }
  triggerChange = (momentArr, strArr) => {
    const { onChange, isMoment } = this.props
    if (onChange) {
      const momentValueArr = momentArr.every(_ => !_) ? undefined : momentArr
      const strValueArr = strArr.every(_ => !_) ? undefined : strArr
      if (isMoment) {
        onChange(momentValueArr, strValueArr)
      } else {
        onChange(strValueArr, momentValueArr)
      }
    }
  }
  render() {
    const { commonProps, startProps, endProps, style } = this.props
    const { momentValueArr = [] } = this.state
    const startBasicsProps = {
      ...commonProps,
      ...startProps,
      style: { width: 'calc((100% - 24px) / 2)' },
      showToday: false,
      onChange: this.startOnChange,
      value: momentValueArr[0],
      disabledDate(startValue) {
        const endValue = momentValueArr[1]
        if (!startValue || !endValue) {
          return false
        }
        return startValue.format('YYYYMMDD') >= endValue.format('YYYYMMDD')
      },
    }
    const endBasicsProps = {
      ...commonProps,
      ...endProps,
      style: { width: 'calc((100% - 24px) / 2)' },
      showToday: false,
      onChange: this.endOnChange,
      value: momentValueArr[1],
      disabledDate(endValue) {
        const startValue = momentValueArr[0]
        if (!endValue || !startValue) {
          return false
        }
        return endValue.format('YYYYMMDD') <= startValue.format('YYYYMMDD')
      },
    }
    return (
      <div style={style}>
        <DatePicker {...startBasicsProps} />
        <span style={{ margin: '0 6px' }}>至</span>
        <DatePicker {...endBasicsProps} />
      </div>
    )
  }
}

TimeQuantum.propTypes = propTypes
export default TimeQuantum
