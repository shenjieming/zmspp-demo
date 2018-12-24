import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Input, Spin } from 'antd'

const FormItem = Form.Item

const EditBrandModal = (
  {
    title,
    visible,
    onHide,
    onOk,
    getLoading,
    currentBrandDetail,
    form: { getFieldDecorator, validateFields, resetFields },
  },
) => {
  const hideHandler = () => {
    onHide()
  }
  const okHandler = () => {
    validateFields((err, values) => {
      if (!err) {
        onOk(values)
      }
    })
  }
  const modalOpts = {
    title,
    visible,
    afterClose: resetFields,
    maskClosable: false,
    onCancel: hideHandler,
    onOk: okHandler,
    width: 500,
    wrapClassName: 'aek-modal',
  }
  const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 18 },
  }
  return (
    <Modal {...modalOpts}>
      <Spin spinning={getLoading('loadDetail')}>
        <Form onSubmit={okHandler}>
          <FormItem {...formItemLayout} label="厂家名称">
            {
              getFieldDecorator('produceFactoryId', {
                initialValue: currentBrandDetail && currentBrandDetail.produceFactoryId,
                rules: [
                  { required: true, whitespace: true, message: '请选择厂家' },
                ],
              })(<span>{currentBrandDetail && currentBrandDetail.produceFactoryName}</span>)
            }
          </FormItem>
          <FormItem {...formItemLayout} label="品牌">
            {
              getFieldDecorator('brandName', {
                initialValue: currentBrandDetail && currentBrandDetail.brandName,
                rules: [
                  { required: true, whitespace: true, message: '请输入品牌名称' },
                ],
              })(<Input />)
            }
          </FormItem>
        </Form>
      </Spin>
    </Modal>
  )
}

EditBrandModal.propTypes = {
  onOk: PropTypes.func,
  onHide: PropTypes.func,
  form: PropTypes.object,
  roleName: PropTypes.string,
  getLoading: PropTypes.func,
  factoryList: PropTypes.array,
  visible: PropTypes.bool,
  isLoading: PropTypes.bool,
  nameEditable: PropTypes.bool,
  totalMenus: PropTypes.array,
  currentBrandDetail: PropTypes.object,
  orgType: PropTypes.array,
  title: PropTypes.string,
  dispatchAction: PropTypes.func,
}

export default Form.create()(EditBrandModal)
