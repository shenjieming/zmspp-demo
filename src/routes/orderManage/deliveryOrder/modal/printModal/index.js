import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Spin } from 'antd'
import { connect } from 'dva'
import Barcode from 'react-barcode'
import Qrcode from 'qrcode.react'
import Decimal from 'decimal.js-light'
import { genColumns, getDetailData } from './data'
import PlainForm from '../../../../../components/PlainForm'
import styles from './index.less'
import { printContent, addRowspanField, thousandSplit, getBasicFn } from '../../../../../utils'
import FollowSaleImg from '../../../../../assets/follow-sell.png'
import SendSaleImg from '../../../../../assets/send-sell.png'
import CommonWasteImg from '../../../../../assets/common-waste.png'
import urgentImg from '../../../../../assets/urgent-label.png'
import PlainTable from '../../../../../components/PlainTable'

const PicImg = ['', CommonWasteImg, SendSaleImg, FollowSaleImg] // 普耗 寄销 跟台
const propTypes = {
  // wrapData: PropTypes.array,
  // detailPageData: PropTypes.object,
  // printModalVisible: PropTypes.bool,
  // dispatchAction: PropTypes.func,
  // getLoading: PropTypes.func,
  // accuracy: PropTypes.number,
  // cancelDefault: PropTypes.func,
  // orgName: PropTypes.string,
  // personalColumns: PropTypes.array,
  // deliveryBarcodeShape: PropTypes.number,
  onCancel: PropTypes.func,
  loading: PropTypes.object,
  printDetail: PropTypes.object,
  formId: PropTypes.string,
  saleType: PropTypes.any,
  distributeType: PropTypes.number,
}
const namespace = 'printDetail'
const { dispatchAction } = getBasicFn({ namespace })
class PrintModal extends React.Component {
  componentDidMount() {
    const { formId, saleType, distributeType } = this.props
    dispatchAction({ type: 'getPrintDetail', payload: { formId, saleType, distributeType } })
      .then(() => dispatchAction({ type: 'getPersonalityConfig' }))
      .then(() => dispatchAction({ type: 'getTableColumns' }))
  }
  componentWillUnmount() {
    dispatchAction({ type: 'reset' })
  }
  render() {
    const { loading, printDetail, onCancel } = this.props
    const { getLoading } = getBasicFn({ namespace, loading })
    const { detailPageData, printFormData, personalityConfig, personalColumns } = printDetail
    const { formType, urgentFlag } = detailPageData
    const { deliveryBarcodeShape } = personalityConfig

    const getCodeContent = () => {
      if (detailPageData && detailPageData.formNo) {
        if (deliveryBarcodeShape === 2) {
          return (
            <div>
              <div style={{ height: '100px', lineHeight: '100px' }}>
                <Qrcode value={detailPageData.formNo} renderAs="svg" style={{ height: 100 }} />
              </div>
              <div className={styles.code}>{detailPageData.formNo}</div>
            </div>
          )
        }
        return <Barcode height={60} value={detailPageData.formNo} />
      }
      return ''
    }
    // 计算每个表格的金额小计
    const getMoneyCount = (obj) => {
      const items = obj.items
      let retMoney = 0
      items.forEach((item) => {
        const money = new Decimal(item.materialsPrice).times(item.deliverQty || 0)
        retMoney = money.plus(retMoney)
      })
      return retMoney
    }
    // const getOrgName = () => {
    //   if (Number(detailPageData.saleType) === 2) {
    //     // 过票
    //     return detailPageData.customerOrgName
    //   }
    //   return orgName
    // }
    const getReceiveName = (item) => {
      let receiveNameData = {}
      if (
        personalColumns.find(itm => itm.printKey === 'receiveName') ||
        personalColumns.length === 0
      ) {
        receiveNameData = {
          收货人: item.receiveName,
        }
      }
      return receiveNameData
    }

    const tableTopData = item => ({
      收货科室: item.receiveDeptName || '总库',
      ...getReceiveName(item),
      联系方式: item.receivePhone,
      收货地址: item.receiveAddress,
    })
    const getSendName = () => {
      let receiveNameData = {}
      if (
        personalColumns.find(itm => itm.printKey === 'sendName') ||
        personalColumns.length === 0
      ) {
        receiveNameData = {
          送货人: '',
        }
      }
      return receiveNameData
    }
    const getSingleTotal = (item) => {
      let singleTotalData = {}
      if (
        personalColumns.find(itm => itm.printKey === 'singleTotal') ||
        personalColumns.length === 0
      ) {
        singleTotalData = {
          小计: thousandSplit(getMoneyCount(item)),
        }
      }
      return singleTotalData
    }
    const tableBottomData = item => ({
      ...getSendName(),
      验收人: '',
      确认人: '',
      ...getSingleTotal(item),
    })
    const content = (
      <div>
        <div className={styles.listTitle}>
          <div className={styles.titleArea} style={{ margin: '20px' }}>
            <div className="aek-inline-block">
              <div>{detailPageData.currentOrgName}</div>
              <div style={{ textAlign: 'center' }}>（配送单）</div>
            </div>
            {/*{formType && <img src={PicImg[formType]} className={styles.icon} alt="图片" />}*/}
            {urgentFlag && <img src={urgentImg} className={styles.icon} alt="图片" />}
          </div>
          <div className={styles.codeArea}>{getCodeContent()}</div>
        </div>
        <PlainForm
          data={getDetailData(detailPageData, personalColumns)}
          size={3}
          itemStyle={{
            minHeight: '20px',
            lineHeight: '20px',
          }}
        />
        {printFormData.map((item, idx) => {
          const tableParam = {
            columns: genColumns({
              formType,
              accuracy: 2,
              personalColumns: personalColumns.filter(({ printType }) => printType === 2),
            }),
            bordered: true,
            dataSource: addRowspanField(item.items, 'materialsName', 'materialsSku', 'rowSpan'),
            pagination: false,
            rowKey: 'itemId',
            style: { marginBottom: 12 },
          }
          return (
            <div key={idx} style={{ borderTop: '1px solid', paddingTop: '10px' }}>
              <PlainForm
                data={tableTopData(item)}
                size={3}
                itemStyle={{
                  minHeight: '20px',
                  lineHeight: '20px',
                }}
              />
              <PlainTable {...tableParam} />
              <PlainForm
                data={tableBottomData(item)}
                size={4}
                itemStyle={{
                  minHeight: '20px',
                  lineHeight: '20px',
                }}
              />
            </div>
          )
        })}
      </div>
    )
    const modalOpts = {
      title: '打印预览',
      visible: true,
      wrapClassName: 'aek-modal',
      maskClosable: false,
      onCancel,
      okText: '打印配送单',
      confirmLoading: getLoading('getPrintDetail', 'getPersonalityConfig', 'getTableColumns'),
      onOk() {
        printContent(content)
      },
      width: 1150,
    }
    return (
      <Modal {...modalOpts}>
        {getLoading('getPrintDetail', 'getPersonalityConfig', 'getTableColumns') ? (
          <Spin>
            <div style={{ minHeight: '300px' }} />
          </Spin>
        ) : (
          content
        )}
      </Modal>
    )
  }
}

PrintModal.propTypes = propTypes

export default connect(({ printDetail, loading }) => ({
  printDetail,
  loading,
}))(PrintModal)
