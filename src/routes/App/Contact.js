import React from 'react'
import PropTypes from 'prop-types'
import { Avatar, Popover, Row, Col } from 'antd'
import QQ from '../../assets/QQ.svg'
import telePhone from '../../assets/telephone.svg'
import wechat from '../../assets/weChat.svg'
import wechatQR from '../../assets/wechat-qrcode.png'
import { CONSUMER_HOTLINE, CONSUMER_QQ } from '../../utils/config'
import doc1 from '../gyszz.pdf'
import doc2 from '../khtz.pdf'
import doc3 from '../czscyy.docx'
import doc4 from '../ptczsc.pdf'
import styles from './Contact.less'

function Contact({ className }) {
  return (
    <div className={className} style={{textAlign: 'left'}}>
      帮助文档

      <div className={`${styles.phone}`}>
        {/*<div><span className="aek-text-bold">客服热线:</span>(工作日9:00~17:30)</div>*/}
        {/*<div><span className={styles.hotLine}>{CONSUMER_HOTLINE}</span><span>(QQ同号)</span></div>*/}
      </div>
      <Row>
        <p className={styles.docTitle}>
          <a href={doc1} target="_blank" title='供应商证件推送及送审注意事项'>供应商证件推送及送审注意事项</a>
        </p>
        <p className={styles.docTitle}>
          <a href={doc2} target="_blank" title='中南大学湘雅医院供应商平台开户通知'>中南大学湘雅医院供应商平台开户通知</a>
        </p>
        <p className={styles.docTitle}>
          <a href={doc3} target="_blank" title='中南大学湘雅医院平台操作手册（医院）'>中南大学湘雅医院平台操作手册（医院）</a>
        </p>
        <p className={styles.docTitle}>
          <a href={doc4} target="_blank" title='中南大学湘雅医院供应商平台操作手册'>中南大学湘雅医院供应商平台操作手册</a>
        </p>
      </Row>
    </div>
  )
}

Contact.propTypes = {
  className: PropTypes.string,
}

export default Contact
