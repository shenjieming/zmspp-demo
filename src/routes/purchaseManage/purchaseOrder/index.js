import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Table, Dropdown, Menu, Modal } from 'antd'
import { Link } from 'dva/router'
import { debounce, cloneDeep } from 'lodash'

import Breadcrumb from '../../../components/Breadcrumb'
import SearchFormFillter from '../../../components/SearchFormFilter'
import { getBasicFn, getPagination } from '../../../utils/index'

import { formData, advancedForm, tableColumns } from './props'

const namespace = 'purchaseOrder'
const confirm = Modal.confirm
const PurchaseOrder = ({ purchaseOrder, loading, routes }) => {
  const { dispatchAction, getLoading, dispatchUrl } = getBasicFn({ namespace, loading })
  const { orderList, supplierList, searchSaveParams, pagination } = purchaseOrder
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
    param.supplierOrgId = param.supplierOrgId && param.supplierOrgId.key
    param.formStatus = param.formStatus && Number(param.formStatus)
    param.urgentFlag = param.urgentFlag && Number(param.urgentFlag)
    param.materialsInfo = param.materialsInfo && param.materialsInfo.trim()
    param.purchaseTime = param.purchaseTime && formatDate(param.purchaseTime)
    dispatchAction({ type: 'searchOrder', payload: { ...param } }).then(() => {
      dispatchAction({ payload: { searchSaveParams: value } })
    })
  }
  // 供应商列表
  const suppliers = (value) => {
    if (value.trim()) {
      dispatchAction({
        type: 'supplierList',
        payload: { keywords: value },
      })
    }
  }
  // 延迟执行
  const suppliersHandler = debounce(suppliers, 300)
  // 催单
  const reminder = (orderId) => {
    dispatchAction({ type: 'remind', payload: { formId: orderId } })
  }
  // 再来一单
  const purchaseAgain = (formId) => {
    dispatchUrl({
      pathname: '/purchaseManage/handPurchase/orderConfirmation',
      query: { formId },
    })
  }
  // 作废订单
  const voidOrder = (orderId) => {
    confirm({
      // 特殊需求，将确认取消做反
      title: '订单作废之后，供应商将不再继续发货，是否确定作废？',
      width: 500,
      okText: '取消',
      cancelText: '确定',
      onCancel() {
        dispatchAction({ type: 'updateOrderStatus', payload: { formId: orderId, formStatus: 6 } })
      },
    })
  }
  // 终止订单
  const terminateOrder = (orderId) => {
    confirm({
      // 特殊需求，将确认取消做反
      title: '订单终止后，该订单剩余未配送物资供应商将不再发货，是否确定终止订单？',
      content: <div className="aek-red ">请您仔细核对一下此订单未配送的剩余物资！</div>,
      width: 500,
      okText: '取消',
      cancelText: '确定',
      onCancel() {
        dispatchAction({ type: 'updateOrderStatus', payload: { formId: orderId, formStatus: 5 } })
      },
    })
  }
  // 根据不同的状态，呈现不同的操作栏
  const renderOperation = (row) => {
    const status = Number(row.formStatus)
    const orderId = row.formId
    const appraiseFlag = row.formAppraiseStatus
    const voidMenu = (
      <Menu
        onClick={() => {
          voidOrder(orderId)
        }}
      >
        <Menu.Item key="1">作废订单</Menu.Item>
      </Menu>
    )
    const terminateMenu = (
      <Menu
        onClick={() => {
          terminateOrder(orderId)
        }}
      >
        <Menu.Item key="1">终止订单</Menu.Item>
      </Menu>
    )
    let operation
    if (status === 1) {
      operation = (
        <div>
          <a
            onClick={() => {
              reminder(orderId)
            }}
          >
            催单
          </a>
          <span className="aek-fill-15" />
          <Dropdown overlay={voidMenu} trigger={['click']}>
            <a>更多</a>
          </Dropdown>
        </div>
      )
      return operation
    } else if (status === 2) {
      operation = (
        <div>
          <a
            onClick={() => {
              reminder(orderId)
            }}
          >
            催单
          </a>
          <span className="aek-fill-15" />
          <Dropdown overlay={terminateMenu} trigger={['click']}>
            <a>更多</a>
          </Dropdown>
        </div>
      )
      return operation
    } else if (status === 3 || status === 6) {
      operation = (
        <div>
          {row.saleType === 1 ? (
            <a
              className="aek-link"
              onClick={() => {
                purchaseAgain(row.formId)
              }}
            >
              再次采购
            </a>
          ) : (
            ''
          )}
        </div>
      )
      return operation
    }
    if (appraiseFlag) {
      operation = (
        <div>
          {row.saleType === 1 ? (
            <a
              className="aek-link"
              onClick={() => {
                purchaseAgain(row.formId)
              }}
            >
              再次采购
            </a>
          ) : (
            ''
          )}
        </div>
      )
    } else {
      operation = (
        <div>
          {row.canAppraiseFlag ? (
            <span>
              <Link className="aek-link" to={`/purchaseManage/purchaseOrder/rate/${orderId}`}>
                评价
              </Link>
              <span className="aek-fill-15" />
            </span>
          ) : (
            ''
          )}
          {row.saleType === 1 ? (
            <a
              className="aek-link"
              onClick={() => {
                purchaseAgain(row.formId)
              }}
            >
              再次采购
            </a>
          ) : (
            ''
          )}
        </div>
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
    formData: formData({ supplierList, suppliersHandler }),
    advancedForm: advancedForm({ supplierList, suppliersHandler }),
    onSearch: searchHandler,
  }
  const oprationColumn = [
    {
      title: '操作',
      width: '200px',
      render: (_, row) => renderOperation(row),
    },
  ]
  return (
    <div className="aek-layout">
      <div className="bread">
        <Breadcrumb routes={routes} />
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
      </div>
    </div>
  )
}

PurchaseOrder.propTypes = {
  children: PropTypes.node,
  purchaseOrder: PropTypes.object,
  supplierOrgId: PropTypes.object,
  loading: PropTypes.object,
  dispatch: PropTypes.func,
  routes: PropTypes.array,
}
export default connect(({ purchaseOrder, loading }) => ({ purchaseOrder, loading }))(PurchaseOrder)
