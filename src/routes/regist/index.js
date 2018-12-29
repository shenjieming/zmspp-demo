import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Button } from 'antd'
import { debounce } from 'lodash'
import Supplier from './supplier'
import Hospital from './hospital'
import styles from './page.less'
import Success from './countDown'
import Page from './page'

const Regist = ({ regist, dispatch, effects }) => {
  const {
    captchaClearVisible,
    countDownStatus,
    checkCodeStatus,
    mobileClearVisible,
    supplierList, // 供应商列表
    hospitalList,
    usernameUnique, // 用户名唯一性校验
    usernameUniqueText, // 用户名唯一性文本提示
    mobileUnique, // 手机号码唯一性校验
    mobileUniqueText, // 手机号唯一性文本提示
    pageVisible, // 页面切换
    pageDefaultVisible, // 默认显示我的供应商注册页面
  } = regist
  // 更改快速清空按钮visible
  const handleClearVisibleChange = (type, visible) => {
    dispatch({
      type: 'regist/updateState',
      payload: {
        [`${type}ClearVisible`]: visible,
      },
    })
  }
  const handleValueChange = (type, value) => {
    dispatch({
      type: 'login/updateState',
      payload: {
        [`${type}/Value`]: value,
      },
    })
  }
  const handl = (value) => {
    dispatch({ type: 'regist/getSupplierList', payload: { keywords: value } })
  }
  const handleChange = debounce(handl, 500, { trailing: true })
  const hospitalHanld = (value) => {
    dispatch({ type: 'regist/getHospitalList', payload: { keywords: value } })
  }
  const hosHandleChange = debounce(hospitalHanld, 500, { trailing: true })
  // 供应商参数
  const supplierProps = {
    dispatch,
    effects,
    captchaClearVisible,
    countDownStatus,
    mobileClearVisible,
    handleCountDownComplete() {
      dispatch({ type: 'regist/updateState', payload: { countDownStatus: false } })
    },
    checkCodeStatus,
    handleClickGetCaptcha: debounce((data) => {
      dispatch({ type: 'regist/getMobileCaptcha', payload: { mobile: data } })
    }, 500),
    supplierRegist: debounce((payload) => {
      dispatch({ type: 'regist/postResist', payload })
    }, 500),
    handleSwitchCheckCodeStatus: (flag) => {
      dispatch({ type: 'regist/updateState', payload: { checkCodeStatus: flag } })
    },
    handleCaptchaStatusChange: (payload) => {
      dispatch({ type: 'regist/updataState', payload })
    },
    handleClearVisibleChange,
    handleValueChange,
    supplierList, // 供应商列表
    usernameUnique, // 用户名唯一性校验
    usernameUniqueText, // 用户名唯一性文本提示
    mobileUnique, // 手机号码唯一性校验
    mobileUniqueText, // 手机号唯一性文本提示
    handle(value) {
      handleChange(value)
    },
  }
  // 医院参数
  const hospitalProps = {
    effects,
    captchaClearVisible,
    countDownStatus,
    mobileClearVisible,
    handleCountDownComplete() {
      dispatch({ type: 'regist/updateState', payload: { countDownStatus: false } })
    },
    checkCodeStatus,
    handleClickGetCaptcha: debounce((data) => {
      dispatch({ type: 'regist/getMobileCaptcha', payload: { mobile: data } })
    }, 500),
    supplierRegist: debounce((payload) => {
      dispatch({ type: 'regist/postResist', payload })
    }, 500),
    handleSwitchCheckCodeStatus: (flag) => {
      dispatch({ type: 'regist/updateState', payload: { checkCodeStatus: flag } })
    },
    handleCaptchaStatusChange: (payload) => {
      dispatch({ type: 'regist/updataState', payload })
    },
    handleClearVisibleChange,
    handleValueChange,
    hospitalList, // 医院列表
    usernameUnique, // 用户名唯一性校验
    usernameUniqueText, // 用户名唯一性文本提示
    mobileUnique, // 手机号码唯一性校验
    mobileUniqueText, // 手机号唯一性文本提示
    handle(value) {
      hosHandleChange(value)
    },
  }
  // 面板切换
  const onChange = (flag) => {
    dispatch({
      type: 'regist/updateState',
      payload: {
        ...regist,
        pageDefaultVisible: flag,
      },
    })
  }
  const successProps = {
    dispatch,
  }
  return (
    <Page>
      <div className={styles.form}>
        <div className={styles.contentWrap}>
          <div className={styles.formContent}>
            <div className={styles.regist}>
              {pageVisible ? (
                <Success {...successProps} />
              ) : (
                <div>
                  <div className={styles.left}>
                    <Button type={`${pageDefaultVisible ? 'primary' : ''}`} onClick={() => { onChange(true) }} key="supplier" className={`${styles.registTabsButton}`}>我是供应商</Button>
                    {/*<Button type={`${pageDefaultVisible ? '' : 'primary'}`} onClick={() => { onChange(false) }} key="hospital" className={`${styles.registTabsButton} aek-mt10`}>我是医院</Button>*/}
                  </div>
                  <div className={styles.right}>
                    {pageDefaultVisible ? <Supplier {...supplierProps} /> : <Hospital {...hospitalProps} />}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Page>
  )
}

Regist.propTypes = {
  regist: PropTypes.object,
  dispatch: PropTypes.func,
  effects: PropTypes.object,
}

export default connect(({ regist, loading: { effects } }) => ({ regist, effects }))(Regist)
