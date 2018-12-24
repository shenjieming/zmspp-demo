import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col, Button, Icon, Tooltip, Spin } from 'antd'
import { cloneDeep } from 'lodash'
import { Link } from 'dva/router'
import Breadcrumb from '../../../components/Breadcrumb'
import { getBasicFn } from '../../../utils/index'
import Style from './index.less'

const namespace = 'accountBalance'
function AccountBalance({
  accountBalance,
  loading,
}) {
  const { dispatchAction, getLoading } = getBasicFn({ namespace, loading })
  const { balance, buttonVisible } = accountBalance

  const drawClick = () => {
    const visible = cloneDeep(buttonVisible)
    dispatchAction({
      payload: {
        buttonVisible: !visible,
      },
    })
  }
  return (
    <div className="aek-layout">
      <div className="bread">
        <Breadcrumb />
      </div>
      <div className="content">
        <Spin spinning={getLoading('getBalance')}>
          <div className="aek-content-title">账户金额</div>
          <div>
            <Row >
              <Col span={7}>
                <Row>
                  <Col className={`${Style.title}`}>总金额<span className="aek-text-disable" style={{ fontSize: '12px' }}>（单位：元）</span></Col>
                </Row>
                <Row>
                  <Col className={`${Style.accountNum}`}>{buttonVisible ? '****' : balance.balance}</Col>
                </Row>
                <Row>
                  <Col className="aek-text-disable" style={{ fontSize: '12px' }}>总金额 = 可用金额 + 冻结金额</Col>
                </Row>
              </Col>
              <Col span={7} className={`${Style['list-center']}`} style={{ paddingLeft: '15px' }}>
                <Row>
                  <Col className={`${Style.title}`}>可提现金额<span className="aek-text-disable" style={{ fontSize: '12px' }}>（单位：元）</span></Col>
                </Row>
                <Row>
                  <Col className={`${Style.accountNum}`}>{buttonVisible ? '****' : balance.canUseAmount}</Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Button
                      type="primary"
                      onClick={() => {
                        dispatchAction({
                          type: 'getApplyVerify',
                        })
                      }}
                    >提现</Button>
                    <a
                      className="aek-pl10"
                      onClick={() => {
                        drawClick()
                      }}
                    >{buttonVisible ? '显示金额' : '隐藏金额'}</a>
                  </Col>
                </Row>
              </Col>
              <Col span={7} style={{ paddingLeft: '15px' }}>
                <Row>
                  <Col className={`${Style.title}`}>冻结金额
                    <span className="aek-text-disable" style={{ fontSize: '12px' }}>（单位：元）</span>
                    <Tooltip
                      placement="bottom"
                      title={() => (<div><p>冻结金额一般会存在以下情况</p>
                        <p>1、银行相关服务费用未缴纳</p>
                        <p>2、您当前所在的机构机构经过银行评估之后被纳入风险名单</p>
                        <p>3、其他银行相关要求</p>
                        <p>温馨提示：金额冻结具体原因以银行具体通知为准。</p>
                      </div>)}
                    ><Icon className={`${Style.tip} aek-pl10`} type="question-circle" /></Tooltip>
                  </Col>
                </Row>
                <Row>
                  <Col className={`${Style.accountNum}`}>{buttonVisible ? '****' : balance.frozenAmount}</Col>
                </Row>
              </Col>
            </Row>
          </div>
        </Spin>
      </div>
    </div>
  )
}

AccountBalance.propTypes = {
  accountBalance: PropTypes.object,
  loading: PropTypes.object,
}

export default connect(({ accountBalance, loading }) => ({
  accountBalance,
  loading,
}))(AccountBalance)
