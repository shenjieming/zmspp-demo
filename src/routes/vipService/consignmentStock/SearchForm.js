import React from 'react'
import PropTypes from 'prop-types'
import { Select, Form, Radio, Checkbox } from 'antd'
import LkcSelect from '../../../components/LkcSelect'

const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group
const RadioButton = Radio.Button

function SearchForm(props) {
  const { getFieldDecorator } = props.form

  // const handleCustomerOrgIdChange = (value) => {
  //   setFieldsValue({ whId: undefined })
  //   if (value) {
  //     props.handleCustomerChange(value)
  //   }
  // }
  return (
    <Form layout="inline">
      <div style={{ display: 'inline-block' }}>
        <FormItem>
          {getFieldDecorator('customerOrgId')(
            <LkcSelect
              style={{ width: 200 }}
              url="/account/vip/list"
              optionConfig={{ idStr: 'hplId', nameStr: 'hplName' }}
              placeholder="全部客户"
              modeType="select"
              onSelect={props.handleCustomerChange}
            />,
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('whId')(
            <Select style={{ width: 180 }} placeholder="请选择库房" allowClear>
              {props.depts.map(item => (
                <Option key={item.deptId} value={item.deptId}>
                  {item.receiveDeptName}
                </Option>
              ))}
            </Select>,
          )}
        </FormItem>
        <FormItem>{getFieldDecorator('gatherFlag')(<Checkbox>不显示0库存物资</Checkbox>)}</FormItem>
      </div>
      <FormItem label="统计方式" style={{ float: 'right' }}>
        {getFieldDecorator('statisticsType', {
          initialValue: '1',
        })(
          <RadioGroup>
            <RadioButton value="1">库存明细</RadioButton>
            <RadioButton value="2">批号</RadioButton>
            <RadioButton value="3">规格</RadioButton>
          </RadioGroup>,
        )}
      </FormItem>
    </Form>
  )
}

SearchForm.propTypes = {
  form: PropTypes.object.isRequired,
  depts: PropTypes.array.isRequired,
  // customers: PropTypes.array.isRequired,
  // handleCustomerSearch: PropTypes.func.isRequired,
  // customerSearchLoading: PropTypes.bool.isRequired,
  handleCustomerChange: PropTypes.func.isRequired,
}

export default Form.create({
  onValuesChange(props, values) {
    props.handleValueChange(values)
  },
})(SearchForm)
