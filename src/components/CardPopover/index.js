import React from 'react'
import PropTypes from 'prop-types'
import { Popover } from 'antd'
import PhotoWall from '../../components/PhotoWall'
import noneImage from '../../assets/none-image.png'

function CardPopover({ data = {}, children }) {
  const content = (
    <div>
      <div style={{ display: 'inline-block', verticalAlign: 'middle' }}>
        {data.imageUrls ? (
          <PhotoWall urls={data.imageUrls.split(',')[0]} />
        ) : (
          <img
            src={noneImage}
            alt="没有图片"
            style={{ width: '96px', height: '96px' }}
            title="该物资未上传图片"
          />
        )}
      </div>
      <div
        className="aek-text-overflow"
        style={{ display: 'inline-block', verticalAlign: 'middle', width: '200px' }}
      >
        <h3>{data.goodsName}</h3>
        <p>{data.skuModel}</p>
        <div className="aek-text-disable aek-text-overflow">
          <p title={data.registerCode}>{data.registerCode}</p>
          <p>{data.factoryName}</p>
          <p>{`${data.brandName}/${data.origin}`}</p>
        </div>
      </div>
    </div>
  )
  return (
    <Popover placement="bottomLeft" content={content}>
      {children}
    </Popover>
  )
}

CardPopover.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  data: PropTypes.object,
}

export default CardPopover
