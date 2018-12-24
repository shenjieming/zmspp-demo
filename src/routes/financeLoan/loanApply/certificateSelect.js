import React from 'react'
import PropTypes from 'prop-types'
import { Form, Select, Row, Col, Button, Modal, Spin } from 'antd'
import { cloneDeep } from 'lodash'
import { getBasicFn } from '../../../utils/index'
import Styles from './index.less'
import { FORM_ITEM_LAYOUT } from '../../../utils/constant'
import { popoverPhotoList } from '../../shared/fianceLoan'

import {
  getConfig,
  uploadButton,
} from '../../../components/UploadButton'

const FormItem = Form.Item
const { Option } = Select
const namespace = 'loanApply'
const propTypes = {
  loanApply: PropTypes.object,
  loading: PropTypes.object,
  form: PropTypes.object,
}

const CertificateSelect = ({
  loanApply,
  loading,
  form: {
    getFieldDecorator,
    resetFields,
    validateFields,
  },
}) => {
  const {
    photoListDetail,
    photoSelectedList,
    popoverVisible,
    customerSelected,
    photoTypeList,
  } = loanApply
  const { dispatchAction, getLoading } = getBasicFn({ namespace, loading })
  const modalProps = {
    // style: {
    //   top: 20,
    // },
    width: 600,
    title: '选择证件',
    visible: popoverVisible,
    mask: false,
    onCancel() {
      resetFields()
      dispatchAction({
        payload: {
          popoverVisible: false,
        },
      })
    },
    afterClose() {
      resetFields()
    },
    // wrapClassName: 'aek-modal',
    footer: null,
    maskClosable: false,
  }
  // 复选框选中事件
  const checkChange = (e, data) => {
    const checked = e.target.checked
    const list = cloneDeep(photoSelectedList)
    if (checked) {
      list.push(data)
    } else {
      list.map((item, index) => {
        if (data.mortgageId === item.mortgageId) {
          list.splice(index, 1)
        }
      })
    }
    dispatchAction({
      payload: {
        photoSelectedList: list,
      },
    })
  }
  // 删除
  const deleteClick = (mortgageId) => {
    const list = cloneDeep(photoSelectedList)
    list.map((item, index) => {
      if (mortgageId === item.mortgageId) {
        list.splice(index, 1)
      }
    })
    dispatchAction({
      payload: {
        photoSelectedList: list,
      },
    })
    dispatchAction({
      type: 'getDeleteMortgage',
      payload: {
        mortgageId,
      },
    })
  }
  const handleOk = (e) => {
    e.preventDefault()
    validateFields((errors, data) => {
      if (!errors) {
        let str = ''
        if (data.mortgageUrl) {
          for (const obj of data.mortgageUrl) {
            str += `${obj.value},`
          }
          str = str.substring(0, str.length - 1)
        }
        dispatchAction({
          type: 'getAddMortgage',
          payload: {
            ...data,
            customerOrgId: customerSelected[0],
            mortgageUrl: str,
          },
        }).then(() => {
          resetFields()
        })
      }
    })
  }
  const retOption = photoTypeList.map(item => (<Option key={item.dicValue} value={item.dicValue}>{item.dicValueText}</Option>))
  return (
    <Modal {...modalProps}>
      <Spin spinning={getLoading('getAddMortgage', 'getDeleteMortgage')}>
        {photoListDetail && photoListDetail.length ? <div>
          <div className={Styles['aek-modal-title']}>
            已上传证件
          </div>
          <div className={Styles['aek-popover-photo-content']}>
            {popoverPhotoList({
              imageList: photoListDetail,
              checkChange,
              deleteClick,
            })}
          </div>
        </div> : ''}
        <div className={`${Styles['aek-modal-title']} aek-mt10`}>
          添加证件
        </div>
        <div>
          <Form>
            <FormItem
              label="请选择证件类型"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 8 }}
            >
              {getFieldDecorator('mortgageType', {
                rules: [
                  {
                    required: true,
                    message: '请选择资质类型',
                  },
                ],
              })(<Select>
                {retOption}
              </Select>)}
            </FormItem>
            <FormItem label="证件图片" {...FORM_ITEM_LAYOUT}>
              {getFieldDecorator('mortgageUrl', {
                ...getConfig(),
                rules: [{
                  required: true,
                  message: '请上传图片',
                }, {
                  validator: (_, value, callback) => {
                    if (value.some(({ status }) => status !== 'done')) {
                      callback('图片上传中，请稍等')
                    }
                    callback()
                  },
                }],
              })(uploadButton)}
            </FormItem>
            <Row>
              <Col span={6} />
              <Col span={18}>
                <Button onClick={handleOk}>确认</Button>
              </Col>
            </Row>
          </Form>
        </div>
      </Spin>
    </Modal>
  )
}

CertificateSelect.propTypes = propTypes
export default Form.create()(CertificateSelect)
