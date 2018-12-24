import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form } from 'antd'
import GetFormItem from '../../../components/GetFormItem/GetFormItem'
import { modalFormData } from './data'
import getComponent from '../../../components/GetFormItem/getComponent'

const propTypes = {
  visible: PropTypes.bool,
  loading: PropTypes.bool,
  addLoading: PropTypes.bool,
  modalType: PropTypes.string,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
  saveAdd: PropTypes.func,
  onChange: PropTypes.func,
  form: PropTypes.object,
  modalInitValue: PropTypes.object,
}

const title = '字典'
const modalTitle = {
  create: '新增',
  update: '编辑',
  view: '查看',
  viewUdt: '查看',
}

const ModalForm = ({
  visible,
  modalType,
  onOk,
  onCancel,
  saveAdd,
  modalInitValue = {},
  loading,
  addLoading,
  onChange,
  form: {
    validateFieldsAndScroll,
    resetFields,
  },
}) => {
  const handleOk = () => {
    validateFieldsAndScroll((errors, value) => {
      if (!errors) {
        const data = value
        data.dicType = value.dicType - 0
        if (modalType === 'update') {
          data.dicId = modalInitValue.dicId
        }
        onOk(data)
      }
    })
  }
  const handleOkAdd = () => {
    validateFieldsAndScroll((errors, value) => {
      if (!errors) {
        const data = value
        data.dicType = value.dicType - 0
        saveAdd(data, resetFields)
      }
    })
  }
  const getButton = type => [{
    name: 'Button',
    props: {
      onClick: onCancel,
      children: '取消',
    },
  }, type === 'create' && {
    name: 'Button',
    props: {
      type: 'primary',
      children: '保存并新增',
      onClick: handleOkAdd,
      loading: addLoading,
    },
  }, {
    name: 'Button',
    props: {
      type: 'primary',
      children: '保存',
      onClick: handleOk,
      loading,
    },
  }].filter(_ => !!_).map((item, index) => getComponent(item, index))

  const modalOpts = {
    title: modalTitle[modalType] + title,
    visible,
    onCancel,
    afterClose: resetFields,
    wrapClassName: 'aek-modal',
    footer: getButton(modalType),
    maskClosable: modalType === 'view',
  }

  if (modalType === 'view') {
    modalOpts.footer = null
  }
  return (
    <Modal {...modalOpts}>
      <Form>
        <GetFormItem
          formData={modalFormData({
            ...modalInitValue,
            onChange,
          })}
        />
      </Form>
    </Modal>
  )
}

ModalForm.propTypes = propTypes

export default (Form.create()(ModalForm))
