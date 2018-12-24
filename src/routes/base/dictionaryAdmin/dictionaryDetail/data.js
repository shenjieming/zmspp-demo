import React from 'react'
import { getOption, asyncValidate } from '../../../../utils'

const formItemLayout = exclude => ({
  labelCol: { span: exclude ? 8 : 6 },
  wrapperCol: { span: exclude ? 16 : 18 },
})

const noLabelLayout = {
  wrapperCol: { span: 22 },
}

const formItemData = [{
  layout: noLabelLayout,
  field: 'dicValueStatus',
  width: 220,
  options: {
    initialValue: null,
  },
  component: {
    name: 'Select',
    props: {
      optionLabelProp: 'title',
      children: getOption([{
        id: null,
        name: '全部',
      }, {
        id: '0',
        name: '启用',
      }, {
        id: '1',
        name: '停用',
      }], { prefix: '状态' }),
    },
  },
}, {
  label: '',
  layout: noLabelLayout,
  field: 'keywords',
  width: 220,
  component: {
    name: 'Input',
    props: {
      placeholder: '值/ID/文本',
    },
  },
}]

const columns = ({ updateDicValue, stopDicValue }) => [{
  title: '顺序',
  dataIndex: 'dicValueIndex',
  className: 'aek-text-center',
  width: 60,
}, {
  title: 'ID',
  dataIndex: 'dicValueId',
}, {
  title: '文本',
  dataIndex: 'dicValueText',
}, {
  title: '值',
  dataIndex: 'dicValue',
}, {
  title: '状态',
  dataIndex: 'dicValueStatus',
  className: 'aek-text-center',
  width: 120,
  render: dicValueStatus => (dicValueStatus ? '已停用' : '启用中'),
}, {
  title: '操作',
  className: 'aek-text-center',
  width: 120,
  render: (text, record) => (<span>
    <a onClick={() => { updateDicValue(record) }}>修改</a>
    <span className="ant-divider" />
    <a onClick={() => { stopDicValue(record.dicValueId, record.dicValueStatus) }} >
      {record.dicValueStatus ? '启用' : '停用'}
    </a>
  </span>),
}]

const modalFormData = ({ dicValueText, dicValue, exclude, dicValueStatus, checkboxEvern, checked, dicId, dicValueId }) => {
  const asyncValidateFn = asyncValidate({
    message: '字典值已存在',
    url: '/system/dicValue/checkValue',
    callback: value => ({
      dicId,
      dicValue: value,
      dicValueId,
    }),
  })
  return [{
    label: '文本',
    layout: formItemLayout(exclude || checked),
    field: 'dicValueText',
    col: exclude || checked ? 20 : 15,
    options: {
      initialValue: dicValueText,
      rules: [{ required: true, message: '必填项不能为空' }],
    },
    component: {
      name: 'Input',
      props: {
        placeholder: '请输入',
      },
    },
  }, {
    label: '值',
    layout: formItemLayout(exclude || checked),
    field: 'dicValue',
    col: exclude || checked ? 20 : 15,
    exclude: checked,
    options: {
      initialValue: dicValue,
      rules: [
        { required: true, message: '必填项不能为空' },
        { validator: asyncValidateFn },
      ],
    },
    component: {
      name: 'Input',
      props: {
        placeholder: '请输入',
      },
    },
  }, {
    label: checked ? '值' : undefined,
    field: 'checkedBoxStatus',
    col: checked ? 20 : 9,
    layout: {
      labelCol: checked ? { span: 8 } : undefined,
      wrapperCol: {
        span: checked ? 16 : 23,
        offset: checked ? undefined : 1,
      },
    },
    exclude,
    options: {
      valuePropName: 'checked',
      rules: checked ? [{ required: true, message: '' }] : undefined,
    },
    component: {
      name: 'Checkbox',
      props: {
        onChange: checkboxEvern,
        children: '取系统生成的ID作为值',
      },
    },
  }, {
    label: '状态',
    layout: formItemLayout(exclude || checked),
    field: 'dicValueStatus',
    col: exclude || checked ? 20 : 15,
    options: {
      initialValue: dicValueStatus !== 1 ? 0 : dicValueStatus,
    },
    component: {
      name: 'RadioGroup',
      props: {
        options: [
          { label: '启用', value: 0 },
          { label: '停用', value: 1 },
        ],
      },
    },
  }]
}

export default {
  formItemData,
  columns,
  modalFormData,
}
