import React from 'react'
import { debounce } from 'lodash'
import { Badge } from 'antd'
import DropOption from './DropOption'

const formItemLayout = {
  labelCol: { xs: { span: 8 }, sm: { span: 6 }, md: { span: 4 }, lg: { span: 3 }, xl: { span: 3 } },
  wrapperCol: { xs: { span: 16 }, sm: { span: 15 }, md: { span: 14 }, lg: { span: 11 }, xl: { span: 7 } },
}

const formItemData = ({ parentName, name, menuUrl, menuIcon, bigIcon, status, tip, defaultFlag, thirdPartyFlag }) => [{
  label: '父菜单',
  view: true,
  layout: formItemLayout,
  field: 'parentName',
  options: {
    initialValue: parentName,
  },
  component: {
    name: 'Input',
    props: {},
  },
}, {
  label: '菜单名称',
  layout: formItemLayout,
  field: 'name',
  options: {
    rules: [{ required: true, message: '请输入菜单名称' }],
    initialValue: name,
  },
  component: {
    name: 'Input',
    props: {
      placeholder: '请输入',
    },
  },
}, {
  label: '路径名',
  layout: formItemLayout,
  field: 'menuUrl',
  options: {
    initialValue: menuUrl,
  },
  component: {
    name: 'Input',
    props: {
      placeholder: '请输入',
    },
  },
}, {
  label: '菜单图标',
  layout: formItemLayout,
  field: 'menuIcon',
  options: {
    initialValue: menuIcon,
  },
  component: {
    name: 'Input',
    props: {
      placeholder: '请输入',
    },
  },
}, {
  label: '菜单图标（大）',
  layout: formItemLayout,
  field: 'bigIcon',
  options: {
    initialValue: bigIcon,
  },
  component: {
    name: 'Input',
    props: {
      placeholder: '请输入',
    },
  },
}, {
  label: '提醒',
  layout: formItemLayout,
  field: 'tip',
  options: {
    initialValue: tip,
  },
  component: {
    name: 'Input',
    props: {
      placeholder: '请输入',
    },
  },
}, {
  label: '默认菜单',
  layout: formItemLayout,
  field: 'defaultFlag',
  options: {
    initialValue: !!defaultFlag,
  },
  component: {
    name: 'RadioGroup',
    props: {
      options: [
        { label: <span>是&#x3000;</span>, value: true },
        { label: '否', value: false },
      ],
    },
  },
}, {
  label: '第三方应用',
  layout: formItemLayout,
  field: 'thirdPartyFlag',
  options: {
    initialValue: !!thirdPartyFlag,
  },
  component: {
    name: 'RadioGroup',
    props: {
      options: [
        { label: <span>是&#x3000;</span>, value: true },
        { label: '否', value: false },
      ],
    },
  },
}, {
  label: '状态',
  layout: formItemLayout,
  field: 'status',
  options: {
    initialValue: status ? 1 : 0,
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

const funStatus = {
  true: <Badge status="error" text="停用" />,
  false: <Badge status="success" text="启用" />,
}
const columns = update => [{
  title: '序号',
  key: 'order',
  className: 'aek-text-center',
  width: 50,
  render: (_, $, i) => i + 1,
}, {
  title: '功能名称',
  dataIndex: 'name',
}, {
  title: 'KEY',
  dataIndex: 'menuKey',
}, {
  title: '状态',
  dataIndex: 'status',
  width: 80,
  className: 'aek-text-center',
  render: text => funStatus[text],
}, {
  title: '操作',
  dataIndex: 'operation',
  className: 'aek-text-center',
  width: 120,
  render(text, record) {
    return (<span>
      <a onClick={() => { update(record) }}>编辑</a>
      <span className="ant-divider" />
      <DropOption
        onMenuClick={e => update(record, e.key)}
        menuOptions={[
          { key: 'able', name: '启用' },
          { key: 'disable', name: '停用' },
          { key: 'delete', name: '删除' },
        ]}
      />
    </span>)
  },
}]

const delay = (fun, arr = [true, false, 9999]) => debounce(fun, 1000, {
  leading: arr[0],
  trailing: arr[1] === undefined ? null : arr[1],
  maxWait: arr[2] === 9999 ? 9999 : arr[2],
})

const out = {
  delay,
  formItemData,
  columns,
  funStatus,
}

export default out
