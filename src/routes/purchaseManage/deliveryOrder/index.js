import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Table } from 'antd'
import { debounce } from 'lodash'
import { getBasicFn, getPagination } from '../../../utils'
import SearchFormFilter from '../../../components/SearchFormFilter'
import Breadcrumb from '../../../components/Breadcrumb'
import { formData, advancedFormData, genColumns } from './data'
import PrintModal from './modal/printModal'

const namespace = 'purchaseDelivery'
const propTypes = {
  purchaseDelivery: PropTypes.object.isRequired,
  loading: PropTypes.object.isRequired,
  app: PropTypes.object,
}
const DeliveryOrder = ({
  purchaseDelivery,
  loading,
  app: {
    orgInfo: { accuracy, orgName, orgId },
  },
}) => {
  const { dispatchAction, getLoading } = getBasicFn({ namespace, loading })
  const {
    searchParam,
    printModalVisible,
    printList,
    printDetailData,
    pagination,
    deliveryOrderList,
    supplierOPList,
  } = purchaseDelivery
  const onSearchListDelay = debounce((keywords) => {
    if (keywords) {
      dispatchAction({
        type: 'querySupplierOPList',
        payload: { keywords },
      })
    }
  }, 500)
  const searchParams = {
    initialValues: searchParam,
    formData: formData({ supplierOPList, onSearchListDelay }),
    advancedForm: advancedFormData({ supplierOPList, onSearchListDelay }),
    onSearch(data) {
      dispatchAction({
        payload: { searchParam: data },
      })
      dispatchAction({
        type: 'queryDeliveryList',
        payload: { ...pagination, current: 1 },
      })
    },
  }
  const tableParam = {
    bordered: true,
    scroll: { x: 1100 },
    loading: getLoading('queryDeliveryList', 'mountOnOffStatus'),
    columns: genColumns({
      printDeliverOrder({ formNo }) {
        dispatchAction({
          type: 'printCheckOrder',
          payload: { formNo },
        })
      },
      orgId,
    }),
    dataSource: deliveryOrderList,
    pagination: getPagination((current, pageSize) => {
      dispatchAction({
        type: 'queryDeliveryList',
        payload: { current, pageSize },
      })
    }, pagination),
    rowKey: 'formId',
  }
  const printModalParam = {
    cancelDefault() {
      dispatchAction({
        payload: {
          printList: [],
          printDetailData: {},
        },
      })
    },
    accuracy,
    dispatchAction,
    getLoading,
    printModalVisible,
    printList,
    printDetailData,
    orgName,
  }
  return (
    <div className="aek-layout">
      <div className="bread">
        <Breadcrumb />
      </div>
      <div className="content">
        <SearchFormFilter {...searchParams} />
        <Table {...tableParam} />
      </div>
      <PrintModal {...printModalParam} />
    </div>
  )
}

DeliveryOrder.propTypes = propTypes
export default connect(({ purchaseDelivery, loading, app }) => ({
  purchaseDelivery,
  loading,
  app,
}))(DeliveryOrder)
