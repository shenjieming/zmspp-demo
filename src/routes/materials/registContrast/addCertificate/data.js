import React from 'react'
import moment from 'moment'
import { getOption } from '../../../../utils'

const formItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
}
const formItemLayoutHalf = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 8,
  },
}

const form = (initValue = {}, eventFun = {}, currentItem = {}) => {
  const {
    afterSaleAddress,
    afterSaleService,
    agentSupplierName,
    applicableScope,
    certificateImageUrls,
    certificateNo,
    certificateSku,
    certificateType,
    customerServiceHotline,
    delayedCertificateNo,
    delayedDateEnd,
    delayedFlag,
    importedFlag,
    legalManufacturer,
    performanceComposition,
    produceAddress,
    produceFactoryAliasName,
    produceFactoryName,
    producePlaceAddress,
    productContraindications,
    productEnglishName,
    productName,
    productStandardNo,
    registerAddress,
    registerAgent,
    registerNo,
    remark,
    replacedCertificateId,
    replacedCertificateNo,
    replacedFlag = false,
    reviewOrgName,
    validDateStart,
  } = currentItem
  const {
    certSortShow,
    timeIsOffReQuire,
    longStatus,
    certIsOff,
    delayIsOff,
    proxyIsOff,
    fileEndDate,
  } = initValue
  const {
    certTypeChange,
    onStartTimeChange,
    asyncNewCert,
    asyncProdFac,
    asyncProxyFac,
    proxyRadioChange,
    delayRadioChange,
    certRadioChange,
    onIsLongCheckboxChange,
    certificateBlur,
  } = eventFun
  return [
    <div className="aek-form-head">基本信息</div>,
    {
      label: '证件类型',
      layout: formItemLayoutHalf,
      field: 'certificateType',
      options: {
        initialValue: certificateType && String(certificateType),
        rules: [{ required: true, message: '请选择' }],
      },
      component: {
        name: 'Select',
        props: {
          placeholder: '请选择',
          children: getOption([
            {
              id: 1,
              name: '注册证',
            },
            {
              id: 2,
              name: '备案证',
            },
            {
              id: 3,
              name: '消毒证',
            },
          ]),
          onChange: certTypeChange,
        },
      },
    },
    {
      label: '证号',
      col: 12,
      layout: formItemLayout,
      field: 'certificateNo',
      options: {
        rules: [{ required: true, message: '请输入' }],
        initialValue: certificateNo,
      },
      component: {
        name: 'Input',
        props: {
          onBlur: certificateBlur,
        },
      },
    },
    {
      label: '产品名称',
      col: 12,
      layout: formItemLayout,
      field: 'productName',
      options: {
        rules: [{ required: true, message: '请输入' }],
        initialValue: productName,
      },
      component: {
        name: 'Input',
        props: {},
      },
    },
    {
      label: '有效期',
      layout: {
        labelCol: {
          span: 12,
        },
        wrapperCol: {
          span: 12,
        },
      },
      field: 'validDateStart',
      col: 8,
      options: {
        rules: [{ required: true, message: '请选择' }],
        initialValue: validDateStart && moment(validDateStart),
      },
      component: {
        name: 'DatePicker',
        props: {
          onChange: onStartTimeChange,
        },
      },
    },
    {
      layout: {
        wrapperCol: {
          span: 24,
        },
      },
      field: 'validDateEndRequire',
      exclude: timeIsOffReQuire,
      col: 4,
      options: {
        rules: [{ required: true, message: '请选择' }],
        initialValue: fileEndDate && moment(fileEndDate),
      },
      component: {
        name: 'DatePicker',
        props: {
          style: { marginLeft: 10 },
        },
      },
    },
    {
      layout: {
        wrapperCol: {
          span: 24,
        },
      },
      field: 'validDateEnd',
      exclude: !timeIsOffReQuire,
      col: 4,
      options: {
        initialValue: fileEndDate && moment(fileEndDate),
      },
      component: {
        name: 'DatePicker',
        props: {
          style: { marginLeft: 10 },
        },
      },
    },
    {
      layout: {
        wrapperCol: {
          span: 12,
        },
      },
      field: 'validDateLongFlag',
      col: 7,
      exclude: !certSortShow,
      options: {
        initialValue: longStatus,
        valuePropName: 'checked',
      },
      component: {
        name: 'Checkbox',
        props: {
          children: '长期有效',
          onChange: onIsLongCheckboxChange,
          style: { marginLeft: 10 },
        },
      },
    },
    {
      label: !certSortShow ? '标准生产企业' : '生产企业',
      col: 12,
      layout: formItemLayout,
      field: 'produceFactoryName',
      options: {
        rules: [{ required: true, message: '请输入' }],
        initialValue: produceFactoryName,
      },
      component: {
        name: 'Select',
        props: {
          ...asyncProdFac,
          mode: 'combobox',
          defaultActiveFirstOption: false,
          filterOption: false,
          notFoundContent: false,
          allowClear: true,
        },
      },
    },
    {
      label: '注册证生产企业',
      col: 12,
      layout: formItemLayout,
      exclude: certSortShow,
      field: 'produceFactoryAliasName',
      options: {
        rules: [],
        initialValue: produceFactoryAliasName,
      },
      component: {
        name: 'Input',
        props: {},
      },
    },
    {
      label: '是否进口',
      col: 12,
      layout: formItemLayout,
      exclude: certSortShow,
      field: 'importedFlag',
      options: {
        rules: [{ required: true, message: '请选择' }],
        initialValue: importedFlag,
      },
      component: {
        name: 'RadioGroup',
        props: {
          options: [{ label: '是', value: true }, { label: '否', value: false }],
          onChange: proxyRadioChange,
        },
      },
    },
    {
      label: '总代',
      col: 12,
      exclude: proxyIsOff || certSortShow,
      layout: formItemLayout,
      field: 'agentSupplierName',
      options: {
        rules: [{ required: true, message: '请输入' }],
        initialValue: agentSupplierName,
      },
      component: {
        name: 'Select',
        props: {
          ...asyncProxyFac,
          mode: 'combobox',
          defaultActiveFirstOption: false,
          filterOption: false,
          notFoundContent: false,
          allowClear: true,
        },
      },
    },
    !certSortShow && <div className="aek-form-head">延期信息</div>,
    {
      label: '延期标识',
      layout: formItemLayoutHalf,
      exclude: certSortShow,
      field: 'delayedFlag',
      options: {
        rules: [{ required: true, message: '请选择' }],
        initialValue: false,
      },
      component: {
        name: 'RadioGroup',
        props: {
          disabled: true,
          options: [{ label: '是', value: true }, { label: '否', value: false }],
          onChange: delayRadioChange,
        },
      },
    },
    !certSortShow && <div className="aek-form-head">换证信息</div>,
    {
      label: '换证标识',
      layout: formItemLayoutHalf,
      exclude: certSortShow,
      field: 'replacedFlag',
      options: {
        rules: [{ required: true, message: '请输入' }],
        initialValue: false,
      },
      component: {
        name: 'RadioGroup',
        props: {
          disabled: true,
          options: [{ label: '是', value: true }, { label: '否', value: false }],
          onChange: certRadioChange,
        },
      },
    },
    {
      field: 'replacedCertificateNo',
      otherProps: {
        style: { display: 'none' },
      },
      options: {
        initialValue: replacedCertificateNo, // 证号特殊处理（隐藏域）
      },
      component: {
        name: 'Input',
        props: {
          placeholder: '请输入',
        },
      },
    },
    !certSortShow && <div className="aek-form-head">其他信息</div>,
    {
      label: '产品英文名称',
      layout: formItemLayout,
      exclude: certSortShow,
      col: 12,
      field: 'productEnglishName',
      options: {
        rules: [],
        initialValue: productEnglishName,
      },
      component: {
        name: 'Input',
        props: {},
      },
    },
    {
      label: 'REG,NO',
      layout: formItemLayout,
      exclude: certSortShow,
      col: 12,
      field: 'registerNo',
      options: {
        rules: [],
        initialValue: registerNo,
      },
      component: {
        name: 'Input',
        props: {},
      },
    },
    {
      label: '注册地址',
      layout: formItemLayoutHalf,
      exclude: certSortShow,
      field: 'registerAddress',
      options: {
        initialValue: registerAddress,
      },
      component: {
        name: 'Input',
        props: {},
      },
    },
    {
      label: '法定制造商',
      layout: formItemLayout,
      exclude: certSortShow,
      col: 12,
      field: 'legalManufacturer',
      options: {
        rules: [],
        initialValue: legalManufacturer,
      },
      component: {
        name: 'Input',
        props: {},
      },
    },
    {
      label: '生产场所地址',
      layout: formItemLayout,
      exclude: certSortShow,
      col: 12,
      field: 'producePlaceAddress',
      options: {
        initialValue: producePlaceAddress,
      },
      component: {
        name: 'Input',
        props: {},
      },
    },
    {
      label: '生产地址（厂商）',
      layout: formItemLayout,
      exclude: certSortShow,
      col: 12,
      field: 'produceAddress',
      options: {
        initialValue: produceAddress,
      },
      component: {
        name: 'Input',
        props: {},
      },
    },
    {
      label: '售后服务商',
      layout: formItemLayout,
      exclude: certSortShow,
      col: 12,
      field: 'afterSaleService',
      options: {
        initialValue: afterSaleService,
      },
      component: {
        name: 'Input',
        props: {},
      },
    },
    {
      label: '产品标准编号',
      layout: formItemLayout,
      exclude: certSortShow,
      col: 12,
      field: 'productStandardNo',
      options: {
        initialValue: productStandardNo,
      },
      component: {
        name: 'Input',
        props: {},
      },
    },
    {
      label: '产品禁忌症',
      layout: formItemLayout,
      exclude: certSortShow,
      col: 12,
      field: 'productContraindications',
      options: {
        initialValue: productContraindications,
      },
      component: {
        name: 'Input',
        props: {},
      },
    },
    {
      label: '客服热线',
      layout: formItemLayout,
      exclude: certSortShow,
      col: 12,
      field: 'customerServiceHotline',
      options: {
        initialValue: customerServiceHotline,
      },
      component: {
        name: 'Input',
        props: {},
      },
    },
    {
      label: '售后服务地址',
      layout: formItemLayout,
      exclude: certSortShow,
      col: 12,
      field: 'afterSaleAddress',
      options: {
        initialValue: afterSaleAddress,
      },
      component: {
        name: 'Input',
        props: {},
      },
    },
    {
      label: '注册代理',
      layout: formItemLayout,
      exclude: certSortShow,
      col: 12,
      field: 'registerAgent',
      options: {
        initialValue: registerAgent,
      },
      component: {
        name: 'Input',
        props: {},
      },
    },
    {
      label: '审核单位',
      layout: formItemLayout,
      exclude: certSortShow,
      col: 12,
      field: 'reviewOrgName',
      options: {
        initialValue: reviewOrgName,
      },
      component: {
        name: 'Input',
        props: {},
      },
    },
    {
      label: '注册证规格',
      layout: formItemLayout,
      exclude: certSortShow,
      col: 12,
      field: 'certificateSku',
      options: {
        initialValue: certificateSku,
      },
      component: {
        name: 'TextArea',
        props: {},
      },
    },
    {
      label: '适用范围',
      layout: formItemLayout,
      exclude: certSortShow,
      col: 12,
      field: 'applicableScope',
      options: {
        initialValue: applicableScope,
      },
      component: {
        name: 'TextArea',
        props: {},
      },
    },
    {
      label: '产品性能结构及构成',
      layout: formItemLayout,
      exclude: certSortShow,
      col: 12,
      field: 'performanceComposition',
      options: {
        initialValue: performanceComposition,
      },
      component: {
        name: 'TextArea',
        props: {},
      },
    },
    {
      label: '备注',
      layout: formItemLayout,
      exclude: certSortShow,
      col: 12,
      field: 'remark',
      options: {
        initialValue: remark,
      },
      component: {
        name: 'TextArea',
        props: {},
      },
    },
    <div className="aek-form-head">证件图片信息</div>,
    {
      label: '图片',
      layout: {
        labelCol: {
          span: 4,
        },
        wrapperCol: {
          span: 20,
        },
      },
      field: 'certificateImageUrls',
      component: {
        name: 'UploadButton',
      },
    },
  ]
}
export default {
  form,
}
