import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Spin } from 'antd'
import { FORM_ITEM_LAYOUT, REGEXP_PHONE } from '../../../../utils/constant'

const FormItem = Form.Item
const EditConstact = ({
  editContactVisible,
  dispatch,
  effects,
  defaultContactObj,
  form: {
    getFieldDecorator,
    validateFields,
    resetFields,
  },
}) => {
  const editModalProp = {
    title: defaultContactObj.customerContactName && defaultContactObj.customerContactPhone ? '编辑联系人' : '添加联系人',
    visible: editContactVisible,
    onCancel() {
      dispatch({ type: 'myCustomer/updateState', payload: { editContactVisible: false } })
    },
    maskClosable: false,
    afterClose() {
      resetFields()
    },
    onOk() {
      validateFields((errors, values) => {
        if (errors) {
          return
        }
        dispatch({
          type: 'myCustomer/setCustomerContrast',
          payload: {
            ...defaultContactObj,
            ...values,
          },
        })
      })
    },
  }
  return (
    <Modal {...editModalProp} >
      <Spin spinning={!!effects['personAdmin/postDept']}>
        <Form>
          <FormItem {...FORM_ITEM_LAYOUT} label="联系负责人">
            {getFieldDecorator('customerContactName', {
              initialValue: defaultContactObj.customerContactName,
            })(
              <Input placeholder="请输入联系负责人" />,
            )}
          </FormItem>
          <FormItem {...FORM_ITEM_LAYOUT} label="联系方式">
            {getFieldDecorator('customerContactPhone', {
              initialValue: defaultContactObj.customerContactPhone,
              rules: [
                {
                  pattern: REGEXP_PHONE,
                  message: '格式不正确',
                },
              ],
            })(
              <Input placeholder="请输入联系方式" />,
            )}
          </FormItem>
        </Form>
      </Spin>
    </Modal>
  )
}
EditConstact.propTypes = {
  dispatch: PropTypes.func,
  form: PropTypes.object.isRequired,
  effects: PropTypes.object,
  editContactVisible: PropTypes.bool,
  defaultContactObj: PropTypes.object,
}
export default Form.create()(EditConstact)
