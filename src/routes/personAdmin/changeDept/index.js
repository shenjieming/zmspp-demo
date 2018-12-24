import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Spin, TreeSelect, message } from 'antd'

const FormItem = Form.Item
const FORM_ITEM_LAYOUT = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
}
const ChangeDept = ({
  dispatch,
  effects,
  personDeptVisible,
  deptSelect,
  userId,
  deptId,
  deptName,
  form: {
    getFieldDecorator,
    resetFields,
    validateFields,
  },
}) => {
  const modalProps = {
    title: '更改部门',
    visible: personDeptVisible,
    maskClosable: false,
    onCancel() {
      dispatch({
        type: 'personAdminDetail/updateState',
        payload: {
          personDeptVisible: false,
        },
      })
    },
    afterClose() {
      resetFields()
    },
    onOk() {
      if (!deptSelect || !deptSelect[0] || !deptSelect[0].children === 0) {
        message.error('请先维护部门', 3)
        return
      }
      validateFields((errors, values) => {
        if (!errors) {
          dispatch({
            type: 'personAdminDetail/postPersonDept',
            payload: {
              ...values,
              userId,
            },
          })
        }
      })
    },
  }
  return (
    <Modal {...modalProps}>
      <Spin spinning={!!effects['personAdminDetail/postPersonDept']}>
        <Form>
          <FormItem {...FORM_ITEM_LAYOUT} label="部门">
            {getFieldDecorator('deptId', {
              rules: [{
                required: true,
                message: '请选择部门',
              }],
              initialValue: deptId,
            })(
              <TreeSelect
                treeData={deptSelect}
                notFoundContent=""
                allowClear
              />,
            )}
          </FormItem>
        </Form>
      </Spin>
    </Modal>
  )
}

ChangeDept.propTypes = {
  effects: PropTypes.object,
  dispatch: PropTypes.func,
  form: PropTypes.object,
  personDeptVisible: PropTypes.bool,
  deptSelect: PropTypes.array,
  userId: PropTypes.string,
  deptId: PropTypes.string,
  deptName: PropTypes.string,
}

export default Form.create()(ChangeDept)
