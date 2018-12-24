import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Radio, Alert } from 'antd'
import styles from './index.less'
import QuickLogin from './quickLogin'
import AccountLogin from './accountLogin'
import LoginPage from './LoginPage'

const Login = ({ login, dispatch }) => {
  const {
    passwordVisible,
    countDownStatus,
    quickLoginButtonLoading,
    accountLoginButtonLoading,
    tab,
    accountErrorText,
    quickErrorText,
  } = login

  // 帐号登录页属性
  const accountLoginProps = {
    handleAccountLogin: (values) => {
      dispatch({ type: 'login/update', payload: { accountErrorText: undefined } })
      dispatch({ type: 'login/accountLogin', payload: values })
    },
    passwordVisible,
    handlePasswordVisibleIconClick: () => {
      dispatch({ type: 'login/switchPasswordVisble' })
    },
    loginLoading: accountLoginButtonLoading,
    handleErrorTextChange: (text) => {
      dispatch({ type: 'login/update', payload: { accountErrorText: text } })
    },
  }

  // 快速登录页面属性
  const quickLoginProps = {
    handleQuickLogin: (values) => {
      dispatch({ type: 'login/update', payload: { quickErrorText: undefined } })
      dispatch({ type: 'login/quickLogin', payload: values })
    },
    countDownStatus,
    handleCountDownComplete: () => {
      dispatch({ type: 'login/countDownComplete' })
    },
    handleClickGetCaptcha: (payload) => {
      dispatch({ type: 'login/update', payload: { quickErrorText: undefined } })
      dispatch({ type: 'login/getMobileCaptcha', payload })
    },
    buttonLoading: quickLoginButtonLoading,
    handleErrorTextChange: (text) => {
      dispatch({ type: 'login/update', payload: { quickErrorText: text } })
    },
  }

  const radioGroupProps = {
    value: tab,
    style: { width: '100%' },
    size: 'large',
    onChange: (e) => {
      dispatch({
        type: 'login/update',
        payload: {
          tab: e.target.value,
          accountErrorText: undefined,
          quickErrorText: undefined,
          countDownStatus: false,
        },
      })
    },
  }

  return (
    <LoginPage>
      <div className={styles.login}>
        <Radio.Group {...radioGroupProps}>
          <Radio.Button value="account" className={styles.radio}>
            账户登录
          </Radio.Button>
          {/* <Radio.Button value="quick" className={styles.radio}>
            快速登录
          </Radio.Button> */}
        </Radio.Group>
        <div className={styles.formContent}>
          {tab === 'account' ? (
            <div>
              {accountErrorText && (
                <Alert type="error" message={accountErrorText} showIcon style={{ marginTop: 1 }} />
              )}
              <AccountLogin {...accountLoginProps} />
            </div>
          ) : (
            <div>
              {quickErrorText && (
                <Alert type="error" message={quickErrorText} showIcon style={{ marginTop: 1 }} />
              )}
              <QuickLogin {...quickLoginProps} />
            </div>
          )}
        </div>
      </div>
    </LoginPage>
  )
}

Login.propTypes = {
  login: PropTypes.object,
  dispatch: PropTypes.func,
  children: PropTypes.node,
  location: PropTypes.object,
}

export default connect(({ login }) => ({ login }))(Login)
