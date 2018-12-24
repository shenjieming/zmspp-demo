import React from 'react'

const otherParam = {
  width: 180,
  layout: {
    wrapperCol: { span: 22 },
  },
}
const formData = () => [
  {
    ...otherParam,
    field: 'factoryName',
    component: {
      name: 'Input',
      props: {
        placeholder: '厂家',
      },
    },
  },
  {
    ...otherParam,
    field: 'certificateNo',
    component: {
      name: 'Input',
      props: {
        placeholder: '注册证',
      },
    },
  },
  {
    ...otherParam,
    field: 'brandName',
    component: {
      name: 'Input',
      props: {
        placeholder: '品牌',
      },
    },
  },
  {
    ...otherParam,
    field: 'materialsName',
    component: {
      name: 'Input',
      props: {
        placeholder: '物资名称',
      },
    },
  },
  {
    ...otherParam,
    field: 'materialsSku',
    component: {
      name: 'Input',
      props: {
        placeholder: '规格型号',
      },
    },
  },
]
const genColumns = () => [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    width: 50,
    className: 'aek-text-center',
    render: (text, record, idx) => idx + 1,
  },
  {
    title: '物资名称',
    dataIndex: 'materialsName',
    key: 'materialsName',
  },
  {
    title: '单位/规格型号',
    dataIndex: 'skuUnitText',
    key: 'skuUnitText',
    render: (text, { materialsSku }) =>
      (!text && !materialsSku ? (
        ''
      ) : (
        <span>
          <p>{text || <span>&nbsp;</span>}</p>
          <p>{materialsSku || <span>&nbsp;</span>}</p>
        </span>
      )),
  },
  {
    title: '厂家/注册证',
    dataIndex: 'factoryName',
    key: 'factoryName',
    render: (text, { certificateNo }) =>
      (!text && !certificateNo ? (
        ''
      ) : (
        <span>
          <p>{text || <span>&nbsp;</span>}</p>
          <p>{certificateNo || <span>&nbsp;</span>}</p>
        </span>
      )),
  },
]

const getColumns = () => [
  {
    title: '项目',
    dataIndex: 'title',
    key: 'title',
    className: 'aek-bg-columns',
  },
  {
    title: '待对照数据',
    dataIndex: 'contrast',
    key: 'contrast',
    className: 'aek-text-center',
  },
  {
    title: '选择的标准数据',
    dataIndex: 'standard',
    key: 'standard',
    className: 'aek-text-center',
  },
]

const defaultRows = [
  {
    title: '物资名称',
    dataIndex: 'materialsName',
  },
  {
    title: '规格型号',
    dataIndex: 'materialsSku',
  },
  {
    title: '注册证',
    dataIndex: 'certificateNo',
  },
  {
    title: '厂家',
    dataIndex: 'factoryName',
  },
  {
    title: '品牌',
    dataIndex: 'brandName',
  },
  {
    title: '通用名称',
    dataIndex: 'materialsCommonName',
  },
  {
    title: '单位',
    dataIndex: 'skuUnitText',
  },
]
export default {
  getColumns,
  genColumns,
  formData,
  defaultRows,
}
