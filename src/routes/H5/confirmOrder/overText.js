import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styles from './overText.less'

class OverText extends Component {
  state = {
    openFlag: false,
  }

  onSwitch = () => {
    const flag = this.state.openFlag
    this.setState({
      openFlag: !flag,
    })
  }

  render() {
    let classNameStr = styles.overText

    if (this.state.openFlag) {
      classNameStr += ` ${styles.open}`
    }

    return (
      <div className={classNameStr}>
        {this.props.children}
        <div className={styles.switchBtn} onClick={this.onSwitch} />
      </div>
    )
  }
}

OverText.propTypes = {
  children: PropTypes.array,
}

export default OverText
