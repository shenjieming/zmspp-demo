import React from 'react'
import moment from 'moment'
import { getOption } from '../../../utils'

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
}
// 是否长期有效事件
// 厂家授权

const formData = (
  otherDetail,
  modalTitle,
  otherCustOptions,
  checkedLongchange,
  otherOptionsSearch,
) => [<div className="aek-form-head">基础信息</div>, {
  label: '证件类型',
  layout: formItemLayout,
  field: 'certificateType',
  exclude: modalTitle === '换证',
  view: modalTitle === '查看服务承诺书' || modalTitle === '查看廉政协议书',
  viewRender(value) {
    return value === '6' ? '服务承诺书' : '廉政协议书'
  },
  options: {
    rules: [{
      required: true,
      message: '请选择证件类型',
    }],
    initialValue: otherDetail.certificateType ? `${otherDetail.certificateType}` : '6',
  },
  component: {
    name: 'Select',
    props: {
      disabled: modalTitle === '换证',
      children: getOption([{
        id: '6',
        name: '服务承诺书',
      }, {
        id: '7',
        name: '廉政协议书',
      }]),
    },
  },
}, {
  label: '客户名称',
  layout: formItemLayout,
  field: 'customerOrgName',
  view: modalTitle === '查看服务承诺书' || modalTitle === '查看廉政协议书',
  options: {
    initialValue: otherDetail.customerOrgName && otherDetail.customerOrgId ?
      { label: otherDetail.customerOrgName, key: otherDetail.customerOrgId } : undefined,
    rules: [{
      required: true,
      message: '请输入客户名称',
    }],
  },
  component: {
    name: 'Select',
    props: {
      placeholder: '请输入',
      showSearch: true,
      defaultActiveFirstOption: false,
      filterOption: false,
      notFoundContent: '',
      allowClear: true,
      labelInValue: true,
      onSearch: otherOptionsSearch,
      children: getOption(otherCustOptions, { idStr: 'customerOrgId', nameStr: 'customerOrgName' }),
    },
  },
}, {
  label: '有效期',
  layout: {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  },
  field: 'validDateEnd',
  view: modalTitle === '查看服务承诺书' || modalTitle === '查看廉政协议书',
  col: 18,
  exclude: !!otherDetail.validDateLongFlag,
  options: {
    initialValue: otherDetail.validDateStart && otherDetail.validDateEnd &&
      [moment(otherDetail.validDateStart, 'YYYY-MM-DD'), moment(otherDetail.validDateEnd, 'YYYY/MM/DD')],
    rules: [{ required: true, message: '必填项不能为空' }],
  },
  viewRender() {
    if (otherDetail.validDateLongFlag) {
      return `${otherDetail.validDateStart}至长期有效`
    }
    return `${otherDetail.validDateStart || ''}至${otherDetail.validDateEnd || ''}`
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
  view: modalTitle === '查看服务承诺书' || modalTitle === '查看廉政协议书',
  exclude: !otherDetail.validDateLongFlag,
  options: {
    initialValue: otherDetail.validDateStart && moment(otherDetail.validDateStart, 'YYYY-MM-DD'),
    rules: [{ required: true, message: '必填项不能为空' }],
  },
  viewRender() {
    if (otherDetail.validDateLongFlag) {
      return `${otherDetail.validDateStart}至长期有效`
    }
    return `${otherDetail.validDateStart}至${otherDetail.validDateEnd}`
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
    initialValue: !!otherDetail.validDateLongFlag,
  },
  exclude: modalTitle === '查看服务承诺书' || modalTitle === '查看廉政协议书',
  component: {
    name: 'Checkbox',
    props: {
      onChange: checkedLongchange,
      children: '长期有效',
    },
  },
}, <div className="aek-form-head">证件图片信息</div>, {
  label: '证件',
  layout: formItemLayout,
  view: modalTitle === '查看服务承诺书' || modalTitle === '查看廉政协议书',
  field: 'certificateImageUrls',
  options: {
    imgSrc: otherDetail.certificateImageUrls,
    rules: [{ required: true, message: '必填项不能为空' }],
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
