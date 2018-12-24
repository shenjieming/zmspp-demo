import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, message } from 'antd'
import { debounce } from 'lodash'
import GetFormItem from '../../components/GetFormItem/GetFormItem'
import modalFormData from './data'
import CountDown from '../../components/CountUp'

const propTypes = {
  visible: PropTypes.bool,
  confirmLoading: PropTypes.bool,
  mobileTime: PropTypes.bool,
  emailTime: PropTypes.bool,
  timeLoading: PropTypes.bool,
  modalType: PropTypes.string,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
  toAction: PropTypes.func,
  form: PropTypes.object,
  modalInitValue: PropTypes.object,
}

const modalTitle = {
  editPersonInfo: '编辑个人资料',
  rePassword: '修改密码',
  reMail: '更换邮箱',
  mailForm: '绑定邮箱',
  rePhone: '更换手机号',
}
const ModalForm = ({
  visible,
  modalType,
  onCancel,
  modalInitValue = {},
  confirmLoading,
  mobileTime,
  emailTime,
  timeLoading,
  toAction,
  onOk,
  form: { validateFieldsAndScroll, getFieldValue, getFieldError, resetFields },
}) => {
  const handleOk = () => {
    validateFieldsAndScroll((errors, value) => {
      if (!errors) {
        onOk(value, modalType)
      }
    })
  }
  const messageAlter = debounce((typeStr) => {
    message.error(typeStr === 'mobile' ? '请输入正确的手机号' : '请输入正确的邮箱')
  }, 500)
  const getCountTime = (typeStr) => {
    const flag = { mobileTime, emailTime }[`${typeStr}Time`]
    return (
      <a
        disabled={!flag || timeLoading}
        onClick={() => {
          const [value, error] = [getFieldValue(typeStr), getFieldError(typeStr)]
          if (value && !error) {
            toAction({ [typeStr]: value }, `by${typeStr}`)
          } else {
            messageAlter(typeStr)
          }
        }}
      >
        {flag ? '免费获取验证码' : '免费获取验证码('}
        {flag || (
          <CountDown
            start={60}
            end={1}
            duration={60}
            suffix=")"
            useEasing={false}
            onComplete={() => {
              toAction({ [`${typeStr}Time`]: true })
            }}
          />
        )}
      </a>
    )
  }

  let other
  if (modalType === 'rePassword') {
    other = {
      getValidator(fieldStr) {
        // validateFields([fieldStr])
        return (rule, value, callback) => {
          const otherValue = getFieldValue(fieldStr)
          if (value && otherValue && value !== otherValue) {
            callback('两次输入不一致！')
          }
          callback()
        }
      },
    }
  }
  if (['rePhone', 'reMail', 'mailForm'].includes(modalType)) {
    other = { getCountTime }
  }

  const modalOpts = {
    title: modalTitle[modalType],
    visible,
    onCancel,
    onOk: handleOk,
    confirmLoading,
    afterClose: () => {
      resetFields()
      toAction({
        mobileTime: true,
        emailTime: true,
      })
    },
    wrapClassName: 'aek-modal',
    maskClosable: false,
  }

  return (
    <Modal {...modalOpts}>
      <Form>
        <GetFormItem formData={modalFormData(modalType, { modalInitValue, other })} />
      </Form>
    </Modal>
  )
}

ModalForm.propTypes = propTypes

export default Form.create()(ModalForm)
