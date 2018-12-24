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
  applyType,
  form: {
    getFieldDecorator,
    validateFields,
    resetFields,
  },
}) => {
  const handleOk = () => {
    validateFields((errors, values) => {
      if (!errors) {
        const url = applyType === 0 ? 'myCustomer/setRecoverRelation' : 'myCustomer/getApply'
        let reqData = {}
        if (applyType === 0) {
          reqData = {
            customerOrgId: customerId,
            ...values,
          }
        } else {
          reqData = {
            orgIdSign: customerId,
            ...values,
          }
        }
        dispatch({
          type: url,
          payload: reqData,
        })
      }
    })
  }
  // modal 弹框数据
  const applyModalProp = {
    title: '申请',
    zIndex: 1100,
    visible: applyVisible,
    wrapClassName: 'aek-modal',
    maskClosable: false,
    onCancel() {
      dispatch({ type: 'myCustomer/updateState', payload: { applyVisible: false, customerId: '' } })
    },
    afterClose() {
      resetFields()
    },
    footer: [
      <Button type="primary" onClick={handleOk}>提交</Button>,
    ],
  }
  return (
    <Modal {...applyModalProp} >
      <Spin spinning={!!effects['myCustomer/getApply']}>
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
  applyType: PropTypes.number,
}
export default Form.create()(ApplyModalProp)
