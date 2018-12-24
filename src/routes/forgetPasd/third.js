import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, Icon, Row, Col } from 'antd'
import styles from '../login/index.less'
import md5 from 'md5'

const FormItem = Form.Item
const FORM_ITEM_LAYOUT = {
  labelCol: { span: 6 },
  wrapperCol: { span: 13 },
}
const Third = ({
  dispatch,
  userInfo,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldValue,
    setFieldsValue,
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
  return (
    <Form
      hideRequiredMark
      onSubmit={(e) => {
        e.preventDefault()
        validateFields((errors, values) => {
          if (!errors) {
            dispatch({
              type: 'forgetPasd/getThirdSubmit',
              payload: {
                userId: userInfo.userId,
                password: md5(values.password).toUpperCase(),
              },
            })
          }
        })
      }}
    >
      <FormItem>
        <span>请重新设置密码</span>
      </FormItem>
      <FormItem {...FORM_ITEM_LAYOUT} label="设置新密码">
        {getFieldDecorator('password', {
          validateFirst: true,
          rules: [
            {
              required: true,
              message: '请输入您的密码',
            },
            {
              min: 6,
              max: 20,
              message: '密码应在6-20位之间',
            },
            {
              pattern: /^[a-zA-Z0-9\u4e00-\u9fa5@.]+$/,
              message: '用户非法输入',
            },
            {
              validator: (rule, value, cb) => {
                const confirmPas = getFieldValue('confirmPassword')
                if (confirmPas && confirmPas !== value) {
                  cb('两次输入的密码不一致！')
                } else {
                  cb()
                }
              },
            },
          ],
        })(<Input
          onChange={() => {
            pasdChange()
          }}
          type="PASSWORD"
          placeholder="6-20位数字、字母、符号"
        />,
        )}
      </FormItem>
      <FormItem {...FORM_ITEM_LAYOUT} label="确认密码">
        {getFieldDecorator('confirmPassword', {
          validateFirst: true,
          rules: [{
            required: true,
            message: '请再次确认新密码',
          },
          {
            min: 6,
            max: 20,
            message: '密码应在6-20位之间',
          },
          {
            pattern: /^[a-zA-Z0-9\u4e00-\u9fa5@.]+$/,
            message: '用户非法输入',
          },
          {
            validator: (rule, value, cb) => {
              const confirmPas = getFieldValue('password')
              if (confirmPas && confirmPas !== value) {
                cb('两次输入的密码不一致！')
              } else {
                cb()
              }
            },
          }],
        })(<Input
          onChange={() => {
            confirmPasdChange()
          }}
          type="PASSWORD"
          placeholder="请再次确认新密码"
        />,
        )}
      </FormItem>
      <FormItem>
        <Row>
          <Col span="6" />
          <Col span="18">
            <Button
              className={styles.loginButton}
              type="primary"
              htmlType="submit"
              size="large"
            >
              下一步
            </Button>
          </Col>
        </Row>
      </FormItem>
    </Form>
  )
}
Third.propTypes = {
  form: PropTypes.object.isRequired,
  dispatch: PropTypes.func,
  userInfo: PropTypes.object,
}

export default Form.create()(Third)
