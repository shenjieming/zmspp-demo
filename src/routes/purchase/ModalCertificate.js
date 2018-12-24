import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Spin } from 'antd'
import { PlainForm } from '../../components'

const propTypes = {
  certificateVisible: PropTypes.bool,
  loading: PropTypes.bool,
  toAction: PropTypes.func,
  certificateData: PropTypes.object,
}
const certificateObj = ['', '注册证', '备案证', '消毒证']
const ModalCertificate = ({ certificateVisible, loading, toAction, certificateData }) => {
  const modalOpts = {
    title: '查看注册证',
    visible: certificateVisible,
    maskClosable: true,
    onCancel() {
      toAction({ certificateVisible: false })
    },
    wrapClassName: 'aek-modal',
    footer: false,
  }
  const {
    agentSupplierName, // 总代名称
    certificateImageUrls, // 证件图片地址
    certificateNo, // 证件编号
    certificateType, // 证书类型：1-注册证；2-备案证；3-消毒证
    delayedCertificateNo, // 延期证号
    delayedDateEnd, // 延期截止日期
    delayedFlag, // 是否延期
    importedFlag, // 是否进口
    produceFactoryName, // 生产厂家名称
    productName, // 厂品名称
    validDateEnd, // 有效期结束日期
    validDateLongFlag, // 是否长期有效
    validDateStart, // 有效期开始日期
  } = certificateData
  let showData = {
    证件类型: certificateObj[certificateType] || '注册证',
    证号: certificateNo,
    产品名称: productName,
    生产企业: produceFactoryName,
    有效期: validDateLongFlag ? (
      <span>{validDateStart} ~ 长期有效</span>
    ) : (
      <span>
        {validDateStart} ~ {validDateEnd}
      </span>
    ),
  }

  if (importedFlag) {
    showData = {
      ...showData,
      是否进口: '是',
      总代: agentSupplierName,
    }
  } else {
    showData = {
      ...showData,
      是否进口: '否',
    }
  }
  if (delayedFlag) {
    showData = {
      ...showData,
      是否延期: '是',
      延期证号: delayedCertificateNo,
      延期至: delayedDateEnd,
    }
  }

  return (
    <Modal {...modalOpts}>
      <Spin spinning={loading}>
        <div>基本信息</div>
        <PlainForm size={1} data={showData} />
        <div>证件图片信息</div>
        <PlainForm
          size={1}
          data={{
            '证件图片|img': certificateImageUrls,
          }}
        />
      </Spin>
    </Modal>
  )
}
ModalCertificate.propTypes = propTypes
export default ModalCertificate
