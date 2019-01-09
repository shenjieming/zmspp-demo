import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Row, Col, Card } from 'antd'
import style from './style.less'

const propTypes = {
  visible: PropTypes.bool,
  menuClick: PropTypes.func,
  onCancel: PropTypes.func,
}

const ModalSelsect = ({
  visible,
  menuClick,
  onCancel,
}) => {
  const modalOpts = {
    visible,
    title: '选择新增物料的方式',
    wrapClassName: 'aek-modal',
    footer: null,
    width: 640,
    onCancel,
  }
  return (
    <Modal {...modalOpts}>
      <Row>
        <Row>
          <Col span={10} offset={1}>
            <Card
              className={style.cardStyle}
              onClick={() => { menuClick('add') }}
            >
              <p>手工新增</p>
              <p>手工录入物料信息新增</p>
            </Card>
          </Col>
          <Col span={10} offset={2}>
            <Card
              className={style.cardStyle}
              onClick={() => { menuClick('get') }}
            >
              <p>从平台标准数据中拉取</p>
              <p>零库存提供了一套与注册证统一的标准字典，您可以从中选择使用</p>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col span={10} offset={1}>
            <Card
              className={style.cardStyle}
              onClick={() => { menuClick('excelInput') }}
            >
              <p>Excel导入</p>
              <p>将带有物料数据的Excel文件导入到平台的采购目录中</p>
            </Card>
          </Col>
          <Col span={10} offset={2}>
            <Card
              className={style.cardStyle}
              onClick={() => { menuClick('schedule') }}
            >
              <p>导入进度</p>
              <p>查看历史导入记录和进度</p>
            </Card>
          </Col>
        </Row>
      </Row>
    </Modal>
  )
}

ModalSelsect.propTypes = propTypes

export default ModalSelsect
