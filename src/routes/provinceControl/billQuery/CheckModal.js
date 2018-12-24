import React from 'react'
import { Modal, Table } from 'antd'
import PropTypes from 'prop-types'
import { PlainForm } from '../../../components'

const propTypes = {
  loading: PropTypes.bool,
  checkModalType: PropTypes.string,
  onCancel: PropTypes.func,
  visible: PropTypes.bool,
  currentDetail: PropTypes.object,
}
const checkModal = ({ checkModalType, visible, onCancel, currentDetail, loading }) => {
  const {
    formNo,
    splName,
    transferNo,
    accountTime,
    accountName,
    periodNo,
    formQty,
    formAmount,
    orderId,
    addTime,
    details = [],
  } = currentDetail
  const modalParam = {
    title: checkModalType === 'storage' ? '入库单详情' : '省平台采购单详情',
    visible,
    width: 1000,
    onCancel,
    footer: false,
  }
  let detailData = {
    单号: formNo,
    供应商名称: splName,
    送货单号: transferNo,
    记账时间: accountTime,
    记账人: accountName,
    会计时间: periodNo,
    数量: formQty,
    金额: <span>￥ {formAmount}</span>,
  }
  if (checkModalType !== 'storage') {
    detailData = {
      入库单号: formNo,
      供应商名称: splName,
      省平台采购单号: orderId,
      生成时间: addTime,
      金额: <span>￥ {formAmount}</span>,
    }
  }
  const columns = [
    {
      title: '省标编号',
      dataIndex: 'inviteNo',
      key: 'inviteNo',
      width: 120,
    },
    {
      title: '物资名称',
      dataIndex: 'goodsName',
      key: 'goodsName',
      width: 120,
    },
    {
      title: '规格型号',
      dataIndex: 'specSize',
      key: 'specSize',
      width: 120,
    },
    {
      title: '通用名称',
      dataIndex: 'commonName',
      key: 'commonName',
      width: 120,
    },
    {
      title: '批号',
      dataIndex: 'batchNo',
      key: 'batchNo',
      width: 120,
    },
    {
      title: '效期',
      dataIndex: 'expiredDate',
      key: 'expiredDate',
      width: 120,
    },
    {
      title: '跟踪码',
      dataIndex: 'lotNo',
      key: 'lotNo',
      width: 120,
    },
    {
      title: '数量',
      dataIndex: 'stockInQty',
      key: 'stockInQty',
      width: 80,
    },
    {
      title: '单价',
      dataIndex: 'stockInPrice',
      key: 'stockInPrice',
      width: 80,
      className: 'aek-text-right',
      render: text => <span>￥ {text}</span>,
    },
    {
      title: '金额',
      dataIndex: 'itemAmount',
      key: 'itemAmount',
      width: 80,
      className: 'aek-text-right',
      render: text => <span>￥ {text}</span>,
    },
    {
      title: '发票日期',
      dataIndex: 'invoiceDate',
      key: 'invoiceDate',
      width: 120,
    },
    {
      title: '发票号码',
      dataIndex: 'invoiceNo',
      key: 'invoiceNo',
      width: 120,
    },
    {
      title: '厂家',
      dataIndex: 'factoryName',
      key: 'factoryName',
      width: 120,
    },
    {
      title: '品牌/产地',
      dataIndex: 'specBrand',
      key: 'specBrand',
      width: 120,
      render: (text, { factoryAddr }) => (
        <span>
          <p>{text || <span>&nbsp;</span>}</p>
          <p>{factoryAddr || <span>&nbsp;</span>}</p>
        </span>
      ),
    },
    {
      title: '注册证号',
      dataIndex: 'regNo',
      key: 'regNo',
      width: 120,
    },
  ]
  const tableParam = {
    bordered: true,
    loading,
    columns,
    scroll: { x: 2000, y: 360 },
    rowKey: 'id',
    dataSource: details,
    pagination: false,
  }
  return (
    <Modal {...modalParam}>
      <div className="aek-form-head">单据信息</div>
      <PlainForm data={detailData} size={3} />
      <div className="aek-form-head">明细信息</div>
      <Table {...tableParam} />
    </Modal>
  )
}

checkModal.propTypes = propTypes
export default checkModal
