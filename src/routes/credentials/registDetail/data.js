import React from 'react'
import moment from 'moment'
import { getOption, halfToFull } from '../../../utils'
import { MATERIALS_CERTIFICATE_TYPE } from '../../../utils/constant'

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
}

const formData = ({
  registDetail,
  modalTitle,
  registCodeOptions,
  checkedLongchange,
  agentOptions,
  agentOptionsSearch,
  typeSelectChange,
  registCodeSelected,
  registCodeSelect,
  regitstCodeBlur,
  factoryOptions,
  checkedFactorychange,
  registRadioChange,
  produceOptionsSearch,
  checkedFactorySelect,
  produceOptionsSelect,
  handleReplaced,
  setFieldsValue,
}) => [
  <div className="aek-form-head">基础信息</div>,
  {
    label: '证件类型',
    layout: formItemLayout,
    field: 'certificateType',
    exclude: modalTitle === '换证',
    view: modalTitle === '查看注册证',
    viewRender(value) {
      return value - 1 >= 0 || value - 1 <= 2 ? MATERIALS_CERTIFICATE_TYPE[value - 1].name : ''
    },
    options: {
      rules: [
        {
          required: true,
          message: '请选择证件类型',
        },
      ],
      initialValue: registDetail.certificateType ? `${registDetail.certificateType}` : '1',
    },
    component: {
      name: 'Select',
      props: {
        disabled: modalTitle === '编辑证件' || !!registCodeSelected,
        children: getOption([
          {
            id: '1',
            name: '注册证',
          },
          {
            id: '2',
            name: '备案证',
          },
          {
            id: '3',
            name: '消毒证',
          },
        ]),
        onChange: typeSelectChange,
      },
    },
  },
  {
    label: modalTitle === '换证' ? '新证号' : '证号',
    layout: formItemLayout,
    field: 'certificateNo',
    view: modalTitle === '查看注册证',
    options: {
      initialValue: registDetail.certificateNo,
      rules: [
        {
          required: true,
          message: '请输入证号',
          whitespace: true,
        },
      ],
      normalize: value => halfToFull(value),
    },
    component: {
      name: 'Select',
      props: {
        mode: 'combobox',
        showSearch: true,
        placeholder: '请输入',
        defaultActiveFirstOption: false,
        filterOption: false,
        notFoundContent: '',
        allowClear: true,
        // labelInValue: true,
        onSearch(value) {
          agentOptionsSearch(
            value,
            registDetail.certificateType ? `${registDetail.certificateType}` : '1',
          )
        },
        onSelect(value) {
          registCodeSelect(value, data => setFieldsValue(data))
        },
        onBlur(value) {
          regitstCodeBlur(
            value,
            data => setFieldsValue(data),
            registDetail.certificateType ? `${registDetail.certificateType}` : '1',
          )
        },
        children: getOption(registCodeOptions, {
          idStr: 'certificateNo',
          nameStr: 'certificateNo',
        }),
      },
    },
  },
  {
    label: '产品名称',
    layout: formItemLayout,
    field: 'productName',
    exclude: registDetail.factoryAuthFlag,
    view: modalTitle === '查看注册证',
    options: {
      initialValue: registDetail.productName,
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
        placeholder: '请输入',
        disabled: !!registCodeSelected,
      },
    },
  },
  {
    label: '生产企业',
    layout: formItemLayout,
    field: 'produceFactoryName',
    exclude: registDetail.factoryAuthFlag,
    view: modalTitle === '查看注册证',
    options: {
      initialValue: registDetail.produceFactoryName,
      rules: [
        {
          required: true,
          message: '请输入生产企业',
        },
      ],
    },
    component: {
      name: 'Select',
      props: {
        mode: 'combobox',
        showSearch: true,
        placeholder: '请输入',
        defaultActiveFirstOption: false,
        filterOption: false,
        notFoundContent: '',
        allowClear: true,
        // labelInValue: true,
        onSearch: checkedFactorychange,
        onSelect: checkedFactorySelect,
        children: getOption(factoryOptions, {
          idStr: 'produceFactoryName',
          nameStr: 'produceFactoryName',
        }),
        disabled: !!registCodeSelected || modalTitle === '换证',
      },
    },
  },
  {
    label: '有效期',
    layout:
      modalTitle === '查看注册证'
        ? formItemLayout
        : {
          labelCol: {
            span: 8,
          },
          wrapperCol: {
            span: 14,
          },
        },
    field: 'validDateStart',
    view: modalTitle === '查看注册证',
    viewRender(value, record) {
      if (record.validDateLongFlag) {
        return `${registDetail.validDateStart}至长期有效`
      }
      return `${registDetail.validDateStart || ''}至${registDetail.validDateEnd || ''}`
    },
    col: modalTitle === '查看注册证' ? 24 : 18,
    options: {
      initialValue: registDetail.validDateStart &&
        registDetail.validDateEnd && [registDetail.validDateStart, registDetail.validDateEnd],
      rules: [
        {
          required: true,
          message: '必填项不能为空',
        },
        {
          validator: (_, value, callback) => {
            if (!value) {
              callback('请选择时间段')
            } else if (!value[0]) {
              callback('请选择起始时间')
            } else if (!value[1]) {
              callback('请选择结束时间')
            }
            callback()
          },
        },
      ],
    },
    exclude: registDetail.validDateLongFlag,
    component: {
      name: 'TimeQuantum',
      props: {
        timeDifference: [5, 0, -1],
        isRequired: true,
        startProps: {
          disabled: !!registCodeSelected,
          placeholder: '选择开始时间',
        },
        endProps: {
          disabled: !!registCodeSelected,
          placeholder: '选择结束时间',
        },
      },
    },
  },
  {
    label: '有效期',
    layout: {
      labelCol: {
        span: 13,
      },
      wrapperCol: {
        span: 10,
      },
    },
    field: 'validDateEnd',
    col: !registDetail.validDateLongFlag ? 4 : 11,
    view: modalTitle === '查看注册证',
    exclude: !registDetail.validDateLongFlag || modalTitle === '查看注册证',
    options: {
      initialValue: registDetail.validDateEnd && moment(registDetail.validDateEnd, 'YYYY-MM-DD'),
      rules: [{ required: true, message: '必填项不能为空' }],
    },
    component: {
      name: 'DatePicker',
      props: {
        disabled: !!registCodeSelected,
      },
    },
  },
  {
    view: true,
    exclude:
      modalTitle === '查看注册证' ||
      `${registDetail.certificateType}` === '1' ||
      registDetail.certificateType === undefined ||
      !registDetail.validDateLongFlag,
    width: 'aotu',
    options: {
      initialValue: <span style={{ lineHeight: '32px', paddingRight: '8px' }}>至</span>,
    },
  },
  {
    field: 'validDateLongFlag',
    col: 4,
    layout: {
      wrapperCol: {
        span: 20,
      },
    },
    options: {
      valuePropName: 'checked',
      initialValue: registDetail.validDateLongFlag,
    },
    exclude:
      modalTitle === '查看注册证' ||
      `${registDetail.certificateType}` === '1' ||
      registDetail.certificateType === undefined,
    component: {
      name: 'Checkbox',
      props: {
        onChange: checkedLongchange,
        children: '长期有效',
        disabled: !!registCodeSelected,
      },
    },
  },
  {
    label: '是否进口',
    layout: formItemLayout,
    view: modalTitle === '查看注册证',
    field: 'importedFlag',
    exclude:
      Object.keys(registDetail).length &&
      registDetail.certificateType !== undefined &&
      `${registDetail.certificateType}` !== '1',
    options: {
      initialValue: registDetail.importedFlag,
      rules: [{ required: true, message: '必填项不能为空' }],
    },
    component: {
      name: 'RadioGroup',
      props: {
        disabled: !!registCodeSelected,
        placeholder: '请选择',
        onChange(e) {
          registRadioChange(e)
        },
        options: [
          {
            label: '是',
            value: true,
          },
          {
            label: '否',
            value: false,
          },
        ],
      },
    },
  },
  {
    label: '总代',
    layout: formItemLayout,
    field: 'agentSupplierName',
    view: modalTitle === '查看注册证',
    exclude: !registDetail.importedFlag,
    options: {
      initialValue: registDetail.agentSupplierName,
      rules: [
        {
          required: true,
          message: '请输入注册证生产企业',
        },
      ],
    },
    component: {
      name: 'Select',
      props: {
        mode: 'combobox',
        disabled: !!registCodeSelected,
        showSearch: true,
        placeholder: '请输入',
        defaultActiveFirstOption: false,
        filterOption: false,
        notFoundContent: '',
        allowClear: true,
        // labelInValue: true,
        onSearch: produceOptionsSearch,
        onSelect: produceOptionsSelect,
        children: getOption(agentOptions, {
          idStr: 'agentSupplierName',
          nameStr: 'agentSupplierName',
        }),
      },
    },
  },
  <div className="aek-form-head">
    证件图片信息
    <div
      style={{
        color: '#bebebe',
        fontSize: '12px',
        fontWeight: 'initial',
        lineHeight: 2,
        paddingLeft: 30,
        paddingTop: 10,
      }}
    >
      <span style={{ float: 'left', fontWeight: 600 }}>注意:</span>
      <div style={{ overflow: 'hidden', paddingLeft: 10 }}>
        <p>1、图片必须盖公司红章</p>
        <p>2、图片上传时必须要把注册证首页、注册登记表、规格附页全部上传 </p>
        <p>3、图片大小限制20M以内，格式BMP、pdf、jpg、png</p>
      </div>
    </div>
  </div>,
  {
    layout: {
      wrapperCol: { span: 24 },
    },
    field: 'certificateImageUrls',
    view: modalTitle === '查看注册证',
    options: {
      imgSrc: registDetail.certificateImageUrls,
      rules: [{ required: true, message: '必填项不能为空' }],
    },
    component: {
      name: 'UploadButton',
      props: {
        placeholder: '请输入',
      },
    },
  },
  registDetail.delayedFlag && <div className="aek-form-head">延期信息</div>,
  {
    options: {
      initialValue: registDetail.delayedCertificateNo,
    },
    label: '延期证号',
    layout: formItemLayout,
    field: 'delayedCertificateNo',
    view: true,
    exclude: !registDetail.delayedFlag,
  },
  {
    options: {
      initialValue: registDetail.delayedDateEnd,
    },
    label: '延期至',
    layout: formItemLayout,
    field: 'delayedDateEnd',
    view: true,
    exclude: !registDetail.delayedFlag,
  },
  registDetail.delayedFlag && (
    <div className="aek-form-head">
      证件图片信息
      <div
        style={{
          color: '#bebebe',
          fontSize: '12px',
          fontWeight: 'initial',
          lineHeight: 2,
          paddingLeft: 30,
          paddingTop: 10,
        }}
      >
        <span style={{ float: 'left', fontWeight: 600 }}>注意:</span>
        <div style={{ overflow: 'hidden', paddingLeft: 10 }}>
          <p>1、图片必须盖公司红章</p>
          <p>2、图片上传时必须要把注册证首页、注册登记表、规格附页全部上传 </p>
          <p>3、图片大小限制20M以内，格式BMP、pdf、jpg、png</p>
        </div>
      </div>
    </div>
  ),
  {
    layout: {
      wrapperCol: { span: 24 },
    },
    field: 'delayedCertificateImageUrls',
    view: modalTitle === '查看注册证',
    exclude: !registDetail.delayedFlag,
    options: {
      imgSrc: registDetail.delayedCertificateImageUrls,
      rules: [{ required: true, message: '必填项不能为空' }],
    },
    component: {
      name: 'UploadButton',
      props: {
        placeholder: '请输入',
      },
    },
  },
  registDetail.replacedCertificateNo && <div className="aek-form-head">新证信息</div>,
  {
    options: {
      initialValue: (
        <a
          onClick={() => {
            handleReplaced(registDetail.replacedCertificateId)
          }}
        >
          {registDetail.replacedCertificateNo}
        </a>
      ),
    },
    label: '新证号',
    layout: formItemLayout,
    field: 'replacedCertificateNo',
    view: true,
    exclude: !registDetail.replacedCertificateNo,
  },
]
export default {
  formData,
}
