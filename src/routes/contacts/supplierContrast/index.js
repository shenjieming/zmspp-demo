import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Input, Select, Table } from 'antd'
import Bread from '../../../components/Breadcrumb'
import SearchFormFilter from '../../../components/SearchFormFilter'
import ContrastModal from './modal'

const Option = Select.Option
function SupplierContrast({ supplierContrast, effects, dispatch, routes }) {
  const {
    pagination,
    modalVisible,
    dataSource,
    modalTitleFlag,
    searchData,
    defaultRowData,
    orgNameList,
  } = supplierContrast
  // 搜索条件
  const searchFormProps = {
    components: [{
      field: 'comparisonStatus',
      component: (
        <Select optionLabelProp="title">
          <Option value={null} title="对照状态：全部">全部</Option>
          <Option value={'2'} title="对照状态：已对照">已对照</Option>
          <Option value={'1'} title="对照状态：未对照">未对照</Option>
        </Select>
      ),
      options: {
        initialValue: searchData.comparisonStatus || null,
      },
    },
    {
      field: 'keywords',
      component: (
        <Input placeholder="输入组织名称查询" />
      ),
      options: {
        initialValue: null,
      },
    }],
    onSearch: (value) => {
      dispatch({
        type: 'supplierContrast/getContrastList',
        payload: {
          ...value,
          current: 1,
          pageSize: 10,
        },
      })
    },
  }
  // 对照
  const handleClick = (flag, record) => {
    dispatch({
      type: 'supplierContrast/updateState',
      payload: {
        modalVisible: true,
        modalTitleFlag: flag,
        defaultRowData: record,
      },
    })
    // 打开弹框时先获取默认下拉框数据
    dispatch({
      type: 'supplierContrast/getOrgList',
      payload: {
        keywords: '',
      },
    })
  }
  // 列表
  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      className: 'aek-text-center',
      width: 30,
      render: (value, record, index) => index + 1,
    },
    {
      title: '内网名称',
      dataIndex: 'intranetOrgName',
      key: 'intranetOrgName',
    },
    {
      title: '平台名称',
      dataIndex: 'platformOrgName',
      key: 'platformOrgName',
    },
    {
      title: '对照状态',
      dataIndex: 'comparisonStatus',
      key: 'comparisonStatus',
      className: 'aek-text-center',
      render: (value) => {
        if (value === 2) {
          return '已对照'
        }
        return '未对照'
      },
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      className: 'aek-text-center',
      render: (value, record) => {
        if (record.comparisonStatus === 2) {
          return <a onClick={() => { handleClick(true, record) }}>重新对照</a>
        }
        return <a onClick={() => { handleClick(false, record) }}>对照</a>
      },
    },
  ]
  const onChange = (value) => {
    dispatch({
      type: 'supplierContrast/getContrastList',
      payload: {
        ...searchData,
        ...value,
      },
    })
  }
  const modalPorps = {
    modalVisible,
    modalTitleFlag,
    dispatch,
    effects,
    defaultRowData,
    orgNameList,
  }
  return (
    <div className="aek-layout">
      <div className="bread">
        <Bread routes={routes} />
      </div>
      <div className="content">
        <SearchFormFilter {...searchFormProps} />
        <Table
          columns={columns}
          dataSource={dataSource}
          onChange={onChange}
          pagination={pagination}
          bordered
          rowKey="id"
          loading={!!effects['supplierContrast/getContrastList']}
        />
      </div>
      <ContrastModal {...modalPorps} />
    </div>
  )
}

SupplierContrast.propTypes = {
  supplierContrast: PropTypes.object,
  effects: PropTypes.object,
  dispatch: PropTypes.func,
  routes: PropTypes.array,
}

export default connect(
  ({
    supplierContrast,
    loading: {
      effects,
    },
  }) => ({ supplierContrast, effects }))(SupplierContrast)
