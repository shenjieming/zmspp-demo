import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Input, DatePicker } from 'antd'
import moment from 'moment'
import { noop } from 'lodash'
import { FORM_ITEM_LAYOUT } from '../../../../../utils/constant'

const FormItem = Form.Item
const propTypes = {
  visible: PropTypes.bool,
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
  form: PropTypes.object,
}
const PrintModal = ({
  visible,
  onCancel = noop,
  onOk = noop,
  form: { resetFields, validateFields, getFieldDecorator },
}) => {
  const modalOpts = {
    title: '批量录入发票信息',
    visible,
    wrapClassName: 'aek-modal',
    maskClosable: false,
    onCancel() {
      onCancel()
      resetFields()
    },
    onOk() {
      validateFields((error, values) => {
        if (!error) {
          const invoiceDate = moment(values.invoiceDate).format('YYYY-MM-DD')
          onOk({ ...values, invoiceDate })
          onCancel()
          resetFields()
        }
      })
    },
    afterClose: resetFields,
  }
  return (
    <Modal {...modalOpts}>
      <div
        className="aek-text-bold aek-font-mid"
        style={{ textAlign: 'center', marginBottom: '16px' }}
      >
        在下面输入发票信息，单击确定后自动填充所有配送明细
      </div>
      <Form>
        <FormItem {...FORM_ITEM_LAYOUT} label="发票号码">
          {getFieldDecorator('invoiceNo', {
            rules: [
              {
                required: true,
                message: '请输入发票号码!',
              },
            ],
          })(<Input style={{ width: '60%' }} placeholder="请输入发票号码" />)}
        </FormItem>
        <FormItem {...FORM_ITEM_LAYOUT} label="发票日期">
          {getFieldDecorator('invoiceDate', {
            rules: [
              {
                required: true,
                message: '请选择发票日期!',
              },
            ],
          })(
            <DatePicker
              placeholder="请选择发票日期"
              disabledDate={(startValue) => {
                const endValue = moment(new Date())
                if (!startValue || !endValue) {
                  return false
                }
                return startValue.valueOf() >= endValue.valueOf()
              }}
            />,
          )}
        </FormItem>
      </Form>
    </Modal>
  )
}

PrintModal.propTypes = propTypes

export default Form.create()(PrintModal)
