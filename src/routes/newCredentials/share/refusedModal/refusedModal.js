import React from 'react'
import PropTypes from 'prop-types'
import { Form, Spin, Modal, Checkbox } from 'antd'
import GetFormItem from '../../../../components/GetFormItem'
import { NO_LABEL_LAYOUT } from '../../../../utils/constant'
import Styles from './index.less'

const RefusedModal = ({
  loading,
  handleCancel,
  handleOk,
  refusedReasonVisible,
  refusedReasonList,
  form: {
    validateFields,
    resetFields,
    setFieldsValue,
    getFieldValue,
  },
}) => {
  const addModalProp = {
    title: '拒绝原因',
    visible: refusedReasonVisible,
    wrapClassName: 'aek-modal',
    maskClosable: false,
    onCancel() {
      handleCancel()
    },
    afterClose() {
      resetFields()
      handleCancel()
    },
    okText: '提交',
    onOk() {
      validateFields((errors, values) => {
        if (errors) {
          return
        }
        handleOk(values)
      })
    },
    zIndex: 1001,
  }
  const formData = [{
    layout: NO_LABEL_LAYOUT,
    field: 'refuseReason',
    component: {
      name: 'TextArea',
      props: {
        placeholder: '请输入',
      },
    },
  }]
  // 复选框列表
  const checkboxList = () => {
    const handleChange = (e, item) => {
      const areaValue = getFieldValue('refuseReason') || ''
      const { target } = e
      if (target.checked) {
        let arr = ''
        if (areaValue) {
          if (areaValue.endsWith('；')) {
            arr = `${areaValue}${item.dicValueText}`
          } else {
            arr = `${areaValue}；${item.dicValueText}`
          }
        } else {
          arr = item.dicValueText
        }
        setFieldsValue({
          refuseReason: arr,
        })
      } else {
        let arr = ''
        if (areaValue.includes(`${item.dicValueText}；`)) {
          arr = areaValue.replace(`${item.dicValueText}；`, '')
        } else if (areaValue.includes(`${item.dicValueText}`)) {
          arr = areaValue.replace(`${item.dicValueText}`, '')
        } else {
          arr = areaValue
        }
        setFieldsValue({
          refuseReason: arr,
        })
      }
    }
    const retArray = refusedReasonList.map(item => (
      <Checkbox
        key={item.dicValueId}
        onChange={(e) => {
          handleChange(e, item)
        }}
      >{item.dicValueText}</Checkbox>
    ))
    return retArray
  }
  return (
    <Modal {...addModalProp} >
      <Spin spinning={loading}>
        <div className={Styles['checkbox-list']}>
          {refusedReasonVisible ? checkboxList() : ''}
        </div>
        <Form className="aek-mt20">
          <GetFormItem
            formData={formData}
          />
        </Form>
      </Spin>
    </Modal>
  )
}
RefusedModal.propTypes = {
  form: PropTypes.object,
  loading: PropTypes.bool,
  handleCancel: PropTypes.func,
  refusedReasonVisible: PropTypes.bool,
  handleOk: PropTypes.func,
  refusedReasonList: PropTypes.array,
}
export default Form.create()(RefusedModal)
