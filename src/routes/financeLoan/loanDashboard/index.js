import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Link } from 'dva/router'
import { Row, Col, Card, Button, Spin } from 'antd'
import LoanApply from '../../../assets/loanApply.png'
import { getBasicFn } from '../../../utils/index'
import { Breadcrumb } from '../../../components'

import styles from './index.less'

const namespace = 'loanDashboard'
const propTypes = {
  loanDashboard: PropTypes.object,
  loading: PropTypes.object,
}
const LoanDashboard = ({ loanDashboard, loading }) => {
  const { getLoading, dispatchAction } = getBasicFn({ namespace, loading })
  const { data } = loanDashboard
  const statisticsContent = statisticsData => (
    <Row className={styles.statisticsBox}>
      {statisticsData.map(item => (
        <Col span={8} key={item.title}>
          <Card title={item.title} className={styles.statisticsCard}>
            {item.statistics.map((line) => {
              const dom = (<div className={styles.statisticsItem}>
                <span style={{ marginRight: '10px' }}>{line.name}</span>
                <span className={line.redFlag ? 'aek-red' : ''}>({line.number})</span>
                {line.amount ? (
                  <div className={styles.expandAmount}>
                    {line.amount.name}:<span className="aek-fill-15" />
                    {line.amount.number}
                  </div>
                ) : (
                  ''
                )}
              </div>)
              if (line.redFlag) {
                return (<Link key={line.name} to={line.url}>
                  {dom}
                </Link>)
              }
              return <div key={line.name}>{dom}</div>
            },
            )}
          </Card>
        </Col>
      ))}
    </Row>
  )
  return (
    <div className="aek-layout">
      <div className="bread">
        <Breadcrumb />
      </div>
      <Card className="aek-full-card" title="贷款首页" bordered={false}>
        <Row className={styles.topContainer}>
          <Col span={16}>
            <Spin spinning={getLoading('queryData')}>{statisticsContent(data)}</Spin>
          </Col>
          <Col span={8}>
            <div className={styles.entryBox}>
              <Card
                className={styles.enyrtItem}
                style={{ backgroundImage: `url(${LoanApply})`, backgroundRepeat: 'no-repeat', backgroundSize: '100%' }}
              >
                <div className={styles.entryText}>耗材应收款质押贷款</div>
                <Button
                  type="primary"
                  className={styles.entryBtn}
                  onClick={() => {
                    dispatchAction({
                      type: 'getApplyVerify',
                    })
                  }}
                >立即申请</Button>
              </Card>
              <Card className={styles.enyrtItem}>
                <div className={styles.entryText}>设备采购合同贷款</div>
                <Button disabled type="primary" className={styles.entryBtn}>
                  正在开发中...
                </Button>
              </Card>
            </div>
          </Col>
        </Row>
        <Card title="贷款流程" className={styles.loanFlow}>
          <Row>
            <Col span={8} style={{ padding: '0px 20px' }}>
              <span className="aek-primary-color">阶段一</span>
              <div className={styles.stepBox}>
                <div className={styles.stepTitle}>
                  {/* <Avatar className={styles.stepTitleIcon} icon="user" /> */}
                  <div className={`${styles.setpImage} ${styles.stepFirst}`} />
                  <span className={styles.stepTitleText}>提交申请资料</span>
                </div>
                <ul className={styles.stepContent}>
                  <li>1、选择医院</li>
                  <li>2、选择入库单</li>
                  <li>3、上传发票与供货资质</li>
                  <li>4、确认贷款金额</li>
                </ul>
              </div>
            </Col>
            <Col span={8} style={{ padding: '0px 20px' }}>
              <span className="aek-primary-color">阶段二</span>
              <div className={styles.stepBox}>
                <div className={styles.stepTitle}>
                  {/* <Avatar className={styles.stepTitleIcon} icon="user" /> */}
                  <div className={`${styles.setpImage} ${styles.stepSecond}`} />
                  <span className={styles.stepTitleText}>银行审核</span>
                </div>
                <ul className={styles.stepContent}>
                  <li>1、审核发票</li>
                  <li>2、确认贷款资金与自有资金</li>
                </ul>
              </div>
            </Col>
            <Col span={8} style={{ padding: '0px 20px' }}>
              <span className="aek-primary-color">阶段三</span>
              <div className={styles.stepBox} style={{ border: 'none' }}>
                <div className={styles.stepTitle}>
                  {/* <Avatar className={styles.stepTitleIcon} icon="user" /> */}
                  <div className={`${styles.setpImage} ${styles.stepThird}`} />
                  <span className={styles.stepTitleText}>贷款成功</span>
                </div>
                <ul className={styles.stepContent}>
                  <li>1、贷款金额放款到结算账户</li>
                  <li>2、支付到委托账户</li>
                </ul>
              </div>
            </Col>
          </Row>
        </Card>
      </Card>
    </div>
  )
}

LoanDashboard.propTypes = propTypes
export default connect(({ loanDashboard, loading }) => ({ loanDashboard, loading }))(LoanDashboard)
