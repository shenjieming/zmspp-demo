import React from 'react'
import PropTypes from 'prop-types'
import { Form, Modal, Button, Upload, Icon, message } from 'antd'
import { uploadExcelProps } from '../../../../components/UploadButton'
import { IMPORT_TEMPLATE_URL } from '../../../../utils/constant'
import style from './index.less'

const FormItem = Form.Item
const getImgUrls = (arr) => {
  const urlArr = []
  for (const item of arr) {
    if (item.response.code === 200 && item.response.content) {
      urlArr.push(item.response.content)
    }
  }
  return urlArr.join()
}
const ImportModal = ({
  importButtonStatus,
  dispatchAction,
  excelModalVisible,
  form: { getFieldDecorator, validateFields, resetFields },
}) => {
  function handleOk() {
    validateFields((errors, vals) => {
      if (errors) {
        return
      }
      const data = { ...vals }
      if (data.filePath) {
        data.filePath = getImgUrls(data.filePath)
        data.taskType = 1
        data.fileName = vals.filePath[0].name
      }
      dispatchAction({
        type: 'importFile',
        payload: data,
      })
    })
  }
  const modalOpts = {
    title: '导入本地物料',
    visible: excelModalVisible,
    afterClose: resetFields,
    footer: false,
    onCancel() {
      dispatchAction({
        payload: {
          excelModalVisible: false,
        },
      })
    },
    width: 600,
    maskClosable: false,
    wrapClassName: 'aek-modal',
  }
  const downLoadFile = () => {
    window.open(IMPORT_TEMPLATE_URL)
  }
  return (
    <Modal {...modalOpts}>
      <Form>
        <FormItem wrapperCol={{ span: 24 }}>
          {getFieldDecorator('filePath', {
            valuePropName: 'fileList',
            getValueFromEvent: (obj) => {
              const { fileList = [] } = obj
              dispatchAction({
                payload: {
                  importButtonStatus: fileList.length === 0,
                },
              })
              return fileList.filter(({ response }) => {
                if (!response) {
                  return true
                }
                const flag = response.code === 200
                if (!flag) {
                  message.error('文件上传失败')
                }
                return flag
              })
            },
          })(
            <Upload {...uploadExcelProps}>
              <Button disabled={!importButtonStatus}>
                <Icon type="upload" /> 选择本地文件
              </Button>
            </Upload>,
          )}
        </FormItem>
        <div className={style.importWrap}>
          <div className={style.importUrl}>
            <Button
              onClick={handleOk}
              disabled={importButtonStatus}
              className={style.mr16}
              type="primary"
            >
              导入
            </Button>
            <a onClick={downLoadFile}> 下载模板</a>
          </div>
        </div>
        <div className="aek-text-disable">
          <p>备注：</p>
          <p>1、导入功能仅针对新增信息，不覆盖已存在信息。</p>
          <p>2、标“*”的栏位是必填项，不能为空。</p>
          <p>3、Excel文件大小不得超过5M。</p>
        </div>
      </Form>
    </Modal>
  )
}
ImportModal.propTypes = {
  dispatchAction: PropTypes.func,
  onCancel: PropTypes.func,
  importButtonStatus: PropTypes.bool,
  excelModalVisible: PropTypes.bool,
  form: PropTypes.object,
}
export default Form.create()(ImportModal)
