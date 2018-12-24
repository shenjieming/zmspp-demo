import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'antd'
import { noop } from 'lodash'

function MoveButton(props) {
  const {
    visible = false,
    leftButtonClick = noop,
    rightButtonClick = noop,
    buttonDisable = true,
  } = props

  return (
    <div style={{ display: 'inline-block', padding: '0 20px' }}>
      {
        (visible && !buttonDisable) && <div>
          <Button
            icon="left-square"
            onClick={leftButtonClick}
          >向前</Button>
          <span className="ant-divider" />
          <Button
            icon="right-square"
            onClick={rightButtonClick}
          >向后</Button>
        </div>
      }
    </div>
  )
}

MoveButton.propTypes = {
  visible: PropTypes.bool,
  leftButtonClick: PropTypes.func,
  rightButtonClick: PropTypes.func,
  buttonDisable: PropTypes.bool,
}

export default MoveButton
