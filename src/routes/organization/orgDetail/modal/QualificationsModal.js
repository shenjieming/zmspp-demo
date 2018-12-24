import React from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Input, Modal, Select, Spin } from 'antd'
import moment from 'moment'
import TimeChange from './TimeItem'
import { CERTIFICATE_TYPE } from '../../../../utils/constant'
import { uploadButton, getConfig } from '../../../../components/UploadButton'

const FormItem = Form.Item
const Option = Select.Option
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
}
const formItemLayout2 = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
}
const newCertificate = []
for (const [key, val] of Object.entries(CERTIFICATE_TYPE)) {
  newCertificate.push({ id: key, name: val })
}

const modal = ({
  certificateList,
  currentOrgDetail,
  qualificationsLoadingStatus,
  longStatus,
  checkboxChange,
  modelTypeQualifications,
  qualificationsModalVisible,
  onOkQualifications,
  currentQualifications,
  onCancel,
  fileExit,
  form: { getFieldDecorator, validateFields, getFieldsValue, resetFields },
}) => {
  const { orgTypeCode, profit } = currentOrgDetail
  const visible = qualificationsModalVisible
  const getImgUrls = (arr) => {
    const urlArr = []
    for (const item of arr) {
      urlArr.push(item.value)
    }
    return urlArr.join()
  }
  let certificates = []
  if (orgTypeCode === '04' || orgTypeCode === '07') {
    // 厂家 || 供应商&厂家
    certificates = [
      {
        id: '01',
        name: '营业执照',
      },
      {
        id: '02',
        name: '医疗器械经营许可证',
      },
      {
        id: '03',
        name: '税务登记证',
      },
      {
        id: '04',
        name: '医疗器械生产许可证',
      },
      {
        id: '06',
        name: '医疗器械经营备案证',
      },
    ]
  } else if (orgTypeCode === '03') {
    // 供应商
    certificates = [
      {
        id: '01',
        name: '营业执照',
      },
      {
        id: '02',
        name: '医疗器械经营许可证',
      },
      {
        id: '03',
        name: '税务登记证',
      },
      {
        id: '06',
        name: '医疗器械经营备案证',
      },
    ]
  } else if (orgTypeCode === '02') {
    // 医疗机构
    if (profit) {
      // 营利机构
      certificates = [
        {
          id: '01',
          name: '营业执照',
        },
        {
          id: '05',
          name: '医疗机构执业许可证',
        },
      ]
    } else {
      certificates = [
        {
          id: '05',
          name: '医疗机构执业许可证',
        },
      ]
    }
  }
  const arrId = []
  for (const item of certificateList) {
    arrId.push(item.certificateType)
  }
  let certificateOption
  if (modelTypeQualifications !== 'update') {
    certificateOption = certificates.filter((item) => {
      if (arrId.indexOf(item.id) < 0) {
        return item
      }
      return ''
    })
  } else {
    certificateOption = newCertificate
  }
  function handleOk() {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }
      if (data.singleTime) {
        data.startDate = moment(data.singleTime).format('YYYY-MM-DD')
        data.endDate = moment(data.singleTime).format('YYYY-MM-DD')
        delete data.singleTime
      } else {
        data.startDate = moment(data.doubleTime[0]).format('YYYY-MM-DD')
        data.endDate = moment(data.doubleTime[1]).format('YYYY-MM-DD')
        delete data.doubleTime
      }
      data.eternalLife = data.eternalLife ? 1 : 0
      data.imageUrls = getImgUrls(data.imageUrls)
      if (modelTypeQualifications !== 'update') {
        onOkQualifications({ data: [data], orgCertificateType: 0 })
      } else {
        onOkQualifications({
          data: [{ ...data, certificateId: currentQualifications.certificateId }],
          orgCertificateType: 0,
        })
      }
    })
  }
  const modalOpts = {
    title: `${modelTypeQualifications === 'create' ? '新增' : '编辑'}`,
    visible,
    afterClose: resetFields,
    onCancel,
    onOk: handleOk,
    width: 700,
    maskClosable: false,
  }
  const fileType = [
    {
      type: 1,
      name: '营业执照',
    },
    {
      type: 2,
      name: '医疗器械经营许可证',
    },
    {
      type: 3,
      name: '税务登记证',
    },
  ]
  let listItem = []
  if (fileExit.length > 0) {
    const arr = fileExit.map(item => item.certificateType)
    for (const item of fileType) {
      if (arr.indexOf(item.type) === -1) {
        listItem.push(item)
      }
    }
  } else {
    listItem = [
      {
        type: 1,
        name: '营业执照',
      },
      {
        type: 2,
        name: '医疗器械经营许可证',
      },
      {
        type: 3,
        name: '税务登记证',
      },
    ]
  }
  return (
    <Modal {...modalOpts}>
      <Spin spinning={qualificationsLoadingStatus}>
        {visible ? (
          <Form layout="horizontal">
            <div className="aek-form-head">基本信息</div>
            <Row>
              <Col span={16}>
                <FormItem label="证件类型" {...formItemLayout}>
                  {getFieldDecorator('certificateType', {
                    initialValue: currentQualifications.certificateType
                      ? String(currentQualifications.certificateType)
                      : undefined,
                    rules: [{ required: true, message: '请选择' }],
                  })(
                    <Select placeholder="请选择" disabled={modelTypeQualifications === 'update'}>
                      {certificateOption.map(item => (
                        <Option key={item.id} value={item.id}>
                          {item.name}
                        </Option>
                      ))}
                    </Select>,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={16}>
                <FormItem label="证号" {...formItemLayout}>
                  {getFieldDecorator('certificateCode', {
                    initialValue: currentQualifications.certificateCode,
                    rules: [{ required: true, message: '必填！' }, { max: 40, message: '限制40字' }],
                  })(<Input placeholder="" />)}
                </FormItem>
              </Col>
            </Row>
            <TimeChange
              checkboxChange={checkboxChange}
              getFieldDecorator={getFieldDecorator}
              currentQualifications={currentQualifications}
              longStatus={longStatus}
            />
            <Row>
              <Col span={24}>
                <FormItem label="证件照上传" {...formItemLayout2}>
                  {getFieldDecorator('imageUrls', {
                    ...getConfig(currentQualifications.imageUrls),
                    rules: [{ required: true, message: '请选择图片' }],
                  })(uploadButton)}
                </FormItem>
              </Col>
            </Row>
          </Form>
        ) : (
          ''
        )}
      </Spin>
    </Modal>
  )
}
modal.propTypes = {
  certificateList: PropTypes.array,
  currentOrgDetail: PropTypes.object,
  qualificationsLoadingStatus: PropTypes.bool,
  longStatus: PropTypes.bool,
  fileExit: PropTypes.array,
  qualificationsModalVisible: PropTypes.bool,
  checkboxChange: PropTypes.func,
  onOkQualifications: PropTypes.func,
  modelTypeQualifications: PropTypes.string,
  form: PropTypes.object.isRequired,
  currentQualifications: PropTypes.object,
  onCancel: PropTypes.func,
}
export default Form.create()(modal)
