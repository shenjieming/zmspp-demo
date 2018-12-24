import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Alert, Spin } from 'antd'
import { flattenDeep, debounce } from 'lodash'
import { animateScroll } from 'react-scroll'
import GetFormItem from '../../components/GetFormItem/GetFormItem'
import { typeId, formItemData, getCertificateForm, getViowArrItem, intactItem, getOrgCertificateType } from './modalData'
import getComponent from '../../components/GetFormItem/getComponent'
import { CONSUMER_HOTLINE } from '../../utils/config'
import { getTreeItem, getOption } from '../../utils'
import { modalTopOrgInfo } from '../../themes/id.less'

const propTypes = {
  buttonLoading: PropTypes.bool,
  bodyLoading: PropTypes.bool,
  addressList: PropTypes.array,
  organizationInfo: PropTypes.object,
  toAction: PropTypes.func,
  form: PropTypes.object,
}

const ModalOrgInfo = ({
  organizationInfo,
  toAction,
  buttonLoading,
  bodyLoading,
  form: {
    validateFieldsAndScroll,
    resetFields,
  },
  addressList,
}) => {
  const { auditStatus, orgType, reason, parentGrade, secondGrade, eternalLifeObj, profit, orgCertificateType, needCompleteInfo, orgDetail = {}, parentOrgList = [], orgIdSign, orgName } = organizationInfo
  const getAlter = () => {
    if ([1, 3].includes(auditStatus)) {
      const alertProps = {
        banner: true,
        showIcon: true,
        type: 'warning',
        style: { marginBottom: 16 },
      }
      if (auditStatus === 1) {
        alertProps.message = '审核中'
        // alertProps.description = `您的资料已提交，预计会在2个工作日内完成审核，审核通过后会短信通知至您手机，如果需要帮助，请联系客服人员：${CONSUMER_HOTLINE}`
        alertProps.description = `您的资料已提交，请联系客服审核，客服热线：${CONSUMER_HOTLINE}`
      } else {
        alertProps.message = '审核拒绝'
        alertProps.description = reason
      }
      return <Alert {...alertProps} />
    } else if (auditStatus === 0 && orgType === '03') {
      const liStyle = { listStyleType: 'circle' }
      const alertProps = {
        banner: true,
        showIcon: true,
        type: 'info',
        style: { marginBottom: 16 },
        message: '请您完善如下资料，方便客户查看您的资质：',
        description: (
          <div>
            <ul style={{ paddingLeft: 24 }}>
              <li style={liStyle}>企业基本信息</li>
              <li style={liStyle}>营业执照</li>
              <li style={liStyle}>税务登记证（如果营业执照为多证合一不用维护）</li>
              <li style={liStyle}>医疗器械经营许可证/医疗器械生产许可证/医疗器械经营备案证(至少维护一个)</li>
            </ul>
            提交后，平台会对您的资质进行审核，通过后给您开放更多功能。
          </div>
        ),
      }
      return <Alert {...alertProps} />
    }
    return null
  }

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
        const mapperArr = certificateArr
          .filter(({ certificateType }) => mapper.includes(certificateType - 0))
        if (orgType === typeId.supplier) {
          const count = mapperArr
            .filter(({ certificateType }) => [2, 4, 6].includes(certificateType - 0))
            .reduce((a, b) => a + intactItem(b), 0)
          if (!count) {
            Modal.error({
              title: '请完善信息',
              content: '医疗器械经营许可证、医疗器械经营备案证、医疗器械生产许可证，三个非必填项至少要完整填写一项',
            })
            return null
          }
        }
        basicReq.data = mapperArr.filter(_ => intactItem(_))
        toAction(basicReq, 'complementInfo').then(() => {
          animateScroll.scrollToTop({
            duration: 400,
            smooth: true,
            containerId: modalTopOrgInfo,
          })
        })
      }
    })
  }

  // 获取拓展信息
  const getExtendInfo = () => {
    let typeArr = []
    if (orgType === typeId.hospital) {
      typeArr = profit ? [5, 1] : [5]
    } else if (orgType === typeId.supplier) {
      typeArr = orgCertificateType - 1 ? [1, 3, 2, 4, 6] : [1, 2, 4, 6]
    }
    const data = orgDetail.certificates || []
    return [5, 1, 3, 2, 4, 6].map(certificateType => getCertificateForm({
      required: [1, 3, 5].includes(certificateType) || undefined,
      checked: eternalLifeObj[certificateType],
      exclude: !typeArr.includes(certificateType),
      checkedBoxOnchange({ target: { checked } }) {
        toAction({
          eternalLifeObj: {
            ...eternalLifeObj,
            [certificateType]: checked,
          },
        }, 'organizationInfo')
      },
      initialValue: getTreeItem(
        data,
        'certificateType',
        `0${certificateType}`,
      ) || { certificateType },
    }))
  }
  const modalOpts = {
    title: '信息完善',
    visible: !needCompleteInfo,
    afterClose: resetFields,
    wrapClassName: 'aek-modal-scroll',
    onCancel() {
      toAction({ needCompleteInfo: 1 }, 'organizationInfo')
    },
    maskClosable: false,
    footer: [0, 3].includes(auditStatus) ? getComponent({
      name: 'Button',
      props: {
        type: 'primary',
        onClick: handleOk,
        loading: buttonLoading,
        children: '提交审核',
      },
    }) : null,
  }
  const onSearchOrgDelay = debounce((value) => {
    toAction({ orgName: value }, 'queryParentOrgList')
  }, 500)
  return (
    <Modal {...modalOpts}>
      <div id={modalTopOrgInfo}>
        {getAlter()}
        <div className="aek-form-head">基本信息</div>
        <Form>
          <Spin spinning={bodyLoading}>
            <GetFormItem
              formData={flattenDeep(formItemData({
                orgType,
                parentGrade,
                secondGrade,
                addressList,
                orgIdSign,
                initialValue: { ...orgDetail, orgName },
                asyncParentOrgList: {
                  children: getOption(parentOrgList, { idStr: 'orgId', nameStr: 'orgName' }),
                  onSearch: onSearchOrgDelay,
                  onSelect(key, { props: { value: orgId, label } }) {
                    toAction({ selectOrg: { orgId, orgName: label } }, 'organizationInfo')
                  },
                },
                orgProfitOnChange(value) {
                  toAction({ profit: !!(value - 0) }, 'organizationInfo')
                },
              }))}
            />
          </Spin>
          <div className="aek-form-head">
            <span>扩展信息&nbsp;</span>
            <span className="aek-red" style={{ fontWeight: 400 }}>
              （注意：上传的证件必须要盖本公司红章）
            </span>
          </div>
          {
            orgType === typeId.supplier
              ? <GetFormItem
                formData={getOrgCertificateType({
                  initialValue: orgDetail,
                  orgCertificateTypeOnChange({ target: { value } }) {
                    toAction({ orgCertificateType: value }, 'organizationInfo')
                  },
                })}
              />
              : null
          }
          <GetFormItem
            formData={flattenDeep(getExtendInfo())}
          />
        </Form>
      </div>
    </Modal>
  )
}

ModalOrgInfo.propTypes = propTypes

export default Form.create()(ModalOrgInfo)
