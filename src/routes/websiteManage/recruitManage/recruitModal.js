import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Input, Spin, Select, InputNumber } from 'antd'

const FORM_ITEM_LAYOUT = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
}
const FormItem = Form.Item
const TextArea = Input.TextArea
const Option = Select.Option

const RecruitModal = ({
  visible,
  detail,
  degreeList,
  loading,
  onHide,
  onSubmit,
  form: { getFieldDecorator, validateFields, resetFields },
}) => {
  let divRef = null
  const textAreaChange = (e) => {
    const value = e.target.value
    divRef.innerText = `${value.length}/130`
  }
  const submitHandler = () => {
    validateFields((errors, values) => {
      if (errors) {
        return
      }
      onSubmit({ ...values, hireId: detail.hireId })
    })
  }
  const modalOpts = {
    title: detail.hireId ? '编辑招聘信息' : '新增招聘信息',
    visible,
    maskClosable: false,
    afterClose: resetFields,
    onCancel: onHide,
    onOk: submitHandler,
    width: 500,
    wrapClassName: 'aek-modal',
  }
  return (
    <Modal {...modalOpts}>
      <Spin spinning={loading}>
        <Form>
          <FormItem {...FORM_ITEM_LAYOUT} label="招聘岗位">
            {getFieldDecorator('hirePostName', {
              initialValue: detail.hirePostName,
              rules: [
                { required: true, whitespace: true, message: '请输入岗位名称' },
                { max: 10, message: '最多输入10个字符' },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem {...FORM_ITEM_LAYOUT} label="岗位描述">
            {getFieldDecorator('hirePostDescription', {
              initialValue: detail.hirePostDescription,
              rules: [
                { required: true, whitespace: true, message: '请输入岗位描述' },
                { max: 130, message: '最多输入130个字符' },
              ],
            })(<TextArea rows={5} style={{ resize: 'none', height: '100px' }} onChange={textAreaChange} />)}
            <div ref={(div) => { divRef = div }} style={{ position: 'absolute', right: '10px', top: '70px' }}>
              {`${detail.hirePostDescription ? detail.hirePostDescription.length : 0}/130`}
            </div>
          </FormItem>
          <FormItem
            {...{
              labelCol: { span: 4 },
              wrapperCol: { span: 5 },
            }}
            label="工作年限"
          >
            {getFieldDecorator('workExperience', {
              initialValue: detail.workExperience,
              rules: [{ required: true, message: '请输入工作年限' }],
            })(<InputNumber style={{ width: '70%' }} min={0} max={20} precision={0} />)}&nbsp;年
          </FormItem>
          <FormItem {...FORM_ITEM_LAYOUT} label="学历要求">
            {getFieldDecorator('postEducation', {
              initialValue: detail.postEducation,
              rules: [{ required: true, message: '请选择学历要求' }],
            })(
              <Select style={{ width: '60%' }}>
                {degreeList.map(item => (
                  <Option key={item.dicValueId} value={item.dicValue}>
                    {item.dicValueText}
                  </Option>
                ))}
              </Select>,
            )}
          </FormItem>
          <FormItem
            {...{
              labelCol: { span: 4 },
              wrapperCol: { span: 5 },
            }}
            label="招聘人数"
          >
            {getFieldDecorator('postPeopleNumber', {
              initialValue: detail.postPeopleNumber,
              rules: [{ required: true, message: '请输入招聘人数' }],
            })(<InputNumber style={{ width: '70%' }} min={0} max={100} precision={0} />)}&nbsp;人
          </FormItem>
        </Form>
      </Spin>
    </Modal>
  )
}

RecruitModal.propTypes = {
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
  visible: PropTypes.bool,
  detail: PropTypes.object,
  degreeList: PropTypes.array,
  textAreaChange: PropTypes.func,
  onHide: PropTypes.func,
  form: PropTypes.object,
}

export default Form.create()(RecruitModal)
