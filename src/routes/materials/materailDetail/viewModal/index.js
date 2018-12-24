import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Spin } from 'antd'
import PlainForm from '../../../../components/PlainForm'

const propTypes = {
  dispatchAction: PropTypes.func,
  getLoading: PropTypes.func,
  viewModalVisible: PropTypes.bool,
  viewCurrentData: PropTypes.object,
}
const ViewModal = ({ viewModalVisible, dispatchAction, getLoading, viewCurrentData }) => {
  const {
    lastEditName, // 编辑人
    lastEditTime, // 编辑时间
    materialsSku, // 物料规格
    materialsSkuCode, // 物料规格编号
    materialsModel, // 物料规格型号
    materialsSkuStatus, // 物料规格状态
    materialsSkuVersionCode, // 物料规格版本号
    productCode, // 产品编号
    skuUnitName,
    remark, // 备注
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
    width: 700,
    footer: false,
    maskClosable: true,
    wrapClassName: 'aek-modal',
  }
  const expandData = {
    '规格编码|fill': materialsSkuCode,
    产品编号: productCode,
    规格单位: skuUnitName,
    规格: materialsSku,
    型号: materialsModel,
    '状态|fill': materialsSkuStatus ? '停用' : '启用',
    最后编辑人: lastEditName,
    最后编辑时间: lastEditTime,
    版本号: materialsSkuVersionCode,
    '备注|fill': remark,
  }
  return (
    <Modal {...modalOpts}>
      <Spin spinning={getLoading('queryVersionDetail')}>
        <PlainForm data={expandData} />
      </Spin>
    </Modal>
  )
}
ViewModal.propTypes = propTypes
export default ViewModal
