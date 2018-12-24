import React from 'react'
import PropTypes from 'prop-types'
import { Form, Modal, Select, Spin } from 'antd'
import moment from 'moment'
import { form } from './data'
import GetFormItem from '../../../../components/GetFormItem'
import { getOption } from '../../../../utils'

const Option = Select.Option
const getImgUrls = (arr) => {
  const urlArr = []
  for (const item of arr) {
    urlArr.push(item.value)
  }
  return urlArr.join()
}
const propTypes = {
  onSearchProList: PropTypes.func,
  onSearchProxyFacList: PropTypes.func,
  onSearchNewCertList: PropTypes.func,
  currentItem: PropTypes.object,
  newCertList: PropTypes.array,
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
  getLoading: PropTypes.func,
  addModalVisible: PropTypes.bool,
  form: PropTypes.object,
  registTypeList: PropTypes.array,
}
const AddCertificateModal = ({
  onSearchProList,
  onSearchProxyFacList,
  onSearchNewCertList,
  currentItem,
  newCertList,
  certSortShow,
  longStatus,
  timeIsOffReQuire,
  certIsOff,
  delayIsOff,
  proxyIsOff,
  produceList,
  suppProList,
  fileEndDate,
  getLoading,
  addModalVisible: visible,
  addModalType,
  dispatchAction,
  form: { validateFields, resetFields, setFieldsValue, getFieldValue },
  registTypeList,
}) => {
  function handleOk() {
    validateFields((errors, vals) => {
      if (errors) {
        return
      }
      const data = { ...vals }
      data.validDateStart = moment(data.validDateStart).format('YYYY-MM-DD')
      if (data.certificateImageUrls) {
        data.certificateImageUrls = getImgUrls(data.certificateImageUrls)
      }
      if (data.validDateEnd) {
        data.validDateEnd = moment(data.validDateEnd).format('YYYY-MM-DD')
      }
      if (data.delayedDateEnd) {
        data.delayedDateEnd = moment(data.delayedDateEnd).format('YYYY-MM-DD')
      }
      if (data.validDateEndRequire) {
        data.validDateEnd = moment(data.validDateEndRequire).format('YYYY-MM-DD')
        delete data.validDateEndRequire
      }
      if (data.replacedFlag) {
        data.replacedCertificateId = data.replacedObj.key
        delete data.replacedObj
      }

      if (data.produceFactoryName) {
        data.produceFactoryName = vals.produceFactoryName.label
        data.produceFactoryId = vals.produceFactoryName.key
      }

      if (data.validDateLongFlag) {
        data.validDateLongFlag = true
      } else {
        data.validDateLongFlag = false
      }

      if (addModalType === 'create') {
        dispatchAction({
          type: 'addCert',
          payload: {
            ...currentItem,
            ...data,
          },
        })
      } else {
        dispatchAction({
          type: 'editCert',
          payload: {
            ...currentItem,
            ...data,
            agentSupplierId: undefined,
          },
        })
      }
    })
  }
  const modalOpts = {
    title: addModalType === 'create' ? '添加证件' : '编辑证件',
    visible,
    afterClose() {
      resetFields()
      dispatchAction({
        payload: {
          addModalVisible: false,
          fileEndDate: undefined,
          certSortShow: true,
          currentItem: {},
        },
      })
    },
    onCancel() {
      dispatchAction({
        payload: {
          addModalVisible: false,
          fileEndDate: undefined,
          certSortShow: true,
          currentItem: {},
        },
      })
    },
    onOk: handleOk,
    width: 1000,
    maskClosable: false,
    wrapClassName: 'aek-modal',
  }
  const initObj = {
    addModalType,
    newCertList,
    produceList,
    suppProList,
    certSortShow,
    timeIsOffReQuire,
    longStatus,
    fileEndDate,
    proxyIsOff,
    delayIsOff,
    certIsOff,
  }
  const eventFun = {
    certificateBlur(e) {
      const hasFlag = getFieldValue('certificateType')
      const hasJIN = e.target.value.includes('进')
      if (hasFlag && Number(hasFlag) === 1) {
        if (hasJIN) {
          setFieldsValue({ importedFlag: true })
        } else {
          setFieldsValue({ importedFlag: false })
        }
        dispatchAction({
          payload: {
            proxyIsOff: !hasJIN,
          },
        })
      }
    },
    onSearchSuppProList(val) {
      dispatchAction({
        type: 'getSuppProList',
        payload: {
          keywords: val,
        },
      })
    },
    certTypeChange(val) {
      // 证件切换
      if (Number(val) === 1) {
        dispatchAction({
          payload: { certSortShow: false, timeIsOffReQuire: false, longStatus: false },
        })
      } else {
        dispatchAction({
          payload: { certSortShow: true },
        })
      }
    },
    onStartTimeChange(filed) {
      filed &&
        dispatchAction({
          payload: {
            fileEndDate: moment(moment(filed).add(5, 'year'))
              .add(-1, 'days')
              .format('YYYY-MM-DD'),
          },
        })
    },
    // 获取新证号
    asyncNewCert: {
      children: getOption(newCertList, { idStr: 'certificateId', nameStr: 'certificateNo' }),
      onSelect() {
        dispatchAction({
          payload: {
            newCertList: [...newCertList],
          },
        })
      },
      onSearch: onSearchNewCertList,
    },
    // 获取厂家,
    asyncProdFac: {
      children: produceList.map(({ produceFactoryId, produceFactoryName }) => (
        <Option key={produceFactoryId} value={produceFactoryName}>
          {produceFactoryName}
        </Option>
      )),
      onSearch: onSearchProList,
    },
    // 获取总代
    asyncProxyFac: {
      children: suppProList.map(({ supplierId, supplierName }) => (
        <Option key={supplierId} value={supplierName}>
          {supplierName}
        </Option>
      )),
      onSearch: onSearchProxyFacList,
    },
    proxyRadioChange(e) {
      // 总代显示
      dispatchAction({
        payload: {
          proxyIsOff: !e.target.value,
        },
      })
    },
    delayRadioChange(e) {
      dispatchAction({
        payload: {
          delayIsOff: !e.target.value,
        },
      })
    },
    certRadioChange(e) {
      dispatchAction({
        payload: {
          certIsOff: !e.target.value,
        },
      })
    },
    onIsLongCheckboxChange(e) {
      dispatchAction({
        payload: {
          timeIsOffReQuire: e.target.checked,
          fileEndDate: undefined,
          longStatus: e.target.checked,
        },
      })
    },
  }
  return (
    <Modal {...modalOpts}>
      <Spin spinning={getLoading('viewDetailCert', 'addCert', 'editCert')}>
        <Form>
          <GetFormItem formData={form(initObj, eventFun, currentItem, registTypeList)} />
        </Form>
      </Spin>
    </Modal>
  )
}
AddCertificateModal.propTypes = propTypes
export default Form.create()(AddCertificateModal)
