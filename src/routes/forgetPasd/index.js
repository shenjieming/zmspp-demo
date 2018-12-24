import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Steps } from 'antd'
import First from './first'
import Second from './second'
import Third from './third'
import Fourth from './fourth'
import Styles from './index.less'
import Page from '../regist/page'
import styles from '../regist/page.less'

const Step = Steps.Step

const ForgetPasd = ({ forgetPasd, dispatch }) => {
  const {
    stepCurrent,
    imageCaptchaUrl,
    userInfo,
    selectType,
    countDownStatus,
    customerVisible,
  } = forgetPasd
  // 第一步所需要数据
  const firstProps = {
    imageCaptchaUrl,
    dispatch,
  }
  // 第二步用户信息
  const secondProps = {
    userInfo,
    dispatch,
    selectType,
    countDownStatus,
    customerVisible,
  }
  // 第三步用户信息
  const thirdProps = {
    userInfo,
    dispatch,
  }
  const fourthProps = {
    dispatch,
  }
  const steps = [
    {
      description: '填写账户名',
      content: <First {...firstProps} />,
    },
    {
      description: '验证身份',
      content: <Second {...secondProps} />,
    },
    {
      description: '设置新密码',
      content: <Third {...thirdProps} />,
    },
    {
      description: '完成',
      content: <Fourth {...fourthProps} />,
    },
  ]
  return (
    <Page>
      <div className={styles.form}>
        <div className={styles.contentWrap}>
          <div className={styles.formContent}>
            <div className={styles.forget}>
              <Steps className={Styles['steps-components']} current={stepCurrent}>
                {steps.map(item => <Step key={item.description} title={item.description} />)}
              </Steps>
              <div style={{ marginTop: '50px' }} className="steps-content">
                {steps[stepCurrent].content}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Page>
  )
}

ForgetPasd.propTypes = {
  forgetPasd: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ forgetPasd }) => ({ forgetPasd }))(ForgetPasd)
