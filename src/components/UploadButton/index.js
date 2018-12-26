import React from 'react'
import { Icon, Upload, Modal, message } from 'antd'
import { isPlainObject } from 'lodash'
import styles from './index.css'
import {
  IMG_UPLOAD,
  IMG_SIZE_LIMIT,
  IMG_ORIGINAL,
  IMG_COMPRESS,
  IMG_WATERMARK,
  EXCEL_SIZE_LIMIT,
  ZIP_SIZE_LIMIT,
  prodEnv,
} from '../../utils/config'
import pdfImage from '../../assets/pdf.png'
import { getUploadAuth } from '../../utils' // jarmey 12.10

// 限制文件大小
const handleBeforeUpload = size => (file) => {
  const isLtLimit = file.size / 1024 / 1024 < size
  if (!isLtLimit) {
    Modal.error({
      content: `您只能上传小于${size}MB的文件`,
      maskClosable: !prodEnv,
    })
    return Promise.reject('取消上传')
  }
  return isLtLimit
}
const uploadProps = {
  name: 'file',
  multiple: true,
  // data: getUploadAuth(), // jarmey 12.10
  headers: { 'X-Requested-With': null },
  action: `${IMG_UPLOAD}`,
  listType: 'picture-card',
  accept: '.jpg,.png,.bmp,.pdf',
  beforeUpload: handleBeforeUpload(IMG_SIZE_LIMIT),
  onPreview: ({ value }) => {
    if (value.endsWith('.pdf')) {
      window.open(value)
    } else {
      window.open(value + IMG_WATERMARK)
    }
  },
}
const uploadExcelProps = {
  ...uploadProps,
  beforeUpload: handleBeforeUpload(EXCEL_SIZE_LIMIT),
  action: `${IMG_UPLOAD}`,
  // data: getUploadAuth('excel'),
  accept: '.xlsx,.xls',
  listType: undefined,
}
const uploadZipProps = {
  ...uploadProps,
  multiple: false,
  beforeUpload: handleBeforeUpload(ZIP_SIZE_LIMIT),
  action: `${IMG_UPLOAD}`,
  // data: getUploadAuth('zip'),
  accept: '.rar,.zip',
  listType: undefined,
}
const uploadButtonContent = (
  <div>
    <Icon type="plus" className={styles.icon} />
    <div className={styles.text}>选择图片</div>
  </div>
)

const uploadButton = <Upload {...uploadProps}>{uploadButtonContent}</Upload>

const handleFileChange = ({ fileList = [] }) =>
  fileList
    .filter(({ response }) => {
      if (!response) {
        return true
      }
      const flag = response.code === 200
      if (!flag) {
        message.error('文件上传失败')
      }
      return flag
    })
    .map((file) => {
      const { status } = file
      if (status === 'done') {
        const { response, type } = file
        let val = file.value
        let url = file.url
        let thumbUrl = file.thumbUrl
        if (type === 'application/pdf') {
          url = pdfImage
          thumbUrl = pdfImage
        }
        if (isPlainObject(response) && !val) {
          val = `${IMG_ORIGINAL}/${response.url}`
        }
        return { ...file, url: url || val, value: val, thumbUrl }
      }
      return file
    })

const value2File = el => ({
  uid: el,
  url: el.endsWith('.pdf') ? pdfImage : el,
  status: 'done',
  value: el,
})

const getConfig = (value) => {
  const initialValue = (value ? value.split(',') : []).map(value2File)

  return {
    valuePropName: 'fileList',
    getValueFromEvent: handleFileChange,
    initialValue,
  }
}

export default {
  uploadButton,
  getConfig,
  uploadProps,
  uploadExcelProps,
  uploadZipProps,
  uploadButtonContent,
  handleFileChange,
  value2File,
  handleBeforeUpload,
}
