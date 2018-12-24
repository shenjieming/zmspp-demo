import React from 'react'
import PropTypes from 'prop-types'
import { Button, Input, Form } from 'antd'
import styles from './index.less'

const FormItem = Form.Item

const ConfirmText = ({ confirmText, onBack, onSubmit, loading, form }) => {
  const handleSubmit = (e) => {
    e.preventDefault()
    form.validateFields((err, values) => {
      if (!err) {
        onSubmit(values.confirmText)
      }
    })
  }

  const backFn = () => {
    onBack(form.getFieldValue('confirmText'))
  }
  const TextArea = Input.TextArea
  const { getFieldDecorator } = form
  return (
    <div style={{ height: '100%', background: '#fff', overflow: 'hidden' }}>
      <div className={styles.nav} onClick={backFn}>
        <div className={[styles.icon, styles.back, styles.leftBtn].join(' ')} />
        输入确认信息
      </div>
      <div className={styles.content} style={{ padding: '10px' }}>
        <Form onSubmit={handleSubmit}>
          <FormItem>
            {getFieldDecorator('confirmText', {
              rules: [{ required: true, message: '请输入确认信息!' }],
              initialValue: confirmText,
            })(<TextArea rows={4} placeholder="请输入确认信息..." />)}
            <div style={{ margin: '50px 0', textAlign: 'center' }}>
              <Button
                className={styles.btn}
                htmlType="submit"
                loading={loading.effects['confirmOrder/submit']}
                type="primary"
                style={{ width: '70%', height: '40px' }}
              >
                确认订单
              </Button>
            </div>
          </FormItem>
        </Form>
      </div>
    </div>
  )
}

ConfirmText.propTypes = {
  confirmText: PropTypes.string,
  onBack: PropTypes.func,
  onSubmit: PropTypes.func,
  loading: PropTypes.object,
}

export default Form.create()(ConfirmText)
