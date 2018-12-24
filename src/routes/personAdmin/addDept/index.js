import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Spin, TreeSelect, Select } from 'antd'
import { FORM_ITEM_LAYOUT } from '../../../utils/constant'

const FormItem = Form.Item
const Option = Select.Option
const AddDept = ({
  addModalVisible,
  dispatch,
  effects,
  deptSelect,
  orgType,
  form: {
    getFieldDecorator,
    validateFields,
    resetFields,
  },
}) => {
  // selectTree 上级菜单树
  const selectTreesProps = {
    treeDefaultExpandAll: true,
    treeData: deptSelect,
    labelInValue: true,
  }
  const addModalProp = {
    title: '新增部门',
    visible: addModalVisible,
    maskClosable: false,
    onCancel() {
      dispatch({ type: 'personAdmin/updateState', payload: { addModalVisible: false } })
    },
    afterClose() {
      resetFields()
    },
    onOk() {
      validateFields((errors, values) => {
        if (errors) {
          return
        }
        dispatch({
          type: 'personAdmin/postDept',
          payload: {
            ...values,
            deptParentId: values.deptParent.value,
            deptParentName: values.deptParent.label,
          },
        })
      })
    },
  }
  return (
    <Modal {...addModalProp} >
      <Spin spinning={!!effects['personAdmin/postDept']}>
        <Form>
          {orgType === '02' ? <FormItem {...FORM_ITEM_LAYOUT} label="部门类型">
            {getFieldDecorator('deptType', {
              initialValue: null,
            })(
              <Select>
                <Option value="1">后勤科室</Option>
                <Option value="2">医技科室</Option>
                <Option value="3">医疗科室</Option>
                <Option value="4">行政科室</Option>
              </Select>,
            )}
          </FormItem>
            : ''
          }
          <FormItem {...FORM_ITEM_LAYOUT} label="上级部门">
            {getFieldDecorator('deptParent', {
              initialValue: null,
              rules: [{
                required: true,
                message: '上级部门不能为空',
              }],
            })(
              <TreeSelect
                {...selectTreesProps}
              />,
            )}
          </FormItem>
          <FormItem {...FORM_ITEM_LAYOUT} label="部门名称">
            {getFieldDecorator('deptName', {
              rules: [{
                required: true,
                message: '部门名称不能为空',
              },
              {
                max: 20,
                message: '最多20个字符',
              }],
            })(
              <Input placeholder="最多20个字符" />,
            )}
          </FormItem>
        </Form>
      </Spin>
    </Modal>
  )
}
AddDept.propTypes = {
  dispatch: PropTypes.func,
  form: PropTypes.object.isRequired,
  effects: PropTypes.object,
  deptDetail: PropTypes.object,
  addModalVisible: PropTypes.bool,
  deptSelect: PropTypes.array,
  orgType: PropTypes.string,
}
export default Form.create()(AddDept)
