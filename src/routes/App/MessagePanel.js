import React from 'react'
import { Popover, Icon, Badge, Row, Col, Avatar, Tooltip } from 'antd'
import { Link } from 'dva/router'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import styles from './MessagePanel.less'
import emptyMsg from '../../assets/emptyMsg.png'

function MessagePanel(props) {
  const { dataSource, setOneRead, handleSetAllRead } = props
  var length = 0
  if (dataSource.length) {
    length = dataSource.length
  }
  const msgTitle = (
    <div>
      <span>
        消息
        {!!length && <span className="aek-orange">({length}条未读)</span>}
      </span>
      {!!length && (
        <a onClick={handleSetAllRead} style={{ float: 'right' }}>
          全部设为已读
        </a>
      )}
    </div>
  )

  const msgContent = (
    <div className={styles.msgContent}>
      {length ? (
        <div className={styles.msgWrap}>
          {dataSource.map(x => (
            <div
              onClick={() => {
                setOneRead(x.msgId)
              }}
              key={x.msgId}
              className={styles.msgRow}
            >
              <Row>
                <Col span="3" style={{ textAlign: 'center' }}>
                  <Avatar shape="square" src={x.menuIconBig} size="small" />
                </Col>
                <Col span="18">
                  {x.msgUrl ? (
                    <Link to={x.msgUrl}>
                      <span className="aek-link aek-word-break">{x.msgContent}</span>
                      <div className={classnames(styles.msgTime, 'aek-text-disable')}>
                        {x.msgTime}
                      </div>
                    </Link>
                  ) : (
                    <div>
                      <div className="aek-word-break">{x.msgContent}</div>
                      <div className={classnames(styles.msgTime, 'aek-text-disable')}>
                        {x.msgTime}
                      </div>
                    </div>
                  )}
                </Col>
                <Col span="3" className={styles.msgBtnWrap}>
                  <Tooltip title="设为已读">
                    <Icon className={styles.msgBtn} type="check-circle-o" />
                  </Tooltip>
                </Col>
              </Row>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.noMsg}>
          <img src={emptyMsg} alt="没有消息" />
          <div className="aek-text-disable">暂无未读消息</div>
        </div>
      )}
      <div className={styles.msgContentFooter}>
        <Link to="/message/list">查看全部消息</Link>
      </div>
    </div>
  )

  const popoverProps = {
    title: msgTitle,
    content: msgContent,
    overlayClassName: styles.msgPopover,
    placement: 'bottomRight',
    arrowPointAtCenter: true,
    trigger: 'click',
  }

  return (
    <Popover {...popoverProps}>
      <Badge count={length}>
        <Icon type="bell" title="未读消息" style={{ cursor: 'pointer' }} />
      </Badge>
    </Popover>
  )
}

MessagePanel.propTypes = {
  dataSource: PropTypes.array.isRequired,
  setOneRead: PropTypes.func.isRequired,
  handleSetAllRead: PropTypes.func.isRequired,
}

export default MessagePanel
