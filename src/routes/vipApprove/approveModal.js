import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Spin } from 'antd'
import { cloneDeep } from 'lodash'
import moment from 'moment'
import GetFormItem from '../../components/GetFormItem'
import PlainForm from '../../components/PlainForm'

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 12 },
}
const getImgUrls = (arr) => {
  const urlArr = []
  for (const item of arr) {
    urlArr.push(item.value)
  }
  return urlArr.join()
}
const ApproveModal = ({
  visible,
  orderDetail,
  onCancel,
  onOk,
  loading,
  modalType,
  form: { validateFields, resetFields, getFieldValue },
}) => {
  const submit = (value) => {
    const params = cloneDeep(value)
    params.payType = value.payType && value.payType.key
    if (value.payFile) {
      params.payFile = getImgUrls(value.payFile)
    }
    params.startDate = moment(value.startDate).format('YYYY-MM-DD')
    onOk(params)
  }
  const okHandler = () => {
    validateFields((error, value) => {
      if (!error) {
        if (value.status === '2') {
          Modal.confirm({
            title: '确定要通过吗?',
            content: '通过后将无法撤销，客户的会员信息将立即生效',
            onOk: () => {
              submit(value)
            },
          })
        } else {
          Modal.confirm({
            title: '确定要拒绝吗?',
            content: '请注意，拒绝后将无法重新审核',
            onOk: () => {
              submit(value)
            },
          })
        }
      }
    })
  }
  const view = modalType === 'view'
  const modalOpts = {
    title: `查看会员订单(单号: ${orderDetail.orderNo || ''})`,
    visible,
    afterClose: resetFields,
    onCancel,
    onOk: okHandler,
    maskClosable: false,
    width: 700,
    wrapClassName: 'aek-modal',
  }
  if (modalType === 'view') {
    modalOpts.footer = null
  }
  const willReject = getFieldValue('status') === '3'
  const getFormData = () => [
    {
      label: '审核情况',
      layout,
      view,
      viewRender() {
        return orderDetail.status
      },
      field: 'status',
      options: {
        initialValue: undefined,
        rules: [{ required: true, message: '请选择是否通过' }],
      },
      component: {
        name: 'RadioGroup',
        props: {
          placeholder: '请选择',
          options: [
            {
              label: '通过',
              value: '2',
            },
            {
              label: '拒绝',
              value: '3',
            },
          ],
        },
      },
    },
    {
      label: '开始时间',
      layout,
      view,
      viewRender() {
        return orderDetail.startDate
      },
      exclude: view || willReject,
      field: 'startDate',
      options: {
        initialValue: undefined,
        rules: [{ required: true, message: '请选择开始时间' }],
      },
      component: {
        name: 'DatePicker',
      },
    },
    {
      label: '支付方式',
      layout,
      view,
      exclude: willReject,
      viewRender() {
        return orderDetail.payTypeStr
      },
      field: 'payType',
      options: {
        initialValue: undefined,
      },
      component: {
        name: 'LkcSelect',
        props: {
          url: '/system/dicValue/dicKey',
          optionConfig: { idStr: 'dicValue', nameStr: 'dicValueText' },
          transformPayload: () => ({
            dicKey: 'PAYMENT_TYPE',
          }),
          placeholder: '支付方式',
          modeType: 'select',
        },
      },
    },
    {
      label: '支付凭证',
      layout,
      view,
      exclude: willReject,
      field: 'payFile',
      options: {
        imgSrc: orderDetail.payFile,
      },
      component: {
        name: 'UploadButton',
      },
    },
    {
      label: '备注',
      layout,
      view,
      field: 'remark',
      options: {
        initialValue: orderDetail.remark,
      },
      component: {
        name: 'TextArea',
        placeholder: '请填写备注',
      },
    },
    {
      label: '审核人',
      layout,
      view: true,
      exclude: !view,
      options: {
        initialValue: orderDetail.lastEditName,
      },
      component: {
        name: 'Input',
      },
    },
    {
      label: '审核时间',
      layout,
      view: true,
      exclude: !view,
      options: {
        initialValue: orderDetail.lastEditTime,
      },
      component: {
        name: 'Input',
      },
    },
  ]
  const formPorps = {
    data: {
      客户名称: orderDetail.hplName || '',
      下单时间: orderDetail.addTime || '',
      下单人: orderDetail.addName || '',
      联系方式: orderDetail.mobile || '',
    },
    size: 2,
  }
  return (
    <Modal {...modalOpts}>
      <Spin spinning={loading}>
        <PlainForm {...formPorps} />
        <Form>
          <GetFormItem formData={getFormData()} />
        </Form>
      </Spin>
    </Modal>
  )
}

ApproveModal.propTypes = {
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
  form: PropTypes.object,
  loading: PropTypes.bool,
  visible: PropTypes.bool,
  orderDetail: PropTypes.object,
  modalType: PropTypes.string,
}

export default Form.create()(ApproveModal)
