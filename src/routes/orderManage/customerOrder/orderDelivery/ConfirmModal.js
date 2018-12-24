import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Icon, Button } from 'antd'
import style from './index.less'

const ConfirmModal = ({ confirmVisible, confirmfunc: { onOk, onCancel } }) => {
  const modalOpts = {
    title: '',
    visible: confirmVisible,
    onCancel,
    width: 500,
    wrapClassName: 'aek-modal',
    footer: false,
    maskClosable: false,
  }
  return (
    <Modal {...modalOpts}>
      <div className={style.modalInfo}>
        <Icon className="aek-blue" type="check-circle" />
        <p>您已发货成功，请打印配送单随货送至医院</p>
      </div>
      <div className={style.modalButton}>
        <div>
          <Button type="primary" onClick={onOk}>
            打印配送单
          </Button>
        </div>
        <div>
          <a onClick={onCancel}>
            回到订单列表
          </a>
        </div>
      </div>
    </Modal>
  )
}

ConfirmModal.propTypes = {
  confirmVisible: PropTypes.bool,
  confirmfunc: PropTypes.object,
}

export default ConfirmModal
