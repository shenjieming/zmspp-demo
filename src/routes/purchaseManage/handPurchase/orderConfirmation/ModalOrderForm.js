import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Table, Icon, Button } from 'antd'
import { orderFormInfoColumns } from './data'
import style from './style.less'

const propTypes = {
  visible: PropTypes.bool,
  tableData: PropTypes.array,
  dispatchUrl: PropTypes.func,
}

const ModalOrderForm = ({
  visible,
  tableData,
  dispatchUrl,
}) => {
  const tableProps = {
    pagination: false,
    dataSource: tableData || [],
    rowKey: 'formId',
    bordered: true,
    columns: orderFormInfoColumns,
    size: 'small',
  }
  const modalOpts = {
    visible,
    closable: false,
    maskClosable: false,
    title: null,
    footer: null,
    width: 800,
    wrapClassName: 'aek-modal',
  }
  return (
    <Modal {...modalOpts}>
      <div className={style.modalInfo}>
        <Icon className="aek-blue" type="check-circle" />
        <p>订单提交成功</p>
        <p className="aek-text-help">稍后供应商会收到短信提醒</p>
      </div>
      <div className={style.modalTable}>
        <p className="aek-text-help">根据您的采购物资，本次生成如下订单：</p>
        <Table {...tableProps} />
      </div>
      <div className={style.modalButton}>
        <Button
          type="primary"
          onClick={() => {
            dispatchUrl({ pathname: '/purchaseManage/purchaseOrder' })
          }}
        >
          前往订单列表
        </Button>
        <Button
          type="primary"
          onClick={() => {
            dispatchUrl({ pathname: '/purchaseManage/handPurchase' })
          }}
        >
          继续采购
        </Button>
      </div>
    </Modal>
  )
}

ModalOrderForm.propTypes = propTypes

export default ModalOrderForm
