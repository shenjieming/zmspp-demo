import React from 'react'
import propTypes from 'prop-types'
import { Spin } from 'antd'
import moment from 'moment'
import PhotoWall from '../../../../components/PhotoWall'
import styles from './index.less'

const PropTypes = {
  data: propTypes.array,
  loading: propTypes.bool,
}
const SessionList = ({ data, loading }) => (
  <div className={styles.sessionContainer}>
    <Spin spinning={loading}>
      {data.map((item) => {
        const {
          replayOrgType,
          replayOrgName,
          replayContent,
          addTime,
          replaySessionId,
          replayImageUrls,
          addName,
        } = item
        return (
          <div
            className={`${styles.sessionItem} ${replayOrgType === 1 ? 'publish' : ''}`}
            key={replaySessionId}
          >
            <span className="aek-text-bold">
              {replayOrgName} - {addName}:{' '}
            </span>
            {replayContent}
            <PhotoWall urls={replayImageUrls} />
            <div className="aek-gray" style={{ clear: 'both' }}>
              {moment(new Date(addTime)).format('YYYY年MMMD日 HH:mm:ss')}
            </div>
          </div>
        )
      })}
    </Spin>
  </div>
)

SessionList.propTypes = PropTypes
export default SessionList
