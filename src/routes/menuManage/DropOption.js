import React from 'react'
import PropTypes from 'prop-types'
import { Dropdown, Menu, Icon } from 'antd'

const DropOption = ({ onMenuClick, menuOptions = [], dropdownProps }) => {
  const menu = menuOptions.map(item => <Menu.Item key={item.key}>{item.name}</Menu.Item>)
  return (<Dropdown
    overlay={<Menu onClick={onMenuClick}>{menu}</Menu>}
    {...dropdownProps}
  >
    <a>更多<Icon type="down" /></a>
  </Dropdown>)
}

DropOption.propTypes = {
  onMenuClick: PropTypes.func,
  menuOptions: PropTypes.array.isRequired,
  dropdownProps: PropTypes.object,
}

export default DropOption
