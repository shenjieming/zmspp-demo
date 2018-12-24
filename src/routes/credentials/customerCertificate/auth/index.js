import React from 'react'
import PropTypes from 'prop-types'
import { Table, Select, Input, Menu, Dropdown, Icon } from 'antd'
import SearchForm from '../../../../components/SearchFormFilter'
import { getOption, getBasicFn } from '../../../../utils'
import AuthCustomer from './authCustomer'


const noLabelLayout = {
  wrapperCol: { span: 22 },
}
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
}
function Auth({
  effects,
  dispatch,
  authDataSource,
  pagination,
  searchData,
  tabIndex,
  powerCustomerVisible,
  powerCustomerList,
  powerCustomerTargetKeys,
  allCustomerOptions,
  debounceCusotmer,
}) {
  const { getLoading } = getBasicFn({ namespace: 'customerCertificate', loading: { effects } })
  const searchProps = {
    formData: [{
      layout: noLabelLayout,
      width: 220,
      field: 'supplierOrgId',
      component: {
        name: 'Select',
        props: {
          onSearch(value) {
            debounceCusotmer(value)
          },
          optionLabelProp: 'title',
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
    }, {
      layout: noLabelLayout,
      field: 'certificateExpiredStatus',
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
          }], { prefix: '效期 ' }),
        },
      },
    },
    {
      width: 220,
      layout: noLabelLayout,
      field: 'keywords',
      component: (
        <Input placeholder="输入授权公司" />
      ),
      options: {
        initialValue: null,
      },
    },
    ],
    onSearch: (value) => {
      dispatch({
        type: 'customerCertificate/authList',
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
      key: 'supplierOrgName',
      dataIndex: 'supplierOrgName',
      title: '供应商',
    },
    {
      key: 'superiorAuthFactoryName',
      dataIndex: 'superiorAuthFactoryName',
      title: '上级授权公司/生产厂家',
      render: (value, record) => (<span>
        <p>{value}</p>
        <p>{record.produceFactoryName}</p>
      </span>),
    },
    {
      key: 'validDateEnd',
      dataIndex: 'validDateEnd',
      title: '有效期',
      render: (value, record) => { // 先判断是否长期有效
        let dom
        const replace = () => (<span>
          {record.replacedPlatformAuthStatus === 2 ? <p className="aek-red">(已换证,<a onClick={() => {
            dispatch({
              type: 'customerCertificate/updateState',
              payload: {
                modalTitle: '查看授权书',
              },
            })
            dispatch({
              type: 'customerCertificate/getAuthDetail',
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
            dom = <p className="aek-text-disable">{`${record.validDateStart}至${record.validDateEnd}`}<span className="aek-red">（已过期）</span></p>
          } else {
            dom = <p>{`${record.validDateStart}至${record.validDateEnd}`}</p>
          }
        }
        return (<span>
          {dom}
          <span>{replace()}</span>
        </span>)
      },
    },
    {
      key: 'operation',
      dataIndex: 'operation',
      title: '操作',
      width: 150,
      className: 'aek-text-center',
      render: (value, record) => (
        <span>
          <a
            onClick={() => {
              dispatch({
                type: 'customerCertificate/updateState',
                payload: {
                  modalTitle: '查看授权书',
                },
              })
              dispatch({
                type: 'customerCertificate/getAuthDetail',
                payload: {
                  certificateId: record.certificateId,
                },
              })
            }}
          >查看</a>
        </span>
      ),
    },
  ]
  // 翻页
  const handleChange = (value) => {
    dispatch({
      type: 'customerCertificate/authList',
      payload: {
        ...searchData,
        ...value,
      },
    })
  }
  const authCustomerProps = {
    data: powerCustomerList,
    targetKeys: powerCustomerTargetKeys,
    handleTargetKeysChange() {

    },
    visible: powerCustomerVisible,
    loading: getLoading(),
    handleCancel() {
      dispatch({
        type: 'customerCertificate/updateState',
        payload: {
          powerCustomerVisible: false,
          powerCustomerList: [],
          targetKeys: [],
        },
      })
    },
    handleOk() {

    },
  }
  return (
    <div key={tabIndex}>
      <SearchForm {...searchProps} />
      <Table
        columns={columns}
        dataSource={authDataSource}
        pagination={pagination}
        bordered
        onChange={handleChange}
        loading={!!effects['customerCertificate/authList']}
        rowKey="certificateId"
      />
      <AuthCustomer {...authCustomerProps} />
    </div>
  )
}

Auth.propTypes = {
  effects: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  authDataSource: PropTypes.array.isRequired,
  pagination: PropTypes.object.isRequired,
  searchData: PropTypes.object.isRequired,
  tabIndex: PropTypes.string.isRequired,
  powerCustomerVisible: PropTypes.bool.isRequired,
  powerCustomerList: PropTypes.array.isRequired,
  powerCustomerTargetKeys: PropTypes.array.isRequired,
  allCustomerOptions: PropTypes.array.isRequired,
  debounceCusotmer: PropTypes.func.isRequired,
}

export default Auth
