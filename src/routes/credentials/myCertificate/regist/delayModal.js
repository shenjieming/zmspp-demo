import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Form, Modal, Spin, DatePicker, Input, Upload } from 'antd'
import {
  getConfig,
  uploadButton,
} from '../../../../components/UploadButton'

const FORM_ITEM_LAYOUT = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 },
}
const RegistDelayModal = ({
  registDelaylVisible, // 注册证弹框
  effects,
  modalTitle,
  handleCancel,
  handleOk,
  rowSelectData,
  form: {
    getFieldDecorator,
    validateFields,
    resetFields,
  },
}) => {
  const addModalProp = {
    title: modalTitle,
    visible: registDelaylVisible,
    wrapClassName: 'aek-modal',
    maskClosable: false,
    onCancel() {
      handleCancel()
    },
    afterClose() {
      resetFields()
    },
    onOk() {
      validateFields((errors, values) => {
        if (errors) {
          return
        }
        handleOk(values)
      })
    },
  }
  return (
    <Modal {...addModalProp} >
      <Spin spinning={!!effects['myCertificate/setRegistDelay']}>
        <Form>
          <Form.Item label="延期证号" {...FORM_ITEM_LAYOUT}>
            {getFieldDecorator('delayedCertificateNo', {
              rules: [{
                required: true,
                message: '请输入新证号',
              }],
            })(
              <Input placeholder="请输入" />,
            )}
          </Form.Item>
          <Form.Item label="延期至" {...FORM_ITEM_LAYOUT}>
            {getFieldDecorator('delayedDateEnd', {
              initialValue: rowSelectData.validDateEnd && moment(rowSelectData.validDateEnd, 'YYYY-MM-DD'),
              rules: [
                {
                  required: true,
                  message: '请选择时间',
                },
              ],
            })(
              <DatePicker
                style={{ width: '100%' }}
                placeholder="请选择"
                disabledDate={(currentDate) => {
                  const validDateEnd = new Date(new Date(rowSelectData.validDateEnd).getTime() + (24 * 60 * 60 * 1000)).getTime()
                  const format = new Date(new Date(moment(currentDate).format('YYYY-MM-DD')).getTime() + (24 * 60 * 60 * 1000)).getTime()
                  if (format < validDateEnd) {
                    return true
                  }
                  return false
                }}
              />,
            )}
          </Form.Item>
          <Form.Item label="证件图片" {...FORM_ITEM_LAYOUT}>
            {getFieldDecorator('delayedCertificateImageUrls', {
              ...getConfig(rowSelectData.imageUrls),
              rules: [{
                validator: (_, value, callback) => {
                  if (value.some(({ status }) => status !== 'done')) {
                    callback('图片上传中，请稍等')
                  }
                  callback()
                },
              }],
            })(uploadButton)}
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  )
}
RegistDelayModal.propTypes = {
  form: PropTypes.object.isRequired,
  effects: PropTypes.object.isRequired,
  registDelaylVisible: PropTypes.bool.isRequired,
  modalTitle: PropTypes.string.isRequired,
  registCodeOptions: PropTypes.array.isRequired,
  agentOptionsSearch: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleOk: PropTypes.func.isRequired,
  rowSelectData: PropTypes.object.isRequired,
}
export default Form.create()(RegistDelayModal)
