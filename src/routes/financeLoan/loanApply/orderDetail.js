import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Table, Spin } from 'antd'
import { getBasicFn } from '../../../utils/index'

const namespace = 'loanApply'
const OrderDetail = ({
  loanApply,
  loading,
}) => {
  const {
    orderDetailVisible,
    orderDetailList,
    orderDetailPag,
  } = loanApply
  const { dispatchAction, getLoading } = getBasicFn({ namespace, loading })
  // 关闭弹框
  const cancelModal = () => {
    dispatchAction({
      payload: {
        orderDetailVisible: false,
      },
    })
  }
  const detailModalProp = {
    title: '入库单详情',
    visible: orderDetailVisible,
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
    onCancel() {
      cancelModal()
    },
    afterClose() {
      cancelModal()
    },
    width: 900,
    footer: null,
  }
  const columns = [{
    dataIndex: 'formNo',
    key: 'formNo',
    title: '产品名称/规格',
    render(value, record) {
      return <span>{value}{record.specSize}</span>
    },
  }, {
    dataIndex: 'stockInPrice',
    key: 'stockInPrice',
    title: '单价',
  }, {
    dataIndex: 'stockInQty',
    key: 'stockInQty',
    title: '数量/单位',
    render(value, record) {
      return <span>{value}{record.specUnit}</span>
    },
  }, {
    dataIndex: 'factoryName',
    key: 'factoryName',
    title: '厂家',
  }, {
    dataIndex: 'specBrand',
    key: 'specBrand',
    title: '产品品牌',
  }, {
    dataIndex: 'invoiceNo',
    key: 'invoiceNo',
    title: '发票号码',
  }]
  const tableProps = {
    dataSource: orderDetailList,
    bordered: true,
    columns,
    rowKey: 'stockInItemId',
    loading: getLoading('getReceivableOrderDetail'),
    pagination: orderDetailPag,
    onChange(pagination) {
      dispatchAction({
        type: 'getReceivableOrderDetail',
        payload: {
          formId: orderDetailPag.formId,
          ...pagination,
        },
      })
    },
  }
  return (
    <Modal {...detailModalProp} >
      <Spin spinning={getLoading('')}>
        <Table {...tableProps} />
      </Spin>
    </Modal>
  )
}
OrderDetail.propTypes = {
  loanApply: PropTypes.object,
  loading: PropTypes.object,
}
export default OrderDetail
