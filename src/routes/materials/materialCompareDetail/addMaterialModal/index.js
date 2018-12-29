import React from 'react'
import PropTypes from 'prop-types'
import { Form, Modal, Spin, Upload, Input, message } from 'antd'
import { isPlainObject } from 'lodash'
import { form } from './data'
import GetFormItem from '../../../../components/GetFormItem'
import { getConfig, uploadButtonContent, uploadProps } from '../../../../components/UploadButton'
import { getOption } from '../../../../utils'
import pdfImage from '../../../../assets/pdf.png'
import { IMG_ORIGINAL } from '../../../../utils/config'

const TextArea = Input.TextArea
const imgLengthLimit = 5
const getImgUrls = (arr) => {
  const urlArr = []
  for (const item of arr) {
    urlArr.push(item.value)
  }
  return urlArr.join()
}

const propTypes = {
  bringData: PropTypes.object,
  packageUnit: PropTypes.array,
  productFacId: PropTypes.string,
  picLength: PropTypes.number,
  onSearchProListFun: PropTypes.func,
  produceList: PropTypes.array,
  branOptionList: PropTypes.array,
  onSearchBrandListFun: PropTypes.func,
  selectRegObj: PropTypes.object,
  regOptionList: PropTypes.array,
  asyncRegList: PropTypes.func,
  GoodsCategoryTreeData: PropTypes.array,
  getLoading: PropTypes.func,
  dispatchAction: PropTypes.func,
  addModalVisible: PropTypes.bool,
  addModalType: PropTypes.string,
  currentItem: PropTypes.object,
  form: PropTypes.object,
}
const AddCertificateModal = ({
  bringData,
  packageUnit,
  picLength,
  productFacId,
  onSearchProListFun,
  produceList,
  branOptionList,
  onSearchBrandListFun,
  selectRegObj,
  regOptionList,
  asyncRegList,
  GoodsCategoryTreeData,
  getLoading,
  dispatchAction,
  addModalVisible,
  addModalType,
  currentItem,
  form: { validateFields, resetFields, setFieldsValue },
}) => {
  const handleFileChange = ({ fileList = [] }) => {
    dispatchAction({
      payload: { picLength: fileList.length },
    })
    return fileList
      .slice(0, imgLengthLimit)
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
            val = `${IMG_ORIGINAL}/${response.content}`
          }
          return { ...file, url, value: val, thumbUrl }
        }
        return file
      })
  }
  const onChangeFile = ({ fileList }) => {
    dispatchAction({
      payload: { picLength: fileList.length },
    })
  }
  function handleOk() {
    validateFields((errors, vals) => {
      if (errors) {
        return
      }
      const data = { ...vals }
      data.standardCategoryId = data.handleStandardCategoryId.value.split(',')[0]
      data.standardCategory68Code = data.handleStandardCategoryId.value.split(',')[1]
      data.produceFactoryId = data.handleProduceFactoryId.key
      // data.materialsImageUrls = getImgUrls(data.materialsImageUrls)
      if (data.handleBrandName) {
        data.brandName = data.handleBrandName.label
      }
      if (data.handleRegisterCertificateId && data.handleRegisterCertificateId.key) {
        data.registerCertificateId = data.handleRegisterCertificateId.key.split(',')[0]
        data.registerCertificateVersionId = data.handleRegisterCertificateId.key.split(',')[1]
      }
      delete data.handleBrandName
      delete data.handleStandardCategoryId
      delete data.handleRegisterCertificateId
      delete data.handleProduceFactoryId
      dispatchAction({
        type: 'addMaterialSku',
        payload: data,
      }).then(() => {
        window.history.back()
      })
    })
  }
  const modalOpts = {
    title: addModalType === 'create' ? '新增物资' : '编辑物资',
    visible: addModalVisible,
    afterClose: resetFields,
    onCancel() {
      dispatchAction({
        payload: {
          addModalVisible: false,
          currentItem: {},
        },
      })
    },
    onOk: handleOk,
    width: 1000,
    maskClosable: false,
    wrapClassName: 'aek-modal',
  }
  const initObj = {
    productFacId,
    selectRegObj,
    addModalType,
    currentItem,
    GoodsCategoryTreeData,
    bringData,
  }
  const eventFun = {
    setFieldsValue,
    // 注册证号
    asyncRegList: {
      children: getOption(regOptionList, {
        idStr: 'certificateId',
        nameStr: 'certificateNo',
        callback(item) {
          return {
            value: `${item.certificateId},${item.certificateVersionId}`,
            data: item,
          }
        },
      }),
      onSelect(val, e) {
        setFieldsValue({
          handleProduceFactoryId: {
            key: e.props.data.produceFactoryId,
            label: e.props.data.produceFactoryName,
          },
        })
        dispatchAction({
          payload: {
            selectRegObj: e.props.data,
            productFacId: e.props.data.produceFactoryId,
          },
        })
      },
      onChange(val) {
        if (!val) {
          dispatchAction({
            payload: { selectRegObj: {} },
          })
        }
      },
      onSearch: asyncRegList,
    },
    // 厂家
    asyncProductList: {
      children: getOption(produceList, {
        idStr: 'produceFactoryId',
        nameStr: 'produceFactoryName',
        callback(item) {
          return { data: item }
        },
      }),
      onSelect(val) {
        dispatchAction({
          payload: {
            productFacId: val.key,
          },
        })
      },
      onChange(val) {
        if (!val) {
          dispatchAction({
            payload: { productFacId: '' },
          })
        }
      },
      onSearch: onSearchProListFun,
    },
    // 品牌下拉列表
    asyncBrandList: {
      children: getOption(branOptionList, { idStr: 'brandId', nameStr: 'brandName' }),
      onSearch: onSearchBrandListFun,
    },
    asyncSkuList: {
      children: getOption(packageUnit, { idStr: 'dicValue', nameStr: 'dicValueText' }),
    },
  }
  const uploadPropsConcat = {
    ...uploadProps,
    beforeUpload(file) {
      const isLtLimit = file.size / 1024 / 1024 < 2
      if (!isLtLimit) {
        Modal.error({
          content: '您只能上传小于2MB的文件',
          maskClosable: true,
        })
      }
      return isLtLimit
    },
  }
  return (
    <Modal {...modalOpts}>
      <Spin spinning={getLoading('queryMaterialDetail', 'addMaterial', 'editMaterialSave')}>
        <Form>
          <GetFormItem
            formData={form(initObj, eventFun)}
          />
          {/* <Form.Item
            label="物资图片"
            labelCol={{
              span: 4,
            }}
            wrapperCol={{
              span: 20,
            }}
          >
            {getFieldDecorator('materialsImageUrls', {
              ...getConfig(currentItem.materialsImageUrls),
              onChange: onChangeFile,
              getValueFromEvent: handleFileChange,
            })(
              <Upload {...uploadPropsConcat}>
                {picLength <= imgLengthLimit && uploadButtonContent}
              </Upload>,
            )}
          </Form.Item> */}
        </Form>
      </Spin>
    </Modal>
  )
}
AddCertificateModal.propTypes = propTypes
export default Form.create()(AddCertificateModal)
