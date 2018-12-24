import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Row, Col, Table, Spin } from 'antd'
import Barcode from 'react-barcode'

import PlainForm from '../../../../components/PlainForm'
import PlainTable from '../../../../components/PlainTable'
import { printContent } from '../../../../utils'
import { tableColumns, getDetailData } from './props'
import styles from './index.less'
import CommonWasteImg from '../../../../assets/common-waste.png'
import SendSaleImg from '../../../../assets/send-sell.png'
import FollowSaleImg from '../../../../assets/follow-sell.png'
import DistributeCommonWasteImg from '../../../../assets/distribute-common.png'
import DistributeSendSaleImg from '../../../../assets/distribute-consignment.png'

const PicImg = {
  '1-1': CommonWasteImg,
  '1-2': SendSaleImg,
  '1-3': FollowSaleImg,
  '2-1': DistributeCommonWasteImg,
  '2-2': DistributeSendSaleImg,
} // 普耗 寄销 跟台

const PrintPurchase = ({ purchaseListInfo, visible, hideHandler, getLoading }) => {
  const materialsInfo = () => {
    const tableList = purchaseListInfo.data
    const renderFooter = ({ receiveAddress, receiveName, receivePhone }) => {
      const footer = (
        <div className={styles.boldText}>
          收货地址：{receiveAddress}&nbsp;&nbsp;&nbsp;&nbsp;
          {receiveName}&nbsp;&nbsp;&nbsp;&nbsp;
          {receivePhone}
        </div>
      )
      return footer
    }
    const info = tableList.map((ele, index) => (
      <Row key={index}>
        <PlainTable
          bordered
          rowKey="itemId"
          columns={tableColumns}
          pagination={false}
          dataSource={ele.items}
          size="small"
          footer={() => renderFooter(ele)}
        />
      </Row>
    ))
    return info
  }
  const content = (
    <div>
      <div className={styles.iconWrap}>
        <div className={styles.listTitle}>
          <div
            className="aek-print-title"
            style={{ top: '50%', position: 'absolute', transform: 'translateY(-50%)' }}
          >
            {purchaseListInfo.customerOrgName}(采购单)
            <img
              src={PicImg[`${purchaseListInfo.saleType}-${purchaseListInfo.formType}`]}
              alt="图片"
              className={styles.icon}
            />
          </div>
          <div style={{ marginLeft: '760px' }}>
            {purchaseListInfo.formNo ? <Barcode height={60} value={purchaseListInfo.formNo} /> : ''}
          </div>
        </div>
      </div>
      <div className={styles.infoContainer}>
        <PlainForm data={getDetailData(purchaseListInfo)} size={3} />
        {materialsInfo()}
        <Row className="signature">
          <Col span={12}>
            <div className={styles.bottom}>
              <div>捡货人：</div>
            </div>
          </Col>
          <Col span={12}>
            <div className={styles.bottom}>
              <div>捡货时间：</div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  )
  const modalOpts = {
    title: '打印预览',
    visible,
    onCancel: hideHandler,
    okText: '打印采购单',
    onOk: () => {
      printContent(content)
    },
    width: 1150,
  }
  return (
    <Modal {...modalOpts}>
      <Spin spinning={getLoading('printDetail')}>{content}</Spin>
    </Modal>
  )
}

PrintPurchase.propTypes = {
  purchaseListInfo: PropTypes.object,
  okHandler: PropTypes.func,
  hideHandler: PropTypes.func,
  form: PropTypes.object,
  visible: PropTypes.bool,
  getLoading: PropTypes.func,
}

export default Form.create()(PrintPurchase)
