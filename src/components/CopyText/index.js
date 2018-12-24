import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Icon, Tooltip } from 'antd'
import CopyToClipboard from 'react-copy-to-clipboard'

class CopyText extends Component {
  static propTypes = {
    text: PropTypes.string,
  }

  state = {
    copied: false,
    title: '点击复制',
  }

  render() {
    const { text } = this.props
    const { copied, title } = this.state
    return (
      <span>
        {text && <CopyToClipboard
          text={text}
          style={{ cursor: 'pointer' }}
          onCopy={() => {
            this.setState({
              copied: true,
              title: '复制完成',
            })
            setTimeout(() => {
              this.setState({
                copied: false,
                title: '点击复制',
              })
            }, 1000)
          }}
        >
          <Tooltip title={title}>
            <span style={{ cursor: 'pointer' }}>
              {copied ? <Icon
                style={{ color: '#5cb85c' }}
                type="check-circle"
              /> : <Icon type="copy" />}
            </span>
          </Tooltip>
        </CopyToClipboard>}
      </span>
    )
  }
}

export default CopyText
