import React from 'react'
import moment from 'moment'
import { getOption } from '../../../../utils'

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
}
// 是否长期有效事件
// 厂家授权

const formData = (
  checkedFacAuthchange,
  checkedLongchange,
  authDetail,
  agentOptions,
  factoryOptions,
  agentOptionsSearch,
  produceOptionsSearch,
  modalTitle,
  authTypeInfoOptions,
) => [<div className="aek-form-head">基础信息</div>, {
  label: '供应商',
  layout: formItemLayout,
  field: 'supplierContactName',
  view: true,
  exclude: !authDetail.supplierOrgName,
  options: {
    initialValue: authDetail.supplierOrgName,
  },
  component: {
    name: 'Input',
    props: {
      placeholder: '请输入',
    },
  },
}, {
  label: '生产厂家',
  layout: {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  },
  field: 'produceFactoryName',
  col: 18,
  view: modalTitle === '查看授权书',
  options: {
    initialValue: authDetail.produceFactoryName && authDetail.produceFactoryId ?
      { label: authDetail.produceFactoryName, key: `${authDetail.produceFactoryId}` } : undefined,
    rules: [{
      required: true,
      message: '请输入生产厂家',
    }],
  },
  viewRender() {
    return authDetail.produceFactoryName
  },
  component: {
    name: 'Select',
    props: {
      disabled: modalTitle === '换证',
      placeholder: '请输入',
      showSearch: true,
      defaultActiveFirstOption: false,
      filterOption: false,
      notFoundContent: '',
      allowClear: true,
      labelInValue: true,
      onSearch: agentOptionsSearch,
      children: getOption(factoryOptions, { idStr: 'produceFactoryId', nameStr: 'produceFactoryName' }),
    },
  },
}, {
  field: 'factoryAuthFlag',
  col: 6,
  layout: {
    wrapperCol: {
      span: 20,
      offset: 4,
    },
  },
  exclude: modalTitle === '查看授权书',
  options: {
    valuePropName: 'checked',
    initialValue: !!authDetail.factoryAuthFlag,
  },
  component: {
    name: 'Checkbox',
    props: {
      onChange: checkedFacAuthchange,
      children: '厂家授权',
      disabled: modalTitle === '换证',
    },
  },
}, {
  label: '上级授权单位',
  layout: formItemLayout,
  field: 'superiorAuthFactoryName',
  exclude: authDetail.factoryAuthFlag,
  view: modalTitle === '查看授权书',
  options: {
    initialValue: authDetail.superiorAuthFactoryName && authDetail.superiorAuthFactoryId ?
      { label: authDetail.superiorAuthFactoryName, key: `${authDetail.superiorAuthFactoryId}` } : undefined,
    rules: [{
      required: true,
      message: '请输入上级授权单位',
    }],
  },
  viewRender() {
    return authDetail.superiorAuthFactoryName
  },
  component: {
    name: 'Select',
    props: {
      disabled: modalTitle === '换证',
      placeholder: '请输入',
      showSearch: true,
      defaultActiveFirstOption: false,
      filterOption: false,
      notFoundContent: '',
      allowClear: true,
      children: getOption(authTypeInfoOptions, { idStr: 'supplierId', nameStr: 'supplierName' }),
      labelInValue: true,
      onSearch: produceOptionsSearch,
    },
  },
}, {
  label: '授权区域',
  layout: formItemLayout,
  field: 'authArea',
  view: modalTitle === '查看授权书',
  options: {
    rules: [{ required: true, message: '必填项不能为空' }],
    initialValue: authDetail.authArea,
  },
  component: {
    name: 'TextArea',
    props: {
      placeholder: '请输入',
    },
  },
}, {
  label: '有效期',
  layout: {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  },
  field: 'validDateEnd',
  view: modalTitle === '查看授权书',
  col: 18,
  exclude: authDetail.validDateLongFlag,
  viewRender() {
    if (authDetail.validDateLongFlag) {
      return `${authDetail.validDateStart}至长期有效`
    }
    return `${authDetail.validDateStart}至${authDetail.validDateEnd}`
  },
  options: {
    initialValue: authDetail.validDateStart && authDetail.validDateEnd &&
      [moment(authDetail.validDateStart, 'YYYY-MM-DD'), moment(authDetail.validDateEnd, 'YYYY/MM/DD')],
    rules: [{ required: true, message: '必填项不能为空' }],
  },
  component: {
    name: 'RangePicker',
  },
}, {
  label: '有效期',
  layout: {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  },
  field: 'validDateStart',
  col: 18,
  view: modalTitle === '查看授权书',
  exclude: !authDetail.validDateLongFlag,
  options: {
    initialValue: authDetail.validDateStart && moment(authDetail.validDateStart, 'YYYY-MM-DD'),
    rules: [{ required: true, message: '必填项不能为空' }],
  },
  viewRender() {
    if (authDetail.validDateLongFlag) {
      return `${authDetail.validDateStart}至长期有效`
    }
    return `${authDetail.validDateStart || ''}至${authDetail.validDateEnd || ''}`
  },
  component: {
    name: 'DatePicker',
  },
}, {
  field: 'validDateLongFlag',
  col: 6,
  layout: {
    wrapperCol: {
      span: 20,
      offset: 4,
    },
  },
  options: {
    valuePropName: 'checked',
    initialValue: !!authDetail.validDateLongFlag,
  },
  exclude: modalTitle === '查看授权书',
  component: {
    name: 'Checkbox',
    props: {
      onChange: checkedLongchange,
      children: '长期有效',
    },
  },
}, <div className="aek-form-head">证件图片信息</div>, {
  label: '授权书',
  layout: formItemLayout,
  view: modalTitle === '查看授权书',
  field: 'certificateImageUrls',
  options: {
    rules: [{ required: true, message: '必填项不能为空' }],
    imgSrc: authDetail.certificateImageUrls,
  },
  component: {
    name: 'UploadButton',
    props: {
      placeholder: '请输入',
    },
  },
}, {
  label: '逐级授权书',
  layout: formItemLayout,
  field: 'businessImageUrls',
  view: modalTitle === '查看授权书',
  exclude: !!authDetail.factoryAuthFlag || !!(modalTitle === '查看授权书' && !authDetail.businessImageUrls),
  options: {
    imgSrc: authDetail.businessImageUrls,
  },
  component: {
    name: 'UploadButton',
    props: {
      placeholder: '请输入',
    },
  },
}]
export default {
  formData,
}
