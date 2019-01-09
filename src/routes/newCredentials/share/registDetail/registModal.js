import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Spin, Form, Button, Alert, message as MSG } from 'antd'

import GetFormItem from '../../../../components/GetFormItem'
import { formData } from './data'


function RegistModal({
  loading, // 弹框的loading状态
  modalVisible, // 弹框的显隐visible
  step, // 弹框步骤  1是第一步 2 是第二部
  status, // 弹框的状态 1 新增 2. 编辑 3. 换证  4. 查看
  form: {
    resetFields,
    validateFields,
    getFieldValue,
  },
  nextHandleClick, // 下一步事件
  handleCancel, // 关闭弹框或者取消事件
  detail,
  checkedLongchange, // 长期有效事件
  agentOptionsSearch, // 注册证号异步搜索
  registCodeOptions, // 注册证号失焦
  registCodeSelect, // 注册证下拉选择
  firstFormData, // 下拉框选中的数据

  handleChangeStep, // 上一步下一步状态更改

  agentOptions,
  factoryOptions,
  checkedFactorySelect, // 生产企业选择
  checkedFactorychange, // 生产企业异步搜索
  registRadioChange,

  produceOptionsSearch, // 总代异步搜索
  produceOptionsSelect, // 总代下拉选择

  refuseReasonList, // 拒绝原因列表

  handleRelieve, // 解除换证

  radioButtonClick,

  handleReload, // 同步标准证件信息

  handleOk, // 提交事件

  viewModal, // 注册证查看

  getRegistList, // 关闭弹框 从新刷新列表

  registTypeList, // 获取配置注册证

  noCertificateClick,
}) {
  const getFirstForm = () => {
    const callback = (errors, values) => {
      if (!errors) {
        nextHandleClick(values).then((repData) => {
          const { maintenanceFlag, replacedCertificateNo } = repData
          if (maintenanceFlag) {
            // if (replacedCertificateNo) { // 判断当前输入证件是否已经被换证
            //   MSG.error(`${values.certificateNo}已是${replacedCertificateNo}新证，请检查是否换错。`)
            // } else
            if (status === 1) {
              MSG.error('该证件已维护！')
            } else if (status === 3) {
              MSG.success('该证件已维护，换证成功！')
              getRegistList()
            }
          } else {
            handleChangeStep(2)
          }
        })
      }
    }
    validateFields(callback)
  }

  const submit = () => {
    validateFields((errors, data) => {
      if (!errors) {
        handleOk(data)
      }
    })
  }

  // 获取弹框按钮
  const getFooter = () => {
    if (step === 1) {
      return [
        <Button
          key="cancel"
          onClick={() => {
            handleCancel()
            resetFields()
          }}
        >取消</Button>,
        <Button
          key="next"
          type="primary"
          onClick={getFirstForm}
        >下一步</Button>,
      ]
    } else if (status === 2) {
      return [
        <Button
          key="cancel"
          onClick={() => {
            handleCancel()
            resetFields()
          }}
        >取消</Button>,
        <Button
          key="submit"
          type="primary"
          onClick={submit}
        >提交</Button>,
      ]
    } else if (status === 4) {
      return null
    }
    return [
      <Button
        key="cancel"
        onClick={() => {
          handleChangeStep(1)
        }}
      >上一步</Button>,
      <Button
        key="next"
        type="primary"
        onClick={submit}
      >提交</Button>,
    ]
  }

  const getTitle = () => {
    let title = ''
    if (status === 1) {
      title = '添加注册证'
    } else if (status === 2) {
      title = '编辑注册证'
    } else if (status === 3) {
      title = '换证'
    } else {
      title = '查看注册证'
    }
    return title
  }

  const modalPorps = {
    title: getTitle(status),
    visible: modalVisible,
    maskClosable: false,
    wrapClassName: 'aek-modal',
    width: 600,
    onCancel() {
      resetFields()
      handleCancel()
    },
    afterClose() {
      resetFields()
      handleCancel()
    },
    footer: getFooter(),
    zIndex: status === 4 ? 902 : 901,
  }

  const handleBack = () => {
    handleChangeStep(1)
  }

  const retRefuse = () => {
    let str = ''
    if (detail.refuseType) {
      const newArr = detail.refuseType.split(',')
      for (const item of newArr) {
        for (const itemList of refuseReasonList) {
          if (item === itemList.dicValue) {
            str += `${itemList.dicValueText};`
          }
        }
      }
    }
    if (detail.refuseReason) {
      str += `${detail.refuseReason};`
    }
    return str
  }

  const resuseReason = () => {
    let props = {}
    if (step === 2 && Number(detail.certificateType) < 0 && status !== 4) {
      props = {
        message: '无证号资质无需平台审核，提交后即可使用',
        type: 'info',
        showIcon: true,
        className: 'aek-mb20',
      }
    } else if (step === 2 && detail.standardCertificateId && !detail.platformAuthStatus) {
      props = {
        message: '平台已经存在这本证件，请上传证件扫描件或图片信息',
        type: 'info',
        showIcon: true,
        className: 'aek-mb20',
      }
    } else if (step === 2 && status === 1) {
      props = {
        message: '平台尚未添加此证件，请填写好证件信息，并将证件的首页及附页图片或扫描件上传，提交至客服进行审核。',
        type: 'info',
        showIcon: true,
        className: 'aek-mb20',
      }
    } else if (detail.platformAuthStatus === 1) {
      props = {
        message: '证件信息已提交至客服进行审核，如果您发现有误，可以立即更改后重新提交',
        type: 'info',
        showIcon: true,
        className: 'aek-mb20',
      }
    } else if (detail.platformAuthStatus === 3) {
      if (detail.refuseReason || detail.refuseType) {
        props = {
          message: '拒绝原因',
          description: retRefuse(),
          type: 'warning',
          showIcon: true,
          className: 'aek-mb20 aek-word-break',
        }
      } else {
        return undefined
      }
    } else {
      return undefined
    }
    return <Alert {...props} />
  }

  const formDataArray = formData(
    {
      step,
      status,
      registCodeOptions,
      agentOptionsSearch(keywords, excludeCertificateId) {
        const { key } = getFieldValue('certificateType')
        agentOptionsSearch(keywords, key, excludeCertificateId)
      },
      registCodeSelect,
      detail,
      factoryOptions,
      checkedLongchange,
      checkedFactorySelect, // 生产企业选择
      checkedFactorychange, // 生产企业异步搜索
      handleBack,
      firstFormData,
      agentOptions, // 总代
      registRadioChange, // 是否进口
      produceOptionsSearch, // 总代异步搜索
      produceOptionsSelect, // 总代下拉选择
      handleRelieve,
      radioButtonClick: () => {
        radioButtonClick()
      }, // 证件类型点击事件
      handleReload, // 同步标准证件信息事件
      viewModal, // 注册证查看

      registTypeList,

      noCertificateClick,
    },
  )

  return (
    <Modal {...modalPorps} >
      <Spin
        spinning={loading}
      >
        {/*{resuseReason()}*/}
        <Form>
          <GetFormItem
            formData={formDataArray}
          />
        </Form>
      </Spin>
    </Modal>
  )
}

RegistModal.propTypes = {
  modalVisible: PropTypes.bool.isRequired,
  loading: PropTypes.bool,
  status: PropTypes.number.isRequired,
  form: PropTypes.object,
  handleCancel: PropTypes.func,
  nextHandleClick: PropTypes.func,
  detail: PropTypes.object,

  step: PropTypes.number,
  handleChangeStep: PropTypes.func,

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
  firstFormData: PropTypes.object,
  handleRelieve: PropTypes.func,
  radioButtonClick: PropTypes.func,
  handleReload: PropTypes.func,

  handleOk: PropTypes.func,
  viewModal: PropTypes.func,
  getRegistList: PropTypes.func,

  registTypeList: PropTypes.array,

  noCertificateClick: PropTypes.func,
}

export default Form.create()(RegistModal)
