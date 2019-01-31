import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Table, Button, Modal, message } from 'antd'
import { cloneDeep, concat } from 'lodash'
import { getBasicFn, addRowspanField } from '../../../../utils/index'
import { genColumns, getDetailTopData, getDetailBottomData } from './data'
import PlainForm from '../../../../components/PlainForm'
import Breadcrumb from '../../../../components/Breadcrumb'
import PrintModal from '../modal/printModal'
import BatchAddInviteModal from '../modal/batchAddInviteModal'
import APanel from '../../../../components/APanel'
import style from './index.less'
import TabPrint from '../../../shared/tabPrint'

const { confirm } = Modal
const namespace = 'deliveryDetail'
const propTypes = {
  deliveryDetail: PropTypes.object,
  loading: PropTypes.object,
  app: PropTypes.object,
}
const DeliveryDetail = ({
  deliveryDetail,
  loading,
  app: {
    orgInfo: { accuracy },
    personalityConfig: { deliveryCanCancelFlag },
  },
}) => {
  const { dispatchAction, getLoading, dispatchUrl } = getBasicFn({ namespace, loading })
  const {
    formId,
    detailPageData,
    wrapData,
    invoiceUpdateList,
    printModalVisible,
    batchAddInviteVisible,

    tabPrintModalVisible, // 标签打印
    tabPrintType,
    tabPrintData, // 标签打印数据
    tabPrintPagination, // 标签打印分页
  } = deliveryDetail
  const { formType, formStatus } = detailPageData
  const handleInvoice = () => {
    confirm({
      title: '补录发票信息以后,医院将会查看这些发票信息。',
      content: (
        <div>
          <p style={{ marginTop: 15 }}>客户名称：{detailPageData.customerOrgName}</p>
          <p style={{ marginTop: 15 }}>配送单号：{detailPageData.formNo}</p>
          <p style={{ marginTop: 15 }}>请仔细核对！</p>
        </div>
      ),
      width: 500,
      onOk() {
        dispatchAction({
          type: 'updateInvoice',
        })
      },
    })
  }
  const printDeliverOrder = () => {
    dispatchAction({
      payload: { printModalVisible: true },
    })
    dispatchAction({
      type: 'getTableColumns',
      payload: {
        orgId: detailPageData.barcodeCustomerOrgId,
      },
    })
  }
  const voidDelivery = () => {
    if (deliveryCanCancelFlag) {
      confirm({
        content: (
          <div>
            <p className="aek-text-disable">作废当前配送单以后：</p>
            <p>1、对应采购单中已发货数量会被还原。</p>
            <p>2、医院无法扫描被作废的配货单入库。</p>
            <p>客户名称：{detailPageData.customerOrgName}</p>
            <p>配送单号：{detailPageData.formNo}</p>
            <p style={{ marginTop: 15 }}>你确认要作废这张配送单吗？</p>
          </div>
        ),
        onOk() {
          dispatchAction({
            type: 'voidDelivery',
          }).then(() => {
            dispatchUrl({ pathname: '/orderManage/deliveryOrder' })
          })
        },
      })
    } else {
      confirm({
        content: (
          <div>
            <p>该用户不允许作废配送单，如果配送单有误，请联系客户进行处理!</p>
          </div>
        ),
      })
    }
  }
  const printModalParam = {
    printModalVisible,
    formId: detailPageData.formId,
    saleType: detailPageData.saleType,
    distributeType: detailPageData.distributeType,
    onCancel() {
      dispatchAction({
        payload: {
          printModalVisible: false,
        },
      })
    },
    // accuracy,
    // wrapData: detailPageDataCopy.data || [],
    // detailPageData: detailPageDataCopy,
    // dispatchAction,
    // getLoading,
    // orgName,
    // deliveryBarcodeShape,
    // personalColumns,
    // printDetail,
  }
  const batchAddInviteParams = {
    visible: batchAddInviteVisible,
    onCancel: () => {
      dispatchAction({ type: 'updateState', payload: { batchAddInviteVisible: false } })
    },
    onOk: (values) => {
      dispatchAction({ type: 'batchAddInvite', payload: values })
    },
  }


  // 打印标签
  const tabPrintProps = {
    onCancel() {
      dispatchAction({
        payload: {
          tabPrintModalVisible: false,
        },
      })
    },
    visible: tabPrintModalVisible,
    printData: tabPrintData,
    pagination: tabPrintPagination,
    pageChange(current, pageSize) {
      let arr = []
      for (let i = 0; i < wrapData.length; i += 1) {
        if (wrapData[i].selectedRowKeys && wrapData[i].selectedRowKeys.length) {
          arr = concat(arr, wrapData[i].selectedRows)
        }
      }
      dispatchAction({
        type: 'getTabPrintData',
        payload: {
          formId,
          items: arr,
          current,
          pageSize,
        },
      })
    }, // 翻页
    handleChange(e) {
      const val = e.target.value
      dispatchAction({
        payload: {
          tabPrintType: Number(val),
        },
      })
    }, // 单选框改变
    printType: tabPrintType,
    loading: getLoading('getTabPrintData'),
  }

  return (
    <div className="aek-layout">
      <div className="bread">
        <Breadcrumb />
      </div>
      <APanel title="基本信息">
        <div className={style.msgBase}>
          <PlainForm size={3} data={getDetailTopData(detailPageData)} />
        </div>
        <div>
          <PlainForm size={3} data={getDetailBottomData(detailPageData, dispatchUrl)} />
        </div>
      </APanel>
      <APanel
        title="物资信息"
        extra={
          (
            <div>
              {formStatus !== 4 && <Button
                onClick={() => {
                  let arr = []
                  for (let i = 0; i < wrapData.length; i += 1) {
                    if (wrapData[i].selectedRowKeys && wrapData[i].selectedRowKeys.length) {
                      arr = concat(arr, wrapData[i].selectedRows)
                    }
                  }
                  if (!arr.length) {
                    message.error('请先勾选需要打印的明细')
                    return
                  }

                  /** 判断10000条禁止打印 */

                  let all = 0
                  arr.forEach((item) => {
                    all += item.deliverQty
                  })
                  if (all > 10000 && arr.length > 1) {
                    message.error('发货数量已经大于一万条，请减少勾选数量')
                    return
                  }


                  dispatchAction({
                    payload: {
                      tabPrintModalVisible: true,
                    },
                  })
                  dispatchAction({
                    type: 'getTabPrintData',
                    payload: {
                      formId,
                      items: arr,
                      current: 1,
                      pageSize: 112,
                    },
                  })
                }}
                className="aek-mr10"
              >
            打印标签
              </Button>}
              <Button
                onClick={() => {
                  dispatchAction({ type: 'updateState', payload: { batchAddInviteVisible: true } })
                }}
              >
            批量录入发票
              </Button>
            </div>
          )

        }
      >
        {wrapData.map((item, idx) => {
          const tableParam = {
            loading: getLoading('queryDeliveryDetail', 'updateInvoice'),
            columns: genColumns({
              accuracy,
              formType,
              invoiceChange(val, record, key) {
                record[key] = val
                const result = [...invoiceUpdateList].filter(
                  items => record.itemId !== items.itemId,
                )
                result.push(record)
                dispatchAction({
                  payload: {
                    invoiceUpdateList: result,
                  },
                })
              },
            }),
            bordered: true,
            footer: () => (
              <span>
                收货地址：{item.receiveAddress} {item.receiveDeptName} {item.receiveName}{' '}
                {item.receivePhone}
              </span>
            ),
            dataSource: addRowspanField(item.items, 'materialsName', 'materialsSku', 'rowSpan'),
            pagination: false,
            rowKey: 'itemId',
            scroll: { x: 1200 },
            style: { marginBottom: 12 },
            rowSelection: {
              selectedRowKeys: item.selectedRowKeys,
              onChange(keys, rows) {
                const data = cloneDeep(wrapData)
                data[idx].selectedRowKeys = keys
                data[idx].selectedRows = rows
                dispatchAction({
                  payload: {
                    wrapData: data,
                  },
                })
              },
            },
          }
          return <Table key={idx} {...tableParam} />
        })}
        <div
          style={{
            height: 40,
            marginBottom: 12,
          }}
        >
          <div style={{ float: 'right' }}>
            {Number(formType) === 1 && (
              <Button style={{ marginRight: 15 }} onClick={handleInvoice} type="primary">
                确认开票
              </Button>
            )}
            <Button style={{ marginRight: 15 }} onClick={printDeliverOrder}>
              打印配送单
            </Button>
            {Number(formStatus) < 3 && (
              <Button style={{ marginRight: 15 }} onClick={voidDelivery}>
                作废配送单
              </Button>
            )}
          </div>
        </div>
      </APanel>
      {printModalVisible && <PrintModal {...printModalParam} />}
      <BatchAddInviteModal {...batchAddInviteParams} />

      {/* 打印标签 */}
      <TabPrint {...tabPrintProps} />
    </div>
  )
}

DeliveryDetail.propTypes = propTypes
export default connect(({ deliveryDetail, loading, app }) => ({ deliveryDetail, loading, app }))(
  DeliveryDetail,
)
