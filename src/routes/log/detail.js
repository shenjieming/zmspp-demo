import React from 'react'
import { PlainForm } from '@components'
import PropTypes from 'prop-types'
import { Modal, Input } from 'antd'

const TextArea = Input.TextArea

function Detail(props) {
  const { data, visible, handleClose } = props

  const detail = {
    apiId: data.apiId,
    apiType: data.apiType,
    sendTime: data.sendTime,
    receiveTime: data.receiveTime,
    responseCode: data.responseCode,
    correlationId: data.correlationId,
    'responseMsg|fill': <div className="aek-word-break">{data.responseMsg}</div>,
    'responseBody|fill': <div className="aek-word-break">{data.responseBody}</div>,
    'apiBody|fill': data.apiBody ? (
      <TextArea value={JSON.stringify(JSON.parse(data.apiBody), undefined, 4)} rows={40} />
    ) : '',
  }

  return (
    <Modal visible={visible} title="详情" footer={null} onCancel={handleClose} width={800}>
      <PlainForm data={detail} size={2} />
    </Modal>
  )
}

Detail.propTypes = {
  data: PropTypes.object.isRequired,
  visible: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
}

export default Detail
