import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Alert, Radio, Button, Spin } from 'antd'
import { animateScroll } from 'react-scroll'
import { flattenDeep } from 'lodash'
import GetFormItem from '@components/GetFormItem/GetFormItem'
import { typeId, getCertificateForm, getViowArrItem, intactItem } from './modalData'
import { getBasicFn, getTreeItem } from '@utils'
import { CONSUMER_HOTLINE } from '@config'
import { modalTopOrgInfoChange } from '../../../themes/id.less'

const RadioGroup = Radio.Group
const FormItem = Form.Item
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
}
const propTypes = {
  organizationInfo: PropTypes.object,
  form: PropTypes.object,
  dispatch: PropTypes.func,
  certificates: PropTypes.array,
  loading: PropTypes.bool,
  reason: PropTypes.string,
  auditStatus: PropTypes.number,
  orgName: PropTypes.string,
}

const ModalOrgInfo = ({
  loading,
  dispatch,
  organizationInfo,
  certificates,
  reason,
  auditStatus,
  orgName,
  form: { validateFieldsAndScroll, resetFields },
}) => {
  const { modalVisible, orgType, eternalLifeObj, profit, radioChange } = organizationInfo
  const { toAction } = getBasicFn({
    namespace: 'organInfo',
  })

  const getAlter = () => {
    if ([1, 3].includes(auditStatus)) {
      const alertProps = {
        banner: true,
        showIcon: true,
        type: 'warning',
      }
      if (auditStatus === 1) {
        alertProps.message = '审核中'
        alertProps.description = ''
      } else {
        alertProps.message = '审核拒绝'
        alertProps.description = reason
      }
      return <Alert {...alertProps} />
    }
    return ''
  }

  const handleOk = (handleType) => {
    validateFieldsAndScroll((errors, data) => {
      if (!errors) {
        const certificateKeys = ['imageUrls', 'certificateCode', 'time', 'startDate', 'eternalLife']
        const basicReq = data
        const certificateArr = [1, 2, 3, 4, 5, 6].map(_ => getViowArrItem(_))
        const mapper = []
        // 数据转换（时间、图片）
        const reqTransform = (key, value) => {
          if (key === 'time') {
            return value && value.length
              ? {
                startDate: value[0].format('YYYY-MM-DD'),
                endDate: value[1].format('YYYY-MM-DD'),
              }
              : {
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
              getTreeItem(certificateArr, 'certificateType', `0${type}`, _ => ({
                ..._,
                ...callbackObj,
              }))
            }
            return ret
          })
        }
        // 过滤出提交的证件
        // const mapperArr = certificateArr.filter(({ certificateType }) =>
        //   mapper.includes(certificateType - 0),
        // )
        // // 证件完善个数判断
        // if (['03', '04', '07'].includes(orgType)) {
        //   const count = mapperArr
        //     .filter(({ certificateType }) => [2, 4, 6].includes(certificateType - 0))
        //     .reduce((a, b) => a + intactItem(b), 0)
        //   if (!count && handleType) {
        //     Modal.error({
        //       title: '请完善信息',
        //       content:
        //         '医疗器械经营许可证、医疗器械生产许可证、医疗器械经营备案证，三个非必填项至少要完整填写一项',
        //     })
        //     return null
        //   }
        // }
        basicReq.data = certificateArr.filter(_ => intactItem(_))
        for (const obj of basicReq.data) {
          for (const oldObj of certificates) {
            if (obj.certificateType === oldObj.certificateType) {
              obj.certificateId = oldObj.certificateId
            }
          }
        }
        let certificateType
        if (orgType === '03') {
          certificateType = organizationInfo.certificateType
        }
        dispatch({
          type: 'organInfo/setCertificateForFront',
          payload: {
            certificateType,
            ...basicReq,
            handleType,
            orgName,
          },
        }).then(() => {
          if (['03', '04', '07'].includes(orgType)) {
            animateScroll.scrollToTop({
              duration: 400,
              smooth: true,
              containerId: modalTopOrgInfoChange,
            })
          }
        })
      }
    })
  }
  // 获取拓展信息
  const getExtendInfo = () => {
    let typeArr = []
    if (orgType === typeId.hospital) {
      typeArr = profit ? [5, 1] : [5]
    } else if (['03', '04', '07'].includes(orgType)) {
      typeArr = organizationInfo.certificateType - 1 ? [1, 2, 3, 4, 6] : [1, 2, 4, 6]
    }
    let newArr = []
    if (auditStatus === 1) {
      for (const obj of certificates) {
        newArr.push(Number(obj.certificateType))
      }
    } else {
      newArr = [5, 1, 3, 2, 4, 6]
    }
    return newArr.map(certificateType =>
      getCertificateForm({
        required: [1, 3, 5].includes(certificateType) || undefined,
        checked: eternalLifeObj[certificateType],
        exclude: !typeArr.includes(certificateType),
        defaultView: auditStatus === 1,
        checkedBoxOnchange({ target: { checked } }) {
          toAction({
            eternalLifeObj: {
              ...eternalLifeObj,
              [certificateType]: checked,
            },
          })
        },
        initialValue: getTreeItem(certificates, 'certificateType', `0${certificateType}`) || {
          certificateType,
        },
      }),
    )
  }
  const footer = []
  if (auditStatus === 1) {
    footer.push(
      <Button
        key="save"
        disabled
        onClick={() => {
          handleOk(0)
        }}
      >
        暂存
      </Button>,
    )
    footer.push(
      <Button key="pending" disabled>
        审核中
      </Button>,
    )
  } else {
    footer.push(
      <Button
        key="save"
        onClick={() => {
          handleOk(0)
        }}
      >
        暂存
      </Button>,
    )
    footer.push(
      <Button
        key="submit"
        type="primary"
        onClick={() => {
          handleOk(1)
        }}
      >
        提交审核
      </Button>,
    )
  }
  const modalOpts = {
    title: '编辑企业证件',
    visible: modalVisible,
    afterClose: resetFields,
    wrapClassName: ['03', '04', '07'].includes(orgType) ? 'aek-modal-scroll' : '',
    maskClosable: true,
    closable: true,
    footer,
    onCancel() {
      dispatch({
        type: 'organInfo/updateState',
        payload: {
          modalVisible: false,
        },
      })
    },
  }
  const handleChange = (e) => {
    radioChange(e.target.value)
  }
  return (
    <Modal {...modalOpts}>
      <div id={['03', '04', '07'].includes(orgType) ? modalTopOrgInfoChange : undefined}>
        <Spin spinning={loading}>
          {getAlter()}
          <Form className="aek-mt10">
            {['03', '04', '07'].includes(orgType) && (
              <FormItem {...formItemLayout} label="证件类型">
                <RadioGroup
                  disabled={auditStatus === 1}
                  defaultValue={organizationInfo.certificateType}
                  onChange={handleChange}
                >
                  <Radio value={1}>多证合一</Radio>
                  <Radio value={2}>传统三证</Radio>
                </RadioGroup>
              </FormItem>
            )}
            <GetFormItem formData={flattenDeep(getExtendInfo())} />
          </Form>
        </Spin>
      </div>
    </Modal>
  )
}

ModalOrgInfo.propTypes = propTypes

export default Form.create()(ModalOrgInfo)
