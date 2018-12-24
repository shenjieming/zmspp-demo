import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, Icon, Row, Col } from 'antd'
import styles from '../login/index.less'

const FORM_ITEM_LAYOUT = {
  labelCol: { span: 6 },
  wrapperCol: { span: 13 },
}
const FormItem = Form.Item

const First = ({ imageCaptchaUrl, dispatch, form: { getFieldDecorator, validateFields } }) => {
  const captchaSuffix = (
    <span>
      <img
        onClick={() => {
          dispatch({ type: 'forgetPasd/getImageCaptcha' })
        }}
        style={{ height: '30px' }}
        alt="验证码"
        src={`data:image/png;base64,${imageCaptchaUrl || ''}`}
      />
    </span>
  )
  return (
    <Form
      hideRequiredMark
      onSubmit={(e) => {
        e.preventDefault()
        validateFields((errors, values) => {
          if (!errors) {
            dispatch({
              type: 'forgetPasd/getFirstSubmit',
              payload: values,
            })
          }
        })
      }}
    >
      <FormItem>
        <span>请输入你需要找回登录密码的账户名</span>
      </FormItem>
      <FormItem {...FORM_ITEM_LAYOUT} label="用户名">
        {getFieldDecorator('username', {
          rules: [
            {
              required: true,
              message: '请输入用户名',
            },
          ],
        })(<Input className="ant-input" placeholder="登录名/邮箱" />)}
      </FormItem>
      <FormItem {...FORM_ITEM_LAYOUT} label="验证码">
        {getFieldDecorator('imageCaptcha', {
          rules: [
            {
              required: true,
              message: '请输入验证码',
            },
          ],
        })(
          <Input
            maxLength="4"
            placeholder="请输入验证码"
            suffix={captchaSuffix}
            className={`${styles.captchaInput}`}
          />,
        )}
      </FormItem>
      <FormItem>
        <Row>
          <Col span="6" />
          <Col span="13">
            <Button
              className={`${styles.loginButton} aek-mt20`}
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
First.propTypes = {
  form: PropTypes.object.isRequired,
  imageCaptchaUrl: PropTypes.any,
  dispatch: PropTypes.func,
}

export default Form.create()(First)
