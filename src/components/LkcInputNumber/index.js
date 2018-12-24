import React from 'react'
import PropTypes from 'prop-types'
import { InputNumber, Tooltip } from 'antd'
import { cloneDeep } from 'lodash'

const propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  minPrecision: PropTypes.number,
  maxPrecision: PropTypes.number,
}
const defaultProps = {
  minPrecision: 2,
  maxPrecision: 4,
}

const formatNumber = (amount) => {
  const value = String(amount)
  const list = value.split('.')
  let num = list[0]
  let result = ''
  while (num.length > 3) {
    result = `,${num.slice(-3)}${result}`
    num = num.slice(0, num.length - 3)
  }
  if (num) {
    result = num + result
  }
  return `${result}${list[1] ? `.${list[1]}` : ''}`
}

let idIndex = 0
class LkcInputNumber extends React.Component {
  constructor(props) {
    super(props)
    const amount = this.props.value
    this.state = { amount, precision: 0, step: -1 }
    this.minPrecision = this.props.minPrecision || defaultProps.minPrecision
    this.maxPrecision = this.props.maxPrecision || defaultProps.maxPrecision
    idIndex += 1
    this.id = `LkcInputNumber${idIndex}`
  }
  componentWillMount() {
    const amount = this.props.defaultValue || this.props.value
    this.setState({ amount })
    if (amount === undefined) {
      this.setState({ precision: 0 })
    } else if (
      !String(Number(amount)).split('.')[1] ||
      String(Number(amount)).split('.')[1].length <= 2
    ) {
      this.setState({ precision: 2 })
    } else {
      this.setState({ precision: 4 })
    }
  }
  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const amount = nextProps.value
      this.setState({ amount })
    }
  }
  amountChange = (amount) => {
    const { onChange } = this.props
    let amountValue
    const reg = /^(0|[1-9][0-9]*)(\.[0-9]{0,4})?$/
    if (isNaN(amount) || (!!amount && !reg.test(String(amount)))) {
      amountValue = this.state.amount
    } else if (
      String(amount).split('.')[0] !== '0' &&
      String(amount)
        .split('.')[0]
        .startsWith('0')
    ) {
      amountValue = Number(amount)
    } else {
      amountValue = amount
    }
    if (!('value' in this.props)) {
      this.setState({ amount: amountValue, precision: 0 })
    }
    if (onChange) {
      onChange(amountValue)
    }
  }
  amountBlur = (event) => {
    const { onBlur } = this.props
    const { amount } = this.state
    if (amount === '' || amount === undefined) {
      this.setState({ precision: 0 })
    } else {
      // 根据位数设定精确度
      const amountString = String(amount)
      if (amountString.split('.')[1] && amountString.split('.')[1].length > 2) {
        this.setState({ precision: amountString.split('.')[1].length })
      } else {
        this.setState({ precision: 2 })
      }
    }
    if (onBlur) {
      onBlur(event)
    }
  }
  amountFocus = (event) => {
    const { onFocus } = this.props
    this.setState({ precision: 0, step: -1 })
    if (onFocus) {
      onFocus(event)
    }
  }
  render() {
    const { amount } = this.state
    const otherProps = cloneDeep(this.props)
    if (!this.state.precision) {
      delete otherProps.precision
    } else {
      otherProps.precision = this.state.precision
    }
    if (!this.state.step) {
      delete otherProps.step
    }
    const title =
      amount !== '' && amount !== undefined ? (
        <span style={{ minWidth: '50px', display: 'inline-block' }}>{formatNumber(amount)}</span>
      ) : (
        '请输入金额'
      )
    const props = {
      ...otherProps,
      min: 0,
      focusOnUpDown: true,
      value: amount,
      onChange: (value) => {
        this.amountChange(value)
      },
      onFocus: (event) => {
        this.amountFocus(event)
      },
      onBlur: (event) => {
        this.amountBlur(event)
      },
    }

    return (
      <span id={this.id}>
        <Tooltip
          trigger={['focus']}
          title={title}
          placement="topLeft"
          getPopupContainer={() => document.getElementById(`LkcInputNumber${idIndex}`)}
        >
          <InputNumber {...props} />
        </Tooltip>
      </span>
    )
  }
}

LkcInputNumber.propTypes = propTypes
export default LkcInputNumber
