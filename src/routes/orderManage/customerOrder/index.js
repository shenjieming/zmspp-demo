import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Table, Button } from 'antd'
import { Link } from 'dva/router'
import { debounce, cloneDeep } from 'lodash'

import Breadcrumb from '../../../components/Breadcrumb'
import SearchFormFillter from '../../../components/SearchFormFilter'
import { getBasicFn, getPagination } from '../../../utils/index'

import { formData, advancedForm, tableColumns } from './props'
import ConfirmOrder from './confirmOrder'
import PrintPurchase from './printPurchaseList'

const namespace = 'customerOrder'
const CustomerOrder = ({ customerOrder, location, loading }) => {
  const { dispatchAction, getLoading } = getBasicFn({ namespace, loading })
  const {
    orderList,
    customerList,
    purchaseListInfo,
    currentOrderId,
    searchSaveParams,
    pagination,
    confirmOrderVisible,
    printPurchaseVisible,
  } = customerOrder
  const formatDate = (date) => {
    const result = date.map(item => item.format('YYYY-MM-DD'))
    return result.toString()
  }
  // 翻页
  const pageChange = (current, pageSize) => {
    dispatchAction({ type: 'pageChange', payload: { current, pageSize } })
  }
  // 搜索
  const searchHandler = (value) => {
    if (value.unDeliverOverDaysType) {
      value.unDeliverOverDaysType = '1'
    } else {
      value.unDeliverOverDaysType = null
    }
    const param = cloneDeep(value)
    param.customerOrgId = param.customerOrgId && param.customerOrgId.key
    param.formStatus = param.formStatus && Number(param.formStatus)
    param.urgentFlag = param.urgentFlag && Number(param.urgentFlag)
    param.materialsInfo = param.materialsInfo && param.materialsInfo.trim()
    param.purchaseTime = param.purchaseTime && formatDate(param.purchaseTime)
    dispatchAction({ type: 'searchOrder', payload: { ...param } }).then(() => {
      dispatchAction({ payload: { searchSaveParams: value } })
    })
  }
  // 客户列表
  const customers = (value) => {
    if (value.trim()) {
      dispatchAction({
        type: 'customerList',
        payload: { keywords: value },
      })
    }
  }
  // 延迟执行
  const suppliersHandler = debounce(customers, 300)
  // 显示/隐藏确认订单
  const showConfirm = (orderId) => {
    dispatchAction({ payload: { currentOrderId: orderId, confirmOrderVisible: true } })
  }
  const hideConfirm = () => {
    dispatchAction({ payload: { confirmOrderVisible: false } })
  }
  // 显示/隐藏打印modal
  const showPrint = (orderId) => {
    dispatchAction({ payload: { printPurchaseVisible: true } })
    dispatchAction({ type: 'printDetail', payload: { formId: orderId } })
  }
  const hidePrint = () => {
    dispatchAction({ payload: { printPurchaseVisible: false } })
  }
  // 根据不同的状态，呈现不同的操作栏
  const renderOperation = (row) => {
    const status = Number(row.formStatus)
    const orderId = row.formId
    const confirmFlag = row.confirmStatus
    const { canDeliverFlag } = row
    const { pathname } = location // 模块路径
    let operation
    if (Number(status) <= 2) {
      // 完成配送之前有发货操作
      if (!confirmFlag && status === 1) {
        // 未确认订单
        operation = canDeliverFlag ? (
          <div>
            <Link to={`${pathname}/delivery/${orderId}`}>
              <Button type="primary">发货</Button>
            </Link>
            <span className="aek-fill-15" />
            <a
              onClick={() => {
                showConfirm(orderId)
              }}
            >
              订单确认
            </a>
          </div>
        ) : (
          <a
            onClick={() => {
              showConfirm(orderId)
            }}
          >
            订单确认
          </a>
        )
      } else {
        operation = canDeliverFlag ? (
          <Link to={`${pathname}/delivery/${orderId}`}>
            <Button type="primary">发货</Button>
          </Link>
        ) : (
          ''
        )
      }
    } else {
      // 完成配送以及后续阶段都有打印采购单
      operation = (
        <Link className="aek-link" to={`/orderManage/customerOrder/detail/${orderId}`}>
          查看采购单
        </Link>
      )
    }
    return operation
  }
  const initialValues = cloneDeep(searchSaveParams)
  if (initialValues.unDeliverOverDaysType) {
    initialValues.unDeliverOverDaysType = true
  }
  const searchParam = {
    // 搜索参数
    initialValues,
    formData: formData({ customerList, suppliersHandler }),
    advancedForm: advancedForm({ customerList, suppliersHandler }),
    onSearch: searchHandler,
  }
  const oprationColumn = [
    {
      title: '操作',
      width: '200px',
      render: (_, row) => renderOperation(row),
    },
  ]
  const confirmParams = {
    visible: confirmOrderVisible,
    hideHandler: hideConfirm,
    loading: getLoading('confirmOrder'),
    okHandler: (value) => {
      dispatchAction({ type: 'confirmOrder', payload: { ...value, formId: currentOrderId } })
    },
  }
  const printParams = {
    purchaseListInfo,
    visible: printPurchaseVisible,
    hideHandler: hidePrint,
    getLoading,
  }
  return (
    <div className="aek-layout">
      <div className="bread">
        <Breadcrumb />
      </div>
      <div className="content">
        <SearchFormFillter {...searchParam} />
        {searchSaveParams.materialsInfo ? <div className="aek-red">*在检索结果里，以下订单包含该物资。</div> : ''}
        <Table
          bordered
          rowKey="formId"
          loading={getLoading('orderList', 'searchOrder', 'pageChange')}
          columns={tableColumns.concat(oprationColumn)}
          pagination={getPagination(pageChange, pagination)}
          dataSource={orderList}
        />
        <ConfirmOrder {...confirmParams} />
        <PrintPurchase {...printParams} />
      </div>
    </div>
  )
}

CustomerOrder.propTypes = {
  children: PropTypes.node,
  customerOrder: PropTypes.object,
  loading: PropTypes.object,
  dispatch: PropTypes.func,
  location: PropTypes.object,
  routes: PropTypes.array,
}
export default connect(({ customerOrder, loading }) => ({ customerOrder, loading }))(CustomerOrder)
