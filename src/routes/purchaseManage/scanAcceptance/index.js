import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Table, Input, Row, Col, Modal, message } from 'antd'
import classnames from 'classnames'
import { getBasicFn } from '../../../utils'
import { genColumns } from './data'
import Breadcrumb from '../../../components/Breadcrumb'
import style from './index.less'

const { confirm } = Modal
const namespace = 'scanAcceptance'
let barcodeInput = null
const propTypes = {
  scanAcceptance: PropTypes.object.isRequired,
  loading: PropTypes.object.isRequired,
}
const ScanAcceptancePage = ({ scanAcceptance, loading }) => {
  const { dispatchAction, getLoading, dispatchUrl } = getBasicFn({ namespace, loading })
  const { scanList, detailPageData, postListData } = scanAcceptance
  const {
    deliverCompany,
    deliverName,
    deliverNo,
    deliverPhone,
    deliverPlateNumber,
    deliverRemark,
    deliverType,
    formAmount,
    formNo,
    formQty,
    originalFormNo,
    purchaseName,
    supplierOrgName,
    formId,
    originalFormId,
    formType,
    formStatus,
  } = detailPageData
  const tableParam = {
    className: 'aek-mt15',
    scroll: { x: 1300 },
    bordered: true,
    loading: getLoading('queryScanList'),
    columns: genColumns({
      formStatus,
      handleData(val, record, key) {
        const current = { ...record }
        const postData = [...postListData]
        current[key] = val
        for (const item of postData) {
          if (current.itemId === item.itemId) {
            item.acceptQty = val
          }
        }
        dispatchAction({
          payload: {
            postListData: postData,
          },
        })
      },
    }),
    dataSource: scanList,
    pagination: false,
    rowKey: 'itemId',
  }

  const barcodeInputProps = {
    className: 'aek-barcode',
    ref: (input) => {
      barcodeInput = input
    },
    onPressEnter: (e) => {
      const value = e.target.value
      if (value) {
        dispatchAction({ type: 'queryScanList', payload: { formNo: value } }).then(() => {
          barcodeInput.refs.input.value = ''
          barcodeInput.focus()
        })
      }
    },
  }
  const confirmReceipt = () => {
    if (!scanList.length) {
      message.warning('请扫码')
      return
    }
    if (!postListData.length) {
      message.warning('请输入验收数量')
      return
    }
    confirm({
      content: '确认验收吗？',
      onOk() {
        dispatchAction({
          type: 'saveCheckOrder',
          payload: {
            formId,
            formType,
            originalFormId,
            originalFormNo,
            confirmShow(content) {
              if (content === 1 && formType !== 3) {
                const ref = confirm({
                  content: (
                    <span>
                      采购单(<a
                        onClick={() => {
                          dispatchUrl({
                            pathname: `/purchaseManage/purchaseOrder/detail/${originalFormId}`,
                          })
                          ref.destroy()
                        }}
                      >
                        {originalFormNo}
                      </a>)已全部配送完成，是否立即对配送服务进行评价？
                    </span>
                  ),
                  onOk() {
                    dispatchAction({
                      payload: {
                        scanList: [],
                        detailPageData: {},
                        postListData: [],
                      },
                    })
                    dispatchUrl({
                      pathname: `/purchaseManage/purchaseOrder/rate/${originalFormId}`,
                    })
                  },
                  visible: true,
                  onCancel() {
                    dispatchAction({
                      payload: {
                        scanList: [],
                        detailPageData: {},
                        postListData: [],
                      },
                    })
                  },
                })
              } else if (content === 2 || content === 1) {
                message.success('验收成功')
                dispatchAction({
                  payload: {
                    scanList: [],
                    detailPageData: {},
                    postListData: [],
                  },
                })
              }
            },
          },
        })
      },
    })
  }
  const sendMsg =
    deliverType === 1 ? (
      <Row className={style.row}>
        <Col span={8}>
          <p>配送方式：</p>
          <span>物流</span>
        </Col>
        <Col span={8}>
          <p>物流单号：</p>
          <span>{deliverNo}</span>
        </Col>
        <Col span={8}>
          <p>物流公司：</p>
          <span>{deliverCompany}</span>
        </Col>
      </Row>
    ) : (
      <Row className={style.row}>
        <Col span={8}>
          <p>配送方式：</p>
          <span>自送</span>
        </Col>
        <Col span={8}>
          <p>车牌号：</p>
          <span>{deliverPlateNumber}</span>
        </Col>
        <Col span={8}>
          <p>配送人：</p>
          <span>
            {deliverName}-{deliverPhone}
          </span>
        </Col>
      </Row>
    )
  return (
    <div className="aek-layout" style={{ paddingRight: 0, paddingBottom: 0 }}>
      <div className="bread">
        <Breadcrumb />
      </div>
      <div className="aek-full-height">
        <div className={style.scrollWrap}>
          <div className={`${style.top} aek-shadow-bottom`}>
            <div>
              <Input {...barcodeInputProps} />
            </div>
            <p className={classnames('aek-primary-color', ' aek-font-small', style.helpText)}>
              扫描配送单条形码或者输入配送单号按下回车键开始验收
            </p>
          </div>
          <div className={style.center}>
            <div className={style.scroll}>
              <div className={style.msgSort}>
                <div className={style.title}>基本信息</div>
                {scanList.length > 0 ? (
                  <div>
                    <Row className={style.row}>
                      <Col span={8}>
                        <p>供应商：</p>
                        <span>{supplierOrgName}</span>
                      </Col>
                      <Col span={8}>
                        <p>配送数量：</p>
                        <span>{formQty}</span>
                      </Col>
                      <Col span={8}>
                        <p>金额：</p>
                        <span>￥ {formAmount}</span>
                      </Col>
                    </Row>
                    <Row className={style.row}>
                      <Col span={8}>
                        <p>配送单号：</p>
                        <span>
                          {formNo} {formStatus === 3 && <span className="aek-red">（已验收）</span>}
                        </span>
                      </Col>
                      <Col span={8}>
                        <p>采购单号：</p>
                        <span>{originalFormNo}</span>
                      </Col>
                      <Col span={8}>
                        <p>采购人：</p>
                        <span>{purchaseName}</span>
                      </Col>
                    </Row>
                    <Row className={style.row}>
                      <Col span={24}>
                        <p>配送备注：</p>
                        <span>{deliverRemark}</span>
                      </Col>
                    </Row>
                  </div>
                ) : (
                  <div className={style.empty}>扫描配送单条形码后开始验收</div>
                )}
              </div>
              <div className={style.msgSort}>
                <div className={style.title}>送货信息</div>
                {scanList.length > 0 ? sendMsg : <div className={style.empty}>扫描配送单条形码后开始验收</div>}
              </div>
              <div className={style.msgSort}>
                <div className={style.title}>配送明细</div>
                {scanList.length > 0 ? (
                  <Table {...tableParam} />
                ) : (
                  <div className={style.empty}>扫描配送单条形码后开始验收</div>
                )}
              </div>
            </div>
          </div>
          {formStatus === 3 ? (
            <div className={`${style.bottom} aek-shadow-top`}>
              <a>已验收</a>
            </div>
          ) : (
            <div className={`${style.bottom} aek-shadow-top`}>
              <a onClick={confirmReceipt}>确认验收</a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

ScanAcceptancePage.propTypes = propTypes
export default connect(({ scanAcceptance, loading }) => ({ scanAcceptance, loading }))(
  ScanAcceptancePage,
)
