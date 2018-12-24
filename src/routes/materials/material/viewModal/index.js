import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Spin } from 'antd'
import PlainForm from '../../../../components/PlainForm'
import { MATERIALS_TYPE_ARRAY } from '../../../../utils/constant'

const propTypes = {
  dispatchAction: PropTypes.func,
  getLoading: PropTypes.func,
  viewModalVisible: PropTypes.bool,
  viewCurrentData: PropTypes.object,
}

const ViewModal = ({ viewCurrentData, viewModalVisible, dispatchAction, getLoading }) => {
  const {
    brandName, // 品牌名称
    materialsAttribute, // 物料属性
    materialsCode, // 物料编码
    materialsImageUrls, // 物料图片地址
    materialsName, // 物料名称
    materialsStatus, // 物料状态
    produceFactoryName, // 生产厂家名称
    registerCertificateNo, // 注册证号
    registerCertificateProductName, // 注册证产品名称
    remark, // 备注
    standardCategoryName, // 标准分类名称
  } = viewCurrentData
  const modalOpts = {
    title: '查看',
    visible: viewModalVisible,
    onCancel() {
      dispatchAction({
        payload: {
          viewModalVisible: false,
        },
      })
    },
    width: 800,
    footer: false,
    maskClosable: true,
    wrapClassName: 'aek-modal',
  }
  const plaintData = {
    '物资编码|fill': materialsCode,
    标准分类: standardCategoryName,
    属性: materialsAttribute && MATERIALS_TYPE_ARRAY[Number(materialsAttribute)],
    注册证号: registerCertificateNo,
    注册证产品名称: registerCertificateProductName,
    厂家: produceFactoryName,
    品牌: brandName,
    物料名称: materialsName,
    状态: materialsStatus ? '停用' : '启用',
    '证件图片|img|fill': materialsImageUrls,
    '备注|fill': remark,
  }
  return (
    <Modal {...modalOpts}>
      <Spin spinning={getLoading('queryVersionDetail')}>
        <PlainForm data={plaintData} />
      </Spin>
    </Modal>
  )
}
ViewModal.propTypes = propTypes
export default ViewModal
