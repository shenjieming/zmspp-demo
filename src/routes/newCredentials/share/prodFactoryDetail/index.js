import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Radio, Button, Spin, Alert } from 'antd'
import { flattenDeep } from 'lodash'
import GetFormItem from '../../../../components/GetFormItem/GetFormItem'
import { getCertificateForm, getViowArrItem } from './data'
import { getBasicFn, getTreeItem } from '../../../../utils'

const RadioGroup = Radio.Group
const propTypes = {
  refuseReasonList: PropTypes.array,
  form: PropTypes.object,
  dispatch: PropTypes.func,
  effects: PropTypes.object,
  prodFactoryVisible: PropTypes.bool, // 厂家总代三证详情弹框
  prodFactoryDetail: PropTypes.object, // 厂家总代三证详情
  eternalLifeObj: PropTypes.object, // 复选框状态
  radioChange: PropTypes.func,
  modalTitle: PropTypes.string,
  handleCancel: PropTypes.func,
  handleOk: PropTypes.func,
}
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
}
const ProdFactoryModal = ({
  refuseReasonList,
  effects,
  prodFactoryVisible, // 厂家总代三证详情弹框
  prodFactoryDetail, // 厂家总代三证详情
  eternalLifeObj, // 复选框状态
  radioChange,
  modalTitle,
  handleCancel,
  handleOk,
  form: {
    validateFieldsAndScroll,
    getFieldDecorator,
    resetFields,
  },
}) => {
  const {
    agentSupplierName,
    certificateDetailType,
    importedFlag,
    produceFactoryName,
    certificates,
  } = prodFactoryDetail

  const { toAction, getLoading } = getBasicFn({
    namespace: 'newMyCertificate',
    loading: {
      effects,
    },
  })
  const { getLoading: cusGetLoading } = getBasicFn({ namespace: 'newCustomerCertificate', loading: { effects } })
  const ok = () => {
    validateFieldsAndScroll((errors, data) => {
      if (!errors) {
        const certificateKeys = ['certificateImageUrls', 'certificateNo', 'time', 'validDateStart', 'validDateLongFlag']
        const basicReq = data
        const certificateArr = [8, 9, 10, 11, 12].map(_ => getViowArrItem(_))
        const mapper = []
        // 数据转换（时间、图片）
        const reqTransform = (key, value) => {
          if (key === 'time') {
            return value && value.length ? {
              validDateStart: value[0].format('YYYY-MM-DD'),
              validDateEnd: value[1].format('YYYY-MM-DD'),
            } : {
              validDateStart: undefined,
              validDateEnd: undefined,
            }
          } else if (key === 'validDateStart') {
            return { [key]: value && value.format('YYYY-MM-DD') }
          } else if (key === 'certificateImageUrls') {
            return { [key]: value.map(({ value: _ }) => _).join(',') }
          }
          return { [key]: value }
        }
        // main
        for (const [key, value] of Object.entries(basicReq)) {
          certificateKeys.some((item) => {
            const ret = key.includes(item)
            if (ret) {
              delete basicReq[key]
              const mixName = key.split('_')
              const callbackObj = reqTransform(mixName[0], value)
              const type = mixName[1] - 0
              if (value && !mapper.includes(type)) {
                mapper.push(type)
              }
              getTreeItem(
                certificateArr || [],
                'certificateType',
                type,
                _ => ({ ..._, ...callbackObj }),
              )
            }
            return ret
          })
        }
        // 过滤出提交的证件
        const mapperArr = certificateArr
          .filter(({ certificateType }) => mapper.includes(certificateType))
        basicReq.certificates = mapperArr
        handleOk(basicReq)
      }
    })
  }

  // 获取拓展信息
  const getExtendInfo = () => {
    let typeArr = certificateDetailType === 2 ? [8, 9] : [8]
    if (importedFlag) {
      typeArr.splice(1, 0, 10)
    } else {
      typeArr.splice(1, 0, 11)
    }
    if (certificates && (modalTitle === '查看厂家/总代证件' || modalTitle === '查看企业证件')) {
      const newArr = []
      for (const obj of certificates) {
        newArr.push(obj.certificateType)
      }
      typeArr = newArr
    }
    return [8, 9, 10, 11].map(certificateType => getCertificateForm({
      modalTitle,
      required: true,
      checked: eternalLifeObj[certificateType],
      exclude: !typeArr.includes(certificateType),
      checkedBoxOnchange({ target: { checked } }) {
        toAction({
          eternalLifeObj: {
            ...eternalLifeObj,
            [certificateType]: checked,
          },
        })
      },
      initialValue: getTreeItem(
        certificates || [],
        'certificateType',
        `${certificateType}`,
      ) || { certificateType },
    }))
  }
  let footer = [
    <Button key="cancel" onClick={() => { handleCancel() }}>取消</Button>,
    <Button key="submit" type="primary" onClick={() => { ok() }}>保存</Button>,
  ]
  if (modalTitle === '查看厂家/总代证件' || modalTitle === '查看企业证件') {
    footer = null
  }
  const modalOpts = {
    title: modalTitle,
    visible: prodFactoryVisible,
    afterClose() {
      resetFields()
      handleCancel()
    },
    wrapClassName: 'aek-modal',
    maskClosable: false,
    closable: true,
    footer,
    onCancel() {
      handleCancel()
    },
  }
  const handleChange = (e) => {
    radioChange(e.target.value)
  }
  const retRadio = () => {
    if (modalTitle === '查看厂家/总代证件' || modalTitle === '查看企业证件') {
      if (certificateDetailType === 1) {
        return <span>多证合一</span>
      }
      return <span>传统三证</span>
    }
    return (<RadioGroup onChange={handleChange} >
      <Radio value={1}>多证合一</Radio>
      <Radio value={2}>传统三证</Radio>
    </RadioGroup>)
  }
  const retRefuse = () => {
    let str = ''
    if (prodFactoryDetail.refuseType) {
      const newArr = prodFactoryDetail.refuseType.split(',')
      for (const item of newArr) {
        for (const itemList of refuseReasonList) {
          if (item === itemList.dicValue) {
            str += `${itemList.dicValueText};`
          }
        }
      }
    }
    if (prodFactoryDetail.refuseReason) {
      str += `${prodFactoryDetail.refuseReason};`
    }
    return str
  }
  const resuseReason = () => {
    if (prodFactoryDetail.platformAuthStatus === 3) {
      if (prodFactoryDetail.refuseReason || prodFactoryDetail.refuseType) {
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
    <Modal {...modalOpts}>
      <Spin spinning={getLoading('getprodFactoryDetai', 'setProdFactorySubmit', 'setProdFactoryReplace') || cusGetLoading('getprodFactoryDetai')}>
        {resuseReason()}
        <Form>
          <Form.Item {...formItemLayout} label="厂家类型">
            <span className="ant-form-text">{importedFlag ? '进口厂家' : '国产厂家'}</span>
          </Form.Item>
          <Form.Item {...formItemLayout} label="生产厂家">
            <span className="ant-form-text">{produceFactoryName}</span>
          </Form.Item>
          {
            importedFlag ? <Form.Item {...formItemLayout} label="全国总代">
              <span className="ant-form-text">{agentSupplierName}</span>
            </Form.Item> : ''
          }
          <Form.Item {...formItemLayout} label="证件类型">
            {getFieldDecorator('certificateDetailType', {
              initialValue: certificateDetailType || 1,
            })(
              retRadio(),
            )}
          </Form.Item>
          <GetFormItem
            formData={flattenDeep(getExtendInfo())}
          />
        </Form>
      </Spin>
    </Modal>
  )
}

ProdFactoryModal.propTypes = propTypes

export default Form.create()(ProdFactoryModal)

