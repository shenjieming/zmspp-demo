import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form } from 'antd'
import GetFormItem from '../../components/GetFormItem/GetFormItem'
import { refuseFromData } from './modalData'
import { segmentation } from '../../utils'

const propTypes = {
  refuseModalVisible: PropTypes.bool,
  refusedReasonList: PropTypes.array,
  loading: PropTypes.bool,
  toAction: PropTypes.func,
  refuseModalData: PropTypes.array,
  form: PropTypes.object,
}

const ModalRefuse = ({
  refusedReasonList,
  refuseModalVisible,
  loading,
  toAction,
  refuseModalData,
  form: {
    validateFieldsAndScroll,
    setFieldsValue,
    resetFields,
  },
}) => {
  const onOk = () => {
    validateFieldsAndScroll((errors, { refuseReasonCheckbox, refuseReason }) => {
      if (!errors) {
        const getRefuseReason = (textArr = [], text) => {
          if (text.indexOf(textArr[0]) === 0) {
            return text
          }
          return segmentation([segmentation(textArr, '、'), text], '，')
        }
        const req = refuseModalData.map(item => ({
          ...item,
          refuseReason: getRefuseReason(refuseReasonCheckbox, refuseReason),
        }))
        toAction({ data: req }, 'batchRefuse')
      }
    })
  }
  const modalOpts = {
    title: '拒绝原因',
    afterClose: resetFields,
    visible: refuseModalVisible,
    confirmLoading: loading,
    maskClosable: false,
    onCancel() {
      toAction({ refuseModalVisible: false })
    },
    onOk,
    wrapClassName: 'aek-modal',
  }
  return (
    <Modal {...modalOpts}>
      <Form>
        <GetFormItem
          formData={refuseFromData(refusedReasonList, (textArr) => {
            setFieldsValue({ refuseReason: segmentation(textArr, '、') })
          })}
        />
      </Form>
    </Modal>
  )
}

ModalRefuse.propTypes = propTypes

export default Form.create()(ModalRefuse)
