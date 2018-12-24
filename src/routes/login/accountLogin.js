import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'dva/router'
import { Form, Input, Button, Icon } from 'antd'
import { get, trim } from 'lodash'
import styles from './index.less'

const USERNAME = 'userName'
const PASSWORD = 'password'

const AccountLogin = ({
  form: { getFieldDecorator, validateFields, setFieldsValue, getFieldValue },
  handleAccountLogin,
  passwordVisible,
  handlePasswordVisibleIconClick,
  loginLoading,
  handleErrorTextChange,
}) => (
  <Form
    hideRequiredMark
    onSubmit={(e) => {
      e.preventDefault()
      validateFields((errors, values) => {
        if (!errors) {
          handleAccountLogin(values)
        } else {
          const userNameErr = get(errors, [USERNAME, 'errors', '0', 'message'])
          const passwordErr = get(errors, [PASSWORD, 'errors', '0', 'message'])
          handleErrorTextChange(userNameErr || passwordErr)
        }
      })
    }}
  >
    <div className="aek-pt15">
      {getFieldDecorator(USERNAME, {
        validateTrigger: false,
        rules: [
          {
            transform: value => trim(value),
            required: true,
            message: '请输入您的帐号',
          },
        ],
      })(
        <Input
          size="large"
          placeholder="用户名/邮箱"
          prefix={<Icon type="user" />}
          suffix={
            getFieldValue(USERNAME) && (
              <Icon
                className={styles.visibleIcon}
                type="close"
                onClick={() => {
                  setFieldsValue({ [USERNAME]: undefined })
                }}
              />
            )
          }
        />,
      )}
    </div>
    <div className="aek-pt15">
      {getFieldDecorator(PASSWORD, {
        validateTrigger: false,
        validateFirst: true,
        rules: [
          {
            transform: value => trim(value),
            required: true,
            message: '请输入您的密码',
          },
          {
            transform: value => trim(value),
            min: 6,
            max: 20,
            message: '密码应在6-20位之间',
          },
          {
            validator: (rule, value, callback) => {
              if (/\s/.test(value.trim())) {
                callback('密码不能包含空格')
              } else {
                callback()
              }
            },
          },
        ],
      })(
        <Input
          size="large"
          type={passwordVisible ? 'text' : PASSWORD}
          className={styles.passwordInput}
          prefix={<Icon type="lock" />}
          suffix={
            <div>
              {getFieldValue(PASSWORD) && (
                <Icon
                  type="close"
                  className={styles.visibleIcon}
                  onClick={() => {
                    setFieldsValue({ [PASSWORD]: undefined })
                  }}
                />
              )}
              <Icon
                className={styles.visibleIcon}
                onClick={handlePasswordVisibleIconClick}
                type={passwordVisible ? 'eye' : 'eye-o'}
              />
            </div>
          }
          placeholder="6~20个字符"
        />,
      )}
    </div>
    <div className="aek-space-between" style={{ paddingTop: 5 }}>
      <Link to="/regist">立即注册</Link>
      <Link to="/forgetPasd" className={styles.forget}>
        忘记密码?
      </Link>
    </div>
    <div className="aek-mtb20">
      <Button
        className={styles.loginButton}
        type="primary"
        htmlType="submit"
        size="large"
        loading={loginLoading}
      >
        登录
      </Button>
    </div>
  </Form>
)

AccountLogin.propTypes = {
  form: PropTypes.object.isRequired,
  handleAccountLogin: PropTypes.func.isRequired,
  passwordVisible: PropTypes.bool.isRequired,
  handlePasswordVisibleIconClick: PropTypes.func.isRequired,
  loginLoading: PropTypes.bool.isRequired,
  handleErrorTextChange: PropTypes.func.isRequired,
}

export default Form.create()(AccountLogin)
