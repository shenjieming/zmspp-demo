import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Input, Select } from 'antd'
import { uniq } from 'lodash'

const FormItem = Form.Item
const TextArea = Input.TextArea
const Option = Select.Option

const AddBrandModal = (
  {
    title,
    visible,
    onHide,
    onOk,
    onSearch,
    factoryList,
    form: { getFieldDecorator, validateFields, resetFields },
  },
) => {
  const hideHandler = () => {
    onHide()
  }
  const okHandler = () => {
    validateFields((err, values) => {
      if (!err) {
        onOk({ values })
      }
    })
  }
  const modalOpts = {
    title,
    visible,
    afterClose: resetFields,
    maskClosable: false,
    onCancel: hideHandler,
    onOk: okHandler,
    width: 500,
    wrapClassName: 'aek-modal',
  }
  const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 18 },
  }
  return (
    <Modal {...modalOpts}>
      <Form onSubmit={okHandler}>
        <FormItem {...formItemLayout} label="厂家名称">
          {
            getFieldDecorator('produceFactoryId', {
              rules: [
                { transform: value => (value ? value.key : '') },
                { required: true, whitespace: true, message: '请选择厂家' },
              ],
            })(
              <Select
                showSearch
                labelInValue
                notFoundContent="无"
                defaultActiveFirstOption={false}
                filterOption={false}
                onSearch={onSearch}
                placeholder="请选择厂家"
              >
                {
                  factoryList.map(
                    item => <Option key={item.produceFactoryId}>{item.produceFactoryName}</Option>,
                  )
                }
              </Select>)
          }
        </FormItem>
        <FormItem {...formItemLayout} label="品牌">
          {
            getFieldDecorator('brandNames', {
              rules: [
                {
                  transform: (values) => {
                    if (!values) {
                      return values
                    }
                    const brandArr = values.split('\n')
                    for (let i = 0; i < brandArr.length; i++) {
                      if (!brandArr[i].trim()) {
                        brandArr.splice(i, 1)
                        i--
                      } else {
                        brandArr[i] = brandArr[i].trim()
                      }
                    }
                    return (brandArr.length > 0 ? brandArr.join(',') : '')
                  },
                },
                {
                  validator: (rule, value, callback) => {
                    if (!value) {
                      callback('请输入品牌名称')
                    } else {
                      const brandArr = value.split(',')
                      const lengthValid = brandArr.every(item => (item.length <= 15))
                      if (!lengthValid) {
                        callback('单个品牌最多输入15字')
                      }
                      if (uniq(brandArr).length !== brandArr.length) {
                        callback('该品牌已在列表中 请勿重复填写')
                      }
                      callback()
                    }
                  },
                },
              ],
              normalize: (values) => {
                if (!values) {
                  return values
                }
                const brandArr = values.split('\n')
                for (let i = 0; i < brandArr.length; i++) {
                  brandArr[i] = brandArr[i].replace(',', '')
                  if (i !== brandArr.length - 1) {
                    if (!brandArr[i].trim()) {
                      brandArr.splice(i, 1)
                      i--
                    } else {
                      brandArr[i] = brandArr[i].trim()
                    }
                  }
                }
                return (brandArr.length > 0 ? brandArr.join('\n') : '')
              },
            })(<TextArea rows={10} spellCheck="false" placeholder="可一次添加多个品牌，每行一个" />)
          }
        </FormItem>
      </Form>
    </Modal>
  )
}

AddBrandModal.propTypes = {
  onOk: PropTypes.func,
  onHide: PropTypes.func,
  form: PropTypes.object,
  roleName: PropTypes.string,
  loading: PropTypes.object,
  factoryList: PropTypes.array,
  visible: PropTypes.bool,
  onSearch: PropTypes.func,
  totalMenus: PropTypes.array,
  roleDetail: PropTypes.object,
  orgType: PropTypes.array,
  title: PropTypes.string,
  dispatchAction: PropTypes.func,
}

export default Form.create()(AddBrandModal)
