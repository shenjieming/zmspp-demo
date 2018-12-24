import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Table, Input, Modal, Icon } from 'antd'
import Decimal from 'decimal.js-light'
import { getBasicFn, getTreeItem, segmentation, formatNum } from '../../../../utils'
import { orderFormColumns } from './data'
import ContentLayout from '../../../../components/ContentLayout'
import APanel from '../../../../components/APanel'
import ReceiptAddressCard from '../../receiptAddress/ReceiptAddressCard'
import ModalForm from '../../receiptAddress/ModalForm'
import ModalOrderForm from './ModalOrderForm'
import style from './style.less'

const propTypes = {
  orderConfirmation: PropTypes.object,
  loading: PropTypes.object,
  form: PropTypes.object,
  packageUnit: PropTypes.array,
  addressList: PropTypes.array,
}
function OrderConfirmation({ orderConfirmation, loading, addressList }) {
  const {
    addressArr,
    modalVisible,
    receiptId,
    changeArr,
    orderFormData,
    modalTableData,
    orderFormModalVisible,
    deleIdArr,
    receiptData,
    formId,
    orgIdArrLength,
    useIdArr,
    modalForm,
    modalType,
  } = orderConfirmation
  const { toAction, getLoading, dispatchUrl } = getBasicFn({
    namespace: 'orderConfirmation',
    loading,
  })
  const receiptAddressCardProps = {
    addressArr,
    receiptId,
    type: 'set',
    loading: getLoading('getAddressList'),
    editAddress(obj) {
      toAction('app/queryAddress')
      toAction({
        modalType: obj ? 'update' : 'create',
        modalVisible: true,
        modalForm: obj || {},
      })
    },
    setReceipt(data) {
      const receipt = {
        receiveName: data.receiptContactName,
        receivePhone: data.receiptContactPhone,
        receiveAddress: segmentation(
          [
            data.receiptMasterAddress
              .split(' ')
              .filter((_, idx) => idx > 2)
              .join(' '),
            data.receiptDetailAddress,
          ],
          ' ',
        ),
      }
      toAction({
        receiptId: data.receiptId,
        receiptData: receipt,
      })
    },
  }
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
        toAction({ editId: req.receiptId })
      } else {
        if (!addressArr.length) {
          req.receiptDefaultFlag = true
        }
        toAction(req, 'createAddress')
        toAction({ addIdArr: addressArr.map(itm => itm.receiptId) })
      }
    },
    onCancel() {
      toAction({ modalVisible: false })
    },
  }
  const modalOrderFormProps = {
    visible: orderFormModalVisible,
    tableData: modalTableData,
    dispatchUrl,
  }
  let [classNum, sumNum, sumMoney] = [0, 0, new Decimal(0)]
  const getAPanelArr = (arr) => {
    const retArr = []
    arr.forEach((item, index) => {
      const aPanelProps = {
        style: { marginTop: '16px' },
        title: (
          <div className={style.orderItemTitle}>
            <div>{item.supplierOrgName}</div>
            <div className="aek-text-help">
              {segmentation([item.supplierContactName, item.supplierContactPhone], ' - ')}
            </div>
          </div>
        ),
        key: index,
      }
      let [itemClassNum, itemSumNum, itemSumMoney] = [0, 0, new Decimal(0)]
      if (Array.isArray(item.items)) {
        const forArr = item.items.filter(({ pscId }) => !deleIdArr.includes(pscId))
        orderFormData[index].items = forArr.length ? forArr : false
        itemClassNum = forArr ? forArr.filter(({ disabled }) => !disabled).length : 0
        for (let idx = 0; idx < forArr.length; idx += 1) {
          const { materialsPrice, transformValue = 1, purchaseQty, pscId, disabled } = forArr[idx]
          const findItem = getTreeItem(changeArr, 'pscId', pscId)
          let newPurchaseQty = purchaseQty
          if (findItem && findItem.purchaseQty) {
            newPurchaseQty = findItem.purchaseQty
          }
          const materialsAmount = new Decimal(materialsPrice).times(newPurchaseQty).times(transformValue)
          if (!disabled) {
            itemSumNum += newPurchaseQty
            itemSumMoney = itemSumMoney.add(materialsAmount)
          }
          orderFormData[index].items[idx].materialsAmount = materialsAmount
          orderFormData[index].items[idx].purchaseQty = newPurchaseQty
        }
      }
      orderFormData[index].formQty = itemSumNum
      orderFormData[index].formAmount = itemSumMoney
      classNum += itemClassNum
      sumNum += itemSumNum
      sumMoney = sumMoney.add(itemSumMoney)
      if (orderFormData[index].items) {
        const tableProps = {
          pagination: false,
          dataSource: orderFormData[index].items,
          rowKey: 'pscId',
          bordered: true,
          key: index,
          rowClassName: ({ disabled }) => {
            if (disabled) {
              return 'aek-text-disable'
            }
            return undefined
          },
          columns: orderFormColumns({
            changeArr,
            changeItem(chgItemObj) {
              if (
                !getTreeItem(changeArr, 'pscId', chgItemObj.pscId, itm => ({ ...itm, ...chgItemObj }))
              ) {
                changeArr.push(chgItemObj)
              }
              toAction({ changeArr })
            },
            deleteItem(pscId) {
              let length = 0
              if (useIdArr.length) {
                length =
                  deleIdArr.filter(id => useIdArr.includes(id)).length + useIdArr.includes(pscId)
              } else {
                length = deleIdArr.length + 1
              }
              if (length === (useIdArr.length || orgIdArrLength)) {
                Modal.error({
                  title: '订单数据为空',
                  content: '点击确定返回手工采购',
                  okText: '确定',
                  onOk() {
                    dispatchUrl({
                      pathname: '/purchaseManage/handPurchase',
                    })
                  },
                })
              } else {
                deleIdArr.push(pscId)
                toAction({ deleIdArr })
              }
            },
          }),
        }
        retArr.push(
          <APanel {...aPanelProps}>
            <Table {...tableProps} />
            <br />
            <Input
              placeholder="备注："
              defaultValue={item.purchaseRemark}
              onChange={({ target: { value } }) => {
                orderFormData[index].purchaseRemark = value
              }}
            />
            <div className={style.orderItenInfo}>
              <div>合计品规：{itemClassNum}</div>
              <div>合计数量：{itemSumNum}</div>
              <div>合计金额：{formatNum(itemSumMoney)}</div>
            </div>
          </APanel>,
        )
      }
    })
    return retArr
  }
  const butDisabled = !Object.keys(receiptData).length
  const contentLayoutProps = {
    breadLeft: [{ name: 'Breadcrumb' }],
    content: [
      <div>
        <div className="aek-content-title">
          <div className="aek-title-left">选择收货地址</div>
          <div className="aek-title-right">
            <a
              onClick={() => {
                dispatchUrl({ pathname: '/purchaseManage/receiptAddress' })
              }}
            >
              管理收货地址
            </a>
          </div>
        </div>
        <ReceiptAddressCard {...receiptAddressCardProps} />
        <ModalForm {...modalProps} />
      </div>,
      <span>
        <div className="aek-content-title">
          <div className="aek-title-left">确认订单信息</div>
        </div>
        {getAPanelArr(orderFormData)}
        <ModalOrderForm {...modalOrderFormProps} />
      </span>,
    ],
    otherContent: (
      <span>
        <div style={{ height: 60 }} />
        <div className={`${style.bottomInfo} aek-shadow-top`}>
          <div>合计品规：<span className="aek-red">{classNum}</span></div>
          <div>合计数量：<span className="aek-red">{sumNum}</span></div>
          <div>合计金额：<span className="aek-red">{formatNum(sumMoney)}</span></div>
          <div
            className={butDisabled ? style.hover : undefined}
            onClick={() => {
              if (!butDisabled && orderFormData.length) {
                const orders = orderFormData.filter(({ items }) => items)
                const idArr = []
                orders.forEach(({ items }, index) => {
                  orders[index].items = items.map((item) => {
                    idArr.push(item.pscId)
                    return {
                      ...item,
                      packageUnitValue:
                        item.packageUnitValue || item.skuUnitValue || item.materialsUnit,
                      packageUnitText:
                        item.packageUnitText || item.skuUnitValue || item.materialsUnitText,
                    }
                  })
                })
                toAction({
                  data: { orders, ...receiptData },
                  dispatchUrl,
                  idArr,
                }, 'saveOrder')
              }
            }}
          >
            {butDisabled ? '提交（请先选择收货地址）' : '提交订单'}
            {getLoading('saveOrder', 'orderDetail') ? <Icon type="loading" style={{ marginLeft: 12 }} /> : null}
          </div>
          <div>
            {!formId ? (
              <a
                onClick={() => {
                  dispatchUrl({ pathname: '/purchaseManage/handPurchase' })
                }}
              >
                返回手动采购
              </a>
            ) : null}
          </div>
        </div>
      </span>
    ),
  }
  return <ContentLayout {...contentLayoutProps} />
}
OrderConfirmation.propTypes = propTypes
export default connect(
  ({ orderConfirmation, loading, app: { constants: { addressList } } }) => ({
    orderConfirmation,
    loading,
    addressList,
  }),
)(OrderConfirmation)
