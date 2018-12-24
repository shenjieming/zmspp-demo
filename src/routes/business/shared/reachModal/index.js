import React from 'react'
import PropTypes from 'prop-types'
import { Form, Spin, Modal } from 'antd'
import { cloneDeep } from 'lodash'
import GetFormItem from '../../../../components/GetFormItem'
import { formData } from './data'

const ReachModal = ({
  loading,
  modalVisible,
  handleCancel,
  handleOk,
  detail,
  form: {
    validateFields,
    resetFields,
  },
}) => {
  const modalProp = {
    title: '达成合作',
    visible: modalVisible,
    wrapClassName: 'aek-modal',
    maskClosable: false,
    onCancel() {
      resetFields()
      handleCancel()
    },
    afterClose() {
      resetFields()
      handleCancel()
    },
    okText: '保存',
    onOk() {
      validateFields((errors, values) => {
        if (errors) {
          return
        }
        const reqData = cloneDeep(values)
        if (values && values.chanceIntentionOrgId) {
          reqData.chanceIntentionOrgId = values.chanceIntentionOrgId.key
          reqData.chanceIntentionOrgName = values.chanceIntentionOrgId.label
        }
        handleOk(reqData)
      })
    },
  }


  return (
    <Modal {...modalProp} >
      <Spin spinning={loading}>
        <Form>
          <GetFormItem
            formData={formData(detail)}
          />
        </Form>
      </Spin>
    </Modal>
  )
}
ReachModal.propTypes = {
  form: PropTypes.object,
  modalVisible: PropTypes.bool,
  handleCancel: PropTypes.func,
  handleOk: PropTypes.func,
  loading: PropTypes.bool,
  detail: PropTypes.object,
}
export default Form.create()(ReachModal)
