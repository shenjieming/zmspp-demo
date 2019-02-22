import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Helmet } from 'react-helmet'
import { Spin, Alert, message } from 'antd'
import { withRouter, Redirect } from 'dva/router'
import { get } from 'lodash'
import NProgress from 'nprogress'
import { openUrl, homePage } from '@config'
import { getBasicFn } from '@utils'
import logoSrc from '../../assets/logo.png'
import '../../themes/index.less'
import Header from './Header'
import styles from './Layout.less'
import Menus from './Menu'
import Error from '../error'
import ModalOrgInfo from './ModalOrgInfo'
import Contact from './Contact'
import ChooseDefaultModal from './ChooseDefaultModal'
import { CHOOSE_ORG_KEY } from './constant'

let lastPathname

function App(props) {
  const { children, location, dispatch, app, loading } = props

  const { toAction, getLoading, dispatchAction } = getBasicFn({
    namespace: 'app',
    loading,
  })
  const { pathname } = location

  if (openUrl.includes(pathname)) {
    return (
      <div style={{ height: '100%' }}>
        <Helmet>
          <link rel="icon" href={logoSrc} type="image/x-icon" />
        </Helmet>
        {children}
      </div>
    )
  }

  const {
    user,
    orgInfo,
    orgList,
    menuData,
    menuAuthData,
    menuSelectedKeys,
    baseConfigMenu,
    siderCollapsed,
    organizationInfo = {},
    constants: { addressList },
    chooseOrgModalVisible,
  } = app

  if (pathname !== '/') {
    if (lastPathname !== pathname) {
      NProgress.start()
      if (!loading.global) {
        NProgress.done()
        lastPathname = pathname
      }
    }
  } else {
    const homeApplication = get(menuData, ['0', 'key'])
    const firstMenu = get(menuData, ['0', 'children', '0', 'key'])
    let redirectPath = homePage

    if (firstMenu) {
      redirectPath = `/${homeApplication}/${firstMenu}`
    } else if (homeApplication) {
      redirectPath = `/${homeApplication}`
    }

    return <Redirect to={redirectPath} />
  }

  const { needCompleteInfo, auditStatus, orgIdSign } = organizationInfo

  const is404 = !menuAuthData.some(x => pathname.startsWith(x)) && pathname !== '/'

  const headerProps = {
    user,
    orgInfo,
    orgList,
    menuData,
    baseConfigMenu,
    logout() {
      dispatch({ type: 'app/logout' })
    },
    switchOrg(item) {
      const key = item.key
      if (key === CHOOSE_ORG_KEY) {
        dispatchAction({ type: 'updateState', payload: { chooseOrgModalVisible: true } })
      } else {
        dispatch({ type: 'app/switchOrg', payload: key }).then(() => {
          dispatch({ type: 'app/afterLogin' })
        })
      }
    },
    messagePanelProps: {
      dataSource: app.msgDataSource,
      handleSetAllRead: () => {
        dispatch({ type: 'app/setAllRead' })
      },
      setOneRead: (id) => {
        dispatch({
          type: 'app/setOneRead',
          payload: id,
        })
      },
    },
  }

  const getAlter = () => {
    const displayModal = () => {
      toAction({ needCompleteInfo: 0 }, 'organizationInfo')
    }
    const description = {
      0: (
        <span>
          您还未补全信息，请<a onClick={displayModal}>点击这里</a>进行补全
        </span>
      ),
      1: (
        <span>
          您补全的信息正在审核，<a
            onClick={() => {
              toAction({ orgIdSign }, 'getOrgAuditDetail')
              displayModal()
            }}
          >
            点击这里
          </a>查看详情
        </span>
      ),
      3: (
        <span>
          您补全的信息被拒绝，<a onClick={displayModal}>点击这里</a>查看详情并重新补全
        </span>
      ),
    }
    if (needCompleteInfo && [0, 1, 3].includes(auditStatus)) {
      const alertProps = {
        banner: true,
        showIcon: true,
        type: 'info',
        description: description[auditStatus],
        className: 'home-banner-alert',
      }
      return <Alert {...alertProps} />
    }
    return null
  }

  const content = is404 ? (
    <Error />
  ) : (
    <div style={{ height: '100%', overflow: 'hidden' }}>
      {getAlter()}
      {children}
    </div>
  )

  const modalOrgInfoProps = {
    toAction,
    organizationInfo,
    addressList,
    buttonLoading: getLoading('complementInfo'),
    bodyLoading: getLoading('dicKey', 'getOrgAuditDetail'),
  }

  const ChooseDefaultModalProps = {
    visible: chooseOrgModalVisible,
    dataSource: orgList,
    handleClose: () => {
      dispatchAction({ type: 'updateState', payload: { chooseOrgModalVisible: false } })
    },
    handleOk: (payload) => {
      dispatchAction({ type: 'chooseDefaultOrg', payload }).then(() => {
        dispatchAction({ type: 'updateState', payload: { chooseOrgModalVisible: false } })
        message.success('操作成功')
      })
    },
    loading: getLoading('chooseDefaultOrg'),
  }

  const menusProps = {
    menuData,
    collapsed: siderCollapsed,
    pathname,
    selectedKeys: menuSelectedKeys,
    handleSelect: ({ selectedKeys }) => {
      dispatchAction({ type: 'updateState', payload: { menuSelectedKeys: selectedKeys } })
    },
  }
  return (
    <div>
      <Helmet>
        <link rel="icon" href={logoSrc} type="image/x-icon" />
      </Helmet>
      <Spin spinning={getLoading('getMenuData')}>
        <div className={styles.layout}>
          <Header {...headerProps} />
          <div className={styles.content}>
            <div className={styles.sider}>
              <Menus {...menusProps} />
              <Contact className={styles.contact} />
            </div>
            <div className={styles.main}>{content}</div>
          </div>
        </div>
      </Spin>
      <ModalOrgInfo {...modalOrgInfoProps} />
      <ChooseDefaultModal {...ChooseDefaultModalProps} />
    </div>
  )
}

App.propTypes = {
  children: PropTypes.element.isRequired,
  location: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  loading: PropTypes.object.isRequired,
  app: PropTypes.object.isRequired,
}

export default withRouter(connect(({ app, loading }) => ({ app, loading }))(App))
