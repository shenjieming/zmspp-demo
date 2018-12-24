import React from 'react'
import { find } from 'lodash'

import { FORM_ITEM_LAYOUT } from '../../../utils/constant'

const getApproveData = (detailData, isView, toAction, refuseTypeArr) => {
  let platformAuthStatus = '2'
  if (detailData.platformAuthStatus) {
    if (detailData.platformAuthStatus > 1) {
      platformAuthStatus = detailData.platformAuthStatus.toString()
    }
  }
  const refuseOptions = []
  refuseTypeArr.forEach((item) => {
    refuseOptions.push({ label: item.dicValueText, value: item.dicValue })
  })

  let refuseType
  if (detailData.refuseType) {
    refuseType = detailData.refuseType.split(',').map((item, index) => {
      const obj = find(refuseTypeArr, i => Number(item) === Number(i.dicValue))
      return (
        <div key={item}>
          {index + 1}. {obj && obj.dicValueText}
        </div>
      )
    })
  }
  return [
    {
      options: {
        initialValue: (
          <div style={{ fontWeight: 'bold' }}>
            供应商信息
          </div>
        ),
      },
      view: true,
    },
    {
      label: '供应商名称',
      layout: FORM_ITEM_LAYOUT,
      view: true,
      options: {
        initialValue: detailData.supplierOrgName,
      },
    },
    {
      label: '联系人',
      layout: FORM_ITEM_LAYOUT,
      view: true,
      options: {
        initialValue: `${detailData.supplierContactName ||
          ''} - ${detailData.supplierContactPhone || ''}`,
      },
    },
    {
      options: {
        initialValue: (
          <div style={{ fontWeight: 'bold' }}>
            审核信息
          </div>
        ),
      },
      view: true,
    },
    {
      label: '审核人',
      layout: FORM_ITEM_LAYOUT,
      exclude: !isView,
      view: true,
      options: {
        initialValue: detailData.reviewName,
      },
    },
    {
      label: '审核时间',
      layout: FORM_ITEM_LAYOUT,
      exclude: !isView,
      view: true,
      options: {
        initialValue: detailData.reviewTime,
      },
    },
    {
      label: '审核情况',
      layout: FORM_ITEM_LAYOUT,
      view: isView,
      viewRender(value) {
        if (value === '2') {
          return '通过'
        }
        return '拒绝'
      },
      field: 'platformAuthStatus',
      options: {
        initialValue: platformAuthStatus,
        rules: [{ required: true, message: '请选择审核结果' }],
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
          onChange: (event) => {
            detailData.platformAuthStatus = event.target.value
            toAction({})
          },
        },
      },
    },
    {
      label: '审核备注',
      layout: FORM_ITEM_LAYOUT,
      exclude: !isView || platformAuthStatus === '2',
      view: true,
      options: {
        initialValue: (
          <div>
            {refuseType}
            <div>{detailData.refuseReason}</div>
          </div>
        ),
      },
    },
    {
      label: '拒绝说明',
      layout: FORM_ITEM_LAYOUT,
      field: 'refuseType',
      exclude: isView || platformAuthStatus === '2',
      options: {
        initialValue: detailData.refuseType && detailData.refuseType.split(','),
        rules: [{ required: true, message: '请选择拒绝说明' }],
      },
      component: {
        name: 'CheckboxGroup',
        props: {
          options: refuseOptions,
        },
      },
    },
    {
      layout: {
        wrapperCol: { offset: 4, span: 18 },
      },
      field: 'refuseReason',
      exclude: isView || platformAuthStatus === '2',
      options: {
        initialValue: detailData.refuseReason,
      },
      component: {
        name: 'TextArea',
        props: {
          rows: 6,
          style: { resize: 'none' },
        },
      },
    },
  ]
}

export default {
  getApproveData,
}
