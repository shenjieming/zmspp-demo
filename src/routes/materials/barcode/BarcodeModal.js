import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Input, Form, Spin } from 'antd'
import Styles from './barcodeModal.less'

const propTypes = {
  form: PropTypes.object,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
  visible: PropTypes.bool,
  loading: PropTypes.bool,
}
const FormItem = Form.Item

const BarcodeModal = ({
  onOk,
  onCancel,
  visible,
  loading,
  form: { getFieldDecorator, validateFields, resetFields, getFieldsValue, setFieldsValue },
}) => {
  const okHandler = () => {
    const { barcode } = getFieldsValue(['barcode'])
    const validValue = barcode
      // .replace(/\(/g, '')
      // .replace(/\)/g, '')
      // .replace(/）/g, '')
      // .replace(/（/g, '')
      .replace(/\+/g, '+')
      .replace(/￥/g, '$')
    setFieldsValue({ barcode: validValue })
    // 验证
    validateFields((errors, values) => {
      if (!errors) {
        onOk(values.barcode).then(() => {
          resetFields()
        })
      }
    })
  }
  const cancelHandler = () => {
    // 重置
    resetFields()
    onCancel()
  }
  return (
    <Modal
      title={`${status === 'edit' ? '维护' : '新增'}规则`}
      visible={visible}
      width={1000}
      wrapClassName="aek-modal"
      onOk={okHandler}
      onCancel={cancelHandler}
      okText="下一步"
      maskClosable={false}
    >
      <Spin spinning={loading}>
        <div className={Styles.barcodeContainer}>
          <div className={Styles.barcodeHint}>请输入条码:</div>
          <FormItem>
            {getFieldDecorator('barcode', {
              initialValue: '',
              rules: [
                { required: true, whitespace: true, message: '请输入条码' },
                { pattern: /^[^\u4e00-\u9fa5]{0,}$/, message: '请输入正确的条码' },
              ],
            })(
              <Input
                className={`aek-barcode ${Styles.barcodeInput}`}
                maxLength="50"
                onPressEnter={okHandler}
              />,
            )}
          </FormItem>
        </div>
      </Spin>
    </Modal>
  )
}

BarcodeModal.propTypes = propTypes

export default Form.create()(BarcodeModal)
