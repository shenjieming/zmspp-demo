import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Form, Row, Col, Checkbox, DatePicker } from 'antd'

const RangePicker = DatePicker.RangePicker
const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
}
const formItemLayout3 = {
  labelCol: {
    span: 1,
  },
  wrapperCol: {
    span: 20,
  },
}

const TimeChange = ({
  currentQualifications: { startDate, endDate, eternalLife },
  getFieldDecorator,
  checkboxChange,
  longStatus = false,
}) => (
  <Row>
    <Col span={16}>
      {
        longStatus ?
          <FormItem
            label="有效期限"
            {...formItemLayout}
          >
            {
              (getFieldDecorator('singleTime', {
                initialValue: startDate && moment(startDate, 'YYYY/MM/DD'),
                rules: [{ required: true, message: '请选择' }],
              })(<DatePicker placeholder="" />))
            }
          </FormItem> :
          <FormItem
            label="有效期限"
            {...formItemLayout}
          >
            {
              (getFieldDecorator('doubleTime', {
                initialValue: startDate && endDate && [moment(startDate, 'YYYY/MM/DD'), moment(endDate, 'YYYY/MM/DD')],
                rules: [{ required: true, message: '请选择' }],
              })(<RangePicker placeholder="" />))
            }
          </FormItem>
      }
    </Col>
    <Col span={8}>
      <FormItem
        label=" "
        {...formItemLayout3}
        colon={false}
      >
        {getFieldDecorator('eternalLife', {
          initialValue: eternalLife,
          valuePropName: 'checked',
        })(
          <Checkbox onChange={checkboxChange}>长期有效</Checkbox>,
        )}
      </FormItem>
    </Col>
  </Row>
)
TimeChange.propTypes = {
  longStatus: PropTypes.bool,
  currentQualifications: PropTypes.object,
  getFieldDecorator: PropTypes.func,
  checkboxChange: PropTypes.func,
  modelTypeAddress: PropTypes.string,
  currentItem: PropTypes.object,
  addressModalVisible: PropTypes.bool,
  addressList: PropTypes.array,
  onCascaderChange: PropTypes.func,
  onOkAddress: PropTypes.func,
  modalType: PropTypes.string,
}
export default TimeChange
