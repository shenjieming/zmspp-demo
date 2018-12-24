import React from 'react'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import { Table, Input, Button, Modal } from 'antd'

import { getBasicFn, getPagination } from '../../../../utils'
import { NO_LABEL_LAYOUT } from '../../../../utils/constant'

import Breadcrumb from '../../../../components/Breadcrumb'
import SearchForm from '../../../../components/SearchFormFilter'

const propTypes = {
  pushCertificate: PropTypes.object,
  loading: PropTypes.object,
}
const namespace = 'pushCertificate'
const PushCertificate = ({ pushCertificate, loading }) => {
  const { searchParams, data, pagination, selectedRowKeys, customerOrgId } = pushCertificate
  const { dispatchAction, getLoading } = getBasicFn({ namespace, loading })
  const searchHandlder = (value) => {
    dispatchAction({ type: 'getData', payload: { ...value, current: 1 } })
  }
  const pageChange = (current, pageSize) => {
    dispatchAction({ type: 'getData', payload: { current, pageSize } })
  }
  const pushCertificates = (certificateIds) => {
    if (!certificateIds.length) {
      Modal.warning({
        content: '请勾选需要推送的证件',
      })
      return
    }
    // 获取注册证号
    const certificateNos = []
    Modal.confirm({
      content: '确认推送证件?',
      onOk: () => {
        dispatchAction({
          type: 'pushCertificates',
          payload: { certificateIds, customerOrgId, certificateNos },
        })
      },
    })
  }
  const searhProps = {
    initialValues: searchParams,
    formData: [
      {
        layout: NO_LABEL_LAYOUT,
        field: 'keywords',
        width: 300,
        options: {
          initialValue: '',
        },
        component: <Input placeholder="请输入注册证号、产品名称、厂家" />,
      },
    ],
    onSearch: searchHandlder,
  }
  const tableColumns = [
    {
      title: '序号',
      key: 'index',
      className: 'aek-text-center',
      width: 50,
      render: (value, row, index) => index + 1,
    },
    {
      title: '注册证',
      dataIndex: 'certificateNo',
      render(text, row) {
        return (
          <span>
            <div>{text}</div>
            <div className="aek-gray">{row.productName}</div>
          </span>
        )
      },
    },
    {
      title: '厂家',
      dataIndex: 'produceFactoryName',
    },
    {
      title: '操作',
      key: 'oprate',
      width: 150,
      render(_, record) {
        if (record.pushStatus === 1) {
          return <span className="aek-gray">已推送</span>
        }
        return (
          <a
            onClick={() => {
              pushCertificates([record.certificateId])
            }}
          >
            推送
          </a>
        )
      },
    },
  ]
  const onSelctChange = (keys) => {
    dispatchAction({ type: 'updateState', payload: { selectedRowKeys: keys } })
  }
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelctChange,
    getCheckboxProps: record => ({
      disabled: record.pushStatus === 1,
    }),
  }
  const tableProps = {
    bordered: true,
    rowKey: 'certificateId',
    rowSelection,
    loading: getLoading('getData'),
    columns: tableColumns,
    pagination: getPagination(pageChange, pagination),
    dataSource: data,
  }
  return (
    <div className="aek-layout">
      <div className="bread">
        <Breadcrumb />
      </div>
      <div className="content">
        <div style={{ height: '60px', lineHeight: '38px' }}>
          <Button
            type="primary"
            onClick={() => {
              pushCertificates(selectedRowKeys)
            }}
          >
            批量推送证件
          </Button>
          <div style={{ float: 'right' }}>
            <SearchForm {...searhProps} />
          </div>
        </div>
        <Table {...tableProps} />
      </div>
    </div>
  )
}

PushCertificate.propTypes = propTypes
export default connect(({ pushCertificate, loading }) => ({ pushCertificate, loading }))(
  PushCertificate,
)
