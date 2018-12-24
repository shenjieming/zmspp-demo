import React from 'react'
import PropTypes from 'prop-types'
import { Form, Modal, Spin, Alert } from 'antd'
import md5 from 'md5'
import GetFormItem from '../../../components/GetFormItem'
import { form } from './data'
import { cloneDeep } from 'lodash'

const AddPerson = ({
  addPersonModalVisible,
  dispatch,
  effects,
  registPerson,
  personRegistFlag,
  deptTreeList,
  deptName,
  deptId,
  form: { validateFields, resetFields, getFieldsValue, getFieldValue, setFieldsValue },
}) => {
  // 密码
  const pasdChange = () => {
    const confirmPassword = getFieldValue('confirmPassword')
    if (confirmPassword) {
      setFieldsValue({ confirmPassword: `${confirmPassword} ` })
      setFieldsValue({ confirmPassword: `${confirmPassword}` })
    }
  }
  // 确认密码
  const confirmPasdChange = () => {
    const password = getFieldValue('password')
    if (password) {
      setFieldsValue({ password: `${password} ` })
      setFieldsValue({ password: `${password}` })
    }
  }
  const recurFunc = (list) => {
    for (const obj of list) {
      obj.key = `${obj.deptId}`
      obj.value = `${obj.deptId}`
      obj.label = obj.deptName
      if (obj.children && obj.children.length !== 0) {
        recurFunc(obj.children)
      }
    }
  }
  recurFunc(deptTreeList)
  const addModalProp = {
    title: '新增人员',
    visible: addPersonModalVisible,
    maskClosable: false,
    onCancel() {
      dispatch({ type: 'personAdmin/updateState', payload: { addPersonModalVisible: false } })
    },
    afterClose() {
      resetFields()
      dispatch({
        type: 'personAdmin/updateState',
        payload: {
          personRegistFlag: false,
        },
      })
    },
    onOk() {
      validateFields((errors, values) => {
        if (errors) {
          return
        }
        if (!personRegistFlag) {
          values.password = md5(values.password).toUpperCase()
          values.confirmPassword = md5(values.confirmPassword).toUpperCase()
          dispatch({
            type: 'personAdmin/postNoRegistPerson',
            payload: values,
          })
          return
        }
        dispatch({
          type: 'personAdmin/postRegistPerson',
          payload: {
            ...values,
            ...registPerson,
          },
        })
      })
    },
  }
  const passwordContrast = () => {
    const data = getFieldsValue()
    if (data.confirmPassword === data.password) {
      return true
    }
    return false
  }
  let newArr = []
  if (deptTreeList && deptTreeList[0]) {
    newArr = deptTreeList[0].children
  }
  return (
    <Modal {...addModalProp}>
      <Spin
        spinning={
          !!effects['personAdmin/postRegistPerson'] || !!effects['personAdmin/postNoRegistPerson']
        }
      >
        <Alert message="手机号确保是公司员工本人的，否则将会添加无相关人员" type="info" showIcon className="aek-mb10" />
        <Form>
          <GetFormItem

            formData={form({
              dispatch,
              deptTreeList: newArr,
              personRegistFlag,
              registPerson,
              passwordContrast,
              deptName,
              deptId,
              getFieldValue,
              validateFields,
              pasdChange,
              confirmPasdChange,
            })}
          />
        </Form>
      </Spin>
    </Modal>
  )
}
AddPerson.propTypes = {
  dispatch: PropTypes.func,
  form: PropTypes.object.isRequired,
  effects: PropTypes.object,
  addPersonModalVisible: PropTypes.bool,
  registPerson: PropTypes.object,
  personRegistFlag: PropTypes.bool,
  deptTreeList: PropTypes.array,
  deptName: PropTypes.string,
  deptId: PropTypes.string,
}
export default Form.create()(AddPerson)
