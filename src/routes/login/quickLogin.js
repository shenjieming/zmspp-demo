import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, Icon } from 'antd'
import { Link } from 'dva/router'
import { get, trim } from 'lodash'
import { REGEXP_TELEPHONE } from '../../utils/constant'
import styles from './index.less'
import CountDown from '../../components/CountUp'

const MOBILE = 'mobile'
const CAPTCHA = 'verCode'

class QuickLogin extends React.Component {
  componentDidMount() {
    this.mount = true
  }

  componentWillUnmount() {
    this.mount = false
  }

  render() {
    const {
      form: { getFieldDecorator, validateFields, getFieldValue, setFieldsValue },
      handleQuickLogin,
      countDownStatus,
      handleCountDownComplete,
      buttonLoading,
      handleClickGetCaptcha,
      handleErrorTextChange,
    } = this.props

    const captchaClearIcon = getFieldValue(CAPTCHA) && (
      <Icon
        type="close"
        className={styles.visibleIcon}
        onClick={() => {
          setFieldsValue({ [CAPTCHA]: undefined })
        }}
      />
    )

    let captchaSuffix = (
      <div>
        {captchaClearIcon}
        <a
          onClick={() => {
            validateFields([MOBILE], (errors, values) => {
              if (errors) {
                handleErrorTextChange(get(errors, [MOBILE, 'errors', '0', 'message']))
              } else {
                handleClickGetCaptcha(get(values, MOBILE))
              }
            })
          }}
        >
          发送验证码
        </a>
      </div>
    )

    if (countDownStatus) {
      captchaSuffix = (
        <div>
          {captchaClearIcon}
          <CountDown
            className="aek-text-disable"
            start={60}
            end={0}
            duration={60}
            suffix="秒后重新发送"
            useEasing={false}
            onComplete={() => {
              if (this.mount) {
                handleCountDownComplete()
              }
            }}
          />
        </div>
      )
    }

    return (
      <Form
        hideRequiredMark
        onSubmit={(e) => {
          e.preventDefault()
          validateFields((errors, values) => {
            if (!errors) {
              handleQuickLogin(values)
            } else {
              const mobileErr = get(errors, [MOBILE, 'errors', '0', 'message'])
              const captchaErr = get(errors, [CAPTCHA, 'errors', '0', 'message'])
              handleErrorTextChange(mobileErr || captchaErr)
            }
          })
        }}
      >
        <div className="aek-pt15">
          {getFieldDecorator(MOBILE, {
            validateFirst: true,
            validateTrigger: false,
            rules: [
              {
                transform: value => trim(value),
                required: true,
                message: '请输入您的手机号码',
              },
              {
                transform: value => trim(value),
                pattern: REGEXP_TELEPHONE,
                message: '请输入正确的手机号码',
              },
            ],
          })(
            <Input
              size="large"
              placeholder="手机号是11位数字"
              prefix={<Icon type="mobile" />}
              suffix={
                getFieldValue(MOBILE) && (
                  <Icon
                    className={styles.visibleIcon}
                    type="close"
                    onClick={() => {
                      setFieldsValue({ [MOBILE]: '' })
                    }}
                  />
                )
              }
            />,
          )}
        </div>
        <div className="aek-pt15">
          {getFieldDecorator(CAPTCHA, {
            validateFirst: true,
            rules: [
              {
                transform: value => trim(value),
                required: true,
                message: '请输入验证码',
              },
              {
                transform: value => trim(value),
                validator: (rule, value, cb) => {
                  if (/[^\w]/.test(value)) {
                    cb('验证码必须是数字')
                  } else {
                    cb()
                  }
                },
              },
              {
                transform: value => trim(value),
                len: 4,
                message: '验证码的长度是4位',
              },
            ],
          })(
            <Input
              size="large"
              placeholder="请输入验证码"
              suffix={captchaSuffix}
              className={styles.captchaInput}
            />,
          )}
        </div>
        <div style={{ paddingTop: 5 }}>
          <Link to="/regist">立即注册</Link>
        </div>
        <div className="aek-mtb20">
          <Button
            type="primary"
            htmlType="submit"
            className={styles.loginButton}
            loading={buttonLoading}
            size="large"
          >
            登录
          </Button>
        </div>
      </Form>
    )
  }
}

QuickLogin.propTypes = {
  form: PropTypes.object.isRequired,
  handleQuickLogin: PropTypes.func.isRequired,
  handleCountDownComplete: PropTypes.func.isRequired,
  countDownStatus: PropTypes.bool.isRequired,
  handleClickGetCaptcha: PropTypes.func.isRequired,
  buttonLoading: PropTypes.bool.isRequired,
  handleErrorTextChange: PropTypes.func.isRequired,
}

export default Form.create()(QuickLogin)
