import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Spin, Checkbox } from 'antd'
import { FORM_ITEM_LAYOUT } from '../../../utils/constant'
import Styles from '../index.less'

const FormItem = Form.Item

const AddRole = ({
  dispatch,
  effects,
  roleList,
  addRoleVisible,
  orgRoleList,
  deptName,
  orgName,
  form: {
    getFieldDecorator,
    resetFields,
    validateFields,
  },
}) => {
  // 转义组织下的角色
  if (orgRoleList && orgRoleList.length !== 0) {
    for (const obj of orgRoleList) {
      obj.label = obj.roleName
      obj.value = obj.roleId
      obj.key = obj.roleId
    }
  }
  // 复选框默认选中的值
  const checkDefault = []
  if (roleList && roleList.length !== 0) {
    for (const obj of roleList) {
      checkDefault.push(obj.roleId)
    }
  }
  const modalProps = {
    visible: addRoleVisible,
    title: '编辑角色',
    maskClosable: false,
    onCancel() {
      dispatch({
        type: 'personAdminDetail/updateState',
        payload: {
          addRoleVisible: false,
        },
      })
    },
    afterClose() {
      resetFields()
    },
    onOk() {
      validateFields((errors, values) => {
        if (errors) {
          return
        }
        const newArray = []
        for (const obj of values.roles) {
          const newObj = {}
          newObj.roleId = obj
          newArray.push(newObj)
        }
        dispatch({
          type: 'personAdminDetail/postPersonRole',
          payload: {
            ...values,
            roles: newArray,
          },
        })
      })
    },
  }
  return (
    <Modal {...modalProps} className={Styles['aek-add-role']}>
      <Spin spinning={!!effects['personAdminDetail/postPersonRole']}>
        <Form>
          <FormItem {...FORM_ITEM_LAYOUT} label="所属机构">
            <span className="ant-form-text">{orgName}</span>
          </FormItem>
          <FormItem {...FORM_ITEM_LAYOUT} label="角色">
            {getFieldDecorator('roles', {
              initialValue: checkDefault,
              rules: [
                { required: true, message: '请选择角色' },
              ],
            })(
              <Checkbox.Group options={orgRoleList} />,
            )}
          </FormItem>
        </Form>
      </Spin>
    </Modal>
  )
}

AddRole.propTypes = {
  effects: PropTypes.object,
  dispatch: PropTypes.func,
  form: PropTypes.object,
  roleList: PropTypes.array,
  addRoleVisible: PropTypes.bool,
  orgRoleList: PropTypes.array,
  deptName: PropTypes.string,
  orgName: PropTypes.string,
}

export default Form.create()(AddRole)
