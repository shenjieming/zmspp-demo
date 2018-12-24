import React from 'react'
import PropTypes from 'prop-types'
import { Form, Spin, Modal, Button, Input, Table } from 'antd'
import PlainForm from '../../components/PlainForm'
import Styles from './index.less'

const DetailModal = ({
  handleCancel,
  handleOk,
  spining = false,
  detailModalVisible,
  selectedRowData,
  splDetail,
  form: {
    getFieldDecorator,
    resetFields,
    validateFields,
  },
}) => {
  // 添加sql弹框参数
  const addModalProp = {
    width: 1000,
    title: 'API SQL详情',
    visible: detailModalVisible,
    wrapClassName: 'aek-modal',
    maskClosable: false,
    onCancel() {
      handleCancel()
    },
    afterClose() {
      resetFields()
      handleCancel()
    },
    footer: [
      <Button
        key="resend"
        type="primary"
        onClick={() => {
          validateFields((error, value) => {
            if (!error) {
              handleOk(value)
            }
          })
        }}
      >重发</Button>,
    ],
  }
  // 表格信息
  const plainProps = {
    data: {
      医院: selectedRowData.hplName || '',
      提交时间: selectedRowData.sendTime || '',
      回复时间: selectedRowData.receiveTime || '',
    },
    size: 2,
  }
  const columns = []
  let getDataSource = []
  if (Object.keys(splDetail).length && splDetail.data && Object.keys(splDetail.data).length) {
    let obj = splDetail.data
    if (Array.isArray(splDetail.data)) {
      obj = splDetail.data[0]
    }
    for (const item of Object.keys(obj)) {
      const retObj = {}
      retObj.key = item
      retObj.title = item
      retObj.dataIndex = item
      retObj.render = (text) => {
        if (Array.isArray(text)) {
          return text.toString()
        }
        return text
      }
      columns.push(retObj)
    }
    getDataSource = Array.isArray(splDetail.data) ? splDetail.data : [splDetail.data]
  }
  const tableProps = {
    bordered: true,
    columns,
    dataSource: getDataSource,
    pagination: false,
    rowKey: 'index',
  }
  return (
    <Modal {...addModalProp} >
      <Spin spinning={spining}>
        <PlainForm {...plainProps} className="aek-mb20" />
        <Form>
          <Form.Item label="sql" labelCol={{ span: 2 }} wrapperCol={{ span: 18 }}>
            {getFieldDecorator('sql', {
              initialValue: selectedRowData.sql,
              rules: [{ required: true, message: '必填项不能为空' }],
            })(
              <Input.TextArea />,
            )}
          </Form.Item>
        </Form>
        <div className="aek-mt20" />
        <div className={Styles['table-scroll']}>
          <Table {...tableProps} style={{ overFlowX: 'scroll' }} />
        </div>
      </Spin>
    </Modal>
  )
}
DetailModal.propTypes = {
  form: PropTypes.object,
  spining: PropTypes.bool,
  detailModalVisible: PropTypes.bool,
  handleCancel: PropTypes.func,
  handleOk: PropTypes.func,
  selectedRowData: PropTypes.object,
  splDetail: PropTypes.object,
}
export default Form.create()(DetailModal)
