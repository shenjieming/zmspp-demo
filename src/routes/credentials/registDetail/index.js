import React from 'react'
import PropTypes from 'prop-types'
import { Alert, Form, Input, Modal, Spin } from 'antd'
import GetFormItem from '../../../components/GetFormItem'
import { formData } from './data'
import { getBasicFn } from '../../../utils'

const RegistDetailModal = ({
  refuseReasonList,
  registDetail, // 注册证详情
  registDetailVisible, // 注册证弹框
  registCodeOptions, // 证号模糊匹配
  effects,
  modalTitle,
  handleCancel,
  handleOk,
  checkedLongchange,
  agentOptionsSearch,
  onStartTimeChange,
  typeSelectChange,
  registCodeSelected,
  registCodeSelect,
  regitstCodeBlur,
  factoryOptions,
  checkedFactorychange,
  registRadioChange,
  produceOptionsSearch,
  checkedFactorySelect,
  produceOptionsSelect,
  agentOptions,
  handleReplaced,
  form: {
    validateFields,
    resetFields,
    setFieldsValue,
  },
}) => {
  const { getLoading } = getBasicFn({ namespace: 'myCertificate', loading: { effects } })
  const { getLoading: cusGetLoading } = getBasicFn({ namespace: 'customerCertificate', loading: { effects } })
  const addModalProp = {
    title: modalTitle,
    visible: registDetailVisible,
    wrapClassName: 'aek-modal',
    maskClosable: false,
    width: 600,
    onCancel() {
      handleCancel()
    },
    afterClose() {
      resetFields()
      handleCancel()
    },
    okText: '确认',
    onOk() {
      validateFields((errors, values) => {
        if (errors) {
          return
        }
        handleOk(values)
      })
    },
  }
  if (modalTitle === '查看注册证') {
    addModalProp.footer = null
  }
  const retRefuse = () => {
    let str = ''
    if (registDetail.refuseType) {
      const newArr = registDetail.refuseType.split(',')
      for (const item of newArr) {
        for (const itemList of refuseReasonList) {
          if (item === itemList.dicValue) {
            str += `${itemList.dicValueText};`
          }
        }
      }
    }
    if (registDetail.refuseReason) {
      str += `${registDetail.refuseReason};`
    }
    return str
  }
  const resuseReason = () => {
    if (registDetail.platformAuthStatus === 3) {
      if (registDetail.refuseReason || registDetail.refuseType) {
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
      <Spin spinning={getLoading('getRegistDetaiList', 'setRegistReplace', 'setRegistSubmit') || cusGetLoading('getRegistDetaiList')}>
        {resuseReason()}
        <Form>
          <GetFormItem
            formData={formData({
              registDetail,
              modalTitle,
              registCodeOptions,
              checkedLongchange,
              agentOptionsSearch,
              onStartTimeChange,
              typeSelectChange,
              registCodeSelected,
              registCodeSelect,
              regitstCodeBlur,
              factoryOptions,
              checkedFactorychange,
              registRadioChange,
              produceOptionsSearch,
              checkedFactorySelect,
              produceOptionsSelect,
              agentOptions,
              handleReplaced,
              setFieldsValue,
            },
            )}
          />
        </Form>
      </Spin>
    </Modal>
  )
}
RegistDetailModal.propTypes = {
  form: PropTypes.object,
  effects: PropTypes.object,
  registDetailVisible: PropTypes.bool,
  modalTitle: PropTypes.string,
  handleCancel: PropTypes.func,
  handleOk: PropTypes.func,
  registDetail: PropTypes.object,
  registCodeOptions: PropTypes.array,
  checkedLongchange: PropTypes.func,
  agentOptionsSearch: PropTypes.func,
  onStartTimeChange: PropTypes.func,
  typeSelectChange: PropTypes.func,
  registCodeSelected: PropTypes.bool,
  registCodeSelect: PropTypes.func,
  regitstCodeBlur: PropTypes.func,
  factoryOptions: PropTypes.array,
  checkedFactorychange: PropTypes.func,
  registRadioChange: PropTypes.func,
  produceOptionsSearch: PropTypes.func,
  checkedFactorySelect: PropTypes.func,
  produceOptionsSelect: PropTypes.func,
  agentOptions: PropTypes.array,
  refuseReasonList: PropTypes.array,
  handleReplaced: PropTypes.func,
}
export default Form.create()(RegistDetailModal)
