import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Row, Col, Form, Spin } from 'antd'
import moment from 'moment'
import { cloneDeep, find } from 'lodash'
import { halfToFull } from '../../../utils'
import { FORM_ITEM_LAYOUT } from '../../../utils/constant'
import GetFormItem from '../../../components/GetFormItem'

import { getApproveData } from './approveForm'
import styles from './index.less'

const RegistApprove = ({
  detailData,
  visible,
  certificateId,
  hideHandler,
  okHandler,
  loading,
  refuseTypeArr,
  toAction,
  oprateType,
  reviewAgain,
  form: { validateFields, setFieldsValue, resetFields },
  registTypeList,
}) => {
  const formData = (data, type, isOlder) => {
    const isView = type === 'view'
    return [
      detailData.oldFlag && <div>{isOlder ? '原证信息' : '新证信息'}</div>,
      {
        label: '证件类型',
        layout: FORM_ITEM_LAYOUT,
        field: `certificateType${isOlder ? '_older' : ''}`,
        exclude: false,
        view: true,
        viewRender(value) {
          // const certificateType = ['', '注册证', '备案证', '消毒证']
          // return certificateType[value]
          const obj = find(registTypeList, item => Number(item.dicValue) === value)
          return obj && obj.dicValueText
        },
        options: {
          initialValue: data.certificateType,
        },
        component: {
          name: 'Input',
          props: {
            placeholder: '请输入产品名称',
          },
        },
      },
      {
        label: '证号',
        layout: FORM_ITEM_LAYOUT,
        field: `certificateNo${isOlder ? '_older' : ''}`,
        exclude: false,
        view: isView,
        options: {
          initialValue: data.certificateNo,
          rules: [
            {
              required: true,
              message: '请输入证号',
            },
          ],
          normalize: value => halfToFull(value),
        },
        component: {
          name: 'Input',
          props: {
            placeholder: '请输入证号',
          },
        },
      },
      {
        label: '产品名称',
        layout: FORM_ITEM_LAYOUT,
        field: `productName${isOlder ? '_older' : ''}`,
        exclude: false,
        view: isView,
        options: {
          initialValue: data.productName,
          rules: [
            {
              required: true,
              message: '请输入产品名称',
            },
          ],
        },
        component: {
          name: 'Input',
          props: {
            placeholder: '请输入产品名称',
          },
        },
      },
      {
        label: '注册证生产企业',
        layout: FORM_ITEM_LAYOUT,
        field: `produceFactoryName${isOlder ? '_older' : ''}`,
        exclude: false,
        view: isView,
        options: {
          initialValue: data.produceFactoryName,
          rules: [
            {
              required: true,
              message: '请输入生产企业',
            },
          ],
        },
        component: {
          name: 'Input',
          props: {
            placeholder: '请输入生产企业',
          },
        },
      },
      {
        label: '有效期',
        layout: isView
          ? FORM_ITEM_LAYOUT
          : {
            labelCol: {
              span: 12,
            },
            wrapperCol: {
              span: 12,
            },
          },
        field: `validDateStart${isOlder ? '_older' : ''}`,
        view: isView,
        viewRender() {
          if (data.validDateLongFlag) {
            return `${data.validDateStart} 至 长期有效`
          }
          return `${data.validDateStart || ''} 至 ${data.validDateEnd || ''}`
        },
        col: isView ? 24 : 12,
        options: {
          initialValue: data.validDateStart && moment(data.validDateStart, 'YYYY-MM-DD'),
          rules: [{ required: true, message: '必填项不能为空' }],
        },
        component: {
          name: 'DatePicker',
          props: {
            style: { width: '100%' },
            onChange: (value) => {
              if (value) {
                const clonevalue = cloneDeep(value)
                setFieldsValue({ validDateEnd: clonevalue.add(5, 'year').add(-1, 'days') })
              }
            },
          },
        },
      },
      {
        col: 1,
        view: true,
        exclude: isView,
        options: {
          initialValue: (
            <span
              style={{
                lineHeight: '30px',
                width: '100%',
                display: 'inline-block',
                textAlign: 'center',
              }}
            >
              至
            </span>
          ),
        },
      },
      {
        layout: {
          wrapperCol: { span: 24 },
        },
        field: `validDateEnd${isOlder ? '_older' : ''}`,
        col: 6,
        view: false,
        exclude: isView || data.validDateLongFlag,
        options: {
          initialValue: data.validDateEnd && moment(data.validDateEnd, 'YYYY-MM-DD'),
          rules: [{ required: !data.validDateLongFlag, message: '必填项不能为空' }],
        },
        component: {
          name: 'DatePicker',
        },
      },
      {
        field: `validDateLongFlag${isOlder ? '_older' : ''}`,
        col: 5,
        exclude: isView || `${data.certificateType}` === '1',
        layout: data.validDateLongFlag
          ? {
            wrapperCol: {
              span: 20,
              offset: 2,
            },
          }
          : {
            wrapperCol: {
              span: 20,
              offset: 4,
            },
          },
        options: {
          valuePropName: 'checked',
          initialValue: data.validDateLongFlag,
        },
        component: {
          name: 'Checkbox',
          props: {
            children: '长期有效',
            onChange: (event) => {
              data.validDateLongFlag = event.target.checked
              toAction({})
            },
          },
        },
      },
      {
        label: '是否进口',
        layout: FORM_ITEM_LAYOUT,
        field: `importedFlag${isOlder ? '_older' : ''}`,
        view: true,
        // exclude:
        //   Object.keys(data).length &&
        //   data.certificateType !== undefined,
        options: {
          initialValue: data.importedFlag ? '是' : '否',
          rules: [{ required: true, message: '必填项不能为空' }],
        },
      },
      {
        label: '总代',
        layout: FORM_ITEM_LAYOUT,
        field: `agentSupplierName${isOlder ? '_older' : ''}`,
        view: isView,
        exclude: !data.importedFlag,
        options: {
          initialValue: data.agentSupplierName,
          rules: [
            {
              required: true,
              message: '请输入总代信息',
            },
          ],
        },
        component: {
          name: 'Input',
          props: {
            placeholder: '请输入总代信息',
          },
        },
      },
      {
        label: '图片',
        layout: FORM_ITEM_LAYOUT,
        view: true,
        options: {
          imgSrc: data.certificateImageUrls,
        },
      },
    ]
  }
  const isView = oprateType === 'view'
  const submitHandler = () => {
    validateFields((errors, values) => {
      if (errors) {
        return
      }
      if (!isView) {
        const param = values
        param.refuseType = values.refuseType && values.refuseType.toString()
        param.validDateStart = values.validDateStart && values.validDateStart.format('YYYY-MM-DD')
        param.validDateEnd = values.validDateEnd && values.validDateEnd.format('YYYY-MM-DD')
        param.certificateId = certificateId
        param.oldCertificate = detailData.oldFlag
        param.certificateType = detailData.certificate.certificateType
        okHandler({ ...detailData.certificate, ...param })
      } else {
        reviewAgain()
      }
    })
  }
  const modalOpts = {
    title: isView ? '查看审核情况' : '审核注册证',
    visible,
    okText: isView ? '再次审核' : '确定',
    afterClose: resetFields,
    onCancel: hideHandler,
    onOk: submitHandler,
    maskClosable: false,
    width: 1100,
    wrapClassName: 'aek-modal',
  }

  if (detailData && detailData.certificate && detailData.certificate.platformAuthStatus === 2) {
    modalOpts.footer = null
  }

  const getFormData = () => {
    if (!detailData.oldFlag) {
      return formData(detailData.certificate || {}, oprateType)
    }
    return formData(detailData.oldCertificate, 'view', true).concat(
      formData(detailData.certificate, oprateType),
    )
  }
  return (
    <Modal {...modalOpts}>
      <Spin spinning={loading}>
        <Row className={styles.horizon}>
          <Col span="12" className={styles.left}>
            <div style={{ fontWeight: 'bold', marginBottom: '16px' }}>
              用户维护信息
            </div>
            <Form style={{ position: 'relative', overflow: 'hidden' }}>
              <GetFormItem
                style={{
                  position: 'relative',
                  maxHeight: '600px',
                  left: '8px',
                  overflowX: 'hidden',
                  overflowY: 'scroll',
                }}
                formData={getFormData()}
              />
            </Form>
          </Col>
          <Col span="12" className={styles.right}>
            <Form>
              <GetFormItem
                formData={getApproveData(
                  detailData.certificate || {},
                  oprateType === 'view',
                  toAction,
                  refuseTypeArr,
                )}
              />
            </Form>
          </Col>
        </Row>
      </Spin>
    </Modal>
  )
}

RegistApprove.propTypes = {
  certificateId: PropTypes.string,
  detailData: PropTypes.object,
  okHandler: PropTypes.func,
  reviewAgain: PropTypes.func,
  hideHandler: PropTypes.func,
  form: PropTypes.object,
  loading: PropTypes.bool,
  toAction: PropTypes.func,
  refuseTypeArr: PropTypes.array,
  oprateType: PropTypes.string,
  visible: PropTypes.bool,
  registTypeList: PropTypes.array,
}

export default Form.create()(RegistApprove)
