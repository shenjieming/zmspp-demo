import React from 'react'
import { Link } from 'dva/router'
import { getOption, asyncValidate } from '../../../utils'

const dicTypeSelect = {
  1: '系统代码',
  2: '业务代码',
}

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
}
const noLabelLayout = {
  wrapperCol: { span: 22 },
}

const formItemData = [{
  layout: noLabelLayout,
  field: 'dicType',
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
        id: '1',
        name: '系统字典',
      }, {
        id: '2',
        name: '业务字典',
      }], { prefix: '类型' }),
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
      placeholder: '描述/KEY',
    },
  },
}]

const columns = ({ updateDic, stopDic }) => [{
  title: '序号',
  dataIndex: 'order',
  className: 'aek-text-center',
  width: 60,
}, {
  title: '描述',
  dataIndex: 'dicDescription',
}, {
  title: 'KEY',
  dataIndex: 'dicKey',
}, {
  title: '类型',
  dataIndex: 'dicType',
  className: 'aek-text-center',
  width: 120,
  render: type => dicTypeSelect[type],
}, {
  title: '状态',
  dataIndex: 'dicStatus',
  className: 'aek-text-center',
  width: 120,
  render: dicStatus => (dicStatus ? '已停用' : '启用中'),
}, {
  title: '操作',
  dataIndex: 'operation',
  className: 'aek-text-center',
  width: 150,
  render: (text, record) => (<span>
    <a onClick={() => { updateDic(record) }}>修改</a>
    <span className="ant-divider" />
    <Link to={`/base/dictionaryAdmin/detail/${record.dicId}`} children="管理" />
    <span className="ant-divider" />
    <a onClick={() => { stopDic(record.dicId, record.dicStatus) }} >
      {record.dicStatus ? '启用' : '停用'}
    </a>
  </span>),
}]

const asyncValidateFn = asyncValidate({
  message: 'KEY值已存在',
  url: '/system/saveDic/checkKey',
  key: 'dicKey',
})

const modalFormData = ({ dicDescription, dicStatus, dicType, exclude }) => [{
  label: '描述',
  layout: formItemLayout,
  field: 'dicDescription',
  col: 22,
  options: {
    initialValue: dicDescription,
    rules: [{ required: true, message: '必填项不能为空' }],
  },
  component: {
    name: 'Input',
    props: {
      placeholder: '请输入',
    },
  },
}, {
  label: 'KEY',
  layout: formItemLayout,
  field: 'dicKey',
  col: 22,
  exclude,
  options: {
    validateFirst: true,
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
  label: '类型',
  layout: formItemLayout,
  field: 'dicType',
  col: 22,
  options: {
    rules: [{ required: true, message: '必填项不能为空' }],
    initialValue: dicType && String(dicType),
  },
  component: {
    name: 'Select',
    props: {
      placeholder: '请选择',
      optionLabelProp: 'title',
      children: getOption([{
        id: '1',
        name: '系统字典',
      }, {
        id: '2',
        name: '业务字典',
      }]),
    },
  },
}, {
  label: '状态',
  layout: formItemLayout,
  field: 'dicStatus',
  col: 22,
  options: {
    initialValue: dicStatus !== 1 ? 0 : dicStatus,
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

const addOrder = (arr, callback) => arr.map((item, index) => {
  callback && callback(item, index)
  item.order = index + 1
  return item
})

export default {
  formItemData,
  columns,
  modalFormData,
  addOrder,
}
