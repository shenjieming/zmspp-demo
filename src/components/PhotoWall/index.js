import React from 'react'
import PropTypes from 'prop-types'
import { Upload } from 'antd'
import { IMG_COMPRESS, IMG_WATERMARK } from '../../utils/config'
import pdfImage from '../../assets/pdf.png'
import LkcLightBox from '../LkcLightBox'

class PhotoWall extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isOpen: false,
      photoIndex: 0,
      ...this.props,
    }
  }
  // 关闭图片查看器
  onCloseAekLight() {
    this.setState({
      isOpen: false,
      photoIndex: 0,
    })
  }
  // 打开图片查看器
  onOpenAekLight(data) {
    this.setState({
      isOpen: true,
      photoIndex: data.index,
    })
  }

  render() {
    let uid = -1
    const { isOpen, photoIndex } = this.state
    const { urls = '', imageDetail, isFirstFlag = false } = this.props
    const defaultFileList = (urls ? urls.split(',') : []).map((value, index) => {
      let url
      uid -= 1
      if (value.endsWith('.pdf')) {
        url = pdfImage
      } else {
        url = value
      }
      return {
        uid,
        url,
        status: 'done',
        value,
        index,
      }
    })
    return (
      <div>
        <Upload
          action="index.html"
          listType="picture-card"
          style={{ width: 50, height: 50 }}
          showUploadList={{
            showPreviewIcon: true,
            showRemoveIcon: false,
          }}
          fileList={isFirstFlag ? defaultFileList.slice(0, 1) : defaultFileList}
          onPreview={(data) => {
            this.onOpenAekLight(data)
          }}
        >
          {null}
        </Upload>
        <LkcLightBox
          isOpen={isOpen}
          url={urls}
          onCancel={() => {
            this.onCloseAekLight()
          }}
          photoIndex={photoIndex}
          imageDetail={imageDetail}
        />
      </div>
    )
  }
}

PhotoWall.propTypes = {
  urls: PropTypes.string,
  imageDetail: PropTypes.node,
  isFirstFlag: PropTypes.bool,
}

export default PhotoWall
