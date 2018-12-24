import React from 'react'
import PropTypes from 'prop-types'
import { Alert, Form, Spin, Modal } from 'antd'
import GetFormItem from '../../../components/GetFormItem'
import { formData } from './data'
import { getBasicFn } from '../../../utils'

const AuthDetailModal = ({
  refuseReasonList,
  authDetailVisible,
  effects,
  authDetail,
  modalTitle,
  handleCancel,
  handleOk,
  checkedFacAuthchange,
  checkedLongchange,
  agentOptions,
  factoryOptions,
  agentOptionsSearch,
  produceOptionsSearch,
  authTypeInfoOptions,
  form: {
    validateFields,
    resetFields,
  },
}) => {
  const { getLoading } = getBasicFn({ namespace: 'myCertificate', loading: { effects } })
  const { getLoading: cusGetLoading } = getBasicFn({ namespace: 'customerCertificate', loading: { effects } })
  const addModalProp = {
    title: modalTitle,
    visible: authDetailVisible,
    wrapClassName: 'aek-modal',
    maskClosable: false,
    onCancel() {
      handleCancel()
    },
    afterClose() {
      resetFields()
      handleCancel()
    },
    okText: '保存',
    onOk() {
      validateFields((errors, values) => {
        if (errors) {
          return
        }
        handleOk(values)
      })
    },
  }
  if (modalTitle === '查看授权书') {
    addModalProp.footer = null
  }
  const retRefuse = () => {
    let str = ''
    if (authDetail.refuseType) {
      const newArr = authDetail.refuseType.split(',')
      for (const item of newArr) {
        for (const itemList of refuseReasonList) {
          if (item === itemList.dicValue) {
            str += `${itemList.dicValueText};`
          }
        }
      }
    }
    if (authDetail.refuseReason) {
      str += `${authDetail.refuseReason};`
    }
    return str
  }
  const resuseReason = () => {
    if (authDetail.platformAuthStatus === 3) {
      if (authDetail.refuseReason || authDetail.refuseType) {
        return (<Alert
          message="拒绝原因"
          description={retRefuse()}
          type="warning"
          showIcon
        />)
      }
    }
    return ''
  }
  return (
    <Modal {...addModalProp} >
      <Spin spinning={getLoading('getAuthDetail', 'setAuthSubmit', 'setAuthReplace') || cusGetLoading('getAuthDetail')}>
        {resuseReason()}
        <Form>
          <GetFormItem
            formData={formData(checkedFacAuthchange,
              checkedLongchange,
              authDetail,
              agentOptions,
              factoryOptions,
              agentOptionsSearch,
              produceOptionsSearch,
              modalTitle,
              authTypeInfoOptions,
            )}
          />
        </Form>
      </Spin>
    </Modal>
  )
}
AuthDetailModal.propTypes = {
  refuseReasonList: PropTypes.array,
  form: PropTypes.object,
  effects: PropTypes.object,
  authDetailVisible: PropTypes.bool,
  authDetail: PropTypes.object,
  modalTitle: PropTypes.string,
  handleCancel: PropTypes.func,
  handleOk: PropTypes.func,
  checkedFacAuthchange: PropTypes.func,
  checkedLongchange: PropTypes.func,
  agentOptions: PropTypes.array,
  factoryOptions: PropTypes.array,
  agentOptionsSearch: PropTypes.func,
  produceOptionsSearch: PropTypes.func,
  authTypeInfoOptions: PropTypes.array,
}
export default Form.create()(AuthDetailModal)
