import React from 'react'
import PropTypes from 'prop-types'
import { Form, Modal, Row, Col, Input } from 'antd'

const FormItem = Form.Item
const { TextArea } = Input
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
}
const TagModal = (
  {
    onSaveTag,
    currentTags: { userTag, userId },
    tagModalVisible,
    onCancel,
    form: { getFieldDecorator, validateFields, resetFields },
  }) => {
  function handleOk() {
    validateFields((errors, vals) => {
      if (errors) {
        return
      }
      onSaveTag({ ...vals, userId })
    })
  }
  const modalOpts = {
    title: '添加标签',
    visible: tagModalVisible,
    afterClose: resetFields,
    onCancel,
    onOk: handleOk,
    maskClosable: false,
    wrapClassName: 'aek-modal',

  }
  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <Row>
          <Col span={20}>
            <FormItem
              label="标签名称"
              {...formItemLayout}
            >
              {getFieldDecorator('userTag', {
                initialValue: userTag,
                rules: [{ max: 500, message: '最多500字' }],
              })(
                <TextArea placeholder="请输入标签名称" rows={6} />,
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}
TagModal.propTypes = {
  onSaveTag: PropTypes.func,
  currentTags: PropTypes.object,
  tagModalVisible: PropTypes.bool,
  onCancel: PropTypes.func,
  form: PropTypes.object,
}

export default Form.create()(TagModal)
