import React from 'react'
import moment from 'moment'
import { getOption } from '../../../../utils'
import { REGEXP_PHONE } from '../../../../utils/constant'

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
}

const formData = (
  checkedLongchange,
  modalTitle,
  powerDetail,
  powerDetailCustOptions,
  powerDetailPersonOptions,
  powerCustOptions,
  powerPersonOptions,
  powerPersonSetPhone,
  setFieldsValue,
) => [<div className="aek-form-head">基础信息</div>, {
  label: modalTitle === '查看委托书' ? '医院名称' : '委托客户名称',
  layout: formItemLayout,
  field: 'customerOrgName',
  view: modalTitle === '查看委托书' || modalTitle === '换证',
  options: {
    initialValue: powerDetail.customerOrgName && powerDetail.customerOrgId ?
      { label: powerDetail.customerOrgName, key: `${powerDetail.customerOrgId}` } : undefined,
    rules: [{
      required: true,
      message: '请输入客户名称',
    }],
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
      onSearch: powerCustOptions,
      children: getOption(powerDetailCustOptions, { idStr: 'customerOrgId', nameStr: 'customerOrgName' }),
    },
  },
}, {
  label: '员工真实姓名',
  layout: formItemLayout,
  field: 'customerContactName',
  view: modalTitle === '查看委托书',
  options: {
    initialValue: powerDetail.customerContactName && powerDetail.customerContactUserId ?
      { label: powerDetail.customerContactName, key: powerDetail.customerContactUserId } : undefined,
    rules: [{
      required: true,
      message: '请输入员工真实姓名',
    }],
  },
  component: {
    name: 'Select',
    props: {
      disabled: modalTitle === '换证',
      /* mode: 'combobox', */
      placeholder: '请输入',
      showSearch: true,
      defaultActiveFirstOption: false,
      filterOption: false,
      notFoundContent: '',
      allowClear: true,
      labelInValue: true,
      onSearch: powerPersonOptions,
      onSelect: (value) => {
        powerDetailPersonOptions.forEach((item) => {
          if (item.userId === value.key) {
            powerPersonSetPhone(item.userMobile, setFieldsValue)
          }
        })
      },
      children: getOption(powerDetailPersonOptions, { idStr: 'userId', nameStr: 'userRealName' }),
    },
  },
}, {
  label: '手机号码',
  layout: formItemLayout,
  field: 'customerContactPhone',
  view: modalTitle === '查看委托书',
  options: {
    rules: [
      {
        required: true,
        message: '必填项不能为空',
      },
      {
        pattern: REGEXP_PHONE,
        message: '格式不正确',
      },
    ],
    initialValue: powerDetail.customerContactPhone,
  },
  component: {
    name: 'Input',
    props: {
      placeholder: '请输入',
      autoComplete: 'off',
    },
  },
}, {
  label: '有效期',
  layout: {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  },
  field: 'validDateEnd',
  view: modalTitle === '查看委托书',
  col: 18,
  exclude: !!powerDetail.validDateLongFlag,
  options: {
    initialValue: powerDetail.validDateStart && powerDetail.validDateEnd &&
      [moment(powerDetail.validDateStart, 'YYYY-MM-DD'), moment(powerDetail.validDateEnd, 'YYYY/MM/DD')],
    rules: [{ required: true, message: '必填项不能为空' }],
  },
  viewRender() {
    if (powerDetail.validDateLongFlag) {
      return `${powerDetail.validDateStart}至长期有效`
    }
    return `${powerDetail.validDateStart || ''}至${powerDetail.validDateEnd || ''}`
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
  view: modalTitle === '查看委托书',
  exclude: !powerDetail.validDateLongFlag,
  options: {
    initialValue: powerDetail.validDateStart && moment(powerDetail.validDateStart, 'YYYY-MM-DD'),
    rules: [{ required: true, message: '必填项不能为空' }],
  },
  viewRender() {
    if (powerDetail.validDateLongFlag) {
      return `${powerDetail.validDateStart}至长期有效`
    }
    return `${powerDetail.validDateStart}至${powerDetail.validDateEnd}`
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
    initialValue: !!powerDetail.validDateLongFlag,
  },
  exclude: modalTitle === '查看委托书',
  component: {
    name: 'Checkbox',
    props: {
      onChange: checkedLongchange,
      children: '长期有效',
    },
  },
}, <div className="aek-form-head">证件图片信息</div>, {
  label: '法人委托书',
  layout: formItemLayout,
  view: modalTitle === '查看委托书',
  field: 'certificateImageUrls',
  options: {
    rules: [{ required: true, message: '必填项不能为空' }],
    imgSrc: powerDetail.certificateImageUrls,
  },
  component: {
    name: 'UploadButton',
    props: {
      placeholder: '请上传图片',
    },
  },
}, {
  label: '身份证正反面',
  layout: formItemLayout,
  field: 'businessImageUrls',
  view: modalTitle === '查看委托书',
  options: {
    rules: [{ required: true, message: '必填项不能为空' }],
    imgSrc: powerDetail.businessImageUrls,
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
