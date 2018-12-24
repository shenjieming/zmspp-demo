import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import moment from 'moment'
import Decimal from 'decimal.js-light'
import { Row, Button, Table, Form, Input, Select, DatePicker, Spin, Modal, InputNumber } from 'antd'
import { cloneDeep, debounce, delay, isEmpty } from 'lodash'

import Breadcrumb from '../../../../components/Breadcrumb'
import APanel from '../../../../components/APanel'
import PlainForm from '../../../../components/PlainForm'
import LkcForm from '../../../../components/LkcForm'
import { getBasicFn, formatNum } from '../../../../utils'

import PrintPurchase from '../../customerOrder/printPurchaseList'
import PrintModal from '../../deliveryOrder/modal/printModal'
import RFIDModal from './RFIDModal'
import ConfirmModal from './ConfirmModal'
import { getDetailTopData, getFormData } from './data'
import styles from './index.less'
import BarcodeModal from '../../model'

const FormItem = Form.Item
const Option = Select.Option
const propTypes = {
  children: PropTypes.node,
  app: PropTypes.object,
  orderDelivery: PropTypes.object,
  loading: PropTypes.object,
  dispatch: PropTypes.func,
  routes: PropTypes.array,
  form: PropTypes.object,
}
class OrderDelivery extends React.Component {
  // 配送数量防抖（包含验证）
  deliverQtyChange = debounce(
    (value, row, formIndex, originalValue, deliveryQtyCanOverPurchaseQtyFlag) => {
      const { dispatchAction } = getBasicFn({
        namespace: 'orderDelivery',
      })
      const reg = /^([0-9][.0-9]*)?$/
      if ((!isNaN(value) && reg.test(String(value))) || value === '') {
        if (!this.isValidDeliveNum(value, row, formIndex)) {
          if (!deliveryQtyCanOverPurchaseQtyFlag) {
            Modal.error({
              content: '客户设置的发货数量不能大于采购数量，如果有疑问请与客户联系！',
              onOk: () => {
                dispatchAction({
                  type: 'updateMaterialItem',
                  payload: {
                    target: row,
                    prop: 'deliverQty',
                    value: Number(originalValue) || undefined,
                  },
                })
              },
            })
          } else {
            Modal.confirm({
              title: '您输入的物资出货数量大于客户采购数量。',
              content: '您确认需要按此数量出货吗？',
              onOk: () => {
                dispatchAction({ type: 'checkRfidNum', payload: { value, row } })
              },
              onCancel: () => {
                dispatchAction({
                  type: 'updateMaterialItem',
                  payload: {
                    target: row,
                    prop: 'deliverQty',
                    value: Number(originalValue) || undefined,
                  },
                })
                dispatchAction({
                  type: 'checkRfidNum',
                  payload: { value: Number(originalValue), row },
                })
              },
            })
          }
        } else {
          dispatchAction({ type: 'checkRfidNum', payload: { value, row } })
          dispatchAction({
            type: 'updateMaterialItem',
            payload: { target: row, prop: 'validDeliverQty', value },
          })
        }
      } else {
        dispatchAction({ type: 'updateState' })
      }
    },
    800,
  )
  // 注册证防抖
  certificateList = debounce((value, row) => {
    const { dispatchAction } = getBasicFn({
      namespace: 'orderDelivery',
    })
    dispatchAction({
      type: 'getCertificateList',
      payload: {
        keywords: value,
        itemBean: row,
      },
    })
  }, 300)
  isValidDeliveNum = (value, row, formIndex) => {
    const {
      orderDelivery: {
        orderBean: { data: formList },
      },
    } = this.props
    // 在当前orderBean中遍历，找到itemId相同的，将配送总数算出来
    const { waitDeliverQty, indexInSame } = row
    let deliveryingQty = new Decimal(0)
    formList[formIndex].items.forEach((item) => {
      if (item.pscId === row.pscId && item.indexInSame !== indexInSame) {
        deliveryingQty = deliveryingQty.plus(item.deliverQty ? Number(item.deliverQty) : 0)
      }
    })
    deliveryingQty = deliveryingQty.plus(Number(value))
    if (deliveryingQty.gt(waitDeliverQty)) {
      return false
    }
    return true
  }
  render() {
    const {
      orderDelivery,
      loading,
      app: {
        orgInfo: { accuracy, orgName },
        personalityConfig: {
          deliveryQtyCanOverPurchaseQtyFlag,
          displayPurchaseItemRemarkFlag,
          deliveryCanEnterRfidFlag,
          deliveryBarcodeShape,
        },
      },
      form: { getFieldDecorator, validateFieldsAndScroll, getFieldsValue, resetFields },
    } = this.props
    let barcodeInput = null
    const { dispatchAction, getLoading, dispatchUrl } = getBasicFn({
      namespace: 'orderDelivery',
      loading,
    })
    const {
      orderBean,
      deliveryDetail,
      deliveryCompanies,
      deliverType,
      rfidModalData,
      RFIDvisible,
      fullScreen,
      scanResult,
      printPurchaseVisible,
      printModalVisible,
      confirmVisible,
      confirmfunc,
      personalColumns,
      modalVisible, // 重复条码弹框visible
      barcodeList, // 列表
      personalMobile, // 操作人联系号码
    } = orderDelivery
    this.scanResult = scanResult
    const formList = orderBean.data
    let totalMoney = new Decimal(0)
    // 判断字段是否为只读
    const isReadOnly = (row, isQty) => {
      if (!isQty) {
        // 如果不是数字列，只要满足寄销 && 只能扫码输入，就是readonly的
        return orderBean.formType === 2 && !row.notBarcodeOnly
      }
      // 否则，还需满足未进行过扫码
      return orderBean.formType === 2 && !row.barcode && !row.notBarcodeOnly
    }
    // 判断是否为同一个批次
    const isSameBatch = (item, payload, formIndex) => {
      if (!payload.pscId) {
        return false
      }
      if (formIndex !== payload.formIndex) {
        return false
      }
      let isSame = true
      const compareArr = [
        'inviteNo',
        'sterilizationNo',
        'sterilizationDate',
        'invoiceNo',
        'invoiceDate',
        'barcode',
        'batchNo',
        'expiredDate',
        'trackCode',
      ]
      compareArr.forEach((key) => {
        if (item[key] !== payload[key]) {
          isSame = false
        }
      })
      return isSame
    }
    // 显示/隐藏打印采购单
    const showPurchasePrint = () => {
      dispatchAction({ payload: { printPurchaseVisible: true } })
    }
    const hidePurchasePrint = () => {
      dispatchAction({ payload: { printPurchaseVisible: false } })
    }
    // 显示/隐藏打印配送单
    const showDeliveryPrint = () => {
      dispatchAction({ payload: { printModalVisible: true } })
    }
    const hideDeliveryPrint = () => {
      dispatchAction({ payload: { printModalVisible: false } })
    }
    // 添加Rfid
    const addRFID = (row) => {
      dispatchAction({ payload: { rfidModalData: row, RFIDvisible: true } })
    }
    // 添加批次
    const addBatch = (row, formIndex) => {
      dispatchAction({ type: 'addBatch', payload: { pscId: row.pscId, formIndex } })
    }
    // 删除批次
    const deleteBatch = (row, index, formIndex) => {
      dispatchAction({
        type: 'deleteBatch',
        payload: { pscId: row.pscId, index, formIndex, indexInSame: row.indexInSame },
      })
    }
    // 选择配送方式
    const chooseDeliverType = (obj) => {
      const {
        target: { value },
      } = obj
      dispatchAction({ payload: { deliverType: value } })
      if (value === '2') {
        dispatchAction({
          type: 'getPersonalMobile',
        })
      }
    }
    // 获取保存参数
    const getSavePayload = (value, needValid) => {
      let allEmpty = true
      let deliverTotalQty = new Decimal(0)
      const deliveryCompany = value.deliverCompany
      if (deliveryCompany) {
        value.deliverCompany = deliveryCompany.label
        value.deliverCompanyCode = deliveryCompany.key
      }
      value.deliverType = Number(value.deliverType)
      let payload = {}
      payload = Object.assign(cloneDeep(orderBean), value) // value中获取配送信息加入orderBean
      // 筛选掉配送数量为0的
      payload.data.map((form) => {
        let items
        if (needValid) {
          items = form.items.filter(item => item.deliverQty)
        } else {
          items = form.items
        }
        if (items.length > 0) {
          allEmpty = false
        }
        items.forEach((item, index) => {
          item.purchaseItemId = item.itemId
          item.itemIndex = index + 1
          item.barcodeCode = item.barcode
          item.materialsAmount = new Decimal(item.materialsPrice)
            .times(item.deliverQty || 0)
            .toNumber()
          deliverTotalQty = deliverTotalQty.plus(item.deliverQty ? item.deliverQty : 0)
        })
        form.items = items
        return { ...form, items }
      })
      payload.formQty = deliverTotalQty.toNumber()
      payload.allEmpty = allEmpty
      payload.originalFormId = payload.formId
      payload.originalFormNo = payload.formNo
      payload.originalFormStatus = payload.formStatus
      if (payload.deliverTempFormId) {
        payload.formId = payload.deliverTempFormId
      } else {
        payload.formId = null
      }
      payload.groups = payload.data
      payload.formAmount = totalMoney
      return payload
    }
    // 暂存
    const tempSave = () => {
      const payload = getSavePayload(getFieldsValue(), false)
      dispatchAction({ type: 'tempSave', payload })
    }
    // 发货
    const deliverSubmit = (saveData) => {
      dispatchAction({ type: 'deliverSubmit', payload: saveData }).then(() => {
        dispatchAction({ payload: { deliveryDetail: { data: [] }, deliverType: '1' } })
        resetFields()
        dispatchAction({
          payload: {
            confirmVisible: true,
            confirmfunc: {
              onOk() {
                dispatchAction({
                  payload: {
                    confirmVisible: false,
                  },
                })
                // dispatchAction({
                //   type: 'queryDeliveryDetail',
                //   payload: {
                //     formId: orderBean.deliveryFormId,
                //     saleType: orderBean.saleType,
                //     distributeType: orderBean.distributeType,
                //   },
                // })
                showDeliveryPrint()
              },
              onCancel() {
                dispatchAction({
                  payload: {
                    confirmVisible: false,
                  },
                })
                history.go(-1)
              },
            },
          },
        })
        // Modal.confirm({
        //   content: '您已发货成功，请打印配送单随货送至医院',
        //   okText: '打印配送单',
        //   cancelText: '回到订单列表',
        //   onOk: () => {
        //     dispatchAction({
        //       type: 'queryDeliveryDetail',
        //       payload: { formId: orderBean.deliveryFormId },
        //     })
        //     showDeliveryPrint()
        //   },
        //   onCancel: () => {
        //     dispatchUrl({ pathname: '/orderManage/customerOrder' })
        //   },
        // })
      })
    }
    // 发货前检验
    const deliverCheck = () => {
      validateFieldsAndScroll({ force: true }, (errors, values) => {
        if (!errors) {
          const saveData = getSavePayload(values, true)
          if (saveData.allEmpty) {
            Modal.error({
              content: '当前未配送任何物资!',
            })
            return
          }
          Modal.confirm({
            title: '确认发货?',
            onOk: () => {
              deliverSubmit(saveData)
            },
          })
        } else {
          dispatchAction({ payload: { fullScreen: false } })
        }
      })
    }
    const getColumns = (formIndex) => {
      const columns = [
        {
          title: '序号',
          key: 'index',
          className: 'aek-text-center',
          fixed: 'left',
          width: 50,
          render: (value, row, index) => {
            let duplicateNum = 0
            if (index > 0) {
              const form = orderBean.data[formIndex]
              form.items.forEach((item, itemIndex) => {
                // 在当前对象之前的重复项
                if (item.indexInSame && itemIndex < index) {
                  duplicateNum += 1
                }
              })
            }
            const obj = {
              children: index + 1 - (duplicateNum || 0),
              props: {},
            }
            obj.props.rowSpan = row.sameNum ? row.sameNum + 1 : 1
            if (row.indexInSame) {
              obj.props.rowSpan = 0
            }
            return obj
          },
        },
        {
          title: '物资名称/规格',
          key: 'nameSpec',
          fixed: 'left',
          width: 200,
          render: (_, row) => {
            const obj = {
              children: (
                <div>
                  <div>{row.materialsName}</div>
                  <div>{row.materialsSku}</div>
                </div>
              ),
              props: {},
            }
            obj.props.rowSpan = row.sameNum ? row.sameNum + 1 : 1
            if (row.indexInSame) {
              obj.props.rowSpan = 0
            }
            return obj
          },
        },
        {
          title: '数量',
          key: 'quantity',
          fixed: 'left',
          width: 120,
          render: (_, row) => {
            const obj = {
              children: (
                <div style={{ wordBreak: 'keep-all' }}>
                  <div>
                    采购：{row.purchaseQty}
                    {row.skuUnitText}
                  </div>
                  <div>
                    已发：{row.deliveredQty}
                    {row.skuUnitText}
                  </div>
                </div>
              ),
              props: {},
            }
            obj.props.rowSpan = row.sameNum ? row.sameNum + 1 : 1
            if (row.indexInSame) {
              obj.props.rowSpan = 0
            }
            return obj
          },
        },
        {
          title: '注册证/省标编号',
          dataIndex: 'certificateNo',
          render: (text, row) => (
            <div style={{ minWidth: '300px' }}>
              <FormItem>
                {getFieldDecorator(`certificateNo_${row.itemId}_${row.indexInSame}`, {
                  initialValue: row.certificateNo,
                  rules: [
                    {
                      required: row.deliverQty,
                      whitespace: true,
                      message: '请输入注册证!',
                    },
                    {
                      max: 50,
                      message: '最多输入50个字符',
                    },
                  ],
                })(
                  <Select
                    showSearch={orderBean.orgManagementCertificate}
                    mode="combobox"
                    style={{ width: '100%' }}
                    notFoundContent={
                      getLoading('getCertificateList') ? <Spin size="small" /> : '无匹配结果'
                    }
                    onSearch={(value) => {
                      this.certificateList(value, row)
                    }}
                    onChange={(value) => {
                      dispatchAction({
                        type: 'updateMaterialItem',
                        payload: { target: row, prop: 'certificateNo', value },
                      })
                    }}
                  >
                    {row.certificateList
                      ? row.certificateList.map(item => <Option key={item}>{item}</Option>)
                      : ''}
                  </Select>,
                )}
              </FormItem>
              <div style={{ display: 'inline-block', marginTop: '4px', width: '100%' }}>
                <span style={{ display: 'inline-block', width: '20%' }}>省标:</span>
                <FormItem>
                  {getFieldDecorator(`inviteNo_${row.itemId}_${row.indexInSame}`, {
                    initialValue: row.inviteNo,
                    rules: [
                      {
                        max: 50,
                        message: '最多输入50个字符',
                      },
                    ],
                  })(
                    <Input
                      style={{ width: '80%' }}
                      onChange={(event) => {
                        dispatchAction({
                          type: 'updateMaterialItem',
                          payload: { target: row, prop: 'inviteNo', value: event.target.value },
                        })
                      }}
                    />,
                  )}
                </FormItem>
              </div>
            </div>
          ),
        },
        {
          title: '配送数量',
          dataIndex: 'deliverQty',
          width: 100,
          render: (text, row) => (
            <InputNumber
              min={0}
              value={row.deliverQty}
              precision={2}
              onChange={(value) => {
                if (value === row.deliverQty && value !== '') {
                  return
                }
                dispatchAction({
                  type: 'updateMaterialItem',
                  payload: {
                    target: row,
                    prop: 'deliverQty',
                    value: value === '' ? undefined : value,
                  },
                })
                this.deliverQtyChange(
                  value,
                  row,
                  formIndex,
                  row.validDeliverQty,
                  deliveryQtyCanOverPurchaseQtyFlag,
                )
              }}
            />
          ),
        },
        {
          title: '生产日期',
          dataIndex: 'produceDate',
          width: 120,
          render: (text, row) => {
            let content
            if (isSameBatch(row, scanResult, formIndex)) {
              content = (
                <span id="targetEle" tabIndex="-1">
                  <DatePicker
                    style={{ width: '100%' }}
                    value={row.produceDate && moment(row.produceDate)}
                    onChange={(value) => {
                      dispatchAction({
                        type: 'updateMaterialItem',
                        payload: {
                          target: row,
                          prop: 'produceDate',
                          value: value ? value.format('YYYY-MM-DD') : value,
                        },
                      })
                    }}
                  />
                </span>
              )
            } else {
              content = (
                <DatePicker
                  style={{ width: '100%' }}
                  value={row.produceDate && moment(row.produceDate)}
                  onChange={(value) => {
                    dispatchAction({
                      type: 'updateMaterialItem',
                      payload: {
                        target: row,
                        prop: 'produceDate',
                        value: value ? value.format('YYYY-MM-DD') : value,
                      },
                    })
                  }}
                />
              )
            }
            return content
          },
        },
        {
          title: '批次',
          dataIndex: 'batchNo',
          width: 100,
          render: (text, row) => (
            <FormItem>
              {getFieldDecorator(`batchNo_${row.itemId}_${row.indexInSame}`, {
                initialValue: row.batchNo,
                rules: [
                  {
                    max: 30,
                    message: '最多输入30位',
                  },
                ],
              })(
                <Input
                  onChange={(event) => {
                    dispatchAction({
                      type: 'updateMaterialItem',
                      payload: { target: row, prop: 'batchNo', value: event.target.value },
                    })
                  }}
                />,
              )}
            </FormItem>
          ),
        },
        {
          title: '有效期',
          dataIndex: 'expiredDate',
          width: 120,
          render: (text, row) => (
            <DatePicker
              style={{ width: '100%' }}
              value={row.expiredDate && moment(row.expiredDate)}
              onChange={(value) => {
                dispatchAction({
                  type: 'updateMaterialItem',
                  payload: {
                    target: row,
                    prop: 'expiredDate',
                    value: value ? value.format('YYYY-MM-DD') : value,
                  },
                })
              }}
            />
          ),
        },
        {
          title: '灭菌批号',
          dataIndex: 'sterilizationNo',
          width: 130,
          render: (text, row) => (
            <FormItem>
              {getFieldDecorator(`sterilizationNo_${row.itemId}_${row.indexInSame}`, {
                initialValue: row.sterilizationNo,
                rules: [
                  {
                    max: 30,
                    message: '最多输入30位',
                  },
                ],
              })(
                <Input
                  onChange={(event) => {
                    dispatchAction({
                      type: 'updateMaterialItem',
                      payload: { target: row, prop: 'sterilizationNo', value: event.target.value },
                    })
                  }}
                />,
              )}
            </FormItem>
          ),
        },
        {
          title: '灭菌效期',
          dataIndex: 'sterilizationDate',
          width: 120,
          render: (text, row) => (
            <DatePicker
              style={{ width: '100%' }}
              value={row.sterilizationDate && moment(row.sterilizationDate)}
              onChange={(value) => {
                dispatchAction({
                  type: 'updateMaterialItem',
                  payload: {
                    target: row,
                    prop: 'sterilizationDate',
                    value: value ? value.format('YYYY-MM-DD') : value,
                  },
                })
              }}
            />
          ),
        },
        {
          title: '跟踪码',
          dataIndex: 'trackCode',
          width: 120,
          render: (text, row) => (
            <FormItem>
              {getFieldDecorator(`trackCode_${row.itemId}_${row.indexInSame}`, {
                initialValue: row.trackCode,
                rules: [
                  {
                    max: 30,
                    message: '最多输入30位',
                  },
                ],
              })(
                <Input
                  readOnly={isReadOnly(row)}
                  onChange={(event) => {
                    dispatchAction({
                      type: 'updateMaterialItem',
                      payload: { target: row, prop: 'trackCode', value: event.target.value },
                    })
                  }}
                />,
              )}
            </FormItem>
          ),
        },
        {
          title: '发票号码',
          dataIndex: 'invoiceNo',
          width: 100,
          render: (text, row) => (
            <FormItem>
              {getFieldDecorator(`invoiceNo_${row.itemId}_${row.indexInSame}`, {
                initialValue: row.invoiceNo,
                rules: [
                  {
                    max: 30,
                    message: '最多输入30位',
                  },
                ],
              })(
                <Input
                  onChange={(event) => {
                    dispatchAction({
                      type: 'updateMaterialItem',
                      payload: { target: row, prop: 'invoiceNo', value: event.target.value },
                    })
                  }}
                />,
              )}
            </FormItem>
          ),
        },
        {
          title: '发票日期',
          dataIndex: 'invoiceDate',
          width: 120,
          render: (text, row) => (
            <DatePicker
              style={{ width: '100%' }}
              value={row.invoiceDate && moment(row.invoiceDate)}
              onChange={(value) => {
                dispatchAction({
                  type: 'updateMaterialItem',
                  payload: {
                    target: row,
                    prop: 'invoiceDate',
                    value: value ? value.format('YYYY-MM-DD') : value,
                  },
                })
              }}
            />
          ),
        },
        {
          title: '操作',
          key: 'opration',
          width: 100,
          fixed: 'right',
          render: (text, row, index) => (
            <div className="aek-text-center" style={{ wordBreak: 'keep-all' }}>
              {row.indexInSame ? (
                <a
                  className="aek-red"
                  onClick={() => {
                    Modal.confirm({
                      content: '确定要删除该批次?',
                      onOk: () => {
                        deleteBatch(row, index, formIndex)
                      },
                    })
                  }}
                >
                  删除批次
                </a>
              ) : (
                <a
                  onClick={() => {
                    addBatch(row, formIndex)
                  }}
                >
                  添加批次
                </a>
              )}
              {deliveryCanEnterRfidFlag ? (
                <div>
                  <a
                    disabled={!row.deliverQty}
                    onClick={() => {
                      if (!new Decimal(row.deliverQty).isInteger()) {
                        Modal.warning({ content: '当前配送数量为小数，无需输入RFID' })
                        return
                      }
                      addRFID(row)
                    }}
                  >
                    录入RFID
                  </a>
                  {row.rfids &&
                    row.rfids.length > 0 && <span className="aek-red">({row.rfids.length})</span>}
                </div>
              ) : (
                ''
              )}
            </div>
          ),
        },
      ]
      if (orderBean.formType === 2) {
        columns.splice(-3, 2)
      }
      if (displayPurchaseItemRemarkFlag) {
        columns.splice(3, 0, {
          title: '明细备注',
          key: 'remark',
          fixed: 'left',
          width: 120,
          render: (_, row) => {
            const obj = {
              children: <div style={{ wordBreak: 'keep-all' }}>{row.remark}</div>,
              props: {},
            }
            obj.props.rowSpan = row.sameNum ? row.sameNum + 1 : 1
            if (row.indexInSame) {
              obj.props.rowSpan = 0
            }
            return obj
          },
        })
      }
      return columns
    }
    const getScrollXY = () => {
      let standardX = 1820
      if (orderBean.formType === 2) {
        standardX -= 220
      }
      if (displayPurchaseItemRemarkFlag) {
        standardX += 170
      }
      if (fullScreen) {
        return { x: standardX, y: 600 }
      }
      return { x: standardX, y: 400 }
    }
    const materialsInfo = () => {
      const info = formList.map((ele, index) => (
        <Row key={index} style={{ marginTop: '10px' }}>
          <div>
            收货地址：{ele.receiveAddress}
            <span className="aek-fill-15" />
            {ele.receiveName}
            <span className="aek-fill-15" />
            {ele.receivePhone}
          </div>
          <Table
            bordered
            rowKey={record => index + record.pscId + record.indexInSame}
            columns={getColumns(index)}
            pagination={false}
            rowClassName={(record) => {
              if (isSameBatch(record, scanResult, index)) {
                return styles.currentRow
              }
              return ''
            }}
            size="small"
            dataSource={ele.items}
            scroll={getScrollXY()}
          />
        </Row>
      ))
      return (
        <Spin spinning={getLoading('analysisBarcode')}>
          <div
            className={styles.tableContainer}
            style={{
              maxHeight: fullScreen
                ? document.body.clientHeight - 190
                : document.body.clientHeight - 290,
              overflow: 'auto',
            }}
          >
            {info}
          </div>
        </Spin>
      )
    }
    // 此处计算已配送金额
    formList.forEach((form) => {
      form.items.forEach((item) => {
        const deliverQty = item.deliverQty || 0
        totalMoney = totalMoney.add(new Decimal(item.materialsPrice).times(deliverQty))
      })
    })
    const rfidParam = {
      visible: RFIDvisible,
      data: rfidModalData,
      hideHandler: () => {
        dispatchAction({ payload: { RFIDvisible: false } })
      },
    }
    const printPurchaseParams = {
      purchaseListInfo: orderBean,
      visible: printPurchaseVisible,
      hideHandler: hidePurchasePrint,
      getLoading,
    }
    const printDeliveryParams = {
      printModalVisible,
      formId: orderBean.deliveryFormId,
      saleType: orderBean.saleType,
      distributeType: orderBean.distributeType,
      onCancel: () => {
        hideDeliveryPrint()
        history.go(-1)
      },
      // accuracy,
      // orgName,
      // wrapData: deliveryDetail.data,
      // detailPageData: deliveryDetail,
      // printModalVisible,
      // dispatchAction,
      // getLoading,
      // deliveryBarcodeShape,
      // personalColumns,
    }
    const confirmParam = {
      confirmVisible,
      confirmfunc,
    }
    const modalPorps = {
      onCancel: () => {
        dispatchAction({
          payload: {
            modalVisible: false,
          },
        })
      },
      modalVisible,
      tableList: barcodeList,
      spin: getLoading('analysisBarcode'),
    }
    return (
      <div className="aek-layout">
        <div className="bread">
          <Breadcrumb />
        </div>
        <APanel title="确认基本信息">
          <Spin spinning={getLoading('getOrderDetail', 'fetchDeliveryCompany', 'getTempInfo')}>
            <div className={styles.deliveryInfo}>
              <PlainForm size={3} data={getDetailTopData(orderBean)} />
              <LkcForm
                getFieldDecorator={getFieldDecorator}
                formData={getFormData({
                  chooseDeliverType,
                  deliverType,
                  deliveryDetail,
                  deliveryCompanies,
                  personalMobile,
                })}
              />
            </div>
          </Spin>
        </APanel>
        <APanel title={'发货明细'}>
          <Spin spinning={getLoading('getOrderDetail', 'fetchDeliveryCompany', 'getTempInfo')}>
            <div className={`${styles.shipDetail} ${fullScreen ? 'aek-fullScreen' : ''}`}>
              <div className="aek-pb10">
                <Input
                  className="aek-barcode"
                  ref={(input) => {
                    barcodeInput = input
                  }}
                  disabled={getLoading('analysisBarcode')}
                  onPressEnter={(event) => {
                    const value = event.target.value
                    const input = barcodeInput.refs.input
                    dispatchAction({
                      type: 'analysisBarcode',
                      payload: {
                        barcode: value,
                        barcodeSupplierOrgId: orderBean.barcodeSupplierOrgId,
                        barcodeCustomerOrgId: orderBean.barcodeCustomerOrgId,
                        orgManagementCertificate: orderBean.orgManagementCertificate,
                      },
                    })
                      .then(() => {
                        const target = document.querySelector('#targetEle')
                        if (target) {
                          target.focus()
                        }
                        input.value = ''
                        input.focus()
                      })
                      .then(() => {
                        delay(() => {
                          dispatchAction({ type: 'updateState', payload: { scanResult: {} } })
                        }, 1000)
                      })
                      .then(() => {
                        const allFull = orderDelivery.allFull
                        const extraItem = this.scanResult
                        if (allFull && !isEmpty(extraItem)) {
                          if (!deliveryQtyCanOverPurchaseQtyFlag) {
                            Modal.error({
                              content:
                                '客户设置的发货数量不能大于采购数量，如果有疑问请与客户联系！',
                            })
                          } else {
                            Modal.confirm({
                              title: '当前列表中该物资已经全部配送完毕',
                              content: '确定继续进行配送吗?',
                              onOk: () => {
                                dispatchAction({
                                  type: 'forceAdd',
                                  payload: { ...extraItem },
                                }).then((item) => {
                                  dispatchAction({
                                    type: 'checkRfidNum',
                                    payload: { value: item.deliverQty, row: item },
                                  })
                                })
                                delay(() => {
                                  dispatchAction({
                                    type: 'updateState',
                                    payload: { scanResult: {} },
                                  })
                                }, 1000)
                              },
                            })
                          }
                        }
                      })
                  }}
                />
                <Button
                  onClick={() => {
                    dispatchAction({ payload: { fullScreen: !orderDelivery.fullScreen } })
                  }}
                  style={{ float: 'right' }}
                >
                  {fullScreen ? '取消全屏' : '全屏操作'}
                </Button>
                <Button
                  onClick={() => {
                    showPurchasePrint()
                  }}
                  style={{ float: 'right', marginRight: '20px' }}
                >
                  打印采购单
                </Button>
              </div>
              {materialsInfo()}
              <div style={{ textAlign: 'right' }} className="aek-ptb15">
                配送金额共计：
                <span className="aek-red aek-font-large aek-pl10">{formatNum(totalMoney)}</span>
              </div>
              <div className="bottomBtn">
                <Button onClick={tempSave} loading={getLoading('tempSave')}>
                  暂存
                </Button>
                <Button
                  onClick={() => {
                    Modal.confirm({
                      title: '确定重置？',
                      content: '重置操作将会清除发货明细中的所有内容!',
                      onOk: () => {
                        dispatchAction({ type: 'resetForm' })
                      },
                    })
                  }}
                >
                  重置
                </Button>
                <Button onClick={deliverCheck} type="primary" loading={getLoading('deliverSubmit')}>
                  发货
                </Button>
              </div>
            </div>
          </Spin>
        </APanel>
        {RFIDvisible && <RFIDModal {...rfidParam} />}
        <PrintPurchase {...printPurchaseParams} />
        {printModalVisible && <PrintModal {...printDeliveryParams} />}
        <ConfirmModal {...confirmParam} />
        <BarcodeModal {...modalPorps} />
      </div>
    )
  }
}

OrderDelivery.propTypes = propTypes
export default connect(({ orderDelivery, loading, app }) => ({ orderDelivery, loading, app }))(
  Form.create()(OrderDelivery),
)
