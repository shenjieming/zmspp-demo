import React from 'react'
import { Radio } from 'antd'
import { debounce } from 'lodash'
import { getOption } from '../../utils'
import moment from 'moment'
import {FORM_ITEM_LAYOUT} from "../../utils/constant";
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 15 },
}

const noFormItemLayout = {
  wrapperCol: { span: 20, offset: 2 },
}

const leftItemLayout = {
  col: 12,
  layout: {
    labelCol: { span: 10 },
    wrapperCol: { span: 14 },
  },
}

const rightItemLayout = {
  col: 8,
  layout: {
    wrapperCol: { span: 21, offset: 3 },
  },
}

const viewFormData = ({
  modalType,
  packageUnit,
  initialValue: {
    materialsName,
    materialsSku,
    certificateNo,
    certificateId,
    origin,
    brandName,
    materialsUnit,
    materialsUnitText,
  } = {},
} = {}) => [
  {
    label: '物资名称',
    layout: formItemLayout,
    field: 'materialsName',
    options: {
      initialValue: materialsName,
      rules: [{ required: true, message: '必填项不能为空' }],
    },
    component: {
      name: 'Input',
      props: {
        placeholder: '请输入',
      },
    },
  },
  {
    label: '规格型号',
    layout: formItemLayout,
    field: 'materialsSku',
    options: {
      initialValue: materialsSku,
      rules: [{ required: true, message: '必填项不能为空' }],
    },
    component: {
      name: 'Input',
      props: {
        placeholder: '请输入',
      },
    },
  },
  {
    label: '注册证',
    layout: formItemLayout,
    field: 'certificateNo',
    options: {
      initialValue: (certificateNo && certificateId) ? {
        label: certificateNo, key: certificateId,
      } : undefined,
    },
    component: {
      name: 'LkcSelect',
      props: {
        placeholder: '请输入',
        url: '/certificate/my/register/options',
        optionConfig: {
          idStr: 'certificateId',
          nameStr: 'certificateNo',
        },
      },
    }
  },
  {
    label: '产地',
    layout: formItemLayout,
    field: 'origin',
    options: {
      initialValue: origin,
      rules: [{ required: true, message: '必填项不能为空' }],
    },
    component: {
      name: 'Input',
      props: {
        placeholder: '请输入',
      },
    },
  },
  {
    label: '品牌',
    layout: formItemLayout,
    field: 'brandName',
    exclude: modalType === 'addForDic',
    options: {
      initialValue: brandName,
    },
    component: {
      name: 'Input',
      props: {
        placeholder: '请输入',
      },
    },
  },
  {
    label: '规格单位',
    layout: formItemLayout,
    field: 'materials',
    exclude: modalType === 'addForDic',
    options: {
      initialValue: materialsUnit &&
        materialsUnitText && {
        key: String(materialsUnit),
        value: String(materialsUnit),
        title: materialsUnitText,
        label: materialsUnitText,
      },
      rules: [{ required: true, message: '必填项不能为空' }],
    },
    component: {
      name: 'Select',
      props: {
        placeholder: '请选择规格单位',
        showSearch: true,
        labelInValue: true,
        defaultActiveFirstOption: false,
        optionFilterProp: 'children',
        notFoundContent: false,
        allowClear: true,
        children: getOption(packageUnit, { idStr: 'dicValue', nameStr: 'dicValueText' }),
      },
    },
  },
]

const editFormData = ({
  selectEvent,
  codeMust,
  onSearch,
  suppliersSelect,
                        manageTypeList,
initialValue: {
    inviteType,
    inviteNo,
    hcbsCode,
    importFlag,contractLife,manageType,inviteDate,
    price,
    supplierOrgId,
    supplierName,
    materialsCommenName,
  } = {},
} = {}) => [
  // {
  //   label: '招标信息',
  //   ...leftItemLayout,
  //   field: 'inviteType',
  //   options: {
  //     initialValue: String(inviteType || 1),
  //   },
  //   component: {
  //     name: 'Select',
  //     props: {
  //       optionLabelProp: 'title',
  //       onSelect: (id) => {
  //         selectEvent(!!(id - 1))
  //       },
  //       children: getOption([
  //         {
  //           id: '1',
  //           name: '无',
  //         },
  //         {
  //           id: '2',
  //           name: '省标',
  //         },
  //         {
  //           id: '3',
  //           name: '市标',
  //         },
  //         {
  //           id: '4',
  //           name: '院标',
  //         },
  //       ]),
  //     },
  //   },
  // },
  // {
  //   ...rightItemLayout,
  //   field: 'inviteNo',
  //   options: {
  //     initialValue: inviteNo,
  //     rules: codeMust ? [{ required: true, message: '请输入相应的招标编号' }] : undefined,
  //   },
  //   component: {
  //     name: 'Input',
  //     props: {
  //       placeholder: '招标编号',
  //     },
  //   },
  // },
  // {
  //   label: '单价（元）',
  //   layout: formItemLayout,
  //   field: 'price',
  //   options: {
  //     initialValue: price,
  //     rules: [{ required: true, message: '必填项不能为空' }],
  //   },
  //   component: {
  //     name: 'LkcInputNumber',
  //     props: {
  //       placeholder: '请输入',
  //       min: 0,
  //     },
  //   },
  // },
  {
    label: '通用名称',
    layout: formItemLayout,
    field: 'materialsCommenName',
    options: { initialValue: materialsCommenName, rules: [{ max: 200, message: '最多输入200字' }] },
    component: {
      name: 'Input',
      props: {
        placeholder: '请输入',
      },
    },
  },
  {
    label: '卫计委HCBS码',
    layout: formItemLayout,
    field: 'hcbsCode',
    options: { initialValue: hcbsCode, rules: [{ max: 200, message: '最多输入200字' }] },
    component: {
      name: 'Input',
      props: {
        placeholder: '请输入',
      },
    },
  },
  {
    label: '招标日期',
    layout: formItemLayout,
    field: 'inviteDate',
    options: {
      initialValue: inviteDate ? moment(inviteDate, 'YYYY-MM-DD') : undefined,
    },
    component: {
      name: 'DatePicker',
    },
  },
  {
    label: '合同有效期',
    layout: formItemLayout,
    field: 'contractLife',
    options: {
      initialValue: contractLife ? moment(contractLife, 'YYYY-MM-DD') : undefined,
    },
    component: {
      name: 'DatePicker',
    },
  },
  {
    label: '是否进口',
    layout: formItemLayout,
    field: 'importFlag',
    options: {
      initialValue: importFlag,
      rules: [
        {
          required: true,
          message: '请选择是否进口',
        },
      ],
    },
    component: {
      name: 'RadioGroup',
      props: {
        options: [{ label: '是', value: 1 }, { label: '否', value: 0 }],
      },
    },
  },
  {
    label: '管理分类',
    layout: formItemLayout,
    // viewRender() {
    //   return orderDetail.payTypeStr
    // },
    field: 'manageType',
    options: {
      initialValue: undefined,
    },
    component: {
      name: 'Select',
      props: {
        placeholder: '请选择规格单位',
        showSearch: true,
        // labelInValue: true,
        defaultActiveFirstOption: false,
        optionFilterProp: 'children',
        notFoundContent: false,
        allowClear: true,
        children: getOption(manageTypeList, { idStr: 'dicValue', nameStr: 'dicValueText' }),
      },
    },
  },
  // {
  //   label: '卫计委HCBS码',
  //   layout: formItemLayout,
  //   field: 'hcbsCode',
  //   options: { initialValue: hcbsCode, rules: [{ max: 200, message: '最多输入200字' }] },
  //   component: {
  //     name: 'Input',
  //     props: {
  //       placeholder: '请输入',
  //     },
  //   },
  // },
]

const refuseFromData = (refusedReasonList, onChange) => [
  {
    layout: noFormItemLayout,
    field: 'refuseReasonCheckbox',
    component: {
      name: 'CheckboxGroup',
      props: {
        options: refusedReasonList.map(item => ({
          label: item.dicValueText,
          value: item.dicValueText,
        })),
        onChange,
      },
    },
  },
  {
    layout: noFormItemLayout,
    field: 'refuseReason',
    options: {
      rules: [
        { required: true, message: '文本框内容不能为空' },
        { max: 300, message: '长度不能超过300字符' },
      ],
    },
    component: {
      name: 'TextArea',
      props: {
        placeholder: '可输入详细原因',
      },
    },
  },
]

const addOrder = (arr, callback) =>
  arr.map((item, index) => {
    callback && callback(item, index)
    item.order = index + 1
    return item
  })

export default {
  addOrder,
  viewFormData,
  editFormData,
  refuseFromData,
}
