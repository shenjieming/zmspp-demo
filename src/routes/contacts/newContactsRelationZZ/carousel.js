import React from 'react'
import PropTypes from 'prop-types'
import { Icon } from 'antd'
import { debounce } from 'lodash'
import style from './style.less'

const getItemNum = (allWidth, itemWidth, minMagin = 20) => {
  const maxNum = Math.floor(allWidth / itemWidth)
  const num = allWidth % itemWidth / maxNum < minMagin ? maxNum - 1 : maxNum
  const marginRight = (allWidth - itemWidth * num) / (num - 1)
  return [num, marginRight]
}

const getSize = (arr) => {
  const ret = [280, 280]
  if (arr[0] && arr[0].props && arr[0].props.style) {
    const itemStyle = arr[0].props.style
    ret[0] = parseInt(itemStyle.width, 10) || 280
    ret[1] = parseInt(itemStyle.height, 10) || 280
  }
  return ret
}

class Carousel extends React.Component {
  static propTypes = {
    itemArr: PropTypes.array,
    style: PropTypes.object,
  }

  static defaultProps = {
    itemArr: [],
    style: {},
  }

  state = {
    expand: false,
    width: window.innerWidth - 224,
    left: 0,
    liIndex: 0,
  }

  componentDidMount() {
    window.addEventListener('resize', this.listener)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.listener)
  }

  listener = debounce(() => {
    const ele = this.refs.aaa
    this.setState({
      width: ele ? ele.clientWidth : '100%',
      liIndex: 0,
      left: 0,
    })
  }, 200, { trailing: true })

  animate = (direction, liIndex, move) => {
    const newLiIndex = direction === 'left' ? liIndex - 1 : liIndex + 1
    this.setState({
      liIndex: newLiIndex,
      left: -newLiIndex * move,
    })
  }

  render() {
    const { left, liIndex, width, style: selfStyle } = this.state
    const { itemArr } = this.props
    const [itemWidth, height] = getSize(itemArr)
    const [showNum, marginRight] = getItemNum(width, itemWidth)
    const liNum = itemArr.length
    const liItemArr = itemArr.map((item, index) =>
      <li key={index} style={{ width: itemWidth, marginRight }}>{item}</li>)
    return liNum ?
      <div style={selfStyle}>
        <div className={style.carousel} ref="aaa" style={{ height }}>
          {
            showNum < liNum &&
              <div
                className={style.prev}
                style={{ height }}
                onClick={() => {
                  if (liNum > showNum && liIndex > 0) {
                    this.animate('left', liIndex, itemWidth + marginRight)
                  }
                }}
              >
                <Icon type="left" />
              </div>
          }
          <div className={style.ulcycWrap}>
            <ul style={{ left }}>{liItemArr}</ul>
          </div>
          {
            showNum < liNum &&
              <div
                className={style.next}
                style={{ height }}
                onClick={() => {
                  if (liNum > showNum && liIndex < liNum - showNum) {
                    this.animate('right', liIndex, itemWidth + marginRight)
                  }
                }}
              >
                <Icon type="right" />
              </div>
          }
        </div>
      </div> : null
  }
}

export default Carousel
