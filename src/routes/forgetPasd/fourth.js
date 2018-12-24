import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Button } from 'antd'
import CountDown from '../../components/CountUp'
import { routerRedux } from 'dva/router'
import success from '../../assets/success.gif'
import Styles from './index.less'

class Fourth extends React.Component {
  componentDidMount() {
    this.mount = true
  }

  componentWillUnmount() {
    this.mount = false
  }

  render() {
    const dispatch = this.props.dispatch

    return (
      <Row>
        <Col span="9">
          <div className="aek-text-right">
            <img src={success} alt="密码重置成功" />
          </div>
        </Col>
        <Col span="15">
          <h2 className="aek-text-left" style={{ marginTop: '20px' }}>
          密码设置成功
          </h2>
          <p className="aek-text-help aek-text-left aek-mtb10 aek-font-small">
            请牢记您设置的新密码
          </p>
          <p className="aek-text-left aek-text-help aek-mt30 aek-font-small">
            <Button
              type="primary"
              onClick={() => { dispatch(routerRedux.replace({ pathname: '/login' })) }}
            >
              立即登录
            </Button>
            <CountDown
              className="aek-ml20"
              start={30}
              end={0}
              duration={30}
              suffix="s"
              useEasing={false}
              onComplete={() => {
                if (this.mount) {
                  dispatch(routerRedux.replace({ pathname: '/login' }))
                }
              }}
            />后将会自动跳转到登录页面！
          </p>
        </Col>
      </Row>
    )
  }
}

Fourth.propTypes = {
  dispatch: PropTypes.func.isRequired,
}

export default Fourth
