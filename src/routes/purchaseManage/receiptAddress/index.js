import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Modal } from 'antd'
import { getBasicFn } from '../../../utils'
import ContentLayout from '../../../components/ContentLayout'
import ModalForm from './ModalForm'
import ReceiptAddressCard from './ReceiptAddressCard'

const propTypes = {
  receiptAddress: PropTypes.object,
  loading: PropTypes.object,
  addressList: PropTypes.array,
}

function ReceiptAddress({ receiptAddress, loading, addressList }) {
  const { toAction, getLoading } = getBasicFn({
    namespace: 'receiptAddress',
    loading,
  })
  const { modalType, modalVisible, modalForm, addressArr } = receiptAddress
  const modalProps = {
    visible: modalVisible,
    addressList,
    modalForm,
    modalType,
    modalButtonLoading: getLoading('updateAddress', 'createAddress'),
    onOk(data) {
      const req = data
      req.receiptMasterAddress = req.receiptMasterAddress.join(' ')
      if (req.receiptId) {
        toAction(req, 'updateAddress')
      } else {
        if (!addressArr.length) {
          req.receiptDefaultFlag = true
        }
        toAction(req, 'createAddress')
      }
    },
    onCancel() {
      toAction({ modalVisible: false })
    },
  }
  const receiptAddressCardProps = {
    addressArr,
    type: 'edit',
    loading: getLoading('getAddressList'),
    deleteAddress(receiptId) {
      Modal.confirm({
        title: '您确定要删除该收货地址?',
        onOk() {
          toAction({ receiptId }, 'deleteAddress')
        },
      })
    },
    setDetailed(receiptId) {
      toAction({ receiptId }, 'setDetailed')
    },
    editAddress(obj) {
      toAction('app/queryAddress')
      toAction({
        modalType: obj ? 'update' : 'create',
        modalVisible: true,
        modalForm: obj || {},
      })
    },
  }
  const contentLayoutProps = {
    breadLeft: [{ name: 'Breadcrumb' }],
    content: (
      <span>
        <ReceiptAddressCard {...receiptAddressCardProps} />
        <ModalForm {...modalProps} />
      </span>
    ),
  }

  return <ContentLayout {...contentLayoutProps} />
}

ReceiptAddress.propTypes = propTypes

export default connect(({
  receiptAddress,
  loading,
  app: { constants: { addressList } },
}) => ({ receiptAddress, loading, addressList }))(ReceiptAddress)
