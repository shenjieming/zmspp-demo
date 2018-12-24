import React from 'react'
import PropTypes from 'prop-types'
import { Avatar, Switch } from 'antd'
import Styles from './CfgPanel.less'
import { IMG_COMPRESS } from '../../../utils/config'

const propTypes = {
  data: PropTypes.object,
  onSwitch: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
}

function CfgPanel({ data, onSwitch, onToggle }) {
  const { menuName, templates } = data
  return (
    <div className={Styles.wrap}>
      <div className={Styles.head}>{menuName}</div>
      {templates.map(item => (
        <div className={Styles.content} key={item.msgTemplateId}>
          <div className={Styles.name}>
            <div>{item.msgTemplateName}</div>
            <div className="aek-text-disable aek-text-overflow">{item.msgDescription}</div>
          </div>
          <div className={Styles.switch}>
            <Switch
              checked={!item.disable}
              onChange={() => onToggle(item.msgTemplateId, !item.disable)}
            />
          </div>
          <div className={Styles.rest}>
            <div className={Styles.receiverWrap}>
              <span className={Styles.label}>接收人:</span>
              <div className={Styles.receivers}>
                {item.receiveUser.map((x) => {
                  const userImageUrl = x.userImageUrl && x.userImageUrl + IMG_COMPRESS

                  return (
                    <div key={x.userId} className={Styles.receiver}>
                      <Avatar className={Styles.avatar} src={userImageUrl} icon="user" />
                      <span className={Styles.realName}>{x.userRealName}</span>
                    </div>
                  )
                })}
              </div>
            </div>
            <a className={Styles.action} onClick={() => onSwitch(item)}>
              更换
            </a>
          </div>
        </div>
      ))}
    </div>
  )
}

CfgPanel.propTypes = propTypes

export default CfgPanel
