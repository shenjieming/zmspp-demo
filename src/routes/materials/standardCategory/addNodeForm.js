import React from 'react'
import PropTypes from 'prop-types'
import { Button, Radio, Select, Input, Form, Spin } from 'antd'

import { FORM_ITEM_LAYOUT } from '../../../utils/constant'

const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group

const AddNodeForm = ({
  currentNode,
  onSubmit,
  visible,
  loading,
  form: { getFieldDecorator, validateFields },
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
        onSubmit({ values })
      }
    })
  }
  const containParent = `^${currentNode.categoryCode || '.*'}\\d+`
  if (!visible) {
    return null
  }
  return (
    <Spin spinning={loading}>
      <Form>
        <FormItem {...FORM_ITEM_LAYOUT} label="上级分类">
          <Input disabled value={currentNode.categoryName || '68码'} />
        </FormItem>
        <FormItem {...FORM_ITEM_LAYOUT} label="68码">
          {
            getFieldDecorator('categoryCode', {
              rules: [
                { required: true, whitespace: true, message: '请输入68码' },
                { pattern: '^[0-9]+$', message: '只能输入数字' },
                { pattern: containParent, message: '请遵循上级68码规范' },
              ],
              validateFirst: true,
              validateTrigger: 'onBlur',
            })(<Input />)
          }
        </FormItem>
        <FormItem {...FORM_ITEM_LAYOUT} label="分类名称">
          {
            getFieldDecorator('label', {
              rules: [
                { required: true, whitespace: true, message: '请输入分类名称' },
              ],
            })(<Input />)
          }
        </FormItem>
        {currentNode.categoryId && !currentNode.categoryParentId ?
          <FormItem {...FORM_ITEM_LAYOUT} label="风险分类">
            {
              getFieldDecorator('categoryRiskType', {
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
              initialValue: 'false',
              rules: [
                { required: true, whitespace: true, message: '请选择状态' },
              ],
            })(statusItem)
          }
        </FormItem>
        <FormItem wrapperCol={{ span: 6, offset: 6 }}>
          <Button type="primary" onClick={submitHandler}>
            新增
          </Button>
        </FormItem>
      </Form>
    </Spin>
  )
}
AddNodeForm.propTypes = {
  currentNode: PropTypes.object,
  onSubmit: PropTypes.func,
  visible: PropTypes.bool,
  loading: PropTypes.bool,
  form: PropTypes.object,
}

export default (Form.create()(AddNodeForm))
