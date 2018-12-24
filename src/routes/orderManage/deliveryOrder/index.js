import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Table, Modal, message, Spin } from 'antd'
import { debounce, cloneDeep } from 'lodash'
import { getBasicFn, getPagination } from '../../../utils'
import SearchFormFilter from '../../../components/SearchFormFilter'
import Breadcrumb from '../../../components/Breadcrumb'
import { formData, advancedForm, genColumns } from './data'
import PrintModal from './modal/printModal'
import AgainDeliver from './modal/againDeliver'
import ChageLogist from './modal/changeLogistInfo'


const namespace = 'deliveryOrder'
const propTypes = {
  printModalVisible: PropTypes.bool,
  wrapData: PropTypes.array,
  detailPageData: PropTypes.object,
  deliveryOrder: PropTypes.object,
  loading: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func,
}
const DeliveryOrder = ({
  deliveryOrder,
  loading,
  // app: {
  //   orgInfo: { orgName },
  //   personalityConfig: { deliveryBarcodeShape },
  // },
  // dispatch,
}) => {
  const { dispatchAction, getLoading } = getBasicFn({ namespace, loading })
  const {
    searchParam,
    printModalVisible,
    // wrapData,
    // detailPageData,
    pagination,
    deliveryOrderList,
    customerOPList,
    personalColumns, // 配送单个性化列表

    againDeliverVisible, // 再次发货弹框
    againDeliverDetail, // 再次发货详情


    logistDetailVisible, // 物流信息弹框
    logistDetail, // 物流详情
    deliveryCompanies, // 物流公司列表
    currentForm,
    // personalColumns, // 配送单个性化列表
  } = deliveryOrder

  const onSearchListDelay = debounce((keywords) => {
    if (keywords) {
      dispatchAction({
        type: 'queryCustomerOPList',
        payload: { keywords },
      })
    }
  }, 500)
  const searchParams = {
    // 搜索参数
    initialValues: searchParam,
    formData: formData({ customerOPList, onSearchListDelay }),
    advancedForm: advancedForm({ customerOPList, onSearchListDelay }),
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
    loading: getLoading('queryDeliveryList', 'mountOnOffStatus'),
    columns: genColumns({
      // printDeliverOrder(record) {
      //   const { formId, saleType, distributeType } = record
      //   dispatchAction({
      //     type: 'queryDeliveryDetail',
      //     payload: { formId, saleType, distributeType },
      //   }).then((content) => {
      //     dispatch({
      //       type: 'app/getPersonalityConfig',
      //       payload: {
      //         orgId: content.barcodeCustomerOrgId,
      //       },
      //     }).then(({ deliveryPrintDynamicConfigFlag }) => {
      //       // 获取个性化打印表头
      //       if (deliveryPrintDynamicConfigFlag) {
      //         dispatchAction({
      //           type: 'getTableColumns',
      //           payload: {
      //             orgId: content.barcodeCustomerOrgId,
      //           },
      //         })
      //       } else {
      //         dispatchAction({
      //           type: 'updateState',
      //           payload: {
      //             personalColumns: [],
      //           },
      //         })
      //       }
      //     })
      //   })
      // },
      printDeliverOrder(row) {
        dispatchAction({
          type: 'updateState',
          payload: {
            printModalVisible: true,
            currentForm: row,
          },
        })
      },
      againDeliver(formId, formType) {
        /**
         * @description 再次发货 判断时候是跟台发货
         */
        if (Number(formType) === 3) {
          dispatchAction(routerRedux.push(`/orderManage/ship${formId ? `?formId=${formId}` : ''}`))
        } else {
          dispatchAction({
            type: 'againDeliver',
            payload: {
              formId,
            },
          }).then((data) => {
            const { remindStatus, originalFormId, formId: id } = data
            const error = (title = '', content = '') => {
              Modal.error({
                title,
                content,
              })
            }
            switch (remindStatus) {
              case 1:
                error('客户订单已配送完结')
                break
              case 2:
                error('客户订单已作废')
                break
              case 3:
                error('客户订单已终止')
                break
              case 6:
                dispatchAction(routerRedux.push(`/orderManage/customerOrder/delivery/${originalFormId}${id ? `?formId=${id}` : ''}`))
                break
              default:
                dispatchAction({
                  payload: {
                    againDeliverVisible: true,
                  },
                })
                break
            }
          })
        }
      },
      changeLogisInfo(data) {
        dispatchAction({
          payload: {
            logistDetailVisible: true,
          },
        })
        dispatchAction({
          type: 'getLogistInfo',
          payload: data,
        })
      },
    }),
    dataSource: deliveryOrderList,
    pagination: getPagination((current, pageSize) => {
      dispatchAction({
        type: 'queryDeliveryList',
        payload: { current, pageSize },
      })
    }, pagination),
    scroll: { x: 1100 },
    rowKey: 'formId',
  }
  const printModalParam = {
    printModalVisible,
    formId: currentForm.formId,
    saleType: currentForm.saleType,
    distributeType: currentForm.distributeType,
    onCancel() {
      dispatchAction({
        payload: {
          printModalVisible: false,
        },
      })
    },
    // cancelDefault() {
    //   dispatchAction({
    //     payload: {
    //       wrapData: [],
    //       detailPageData: {},
    //     },
    //   })
    // },
    // orgName,
    // dispatchAction,
    // getLoading,
    // printModalVisible,
    // wrapData,
    // detailPageData,
    // personalColumns,
    // deliveryBarcodeShape,
  }
  // 再次发货
  const againProps = {
    visible: againDeliverVisible,
    onOk() {
      dispatchAction(routerRedux.push(`/orderManage/customerOrder/delivery/${againDeliverDetail.originalFormId}${againDeliverDetail.formId ?
        `?formId=${againDeliverDetail.formId}` :
        ''}`,
      ))
    },
    onCancel() {
      dispatchAction({
        payload: {
          againDeliverVisible: false,
        },
      })
    },
    detail: againDeliverDetail,
    loading: getLoading('againDeliver'),
  }

  const changeProps = {
    visible: logistDetailVisible,
    loading: getLoading('getLogistInfo', 'saveLogistInfo'),
    onOk(data) {
      const reqData = cloneDeep(data)
      if (reqData && reqData.deliverCompany) {
        reqData.deliverCompany = data.deliverCompany.label
        reqData.deliverCompanyCode = data.deliverCompany.key
      }
      dispatchAction({
        type: 'saveLogistInfo',
        payload: {
          ...reqData,
          formId: logistDetail.formId,
        },
      }).then(() => {
        message.success('操作成功')
        dispatchAction({
          payload: {
            logistDetailVisible: false,
            logistDetail: {},
          },
        })
        dispatchAction({
          type: 'queryDeliveryList',
        })
      })
    },
    onCancel() {
      dispatchAction({
        payload: {
          logistDetailVisible: false,
        },
      })
    },
    handleChange(e) { // 单选框切换
      const value = e.target.value
      dispatchAction({
        payload: {
          logistDetail: {
            ...logistDetail,
            deliverType: Number(value),
          },
        },
      })
    },
    detail: logistDetail,
    deliveryCompanies, // 物流公司
  }
  return (
    <div className="aek-layout">
      <div className="bread">
        <Breadcrumb />
      </div>
      <div className="content">
        <Spin spinning={getLoading('againDeliver')}>
          <SearchFormFilter {...searchParams} />
          <Table {...tableParam} />
        </Spin>
      </div>
      {/* // 再次发货 */}
      <AgainDeliver {...againProps} />
      {/* 修改物流信息 */}
      <ChageLogist {...changeProps} />
      {printModalVisible && <PrintModal {...printModalParam} />}
    </div>
  )
}

DeliveryOrder.propTypes = propTypes
export default connect(({ deliveryOrder, loading }) => ({
  deliveryOrder,
  loading,
}))(DeliveryOrder)
