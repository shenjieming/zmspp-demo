import React from 'react'
import { Select } from 'antd'
import { FORM_ITEM_LAYOUT, REGEXP_PHONE } from '../../../../../utils/constant'

const formData = ({ handleChange, detail, deliveryCompanies }) => {
  const {
    deliverType,
    deliverCompany,
    deliverCompanyCode,
    deliverNo,
    deliverPhone,
    deliverPlateNumber,
  } = detail
  return [{
    label: '配送方式',
    layout: FORM_ITEM_LAYOUT,
    field: 'deliverType',
    options: {
      initialValue: deliverType || 1,
      rules: [{
        required: true,
        message: '请选择配送方式',
      }],
    },
    component: {
      name: 'RadioGroup',
      props: {
        onChange: handleChange,
        options: [
          { label: '物流配送', value: 1 },
          { label: '自送', value: 2 },
        ],
      },
    },
  }, {
    label: '物流公司',
    field: 'deliverCompany',
    layout: FORM_ITEM_LAYOUT,
    exclude: deliverType === 2,
    options: {
      initialValue: (deliverCompany && deliverCompanyCode) ?
        { label: deliverCompany, key: deliverCompanyCode } : undefined,
      rules: [{
        required: true,
        message: '请输入物流公司名称',
      }],
    },
    component: (
      <Select
        showSearch
        labelInValue
        notFoundContent="无"
        filterOption={(input, option) => {
          const children = option.props.children
          const code = option.props['data-code']
          if (children.toLowerCase().indexOf(input.toLowerCase()) >= 0) {
            return true
          } else if (code.toLowerCase().indexOf(input.toLowerCase()) >= 0) {
            return true
          }
          return false
        }}
        defaultActiveFirstOption={false}
        style={{ width: '80%' }}
      >
        {deliveryCompanies.map(item => (
          <Select.Option
            data-code={item.dicValue}
            key={`${item.dicValue}-${item.dicValueId}`}
            value={item.dicValue}
          >
            {item.dicValueText}
          </Select.Option>
        ))}
      </Select>
    ),
  }, {
    label: '运单号',
    field: 'deliverNo',
    layout: FORM_ITEM_LAYOUT,
    exclude: deliverType === 2,
    options: {
      initialValue: deliverNo,
      rules: [{
        required: true,
        message: '请输入运单号',
      }, {
        pattern: /^\d+$/,
        message: '请填写正确运单号!',
      }],
    },
    component: {
      name: 'Input',
      props: {
        placeholder: '请输入运单号',
      },
    },
  }, {
    label: '联系电话',
    field: 'deliverPhone',
    exclude: deliverType === 1,
    layout: FORM_ITEM_LAYOUT,
    options: {
      initialValue: deliverPhone,
      rules: [
        {
          pattern: REGEXP_PHONE,
          message: '请填写正确的联系电话!',
        },
      ],
    },
    component: {
      name: 'Input',
      props: {
        placeholder: '请输入联系号码',
      },
    },
  }, {
    label: '车牌号',
    field: 'deliverPlateNumber',
    layout: FORM_ITEM_LAYOUT,
    exclude: deliverType === 1,
    options: {
      initialValue: deliverPlateNumber,
      rules: [{ max: 10, message: '最多输入10位车牌号' }],
    },
    component: {
      name: 'Input',
      props: {
        placeholder: '请输入车牌号',
      },
    },
  }]
}

export default {
  formData,
}
