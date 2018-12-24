import React from 'react'
import PropTypes from 'prop-types'
import { Alert, Form, Modal, Spin } from 'antd'
import GetFormItem from '../../../../components/GetFormItem'
import { formData } from './data'
import { getBasicFn } from '../../../../utils'

const OtherDetailModal = ({
  refuseReasonList,
  otherDetail, // 注册证详情
  otherDetailVisible, // 注册证弹框
  otherCustOptions, // 证号模糊匹配
  effects,
  modalTitle,
  handleCancel,
  handleOk,
  checkedLongchange,
  otherOptionsSearch,
  otherTypeOptions,
  form: {
    validateFields,
    resetFields,
  },
}) => {
  const { getLoading } = getBasicFn({ namespace: 'newMyCertificate', loading: { effects } })
  const { getLoading: cusGetLoading } = getBasicFn({ namespace: 'newCustomerCertificate', loading: { effects } })
  const addModalProp = {
    title: modalTitle,
    visible: otherDetailVisible,
    wrapClassName: 'aek-modal',
    width: 600,
    maskClosable: false,
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
  if (modalTitle === '查看服务承诺书' || modalTitle === '查看廉政协议书') {
    addModalProp.footer = null
  }
  const retRefuse = () => {
    let str = ''
    if (otherDetail.refuseType) {
      const newArr = otherDetail.refuseType.split(',')
      for (const item of newArr) {
        for (const itemList of refuseReasonList) {
          if (item === itemList.dicValue) {
            str += `${itemList.dicValueText};`
          }
        }
      }
    }
    if (otherDetail.refuseReason) {
      str += `${otherDetail.refuseReason};`
    }
    return str
  }
  const resuseReason = () => {
    if (otherDetail.platformAuthStatus === 3) {
      if (otherDetail.refuseReason || otherDetail.refuseType) {
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
      <Spin spinning={getLoading('getOtherDetail', 'setOtherSubmit', 'setOtherReplace') || cusGetLoading('getOtherDetail')}>
        {resuseReason()}
        <Form>
          <GetFormItem
            formData={formData(
              otherDetail,
              modalTitle,
              otherCustOptions,
              checkedLongchange,
              otherOptionsSearch,
              otherTypeOptions,
            )}
          />
        </Form>
      </Spin>
    </Modal>
  )
}
OtherDetailModal.propTypes = {
  refuseReasonList: PropTypes.array,
  form: PropTypes.object,
  effects: PropTypes.object,
  otherDetailVisible: PropTypes.bool,
  modalTitle: PropTypes.string,
  handleCancel: PropTypes.func,
  handleOk: PropTypes.func,
  otherDetail: PropTypes.object,
  checkedLongchange: PropTypes.func,
  otherCustOptions: PropTypes.array,
  otherOptionsSearch: PropTypes.func,
  otherTypeOptions: PropTypes.object,
}
export default Form.create()(OtherDetailModal)
