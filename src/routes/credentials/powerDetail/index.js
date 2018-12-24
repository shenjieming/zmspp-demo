import React from 'react'
import PropTypes from 'prop-types'
import { Alert, Form, Modal, Spin } from 'antd'
import GetFormItem from '../../../components/GetFormItem'
import { formData } from './data'
import { getBasicFn } from '../../../utils'

const PowerDetailModal = ({
  refuseReasonList,
  effects,
  modalTitle,
  handleCancel,
  handleOk,
  checkedLongchange,
  powerDetail, // 委托书详情
  powerDetailVisible, // 委托书详情弹框
  powerDetailCustOptions, // 授权书详情客户名称
  powerDetailPersonOptions, // 授权书详情人员名称
  powerCustOptions,
  powerPersonOptions,
  powerPersonSetPhone,
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
    visible: powerDetailVisible,
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
  if (modalTitle === '查看委托书') {
    addModalProp.footer = null
  }
  const retRefuse = () => {
    let str = ''
    if (powerDetail.refuseType) {
      const newArr = powerDetail.refuseType.split(',')
      for (const item of newArr) {
        for (const itemList of refuseReasonList) {
          if (item === itemList.dicValue) {
            str += `${itemList.dicValueText};`
          }
        }
      }
    }
    if (powerDetail.refuseReason) {
      str += `${powerDetail.refuseReason};`
    }
    return str
  }
  const resuseReason = () => {
    if (powerDetail.platformAuthStatus === 3) {
      if (powerDetail.refuseReason || powerDetail.refuseType) {
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
      <Spin spinning={getLoading('getPowerDetail', 'setPowerReplace', 'setPowerSubmit') || cusGetLoading('getPowerDetail')}>
        {resuseReason()}
        <Form>
          <GetFormItem
            formData={formData(
              checkedLongchange,
              modalTitle,
              powerDetail,
              powerDetailCustOptions,
              powerDetailPersonOptions,
              powerCustOptions,
              powerPersonOptions,
              powerPersonSetPhone,
              setFieldsValue,
            )}
          />
        </Form>
      </Spin>
    </Modal>
  )
}
PowerDetailModal.propTypes = {
  refuseReasonList: PropTypes.array,
  form: PropTypes.object,
  effects: PropTypes.object,
  powerDetailVisible: PropTypes.bool,
  powerDetail: PropTypes.object,
  modalTitle: PropTypes.string,
  handleCancel: PropTypes.func,
  handleOk: PropTypes.func,
  checkedLongchange: PropTypes.func,
  powerDetailCustOptions: PropTypes.array,
  powerDetailPersonOptions: PropTypes.array,
  powerCustOptions: PropTypes.func,
  powerPersonOptions: PropTypes.func,
  powerPersonSetPhone: PropTypes.func,
}
export default Form.create()(PowerDetailModal)
