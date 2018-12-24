import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Spin, Form } from 'antd'

import GetFormItem from '../../../../components/GetFormItem'
import { getOption } from '../../../../utils'

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 12,
  },
}

const ChangeTypeModal = ({
  visible,
  loading,
  onOk,
  onCancel,
  currentType,
  form: { validateFields },
}) => {
  const modalOpts = {
    visible,
    title: '更改机构类型',
    width: 500,
    afterClose: onCancel,
    onOk: () => {
      validateFields((error, values) => {
        if (!error) {
          onOk(values)
        }
      })
    },
    onCancel,
  }
  return (
    <Modal {...modalOpts}>
      <Spin spinning={loading}>
        <Form>
          <GetFormItem
            formData={[
              {
                label: '机构类型',
                layout: formItemLayout,
                field: 'orgTypeValue',
                options: {
                  initialValue: currentType,
                  rules: [{ required: true, message: '请选择机构类型' }],
                },
                col: 24,
                component: {
                  name: 'Select',
                  props: {
                    placeholder: '无',
                    children: getOption([
                      {
                        id: '03',
                        name: '供应商',
                      },
                      {
                        id: '04',
                        name: '生产厂家',
                      },
                      {
                        id: '07',
                        name: '供应商&生产厂家',
                      },
                    ]),
                  },
                },
              },
            ]}
          />
        </Form>
      </Spin>
    </Modal>
  )
}
ChangeTypeModal.propTypes = {
  visible: PropTypes.bool,
  loading: PropTypes.bool,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
  currentType: PropTypes.string,
  form: PropTypes.object,
}
export default Form.create()(ChangeTypeModal)
