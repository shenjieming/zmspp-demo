import React from 'react'
import PropTypes from 'prop-types'
import { Table, Input } from 'antd'
import SearchForm from '../../../../components/SearchFormFilter'
import { getOption, getBasicFn } from '../../../../utils'
import { MenuButton } from '../data'

const noLabelLayout = {
  wrapperCol: { span: 22 },
}
const namespace = 'newCustomerCertificate'
function ProdFactory({
  effects,
  factoryDataSource,
  pagination,
  searchData,
  tabIndex,
  debounceCusotmer,
  allCustomerOptions,
}) {
  const { dispatchAction } = getBasicFn({ namespace })
  const searchProps = {
    formData: [
      {
        layout: noLabelLayout,
        width: 220,
        field: 'supplierOrgId',
        component: {
          name: 'Select',
          optionLabelProp: 'title',
          props: {
            onSearch(value) {
              debounceCusotmer(value)
            },
            placeholder: '请输入供应商名称检索',
            showSearch: true,
            defaultActiveFirstOption: false,
            filterOption: false,
            notFoundContent: '',
            allowClear: true,
            labelInValue: true,
            children: getOption(allCustomerOptions, { idStr: 'supplierOrgId', nameStr: 'supplierOrgName', prefix: '供应商 ' }),
          },
        },
      },
      {
        layout: noLabelLayout,
        field: 'validDate',
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
              name: '未过期',
            }, {
              id: '1',
              name: '已过期',
            }], { prefix: '过期情况' }),
          },
        },
      },
      {
        layout: noLabelLayout,
        width: 220,
        field: 'certificateStatus',
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
        options: {
          initialValue: '0',
        },
      },
      {
        width: 220,
        layout: noLabelLayout,
        field: 'keywords',
        component: (
          <Input placeholder="上级授权公司/生产厂家" />
        ),
        options: {
          initialValue: null,
        },
      },
    ],
    onSearch: (value) => {
      dispatchAction({
        type: 'prodFactoryList',
        payload: {
          ...value,
          supplierOrgId: value.supplierOrgId ? value.supplierOrgId.key : null,
          current: 1,
          pageSize: 10,
        },
      })
    },
  }
  // 表格
  const columns = [
    {
      key: 'supplierOrgName',
      dataIndex: 'supplierOrgName',
      title: '所属供应商',
    },
    {
      key: 'produceFactoryName',
      dataIndex: 'produceFactoryName',
      title: '生产厂家/总经销商',
      render: (value, record) => (<span>
        <p>{value}</p>
        {record.importedFlag ? `总代：${record.agentSupplierName}` : ''}
      </span>),
    },
    {
      key: 'importedFlag',
      dataIndex: 'importedFlag',
      title: '厂家类型',
      className: 'aek-text-center',
      render: (value) => {
        if (value) {
          return '进口'
        }
        return '国内'
      },
    },
    {
      key: 'certificatePlace',
      dataIndex: 'certificatePlace',
      title: '档案存放位置',
    },
    {
      key: 'operation',
      dataIndex: 'operation',
      title: '操作',
      width: 150,
      className: 'aek-text-center',
      render: (value, record) => {
        const menuProps = {
          status: record.certificateStatus,
          handleMenuClick: () => {
            dispatchAction({
              type: 'factoryStatus',
              payload: {
                certificateId: record.factoryAgentCertificateId,
                certificateStatus: !record.certificateStatus,
              },
            })
          },
        }
        return (
          <span>
            <a
              onClick={() => {
                dispatchAction({
                  payload: {
                    modalTitle: '查看厂家/总代证件',
                    rowSelectData: record,
                  },
                })
                dispatchAction({
                  type: 'getprodFactoryDetai',
                  payload: {
                    factoryAgentCertificateId: record.factoryAgentCertificateId,
                  },
                })
              }}
            >查看</a>
            <span className="ant-divider" />
            <MenuButton {...menuProps} />
          </span>
        )
      },
    },
  ]
  // 翻页
  const handleChange = (value) => {
    dispatchAction({
      type: 'prodFactoryList',
      payload: {
        ...searchData,
        ...value,
      },
    })
  }
  return (
    <div key={tabIndex}>
      <SearchForm {...searchProps} />
      <Table
        columns={columns}
        dataSource={factoryDataSource}
        pagination={pagination}
        bordered
        onChange={handleChange}
        loading={!!effects['newCustomerCertificate/prodFactoryList']}
        rowKey="factoryAgentCertificateId"
      />
    </div>
  )
}

ProdFactory.propTypes = {
  effects: PropTypes.object.isRequired,
  factoryDataSource: PropTypes.array.isRequired,
  pagination: PropTypes.object.isRequired,
  searchData: PropTypes.object.isRequired,
  tabIndex: PropTypes.string.isRequired,
  allCustomerOptions: PropTypes.array.isRequired,
  debounceCusotmer: PropTypes.func.isRequired,
}

export default ProdFactory
