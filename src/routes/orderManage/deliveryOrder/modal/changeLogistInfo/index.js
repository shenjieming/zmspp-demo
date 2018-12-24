import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Spin } from 'antd'
import { noop } from 'lodash'

import { formData } from './data'
import GetFormItem from '../../../../../components/GetFormItem'

const propTypes = {
  visible: PropTypes.bool,
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
  detail: PropTypes.object,
  form: PropTypes.object,
  handleChange: PropTypes.func,
  deliveryCompanies: PropTypes.array,
  loading: PropTypes.bool,
}
const AgainDeliver = ({
  visible,
  onCancel = noop,
  onOk = noop,
  handleChange,
  detail,
  deliveryCompanies,
  loading,
  form: {
    validateFields,
    resetFields,
  },
}) => {
  const modalOpts = {
    title: '修改配送信息',
    visible,
    wrapClassName: 'aek-modal',
    maskClosable: false,
    onCancel() {
      resetFields()
      onCancel()
    },
    onOk() {
      validateFields((errors, value) => {
        if (!errors) {
          onOk(value)
        }
      })
    },
    afterClose() {
      resetFields()
      onCancel()
    },
  }

  // 配送方式类型切换
  return (
    <Modal {...modalOpts}>
      <Spin spinning={loading}>
        <Form>
          <GetFormItem
            formData={formData({
              detail,
              handleChange,
              deliveryCompanies,
            })}
          />
        </Form>
      </Spin>
    </Modal>
  )
}

AgainDeliver.propTypes = propTypes

export default Form.create()(AgainDeliver)
