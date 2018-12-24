import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Button, Card, Spin, Modal } from 'antd'
import APanel from '../../../components/APanel'
import Breadcrumb from '../../../components/Breadcrumb'
import { getBasicFn } from '../../../utils/index'
import styles from './index.less'

const namespace = 'mall'
const Mall = ({ mall, loading }) => {
  const { getLoading } = getBasicFn({ namespace, loading })
  const { dataList } = mall
  const getPrice = (item) => {
    const { commodityPromotionsPrice, commodityOriginalPrice } = item
    if (!commodityPromotionsPrice) {
      return (
        <div>
          <span className={styles.currentPrice}>
            <span className={styles.superLarge}>{commodityOriginalPrice}</span>积分
          </span>
        </div>
      )
    }
    return (
      <div>
        <span className={styles.currentPrice}>
          <span className={styles.superLarge}> {commodityPromotionsPrice}</span>积分
        </span>
        <span className={styles.deletePrice}>原价:{commodityOriginalPrice}积分</span>
      </div>
    )
  }
  return (
    <div className="aek-layout">
      <div className="bread">
        <Breadcrumb />
      </div>
      <Spin spinning={getLoading('getData')}>
        <APanel
          title="积分商城"
          extra={
            <a
              href="http://www.aek56.com/helpArticle?articleId=6EB6B0D5BCC94B0F8C62F1B74115C6F6&relateId=0B1D2678A1B84FDEBF53A2E4465DF50E"
              target="_blank"
            >
              积分规则
            </a>
          }
        >
          {dataList.map((item) => {
            const {
              commodityName,
              commodityId,
              commodityPromotionsIntegral,
              commodityInventory,
              commodityStatus,
            } = item
            return (
              <Card key={commodityId} className={styles.commodity}>
                <div className={styles.customImage}>
                  <img alt="example" width="100%" src={item.commodityImageUrl} />
                </div>
                <div className={styles.customCard}>
                  <div className={styles.prodName}>{commodityName}</div>
                  {getPrice(item)}
                  <div style={{ color: '#999' }}>
                    <span style={{ display: 'inline-block', width: '50%' }}>
                      销量:{commodityPromotionsIntegral}
                    </span>
                    <span>库存:{commodityInventory}</span>
                  </div>
                  {commodityStatus === 1 ? (
                    <Button
                      className={styles.buttonEnable}
                      size="large"
                      type="primary"
                      onClick={() => {
                        Modal.warning({
                          content: '功能正在开发中,敬请期待!',
                        })
                      }}
                    >
                      立即兑换
                    </Button>
                  ) : (
                    <Button className={styles.buttonDisable} size="large" disabled>
                      已售空
                    </Button>
                  )}
                </div>
              </Card>
            )
          })}
        </APanel>
      </Spin>
    </div>
  )
}

Mall.propTypes = {
  mall: PropTypes.object,
  loading: PropTypes.object,
}
export default connect(({ mall, loading }) => ({
  mall,
  loading,
}))(Mall)
