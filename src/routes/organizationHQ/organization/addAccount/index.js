import React from 'react'
import PropTypes from 'prop-types'
import { Form, Modal, Button } from 'antd'
import GetFormItem from '../../../../components/GetFormItem'
import { form } from './data'

const AddPerson = ({
  backAccountObj,
  backAccountIdObj,
  accountExitFlag,
  addAccountVisible,
  dispatchAction,
  getLoading,
  form: {
    validateFields,
    resetFields,
  },
}) => {
  const handleOk = () => {
    validateFields((err, vals) => {
      if (err) {
        return
      }
      if (vals.mobile) {
        dispatchAction({ // 生成账号
          type: 'genAccount',
          payload: vals,
        })
      } else {
        dispatchAction({ // 绑定账号
          type: 'bindAccount',
        })
      }
    })
  }
  const addModalProp = {
    title: '生成管理员账号',
    visible: addAccountVisible,
    footer: <Button type="primary" loading={getLoading('genAccount', 'bindAccount')} onClick={handleOk}>提交</Button>,
    onCancel() {
      dispatchAction({
        payload: {
          addAccountVisible: false,
          accountExitFlag: false,
          backAccountObj: {},
        },
      })
    },
    maskClosable: false,
    afterClose() {
      resetFields()
    },
  }
  return (
    <Modal {...addModalProp} >
      <Form>
        <GetFormItem
          formData={form({ dispatchAction, accountExitFlag, backAccountIdObj, backAccountObj })}
        />
      </Form>
    </Modal>
  )
}
AddPerson.propTypes = {
  getLoading: PropTypes.func,
  saveAccount: PropTypes.func,
  backAccountObj: PropTypes.object,
  backAccountIdObj: PropTypes.object,
  accountExitFlag: PropTypes.bool,
  addAccountVisible: PropTypes.bool,
  dispatchAction: PropTypes.func,
  form: PropTypes.object.isRequired,
  effects: PropTypes.object,
  registPerson: PropTypes.object,
  personRegistFlag: PropTypes.bool,
  deptTreeList: PropTypes.array,
}
export default Form.create()(AddPerson)
