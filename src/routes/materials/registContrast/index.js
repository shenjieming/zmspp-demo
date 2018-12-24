import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Link } from 'dva/router'
import { Table, Input, Select } from 'antd'
import Breadcrumb from '../../../components/Breadcrumb'
import SearchFormFilter from '../../../components/SearchFormFilter'
import { getBasicFn } from '../../../utils/index'
import LkcSelect from '../../../components/LkcSelect'


const Option = Select.Option
const namespace = 'registContrast'
const propTypes = {
  registContrast: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}
function RegistIndex({ registContrast, loading, dispatch }) {
  const { getLoading } = getBasicFn({ namespace, loading })
  const {
    searchData,
    pagination,
    registList,
  } = registContrast
  const searchPorps = {
    components: [
      {
        field: 'status',
        component: <Select optionLabelProp="title">
          <Option value={null} title="平台认证状态：全部">全部</Option>
          <Option value={'1'} title="平台认证状态：已对照">已对照</Option>
          <Option value={'0'} title="平台认证状态：待对照">待对照</Option>
        </Select>,
        options: {
          initialValue: '0',
        },
      },
      {
        field: 'supplier',
        component: <LkcSelect
          url="/organization/getAllTypeInfo"
          optionConfig={{ idStr: 'supplierId', nameStr: 'supplierName' }}
          transformPayload={keywords => ({
            isPassAudit: 1,
            keywords,
          })}
          placeholder="请选择供应商"
        />,
      },
      {
        field: 'keywords',
        component: <Input placeholder="证号/厂家/注册证产品名称" />,
        options: {
          initialValue: null,
        },
      },
    ],
    onSearch: (value) => {
      dispatch({
        type: 'registContrast/getRegistList',
        payload: {
          ...searchData,
          ...value,
          current: 1,
          pageSize: searchData.pageSize || 10,
        },
      })
    },
    initialValues: searchData,
  }
  // 表格行
  const columns = [
    {
      key: 'index',
      dataIndex: 'index',
      title: '序号',
      width: 50,
      className: 'aek-text-center',
      render: (value, record, index) => index + 1,
    },
    {
      key: 'certificateNo',
      dataIndex: 'certificateNo',
      title: '注册证号',
    },
    {
      key: 'produceFactoryName',
      dataIndex: 'produceFactoryName',
      title: '厂家',
    },
    {
      key: 'validDateStart',
      dataIndex: 'validDateStart',
      title: '有效期',
      render: (value, record) => `${value}至${record.validDateLongFlag ? '长期有效' : record.validDateEnd}`,
    },
    {
      key: 'supplierName',
      dataIndex: 'supplierName',
      title: '供应商',
    },
    {
      key: 'compareFlag',
      dataIndex: 'compareFlag',
      title: '状态',
      className: 'aek-text-center',
      render: (value) => {
        if (value) {
          return '已对照'
        }
        return '待对照'
      },
    },
    {
      key: 'businessDate',
      dataIndex: 'businessDate',
      title: '业务发生时间',
    },
    {
      key: 'operation',
      dataIndex: 'operation',
      title: '操作',
      width: 100,
      className: 'aek-text-center',
      render: (value, record) => (
        <Link
          to={!record.compareFlag ? `/materials/registContrast/detail/${record.supplierCertificateId}` : `/materials/registContrast/detail/${record.supplierCertificateId}?id=${record.standardCertificateId}`}
        >
          {record.compareFlag ? '重新对照' : '对照'}
        </Link>
      ),
    },
  ]
  const tableProps = {
    columns,
    dataSource: registList,
    pagination,
    bordered: true,
    onChange(page) {
      dispatch({
        type: 'registContrast/getRegistList',
        payload: {
          ...searchData,
          ...page,
        },
      })
    },
    loading: !!getLoading(['getRegistList']),
    rowKey: 'supplierCertificateId',
  }
  return (
    <div className="aek-layout">
      <div className="bread">
        <Breadcrumb />
      </div>
      <div className="content">
        <SearchFormFilter {...searchPorps} />
        <Table {...tableProps} />
      </div>
    </div>
  )
}
RegistIndex.propTypes = propTypes

export default connect(({ registContrast, loading }) => ({ registContrast, loading }))(RegistIndex)
