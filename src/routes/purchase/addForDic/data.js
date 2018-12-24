import React from 'react'
import { debounce } from 'lodash'
import CustmTabelInfo from '../../../components/CustmTabelInfo'
import { getOption, segmentation } from '../../../utils'

const noLabelLayout = {
  wrapperCol: { span: 23 },
}

const formData = ({ poduceFactoryArr, certificateArr, categoryTree, certificateSearch, poduceFactorySearch }) => [{
  layout: noLabelLayout,
  field: 'categoryId',
  width: 200,
  component: {
    name: 'TreeSelect',
    props: {
      placeholder: '请选择分类',
      treeData: categoryTree,
      allowClear: true,
      showSearch: true,
      treeNodeFilterProp: 'label',
    },
  },
}, {
  layout: noLabelLayout,
  field: 'factoryId',
  width: 200,
  component: {
    name: 'Select',
    props: {
      placeholder: '请选择厂家',
      optionLabelProp: 'title',
      showSearch: true,
      labelInValue: true,
      defaultActiveFirstOption: false,
      filterOption: false,
      notFoundContent: false,
      allowClear: true,
      onSearch: debounce(poduceFactorySearch, 400),
      children: getOption(poduceFactoryArr, { idStr: 'produceFactoryId', nameStr: 'produceFactoryName', prefix: '厂家' }),
    },
  },
}, {
  layout: noLabelLayout,
  field: 'certificateId',
  width: 200,
  component: {
    name: 'Select',
    props: {
      placeholder: '请选择注册证',
      optionLabelProp: 'title',
      showSearch: true,
      labelInValue: true,
      defaultActiveFirstOption: false,
      filterOption: false,
      notFoundContent: false,
      allowClear: true,
      onSearch: debounce(certificateSearch, 400),
      children: getOption(certificateArr, { idStr: 'certificateId', nameStr: 'certificateNo', prefix: '注册证' }),
    },
  },
}, {
  label: '',
  layout: noLabelLayout,
  field: 'materialsKeywords',
  width: 200,
  component: {
    name: 'Input',
    props: {
      placeholder: '物资名称/拼音码',
    },
  },
}, {
  layout: noLabelLayout,
  label: '',
  field: 'skuKeywords',
  width: 280,
  component: {
    name: 'Input',
    props: {
      placeholder: '规格型号/通用名称/平台标准物料编码',
    },
  },
}]

const columns = openForm => [{
  title: '序号',
  dataIndex: 'order',
  className: 'aek-text-center',
  width: 60,
}, {
  title: '平台标准物料编码',
  dataIndex: 'materialsSkuCode',
}, {
  title: '物资名称',
  dataIndex: 'materialsName',
  render(materialsName, { materialsCommonName }) {
    return (<CustmTabelInfo
      logoUrl="nil"
      otherInfo={[
        materialsName,
        <span className="aek-text-disable">{materialsCommonName}</span>,
      ]}
    />)
  },
}, {
  title: '单位/规格型号',
  dataIndex: 'materialsUnitText',
  render(skuUnit, { materialsSku }) {
    return segmentation([skuUnit, materialsSku], '/')
  },
}, {
  title: '厂家/注册证',
  dataIndex: 'factoryName',
  render(factoryName, { certificateNo }) {
    return (<CustmTabelInfo
      logoUrl="nil"
      otherInfo={[factoryName, certificateNo]}
    />)
  },
}, {
  title: '操作',
  dataIndex: 'catalogFlag',
  className: 'aek-text-center',
  width: 120,
  render: (catalogFlag, all) => (
    catalogFlag
      ? '已加入'
      : <a onClick={() => { openForm(all) }}>加入目录</a>
  ),
}]

const addOrder = (arr, callback) => arr.map((item, index) => {
  callback && callback(item, index)
  item.order = index + 1
  return item
})

export default {
  addOrder,
  formData,
  columns,
}
