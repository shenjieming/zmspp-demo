import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Alert } from 'antd'
import GetFormItem from '../../components/GetFormItem/GetFormItem'
import { viewFormData, editFormData } from './modalData'

const propTypes = {
  editModalVisible: PropTypes.bool,
  loading: PropTypes.bool,
  codeMust: PropTypes.bool,
  modalType: PropTypes.string,
  toAction: PropTypes.func,
  suppliersSelect: PropTypes.array,
  packageUnit: PropTypes.array,
  modalInitValue: PropTypes.object,
  form: PropTypes.object,
}

const ModalEditMaterial = ({
  editModalVisible,
  loading,
  codeMust,
  modalType,
  toAction,
  packageUnit,
  modalInitValue = {},
  suppliersSelect,
  form: {
    validateFieldsAndScroll,
    resetFields,
    setFieldsValue,
  },
}) => {
  const getAlter = () => {
    if (modalInitValue.platformAuthStatus === 1) {
      const alertProps = {
        banner: true,
        showIcon: true,
        type: 'info',
        message: '平台已整理',
        description: '平台已将该物料按照国家颁发的注册证进行统一归档整理，物料中的物资名称、规格型号、注册证、厂家、品牌信息将不可再修改',
      }
      return (<Alert {...alertProps} />)
    }
    return null
  }
  const onOk = () => {
    validateFieldsAndScroll((errors, data) => {
      if (!errors) {
        const foo = () => {
          const req = data
          req.materialsCommonName = req.materialsCommenName
          req.supplierOrgId = req.supplierOrgId.key
          if (req.inviteType === '1' && req.inviteNo) {
            req.inviteNo = undefined
          }
          if (req.materials) {
            req.materialsUnit = req.materials.key
            req.materialsUnitText = req.materials.title || req.materials.label
            delete req.materials
          }
          if (modalType === 'edit') {
            toAction({ ...modalInitValue, ...req }, 'updateMaterial')
          } else if (modalType === 'addForDic') {
            toAction({ ...modalInitValue, ...req }, 'addStandardMaterial')
          } else if (modalType === 'add') {
            toAction({ ...modalInitValue, ...req }, 'addMaterial')
          }
        }
        if (data.inviteType === '1' && data.inviteNo) {
          Modal.confirm({
            title: '是否继续完善招标信息？',
            content: '检测到您填写了招标编号，但没有选择招标类型。如果继续提交，招标编号将被忽视。',
            onCancel() {
              foo()
            },
            okText: '去完善',
            cancelText: '继续提交',
          })
        } else {
          foo()
        }
      }
    })
  }
  const getTitle = () => {
    if (modalType === 'edit') {
      return '编辑物料'
    } else if (modalType === 'addForDic') {
      return '加入目录'
    }
    return '新增物料'
  }
  const modalOpts = {
    title: getTitle(),
    visible: editModalVisible,
    wrapClassName: 'aek-modal',
    confirmLoading: loading,
    maskClosable: false,
    afterClose() {
      resetFields()
      toAction({
        modalInitValue: {},
        codeMust: false,
      })
    },
    onCancel() { toAction({ editModalVisible: false }) },
    onOk,
  }
  const viewFlag = modalInitValue.platformAuthStatus === 1 || modalType === 'addForDic'
  return (
    <Modal {...modalOpts}>
      {getAlter(modalInitValue.platformAuthStatus === 1)}
      <div className="aek-form-head">基本信息</div>
      <Form>
        <GetFormItem
          formData={viewFormData({
            initialValue: {
              ...modalInitValue,
              materialsCommenName: modalInitValue.materialsCommenName || modalInitValue.materialsCommonName,
              materialsUnit: viewFlag
                ? modalInitValue.materialsUnitText
                : modalInitValue.materialsUnit,
            },
            modalType,
            packageUnit,
          })}
          allView={viewFlag}
        />
      </Form>
      <div className="aek-form-head">补充信息</div>
      <Form>
        <GetFormItem
          formData={editFormData({
            initialValue: modalInitValue,
            codeMust,
            suppliersSelect,
            onSearch(keywords) {
              toAction({ keywords }, 'suppliersSelect')
            },
            selectEvent(flag) {
              toAction({ codeMust: flag })
              setFieldsValue({ inviteNo: ' ' })
              setFieldsValue({ inviteNo: undefined })
            },
          })}
        />
      </Form>
    </Modal>
  )
}

ModalEditMaterial.propTypes = propTypes

export default Form.create()(ModalEditMaterial)
