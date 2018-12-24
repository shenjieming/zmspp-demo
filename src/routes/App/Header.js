import React from 'react'
import PropTypes from 'prop-types'
import { Menu, Icon, Avatar, Dropdown, Badge } from 'antd'
import { Link } from 'dva/router'
import yibeiLogo from '@assets/yibei-logo.svg'
import { logoText, IMG_COMPRESS, isYibei } from '../../utils/config'
import logoUrl from '../../assets/logo-white.png'
import defaultStyles from './Header.less'
import YBStyles from './Header-yibei.less'
import MessagePanel from './MessagePanel'
import { CHOOSE_ORG_KEY } from './constant'

let styles
let logo

/* 切换主题 */
if (isYibei) {
  styles = YBStyles
  logo = yibeiLogo
} else {
  styles = defaultStyles
  logo = logoUrl
}

const MenuItem = Menu.Item

function Header({ user, orgInfo, orgList, logout, switchOrg, messagePanelProps, baseConfigMenu }) {
  const handleClickMenu = (item) => {
    const { key } = item
    if (key === 'logout') {
      logout()
    }
  }

  const { userImageUrl } = user

  const userIcon = typeof userImageUrl === 'string' ? userImageUrl + IMG_COMPRESS : userImageUrl

  return (
    <div className={styles.header}>
      <div className={styles.logo}>
        <Link to="/">
          <img src={logo} title={logoText} alt={logoText} />
        </Link>
      </div>
      <div className={styles.rightWrapper}>
        <Dropdown
          trigger={['click']}
          overlay={
            <Menu onClick={switchOrg}>
              {orgList.map(({ orgName, orgLogoUrl, orgId, isDefaultOrg }) => {
                const orgLogo =
                  typeof orgLogoUrl === 'string' ? orgLogoUrl + IMG_COMPRESS : orgLogoUrl

                return (
                  <MenuItem key={orgId}>
                    <div>
                      <div className={styles.selected}>
                        {orgId === orgInfo.orgId && <Badge status="success" />}
                      </div>
                      <Avatar
                        className="aek-avatar-border"
                        src={orgLogo}
                        style={{ verticalAlign: 'middle' }}
                      />
                      {isDefaultOrg && <span className={styles.default}>默认</span>}
                      <span style={{ display: 'inline-block', paddingLeft: '.5em' }}>
                        {orgName}
                      </span>
                    </div>
                  </MenuItem>
                )
              })}
              {orgList.length > 1 && [
                <Menu.Divider key="divider" />,
                <MenuItem key={CHOOSE_ORG_KEY}>
                  <div className={styles.chooseBtn}>选择默认组织</div>
                </MenuItem>,
              ]}
            </Menu>
          }
        >
          <a className={styles.dropDown}>
            <span className={styles.username}>{orgInfo.orgName}</span>
            <Icon type="down" />
          </a>
        </Dropdown>
        <div className={styles.button}>
          <MessagePanel {...messagePanelProps} />
        </div>
        <Dropdown
          trigger={['click']}
          overlay={
            <Menu onClick={handleClickMenu}>
              {baseConfigMenu.map(({ key, name }) => (
                <MenuItem key={key}>
                  <Link to={`/${key}`}>{name}</Link>
                </MenuItem>
              ))}
              <MenuItem key="logout">
                <a className={styles.username}>注销</a>
              </MenuItem>
            </Menu>
          }
          placement="bottomCenter"
        >
          <a className={styles.dropDown}>
            <Avatar className={styles.userAvatar} size="large" src={userIcon} icon="user" />
            <span className={styles.username}>{user.userRealName}</span>
            <Icon type="down" />
          </a>
        </Dropdown>
      </div>
    </div>
  )
}

Header.propTypes = {
  user: PropTypes.object.isRequired,
  logout: PropTypes.func,
  switchOrg: PropTypes.func,
  orgInfo: PropTypes.object,
  orgList: PropTypes.array,
  messagePanelProps: PropTypes.object.isRequired,
  baseConfigMenu: PropTypes.array,
}

export default Header
