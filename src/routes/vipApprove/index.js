import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Table } from 'antd'
import { cloneDeep } from 'lodash'
import moment from 'moment'

import { getBasicFn, getPagination, getOption, formatNum } from '../../utils'
import SearchForm from '../../components/SearchFormFilter'
import Breadcrumb from '../../components/Breadcrumb'
import ApproveModal from './approveModal'

const propTypes = {
  vipApprove: PropTypes.object,
  loading: PropTypes.object,
  form: PropTypes.object,
}
const noLabelLayout = {
  wrapperCol: { span: 22 },
}
function VipApprove({ vipApprove, loading }) {
  const {
    modalVisible,
    modalType,
    tableData,
    searchParamsSave,
    pagination,
    orderDetail,
  } = vipApprove
  const { toAction, getLoading } = getBasicFn({
    namespace: 'vipApprove',
    loading,
  })
  const showModal = (type, id) => {
    toAction({ modalVisible: true, modalType: type })
    toAction({ orderId: id }, 'getOrderDetail')
  }
  const pageChange = (current, pageSize) => {
    toAction(
      {
        current,
        pageSize,
      },
      'getData',
    )
  }
  const onSearch = (value) => {
    toAction({ searchParamsSave: value })
    const params = cloneDeep(value)
    if (params && params.orderTime && params.orderTime.length) {
      params.addTimeEnd = moment(params.orderTime[1]).format('YYYY-MM-DD')
      params.addTimeStart = moment(params.orderTime[0]).format('YYYY-MM-DD')
    }
    params.orgId = params.orgId && params.orgId.key
    toAction({ searchParams: params })
    toAction(
      {
        ...params,
      },
      'getData',
    )
  }
  const columns = [
    {
      title: '序号',
      key: 'index',
      className: 'aek-text-center',
      width: 50,
      render: (value, row, index) => index + 1,
    },
    {
      title: '订单号',
      dataIndex: 'orderNo',
    },
    {
      title: '供应商名称',
      dataIndex: 'orgName',
    },
    {
      title: '客户名称',
      dataIndex: 'hplName',
    },
    {
      title: '金额',
      dataIndex: 'serviceAmount',
      className: 'aek-text-right',
      render(data) {
        return formatNum(data)
      },
    },
    {
      title: '下单时间',
      dataIndex: 'addTime',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render(data) {
        if (data === 1) {
          return '待审核'
        }
        if (data === 2) {
          return '通过'
        }
        if (data === 3) {
          return '拒绝'
        }
      },
    },
    {
      title: '操作',
      key: 'oprate',
      width: 150,
      className: 'aek-text-center',
      render(_, row) {
        if (row.status > 1) {
          return (
            <a
              onClick={() => {
                showModal('view', row.orderId)
              }}
            >
              查看
            </a>
          )
        }
        return (
          <a
            onClick={() => {
              showModal('approve', row.orderId)
            }}
          >
            审核
          </a>
        )
      },
    },
  ]
  const searchProps = {
    formData: [
      {
        width: 220,
        layout: noLabelLayout,
        field: 'orgId',
        component: {
          name: 'LkcSelect',
          props: {
            url: 'organization/getAllTypeInfo',
            optionConfig: { idStr: 'supplierId', nameStr: 'supplierName' },
            placeholder: '供应商名称',
          },
        },
        options: {
          initialValue: null,
        },
      },
      {
        layout: noLabelLayout,
        field: 'status',
        width: 220,
        options: {
          initialValue: '1',
        },
        component: {
          name: 'Select',
          props: {
            optionLabelProp: 'title',
            children: getOption(
              [
                {
                  id: null,
                  name: '全部',
                },
                {
                  id: '1',
                  name: '待审核',
                },
                {
                  id: '2',
                  name: '审核通过',
                },
                {
                  id: '3',
                  name: '审核拒绝',
                },
              ],
              { prefix: '状态' },
            ),
          },
        },
      },
      {
        width: 220,
        layout: noLabelLayout,
        field: 'keywords',
        component: {
          name: 'Input',
          props: {
            placeholder: '订单号',
          },
        },
        options: {
          initialValue: null,
        },
      },
      {
        width: 220,
        layout: noLabelLayout,
        field: 'orderTime',
        component: {
          name: 'RangePicker',
        },
        options: {
          initialValue: null,
        },
      },
    ],
    initialValues: searchParamsSave,
    loading: getLoading('getData'),
    onSearch,
  }
  const tableProps = {
    loading: getLoading('getData'),
    dataSource: tableData,
    pagination: getPagination(pageChange, pagination),
    rowKey: 'orderId',
    bordered: true,
    columns,
  }
  const modalProps = {
    modalType,
    orderDetail,
    visible: modalVisible,
    loading: getLoading('getOrderDetail', 'approveOrder'),
    onCancel() {
      toAction({ modalVisible: false, orderDetail: {} })
    },
    onOk(value) {
      toAction({ ...value }, 'approveOrder')
    },
  }
  return (
    <div className="aek-layout">
      <div className="bread">
        <Breadcrumb />
      </div>
      <div className="content">
        <SearchForm {...searchProps} />
        <Table {...tableProps} />
      </div>
      <ApproveModal {...modalProps} />
    </div>
  )
}
VipApprove.propTypes = propTypes
export default connect(({ vipApprove, loading }) => ({ vipApprove, loading }))(VipApprove)
