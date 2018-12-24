import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Row, Col } from 'antd'
import { getOptions } from 'aek-upload'

import { FORM_ITEM_LAYOUT } from '../../../../utils/constant'
import GetFormItem from '../../../../components/GetFormItem'
import { IMG_SIZE_LIMIT } from '../../../../utils/config'

const ReplyModal = ({
  visible,
  cancelHandler,
  okHandler,
  form: { validateFields, resetFields },
}) => {
  const modalOpts = {
    title: '回复',
    visible,
    maskClosable: false,
    onCancel: () => {
      resetFields()
      cancelHandler()
    },
    afterClose() {
      resetFields()
      cancelHandler()
    },
    onOk: () => {
      validateFields((error, values) => {
        if (!error) {
          if (values.replayImageUrls) {
            values.replayImageUrls = values.replayImageUrls.map(item => item.value).join()
          }
          okHandler(values)
        }
      })
    },
  }
  return (
    <Modal {...modalOpts}>
      <Form style={{ position: 'relative', overflow: 'hidden' }}>
        <GetFormItem
          formData={[
            {
              label: '回复内容',
              layout: FORM_ITEM_LAYOUT,
              field: 'replayContent',
              col: 22,
              options: {
                initialValue: '',
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: '必填项不能为空',
                  },
                  {
                    max: 500,
                    message: '不能大于500个字符',
                  },
                ],
              },
              component: {
                name: 'TextArea',
                props: {
                  placeholder: '请输入',
                },
              },
            },
            {
              label: '图片上传',
              layout: FORM_ITEM_LAYOUT,
              field: 'replayImageUrls',
              col: 22,
              options: getOptions(),
              component: {
                name: 'AekUpload',
                props: {
                  amountLimit: 9,
                  sizeLimit: IMG_SIZE_LIMIT,
                },
              },
            },
            <Row style={{ marginBottom: '20px' }}>
              <Col offset={3} span={21}>
                <div
                  style={{
                    color: '#bebebe',
                    fontSize: '12px',
                    fontWeight: 'initial',
                    lineHeight: 2,
                  }}
                >
                  <div style={{ overflow: 'hidden', paddingLeft: 10 }}>
                    <p>（最多可以上传9张图片，限PNG、JPG、BMP、PDF，每个文件最大20M)</p>
                  </div>
                </div>
              </Col>
            </Row>,
          ]}
        />
      </Form>
    </Modal>
  )
}

ReplyModal.propTypes = {
  visible: PropTypes.bool,
  form: PropTypes.object,
  cancelHandler: PropTypes.func,
  okHandler: PropTypes.func,
}

export default Form.create()(ReplyModal)
