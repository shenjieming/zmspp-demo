import React from 'react'
import PropTypes from 'prop-types'
import { Form, Modal, Spin, Select, Button } from 'antd'
import { FORM_ITEM_LAYOUT } from '../../../utils/constant'
import { debounce } from 'lodash'

const FormItem = Form.Item
const Option = Select.Option
const ConstrastModal = ({
  modalVisible,
  modalTitleFlag,
  dispatch,
  effects,
  defaultRowData,
  orgNameList,
  form: {
    getFieldDecorator,
    validateFields,
    resetFields,
  },
}) => {
  const handleOk = () => {
    validateFields((errors, values) => {
      if (!errors) {
        dispatch({
          type: 'supplierContrast/setContrast',
          payload: {
            ...defaultRowData,
            platformOrgId: values && values.platformOrgName ? values.platformOrgName.key : '',
            platformOrgName: values && values.platformOrgName ? values.platformOrgName.label : '',
          },
        })
      }
    })
  }
  const modalProp = {
    title: modalTitleFlag ? '重新对照' : '对照',
    visible: modalVisible,
    maskClosable: false,
    onCancel() {
      dispatch({ type: 'supplierContrast/updateState', payload: { modalVisible: false } })
    },
    afterClose() {
      resetFields()
    },
    footer: [
      <Button type="primary" key="ok" onClick={handleOk}>对照并保存</Button>,
    ],
  }
  // 模糊匹配搜索
  const handleChange = (value) => {
    dispatch({
      type: 'supplierContrast/getOrgList',
      payload: {
        keywords: value,
      },
    })
  }
  const change = debounce(handleChange, 500, { trailing: true })
  return (
    <Modal {...modalProp} >
      <Spin spinning={!!effects['personAdmin/postDept']}>
        <Form>
          <FormItem {...FORM_ITEM_LAYOUT} label="内网名称">
            <span className="ant-form-text">{defaultRowData.intranetOrgName}</span>
          </FormItem>
          <FormItem {...FORM_ITEM_LAYOUT} label="平台名称">
            {getFieldDecorator('platformOrgName', {
              initialValue: defaultRowData.platformOrgId && defaultRowData.platformOrgName ? { key: `${defaultRowData.platformOrgId}`, label: `${defaultRowData.platformOrgName}` } : undefined,
            })(
              <Select
                placeholder="请选择"
                onSearch={change}
                showSearch
                allowClear
                labelInValue
                filterOption={false}
              >
                {orgNameList.map(item => (<Option key={item.supplierOrgId} lalel={item.supplierOrgName} title={item.supplierOrgName} value={item.supplierOrgId} >{item.supplierOrgName }</Option>),
                )}
              </Select>,
            )}
          </FormItem>
        </Form>
      </Spin>
    </Modal>
  )
}
ConstrastModal.propTypes = {
  dispatch: PropTypes.func,
  form: PropTypes.object.isRequired,
  effects: PropTypes.object,
  modalVisible: PropTypes.bool,
  modalTitleFlag: PropTypes.bool,
  defaultRowData: PropTypes.object,
  orgNameList: PropTypes.array,
}
export default Form.create()(ConstrastModal)
