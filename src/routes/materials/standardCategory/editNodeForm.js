import React from 'react'
import PropTypes from 'prop-types'
import { Button, Radio, Select, Input, Form, Spin } from 'antd'

import { FORM_ITEM_LAYOUT } from '../../../utils/constant'

const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group

const EditNodeForm = ({
  currentNode,
  onSubmit,
  visible,
  loading,
  form: { getFieldDecorator, validateFields, resetFields },
}) => {
  const riskTypeItem = (
    <Select>
      <Option
        title="Ι类"
        value="1"
      >Ι类</Option>
      <Option
        title="ΙΙ类"
        value="2"
      >ΙΙ类</Option>
      <Option
        title="ΙΙΙ类"
        value="3"
      >ΙΙΙ类</Option>
    </Select>
  )
  const statusItem = (
    <RadioGroup>
      <Radio value="false">启用</Radio>
      <Radio value="true">停用</Radio>
    </RadioGroup>
  )
  const submitHandler = () => {
    validateFields((err, values) => {
      if (!err) {
        onSubmit({ values, resetFields })
      }
    })
  }
  if (!visible) {
    return null
  }
  if (!currentNode.categoryId) {
    return (
      <Spin spinning={loading}>
        <Form>
          <FormItem {...FORM_ITEM_LAYOUT} label="上级分类">
            <Input disabled value="无" />
          </FormItem>
          <FormItem {...FORM_ITEM_LAYOUT} label="分类名称">
            <Input disabled value="68码" />
          </FormItem>
          <FormItem {...FORM_ITEM_LAYOUT} label="状态">
            <Radio checked value="false">启用</Radio>
          </FormItem>
        </Form>
      </Spin>
    )
  }
  return (
    <Spin spinning={loading}>
      <Form>
        <FormItem {...FORM_ITEM_LAYOUT} label="上级分类">
          <Input disabled value={currentNode.categoryParentName} />
        </FormItem>
        <FormItem {...FORM_ITEM_LAYOUT} label="68码">
          <Input disabled value={currentNode.categoryCode} />
        </FormItem>
        <FormItem {...FORM_ITEM_LAYOUT} label="分类名称">
          {
            getFieldDecorator('categoryName', {
              initialValue: currentNode && currentNode.categoryName,
              rules: [
                { required: true, whitespace: true, message: '请输入分类名称' },
              ],
            })(<Input />)
          }
        </FormItem>
        {currentNode.categoryRiskType ?
          <FormItem {...FORM_ITEM_LAYOUT} label="风险分类">
            {
              getFieldDecorator('categoryRiskType', {
                initialValue: String(currentNode.categoryRiskType),
                rules: [
                  { required: true, whitespace: true, message: '请选择风险分类' },
                ],
              })(riskTypeItem)
            }
          </FormItem> : ''
        }
        <FormItem {...FORM_ITEM_LAYOUT} label="状态">
          {
            getFieldDecorator('status', {
              initialValue: String(currentNode.categoryStatus),
              rules: [
                { required: true, whitespace: true, message: '请选择状态' },
              ],
            })(statusItem)
          }
        </FormItem>
        <FormItem wrapperCol={{ span: 6, offset: 6 }}>
          <Button type="primary" onClick={submitHandler}>
            保存
          </Button>
        </FormItem>
      </Form>
    </Spin>
  )
}
EditNodeForm.propTypes = {
  currentNode: PropTypes.object,
  onSubmit: PropTypes.func,
  visible: PropTypes.bool,
  loading: PropTypes.bool,
  form: PropTypes.object,
}

export default (Form.create()(EditNodeForm))
