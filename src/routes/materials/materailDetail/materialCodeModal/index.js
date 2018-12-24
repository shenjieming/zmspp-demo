import React from 'react'
import PropTypes from 'prop-types'
import { Form, Modal } from 'antd'
import { debounce } from 'lodash'
import { form } from './data'
import GetFormItem from '../../../../components/GetFormItem'
import { getOption } from '../../../../utils'

const AddCertificateModal = ({
  dispatchAction,
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
    onOk: handleOk,
    width: 800,
    maskClosable: false,
    wrapClassName: 'aek-modal',
  }
  const onSearchSkuList = debounce((val) => {
    dispatchAction({
      type: 'getSkuDicValueList',
      payload: {
        keywords: val,
      },
    })
  }, 500)
  const initObj = {
    addModalType,
    currentItem,
  }
  const eventFun = {
    asyncSkuList() {
      return {
        children: getOption(packageUnit, { idStr: 'dicValue', nameStr: 'dicValueText' }),
        onSearch: onSearchSkuList,
      }
    },
  }
  return (
    <Modal {...modalOpts}>
      <Form>
        <GetFormItem
          formData={form(initObj, eventFun)}
        />
      </Form>
    </Modal>
  )
}
AddCertificateModal.propTypes = {
  currentItem: PropTypes.object,
  packageUnit: PropTypes.array,
  certSortShow: PropTypes.bool,
  longStatus: PropTypes.bool,
  timeIsOffReQuire: PropTypes.bool,
  certIsOff: PropTypes.bool,
  delayIsOff: PropTypes.bool,
  proxyIsOff: PropTypes.bool,
  suppProList: PropTypes.array,
  produceList: PropTypes.array,
  fileEndDate: PropTypes.string,
  addModalType: PropTypes.string,
  dispatchAction: PropTypes.func,
  onCancel: PropTypes.func,
  addSkuModalVisible: PropTypes.bool,
  form: PropTypes.object,
}
export default Form.create()(AddCertificateModal)
