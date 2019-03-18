import React from 'react'
import PropTypes from 'prop-types'
import { Form, Modal, Button, Input } from 'antd'
import PlainForm from '../../../../components/PlainForm/index'
import dataDetail from './data'

const ReviewModal = ({
  getLoading,
  auditDetailObj,
  onRefuse,
  onPassOrg,
  reviewModalVisible,
  onCancel,
  form: { getFieldDecorator, validateFieldsAndScroll, resetFields },
}) => {
  const { topData } = dataDetail(auditDetailObj)
  const { certificates, orgIdSign } = { ...auditDetailObj }
  function refuse() {
    validateFieldsAndScroll((errors, vals) => {
      if (errors) {
        return
      }
      onRefuse({ ...vals, orgIdSign, auditStatus: 3 })
    })
  }
  const footerObj = [
    <Button loading={getLoading('refuseOrg')} key={1} onClick={refuse}>
      拒绝
    </Button>,
    <Button
      key={2}
      loading={getLoading('passOrg')}
      onClick={() => onPassOrg({ orgIdSign, auditStatus: 2 })}
      type="primary"
    >
      通过
    </Button>,
  ]
  const modalOpts = {
    title: '审核机构',
    visible: reviewModalVisible,
    afterClose: resetFields,
    footer: footerObj,
    onCancel,
    width: 650,
    maskClosable: false,
    wrapClassName: 'aek-modal',
  }
  return (
    <Modal {...modalOpts}>
      <Form>
        <div className="aek-form-head">基本信息</div>
        <PlainForm size={1} data={topData} />
        <div className="aek-form-head">扩展信息</div>
        {certificates &&
          certificates.length > 0 &&
          certificates.map(
            ({
              certificateCode,
              certificateId,
              typeText,
              imageUrls,
              startDate,
              endDate,
              eternalLife,
            }) => {
              const effectTime = eternalLife ? `${startDate} ~ 长期有效` : `${startDate || ''} ~ ${endDate || ''}`
              return (
                <PlainForm
                  key={certificateId}
                  size={1}
                  data={{
                    证件类型: typeText,
                    '证件照|img': imageUrls,
                    证号: certificateCode,
                    有效期: effectTime,
                  }}
                />
              )
            },
          )}
        <Form.Item
          label="拒绝原因"
          style={{ marginTop: 10 }}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
        >
          {getFieldDecorator('reason', {
            rules: [{ required: true, message: '请输入' }],
            initialValue: undefined,
          })(<Input placeholder="请输入拒绝原因" />)}
        </Form.Item>
      </Form>
    </Modal>
  )
}
ReviewModal.propTypes = {
  getLoading: PropTypes.func,
  auditDetailObj: PropTypes.object,
  onRefuse: PropTypes.func,
  onPassOrg: PropTypes.func,
  onCancel: PropTypes.func,
  onChange: PropTypes.func,
  reviewModalVisible: PropTypes.bool,
  form: PropTypes.object,
}

export default Form.create()(ReviewModal)
