import React from 'react'
import PropTypes from 'prop-types'
import { Button, Row, Col, Avatar } from 'antd'
import styles from './index.less'
import OverText from './overText'

const ConfirmOrder = ({ orderInfo, onConfirm }) => {
  const statusTextObj = {
    2: '订单部分配送',
    3: '订单配送完结',
    4: '订单完结',
    5: '订单已终止',
    6: '订单已作废',
  }

  let statusText = '订单已确认'

  if (orderInfo.formStatus > 1) {
    statusText = statusTextObj[orderInfo.formStatus]
  }

  const handleConfirm = type => () => {
    onConfirm(type)
  }

  return (
    <div>
      <div className={styles.nav}>订单确认</div>
      {orderInfo.confirmStatus || orderInfo.formStatus !== 1 ? (
        <div className={styles.result}>{statusText}</div>
      ) : (
        ''
      )}
      <div className={styles.orderInfo}>
        <div className={styles.item}>
          <div className={styles.rlbox}>
            <Avatar
              className={styles.logo}
              src={orderInfo.customerOrgLogoUrl}
              size="large"
              icon="user"
            />
            <div
              style={{ paddingTop: '5px', fontSize: '15px', color: '#333' }}
              className={[styles.text, styles.customerName, styles.ellipsis].join(' ')}
            >
              {orderInfo.customerOrgName}
            </div>
            <div className={[styles.text, styles.ellipsis].join(' ')}>
              {orderInfo.purchasePhone ? (
                <a style={{ color: 'inherit' }} href={`tel://${orderInfo.purchasePhone}`}>
                  <span className={[styles.icon, styles.phone].join(' ')} />
                  {orderInfo.purchaseName} - {orderInfo.purchasePhone}
                </a>
              ) : (
                `采购人：${orderInfo.purchaseName}`
              )}
            </div>
            {/* <div className={[styles.text, styles.ellipsis].join(" ")}>
                <span className={[styles.icon, styles.addr].join(" ")}></span>
                浙江省杭州市西湖区浙江大学医学院附属第一医院
            </div> */}
          </div>
        </div>
        <div className={[styles.item]}>
          <OverText>备注：{orderInfo.purchaseRemark || '无'}</OverText>
        </div>
      </div>
      <div className={styles.content} style={{ margin: '160px 0 50px' }}>
        <div className={styles.list}>
          <div className={styles.item}>
            <span style={{ fontSize: '15px', color: '#4B4B4B' }}>采购明细</span>
            <div className={styles.sum}>
              合计数量：<span style={{ color: '#333' }}>{orderInfo.formQty}</span>&nbsp; 合计金额：￥<span style={{ color: '#C90909' }}>{orderInfo.formAmount}</span>
            </div>
          </div>
          {orderInfo.items.map(orderItem => (
            <div className={styles.item} key={orderItem.itemId}>
              <div style={{ fontSize: '14px', color: '#333' }} className={styles.text}>
                {orderItem.materialsName}
              </div>
              <div className={styles.text}>{orderItem.materialsSku} </div>
              <div className={styles.text} style={{ marginTop: '10px' }}>
                ¥{orderItem.materialsPrice}
              </div>
              <div className={styles.right}>
                ×{orderItem.purchaseQty}
                {orderItem.skuUnitText}
                {orderItem.skuUnitText === orderItem.packageUnitText || !orderItem.packageUnitText
                  ? ''
                  : `(${orderItem.purchasePackageQty}${orderItem.packageUnitText})`}
              </div>
            </div>
          ))}
        </div>
      </div>
      {orderInfo.confirmStatus || orderInfo.formStatus !== 1 ? (
        ''
      ) : (
        <div className={styles.toolbar}>
          <div className={styles.orderSum} />
          <div className={styles.buttonWrap}>
            <Row gutter={20}>
              <Col span={8}>
                <Button type="primary" onClick={handleConfirm(1)} className={styles.btn}>
                  准时发货
                </Button>
              </Col>
              <Col span={8}>
                <Button type="primary" onClick={handleConfirm(2)} className={styles.btn}>
                  延期发货
                </Button>
              </Col>
              <Col span={8}>
                <Button type="primary" onClick={handleConfirm(3)} className={styles.btn}>
                  暂时缺货
                </Button>
              </Col>
            </Row>
          </div>
        </div>
      )}
    </div>
  )
}

ConfirmOrder.propTypes = {
  orderInfo: PropTypes.object,
  onConfirm: PropTypes.func,
}

export default ConfirmOrder
