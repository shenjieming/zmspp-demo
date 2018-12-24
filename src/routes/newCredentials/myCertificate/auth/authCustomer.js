import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Transfer, Avatar, Spin } from 'antd'
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
    <span className={Styles.item}>
      <Avatar className={Styles.left} src={item.imgUrl} icon="user" />
      <div style={{ width: '170px' }} className={`aek-ml10 ${Styles.left} aek-word-break`}>{item.title}</div>
    </span>
  ),
  value: item.title,
})

function EditModal(props) {
  const dataSource = props.data.map(item => ({
    key: item.customerOrgId,
    title: item.customerOrgName,
    imgUrl: item.orgLogoUrl,
    flag: item.flag,
  }))

  const transferProps = {
    key: props.visible,
    className: Styles.transfer,
    dataSource,
    showSearch: true,
    render,
    targetKeys: props.targetKeys,
    titles: [
      <span className="aek-font-large">未选择客户</span>,
      <span className="aek-font-large">已选择客户</span>,
    ],
    operations: ['移入', '移出'],
    notFoundContent: '',
    listStyle: { width: 290 },
    lazy: { height: 46 },
    searchPlaceholder: '请输入客户名称',
    onChange: props.handleTargetKeysChange,
  }

  const modalProps = {
    title: '授权客户',
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
