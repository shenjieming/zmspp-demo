import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, Row, Col, Icon, Radio, AutoComplete } from 'antd'
import { REGEXP_TELEPHONE } from '../../../utils/constant'
import styles from '../../login/index.less'
import CountDown from '../../../components/CountUp'
import { mapValues, debounce } from 'lodash'
import md5 from 'md5'
import { asyncValidate } from '../../../utils'
import { Link } from 'dva/router'

// 用户名查询
const asyncValidateFun = asyncValidate({ message: '该用户名已被其他用户使用!', url: '/account/loginName/unique/verify', key: 'loginName' })
// 手机号码校验
const asyncMobileValidateFun = asyncValidate({ message: '该手机已绑定其他机构!', url: '/account/mobile/unique/verify', key: 'mobile' })
// 供应商名称异步校验
const asyncSupplierFun = asyncValidate({ message: '该机构已被注册!', url: '/organization/check/same/name', key: 'keywords' })
const FORM_ITEM_LAYOUT = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
}
const FormItem = Form.Item
const Option = AutoComplete.Option
const RadioGroup = Radio.Group
const Supplier = ({
  effects,
  dispatch,
  captchaClearVisible,
  countDownStatus,
  handleCountDownComplete,
  checkCodeStatus,
  handleClickGetCaptcha,
  supplierRegist,
  mobileClearVisible,
  hospitalList, // 供应商列表
  usernameUnique, // 用户名唯一性校验
  usernameUniqueText, // 用户名唯一性文本提示
  mobileUnique, // 手机号码唯一性校验
  mobileUniqueText, // 手机号唯一性文本提示
  handle,
  form: {
    getFieldDecorator,
    setFieldsValue,
    getFieldValue,
    validateFields,
  },
}) => {
  const pasdChange = () => {
    const confirmPassword = getFieldValue('confirmPassword')
    if (confirmPassword) {
      setFieldsValue({ confirmPassword: `${confirmPassword} ` })
      setFieldsValue({ confirmPassword: `${confirmPassword}` })
    }
  }
  const confirmPasdChange = () => {
    const password = getFieldValue('password')
    if (password) {
      setFieldsValue({ password: `${password} ` })
      setFieldsValue({ password: `${password}` })
    }
  }
  const captchaClearIcon = captchaClearVisible && <Icon
    type="close"
    className={styles.visibleIcon}
    onClick={() => {
      setFieldsValue({ verifyCode: undefined })
    }}
  />
  let captchaSuffix = (<div>{
    captchaClearIcon
  }<Button
    size="large"
    style={{ fontSize: '14px' }}
    onClick={() => {
      validateFields(['mobile'], (errors) => {
        if (!errors) {
          const value = getFieldValue('mobile').replace(/\s/g, '')
          handleClickGetCaptcha(value)
        }
      })
    }}
  >发送验证码</Button></div>)
  if (countDownStatus) {
    captchaSuffix = (<div>{
      captchaClearIcon
    }<Button><CountDown
      className="aek-text-disable"
      start={59}
      end={0}
      duration={60}
      suffix="秒后重新发送"
      useEasing={false}
      onComplete={handleCountDownComplete}
    /></Button></div>)
  } else if (checkCodeStatus) {
    captchaSuffix = (<div className="aek-ml20">{
      captchaClearIcon
    }<Button
      size="large"
      style={{ fontSize: '14px' }}
      onClick={() => {
        const value = getFieldValue('mobile').replace(/\s/g, '')
        handleClickGetCaptcha(value)
      }}
    >发送验证码</Button></div>)
  }
  return (
    <div>
      <Form
        onSubmit={(e) => {
          e.preventDefault()
          const regist = debounce(supplierRegist, 400)
          validateFields((errors, values) => {
            if (!errors) {
              values.orgTypeValue = '02'
              values.password = md5(values.password).toUpperCase()
              values.confirmPassword = md5(values.confirmPassword).toUpperCase()
              regist(values)
            }
          })
        }}
      >
        <FormItem {...FORM_ITEM_LAYOUT} label="医院名称">
          {getFieldDecorator('orgName', {
            validateFirst: true,
            rules: [
              { required: true, message: '请填写医院名称!' },
              { max: 40, message: '字符不超过40字符' },
              { validator: asyncSupplierFun },
            ],
          })(
            // <AutoComplete
            //   placeholder="请输入医院名称"
            //   allowClear
            //   onSearch={handle}
            //   notFoundContent=""
            //   filterOption={false}
            // >
            //   {hospitalList.map(item => (<Option key={item.supplierId} value={item.supplierName} >{item.supplierName}</Option>),
            //   )}
            // </AutoComplete>
            <Input placeholder="请输入医院名称" />,
          )}
        </FormItem>
        <FormItem {...FORM_ITEM_LAYOUT} label="登录名">
          {getFieldDecorator('loginName', {
            validateFirst: true,
            rules: [
              {
                required: true,
                message: '请输入登录名!',
              },
              {
                pattern: '^[a-zA-Z][a-zA-Z0-9]{5,19}$',
                message: '必须以字母开头，6到20位数字字母组合',
              },
              {
                validator: asyncValidateFun,
              },
            ],
          })(
            <Input placeholder="登录名" />,
          )}
        </FormItem>
        <FormItem {...FORM_ITEM_LAYOUT} label="设置密码">
          {getFieldDecorator('password', {
            validateFirst: true,
            rules: [
              { required: true, message: '请输入密码!' },
              {
                max: 20,
                min: 6,
                message: '输入的密码格式不正确!',
              },
              {
                pattern: /^[a-zA-Z0-9\u4e00-\u9fa5@.]+$/,
                message: '用户非法输入',
              },
              {
                validator: (rule, value, cb) => {
                  const confirmPas = getFieldValue('confirmPassword')
                  if (value && confirmPas && confirmPas !== value) {
                    cb('两次输入的密码不一致！')
                  } else {
                    cb()
                  }
                },
              },
            ],
          })(
            <Input onChange={() => { pasdChange() }} className="ant-input" type="password" placeholder="请输入6-20位密码" />,
          )}
        </FormItem>
        <FormItem {...FORM_ITEM_LAYOUT} label="确认密码">
          {getFieldDecorator('confirmPassword', {
            validateFirst: true,
            rules: [
              { required: true, message: '请再次输入密码!' },
              {
                max: 20,
                min: 6,
                message: '输入的密码格式不正确',
              },
              {
                pattern: /^[a-zA-Z0-9\u4e00-\u9fa5@.]+$/,
                message: '用户非法输入',
              },
              {
                validator: (rule, value, cb) => {
                  const confirmPas = getFieldValue('password')
                  if (value && confirmPas && confirmPas !== value) {
                    cb('两次输入的密码不一致！')
                  } else {
                    cb()
                  }
                },
              },
            ],
          })(
            <Input onChange={() => { confirmPasdChange() }} type="password" placeholder="请再次输入密码" />,
          )}
        </FormItem>
        <FormItem {...FORM_ITEM_LAYOUT} label="真实姓名">
          {getFieldDecorator('realName', {
            validateFirst: true,
            rules: [
              { required: true, message: '请输入您真实姓名!' },
              {
                max: 10,
                message: '字符不超过10位',
              },
              {
                pattern: '^[\u4e00-\u9fa5]+$',
                message: '请输入真实姓名',
              },
            ],
          })(
            <Input placeholder="请输入您真实姓名，方便供应商认识您" />,
          )}
        </FormItem>
        <FormItem {...FORM_ITEM_LAYOUT} label="性别">
          {getFieldDecorator('userGender', {
            validateFirst: true,
            rules: [
              { required: true, message: '请选择性别!' },
            ],
          })(
            <RadioGroup name="radiogroup">
              <Radio value={1}>男</Radio>
              <Radio value={0}>女</Radio>
            </RadioGroup>,
          )}
        </FormItem>
        <FormItem {...FORM_ITEM_LAYOUT} label="手机号">
          {
            getFieldDecorator('mobile', {
              validateFirst: true,
              rules: [{
                required: true,
                message: '请输入您的手机号码',
              }, {
                pattern: REGEXP_TELEPHONE,
                message: '手机号不正确',
              },
              {
                validator: asyncMobileValidateFun,
              }],
            })(
              <Input
                size="large"
                placeholder="手机号是11位数字"
                maxLength="11"
                suffix={mobileClearVisible && <Icon
                  className={styles.visibleIcon}
                  type="close"
                  onClick={() => {
                    setFieldsValue({ mobile: undefined })
                  }}
                />}
              />,
            )
          }
        </FormItem>
        <Row>
          <Col span="16">
            <FormItem labelCol={{ span: 9 }} wrapperCol={{ span: 14 }} label="验证码" >
              {
                getFieldDecorator('mobileCaptcha', {
                  validateFirst: true,
                  rules: [{
                    required: true,
                    message: '请输入验证码',
                  },
                  {
                    len: 4,
                    message: '验证码的长度是4位',
                  },
                  {
                    validator: (rule, value, cb) => {
                      if (/[^\w]/.test(value)) {
                        cb('验证码必须是数字')
                      } else {
                        cb()
                      }
                    },
                  }],
                })(
                  <Input
                    size="large"
                    placeholder="请输入验证码"
                    className={styles.captchaInput}
                  />,
                )
              }
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem wrapperCol={{ span: 12 }}>
              {captchaSuffix}
            </FormItem>
          </Col>
        </Row>
        <FormItem>
          <Row>
            <Col span="6" />
            <Col span="18" className="aek-pt10">
              <Button loading={!!effects['regist/postResist']} className={styles.loginButton} htmlType="submit" type="primary" size="large">注册账户</Button>
              <span className="aek-text-left aek-ml10 aek-font-small">点击注册，表示同意我们的<Link to="/useClause" target="_blank">使用条款</Link></span>
              <p className="aek-mt20"><Link to="/login">已有账户？请登录</Link></p>
            </Col>
          </Row>
        </FormItem>
      </Form>
    </div>
  )
}

Supplier.propTypes = {
  dispatch: PropTypes.func,
  form: PropTypes.object,
  captchaClearVisible: PropTypes.bool,
  countDownStatus: PropTypes.bool,
  handleCountDownComplete: PropTypes.func,
  checkCodeStatus: PropTypes.bool,
  handleClickGetCaptcha: PropTypes.func,
  supplierRegist: PropTypes.func,
  mobileClearVisible: PropTypes.bool,
  hospitalList: PropTypes.array,
  usernameUnique: PropTypes.bool,
  usernameUniqueText: PropTypes.string,
  mobileUnique: PropTypes.bool,
  mobileUniqueText: PropTypes.string,
  handle: PropTypes.func,
  effects: PropTypes.object,
}

export default Form.create({
  onFieldsChange: (props, fields) => {
    if ('mobile' in fields) {
      const { errors, value } = fields.mobile
      props.handleSwitchCheckCodeStatus(!!value && !errors)
    } else if ('verifyCode' in fields) {
      const { errors, value } = fields.verifyCode
      props.handleCaptchaStatusChange(!!value && !errors)
    }
  },
})(Supplier)
