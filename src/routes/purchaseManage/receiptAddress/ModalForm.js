import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form } from 'antd'
import GetFormItem from '../../../components/GetFormItem/GetFormItem'
import { formItemData } from './data'

const propTypes = {
  visible: PropTypes.bool,
  modalButtonLoading: PropTypes.bool,
  modalType: PropTypes.string,
  modalForm: PropTypes.object,
  form: PropTypes.object,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
  addressList: PropTypes.array,
}

const ModalForm = ({
  visible,
  modalForm = {},
  modalType,
  onOk,
  onCancel,
  modalButtonLoading,
  addressList,
  form: {
    validateFieldsAndScroll,
    resetFields,
  },
}) => {
  const handleOk = () => {
    validateFieldsAndScroll((errors, value) => {
      if (!errors) {
        onOk(value)
      }
    })
  }
  const modalOpts = {
    title: modalType === 'update' ? '编辑收货地址' : '新增收货地址',
    visible,
    onOk: handleOk,
    confirmLoading: modalButtonLoading,
    onCancel,
    wrapClassName: 'aek-modal',
    afterClose: resetFields,
  }
  return (
    <Modal {...modalOpts}>
      <Form>
        <GetFormItem
          formData={formItemData({ addressList, initValue: modalForm })}
        />
      </Form>
    </Modal>
  )
}

ModalForm.propTypes = propTypes

export default (Form.create()(ModalForm))
