import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Input, Radio, Tag, Spin } from 'antd'

const FormItem = Form.Item
const RadioGroup = Radio.Group
const TextArea = Input.TextArea

const ConfirmOrder = ({
  visible,
  hideHandler,
  okHandler,
  loading,
  form: {
    getFieldDecorator,
    validateFields,
    setFields,
    resetFields,
    getFieldValue,
    setFieldsValue,
  },
}) => {
  const submitHandler = () => {
    validateFields((errors, values) => {
      if (errors) {
        return
      }
      if (values.confirmType !== '1' && (!values.confirmRemark || !values.confirmRemark.trim())) {
        setFields({
          confirmRemark: {
            value: values.confirmRemark,
            errors: [new Error('请输入发货备注！')],
          },
        })
        return
      }
      okHandler(values)
    })
  }
  const modalOpts = {
    title: '订单确认',
    visible,
    afterClose: resetFields,
    onCancel: hideHandler,
    onOk: submitHandler,
    width: 500,
    wrapClassName: 'aek-modal',
  }
  const remarkTags = ['由于某种特殊原因，我们需要延迟发货！', '我们已收到您的订单，请您耐心等候，我们会尽快发货']
  const tagClick = (text) => {
    setFieldsValue({
      confirmRemark: text,
    })
  }
  return (
    <Modal {...modalOpts}>
      <Spin spinning={loading}>
        <Form>
          <FormItem>
            {getFieldDecorator('confirmType', {
              initialValue: '1',
              rules: [{ required: true, message: '请选择确认类型' }],
            })(
              <RadioGroup
                onChange={(event) => {
                  if (event.target.value === '1') {
                    setFieldsValue({
                      confirmRemark: '',
                    })
                  }
                }}
              >
                <Radio value="1">正常发货</Radio>
                <Radio value="2">延迟发货</Radio>
                <Radio value="3">缺货</Radio>
              </RadioGroup>,
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('confirmRemark', {
              rules: [
                {
                  validator: (rule, value, cb) => {
                    const confirmType = getFieldValue('confirmType')
                    if (confirmType !== '1' && (!value || !value.trim())) {
                      cb('请输入发货备注！')
                    } else {
                      cb()
                    }
                  },
                },
              ],
            })(<TextArea rows={10} style={{ resize: 'none' }} />)}
          </FormItem>
        </Form>
        {remarkTags.map((text, index) => (
          <Tag
            key={index}
            style={{ marginTop: '10px', fontSize: '12px', color: '#757575' }}
            onClick={() => {
              tagClick(text)
            }}
          >
            {text}
          </Tag>
        ))}
      </Spin>
    </Modal>
  )
}

ConfirmOrder.propTypes = {
  okHandler: PropTypes.func,
  hideHandler: PropTypes.func,
  loading: PropTypes.bool,
  form: PropTypes.object,
  visible: PropTypes.bool,
}

export default Form.create()(ConfirmOrder)
