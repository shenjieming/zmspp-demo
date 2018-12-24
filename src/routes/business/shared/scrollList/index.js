import React from 'react'
import propTypes from 'prop-types'
import { debounce } from 'lodash'
import { Spin } from 'antd'

const PropTypes = {
  children: propTypes.node,
  noMore: propTypes.bool,
  useCapture: propTypes.bool, // 是 -在捕获阶段执行
  initialLoad: propTypes.bool,
  isReverse: propTypes.bool,
  threshold: propTypes.number,
  loadMore: propTypes.func,
  ref: propTypes.func,
  loader: propTypes.node,
  loading: propTypes.bool,
  currentPage: propTypes.number,
}
class Scroll extends React.Component {
  constructor(props) {
    super(props)
    this.state = { showAnchor: false, firstLoad: true }
    this.scrollListener = this.scrollListener.bind(this)
  }
  componentDidMount() {
    this.attachScrollListener()
    this.scrollListener()
  }
  componentDidUpdate() {
    this.attachScrollListener()
  }
  componentWillUnmount() {
    this.detachScrollListener()
  }
  attachScrollListener() {
    if (this.props.noMore) {
      return
    }
    const scrollEl = this.scrollComponent.parentNode
    scrollEl.addEventListener('mousewheel', this.mousewheelListener, this.props.useCapture)
    scrollEl.addEventListener('scroll', this.scrollListener, this.props.useCapture)
    scrollEl.addEventListener('resize', this.scrollListener, this.props.useCapture)
  }
  detachScrollListener() {
    const scrollEl = this.scrollComponent.parentNode
    scrollEl.removeEventListener('mousewheel', this.mousewheelListener, this.props.useCapture)
    scrollEl.removeEventListener('scroll', this.scrollListener, this.props.useCapture)
    scrollEl.removeEventListener('resize', this.scrollListener, this.props.useCapture)
  }
  mousewheelListener = (e) => {
    if (e.deltaY === 1) {
      e.preventDefault()
    }
  }
  scrollListener = debounce(() => {
    const el = this.scrollComponent
    const scrollEl = window

    if (this.props.noMore) {
      return
    }
    let offset
    if (false) {
      const doc = document.documentElement || document.body.parentNode || document.body
      const scrollTop = scrollEl.pageYOffset !== undefined ? scrollEl.pageYOffset : doc.scrollTop
      if (this.props.isReverse) {
        offset = scrollTop
      } else {
        offset = this.calculateTopPosition(el) + (el.offsetHeight - scrollTop - window.innerHeight)
      }
    } else if (this.props.isReverse) {
      offset = el.parentNode.scrollTop
    } else {
      offset = el.scrollHeight - el.parentNode.scrollTop - el.parentNode.clientHeight
    }

    if (offset < Number(this.props.threshold)) {
      // this.detachScrollListener()
      // Call loadMore after detachScrollListener to allow for non-async loadMore functions
      if (typeof this.props.loadMore === 'function') {
        let promise
        if (this.state.firstLoad) {
          promise = this.props.loadMore(this.props.currentPage)
        } else {
          promise = this.props.loadMore(this.props.currentPage + 1)
        }
        promise.then(() => {
          if (this.state.firstLoad) {
            this.setState({ firstLoad: false })
          }
        })
      }
    }
  }, 300)
  calculateTopPosition(el) {
    if (!el) {
      return 0
    }
    return el.offsetTop + this.calculateTopPosition(el.offsetParent)
  }
  render() {
    // 以下状态是组件自己用的，需要排除掉
    const {
      children,
      isReverse,
      ref,
      threshold,
      loadMore,
      initialLoad,
      loader,
      noMore,
      loading,
      currentPage,
      ...restProps
    } = this.props
    const showAnchor = this.state.showAnchor
    const props = {
      ...restProps,
      ref: (node) => {
        this.scrollComponent = node
        if (ref) {
          ref(node)
        }
      },
    }
    return (
      <div {...props}>
        {children}
        {loading && (
          <div style={{ textAlign: 'center' }}>
            <Spin spinning={loading} />
            <span style={{ marginLeft: '10px' }}>正在加载...</span>
          </div>
        )}
        {showAnchor && <span style={{ position: 'fixed', bottom: '100px' }}>回到顶部</span>}
      </div>
    )
  }
}

Scroll.propTypes = PropTypes
export default Scroll
