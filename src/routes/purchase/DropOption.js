
import React from 'react'
import PropTypes from 'prop-types'
import { Dropdown, Icon, Menu } from 'antd'

const detailedChildren = <a>更多<Icon type="down" /></a>
const getMenu = (data) => {
  if (Array.isArray(data)) {
    return data.map(({ key, name }) => <Menu.Item key={key}>{name}</Menu.Item>)
  }
  return Object.entries(data).map(([key, name]) => <Menu.Item key={key}>{name}</Menu.Item>)
}

const propTypes = {
  onMenuClick: PropTypes.func,
  buttonStyle: PropTypes.object,
  dropdownProps: PropTypes.object,
  children: PropTypes.any,
  menuOptions: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]).isRequired,
}

function DropOption({ onMenuClick, menuOptions = [], dropdownProps, children = detailedChildren }) {
  const menu = getMenu(menuOptions)
  return (
    <Dropdown
      overlay={<Menu onClick={({ key }) => { onMenuClick(key) }}>{menu}</Menu>}
      {...dropdownProps}
    >{children}</Dropdown>
  )
}

DropOption.propTypes = propTypes
export default DropOption
