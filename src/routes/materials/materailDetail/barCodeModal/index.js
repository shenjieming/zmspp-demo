import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Spin, Button, Table, message } from 'antd'

const FormItem = Form.Item
const propTypes = {
  dispatchAction: PropTypes.func,
  form: PropTypes.object.isRequired,
  getLoading: PropTypes.func,
  barCodeModalVisible: PropTypes.bool,
  barCodeList: PropTypes.array,
}
let inputRef = null
const BarCodeModal = ({
  getLoading,
  dispatchAction,
  barCodeModalVisible,
  barCodeList,
  form: { getFieldDecorator, validateFields, resetFields, setFieldsValue, getFieldsValue },
}) => {
  const addModalProp = {
    title: '条码维护',
    visible: barCodeModalVisible,
    maskClosable: false,
    width: 600,
    onCancel() {
      dispatchAction({ payload: { barCodeModalVisible: false } })
    },
    afterClose() {
      resetFields()
    },
    onOk() {
      validateFields((errors) => {
        if (errors) {
          return
        }
        const data = []
        for (const item of barCodeList) {
          const {
            barcode: materialsBarcode,
            barcodeId: materialsBarcodeId,
            materialsSkuBarcode,
          } = item
          data.push({
            materialsBarcode,
            materialsBarcodeId,
            materialsSkuBarcode,
            ...item,
          })
        }
        dispatchAction({
          type: 'saveBarCodeList',
          payload: { data },
        })
      })
    },
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = getFieldsValue()
    if (data.barcode) {
      dispatchAction({
        type: 'resoleCodeBar',
        payload: {
          data,
          fun: () => {
            setFieldsValue({ barcode: '' })
            inputRef.focus()
          },
        },
      })
    } else {
      message.error('请输入条码', 3)
    }
  }
  // 条码列表
  const columns = [
    {
      key: 'index',
      dataIndex: 'index',
      title: '序号',
      className: 'aek-text-center',
      width: 50,
      render: (value, record, index) => index + 1,
    },
    {
      key: 'materialsBarcode',
      dataIndex: 'materialsBarcode',
      title: '条码',
    },
    {
      key: 'materialsSkuBarcode',
      dataIndex: 'materialsSkuBarcode',
      title: '物资码',
    },
    {
      key: 'operation',
      dataIndex: 'operation',
      title: '操作',
      className: 'aek-text-center',
      width: 120,
      render: (value, record, index) => (
        <span>
          <a
            onClick={() => {
              barCodeList.splice(index, 1)
              dispatchAction({
                payload: {
                  barCodeList,
                },
              })
            }}
          >
            删除
          </a>
          <a
            style={{ marginLeft: 15 }}
            onClick={() => {
              const { materialsBarcodeId: barcodeId } = record
              dispatchAction({
                type: 'queryRuleDetail',
                payload: {
                  barcodeId,
                },
              })
            }}
          >
            查看规则
          </a>
        </span>
      ),
    },
  ]
  return (
    <Modal {...addModalProp}>
      <Spin spinning={getLoading('queryBarCodeList')}>
        <p>扫描或输入条码进行添加：</p>
        <Form layout="inline" onSubmit={handleSubmit}>
          <FormItem>
            {getFieldDecorator('barcode')(
              <Input
                className="aek-barcode"
                ref={(input) => {
                  inputRef = input
                }}
              />,
            )}
          </FormItem>
          <FormItem>
            <Button type="primary" size="large" htmlType="submit">
              添加
            </Button>
          </FormItem>
        </Form>
        <Table
          style={{ marginTop: '20px' }}
          columns={columns}
          pagination={false}
          dataSource={barCodeList}
          rowKey="materialsBarcodeId"
        />
      </Spin>
    </Modal>
  )
}
BarCodeModal.propTypes = propTypes
export default Form.create()(BarCodeModal)
