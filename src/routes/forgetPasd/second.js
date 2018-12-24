import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, Row, Col, Select, Modal, Radio } from 'antd'
import styles from '../login/index.less'
import CountDown from '../../components/CountUp'
import { CONSUMER_HOTLINE } from '../../utils/config'

const FormItem = Form.Item
const RadioGroup = Radio.Group
const FORM_ITEM_LAYOUT = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 },
}
const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
}
const Second = ({
  userInfo,
  dispatch,
  selectType,
  countDownStatus,
  customerVisible,
  form: { getFieldDecorator, validateFields, setFieldsValue },
}) => {
  // 验证方式
  const option = []
  if (userInfo) {
    if (userInfo.email && userInfo.mobile) {
      option.push(
        <Radio key="0" value="0" style={radioStyle}>
          通过验证手机
        </Radio>,
      )
      option.push(
        <Radio key="1" value="1" style={radioStyle}>
          通过验证邮箱
        </Radio>,
      )
    } else if (userInfo.email) {
      option.push(
        <Radio key="1" value="1" style={radioStyle}>
          通过验证邮箱
        </Radio>,
      )
    } else if (userInfo.mobile) {
      option.push(
        <Radio key="0" value="0" style={radioStyle}>
          通过验证手机
        </Radio>,
      )
    }
  }
  // 验证码
  let captchaSuffix = (
    <Button
      className="aek-font-small"
      onClick={() => {
        let url = 'forgetPasd/getSecondMobileCaptcha'
        if (Number(selectType) === 1) {
          url = 'forgetPasd/getSecondEmailCaptcha'
        }
        dispatch({
          type: url,
          payload: {
            userId: userInfo.userId,
          },
        })
      }}
    >
      发送验证码
    </Button>
  )
  if (countDownStatus) {
    captchaSuffix = (
      <Button>
        <CountDown
          key={selectType}
          className="aek-text-disable aek-font-small"
          start={59}
          end={0}
          duration={60}
          suffix="秒后重新发送"
          useEasing={false}
          onComplete={() => {
            dispatch({
              type: 'forgetPasd/updateState',
              payload: {
                countDownStatus: false,
              },
            })
          }}
        />
      </Button>
    )
  }
  return (
    <Form
      hideRequiredMark
      onSubmit={(e) => {
        e.preventDefault()
        validateFields((errors, values) => {
          if (!errors) {
            dispatch({
              type: 'forgetPasd/getSecondSubmit',
              payload: {
                ...values,
                ...userInfo,
              },
            })
          }
        })
      }}
    >
      <FormItem {...FORM_ITEM_LAYOUT} label="验证方式">
        {getFieldDecorator('type', {
          initialValue: selectType === 0 ? '0' : '1',
        })(
          <RadioGroup
            onChange={(e) => {
              dispatch({ type: 'forgetPasd/updateState', payload: { countDownStatus: false, selectType: Number(e.target.value) } })
            }}
          >
            {option}
          </RadioGroup>,
        )}
      </FormItem>
      <FormItem {...FORM_ITEM_LAYOUT} label="真实姓名">
        <span className="ant-form-text">{userInfo ? userInfo.realName : ''}</span>
      </FormItem>
      <FormItem {...FORM_ITEM_LAYOUT} wrapperCol={{ span: 16 }} label={selectType === 0 ? '已验证手机' : '已验证邮箱'}>
        <span className="ant-form-text">
          {selectType === 0 ? userInfo.mobile : userInfo.email}
          <span style={{ marginLeft: '15px' }}>
            <a
              onClick={() => {
                dispatch({
                  type: 'forgetPasd/updateState',
                  payload: {
                    customerVisible: true,
                  },
                })
              }}
            >
              {selectType === 0 ? '若该手机无法使用请联系客服' : '若该邮箱无法使用请联系客服'}
            </a>
          </span>
        </span>
      </FormItem>
      <Row>
        <Col span="12">
          <FormItem labelCol={{ span: 12 }} wrapperCol={{ span: 10 }} label="验证码">
            {getFieldDecorator('captcha', {
              rules: [
                {
                  required: true,
                  message: '请输入验证码',
                },
                {
                  validator: (rule, value, cb) => {
                    if (/[^\w]/.test(value)) {
                      cb('验证码必须是数字')
                    } else {
                      cb()
                    }
                  },
                },
                {
                  len: 4,
                  message: '验证码的长度是4位',
                },
              ],
            })(
              <Input
                size="large"
                placeholder="请输入验证码"
              />,
            )}
          </FormItem>
        </Col >
        <Col span="12">
          <FormItem wrapperCol={{ span: 12 }}>
            {captchaSuffix}
          </FormItem>
        </Col>
      </Row>
      <FormItem>
        <Row>
          <Col span="6" />
          <Col span="5">
            <Button style={{ width: '100%' }} className={styles.loginButton} type="primary" htmlType="submit" size="large">
              下一步
            </Button>
          </Col>
        </Row>
        <Row style={{ marginTop: '10px' }}>
          <Col span="6" />
          <Col span="5">
            <a
              onClick={() => {
                dispatch({
                  type: 'forgetPasd/updateState',
                  payload: {
                    stepCurrent: 0,
                  },
                })
              }}
            >
              返回上一步
            </a>
          </Col>
        </Row>
      </FormItem>
      <Modal
        title="联系客服"
        footer={null}
        visible={customerVisible}
        height={300}
        onCancel={() => {
          dispatch({
            type: 'forgetPasd/updateState',
            payload: {
              customerVisible: false,
            },
          })
        }}
      >
        <p style={{ padding: '40px 0' }} className="aek-text-center">
          如果需要帮助，请联系客服人员：{CONSUMER_HOTLINE}
        </p>
      </Modal>
    </Form>
  )
}
Second.propTypes = {
  form: PropTypes.object.isRequired,
  userInfo: PropTypes.object,
  dispatch: PropTypes.func,
  selectType: PropTypes.number,
  countDownStatus: PropTypes.bool,
  customerVisible: PropTypes.bool,
}

export default Form.create()(Second)
