import React from 'react'
import { Modal, Form, Spin } from 'antd'
import moment from 'moment'
import PropTypes from 'prop-types'
import GetFormItem from '../../../components/GetFormItem/GetFormItem'
import { FORM_ITEM_LAYOUT } from '../../../utils/constant'

const propTypes = {
  onCancel: PropTypes.func,
  visible: PropTypes.bool,
  form: PropTypes.object,
  handleOk: PropTypes.func,
  loading: PropTypes.bool,
}
const DownModal = ({
  visible,
  onCancel,
  handleOk,
  loading,
  form: {
    validateFieldsAndScroll,
    resetFields,
  },
}) => {
  const modalParam = {
    title: '导出上传明细',
    visible,
    onCancel() {
      resetFields()
      onCancel()
    },
    onOk() {
      validateFieldsAndScroll((error, value) => {
        if (!error) {
          handleOk(value)
        }
      })
    },
    afterClose() {
      resetFields()
      onCancel()
    },
    maskClosable: false,
    wrapClassName: 'aek-modal',
  }

  const formData = [
    {
      field: 'periodNo',
      label: '会计期间',
      layout: FORM_ITEM_LAYOUT,
      options: {
        rules: [{
          required: true,
          message: '必填项不能为空',
        }],
      },
      component: {
        name: 'MonthPicker',
        props: {
          disabledDate: (currentDate => currentDate.isAfter(moment(), 'month')),
          placeholder: '请选择时间',
        },
      },
    },
  ]

  return (
    <Modal {...modalParam}>
      <Spin spinning={loading}>
        <Form>
          <GetFormItem
            formData={formData}
          />
        </Form>
      </Spin>
    </Modal>
  )
}

DownModal.propTypes = propTypes
export default Form.create()(DownModal)
