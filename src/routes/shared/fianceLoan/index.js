import React from 'react'
import { Checkbox, Icon } from 'antd'
import { PhotoWall } from '@components'
import Styles from './index.less'

// 发票上传类型
const photoType = [
  '中标通知书',
  '销售合同',
  '采购合同',
  '配送资质',
  '上游发票',
]
/**
 *  @desc 资质发票数组
 *  @param imageList array 图片信息  必传
 *  @param checkChange func 选中事件  非必传
 *  @param deleteChage func 删除事件  非必传
 *  @return node
 */
const popoverPhotoList = ({
  imageList = [],
  checkChange,
  deleteClick,
}) => {
  const retDomList = []
  for (const obj of imageList) {
    const { mortgageId, mortgageType, mortgageUrl } = obj
    const photoProps = {
      urls: mortgageUrl,
      isFirstFlag: true,
    }
    retDomList.push(<div className={Styles['aek-photo-list']} key={mortgageId}>
      <div className={Styles['aek-photo-wall']} >
        <PhotoWall {...photoProps} />
        {checkChange ? <Checkbox
          className={Styles['aek-photo-check']}
          onChange={(e) => {
            checkChange(e, obj)
          }}
        /> : ''
        }
        {deleteClick ? <a
          className={Styles['aek-photo-delete']}
          onClick={() => {
            deleteClick(mortgageId)
          }}
        >
          <Icon type="delete" style={{ fontSize: '16px' }} />
        </a> : ''}
      </div>
      <div className={Styles['aek-photo-title']}>
        {photoType[mortgageType - 1]}
      </div>
    </div>)
  }
  return retDomList
}

export default {
  popoverPhotoList,
}
