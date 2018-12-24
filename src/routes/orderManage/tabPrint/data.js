import React from 'react'
import { Row, Col } from 'antd'
import { uniq } from 'lodash'

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 9 },
}

const validator = (_, value, callback) => {
  const flag = (value || 'n').split('').every((itm) => {
    const ascII = itm.charCodeAt()
    return ascII > 32 && ascII < 127
  })
  callback(flag ? undefined : '请输入有效字符')
}

const reg = new RegExp('^[0-9]*$')

const tabFormData = [{
  label: '物资名称',
  layout,
  field: 'materialsName',
  options: {
    normalize: value => (value || '').trim(),
    rules: [{ max: 50, message: '请不要超过50个字符' }],
  },
  component: {
    name: 'AutoComplete',
    props: {
      placeholder: '请输入物资名称',
      allowClear: true,
    },
  },
}, {
  label: '规格型号',
  layout,
  field: 'specification',
  options: {
    normalize: value => (value || '').trim(),
    rules: [{ max: 50, message: '请不要超过50个字符' }],
  },
  component: {
    name: 'AutoComplete',
    props: {
      placeholder: '请输入规格型号',
      allowClear: true,
    },
  },
}, {
  label: '生产厂家',
  layout,
  field: 'factory',
  options: {
    normalize: value => (value || '').trim(),
    rules: [{ max: 50, message: '请不要超过50个字符' }],
  },
  component: {
    name: 'AutoComplete',
    props: {
      placeholder: '请输入生产厂家',
      allowClear: true,
    },
  },
}, {
  label: '产品码',
  layout,
  field: 'productCode',
  options: {
    normalize: value => (value || '').trim(),
    rules: [
      // { required: true, message: '请输入产品码' },
      { max: 20, message: '请不要超过20个字符' },
      { validator },
      {
        validator: (_, value, callback) => {
          if (value && ['00', '01'].includes(value.substring(0, 2))) {
            callback('产品码不能以\'00\'、\'01\'开头')
          }
          callback()
        },
      },
    ],
  },
  component: {
    name: 'AutoComplete',
    props: {
      placeholder: '请输入产品码',
      allowClear: true,
    },
  },
}]

const getFormData = ({
  isbarCode,
  isSinglePrint,
  numChange,
  getFieldValue,
  setFields,
  tabPrintType,
  printPaperChange,
}) => {
  if (tabPrintType) {
    return [{
      label: '打印纸张',
      layout,
      field: 'printPaper',
      options: { initialValue: 1 },
      component: {
        name: 'RadioGroup',
        props: {
          onChange: printPaperChange,
          options: [
            { label: '标签纸', value: 1 },
            { label: 'A4', value: 2 },
          ],
        },
      },
    }, {
      label: '院内码',
      layout,
      field: 'code',
      options: {
        validateFirst: true,
        rules: [
          {
            transform: (values) => {
              if (!values) {
                return values
              }
              const brandArr = values.split('\n')
              for (let i = 0; i < brandArr.length; i++) {
                if (!brandArr[i].trim()) {
                  brandArr.splice(i, 1)
                  i--
                } else {
                  brandArr[i] = brandArr[i].trim()
                }
              }
              return (brandArr.length > 0 ? brandArr.join(',') : '')
            },
          },
          {
            required: true,
            message: '请输入院内码',
          },
          {
            validator: (rule, value, callback) => {
              if (!value) {
                callback('请输入院内码')
              } else {
                const brandArr = value.split(',')
                if (brandArr.length > 112) {
                  callback('最多输入112个院内码')
                }
                if (uniq(brandArr).length !== brandArr.length) {
                  callback('该院内码已在列表中 请勿重复填写')
                }
                callback()
              }
            },
          },
        ],
        normalize: (values) => {
          if (!values) {
            return values
          }
          const brandArr = values.split('\n')
          for (let i = 0; i < brandArr.length; i++) {
            brandArr[i] = brandArr[i].replace(',', '')
            if (i !== brandArr.length - 1) {
              if (!brandArr[i].trim()) {
                brandArr.splice(i, 1)
                i--
              } else {
                brandArr[i] = brandArr[i].trim()
              }
            }
          }
          return (brandArr.length > 0 ? brandArr.join('\n') : '')
        },
      },
      component: {
        name: 'TextArea',
        props: {
          placeholder: '每行一个院内码，最多112个',
          autosize: {
            minRows: 6,
          },
        },
      },
    }, <Row className="aek-mb20">
      <Col offset={4}>
      推荐使用80MM*50MM标签纸进行打印
      </Col>
    </Row>, {
      layout: { wrapperCol: { span: 9, offset: 4 } },
      component: {
        name: 'Button',
        props: {
          type: 'primary',
          htmlType: 'submit',
          children: '打印',
        },
      },
    }]
  }

  return [{
    label: '打印数量',
    layout,
    field: 'printQuantity',
    options: { initialValue: 'single' },
    component: {
      name: 'RadioGroup',
      props: {
        options: [
          { label: '单张', value: 'single' },
          { label: '多张', value: 'more' },
        ],
        onChange: numChange,
      },
    },
  }, ...(isbarCode ? [] : tabFormData), {
    label: '生产批号',
    layout,
    field: 'batchNumber',
    options: {
      normalize: value => (value || '').trim(),
      rules: [
        // { required: true, message: '请输入生产批号' },
        { max: 25, message: '请不要超过25个字符' },
        { validator },
      ],
    },
    component: {
      name: 'AutoComplete',
      props: {
        placeholder: '请输入生产批号',
        allowClear: true,
      },
    },
  }, {
    label: '有效期',
    layout,
    field: 'validity',
    options: {
      // rules: [{ required: true, message: '请选择有效期' }],
    },
    component: { name: 'LkcDatePicker' },
  }, {
    label: '序列号SN',
    layout,
    field: 'SN',
    exclude: !isSinglePrint,
    options: {
      normalize: value => (value || '').trim(),
      rules: [
        { max: 25, message: '请不要超过25个字符' },
        { validator },
      ],
    },
    component: {
      name: 'AutoComplete',
      props: {
        placeholder: '请输入序列号SN',
        allowClear: true,
      },
    },
  }, {
    label: '序列号SN',
    layout: {
      labelCol: { span: 12 },
      wrapperCol: { span: 12 },
    },
    col: 8,
    exclude: isSinglePrint,
    field: 'startSN',
    options: {
      normalize: value => (value || '').trim(),
      rules: [
        // { required: true, message: '请输入起始序列号' },
        {
          validator(_, value, callback) {
            const endSN = getFieldValue('endSN')
            if (value) {
              if (!reg.test(value)) {
                callback('请输入0或正整数')
              } else if (endSN && value - 0 >= endSN - 0) {
                callback('要小于终止序列号')
              }
            }
            callback()
          },
        },
      ],
    },
    component: {
      name: 'AutoComplete',
      props: {
        placeholder: '起始序列号',
        allowClear: true,
        onChange: () => {
          const endSN = getFieldValue('endSN')
          if (endSN) {
            if (!reg.test(endSN)) {
              setFields({ endSN: { value: endSN, errors: [new Error('请输入0或正整数')] } })
            } else {
              setFields({ endSN: { value: endSN } })
            }
          }
        },
      },
    },
  }, {
    col: 1,
    exclude: isSinglePrint,
    view: true,
    options: {
      initialValue: (
        <span
          style={{
            lineHeight: '30px',
            width: '100%',
            display: 'inline-block',
            textAlign: 'center',
          }}
        >
            至
        </span>
      ),
    },
  }, {
    layout: {
      wrapperCol: { span: 24 },
    },
    col: 4,
    exclude: isSinglePrint,
    field: 'endSN',
    options: {
      normalize: value => (value || '').trim(),
      rules: [
        // { required: true, message: '请输入终止序列号' },
        {
          validator(_, value, callback) {
            const startSN = getFieldValue('startSN')
            if (value) {
              if (!reg.test(value)) {
                callback('请输入0或正整数')
              } else if (value && startSN && startSN - 0 >= value - 0) {
                callback('要大于起始序列号')
              }
            }
            callback()
          },
        },
      ],
    },
    component: {
      name: 'AutoComplete',
      props: {
        placeholder: '终止序列号',
        allowClear: true,
        onChange: () => {
          const startSN = getFieldValue('startSN')
          if (startSN) {
            if (!reg.test(startSN)) {
              setFields({ startSN: { value: startSN, errors: [new Error('请输入0或正整数')] } })
            } else {
              setFields({ startSN: { value: startSN } })
            }
          }
        },
      },
    },
  }, {
    label: '打印纸张',
    layout,
    field: 'printPaper',
    options: { initialValue: 'A4' },
    component: {
      name: 'RadioGroup',
      props: {
        options: [
          { label: 'A4', value: 'A4' },
          { label: '标签纸', value: 'tab' },
        ],
      },
    },
  }, {
    layout: { wrapperCol: { span: 9, offset: 4 } },
    component: {
      name: 'Button',
      props: {
        type: 'primary',
        htmlType: 'submit',
        children: '打印',
      },
    },
  }]
}

export default {
  getFormData,
}
