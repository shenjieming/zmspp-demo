import React from 'react'
import { getOption, mapTreeSelectOnlyChild } from '../../../../utils'
import { MATERIALS_TYPE } from '../../../../utils/constant'

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
const formItemLayoutFilled = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
}
const loop = data =>
  data.map(({ value, label, children, categoryCode }) => {
    if (Array.isArray(children) && children.length > 0) {
      return {
        key: `${value},${categoryCode}`,
        value: `${value},${categoryCode}`,
        label,
        children: loop(children),
      }
    }
    return { key: `${value},${categoryCode}`, value: `${value},${categoryCode}`, label }
  })

const form = (initValue = {}, eventFun) => {
  const {
    bringData,
    productFacId,
    selectRegObj,
    GoodsCategoryTreeData,
    currentItem: {
      brandId, // 品牌标识
      brandName, // 品牌名称
      materialsAttribute, // 物料属性
      materialsCode, // 物料编码
      materialsName, // 物料名称
      materialsStatus, // 物料状态
      produceFactoryId, // 生产厂家标识
      produceFactoryName,
      registerCertificateId, // 注册证标识
      registerCertificateNo, // 注册证标识
      registerCertificateVersionId, // 注册证版本标识
      standardCategoryCode, // 标准分类68码
      standardCategoryId, // 标准分类标识
      standardCategoryName, // 标准名称
      registerCertificateProductName, // 注册证产品名称
    },
    addModalType,
  } = initValue
  const { asyncRegList, asyncProductList, asyncBrandList, asyncSkuList } = eventFun
  return [
    <div className="aek-form-head">待对照数据</div>,
    {
      label: '物资名称',
      layout: formItemLayout,
      col: 12,
      view: true,
      options: {
        initialValue: bringData.materialsName,
      },
      component: {
        name: 'Input',
      },
    },
    {
      label: '规格型号',
      layout: formItemLayout,
      col: 12,
      view: true,
      options: {
        initialValue: bringData.materialsSku,
      },
      component: {
        name: 'Input',
      },
    },
    {
      label: '注册证',
      layout: formItemLayout,
      col: 12,
      view: true,
      options: {
        initialValue: bringData.certificateNo,
      },
      component: {
        name: 'Input',
      },
    },
    {
      label: '厂家',
      layout: formItemLayout,
      col: 12,
      view: true,
      options: {
        initialValue: bringData.factoryName,
      },
      component: {
        name: 'Input',
      },
    },
    {
      label: '品牌',
      layout: formItemLayout,
      col: 12,
      view: true,
      options: {
        initialValue: bringData.brandName,
      },
      component: {
        name: 'Input',
      },
    },
    {
      label: '通用名',
      layout: formItemLayout,
      col: 12,
      view: true,
      options: {
        initialValue: bringData.materialsCommonName,
      },
      component: {
        name: 'Input',
      },
    },
    {
      label: '单位',
      layout: formItemLayout,
      col: 12,
      view: true,
      options: {
        initialValue: bringData.skuUnitText,
      },
      component: {
        name: 'Input',
      },
    },
    <div className="aek-form-head">物资信息</div>,
    // {
    //   field: 'materialsCode',
    //   otherProps: {
    //     style: { display: 'none' },
    //   },
    //   options: {
    //     initialValue: materialsCode,
    //   },
    //   component: {
    //     name: 'Input',
    //   },
    // },
    {
      label: '标准分类',
      layout: formItemLayout,
      field: 'handleStandardCategoryId',
      col: 12,
      options: {
        initialValue: standardCategoryId
          ? {
            value: `${standardCategoryId},${standardCategoryCode}`,
            label: standardCategoryName,
          }
          : undefined,
        rules: [
          {
            required: true,
            message: '请选择分类',
            transform: (obj) => {
              if (obj) {
                return obj.value
              }
              return obj
            },
          },
        ],
      },
      component: {
        name: 'TreeSelect',
        props: {
          disabled: addModalType !== 'create',
          showSearch: true,
          treeNodeFilterProp: 'title',
          allowClear: true,
          labelInValue: true,
          dropdownMatchSelectWidth: false,
          dropdownStyle: {
            height: '400px',
          },
          treeData: mapTreeSelectOnlyChild(loop(GoodsCategoryTreeData)),
          placeholder: '请选择分类',
        },
      },
    },
    {
      label: '属性',
      layout: formItemLayout,
      field: 'materialsAttribute',
      col: 12,
      options: {
        initialValue: materialsAttribute && String(materialsAttribute),
        rules: [{ required: true, message: '请选择' }],
      },
      component: {
        name: 'Select',
        props: {
          placeholder: '请选择',
          children: getOption(MATERIALS_TYPE),
        },
      },
    },
    {
      label: '注册证号',
      layout: formItemLayout,
      field: 'handleRegisterCertificateId',
      col: 12,
      options: {
        initialValue: registerCertificateId
          ? {
            key: `${registerCertificateId},${registerCertificateVersionId}`,
            label: registerCertificateNo ? String(registerCertificateNo) : '',
          }
          : undefined,
      },
      component: {
        name: 'Select',
        props: {
          placeholder: '请选择注册证',
          labelInValue: true,
          ...asyncRegList,
          showSearch: true,
          defaultActiveFirstOption: false,
          filterOption: false,
          notFoundContent: false,
          allowClear: true,
        },
      },
    },
    {
      label: '注册证产品名称',
      col: 12,
      layout: formItemLayout,
      field: 'registerCertificateProductName',
      view: true,
      options: {
        rules: [{ required: true, message: '请输入' }],
        initialValue: (
          <span>
            {selectRegObj.certificateId
              ? selectRegObj.certificateProductName
              : registerCertificateProductName}
          </span>
        ),
      },
      component: {
        name: 'Input',
        props: {},
      },
    },
    {
      label: '厂家',
      layout: formItemLayout,
      field: 'handleProduceFactoryId',
      col: 12,
      options: {
        initialValue: produceFactoryId
          ? {
            key: String(produceFactoryId),
            label: String(produceFactoryName),
          }
          : undefined,
        rules: [{ required: true, message: '请选择' }],
      },
      component: {
        name: 'Select',
        props: {
          labelInValue: true,
          disabled: !!selectRegObj.produceFactoryId,
          placeholder: '请选择厂家',
          ...asyncProductList,
          showSearch: true,
          defaultActiveFirstOption: false,
          filterOption: false,
          notFoundContent: false,
          allowClear: true,
        },
      },
    },
    {
      label: '品牌',
      col: 12,
      layout: formItemLayout,
      field: 'handleBrandName',
      options: {
        initialValue: brandId
          ? {
            key: String(brandName),
            label: String(brandName),
          }
          : undefined,
      },
      component: {
        name: 'Select',
        props: {
          disabled: productFacId === '',
          ...asyncBrandList,
          mode: 'combobox',
          optionLabelProp: 'title',
          labelInValue: true,
          showSearch: true,
          defaultActiveFirstOption: false,
          filterOption: false,
          notFoundContent: false,
          allowClear: true,
        },
      },
    },
    {
      label: '物料名称',
      col: 12,
      layout: formItemLayout,
      field: 'materialsName',
      options: {
        rules: [{ required: true, message: '请输入' }, { max: 200, message: '最多输入200字' }],
        initialValue: materialsName,
      },
      component: {
        name: 'Input',
        props: {
          autoComplete: 'off',
        },
      },
    },
    // {
    //   label: '状态',
    //   layout: formItemLayout,
    //   field: 'materialsStatus',
    //   col: 12,
    //   options: {
    //     initialValue: addModalType === 'create' ? false : materialsStatus,
    //   },
    //   component: {
    //     name: 'RadioGroup',
    //     props: {
    //       options: [{ label: '启用', value: false }, { label: '停用', value: true }],
    //     },
    //   },
    // },
    <div className="aek-form-head">规格信息</div>,
    {
      label: '产品编号',
      col: 12,
      layout: formItemLayout,
      field: 'productCode',
      options: {
        rules: [],
      },
      component: {
        name: 'Input',
      },
    },
    {
      label: '规格单位',
      layout: formItemLayout,
      field: 'skuUnitId',
      col: 12,
      options: {
        rules: [{ required: true, message: '请选择' }],
      },
      component: {
        name: 'Select',
        props: {
          placeholder: '',
          ...asyncSkuList,
          showSearch: true,
          optionFilterProp: 'children',
          defaultActiveFirstOption: false,
          filterOption: true,
          notFoundContent: false,
          allowClear: true,
        },
      },
    },
    {
      label: '规格',
      col: 12,
      layout: formItemLayout,
      field: 'materialsSku',
      options: {
        rules: [
          { required: true, message: '请输入' },
        ],
      },
      component: {
        name: 'Input',
        props: {},
      },
    },
    {
      label: '型号',
      col: 12,
      layout: formItemLayout,
      field: 'materialsModel',
      options: {
        rules: [],
      },
      component: {
        name: 'Input',
      },
    },
    {
      label: '备注',
      layout: formItemLayoutFilled,
      field: 'remark',
      options: {
        rules: [{ max: 500, message: '字数不可超过500' }],
      },
      component: {
        name: 'TextArea',
      },
    },
  ]
}
export default {
  form,
}
