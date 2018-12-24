import React from 'react'
import PropTypes from 'prop-types'
import { Form, Spin, Modal, Button, Alert } from 'antd'
import GetFormItem from '../../components/GetFormItem'
import { modalForm } from './data'
import { getBasicFn } from '../../utils'

const AddSql = ({
  handleCancel,
  handleOk,
  spining,
  addModalVisible,
  form: {
    validateFields,
    resetFields,
  },
}) => {
  // 添加sql弹框参数
  const addModalProp = {
    title: '添加apiSQL',
    visible: addModalVisible,
    wrapClassName: 'aek-modal',
    maskClosable: false,
    onCancel() {
      handleCancel()
    },
    afterClose() {
      resetFields()
      handleCancel()
    },
    footer: null,
  }
  return (
    <Modal {...addModalProp} >
      <Spin spinning={spining}>
        <Form>
          <GetFormItem
            formData={modalForm()}
          />
        </Form>
        <Alert
          message="注意："
          description={(<div>
            <p>1.查询和更新语句末尾不能有分号(;)。</p>
            <p>2.修改存储过程末尾必须有分号(;)不能有斜杠(/)。</p>
            <p>3.调用存储过程格式：BEGIN xxx_pk.xxx_sp:END;</p>
          </div>)}
          type="warning"
        />
        <div className="aek-mt20">
          <Button
            type="primary"
            onClick={() => {
              validateFields((errors, value) => {
                if (!errors) {
                  handleOk(value)
                }
              })
            }}
          >提交</Button>
        </div>
      </Spin>
    </Modal>
  )
}
AddSql.propTypes = {
  form: PropTypes.object,
  spining: PropTypes.bool,
  addModalVisible: PropTypes.bool,
  handleCancel: PropTypes.func,
  handleOk: PropTypes.func,
}
export default Form.create()(AddSql)
