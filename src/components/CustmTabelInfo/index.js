import React from 'react'
import PropTypes from 'prop-types'
import { Icon, Avatar } from 'antd'
import { stringify } from 'qs'
import { Link } from 'dva/router'
import { segmentation } from '../../utils'
import Styles from './index.less'
import Logo from '../../assets/lkc-org-logo.png'

const propTypes = {
  logoUrl: PropTypes.string,
  orgName: PropTypes.string,
  contactName: PropTypes.string,
  contactPhone: PropTypes.string,
  intranetOrgName: PropTypes.string,
  status: PropTypes.number,
  address: PropTypes.string,
  contactEditClick: PropTypes.func,
  to: PropTypes.string,
  query: PropTypes.object,
  isShowContact: PropTypes.bool,
  otherInfo: PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.array]),
  linkClick: PropTypes.func,
}

const getOtherInfo = (otherInfo) => {
  if (Array.isArray(otherInfo)) {
    return otherInfo.map((item, index) => <div key={index}>{item}</div>)
  }
  return <div>{otherInfo}</div>
}

const CustmTableInfo = ({
  logoUrl,
  orgName,
  contactName = '',
  contactPhone = '',
  intranetOrgName = '',
  address = '',
  status = 0,
  contactEditClick,
  isShowContact = false,
  to,
  query,
  otherInfo,
  linkClick,
}) => {
  const getCustomInfo = () => {
    if (logoUrl !== 'nil' && isShowContact) {
      if (contactName || contactPhone) {
        return (
          <p className="aek-text-help">
            <Icon type="phone" />
            {segmentation([contactName, contactPhone])}
            {contactEditClick && (
              <a onClick={contactEditClick} className="hover-edit">
                编辑
              </a>
            )}
          </p>
        )
      }
      return (
        <p>
          {contactEditClick && (
            <a onClick={contactEditClick}>
              添加联系人
            </a>
          )}
        </p>
      )
    }
    return null
  }
  return (
    <div className={Styles.swrap}>
      {logoUrl !== 'nil' ? (
        <div className={Styles.left}>
          <Avatar size="large" src={logoUrl || Logo} />
        </div>
      ) : null}
      <div className={Styles.right} style={logoUrl === 'nil' ? { width: 'auto' } : {}}>
        {to ? (
          <Link
            className="hover-a"
            onClick={linkClick ? () => {
              linkClick()
            } : () => { }}
            to={segmentation([to, stringify(query)], '?')}
          >
            {orgName}
          </Link>
        ) : (
          <p>{orgName}</p>
        )}
        {intranetOrgName && <p className="aek-text-help">{`内网名称：${intranetOrgName}`}</p>}
        {address && <p className="aek-text-help">{address}</p>}
        {getCustomInfo()}
        {otherInfo && getOtherInfo(otherInfo)}
        {status === 2 && (
          <p className="aek-text-disable">
            <Icon type="info-circle" style={{ color: '#108ee9' }} />
            对方已解除和你的往来关系
          </p>
        )}
      </div>
    </div>
  )
}

CustmTableInfo.propTypes = propTypes

export default CustmTableInfo
