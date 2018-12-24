import React from 'react'
import PropTypes from 'prop-types'
import { Table, Select, Input, Menu, Dropdown, Icon } from 'antd'
import SearchForm from '../../../../components/SearchFormFilter'
import { getOption } from '../../../../utils'

const noLabelLayout = {
  wrapperCol: { span: 22 },
}
function ProdFactory({
  effects,
  dispatch,
  factoryDataSource,
  pagination,
  searchData,
  tabIndex,
  debounceCusotmer,
  allCustomerOptions,
}) {
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
            placeholder: '请输入',
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
      dispatch({
        type: 'customerCertificate/prodFactoryList',
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
      key: 'operation',
      dataIndex: 'operation',
      title: '操作',
      width: 150,
      className: 'aek-text-center',
      render: (value, record) => {
        // 下拉按钮点击事件 TODO
        const handleMenuClick = (val) => {
          const key = val.key
          switch (key) {
            case '1':
              dispatch({
                type: 'customerCertificate/updateState',
                payload: {
                  prodFactoryVisible: true,
                  modalTitle: '换证',
                  prodFactoryDetail: {
                    ...record,
                    certificates: [],
                  },
                },
              })
              break
            default:
              break
          }
          dispatch({
            type: 'customerCertificate/updateState',
            payload: {
              rowSelectData: record,
            },
          })
        }
        return (
          <span>
            <a
              onClick={() => {
                dispatch({
                  type: 'customerCertificate/updateState',
                  payload: {
                    modalTitle: '查看厂家/总代证件',
                    rowSelectData: record,
                  },
                })
                dispatch({
                  type: 'customerCertificate/getprodFactoryDetai',
                  payload: {
                    factoryAgentCertificateId: record.factoryAgentCertificateId,
                  },
                })
              }}
            >查看</a>
          </span>
        )
      },
    },
  ]
  // 翻页
  const handleChange = (value) => {
    dispatch({
      type: 'customerCertificate/prodFactoryList',
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
        loading={!!effects['customerCertificate/prodFactoryList']}
        rowKey="factoryAgentCertificateId"
      />
    </div>
  )
}

ProdFactory.propTypes = {
  effects: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  factoryDataSource: PropTypes.array.isRequired,
  pagination: PropTypes.object.isRequired,
  searchData: PropTypes.object.isRequired,
  tabIndex: PropTypes.string.isRequired,
  allCustomerOptions: PropTypes.array.isRequired,
  debounceCusotmer: PropTypes.func.isRequired,
}

export default ProdFactory
