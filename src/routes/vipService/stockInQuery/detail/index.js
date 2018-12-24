import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Spin, Table } from 'antd'
import { getBasicFn, formatNum } from '../../../../utils/index'
import PlainForm from '../../../../components/PlainForm'
import Breadcrumb from '../../../../components/Breadcrumb'
import APanel from '../../../../components/APanel'

const namespace = 'stockInQueryDetail'
const propTypes = {
  stockInQueryDetail: PropTypes.object,
  loading: PropTypes.object,
}
const StockInQueryDetail = ({ stockInQueryDetail, loading }) => {
  const { getLoading } = getBasicFn({ namespace, loading })
  const { detailData, tableData } = stockInQueryDetail
  const plainData = {
    客户名称: detailData.customerOrgName || '',
    入库单号: detailData.formNo || '',
    送货单号: detailData.transferNo || '',
    入库金额: detailData.formAmount || '',
    记账时间: detailData.accountTime || '',
    类型: detailData.formName || '',
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
        title: '通用名称',
        dataIndex: 'commonName',
      },
      {
        title: '批号',
        dataIndex: 'batchNo',
      },
      {
        title: '效期',
        dataIndex: 'expiredDate',
      },
      {
        title: '跟踪码',
        dataIndex: 'lotNo',
      },
      {
        title: '数量',
        dataIndex: 'stockInQty',
      },
      {
        title: '单价',
        dataIndex: 'stockInPrice',
        className: 'aek-text-right',
        render(data) {
          return formatNum(data)
        },
      },
      {
        title: '金额',
        dataIndex: 'itemAmount',
        className: 'aek-text-right',
        render(data) {
          return formatNum(data)
        },
      },
      {
        title: '发票日期',
        dataIndex: 'invoiceDate',
      },
      {
        title: '发票号码',
        dataIndex: 'invoiceNo',
      },
      {
        title: '厂家',
        dataIndex: 'factoryName',
      },
      {
        title: '注册证号',
        dataIndex: 'regNo',
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

StockInQueryDetail.propTypes = propTypes
export default connect(({ stockInQueryDetail, loading, app }) => ({
  stockInQueryDetail,
  loading,
  app,
}))(StockInQueryDetail)
