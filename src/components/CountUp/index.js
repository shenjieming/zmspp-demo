// @flow

import React from 'react'
import Count from 'countup.js'
import PropTypes from 'prop-types'

// Adapted from the countup.js format number function
// https://github.com/inorganik/countUp.js/blob/master/countUp.js#L46-L60
export const formatNumber = (start, options) => {
  const num = `${start.toFixed(options.decimals)}`
  const x = num.split('.')
  let x1 = x[0]
  const x2 = x.length > 1 ? `${options.decimal}${x[1]}` : ''
  const rgx = /(\d+)(\d{3})/

  if (options.useGrouping && options.separator) {
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, `$1${options.separator}$2`)
    }
  }
  return `${options.prefix}${x1}${x2}${options.suffix}`
}

export const startAnimation = (component) => {
  if (!(component && component.spanElement)) {
    throw new Error(
      'You need to pass the CountUp component as an argument!\neg. this.myCountUp.startAnimation(this.myCountUp);',
    )
  }

  const {
    decimal,
    decimals,
    duration,
    easingFn,
    end,
    formattingFn,
    onComplete,
    onStart,
    prefix,
    separator,
    start,
    suffix,
    useEasing,
    useGrouping,
  } = component.props

  const countupInstance = new Count(component.spanElement, start, end, decimals, duration, {
    decimal,
    easingFn,
    formattingFn,
    separator,
    prefix,
    suffix,
    useEasing,
    useGrouping,
  })

  if (typeof onStart === 'function') {
    onStart()
  }

  countupInstance.start(onComplete)

  return countupInstance
}

export default class CountUp extends React.Component {
  static defaultProps = {
    className: undefined,
    decimal: '.',
    decimals: 0,
    duration: 3,
    easingFn: null,
    end: 100,
    formattingFn: null,
    onComplete: undefined,
    onStart: undefined,
    prefix: '',
    separator: ',',
    start: 0,
    suffix: '',
    redraw: false,
    style: undefined,
    useEasing: true,
    useGrouping: false,
  }

  static propTypes = {
    className: PropTypes.string,
    decimal: PropTypes.string,
    decimals: PropTypes.number,
    duration: PropTypes.number,
    end: PropTypes.number,
    onComplete: PropTypes.func,
    prefix: PropTypes.string,
    redraw: PropTypes.bool,
    separator: PropTypes.string,
    start: PropTypes.number,
    style: PropTypes.object,
    suffix: PropTypes.string,
    useGrouping: PropTypes.bool,
  }

  componentDidMount() {
    this.countupInstance = startAnimation(this)
  }

  shouldComponentUpdate(nextProps) {
    const hasCertainPropsChanged =
      this.props.duration !== nextProps.duration ||
      this.props.end !== nextProps.end ||
      this.props.start !== nextProps.start

    return nextProps.redraw || hasCertainPropsChanged
  }

  componentDidUpdate() {
    if (this.countupInstance) {
      this.countupInstance.reset()
      this.countupInstance.start(this.props.onComplete)
    } else {
      this.countupInstance = startAnimation(this)
    }
  }

  componentWillUnmount() {
    this.countupInstance.pauseResume()
  }

  countupInstance = null

  spanElement = null

  refSpan = (span) => {
    this.spanElement = span
  }

  render() {
    const {
      className,
      start,
      decimal,
      decimals,
      useGrouping,
      separator,
      prefix,
      suffix,
      style,
    } = this.props

    return (
      <span className={className} ref={this.refSpan} style={style}>
        {formatNumber(start, {
          decimal,
          decimals,
          useGrouping,
          separator,
          prefix,
          suffix,
        })}
      </span>
    )
  }
}
