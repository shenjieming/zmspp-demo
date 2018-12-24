/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Input } from 'antd'
import { forOwn } from 'lodash'

const FormItem = Form.Item
const inputList = []

const RFIDModal = ({
  visible,
  data,
  hideHandler,
  form: { getFieldDecorator, validateFields, resetFields, getFieldsValue },
}) => {
  const submitHandler = () => {
    validateFields((errors, values) => {
      if (errors) {
        return
      }
      const lastValue = []
      forOwn(values, value => {
        lastValue.push(value)
      })
      data.rfids = lastValue
      hideHandler()
    })
  }
  const { deliverQty } = data
  let { rfids } = data
  const modalOpts = {
    title: '添加RFID',
    visible,
    destroyOnClose: true,
    afterClose: resetFields,
    onCancel: hideHandler,
    onOk: submitHandler,
    width: 500,
    wrapClassName: 'aek-modal',
  }
  const content = () => {
    const deliverNum = Number(deliverQty)
    // 配送数量小于1的情况 不会展示Modal
    if (!deliverNum) {
      return null
    }
    if (rfids === undefined) {
      rfids = []
    }
    const RFIDlist = []
    for (let index = 0; index < deliverNum; index += 1) {
      RFIDlist.push(
        <FormItem
          key={index + 1}
          label={`序号${index + 1}：`}
          {...{
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
          }}
        >
          {getFieldDecorator(`confirmType_${index}`, {
            initialValue: rfids[index],
            normalize: value => {
              return value ? value.trim() : value
            },
            validateFirst: true,
            rules: [
              { required: true, whitespace: true, message: '请输入RFID' },
              {
                validator: (rule, value, callback) => {
                  const dataList = getFieldsValue()
                  // 先删除自己
                  delete dataList[rule.field]
                  let repeat = false
                  forOwn(dataList, item => {
                    if (item === value) {
                      repeat = true
                    }
                  })
                  if (repeat) {
                    callback('存在重复')
                  }
                  callback()
                },
              },
            ],
          })(
            <Input
              ref={input => {
                inputList[index] = input
              }}
              data-index={index}
              onPressEnter={e => {
                const currentIndex = e.target.dataset.index
                const nextInput = inputList[Number(currentIndex) + 1]
                if (nextInput) {
                  nextInput.focus()
                } else {
                  e.target.blur()
                }
              }}
              onFocus={e => {
                e.target.select()
              }}
            />,
          )}
        </FormItem>,
      )
    }
    return RFIDlist
  }
  return (
    <Modal {...modalOpts}>
      <Form>{content()}</Form>
    </Modal>
  )
}

RFIDModal.propTypes = {
  okHandler: PropTypes.func,
  data: PropTypes.object,
  hideHandler: PropTypes.func,
  form: PropTypes.object,
  visible: PropTypes.bool,
}

export default Form.create()(RFIDModal)
