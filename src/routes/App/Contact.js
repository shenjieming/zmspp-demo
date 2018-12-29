import React from 'react'
import PropTypes from 'prop-types'
import { Avatar, Popover, Row, Col } from 'antd'
import QQ from '../../assets/QQ.svg'
import telePhone from '../../assets/telephone.svg'
import wechat from '../../assets/weChat.svg'
import wechatQR from '../../assets/wechat-qrcode.png'
import { CONSUMER_HOTLINE, CONSUMER_QQ } from '../../utils/config'
import styles from './Contact.less'

function Contact({ className }) {
  return (
    <div className={className}>
      {/*<div className={`${styles.phone}`}>*/}
        {/*/!*<div><span className="aek-text-bold">客服热线:</span>(工作日9:00~17:30)</div>*!/*/}
        {/*/!*<div><span className={styles.hotLine}>{CONSUMER_HOTLINE}</span><span>(QQ同号)</span></div>*!/*/}
      {/*</div>*/}
      {/*<Row>*/}
        {/*<Col span="8" style={{ textAlign: 'left' }}>*/}
          {/*<Popover content={`客服电话: ${CONSUMER_HOTLINE}`} arrowPointAtCenter>*/}
            {/*<Avatar src={telePhone} />*/}
          {/*</Popover>*/}
        {/*</Col>*/}
        {/*<Col span="8" className="aek-text-center">*/}
          {/*<Avatar*/}
            {/*style={{ cursor: 'pointer' }}*/}
            {/*onClick={() => {*/}
              {/*document.getElementById('qqBox').click()*/}
            {/*}}*/}
            {/*src={QQ}*/}
          {/*/>*/}
        {/*</Col>*/}
        {/*<Col span="8" style={{ textAlign: 'right' }}>*/}
          {/*<Popover*/}
            {/*content={*/}
              {/*<div className={styles.qrcodeWrap}>*/}
                {/*<img src={wechatQR} alt="微信二维码" />*/}
              {/*</div>*/}
            {/*}*/}
            {/*arrowPointAtCenter*/}
            {/*placement="top"*/}
          {/*>*/}
            {/*<Avatar src={wechat} />*/}
          {/*</Popover>*/}
        {/*</Col>*/}
      {/*</Row>*/}
    </div>
  )
}

Contact.propTypes = {
  className: PropTypes.string,
}

export default Contact
