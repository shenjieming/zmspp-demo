import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Spin, Button, Table, message } from 'antd'

const FormItem = Form.Item
let inputRef = null

/** 浙二医院, 省立同德 建德, 浙二滨江 外网不进行条码维护 */
const configList = [
  '9395C427D83D4986AB0932A33D1C75BB',
  'FFC2C2C944444040A718D018CE2CBC23',
  'EB96F6AB4A770C35E040007F010009EE',
  '0D49B1E2FA93024AE050A8C00A01E580',
]
const BarCode = ({
  effects,
  dispatch,
  codeBarVisible,
  codeBarList,
  customerId,
  rowSelectData,
  form: { getFieldDecorator, validateFields, resetFields, setFields, getFieldsValue },
}) => {
  const addModalProp = {
    title: '条码维护',
    visible: codeBarVisible,
    wrapClassName: 'aek-modal',
    width: 600,
    maskClosable: false,
    footer: null,
    onCancel() {
      dispatch({ type: 'supplyCatalogueDetail/updateState', payload: { codeBarVisible: false } })
    },
    afterClose() {
      resetFields()
    },
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    validateFields((error) => {
      if (!error) {
        const data = getFieldsValue()
        if (data.barcode) {
          dispatch({
            type: 'supplyCatalogueDetail/setCodeBarList',
            payload: {
              pscId: rowSelectData.pscId,
              ...data,
              customerOrgId: customerId,
              func: () => {
                inputRef.focus()
                setFields({ barcode: '' })
              },
            },
          })
        } else {
          message.error('请输入条码', 3)
        }
      }
    })
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
      key: 'barcode',
      dataIndex: 'barcode',
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
      render: (value, record, index) => {
        const flag = false
        return (
          configList.indexOf(customerId) < 0 && (
            <Button
              value={record.barcode}
              size="small"
              loading={flag && !!effects['supplyCatalogueDetail/delSkuBarcode']}
              onClick={() => {
                dispatch({
                  type: 'supplyCatalogueDetail/delSkuBarcode',
                  payload: {
                    pscId: rowSelectData.pscId,
                    materialsSkuBarcode: record.materialsSkuBarcode,
                    index,
                  },
                })
              }}
            >
              删除
            </Button>
          )
        )
      },
    },
  ]
  return (
    <Modal {...addModalProp}>
      <Spin
        spinning={
          !!effects['supplyCatalogueDetail/getCodeBarList'] ||
          !!effects['supplyCatalogueDetail/setCodeBarList']
        }
      >
        {configList.indexOf(customerId) < 0 && (
          <span>
            <p>扫描或输入条码进行添加：</p>
            <Form style={{ marginTop: '10px' }} onSubmit={handleSubmit} layout="inline">
              <FormItem>
                {getFieldDecorator('barcode', {
                  rules: [{ max: 100, message: '最多输入100个字符' }],
                })(
                  <Input
                    ref={(input) => {
                      inputRef = input
                    }}
                    className="aek-barcode"
                  />,
                )}
              </FormItem>
              <FormItem>
                <Button type="primary" htmlType="submit">
                  添加
                </Button>
              </FormItem>
            </Form>
          </span>
        )}
        <Table
          style={{ marginTop: '20px' }}
          columns={columns}
          pagination={false}
          dataSource={codeBarList}
          rowKey="barcode"
        />
      </Spin>
    </Modal>
  )
}
BarCode.propTypes = {
  dispatch: PropTypes.func,
  form: PropTypes.object.isRequired,
  effects: PropTypes.object,
  codeBarVisible: PropTypes.bool,
  codeBarList: PropTypes.array,
  rowSelectData: PropTypes.object,
  customerId: PropTypes.any,
}
export default Form.create()(BarCode)
