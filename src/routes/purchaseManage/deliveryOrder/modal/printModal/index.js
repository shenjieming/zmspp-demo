import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Row, Col, Spin } from 'antd'
import Barcode from 'react-barcode'
import { noop } from 'lodash'
import { genColumns, getDetailData } from './data'
import PlainForm from '../../../../../components/PlainForm'
import PlainTable from '../../../../../components/PlainTable'
import styles from './index.less'
import { printContent } from '../../../../../utils'
import FollowSaleImg from '../../../../../assets/follow-sell.png'
import SendSaleImg from '../../../../../assets/send-sell.png'
import CommonWasteImg from '../../../../../assets/common-waste.png'

const PicImg = ['', CommonWasteImg, SendSaleImg, FollowSaleImg] // 普耗 寄销 跟台
const propTypes = {
  orgName: PropTypes.string,
  printList: PropTypes.array,
  printDetailData: PropTypes.object,
  printModalVisible: PropTypes.bool,
  dispatchAction: PropTypes.func,
  getLoading: PropTypes.func,
  accuracy: PropTypes.number,
  cancelDefault: PropTypes.func,
}
const PrintModal = ({
  cancelDefault = noop,
  accuracy,
  printList,
  printDetailData,
  printModalVisible: visible,
  dispatchAction,
  getLoading,
  orgName,
}) => {
  const { formType } = printDetailData
  const tableParam = {
    loading: getLoading('printCheckOrder'),
    columns: genColumns({
      formType,
      accuracy,
    }),
    bordered: true,
    dataSource: printList,
    pagination: false,
    rowKey: 'itemId',
    style: { marginBottom: 20 },
  }
  const content = (
    <div>
      <Spin spinning={getLoading('printCheckOrder')}>
        <div className={styles.listTitle}>
          <div className="aek-print-title aek-fl" style={{ display: 'inline-block' }}>
            {orgName}（验收单）
            <img src={PicImg[formType]} className={styles.icon} alt="图片" />
          </div>
          <div className="aek-fr" style={{ height: 100 }}>
            {printDetailData.formNo ? <Barcode height={60} value={printDetailData.formNo} /> : ''}
          </div>
        </div>
        <PlainForm data={getDetailData(printDetailData)} size={3} />
        <PlainTable {...tableParam} />
        <div>
          <Row className="signature">
            <Col span={8}>
              <div className={styles.bottom}>
                <div>验收人：</div>
                <div className={styles.underLine} />
              </div>
            </Col>
            <Col span={8}>
              <div className={styles.bottom}>
                <div>验收时间：</div>
                <div className={styles.underLine} />
              </div>
            </Col>
          </Row>
        </div>
      </Spin>
    </div>
  )
  const modalOpts = {
    title: '打印预览',
    visible,
    wrapClassName: 'aek-modal',
    onCancel() {
      dispatchAction({
        payload: {
          printModalVisible: false,
        },
      })
    },
    okText: '打印验收单',
    onOk() {
      printContent(content)
    },
    afterClose: cancelDefault,
    maskClosable: false,
    width: 1150,
  }
  return <Modal {...modalOpts}>{content}</Modal>
}

PrintModal.propTypes = propTypes

export default PrintModal
