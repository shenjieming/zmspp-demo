import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Spin } from 'antd'
import PlainForm from '../../../../components/PlainForm'
import { CERTIFICATE_TYPE } from '../../../../utils/constant'

const modalLook = ({
  fileLookLoadingStatus = false,
  fileLookModalVisible,
  currentQualifications: {
    certificateCode,
    certificateType,
    endDate,
    eternalLife,
    imageUrls,
    startDate,
  },
  onCancel,
}) => {
  const visible = fileLookModalVisible
  const modalOpts = {
    title: '查看',
    visible,
    width: 600,
    onCancel,
  }
  const footerObj = null
  const effectiveDate = eternalLife ? (
    <span>{startDate} ~ 长期有效</span>
  ) : (
    <span>
      {startDate || ''} ~ {endDate || ''}
    </span>
  )
  return (
    <Modal {...modalOpts} footer={footerObj}>
      <Spin spinning={fileLookLoadingStatus}>
        <div>基本信息</div>
        <PlainForm
          size={1}
          data={{
            证件类型: CERTIFICATE_TYPE[certificateType],
            证号: certificateCode,
            有效期限: effectiveDate,
            '证件照|img': imageUrls,
          }}
        />
      </Spin>
    </Modal>
  )
}
modalLook.propTypes = {
  fileLookLoadingStatus: PropTypes.bool,
  fileLookModalVisible: PropTypes.bool,
  currentItemFileModal: PropTypes.object,
  currentQualifications: PropTypes.object,
  onCancel: PropTypes.func,
}
export default modalLook
