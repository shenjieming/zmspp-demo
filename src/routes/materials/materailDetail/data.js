import React from 'react'
import { Input, Select, Dropdown, Menu } from 'antd'
import { MATERIALS_TYPE_ARRAY } from '../../../utils/constant'

const components = [
  {
    field: 'materialsSkuStatus',
    component: (
      <Select optionLabelProp="title">
        <Select.Option value={null} title="状态：全部">
          全部
        </Select.Option>
        <Select.Option value="0" title="状态：启用">
          启用
        </Select.Option>
        <Select.Option value="1" title="状态：停用">
          停用
        </Select.Option>
      </Select>
    ),
    options: {
      initialValue: null,
    },
  },
  {
    field: 'sourceType',
    component: (
      <Select optionLabelProp="title">
        <Select.Option value={null} title="来源：全部">
          全部
        </Select.Option>
        <Select.Option value="1" title="来源：平台添加">
          平台添加
        </Select.Option>
        <Select.Option value="2" title="来源：对照新增">
          对照新增
        </Select.Option>
      </Select>
    ),
    options: {
      initialValue: null,
    },
  },
  {
    field: 'keywords',
    width: '220px',
    component: <Input placeholder="规格/规格编码/通用名称" />,
  },
]
const genColumns = ({ handleAction, addModalShow }) => [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    width: 50,
    className: 'aek-text-center',
    render: (text, record, idx) => idx + 1,
  },
  {
    title: '规格编码',
    dataIndex: 'materialsSkuCode',
    key: 'materialsSkuCode',
  },
  {
    title: '规格',
    dataIndex: 'materialsSku',
    key: 'materialsSku',
  },
  {
    title: '通用名称',
    dataIndex: 'commonName',
    key: 'commonName',
  },
  {
    title: '单位',
    dataIndex: 'skuUnitName',
    key: 'skuUnitName',
  },
  {
    title: '来源',
    dataIndex: 'sourceType',
    key: 'sourceType',
    render: text => (text === 1 ? '平台添加' : '对照新增'),
  },
  {
    title: '状态',
    dataIndex: 'materialsSkuStatus',
    key: 'materialsSkuStatus',
    render: text => (text ? '停用' : '启用'),
  },
  {
    title: '操作',
    key: 'action',
    width: 80,
    className: 'aek-text-center',
    fixed: 'right',
    render: (text, record) => {
      const { materialsSkuStatus: status } = record
      const menu = (
        <Menu onClick={e => handleAction(e, record)}>
          {status ? <Menu.Item key="0">启用</Menu.Item> : <Menu.Item key="1">停用</Menu.Item>}
          <Menu.Item key="2">维护包装规格</Menu.Item>
          <Menu.Item key="3">维护物资码</Menu.Item>
          <Menu.Item key="4">历史记录</Menu.Item>
        </Menu>
      )
      return (
        <span>
          <a onClick={() => addModalShow(record)}>编辑</a>
          <span className="ant-divider" />
          <Dropdown overlay={menu}>
            <a>更多</a>
          </Dropdown>
        </span>
      )
    },
  },
]
const getDetailData = ({
  materialsName,
  materialsCode,
  produceFactoryName,
  registerCertificateNo,
  materialsAttribute,
  standardCategoryName,
}) => ({
  物资名称: materialsName,
  物资编码: materialsCode,
  厂家: produceFactoryName,
  注册证: registerCertificateNo,
  属性: MATERIALS_TYPE_ARRAY && MATERIALS_TYPE_ARRAY[Number(materialsAttribute)],
  标准分类: standardCategoryName,
})

export default {
  genColumns,
  components,
  getDetailData,
}
