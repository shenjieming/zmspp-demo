import React from 'react'
import { Select, Input } from 'antd'

const Option = Select.Option
// 搜索参数
const getSearchProps = ({ searchParam, factoryList, factoryChangeHandler }) => [
  {
    field: 'brandStatus',
    component: (
      <Select optionLabelProp="title">
        <Option title="品牌状态: 全部" value={null}>
          全部
        </Option>
        <Option title="品牌状态: 启用" value="0">
          启用
        </Option>
        <Option title="品牌状态: 停用" value="1">
          停用
        </Option>
      </Select>
    ),
    options: {
      initialValue: searchParam.brandStatus,
    },
  },
  {
    field: 'produceFactoryId',
    width: 300,
    component: (
      <Select
        showSearch
        allowClear
        labelInValue
        notFoundContent="无"
        defaultActiveFirstOption={false}
        filterOption={false}
        onSearch={factoryChangeHandler}
        placeholder="请选择厂家"
      >
        {factoryList.map(item => (
          <Option title={item.produceFactoryName} key={item.produceFactoryId}>
            {item.produceFactoryName}
          </Option>
        ))}
      </Select>
    ),
    options: {
      initialValue: searchParam.produceFactoryId,
    },
  },
  {
    field: 'brandName',
    component: <Input placeholder="品牌名称" />,
    options: {
      initialValue: searchParam.brandName,
    },
  },
]
// 表格数据
const getTableColumns = ({ showEditModal, updateSingleBrandStatus }) => [
  {
    key: 'index',
    title: '序号',
    width: 30,
    render: (_, $, i) => i + 1,
    className: 'aek-text-center',
  },
  {
    dataIndex: 'brandStatus',
    key: 'brandStatus',
    title: '状态',
    width: 160,
    className: 'aek-text-center',
    render: txt => (!txt ? '启用' : '停用'),
  },
  {
    dataIndex: 'produceFactoryName',
    key: 'produceFactoryName',
    className: 'aek-text-center',
    title: '厂家',
  },
  {
    dataIndex: 'brandName',
    key: 'brandName',
    title: '品牌',
    className: 'aek-text-center',
  },
  {
    title: '操作',
    key: 'action',
    width: 160,
    className: 'aek-text-center',
    render: (_, row) => (
      <div>
        <a onClick={() => showEditModal(row.brandId)}>编辑</a>
        <span className="ant-divider" />
        {row.brandStatus ? (
          <a onClick={() => updateSingleBrandStatus(row.brandId, false)}>启用</a>
        ) : (
          <a onClick={() => updateSingleBrandStatus(row.brandId, true)}>停用</a>
        )}
      </div>
    ),
  },
]
export default {
  getSearchProps,
  getTableColumns,
}
