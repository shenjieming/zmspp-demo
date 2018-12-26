import React from 'react'
import PropTypes from 'prop-types'
import { Form, Modal, Button, Upload, Icon, message } from 'antd'
import { uploadExcelProps } from '../../components/UploadButton'
import { EXCEL_DOWNLOAD } from '../../utils/config'
import style from './style.less'

const FormItem = Form.Item
const propTypes = {
  toAction: PropTypes.func,
  onCancel: PropTypes.func,
  importButtonStatus: PropTypes.bool,
  excelModalVisible: PropTypes.bool,
  form: PropTypes.object,
}
const getImgUrls = (arr) => {
  const urlArr = []
  for (const item of arr) {
    if (item.response.code === 200 && item.response.content) {
      urlArr.push(item.response.content)
    }
  }
  return urlArr.join()
}

const ImportModal = (
  {
    importButtonStatus,
    toAction,
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
        data.taskType = 2
        data.fileName = vals.filePath[0].name
      }
      toAction(data, 'excelInput')
    })
  }
  const modalOpts = {
    title: '导入本地物料',
    visible: excelModalVisible,
    afterClose: () => {
      resetFields()
      toAction({ importButtonStatus: true })
    },
    footer: false,
    onCancel() {
      toAction({ excelModalVisible: false })
    },
    width: 600,
    maskClosable: false,
    wrapClassName: 'aek-modal',
  }
  return (
    <Modal {...modalOpts}>
      <Form>
        <FormItem
          wrapperCol={{ span: 24 }}
        >
          {getFieldDecorator('filePath', {
            valuePropName: 'fileList',
            getValueFromEvent: (obj) => {
              const { fileList = [] } = obj
              toAction({ importButtonStatus: fileList.length === 0 })
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
          <Button
            onClick={handleOk}
            disabled={importButtonStatus}
            className={style.mr16}
            type="primary"
          >导入</Button>
          <a onClick={() => { window.open(`${EXCEL_DOWNLOAD}/excel/template/PurchaseCatalogImportTemplate.xls`) }}> 下载模板</a>
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
ImportModal.propTypes = propTypes
export default Form.create()(ImportModal)
