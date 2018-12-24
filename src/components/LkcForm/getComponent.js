import React from 'react'
import {
  AutoComplete,
  Input,
  InputNumber,
  Button,
  Switch,
  Radio,
  Checkbox,
  Slider,
  TimePicker,
  DatePicker,
  Upload,
  Cascader,
  Select,
  TreeSelect,
  Icon,
} from 'antd'
import Breadcrumb from '../Breadcrumb'
import { LkcDatePicker, LkcRangePicker, TimeQuantum } from '../LkcDatePicker'
import LkcSelect from '../LkcSelect'
import LkcInputNumber from '../LkcInputNumber'

import { uploadButton } from '../UploadButton'

const strComponent = {
  LkcInputNumber,
  AutoComplete,
  Input,
  Search: Input.Search,
  InputGroup: Input.Group,
  TextArea: Input.TextArea,
  InputNumber,
  Button,
  Switch,
  Radio,
  RadioGroup: Radio.Group,
  Checkbox,
  CheckboxGroup: Checkbox.Group,
  Slider,
  TimePicker,
  DatePicker,
  LkcDatePicker,
  MonthPicker: DatePicker.MonthPicker,
  RangePicker: DatePicker.RangePicker,
  LkcRangePicker,
  TimeQuantum,
  Upload,
  Cascader,
  Select,
  LkcSelect,
  Option: Select.Option,
  OptGroup: Select.OptGroup,
  TreeSelect,
  Icon,
  Breadcrumb,
  UploadButton: uploadButton,
}

const getComponent = (compData, key = '0') => {
  const type = typeof compData
  if (type === 'string') {
    return <span key={key}>{compData}</span>
  } else if (Array.isArray(compData)) {
    return compData.map((item, index) => getComponent(item, index))
  } else if (type === 'object') {
    if (React.isValidElement(compData)) {
      // 不可用于表单相关元素，因为发生派遣会使之状态重置
      // return <span key={key}>{compData}</span>
      // 原生标签，数组中使用需要手动加key
      return compData
    } else if (compData.name) {
      if (compData.name === 'UploadButton') {
        return strComponent[compData.name]
      }
      const Component = strComponent[compData.name]
      const compChild = compData.props && compData.props.children
      if (Array.isArray(compChild) && compChild.length) {
        const childrenItem = compChild.map((item, index) => getComponent(item, `${key}-${index}`))
        return (
          <Component {...compData.props} key={`${key}-0`}>
            {childrenItem}
          </Component>
        )
      }
      return <Component {...compData.props} key={`${key}-0`} />
    }
  }
  throw compData
}

export default getComponent
