import React from 'react'
import PropTypes from 'prop-types'
import { Upload, Icon, Modal } from 'antd'
import { uploadProps } from '../../../components/UploadButton'
import styles from '../../../components/UploadButton/index.css'
import {
  IMG_ORIGINAL,
  IMG_COMPRESS,
} from '../../../utils/config'

function PicturesWall({
  imageUrl = '',
  beforeFunc,
  accept,
  handleChange,
}) {
  const uploadButton = (
    <div>
      <Icon type="plus" className={styles.icon} />
      <div className={styles.text}>选择图片</div>
    </div>
  )
  const props = {
    ...uploadProps,
    accept,
    showUploadList: false,
    beforeUpload: beforeFunc,
    onChange: (info) => {
      if (info.file.status === 'done') {
        handleChange(`${IMG_ORIGINAL}/${info.file.response.url}`)
      } else if (info.file.status === 'error') {
        Modal.error({
          content: '图片上传失败',
          maskClosable: true,
        })
      }
    },
  }
  return (
    <Upload {...props}>
      {imageUrl ? <img style={{ width: '86px', height: '86px', marginTop: '-15px' }} src={`${imageUrl}`} alt="" /> : uploadButton}
    </Upload>
  )
}

PicturesWall.propTypes = {
  imageUrl: PropTypes.string,
  beforeFunc: PropTypes.func,
  handleChange: PropTypes.func,
  accept: PropTypes.string,
}
export default PicturesWall
