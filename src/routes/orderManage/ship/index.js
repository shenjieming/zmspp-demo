import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { get, isPlainObject, delay, debounce, some, pick, isEmpty } from 'lodash'
import classnames from 'classnames'
import { connect } from 'dva'
import {
  Form,
  Row,
  Col,
  Select,
  Input,
  Table,
  Button,
  DatePicker,
  Tooltip,
  Spin,
  InputNumber,
  Modal,
  message,
} from 'antd'
import Decimal from 'decimal.js-light'
import { Breadcrumb, APanel } from '../../../components'
import { getBasicFn, formatNum } from '../../../utils'
import { COMMON_REDUCER } from '../../../utils/constant'
import BarcodeModal from '../model'
import {
  CERTIFICATE_NO,
  INVITE_NO,
  BATCH_NO,
  DELIVER_QTY,
  PRODUCE_DATE,
  EXPIRED_DATE,
  STERILIZATION_NO,
  STERILIZATION_DATE,
  TRACK_CODE,
  MATERIALS_NAME,
  MATERIALS_SKU,
  CUSTOMER_ORG_ID,
  RECEIVE_DEPT_NAME,
  RECEIVE_NAME,
  RECEIVE_PHONE,
  DELIVERY_REMARK,
} from './data'
import PrintModal from '../deliveryOrder/modal/printModal'
import Styles from './index.less'

const restFields = [RECEIVE_NAME, RECEIVE_PHONE, DELIVERY_REMARK]

const FormItem = Form.Item
const Option = Select.Option

const namespace = 'ship'

const propTypes = {
  loading: PropTypes.object.isRequired,
  userRealName: PropTypes.string.isRequired,
  form: PropTypes.object.isRequired,
  accuracy: PropTypes.number.isRequired,
  dispatch: PropTypes.func.isRequired,
}

const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
}

let barcodeInput = null

// reducers
const UPDATE_ITEM_DETAIL = 'updateItemDetail'

// barocodeCode
const BARCODE_CODE = 'barcodeCode'

const listDebounce = debounce((callback) => {
  callback()
}, 400)
class Ship extends React.Component {
  // 查询注册证防抖
  handleSearchCertificate = debounce((keywords, idx) => {
    const { dispatch, [namespace]: state } = this.props
    const { customerData } = state
    if (customerData) {
      const customerOrgId = customerData.key
      dispatch({
        type: `${namespace}/getCertificate`,
        payload: {
          keywords,
          customerOrgId,
          idx,
          orgManagementCertificate: customerData.orgManagementCertificate,
        },
      })
    } else {
      message.error('请先选择客户')
    }
  }, 400)

  render() {
    const props = this.props
    const { dispatchAction, getLoading } = getBasicFn({ namespace, loading: props.loading })
    const state = props[namespace]
    const selfOrgId = props.orgId
    const selfOrgName = props.orgName
    // const deliveryBarcodeShape = props.deliveryBarcodeShape
    const {
      getFieldDecorator,
      setFieldsValue,
      validateFieldsAndScroll,
      getFieldsValue,
      getFieldValue,
      resetFields,
    } = props.form

    const {
      items,
      customer,
      customerData,
      curBarcode,
      isFullScreen,
      certificateNos,
      // personalColumns,
      printDetails,
      modalVisible,
      barcodeList,
      tempFormId,
      distribute: distributeInfo,

      againTempData, // 再次发货获取 总代商 客户名称 接收科室
    } = state

    const isSetCustomer = !!customer

    let totalMoney = new Decimal(0)

    items.forEach((x) => {
      const price = new Decimal(get(x, 'materialsPrice', 0))
      totalMoney = totalMoney.add(price.times(Number(x.deliverQty || 0)))
    })

    totalMoney = formatNum(totalMoney.toNumber(), { unit: false })

    // 获取暂存的保存信息
    const getSaveDetail = (values) => {
      const { deliverRemark, receiveDeptName, receiveName, receivePhone, distribute } = values

      let formQty = 0

      const mapedItems = items.map((x, i) => {
        formQty += Number(x.deliverQty)
        const materialsAmount = Number(get(x, 'materialsPrice', 0)) * Number(x.deliverQty)

        const expiredDate = x[EXPIRED_DATE]
        const sterilizationDate = x[STERILIZATION_DATE]
        const produceDate = x[PRODUCE_DATE]

        return {
          ...x,
          itemIndex: i + 1,
          materialsAmount,
          [EXPIRED_DATE]: isPlainObject(expiredDate)
            ? x[EXPIRED_DATE].format('YYYY-MM-DD')
            : expiredDate,
          [STERILIZATION_DATE]: isPlainObject(sterilizationDate)
            ? x[STERILIZATION_DATE].format('YYYY-MM-DD')
            : sterilizationDate,
          [PRODUCE_DATE]: isPlainObject(produceDate)
            ? produceDate.format('YYYY-MM-DD')
            : produceDate,
        }
      })

      const deptName = get(receiveDeptName, 'label')
      const deptId = get(receiveDeptName, 'key')

      const customerOrgId = get(distribute, 'key')
      let customerOrgName = get(distribute, 'label')
      let saleType = 2
      if (customerOrgId === selfOrgId) {
        customerOrgName = selfOrgName
        saleType = 1
      }
      const receiveOrgId = get(customer, 'key')
      const receiveOrgName = get(customer, 'label')
      return {
        formId: tempFormId,
        deliveryName: props.userRealName,
        deliverRemark,
        formAmount: totalMoney,
        formQty,
        intranetDirectDeptName: deptName,
        intranetDirectDeptId: deptId,
        [RECEIVE_DEPT_NAME]: deptName,
        receiveAddress: deptName,
        receiveName,
        receivePhone,
        items: mapedItems,
        ...customerData,
        receiveOrgId,
        receiveOrgName,
        customerOrgId,
        customerOrgName,
        saleType,
      }
    }

    const checkChangeAndSave = (values, callback) => {
      const hasContent = some(pick(values, restFields), x => !!x) || items.length
      const requiredEmpty = some(
        pick(values, ['distribute', 'customer', RECEIVE_DEPT_NAME]),
        x => !x,
      )
      if (hasContent && !requiredEmpty) {
        Modal.confirm({
          content: '当前编辑的客户跟台发货信息是否需要保存?',
          onOk: () => {
            const payload = getSaveDetail(values)

            dispatchAction({ type: 'tempSave', payload }).then(() => {
              callback()
            })
          },
          onCancel: callback,
        })
      } else {
        callback()
      }
    }
    const agentsSelect = (
      <Select
        labelInValue
        showSearch
        optionFilterProp="children"
        notFoundContent={getLoading('getAgents') ? <Spin size="small" /> : '无匹配结果'}
        onSearch={(value) => {
          listDebounce(() => {
            dispatchAction({ type: 'getAgents', payload: { keywords: value } })
          })
        }}
        onSelect={(value) => {
          const distributorOrgId = get(value, 'key')
          const values = getFieldsValue()
          if (values.distribute && get(values.distribute, 'key') === distributorOrgId) {
            return
          }
          const agentChange = () => {
            dispatchAction({ type: 'getCustomers', payload: { distributorOrgId } })
            resetFields([...restFields, 'customer', RECEIVE_DEPT_NAME])
            dispatchAction({
              type: COMMON_REDUCER,
              payload: { items: [], distribute: value || {} },
            })
          }
          checkChangeAndSave(values, agentChange)
        }}
      >
        <Option key={selfOrgId}>自供</Option>
        {state.agents.map(item => (
          <Option key={item.distributorOrgId}>{item.distributorOrgName}</Option>
        ))}
      </Select>
    )
    const customersSelect = (
      <Select
        labelInValue
        showSearch
        optionFilterProp="children"
        notFoundContent={getLoading('getCustomers') ? <Spin size="small" /> : '无匹配结果'}
        onSearch={(value) => {
          const values = getFieldsValue()
          listDebounce(() => {
            dispatchAction({
              type: 'getCustomers',
              payload: { distributorOrgId: get(values.distribute, 'key'), keywords: value },
            })
          })
        }}
        onSelect={(value) => {
          const customerId = get(value, 'key')
          const values = getFieldsValue()
          if (values.customer && get(values.customer, 'key') === customerId) {
            return
          }
          const customerChange = () => {
            if (distributeInfo.key !== selfOrgId) {
              dispatchAction({
                type: 'getDistributeType',
                payload: { customerOrgId: customerId, supplierOrgId: distributeInfo.key },
              })
            }
            dispatchAction({ type: 'getDepts', payload: customerId })
            resetFields([...restFields, RECEIVE_DEPT_NAME])
            const option = state.customers.find(x => x.customerOrgId === get(value, 'key'))
            dispatchAction({
              type: COMMON_REDUCER,
              payload: { items: [], customerData: option, customer: value },
            })
          }
          checkChangeAndSave(values, customerChange)
        }}
      >
        {state.customers.map(item => (
          <Option key={item.customerOrgId}>{item.customerOrgName}</Option>
        ))}
      </Select>
    )

    const deptsSelect = (
      <Select
        labelInValue
        showSearch
        optionFilterProp="children"
        notFoundContent={getLoading('getDepts') ? <Spin size="small" /> : '无匹配结果'}
        onSelect={(value) => {
          const deptName = get(value, 'label')
          const values = getFieldsValue()
          const getTempInfo = () => {
            resetFields([...restFields])
            dispatchAction({
              type: COMMON_REDUCER,
              payload: { items: [] },
            })
            dispatchAction({
              type: 'getTempSaveInfo',
              payload: {
                customerOrgId:
                  get(values.distribute, 'label') === '自供'
                    ? get(values.customer, 'key')
                    : get(values.distribute, 'key'),
                receiveOrgId: get(values.customer, 'key'),
                receiveDeptName: deptName,
              },
            }).then((content) => {
              if (content) {
                setFieldsValue({
                  ...pick(content, restFields),
                  [RECEIVE_DEPT_NAME]: get(content, 'intranetDirectDeptName') && {
                    label: get(content, 'intranetDirectDeptName'),
                    key: get(content, 'intranetDirectDeptId'),
                  },
                })
                dispatchAction({
                  type: COMMON_REDUCER,
                  payload: { tempFormId: content.formId, items: content.items || [] },
                })
              } else {
                resetFields(restFields)
                dispatchAction({
                  type: COMMON_REDUCER,
                  payload: { tempFormId: undefined, items: [] },
                })
              }
            })
          }
          checkChangeAndSave(values, getTempInfo)
        }}
      >
        {state.depts.map(item => <Option key={item.deptId}>{item.receiveDeptName}</Option>)}
      </Select>
    )

    // 用户信息表单
    const shipForm = (
      <Form>
        <Row>
          <Col span="8">
            <FormItem label="总代商" required {...formLayout}>
              {getFieldDecorator('distribute', {
                initialValue: isEmpty(againTempData) ? { key: selfOrgId, label: '自供' } :
                  { key: againTempData.generalOrgId, label: againTempData.generalOrgName },
                rules: [
                  {
                    required: true,
                    message: '请选择总代名称',
                  },
                ],
              })(agentsSelect)}
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="客户名称" required {...formLayout}>
              {getFieldDecorator('customer', {
                initialValue: isEmpty(againTempData) ? undefined : {
                  label: againTempData.receiveOrgName, key: againTempData.receiveOrgId,
                },
                rules: [
                  {
                    required: true,
                    message: '请选择客户名称',
                  },
                ],
              })(customersSelect)}
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="接收科室" {...formLayout}>
              {getFieldDecorator(RECEIVE_DEPT_NAME, {
                initialValue: isEmpty(againTempData) ? undefined : {
                  label: againTempData.receiveDeptName, key: againTempData.receiveDeptId,
                },
                rules: [
                  {
                    required: true,
                    message: '请选择科室',
                  },
                ],
              })(deptsSelect)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
            <FormItem label="发货人" {...formLayout}>
              {props.userRealName}
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="收货人" {...formLayout}>
              {getFieldDecorator(RECEIVE_NAME)(<Input />)}
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="联系电话" {...formLayout}>
              {getFieldDecorator(RECEIVE_PHONE)(<Input />)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <FormItem label="发货备注" labelCol={{ span: 2 }} wrapperCol={{ span: 22 }}>
            {getFieldDecorator(DELIVERY_REMARK)(<Input.TextArea rows={4} maxLength={200} />)}
          </FormItem>
        </Row>
      </Form>
    )

    const columns = [
      {
        title: '序号',
        key: 'index',
        render: ($, row, i) => {
          const isTarget = curBarcode === row.barcodeCode
          if (isTarget) {
            return (
              <span id="targetEl" tabIndex="-1">
                {i + 1}
              </span>
            )
          }
          return i + 1
        },
        className: 'aek-text-center',
        width: 50,
        fixed: 'left',
      },
      {
        title: '物资名称/规格',
        key: MATERIALS_NAME,
        dataIndex: MATERIALS_NAME,
        width: 200,
        fixed: 'left',
        render: (text, row) => (
          <div>
            <div>{text}</div>
            <div>{row[MATERIALS_SKU]}</div>
          </div>
        ),
      },
      {
        title: '注册证/省标编号',
        key: CERTIFICATE_NO,
        dataIndex: CERTIFICATE_NO,
        width: 300,
        fixed: 'left',
        render: (text, row, idx) => (
          <div style={{ minWidth: '300px' }}>
            <Select
              className={Styles.removeZidx}
              style={{ width: '100%' }}
              showSearch
              mode="combobox"
              value={text}
              notFoundContent={getLoading('getCertificate') ? <Spin size="small" /> : '无匹配结果'}
              onSearch={(keywords) => {
                this.handleSearchCertificate(keywords, idx)
              }}
              allowClear
              onFocus={() => {
                if (!text && !get(certificateNos, 'length')) {
                  if (isSetCustomer) {
                    dispatchAction({
                      type: 'getCertificate',
                      payload: {
                        keywords: '',
                        customerOrgId: get(customerData, CUSTOMER_ORG_ID),
                        idx,
                        orgManagementCertificate: get(customerData, 'orgManagementCertificate'),
                      },
                    })
                  } else {
                    message.error('请先选择客户')
                  }
                }
              }}
              onChange={(value) => {
                dispatchAction({
                  type: UPDATE_ITEM_DETAIL,
                  payload: {
                    barcodeCode: row[BARCODE_CODE],
                    prop: CERTIFICATE_NO,
                    value,
                  },
                })
              }}
            >
              {get(certificateNos, idx, []).map(item => <Option key={item}>{item}</Option>)}
            </Select>
            <Input
              className="aek-mt10"
              placeholder="省标编号"
              value={row[INVITE_NO]}
              onChange={(e) => {
                dispatchAction({
                  type: UPDATE_ITEM_DETAIL,
                  payload: {
                    barcodeCode: row[BARCODE_CODE],
                    prop: INVITE_NO,
                    value: e.target.value,
                  },
                })
              }}
            />
          </div>
        ),
      },

      {
        title: '生产日期',
        key: PRODUCE_DATE,
        dataIndex: PRODUCE_DATE,
        render: (text, row) => (
          <DatePicker
            value={text ? moment(text) : undefined}
            onChange={(_, dateString) => {
              dispatchAction({
                type: UPDATE_ITEM_DETAIL,
                payload: {
                  prop: PRODUCE_DATE,
                  value: dateString,
                  [BARCODE_CODE]: row[BARCODE_CODE],
                },
              })
            }}
          />
        ),
      },
      {
        title: '批次',
        key: BATCH_NO,
        dataIndex: BATCH_NO,
        width: 150,
        render: (text, row) => (
          <Input
            readOnly
            value={text}
            onChange={(e) => {
              dispatchAction({
                type: UPDATE_ITEM_DETAIL,
                payload: {
                  value: e.target.value,
                  prop: BATCH_NO,
                  barcodeCode: row[BARCODE_CODE],
                },
              })
            }}
          />
        ),
      },
      {
        title: '配送数量',
        key: DELIVER_QTY,
        dataIndex: DELIVER_QTY,
        width: 100,
        render: (text, row) => (
          <InputNumber
            min={1}
            value={text}
            precision={0}
            onChange={(value) => {
              dispatchAction({
                type: UPDATE_ITEM_DETAIL,
                payload: {
                  prop: DELIVER_QTY,
                  value,
                  barcodeCode: row[BARCODE_CODE],
                },
              })
            }}
          />
        ),
      },
      {
        title: '有效期',
        key: EXPIRED_DATE,
        dataIndex: EXPIRED_DATE,
        render: (text, row) => (
          <DatePicker
            disabled
            value={text ? moment(text) : undefined}
            onChange={(_, dateString) => {
              dispatchAction({
                type: UPDATE_ITEM_DETAIL,
                payload: {
                  prop: EXPIRED_DATE,
                  value: dateString,
                  [BARCODE_CODE]: row[BARCODE_CODE],
                },
              })
            }}
          />
        ),
      },
      {
        title: '灭菌批号',
        key: STERILIZATION_NO,
        dataIndex: STERILIZATION_NO,
        width: 130,
        render: (text, row) => (
          <Input
            value={text}
            onChange={(e) => {
              dispatchAction({
                type: UPDATE_ITEM_DETAIL,
                payload: {
                  value: e.target.value,
                  prop: STERILIZATION_NO,
                  [BARCODE_CODE]: row[BARCODE_CODE],
                },
              })
            }}
          />
        ),
      },
      {
        title: '灭菌效期',
        key: STERILIZATION_DATE,
        dataIndex: STERILIZATION_DATE,
        render: (text, row) => (
          <DatePicker
            value={text ? moment(text) : undefined}
            onChange={(_, dateString) => {
              dispatchAction({
                type: UPDATE_ITEM_DETAIL,
                payload: {
                  prop: STERILIZATION_DATE,
                  value: dateString,
                  [BARCODE_CODE]: row[BARCODE_CODE],
                },
              })
            }}
          />
        ),
      },
      {
        title: '跟踪码',
        key: TRACK_CODE,
        dataIndex: TRACK_CODE,
        width: 120,
        render: (text, row) => (
          <Input
            readOnly
            value={text}
            onChange={(e) => {
              dispatchAction({
                type: UPDATE_ITEM_DETAIL,
                payload: {
                  value: e.target.value,
                  prop: TRACK_CODE,
                  [BARCODE_CODE]: row[BARCODE_CODE],
                },
              })
            }}
          />
        ),
      },
      {
        title: '操作',
        key: 'action',
        fixed: 'right',
        className: 'aek-text-center',
        width: 80,
        render: (_, row) => (
          <a
            onClick={() => {
              dispatchAction({ type: 'remove', payload: row[BARCODE_CODE] })
            }}
          >
            删除
          </a>
        ),
      },
    ]

    const barcodeInputProps = {
      className: 'aek-barcode',
      ref: (input) => {
        barcodeInput = input
      },
      onPressEnter: (e) => {
        const value = e.target.value
        dispatchAction({ type: 'scanBarcode', payload: value })
          .then(() => {
            const targetEl = document.querySelector('#targetEl')
            if (targetEl && typeof targetEl.focus === 'function') {
              targetEl.focus()
            }
          })
          .then(() => {
            const input = barcodeInput.refs.input
            input.value = ''
            input.focus()
          })
          .then(() => {
            delay(() => {
              dispatchAction({ type: 'updateState', payload: { curBarcode: false } })
            }, 1000)
          })
      },
    }

    const handleResetOk = () => {
      dispatchAction({ type: COMMON_REDUCER, payload: { items: [] } })
    }

    const tempSaveButton = (
      <Button
        disabled={!isSetCustomer}
        className="aek-mlr15"
        loading={getLoading('tempSave')}
        onClick={() => {
          const values = getFieldsValue()
          const payload = getSaveDetail(values)
          dispatchAction({ type: 'tempSave', payload })
        }}
      >
        暂存
      </Button>
    )

    const oprationPanel = (
      <div className={classnames({ 'aek-fullScreen': isFullScreen })}>
        <div className="aek-pb15 barcodeContainer">
          {getFieldValue(RECEIVE_DEPT_NAME) ? (
            <Spin style={{ width: '400px' }} spinning={getLoading('scanBarcode')}>
              <Input {...barcodeInputProps} disabled={getLoading('scanBarcode')} />
            </Spin>
          ) : (
            <Tooltip title="请先选择科室">
              <Input {...barcodeInputProps} disabled />
            </Tooltip>
          )}
          <Button
            style={{ float: 'right' }}
            onClick={() => {
              dispatchAction({
                type: COMMON_REDUCER,
                payload: { isFullScreen: !isFullScreen },
              })
            }}
          >
            {isFullScreen ? '退出全屏' : '全屏操作'}
          </Button>
        </div>
        <div className={isFullScreen ? Styles.fullMaxHeight : Styles.maxHeight}>
          <Table
            loading={getLoading('scanBarcode')}
            dataSource={items}
            columns={columns}
            bordered
            rowKey="barcodeCode"
            pagination={false}
            rowClassName={(row) => {
              if (row.barcodeCode === curBarcode) {
                return Styles.highLight
              }
              return ''
            }}
            scroll={{
              x: 1500,
              // y: 200,
            }}
          />
        </div>
        <div className={classnames({ [Styles.bottom]: isFullScreen })}>
          <div style={{ textAlign: 'right' }} className="aek-ptb15">
            配送金额共计：
            <span className="aek-red aek-font-large aek-pl10">￥{totalMoney}</span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <Button
              disabled={!items.length}
              loading={getLoading('delivery')}
              type="primary"
              onClick={() => {
                validateFieldsAndScroll((errors, values) => {
                  if (!errors) {
                    const payload = getSaveDetail(values)

                    let flag = true

                    const testItems = payload.items

                    if (!testItems.length) {
                      Modal.error({ content: '当前未选择物资, 请先扫描物资再发货' })
                      return
                    }

                    testItems.forEach((item) => {
                      if (!item[CERTIFICATE_NO]) {
                        flag = false
                      }
                    })

                    if (!flag) {
                      Modal.error({ content: '有物资未选择发货明细注册证, 请先选择注册证在发货' })
                      return
                    }
                    dispatchAction({
                      type: 'delivery',
                      payload,
                    }).then((printDetail) => {
                      resetFields()
                      Modal.confirm({
                        iconType: 'check-circle',
                        content: '您已发货成功，请打印配送单随货送至医院',
                        onOk: () => {
                          dispatchAction({
                            type: COMMON_REDUCER,
                            payload: { printVisible: true, printDetails: printDetail },
                          })
                          // dispatchAction({
                          //   type: 'app/getPersonalityConfig',
                          //   payload: { orgId: printDetail.barcodeCustomerOrgId },
                          // }).then((content) => {
                          //   const { deliveryPrintDynamicConfigFlag } = content
                          //   if (deliveryPrintDynamicConfigFlag) {
                          //     dispatchAction({ type: 'getTableColumns' })
                          //   }
                          // })
                        },
                        okText: '打印配送单',
                      })
                    })
                  } else {
                    dispatchAction({ type: COMMON_REDUCER, payload: { isFullScreen: false } })
                  }
                })
              }}
            >
              发货
            </Button>
            {isSetCustomer ? (
              tempSaveButton
            ) : (
              <Tooltip title="请先选择客户">{tempSaveButton}</Tooltip>
            )}
            <a
              onClick={() => {
                Modal.confirm({
                  onOk: handleResetOk,
                  content: '重置之后，当前发货明细将会被清除，是否确定重置？',
                  maskClosable: true,
                })
              }}
            >
              重置
            </a>
          </div>
        </div>
      </div>
    )

    const tempSaveLoading = getLoading('getTempSaveInfo')
    const printModalParam = {
      printModalVisible: state.printVisible,
      formId: printDetails.formId,
      saleType: printDetails.saleType,
      distributeType: printDetails.distributeType,
      onCancel() {
        dispatchAction({ type: COMMON_REDUCER, payload: { printVisible: false } })
      },
      // accuracy: props.accuracy,
      // wrapData: printDetails.data,
      // detailPageData: printDetails,
      // printModalVisible: state.printVisible,
      // dispatchAction,
      // getLoading,
      // orgName: selfOrgName,
      // deliveryBarcodeShape,
      // personalColumns,
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
      spin: getLoading('scanBarcode'),
    }
    return (
      <div className="aek-layout" id="containerElement">
        <div className="bread">
          <Breadcrumb />
        </div>
        <APanel title="发货信息">
          <Spin spinning={tempSaveLoading}>{shipForm}</Spin>
        </APanel>
        <APanel title="发货明细">
          <Spin spinning={tempSaveLoading}>{oprationPanel}</Spin>
        </APanel>
        {state.printVisible && <PrintModal {...printModalParam} />}
        <BarcodeModal {...modalPorps} />
      </div>
    )
  }
}

Ship.propTypes = propTypes

const mapStateToProps = store => ({
  [namespace]: store[namespace],
  loading: store.loading,
  userRealName: store.app.user.userRealName,
  accuracy: store.app.orgInfo.accuracy,
  orgName: store.app.orgInfo.orgName,
  orgId: store.app.orgInfo.orgId,
  deliveryBarcodeShape: store.app.personalityConfig.deliveryBarcodeShape,
})

export default connect(mapStateToProps)(Form.create()(Ship))
