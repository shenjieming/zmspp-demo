import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Radio, Spin } from 'antd'
import { flattenDeep } from 'lodash'
import GetFormItem from '../../../../components/GetFormItem/GetFormItem'
import { getCertificateForm, getViowArrItem, intactItem } from './data'
import { getBasicFn, getTreeItem } from '../../../../utils'

const RadioGroup = Radio.Group
const FormItem = Form.Item
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
}
const propTypes = {
  form: PropTypes.object,
  dispatch: PropTypes.func,
  certificates: PropTypes.array,
  effects: PropTypes.object,
  modalTitle: PropTypes.string,
  companyDetailVisible: PropTypes.bool,
  companyDetail: PropTypes.object,
  handleCancel: PropTypes.func,
  companyLifeObj: PropTypes.object,
  radioChange: PropTypes.func,
  orgName: PropTypes.string,
}

const CompanyModal = ({
  effects,
  dispatch,
  modalTitle,
  companyDetailVisible,
  companyDetail,
  handleCancel,
  companyLifeObj,
  radioChange,
  orgName,
  form: {
    validateFieldsAndScroll,
    getFieldDecorator,
    resetFields,
  },
}) => {
  const { toAction } = getBasicFn({
    namespace: 'newMyCertificate',
  })

  const handleOk = () => {
    validateFieldsAndScroll((errors, data) => {
      if (!errors) {
        const certificateKeys = ['imageUrls', 'certificateCode', 'time', 'startDate', 'eternalLife']
        const basicReq = data
        const certificateArr = [1, 2, 3, 4, 5, 6].map(_ => getViowArrItem(_))
        const mapper = []
        // 数据转换（时间、图片）
        const reqTransform = (key, value) => {
          if (key === 'time') {
            return value && value.length ? {
              startDate: value[0].format('YYYY-MM-DD'),
              endDate: value[1].format('YYYY-MM-DD'),
            } : {
              startDate: undefined,
              endDate: undefined,
            }
          } else if (key === 'startDate') {
            return { [key]: value && value.format('YYYY-MM-DD') }
          } else if (key === 'imageUrls') {
            return { [key]: value[0] && value.map(({ value: _ }) => _).join(',') }
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
                certificateArr,
                'certificateType',
                `0${type}`,
                _ => ({ ..._, ...callbackObj }),
              )
            }
            return ret
          })
        }
        // 过滤出提交的证件
        const mapperArr = certificateArr
          .filter(({ certificateType }) => mapper.includes(certificateType - 0))
        // 证件完善个数判断
        const count = mapperArr
          .filter(({ certificateType }) => [2, 4, 6].includes(certificateType - 0))
          .reduce((a, b) => a + intactItem(b), 0)
        if (!count) {
          Modal.error({
            title: '请完善信息',
            content: '医疗器械经营许可证、医疗器械生产许可证、医疗器械经营备案证，三个非必填项至少要完整填写一项',
          })
          return null
        }
        basicReq.data = mapperArr.filter(_ => intactItem(_))
        const certificateDetailType = companyDetail.certificateDetailType
        dispatch({
          type: 'newMyCertificate/setUpdateCerticicate',
          payload: {
            certificateDetailType,
            ...basicReq,
            handleType: 1,
            orgName,
          },
        })
      }
    })
  }

  // 获取拓展信息
  const getExtendInfo = () => {
    let typeArr = []
    if (modalTitle === '查看企业证件' || modalTitle === '查看企业三证') {
      for (const obj of (companyDetail.data || [])) {
        typeArr.push(obj.certificateType - 0)
      }
    } else {
      typeArr = companyDetail.certificateDetailType - 1 ? [1, 3, 2, 4, 6] : [1, 2, 4, 6]
    }
    return [1, 3, 2, 4, 6].map(certificateType => getCertificateForm({
      view: modalTitle === '查看企业证件' || modalTitle === '查看企业三证',
      required: [1, 3].includes(certificateType) || undefined,
      checked: companyLifeObj[certificateType],
      exclude: !typeArr.includes(certificateType),
      checkedBoxOnchange({ target: { checked } }) {
        toAction({
          companyLifeObj: {
            ...companyLifeObj,
            [certificateType]: checked,
          },
        })
      },
      initialValue: getTreeItem(
        companyDetail.data || [],
        'certificateType',
        `0${certificateType - 0}`,
      ) || { certificateType },
    }))
  }
  const modalOpts = {
    title: modalTitle,
    visible: companyDetailVisible,
    afterClose() {
      resetFields()
      handleCancel()
    },
    wrapClassName: 'aek-modal',
    maskClosable: true,
    closable: true,
    onOk() {
      handleOk()
    },
    onCancel() {
      handleCancel()
    },
  }
  if (modalTitle === '查看企业证件' || modalTitle === '查看企业三证') {
    modalOpts.footer = null
  }
  const handleChange = (e) => {
    radioChange(e.target.value)
  }
  const retRadio = () => {
    if (modalTitle === '查看企业证件' || modalTitle === '查看企业三证') {
      if (companyDetail.certificateDetailType === 1) {
        return <span>多证合一</span>
      }
      return <span>传统三证</span>
    }
    return (<RadioGroup onChange={handleChange} >
      <Radio value={1}>多证合一</Radio>
      <Radio value={2}>传统三证</Radio>
    </RadioGroup>)
  }
  return (
    <Modal {...modalOpts}>
      <Spin spinning={!!effects['myCertificate/getCompanyDetail'] || !!effects['myCertificate/setUpdateCerticicate']}>
        <Form>
          <FormItem {...formItemLayout} label="证件类型">
            {getFieldDecorator('certificateDetailType', {
              initialValue: companyDetail.certificateDetailType || 1,
            })(
              retRadio(),
            )}
          </FormItem>
          <GetFormItem
            formData={flattenDeep(getExtendInfo())}
          />
        </Form>
      </Spin>
    </Modal>
  )
}

CompanyModal.propTypes = propTypes

export default Form.create()(CompanyModal)

