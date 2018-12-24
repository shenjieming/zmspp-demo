import React from 'react'
import PropTypes from 'prop-types'
import { Card, Icon, Spin, Radio } from 'antd'
import Styles from './index.less'

const propTypes = {
  addressArr: PropTypes.array,
  setDetailed: PropTypes.func,
  editAddress: PropTypes.func,
  deleteAddress: PropTypes.func,
  setReceipt: PropTypes.func,
  loading: PropTypes.bool,
  receiptId: PropTypes.string,
  type: PropTypes.string,
}

function ReceiptAddressCard({
  addressArr,
  loading,
  editAddress,
  deleteAddress,
  setDetailed,
  type,
  receiptId,
  setReceipt,
}) {
  const getAddressStr = str =>
    (str ? str.split(' ').filter((_, idx) => idx > 2).join(' ') : '')

  const getCardList = (list) => {
    const lastCard = [
      <Card className={Styles.addCard} key={0} onClick={() => { editAddress() }}>
        <Icon type="plus" className={Styles.plus} />
      </Card>,
    ]
    const cardArr = list.map((item, key) => (
      <Card className={Styles.card} key={key + 1} bodyStyle={{ padding: 0 }}>
        <div className={Styles.cardTop}>
          <div className={Styles.pTop}>
            {item.receiptContactName}
            <span>{item.receiptContactPhone}</span>
          </div>
          <p className="aek-text-help" style={{ fontSize: 12 }}>
            {getAddressStr(item.receiptMasterAddress)} {item.receiptDetailAddress}
          </p>
        </div>
        {
          type === 'edit' ?
            <div className={Styles.cardBottom}>
              <div>
                {
                  item.receiptDefaultFlag ?
                    <Radio checked>已设为默认收货地址</Radio> :
                    <Radio
                      checked={false}
                      onClick={() => { setDetailed(item.receiptId) }}
                    >设为默认收货地址</Radio>
                }
              </div>
              <Icon
                type="edit"
                className={Styles.iconMarg}
                onClick={() => { editAddress(item) }}
              />
              {
                !item.receiptDefaultFlag
                  ? <Icon
                    type="delete"
                    className={Styles.iconMarg}
                    onClick={() => { deleteAddress(item.receiptId) }}
                  />
                  : null
              }
            </div> :
            <div className={Styles.cardBottom}>
              <div>
                {
                  receiptId === item.receiptId ?
                    <Radio checked>已设为收货地址</Radio> :
                    <Radio
                      checked={false}
                      onClick={() => { setReceipt(item) }}
                    >设为收货地址</Radio>
                }
              </div>
              <Icon
                type="edit"
                className={Styles.iconMarg}
                onClick={() => { editAddress(item) }}
              />
            </div>
        }
      </Card>
    ))
    return cardArr.concat(lastCard)
  }
  return (
    <Spin spinning={loading}>
      <div style={{ marginTop: 14, verticalAlign: 'top' }}>
        {getCardList(addressArr)}
      </div>
    </Spin>
  )
}

ReceiptAddressCard.propTypes = propTypes

export default ReceiptAddressCard
