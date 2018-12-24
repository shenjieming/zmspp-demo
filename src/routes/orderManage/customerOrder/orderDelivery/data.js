import React from 'react'
import { Radio, Select } from 'antd'

import { REGEXP_PHONE, SALE_TYPE, MANAGE_MODEL } from '../../../../utils/constant'

const RadioGroup = Radio.Group
const Option = Select.Option

const layout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 10 },
}
const getDetailTopData = (orderBean) => {
  const {
    customerOrgName, // 客户机构名称',
    formAmount, // 配送单金额',
    saleType, // 1-直销 2-过票
    formType, // 1-普耗；2-寄售；3-跟台
    formNo, // 客户订单号',
    purchaseRemark, // 采购备注',
    purchaseTime, // 采购时间',
    purchaseName,
    urgentFlag,
    customerContactName,
    customerContactPhone,
  } = orderBean
  if (Number(saleType) === 2) {
    // 过票类型
    return {
      客户名称: customerOrgName,
      联系人: customerContactName,
      联系电话: customerContactPhone,
      客户订单号: formNo,
      采购人: purchaseName,
      采购时间: purchaseTime,
      订单类型: `${SALE_TYPE[saleType]}-${MANAGE_MODEL[formType]}`,
      是否加急: `${urgentFlag ? '是' : '否'}`,
      订单金额: `￥${formAmount}`,
      // '收货单位|fill': orderBean.receiveOrgName,
      '原订单号|fill': orderBean.originalFormNo,
      '采购备注|fill': <span className="aek-word-break">{purchaseRemark}</span>,
    }
  }
  return {
    客户名称: customerOrgName,
    联系人: customerContactName,
    联系电话: customerContactPhone,
    客户订单号: formNo,
    采购人: purchaseName,
    采购时间: purchaseTime,
    订单类型: `${SALE_TYPE[saleType]}-${MANAGE_MODEL[formType]}`,
    是否加急: `${urgentFlag ? '是' : '否'}`,
    订单金额: `￥${formAmount}`,
    '采购备注|fill': <span className="aek-word-break">{purchaseRemark}</span>,
  }
}

const getFormData = ({ chooseDeliverType, deliverType, deliveryDetail, deliveryCompanies, personalMobile }) =>
  (deliverType === '1'
    ? [
      {
        label: '配送方式',
        layout,
        field: 'deliverType',
        options: {
          initialValue: deliverType,
          rules: [
            {
              required: true,
              message: '请选择配送方式!',
            },
          ],
        },
        component: (
          <RadioGroup
            onChange={(obj) => {
              chooseDeliverType(obj)
            }}
          >
            <Radio value="1">物流配送</Radio>
            <Radio value="2">自送</Radio>
          </RadioGroup>
        ),
      },
      {
        label: '物流公司',
        layout,
        field: 'deliverCompany',
        options: {
          initialValue: deliveryDetail.deliverCompanyCode
            ? {
              key: deliveryDetail.deliverCompanyCode,
              label: deliveryDetail.deliverCompany,
            }
            : undefined,
          rules: [
            {
              required: true,
              message: '请填选择物流公司!',
            },
          ],
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
              <Option
                data-code={item.dicValue}
                key={`${item.dicValue}-${item.dicValueId}`}
                value={item.dicValue}
              >
                {item.dicValueText}
              </Option>
            ))}
          </Select>
        ),
      },
      {
        label: '运单号',
        layout,
        field: 'deliverNo',
        options: {
          initialValue: deliveryDetail.deliverNo,
          rules: [
            {
              required: true,
              message: '请填写运单号!',
            },
            {
              pattern: /^\d+$/,
              message: '请填写正确运单号!',
            },
          ],
        },
        component: {
          name: 'Input',
          placeholder: '请输入运单号',
        },
      },
      {
        label: '发货备注',
        layout,
        field: 'deliverRemark',
        options: {
          initialValue: deliveryDetail.deliverRemark,
          rules: [{ max: 500, message: '最多输入500字!' }],
        },
        component: {
          name: 'TextArea',
          style: { resize: 'none' },
          placeholder: '输入发货备注',
        },
      },
    ]
    : [
      {
        label: '配送方式',
        layout,
        field: 'deliverType',
        options: {
          initialValue: deliverType,
          rules: [
            {
              required: true,
              message: '请选择配送方式!',
            },
          ],
        },
        component: (
          <RadioGroup
            onChange={(obj) => {
              chooseDeliverType(obj)
            }}
          >
            <Radio value="1">物流配送</Radio>
            <Radio value="2">自送</Radio>
          </RadioGroup>
        ),
      },
      {
        label: '联系电话',
        layout,
        field: 'deliverPhone',
        options: {
          rules: [
            {
              pattern: REGEXP_PHONE,
              message: '请填写正确的联系电话!',
            },
          ],
          initialValue: deliveryDetail.deliverPhone ? deliveryDetail.deliverPhone : personalMobile,
        },
        component: {
          name: 'Input',
          placeholder: '请填写联系电话',
        },
      },
      {
        label: '车牌号',
        layout,
        field: 'deliverPlateNumber',
        options: {
          initialValue: deliveryDetail.deliverPlateNumber,
          rules: [{ max: 10, message: '最多输入10位车牌号' }],
        },
        component: {
          name: 'Input',
          placeholder: '请输入车牌号',
        },
      },
      {
        label: '发货备注',
        layout,
        field: 'deliverRemark',
        options: {
          initialValue: deliveryDetail.deliverRemark,
        },
        component: {
          name: 'TextArea',
          style: { resize: 'none' },
          placeholder: '输入发货备注',
        },
      },
    ])

export default {
  getDetailTopData,
  getFormData,
}
