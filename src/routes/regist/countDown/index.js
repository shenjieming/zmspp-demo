import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'antd'
import CountDown from '../../../components/CountUp'
import { routerRedux } from 'dva/router'
import success from '../../../assets/success.gif'
import Styles from '../page.less'

class Success extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.mount = true
  }

  componentWillUnmount() {
    this.mount = false
  }
  render() {
    const dispatch = this.props.dispatch

    return (
      <div className={Styles.success}>
        <div className={Styles.left}>
          <img src={success} alt="注册成功" />
        </div>
        <div className={Styles.right}>
          <h1 className="aek-text-left aek-ptb10">恭喜您注册成功</h1>
          <p className="aek-font-small aek-text-help">请牢记用户名及密码，用户名就是下次登录的登录账号</p>
          <p style={{ marginTop: '20px' }} className="aek-text-help aek-font-small">
            <Button
              type="primary"
              onClick={() => {
                dispatch(routerRedux.replace({ pathname: '/login' }))
              }}
            >
              立即登录!
            </Button>
            <CountDown
              start={30}
              end={0}
              duration={30}
              suffix="s"
              useEasing={false}
              style={{ marginLeft: '20px' }}
              onComplete={() => {
                if (this.mount) {
                  dispatch(routerRedux.replace({ pathname: '/login' }))
                }
              }}
            />后将会自动跳转到登录页面！
          </p>
        </div>
      </div>
    )
  }
}

export default Success
