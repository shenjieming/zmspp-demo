import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Row, Col, Form, Spin } from 'antd'
import moment from 'moment'
import { flattenDeep, find } from 'lodash'

import { FORM_ITEM_LAYOUT } from '../../../utils/constant'
import GetFormItem from '../../../components/GetFormItem'

import { getApproveData } from './approveForm'
import styles from './index.less'

const certificateTypes = ['企业营业执照', '税务登记证', '医疗器械经营许可证', '医疗器械生产许可证', '医疗器械备案证']
const FactoryAgentApprove = ({
  detailData,
  visible,
  certificateId,
  refuseTypeArr,
  hideHandler,
  okHandler,
  loading,
  toAction,
  oprateType,
  reviewAgain,
  form: { validateFields, resetFields },
}) => {
  const isView = oprateType === 'view'
  const getSupplierData = data => [
    <div>厂家/总代信息</div>,
    {
      label: '类型',
      layout: FORM_ITEM_LAYOUT,
      field: 'importedFlag',
      view: true,
      viewRender(value) {
        return value ? '进口厂家' : '非进口厂家'
      },
      options: {
        initialValue: data.importedFlag,
      },
      component: {
        name: 'Input',
      },
    },
    {
      label: '厂家名称',
      layout: FORM_ITEM_LAYOUT,
      field: 'produceFactoryName',
      exclude: false,
      view: isView,
      options: {
        initialValue: data.produceFactoryName,
        rules: [
          {
            required: true,
            message: '请输入厂家名称',
          },
        ],
      },
      component: {
        name: 'Input',
        props: {
          placeholder: '请输入厂家名称',
          onChange: (event) => {
            const target = detailData
            target.produceFactoryName = event.target.value
          },
        },
      },
    },
    {
      label: '总代名称',
      layout: FORM_ITEM_LAYOUT,
      field: 'agentSupplierName',
      exclude: !data.importedFlag,
      view: isView,
      options: {
        initialValue: data.agentSupplierName,
        rules: [
          {
            required: true,
            message: '请输入总代名称',
          },
        ],
      },
      component: {
        name: 'Input',
        props: {
          placeholder: '请输入总代名称',
          onChange: (event) => {
            const target = detailData
            target.agentSupplierName = event.target.value
          },
        },
      },
    },
    {
      label: '证件类型',
      layout: FORM_ITEM_LAYOUT,
      field: 'certificateDetailType',
      view: true,
      viewRender(value) {
        return value === 1 ? '多证合一' : '传统三证'
      },
      options: {
        initialValue: data.certificateDetailType,
      },
      component: {
        name: 'Input',
      },
    },
  ]
  const formData = data => [
    {
      options: {
        initialValue: (
          <div>
            {data.certificateType && certificateTypes[data.certificateType - 8]}
          </div>
        ),
      },
      view: true,
    },
    {
      label: '证号',
      layout: FORM_ITEM_LAYOUT,
      field: `certificateNo_type${data.certificateType}`,
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
      },
      component: {
        name: 'Input',
        props: {
          placeholder: '请输入证号',
          onChange: (event) => {
            const target = find(detailData.certificates, { certificateType: data.certificateType })
            target.certificateNo = event.target.value
          },
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
      field: `validDateStart_type${data.certificateType}`,
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
            const target = find(detailData.certificates, { certificateType: data.certificateType })
            target.validDateStart = value.format('YYYY-MM-DD')
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
      field: `validDateEnd_type${data.certificateType}`,
      col: 6,
      view: false,
      exclude: isView || data.validDateLongFlag,
      options: {
        initialValue: data.validDateEnd && moment(data.validDateEnd, 'YYYY-MM-DD'),
        rules: [{ required: !data.validDateLongFlag, message: '必填项不能为空' }],
      },
      component: {
        name: 'DatePicker',
        props: {
          onChange: (value) => {
            const target = find(detailData.certificates, { certificateType: data.certificateType })
            target.validDateEnd = value.format('YYYY-MM-DD')
          },
        },
      },
    },
    {
      field: `validDateLongFlag_type${data.certificateType}`,
      col: 5,
      exclude: isView,
      layout: {
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
            const target = find(detailData.certificates, { certificateType: data.certificateType })
            target.validDateLongFlag = event.target.checked
            toAction({})
          },
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
  const submitHandler = () => {
    validateFields((errors, values) => {
      if (errors) {
        return
      }
      if (!isView) {
        const param = detailData
        param.certificateId = certificateId
        param.platformAuthStatus = values.platformAuthStatus
        param.refuseReason = values.refuseReason
        param.refuseType = values.refuseType && values.refuseType.toString()
        okHandler(detailData)
      } else {
        reviewAgain()
      }
    })
  }
  const modalOpts = {
    title: isView ? '查看审核情况' : '审核厂家/总代三证',
    visible,
    okText: isView ? '再次审核' : '确定',
    afterClose: resetFields,
    onCancel: hideHandler,
    onOk: submitHandler,
    maskClosable: false,
    width: 1100,
    wrapClassName: 'aek-modal',
  }
  const getFormData = () => {
    const supplierData = getSupplierData(detailData || {})
    if (detailData.certificates && detailData.certificates.length > 0) {
      const formdata = detailData.certificates.map(item => formData(item))
      return supplierData.concat(formdata)
    }
    return supplierData
  }
  return (
    <Modal {...modalOpts}>
      <Spin spinning={loading}>
        <Row className={styles.horizon}>
          <Col span="12" className={styles.left}>
            <div style={{ fontWeight: 'bold', marginBottom: '20px' }}>
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
                formData={flattenDeep(getFormData())}
              />
            </Form>
          </Col>
          <Col span="12" className={styles.right}>
            <Form>
              <GetFormItem
                formData={getApproveData(detailData || {}, isView, toAction, refuseTypeArr)}
              />
            </Form>
          </Col>
        </Row>
      </Spin>
    </Modal>
  )
}

FactoryAgentApprove.propTypes = {
  certificateId: PropTypes.string,
  detailData: PropTypes.object,
  okHandler: PropTypes.func,
  reviewAgain: PropTypes.func,
  hideHandler: PropTypes.func,
  form: PropTypes.object,
  loading: PropTypes.bool,
  refuseTypeArr: PropTypes.array,
  toAction: PropTypes.func,
  oprateType: PropTypes.string,
  visible: PropTypes.bool,
}

export default Form.create()(FactoryAgentApprove)
