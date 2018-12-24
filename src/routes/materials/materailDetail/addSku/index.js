import React from 'react'
import PropTypes from 'prop-types'
import { Form, Modal, Spin } from 'antd'
import { form } from './data'
import GetFormItem from '../../../../components/GetFormItem'
import { getOption } from '../../../../utils'

const propTypes = {
  getLoading: PropTypes.func,
  currentItem: PropTypes.object,
  packageUnit: PropTypes.array,
  addModalType: PropTypes.string,
  dispatchAction: PropTypes.func,
  addSkuModalVisible: PropTypes.bool,
  form: PropTypes.object,
}
const AddCertificateModal = ({
  dispatchAction,
  getLoading,
  addSkuModalVisible,
  currentItem,
  addModalType,
  packageUnit,
  form: { validateFields, resetFields },
}) => {
  function handleOk() {
    validateFields((errors, vals) => {
      if (errors) {
        return
      }
      const data = { ...vals }
      if (addModalType === 'create') {
        dispatchAction({
          type: 'saveSku',
          payload: data,
        })
      } else {
        dispatchAction({
          type: 'updateSku',
          payload: data,
        })
      }
    })
  }
  const modalOpts = {
    title: addModalType === 'create' ? '新增规格' : '编辑规格',
    visible: addSkuModalVisible,
    afterClose: resetFields,
    onCancel() {
      dispatchAction({
        payload: {
          addSkuModalVisible: false,
          currentItem: {},
        },
      })
    },
    confirmLoading: getLoading('saveSku', 'updateSku'),
    onOk: handleOk,
    width: 800,
    maskClosable: false,
    wrapClassName: 'aek-modal',
  }
  const initObj = {
    addModalType,
    currentItem,
  }
  const eventFun = {
    asyncSkuList: {
      children: getOption(packageUnit, { idStr: 'dicValue', nameStr: 'dicValueText' }),
    },
  }
  return (
    <Modal {...modalOpts}>
      <Spin spinning={getLoading('querySkuDetail', 'saveSku', 'updateSku')}>
        <Form>
          <GetFormItem
            formData={form(initObj, eventFun)}
          />
        </Form>
      </Spin>
    </Modal>
  )
}
AddCertificateModal.propTypes = propTypes
export default Form.create()(AddCertificateModal)
