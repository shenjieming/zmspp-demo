import React from 'react'
import PropTypes from 'prop-types'
import { Spin } from 'antd'
import { connect } from 'dva'
import Bread from '../../../components/Breadcrumb'
import { getBasicFn } from '../../../utils/'
import { COMMON_REDUCER } from '../../../utils/constant'
import EditModal from './EditModal'
import UserCard from './UserCard'

const namespace = 'businessAuth'

const propTypes = {
  loading: PropTypes.object.isRequired,
  [namespace]: PropTypes.object.isRequired,
}

function Auth(props) {
  const { dispatchAction, getLoading } = getBasicFn({ namespace, loading: props.loading })

  const state = props[namespace]

  const openEditModal = (item) => {
    dispatchAction({
      type: COMMON_REDUCER,
      payload: {
        modelVisible: true,
        radioValue: Number(item.smsFlag),
        currentUserId: item.userId,
        curAdminFlag: item.adminFlag,
      },
    })
    dispatchAction({ type: 'getCustomersList', payload: item.userId })
  }

  const editModalProps = {
    visible: state.modelVisible,
    data: state.customersList,
    tableLoading: getLoading('getCustomersList'),
    loading: getLoading('saveEdit'),
    handleCancel: () => {
      dispatchAction({ type: COMMON_REDUCER, payload: { modelVisible: false, customersList: [] } })
    },
    handleOk: (orgList) => {
      dispatchAction({ type: 'saveEdit', payload: { orgList, userId: state.currentUserId } })
    },
    adminFlag: state.curAdminFlag,
  }

  return (
    <div className="aek-layout">
      <div className="bread">
        <Bread />
      </div>
      <div className="content">
        <Spin spinning={getLoading('getList')}>
          {state.userList.map(item => (
            <UserCard key={item.userId} item={item} handleBtnClick={openEditModal} />
          ))}
        </Spin>
      </div>
      <EditModal {...editModalProps} />
    </div>
  )
}

Auth.propTypes = propTypes

const mapStateToProps = store => ({
  [namespace]: store[namespace],
  loading: store.loading,
})

export default connect(mapStateToProps)(Auth)
