import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Table, Avatar, Input, Row ,Col } from 'antd'
const namespace = 'organInfo'
function poolModal(
  {
    poolModalVisible = false,
    dispatch,
    // loading,
    orgDetail
}) {
  const visible = poolModalVisible
  const modalProps = {
    visible: visible,
    onOk () {
      dispatch({
        type: 'upDatePool',
        payload: {
          whId: orgDetail.whId
        },
      })
    },
    title: '总库ID设置',
    maskClosable: false,
    onCancel() {
      dispatch({
        type: 'organInfo/updateState',
        payload: {
          poolModalVisible: false,
        },
      })
    },
  }
  const handleonChange = (e) => {
    const obj  = orgDetail
    obj.whId =  e.target.value
    dispatch({
      type: 'organInfo/updateState',
      payload: {
        orgDetail: obj,
      },
    })
  }
  return (
    <Modal {...modalProps}>
      <Row>
        <Col span={4}>
          总库ID设置
        </Col>
        <Col span={19}>
          <Input value={orgDetail.whId} onChange={handleonChange}/>
        </Col>
      </Row>
    </Modal>
  )
}

poolModal.propTypes = {
  poolModalVisible: PropTypes.bool,
  // loading: PropTypes.bool,
  dispatch: PropTypes.func,
  orgDetail: PropTypes.object,
}

export default poolModal
