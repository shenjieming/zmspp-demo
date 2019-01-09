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
function Power({
  effects,
  powerDataSource,
  pagination,
  searchData,
  tabIndex,
  allCustomerOptions,
  debounceCusotmer,
}) {
  const { dispatchAction } = getBasicFn({ namespace, loading: { effects } })
  const searchProps = {
    formData: [{
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
    }, {
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
            id: '1',
            name: '已过期',
          }, {
            id: '0',
            name: '未过期',
          }], { prefix: '效期' }),
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
        <Input placeholder="业务员/手机号码" />
      ),
      options: {
        initialValue: null,
      },
    },
    ],
    onSearch: (value) => {
      dispatchAction({
        type: 'powerList',
        payload: {
          ...value,
          supplierOrgId: value.supplierOrgId ? value.supplierOrgId.key : null,
          current: 1,
          pageSize: 10,
        },
      })
    },
  }
  const columns = [
    {
      key: 'customerContactName',
      dataIndex: 'customerContactName',
      title: '业务员/手机号',
      render: (value, record) => (<span>{`${value}-${record.customerContactPhone}`}</span>),
    },
    {
      key: 'supplierOrgName',
      dataIndex: 'supplierOrgName',
      title: '所属供应商',
    },
    {
      key: 'validDateEnd',
      dataIndex: 'validDateEnd',
      title: '有效期至',
      render: (value, record) => { // 先判断是否长期有效
        let dom
        const replace = () => (<span>
          {record.replacedFlag ? <p className="aek-red">(已换证,<a onClick={() => {
            dispatchAction({
              payload: {
                modalTitle: '查看委托书',
              },
            })
            dispatchAction({
              type: 'getPowerDetail',
              payload: {
                certificateId: record.replacedCertificateId,
              },
            })
          }}
          >查看新证件</a>)</p> : ''
          }
        </span>)
        // 先判断是否长期有效
        if (record.validDateLongFlag) {
          dom = (<p>长期有效</p>)
        } else {
          const oldDate = new Date(new Date(value).getTime() + (24 * 60 * 60 * 1000)).getTime()
          const todayDate = new Date().getTime()
          if (oldDate < todayDate) {
            dom = <span className="aek-text-disable">{`${record.validDateStart}至${record.validDateEnd}`}<span className="aek-red">（已过期）</span></span>
          } else {
            dom = <span >{`${record.validDateStart}至${record.validDateEnd}`}</span>
          }
        }
        return (<span>
          {dom}
          <span>{replace()}</span>
        </span>)
      },
    },
    // {
    //   key: 'certificatePlace',
    //   dataIndex: 'certificatePlace',
    //   title: '档案存放位置',
    // },
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
              type: 'powerStatus',
              payload: {
                certificateId: record.certificateId,
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
                    modalTitle: '查看委托书',
                  },
                })
                dispatchAction({
                  type: 'getPowerDetail',
                  payload: {
                    certificateId: record.certificateId,
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
      type: 'powerList',
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
        dataSource={powerDataSource}
        pagination={pagination}
        bordered
        onChange={handleChange}
        loading={!!effects['newCustomerCertificate/powerList']}
        rowKey="certificateId"
      />
    </div>
  )
}

Power.propTypes = {
  effects: PropTypes.object.isRequired,
  powerDataSource: PropTypes.array.isRequired,
  pagination: PropTypes.object.isRequired,
  searchData: PropTypes.object.isRequired,
  tabIndex: PropTypes.string.isRequired,
  allCustomerOptions: PropTypes.array.isRequired,
  debounceCusotmer: PropTypes.func.isRequired,
}

export default Power
