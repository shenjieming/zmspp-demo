import React from 'react'
import PropTypes from 'prop-types'
import { LkcIcon } from '@components'
import classnames from 'classnames'
import { Menu } from 'antd'
import { NavLink } from 'dva/router'
import styles from './Menu.less'

const { SubMenu, Item } = Menu

function Menus({ collapsed, pathname, menuData = [], selectedKeys, handleSelect }) {
  const menus = (
    <Menu
      mode="inline"
      className={styles.menu}
      selectedKeys={selectedKeys}
      onSelect={handleSelect}
      style={{ paddingTop: 10 }}
    >
      {menuData.map(({ key, hasMenu, children, name }) => {
        const path = `/${key}`
        const title = (
          <div>
            <LkcIcon type={key} />
            {key === 'vipService' ? <span className="aek-orange">{name}</span> : name}
          </div>
        )

        if (hasMenu) {
          return (
            <SubMenu
              key={path}
              title={
                <NavLink
                  className={classnames(styles.link, 'aek-font-mid')}
                  to={path}
                  activeClassName={styles.activeLink}
                  onClick={e => e.preventDefault()}
                >
                  {title}
                </NavLink>
              }
            >
              {children.map((x) => {
                const to = `${path}/${x.key}`
                const linkProps = {
                  to,
                  className: styles.link,
                  activeClassName: styles.activeLink,
                  onClick: pathname === to ? e => e.preventDefault() : undefined,
                }

                return (
                  <Item key={to}>
                    <NavLink {...linkProps}>{x.name}</NavLink>
                  </Item>
                )
              })}
            </SubMenu>
          )
        }
        const linkProps = {
          to: path,
          className: classnames(styles.link, 'aek-font-mid'),
          activeClassName: styles.activeLink,
          onClick: pathname === path ? e => e.preventDefault() : undefined,
        }

        return (
          <Item key={path}>
            <NavLink {...linkProps}>{title}</NavLink>
          </Item>
        )
      })}
    </Menu>
  )

  return menus
}

Menus.propTypes = {
  collapsed: PropTypes.bool.isRequired,
  pathname: PropTypes.string.isRequired,
  menuData: PropTypes.array.isRequired,
  selectedKeys: PropTypes.array,
  handleSelect: PropTypes.func.isRequired,
}

export default Menus
