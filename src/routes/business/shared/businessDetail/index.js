import React from 'react'
import { Spin, Upload } from 'antd'
import propTypes from 'prop-types'
import moment from 'moment'
import styles from './index.less'
import PhotoWall from '../../../../components/PhotoWall'
import { ZIP_DOWNLOAD } from '../../../../utils/config'

const PropTypes = {
  detail: propTypes.object,
  loading: propTypes.bool,
  replyBtn: propTypes.node,
}
const Detail = ({ detail, loading, replyBtn }) => {
  const {
    chanceContent,
    addTime,
    chanceStatus,
    chanceReleaseOrgName,
    chanceImageUrls,
    chanceLookTotalNum,
    chanceReplyTotalNum,
    chanceAppendixUrls,
    chanceTagText,
    currentOrgReleaseFlag,
    notGetCombineFlag,
  } = detail
  const statusText = [
    '',
    '草稿',
    '待审核',
    '审核未过',
    '发布中',
    '手动结束',
    '逾期结束',
    '达成合作',
    '已屏蔽',
  ]
  let text = statusText[chanceStatus]
  if (notGetCombineFlag) {
    text = '未达成合作'
  }
  return (
    <div className={styles.item}>
      <div className={styles.status}>{text}</div>
      <Spin spinning={loading}>
        <div className={styles.main}>
          <div className={styles.title}>
            <span className="aek-primary-color aek-font-large ">
              {chanceTagText ? `【${chanceTagText}】` : ''}
            </span>
            <span className="aek-font-large aek-text-bold">{chanceReleaseOrgName}</span>
            <div className="aek-gray aek-font-small">
              {addTime ? moment(new Date(addTime)).format('YYYY年MMMD日') : ''}
            </div>
          </div>
          <div className={`${styles.content} aek-clearfix`}>
            <div className={styles.textArea}>{chanceContent}</div>
            <PhotoWall urls={chanceImageUrls} />
            <div style={{ clear: 'both' }}>
              <Upload
                style={{ display: 'block' }}
                fileList={JSON.parse(chanceAppendixUrls || '[]').map((item, index) => ({
                  uid: index,
                  name: item.name,
                  url: `${ZIP_DOWNLOAD}${item.url}`,
                }))}
              />
            </div>
          </div>
        </div>
        <div className={styles.footer}>
          <span>
            <span className={styles.eyesIcon} />
            <span className="aek-gray aek-ml-10 aek-font-middle">
              {' '}
              {chanceLookTotalNum > 999
                ? `${(chanceLookTotalNum / 1000).toFixed(1)}K`
                : chanceLookTotalNum}
            </span>
            <span className={styles.divider} />
            <span className={styles.replyIcon} />
            <span className="aek-gray aek-ml-10 aek-font-middle">
              {' '}
              {chanceReplyTotalNum > 999
                ? `${(chanceReplyTotalNum / 1000).toFixed(1)}K`
                : chanceReplyTotalNum}
            </span>
          </span>
          {replyBtn && (
            <span
              className={styles.replyBtn}
              style={{ right: currentOrgReleaseFlag ? '340px' : '40px' }}
            >
              {replyBtn}
            </span>
          )}
        </div>
      </Spin>
    </div>
  )
}

Detail.propTypes = PropTypes
export default Detail
