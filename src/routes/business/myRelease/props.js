import React from 'react'
import moment from 'moment'
import { Row, Col } from 'antd'
import { getOptions } from 'aek-upload'
import { FORM_ITEM_LAYOUT, REGEXP_PHONE } from '../../../utils/constant'

import { IMG_SIZE_LIMIT } from '../../../utils/config'


const formData =
({
  typeList = [],
  data = {},
}) => {
  const {
    chanceContactName,
    chanceContactPhone,
    chanceContactOpenFlag,
    chanceDeadLineDate,
    chanceTagValue,
    chanceTagText,
    chanceContent,
    chanceImageUrls,
    chanceAppendixUrls,
  } = data

  return [
    {
      label: '联系人',
      layout: FORM_ITEM_LAYOUT,
      field: 'chanceContactName',
      col: 14,
      options: {
        initialValue: chanceContactName,
        rules: [
          {
            required: true,
            message: '必填项不能为空',
          },
          {
            max: 18,
            message: '不能大于18个字符',
          },
        ],
      },
      component: {
        name: 'Input',
        props: {
          placeholder: '请输入',
        },
      },
    },
    {
      label: '联系方式',
      layout: FORM_ITEM_LAYOUT,
      field: 'chanceContactPhone',
      col: 14,
      options: {
        initialValue: chanceContactPhone,
        rules: [
          {
            required: true,
            message: '必填项不能为空',
          },
          {
            pattern: REGEXP_PHONE,
            message: '联系电话不正确',
          },
        ],
      },
      component: {
        name: 'Input',
        props: {
          placeholder: '请输入手机号码如：139 0000 0000或座机 0571-8988798-11',
        },
      },
    },
    {
      layout: FORM_ITEM_LAYOUT,
      field: 'chanceContactOpenFlag',
      col: 10,
      options: {
        valuePropName: 'checked',
        initialValue: chanceContactOpenFlag === undefined ? true : chanceContactOpenFlag,
      },
      component: {
        name: 'Checkbox',
        props: {
          className: 'aek-ml10',
          children: '公开',
        },
      },
    },
    {
      label: '截止日期',
      layout: FORM_ITEM_LAYOUT,
      field: 'chanceDeadLineDate',
      col: 14,
      options: {
        initialValue: chanceDeadLineDate ? moment(chanceDeadLineDate) : moment().add(6, 'days'),
        rules: [{
          required: true,
          message: '必填项不能为空',
        }],
      },
      component: {
        name: 'LkcDatePicker',
        props: {
          disabledDate: current => current &&
            (new Date(new Date(moment(current).format('YYYY-MM-DD')).getTime() + (24 * 60 * 60 * 1000)).getTime() <
              moment().add(3, 'days')),
        },
      },
    },
    {
      label: '类型',
      layout: FORM_ITEM_LAYOUT,
      field: 'chanceTagValue',
      col: 14,
      options: {
        initialValue: chanceTagText && chanceTagValue ?
          { label: chanceTagText, key: chanceTagValue } :
          undefined,
        rules: [
          {
            required: true,
            message: '必填项不能为空',
          },
        ],
      },
      component: {
        name: 'LkcRadioButton',
        props: {
          options: typeList.map(item => ({
            label: item.dicValueText,
            value: item.dicValue,
          })),
        },
      },
    },
    {
      label: '详细内容',
      layout: FORM_ITEM_LAYOUT,
      field: 'chanceContent',
      col: 14,
      options: {
        initialValue: chanceContent,
        rules: [
          {
            required: true,
            whitespace: true,
            message: '必填项不能为空',
          },
          {
            min: 10,
            message: '不能少于10个字符',
          },
          {
            max: 500,
            message: '不能大于500个字符',
          },
        ],
      },
      component: {
        name: 'TextArea',
        props: {
          placeholder: '请输入',
          autosize: {
            minRows: 6,
          },
        },
      },
    },

    {
      label: '图片上传',
      layout: FORM_ITEM_LAYOUT,
      field: 'chanceImageUrls',
      col: 14,
      options: getOptions(chanceImageUrls),
      component: {
        name: 'AekUpload',
        props: {
          amountLimit: 9,
          sizeLimit: IMG_SIZE_LIMIT,
        },
      },
    },
    <Row style={{ marginBottom: '20px' }}>
      <Col offset={3} span={12}>
        <div
          style={{
            color: '#bebebe',
            fontSize: '12px',
            fontWeight: 'initial',
            lineHeight: 2,
          }}
        >
          <div style={{ overflow: 'hidden', paddingLeft: 10 }}>
            <p>（最多可以上传9张图片，限PNG、JPG、BMP、PDF，每个文件最大20M)</p>
          </div>
        </div>
      </Col>
    </Row>,
  ]
}
export default {
  formData,
}
