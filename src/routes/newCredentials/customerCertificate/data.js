import React from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'antd'

const confirm = Modal.confirm


const MenuButton = ({ status, handleMenuClick }) => {
  const showConfirm = () => {
    confirm({
      content: `您确定要${status ? '启用' : '停用'}该证件吗？`,
      onOk() {
        handleMenuClick()
      },
    })
  }
  return (
    <span onClick={showConfirm}>
      {status ? (<a key="0" value="0">启用</a>)
        : (<a key="1" value="1">停用</a>)
      }
    </span>
  )
}
MenuButton.propTypes = {
  status: PropTypes.bool,
  handleMenuClick: PropTypes.func,
}
export default {
  MenuButton,
}
