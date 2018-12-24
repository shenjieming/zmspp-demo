import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Table } from 'antd'
import { formatNum } from '../../../utils'
import styles from './index.less'

const SuccessModal = ({ visible, orderDetail, onCancel }) => {
  const modalOpts = {
    title: '购买VIP',
    visible,
    onCancel,
    maskClosable: false,
    width: 600,
    wrapClassName: 'aek-modal',
    footer: null,
  }
  const tableParam = {
    dataSource: [orderDetail],
    rowKey: 'hplId',
    columns: [
      { title: '客户名称', dataIndex: 'hplName' },
      {
        title: '服务时长',
        dataIndex: 'serviceMth',
        render(data) {
          return `${data}个月`
        },
      },
      {
        title: '价格',
        dataIndex: 'serviceAmount',
        className: 'aek-text-right',
        render(data) {
          return formatNum(data)
        },
      },
    ],
    showHeader: false,
    pagination: false,
  }
  return (
    <Modal {...modalOpts}>
      <div className={styles.modalContainer}>
        <div className="aek-font-mid aek-text-bold">
          VIP会员订单 (订单号: {orderDetail.orderNo})
        </div>
        <div className="aek-clearfix">
          <Table {...tableParam} />
          <div className="aek-fr aek-font-mid">
            合计:
            <span className="aek-red">{formatNum(orderDetail.serviceAmount)}</span>
          </div>
        </div>
        <div className="aek-font-mid aek-text-bold">支付会员费用</div>
        <div>
          请扫描下方二维码 「支付」{' '}
          <span className={styles.importantinfo}>{formatNum(orderDetail.serviceAmount)}</span>
          ，支付时请备注 <span className={styles.importantinfo}>您的企业名称，会员订单号</span>
          ，支付成功后， 请拨打客户服务热线：400-052-5256（工作日 9:00 至 17:30）
          告知付款信息，并为您开通VIP服务。
        </div>
        <div className="aek-mt20">
          <div className={styles.qrCodeWeChatPay} />
          <div className={styles.qrCodeAliPay} />
        </div>
      </div>
    </Modal>
  )
}

SuccessModal.propTypes = {
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
  form: PropTypes.object,
  loading: PropTypes.bool,
  visible: PropTypes.bool,
  orderDetail: PropTypes.object,
  modalType: PropTypes.string,
}

export default SuccessModal
