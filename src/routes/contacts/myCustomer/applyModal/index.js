import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Spin, Button } from 'antd'
import { FORM_ITEM_LAYOUT } from '../../../../utils/constant'

const FormItem = Form.Item
const { TextArea } = Input
const ApplyModalProp = ({
  applyVisible,
  dispatch,
  effects,
  customerId,
  form: {
    getFieldDecorator,
    validateFields,
    resetFields,
  },
}) => {
  const handleOk = () => {
    validateFields((errors, values) => {
      if (!errors) {
        const url = 'myCustomerDetail/setRecoverRelation'
        dispatch({
          type: url,
          payload: {
            customerOrgId: customerId,
            ...values,
          },
        })
      }
    })
  }
  // modal 弹框数据
  const applyModalProp = {
    title: '申请',
    visible: applyVisible,
    maskClosable: false,
    onCancel() {
      dispatch({ type: 'myCustomerDetail/updateState', payload: { applyVisible: false } })
    },
    afterClose() {
      resetFields()
    },
    footer: [
      <Button type="primary" key="submit" onClick={handleOk}>提交</Button>,
    ],
  }
  return (
    <Modal {...applyModalProp} >
      <Spin spinning={!!effects['myCustomerDetail/setRecoverRelation']}>
        <Form>
          <FormItem {...FORM_ITEM_LAYOUT} label="申请说明" >
            {getFieldDecorator('applyDescription', {
              rules: [{
                required: true, message: '请填写申请原因!',
              }],
            })(
              <TextArea placeholder="请输入申请原因" />,
            )}
          </FormItem>
        </Form>
      </Spin>
    </Modal>
  )
}
ApplyModalProp.propTypes = {
  dispatch: PropTypes.func,
  form: PropTypes.object.isRequired,
  effects: PropTypes.object,
  applyVisible: PropTypes.bool,
  customerId: PropTypes.string,
}
export default Form.create()(ApplyModalProp)
