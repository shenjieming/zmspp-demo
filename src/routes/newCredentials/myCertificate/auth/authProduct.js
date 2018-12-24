import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Transfer, Spin } from 'antd'
import Styles from './authCustomer.less'

const propTypes = {
  data: PropTypes.array,
  visible: PropTypes.bool,
  loading: PropTypes.bool,
  handleCancel: PropTypes.func,
  handleTargetKeysChange: PropTypes.func,
  targetKeys: PropTypes.array,
  handleOk: PropTypes.func,
}
const render = item => ({
  label: (
    <div className={Styles['product-item']}>
      <p className={'aek-word-break'}>{item.firstTitle}</p>
      <p className={`aek-text-help aek-word-break ${Styles['text-over']}`}>{item.secondTitle}</p>
      <p className={`aek-text-help aek-word-break ${Styles['text-over']}`}>{ item.thirdTitle }</p>
    </div>
  ),
  value: item.title,
})

function EditModal(props) {
  const dataSource = props.data.map(item => ({
    key: item.registerCertId,
    title: `${item.regsiterCertNo || ''}${item.productName || ''}${item.supplierName || ''}`,
    firstTitle: item.regsiterCertNo,
    secondTitle: item.productName,
    thirdTitle: item.supplierName,
    flag: item.flag,
  }))

  const transferProps = {
    key: props.visible,
    className: Styles['product-transfer'],
    dataSource,
    showSearch: true,
    render,
    targetKeys: props.targetKeys,
    titles: [
      <span className="aek-font-large">未选择产品</span>,
      <span className="aek-font-large">已选择注册证</span>,
    ],
    operations: ['移入', '移出'],
    notFoundContent: '',
    listStyle: { width: 300 },
    lazy: {
      width: 320,
      height: 70,
    },
    searchPlaceholder: '请输入证号、产品名称、厂家',
    onChange: props.handleTargetKeysChange,
  }

  const modalProps = {
    title: '授权产品',
    visible: props.visible,
    confirmLoading: props.loading,
    width: 700,
    onCancel: props.handleCancel,
    wrapClassName: 'aek-modal',
    onOk: props.handleOk,
    maskClosable: false,
  }

  return (
    <Modal {...modalProps}>
      <Spin spinning={props.loading}>
        <div className={Styles.wrap}>
          <Transfer {...transferProps} />
        </div>
      </Spin>
    </Modal>
  )
}

EditModal.propTypes = propTypes

export default EditModal
