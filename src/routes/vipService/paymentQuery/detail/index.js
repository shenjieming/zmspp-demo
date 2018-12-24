import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Spin, Table } from 'antd'
import { getBasicFn, formatNum } from '../../../../utils/index'
import PlainForm from '../../../../components/PlainForm'
import Breadcrumb from '../../../../components/Breadcrumb'
import APanel from '../../../../components/APanel'

const namespace = 'paymentQueryDetail'
const propTypes = {
  paymentQueryDetail: PropTypes.object,
  loading: PropTypes.object,
}
const PaymentQueryDetail = ({ paymentQueryDetail, loading }) => {
  const { getLoading } = getBasicFn({ namespace, loading })
  const { detailData, tableData } = paymentQueryDetail
  const plainData = {
    客户名称: detailData.customerOrgName || '',
    应付单号: detailData.formNo || '',
    应付金额: detailData.formAmount || '',
    制单时间: detailData.submitTime || '',
    状态: detailData.formStatus || '',
  }
  const tableParams = {
    rowKey: 'stockInItemId',
    pagination: false,
    columns: [
      {
        title: '序号',
        key: 'index',
        className: 'aek-text-center',
        width: 50,
        render: (value, row, index) => index + 1,
      },
      {
        title: '物资名称',
        dataIndex: 'goodsName',
      },
      {
        title: '规格型号',
        dataIndex: 'specSize',
      },
      {
        title: '明细金额',
        dataIndex: 'totalAmount',
        className: 'aek-text-right',
        render(data) {
          return formatNum(data)
        },
      },
      {
        title: '明细余额',
        dataIndex: 'stockInBalance',
        className: 'aek-text-right',
        render(data) {
          return formatNum(data)
        },
      },
      {
        title: '本次付款',
        dataIndex: 'itemAmount',
        className: 'aek-text-right',
        render(data) {
          return formatNum(data)
        },
      },
      {
        title: '入库单号',
        dataIndex: 'formNo',
      },
    ],
    dataSource: tableData,
    bordered: true,
    loading: getLoading('getDetail'),
  }
  return (
    <div className="aek-layout">
      <div className="bread">
        <Breadcrumb />
      </div>
      <APanel title="基本信息">
        <Spin spinning={getLoading('getDetail')}>
          <PlainForm size={3} data={plainData} />
        </Spin>
      </APanel>
      <APanel title="收货明细">
        <Table {...tableParams} />
      </APanel>
    </div>
  )
}

PaymentQueryDetail.propTypes = propTypes
export default connect(({ paymentQueryDetail, loading, app }) => ({
  paymentQueryDetail,
  loading,
  app,
}))(PaymentQueryDetail)
