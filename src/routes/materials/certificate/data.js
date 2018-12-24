import React from 'react'
import { Link } from 'dva/router'
import { Menu, Dropdown } from 'antd'
import { find } from 'lodash'
import qs from 'qs'
import { getOption } from '../../../utils'
import { MATERIALS_CERTIFICATE_TYPE } from '../../../utils/constant'

const noLabelLayout = {
  wrapperCol: { span: 22 },
}
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
}
const advancedForm = ({
  allProList,
  onSearchAllList,
  produceList,
  onSearchProList,
  registTypeList = [],
}) => [
  {
    layout: formItemLayout,
    label: '状态',
    field: 'certificateStatus',
    options: {
      initialValue: null,
    },
    component: {
      name: 'Select',
      props: {
        children: getOption([
          {
            id: null,
            name: '全部',
          },
          {
            id: '0',
            name: '启用',
          },
          {
            id: '1',
            name: '停用',
          },
        ]),
      },
    },
  },
  {
    label: '类型',
    layout: formItemLayout,
    field: 'certificateType',
    component: {
      name: 'Select',
      props: {
        children: getOption([
          {
            id: null,
            name: '全部',
          },
          ...registTypeList.map(item => ({ id: item.dicValue, name: item.dicValueText })),
        ]),
      },
    },
    options: {
      initialValue: null,
    },
  },
  {
    label: '效期',
    layout: formItemLayout,
    field: 'certificateValid',
    component: {
      name: 'Select',
      props: {
        children: getOption([
          {
            id: null,
            name: '全部',
          },
          {
            id: '1',
            name: '未过期',
          },
          {
            id: '2',
            name: '已过期',
          },
          {
            id: '3',
            name: '已延期',
          },
          {
            id: '4',
            name: '已换证',
          },
        ]),
      },
    },
    options: {
      initialValue: null,
    },
  },
  {
    label: '厂家',
    layout: formItemLayout,
    field: 'handleProduceFactoryId',
    component: {
      name: 'Select',
      props: {
        labelInValue: true,
        placeholder: '请选择厂家',
        children: getOption(produceList, {
          idStr: 'produceFactoryId',
          nameStr: 'produceFactoryName',
        }),
        onSearch: onSearchProList,
        showSearch: true,
        defaultActiveFirstOption: false,
        filterOption: false,
        notFoundContent: false,
        allowClear: true,
      },
    },
    options: {
      initialValue: undefined,
    },
  },
  {
    label: '总代',
    layout: formItemLayout,
    field: 'handleAgentSupplierId',
    component: {
      name: 'Select',
      props: {
        labelInValue: true,
        placeholder: '请选择总代',
        children: getOption(allProList, { idStr: 'supplierId', nameStr: 'supplierName' }),
        onSearch: onSearchAllList,
        showSearch: true,
        defaultActiveFirstOption: false,
        filterOption: false,
        notFoundContent: false,
        allowClear: true,
      },
    },
    options: {
      initialValue: undefined,
    },
  },
  {
    label: '关键字',
    layout: formItemLayout,
    field: 'keywords',
    component: {
      name: 'Input',
      props: {
        placeholder: '注册证产品名称/注册证号',
      },
    },
  },
]
const formData = ({ registTypeList = [] }) => [
  {
    layout: noLabelLayout,
    field: 'certificateStatus',
    width: 220,
    options: {
      initialValue: null,
    },
    component: {
      name: 'Select',
      props: {
        optionLabelProp: 'title',
        children: getOption(
          [
            {
              id: null,
              name: '全部',
            },
            {
              id: '0',
              name: '启用',
            },
            {
              id: '1',
              name: '停用',
            },
          ],
          { prefix: '状态' },
        ),
      },
    },
  },
  {
    layout: noLabelLayout,
    field: 'certificateType',
    width: 220,
    options: {
      initialValue: null,
    },
    component: {
      name: 'Select',
      props: {
        optionLabelProp: 'title',
        children: getOption(
          [
            {
              id: null,
              name: '全部',
            },
            ...registTypeList.map(item => ({ id: item.dicValue, name: item.dicValueText })),
          ],
          { prefix: '类型' },
        ),
      },
    },
  },
  {
    layout: noLabelLayout,
    field: 'certificateValid',
    width: 220,
    options: {
      initialValue: null,
    },
    component: {
      name: 'Select',
      props: {
        optionLabelProp: 'title',
        children: getOption(
          [
            {
              id: null,
              name: '全部',
            },
            {
              id: '1',
              name: '未过期',
            },
            {
              id: '2',
              name: '已过期',
            },
            {
              id: '3',
              name: '已延期',
            },
            {
              id: '4',
              name: '已换证',
            },
          ],
          { prefix: '效期' },
        ),
      },
    },
  },
  {
    layout: noLabelLayout,
    field: 'keywords',
    width: 220,
    component: {
      name: 'Input',
      props: {
        placeholder: '注册证产品名称/注册证号',
      },
    },
  },
]
const getName = (id) => {
  for (const item of MATERIALS_CERTIFICATE_TYPE) {
    if (item.id === String(id)) {
      return item.name
    }
  }
  return id
}
const genColumns = ({ handleAction, editAction, registTypeList }) => [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    width: 50,
    className: 'aek-text-center',
    render: (text, record, idx) => idx + 1,
  },
  {
    title: '证件类型',
    dataIndex: 'certificateType',
    key: 'certificateType',
    render(text) {
      const obj = find(registTypeList, item => Number(item.dicValue) === Number(text))
      return obj && obj.dicValueText
    },
  },
  {
    title: '医疗器械注册证号',
    dataIndex: 'certificateNo',
    key: 'certificateNo',
  },
  {
    title: '产品名称',
    dataIndex: 'productName',
    key: 'productName',
  },
  {
    title: '状态',
    dataIndex: 'certificateStatus',
    key: 'certificateStatus',
    render: text => (text ? '停用' : '启用'),
  },
  {
    title: '有效期',
    dataIndex: 'validDateLongFlag',
    key: 'validDateLongFlag',
    render: (text, record) => {
      const {
        delayedFlag,
        validDateLongFlag,
        validDateStart,
        validDateEnd,
        delayedDateEnd,
      } = record
      let showText
      if (!validDateLongFlag) {
        if (delayedFlag) {
          showText = `${validDateStart}延期至${delayedDateEnd}`
        } else {
          showText = `${validDateStart} 至 ${validDateEnd}`
        }
      } else {
        showText = '长期有效'
      }
      return showText
    },
  },
  {
    title: '生产厂家',
    dataIndex: 'produceFactoryName',
    key: 'produceFactoryName',
  },
  {
    title: '操作',
    key: 'action',
    width: 80,
    fixed: 'right',
    className: 'aek-text-center',
    render: (text, record) => {
      const { certificateStatus: status, certificateId, certificateNo } = record
      const menu = (
        <Menu onClick={e => handleAction(e, record)}>
          {status ? <Menu.Item key="0">启用</Menu.Item> : <Menu.Item key="1">停用</Menu.Item>}
          <Menu.Item key="2">
            <Link
              to={`/materials/material${qs.stringify(
                { source: 'certificate', handleRegisterCertificateId: { label: certificateNo, key: certificateId } },
                { addQueryPrefix: true },
              )}`}
            >
              查看物料
            </Link>
          </Menu.Item>
          <Menu.Item key="3">修改历史</Menu.Item>
        </Menu>
      )
      return (
        <span>
          <a onClick={() => editAction(record)}>编辑</a>
          <span className="ant-divider" />
          <Dropdown overlay={menu}>
            <a>更多</a>
          </Dropdown>
        </span>
      )
    },
  },
]

export default {
  formData,
  genColumns,
  advancedForm,
}
