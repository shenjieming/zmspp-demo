import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Spin, Badge } from 'antd'
import { Link } from 'dva/router'

import { getBasicFn } from '../../../utils/index'
import { Breadcrumb } from '../../../components'
import Graph from './graph'
import styles from './index.less'

const namespace = 'accountBoard'
const propTypes = {
  accountBoard: PropTypes.object,
  loading: PropTypes.object,
}
const IndexPage = ({ accountBoard, loading }) => {
  const { dispatchAction, getLoading } = getBasicFn({ namespace, loading })
  const { data, currentData } = accountBoard
  const slicePeriodNo = (periodNo) => {
    if (!periodNo) {
      return '   年   月'
    }
    const periodNoString = String(periodNo)
    const year = periodNoString.slice(0, 4)
    const month = periodNoString.slice(4)
    return `${year}年${month}月`
  }
  return (
    <div className="aek-layout">
      <div className="bread">
        <Breadcrumb />
      </div>
      <div className="content">
        <div className="aek-layout-hor">
          <div className={styles.left}>
            <div className={styles.title}>对账日期</div>
            {data.map((item) => {
              const current = item.periodNo === currentData.periodNo
              return (
                <div
                  key={item.periodNo}
                  className={`${styles.periodItem} ${current ? styles.currentItem : ''}`}
                  onClick={() => {
                    dispatchAction({
                      type: 'setCurrentData',
                      payload: { periodNo: item.periodNo },
                    })
                  }}
                >
                  {slicePeriodNo(item.periodNo)}
                  {item.status.length > 0 ? (
                    <Badge className={styles.errorPoint} status="error" />
                  ) : (
                    ''
                  )}
                </div>
              )
            })}
          </div>
          <div className={styles.center}>
            <Spin spinning={getLoading('queryData')}>
              <div className="aek-content-title">对账详情</div>
              <div className={styles.cardArea}>
                <div className={styles.aekCard}>
                  <div>
                    <span className="aek-orange">零库存</span>-省招入库金额
                  </div>
                  <div className={`aek-orange ${styles.bigFont}`}>
                    {currentData.stockinAmount || '0.00'}
                  </div>
                </div>
                <div className={styles.card}>
                  <div>
                    <span className="aek-orange">省采购平台</span>-采购金额
                  </div>
                  <div className={`aek-gray ${styles.bigFont}`}>
                    {currentData.apiPurchaseAmount || '0.00'}
                  </div>
                </div>
                <div className={styles.card}>
                  <div>
                    <span className="aek-orange">省采购平台</span>-已发货
                  </div>
                  <div className={`aek-gray ${styles.bigFont}`}>
                    {currentData.apiSendAmount || '0.00'}
                  </div>
                </div>
                <div className={styles.card}>
                  <div>
                    <span className="aek-orange">省采购平台</span>-已入库
                  </div>
                  <div className={`aek-gray ${styles.bigFont}`}>
                    {currentData.apiStockinAmount || '0.00'}
                  </div>
                </div>
              </div>
              <div className={styles.graphContainer}>
                <div className="aek-fr">对账日期：{slicePeriodNo(currentData.periodNo)}</div>
                <Graph
                  data={[
                    { name: '零库存-省招入库金额', value: Number(currentData.stockinAmount) },
                    { name: '省采购平台-采购金额', value: Number(currentData.apiPurchaseAmount) },
                    { name: '省采购平台-已发货', value: Number(currentData.apiSendAmount) },
                    { name: '省采购平台-已入库', value: Number(currentData.apiStockinAmount) },
                  ]}
                />
              </div>
            </Spin>
          </div>
          <div className={styles.right}>
            <div className="aek-content-title">本期数据问题</div>
            {currentData.status.length > 0 ? (
              <div className={styles.errorArea}>
                <div>
                  <Badge className={styles.errorPoint} status="error" />
                  <span style={{ color: 'red' }}>本期数据存在如下问题:</span>
                </div>
                {currentData.status.map((item, index) => (
                  <div key={index}>
                    {index + 1}、{item.text}
                    {item.url ? <Link to={item.url}>点这里查看</Link> : ''}
                  </div>
                ))}
              </div>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

IndexPage.propTypes = propTypes
export default connect(({ accountBoard, loading }) => ({ accountBoard, loading }))(IndexPage)
