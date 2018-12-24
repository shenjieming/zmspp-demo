import React from 'react'
import PropTypes from 'prop-types'
import { Breadcrumb, SearchFormFilter } from '@components'
import { connect } from 'dva'
import { Button, Table, message } from 'antd'
import { getBasicFn, getOption } from '@utils'
import { namespace, GET_LIST, RESEND } from '@shared/log/log'
import Detail from './detail'

const apiTypeList = [
  { id: '1', name: 'herp上传' },
  { id: '2', name: '平台下发' },
  { id: '3', name: '平台内部消息' },
]

const formData = [
  {
    field: 'apiType',
    component: {
      name: 'Select',
      props: {
        children: getOption(apiTypeList, { prefix: 'API类型' }),
        optionLabelProp: 'title',
      },
    },
    options: {
      initialValue: '1',
    },
  },
  {
    field: 'responseCode',
    component: {
      name: 'Select',
      props: {
        children: getOption([{ id: '0', name: '正常' }, { id: '1', name: '异常' }], { prefix: '响应码' }),
        optionLabelProp: 'title',
      },
    },
    options: {
      initialValue: '1',
    },
  },
  {
    field: 'keyword',
    component: {
      name: 'Input',
      props: { placeholder: '关键字' },
    },
  },
]

function Log(props) {
  const { [namespace]: state, loading } = props
  const { dataSource, searchParam, pagination, detail, detailVisible } = state

  const { getLoading, dispatchAction } = getBasicFn({ namespace, loading })

  const columns = [
    {
      title: '序号',
      key: 'index',
      className: 'aek-text-center',
      render: (_, $, i) => i + 1,
    },
    {
      title: '主键',
      key: 'apiId',
      dataIndex: 'apiId',
      className: 'aek-text-center',
    },
    {
      title: '消息类型',
      key: 'apiType',
      dataIndex: 'apiType',
    },
    {
      title: '响应编码',
      key: 'responseCode',
      dataIndex: 'responseCode',
      className: 'aek-text-center',
    },
    {
      title: '发送时间',
      key: 'sendTime',
      dataIndex: 'sendTime',
      className: 'aek-text-center',
    },
    {
      title: '操作',
      key: 'action',
      className: 'aek-text-center',
      render: (_, row) => (
        <div>
          <Button
            className="aek-mr20"
            type="primary"
            onClick={() => {
              dispatchAction({ type: RESEND, payload: row.apiId }).then(() => {
                message.success('重发成功')
              })
            }}
          >
            重发
          </Button>
          <Button
            onClick={() => {
              dispatchAction({ type: 'updateState', payload: { detail: row, detailVisible: true } })
            }}
          >
            查看详情
          </Button>
        </div>
      ),
    },
  ]

  const tableProps = {
    loading: getLoading(GET_LIST),
    dataSource,
    rowKey: 'apiId',
    columns,
    pagination: {
      ...pagination,
      showQuickJumper: true,
      showSizeChanger: true,
      showTotal: total => `共有数据${total}条`,
    },
    onChange: ({ current, pageSize }) => {
      dispatchAction({
        type: GET_LIST,
        payload: { pagination: { ...pagination, current, pageSize } },
      })
    },
    bordered: true,
  }

  const searchProps = {
    formData,
    initialValue: searchParam,
    onSearch: (values) => {
      dispatchAction({ type: GET_LIST, payload: { searchParam: values } })
    },
    loading: getLoading(GET_LIST),
  }

  const detailProps = {
    data: detail,
    visible: detailVisible,
    handleClose: () => {
      dispatchAction({ type: 'updateState', payload: { detailVisible: false } })
    },
  }

  return (
    <div className="aek-layout">
      <div className="bread">
        <Breadcrumb />
      </div>
      <div className="content">
        <SearchFormFilter {...searchProps} />
        <Table {...tableProps} />
        <Detail {...detailProps} />
      </div>
    </div>
  )
}

Log.propTypes = {
  loading: PropTypes.object.isRequired,
  [namespace]: PropTypes.object.isRequired,
}

const mapStateToProps = store => ({
  loading: store.loading,
  [namespace]: store[namespace],
})

export default connect(mapStateToProps)(Log)
