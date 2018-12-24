import React from 'react'

class CountDown extends React.Component {
  constructor(props) {
    super(props)
    this.state = { count: props.start }
  }
  componentDidMount() {
    const that = this
    if (that.state.count <= 0) {
      that.setState({ count: 0 })
    } else {
      that.timeId = setInterval(() => {
        const nextCount = that.state.count - 1000
        if (nextCount < 0) {
          that.props.onComplete()
        }
        that.setState({ count: nextCount })
      }, 1000)
    }
  }
  componentWillUnmount() {
    clearInterval(this.timeId)
  }
  render() {
    const totalCount = this.state.count
    const day = parseInt(totalCount / (1000 * 60 * 60 * 24), 0)
    const hour = parseInt((totalCount % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60), 0)
    const minute = parseInt((totalCount % (1000 * 60 * 60)) / (1000 * 60), 0)
    const second = parseInt((totalCount % (1000 * 60)) / 1000, 0)
    const fixPre = (time) => {
      if (String(time).length < 2) {
        return `0${time}`
      }
      return time
    }
    return (
      totalCount > 0 &&
      totalCount < 604800000 && (
        <span style={{ marginLeft: '10px' }}>
          倒计时：{day}天{fixPre(hour)}小时{fixPre(minute)}分{fixPre(second)}秒
        </span>
      )
    )
  }
}

export default CountDown
