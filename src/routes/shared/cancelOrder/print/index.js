import React from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'antd'
import Barcode from 'react-barcode'

import PlainForm from '../../../../components/PlainForm'
import PlainTable from '../../../../components/PlainTable'
import { printContent } from '../../../../utils'
import { MANAGE_MODEL } from '../../../../utils/constant'
import { returnItemColumns } from '../detail/props'
import styles from './index.less'
// 图片
import CommonWasteImg from '../../../../assets/common-waste.png'
import SendSaleImg from '../../../../assets/send-sell.png'

const PicImg = {
  1: CommonWasteImg,
  2: SendSaleImg,
} // 普耗 寄销

const CancelPrint = ({ namespace, orderBean, visible, hideHandler }) => {
  const { baseInfo, returnItemList } = orderBean
  const materialsInfo = () => (
    <PlainTable
      bordered
      rowKey="itemId"
      columns={returnItemColumns}
      pagination={false}
      dataSource={returnItemList}
      size="small"
    />
  )
  const baseInfoHtml = () => {
    const data =
      namespace === 'cancelDetail'
        ? {
          退货单号: baseInfo.formNo,
          客户名称: baseInfo.customerOrgName,
          退货时间: baseInfo.submitTime,
          退货人: baseInfo.submitName,
          退货金额: baseInfo.formAmount,
          类型: MANAGE_MODEL[baseInfo.formType],
          '备注|fill': baseInfo.formRemark,
        }
        : {
          退货单号: baseInfo.formNo,
          供应商名称: baseInfo.supplierOrgName,
          退货时间: baseInfo.submitTime,
          退货人: baseInfo.submitName,
          退货金额: baseInfo.formAmount,
          类型: MANAGE_MODEL[baseInfo.formType],
          '备注|fill': baseInfo.formRemark,
        }
    return <PlainForm data={data} size={3} />
  }
  const content = (
    <div>
      <div className={styles.iconWrap}>
        <div className={styles.listTitle}>
          <div
            className="aek-print-title"
            style={{ top: '50%', position: 'absolute', transform: 'translateY(-50%)' }}
          >
            {namespace === 'cancelDetail' ? baseInfo.supplierOrgName : baseInfo.customerOrgName}(退货单)
            <img src={PicImg[baseInfo.formType]} alt="图片" className={styles.icon} />
          </div>
          <div style={{ marginLeft: '760px' }}>
            {baseInfo.formNo ? <Barcode height={60} value={baseInfo.formNo} /> : ''}
          </div>
        </div>
      </div>
      <div className={styles.infoContainer}>
        {baseInfoHtml()}
        {materialsInfo()}
      </div>
    </div>
  )
  const modalOpts = {
    title: '退货单打印',
    visible,
    onCancel: hideHandler,
    okText: '打印退货单',
    onOk: () => {
      printContent(content)
    },
    width: 1150,
  }
  return <Modal {...modalOpts}>{content}</Modal>
}

CancelPrint.propTypes = {
  orderBean: PropTypes.object,
  namespace: PropTypes.string,
  hideHandler: PropTypes.func,
  visible: PropTypes.bool,
}

export default CancelPrint
