import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form } from 'antd'
import GetFormItem from '../../components/GetFormItem/GetFormItem'

const propTypes = {
  visible: PropTypes.bool,
  modalType: PropTypes.string,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
  modalLoading: PropTypes.bool,
  modalContent: PropTypes.object,
  form: PropTypes.object,
}

const ModalForm = ({
  visible,
  modalType,
  onOk,
  onCancel,
  modalContent = {},
  modalLoading,
  form: {
    validateFieldsAndScroll,
    resetFields,
  },
}) => {
  const handleOk = () => {
    validateFieldsAndScroll((errors, value) => {
      if (errors) {
        return
      }
      onOk(value)
    })
  }
  const modalOpts = {
    title: `${modalType === 'create' ? '新增' : '编辑'}`,
    visible,
    okText: `${modalType === 'viewUdt' ? '编辑' : '确定'}`,
    onOk: handleOk,
    confirmLoading: modalLoading,
    onCancel,
    afterClose: resetFields,
    wrapClassName: 'aek-modal',
  }
  const data = [{
    label: '功能名称',
    field: 'name',
    layout: {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    },
    options: {
      rules: [{ required: true, message: '请输入功能名称' }],
      initialValue: modalContent.name,
    },
    component: {
      name: 'Input',
      props: {
        placeholder: '请输入',
      },
    },
  }, {
    label: 'KEY',
    field: 'menuKey',
    layout: {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    },
    options: {
      rules: [{ required: true, message: '请输入唯一Key' }],
      initialValue: modalContent.menuKey,
    },
    component: {
      name: 'Input',
      props: {
        placeholder: '功能唯一KEY',
      },
    },
  }, {
    label: '操作',
    field: 'menuFunction',
    layout: {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    },
    options: {
      initialValue: modalContent.menuFunction,
    },
    component: {
      name: 'Input',
      props: {
        placeholder: 'create/update/view/delete',
      },
    },
  }, {
    label: '功能提醒',
    field: 'tip',
    layout: {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    },
    options: {
      initialValue: modalContent.tip,
    },
    component: {
      name: 'Input',
      props: {
        placeholder: '请输入功能提醒',
      },
    },
  }]
  return (
    <Modal {...modalOpts}>
      <Form>
        <GetFormItem formData={data} />
      </Form>
    </Modal>
  )
}

ModalForm.propTypes = propTypes

export default (Form.create()(ModalForm))
