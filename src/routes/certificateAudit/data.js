import React from 'react'
import { debounce, find } from 'lodash'
import CustmTabelInfo from '../../components/CustmTabelInfo'
import { getOption } from '../../utils'

const noLabelLayout = {
  wrapperCol: { span: 22 },
}

const getFormData = ({ type, onSearch, suppliersSelect, registTypeList }) => [{
  layout: noLabelLayout,
  field: 'platformAuthStatus',
  width: 220,
  options: {
    initialValue: null,
  },
  component: {
    name: 'Select',
    props: {
      defaultActiveFirstOption: false,
      filterOption: false,
      notFoundContent: false,
      optionLabelProp: 'title',
      onSearch: debounce(onSearch, 400),
      children: getOption([{
        id: null,
        name: '全部',
      }, {
        id: 1,
        name: '待审核',
      }, {
        id: 2,
        name: '已认证',
      }, {
        id: 3,
        name: '未通过',
      }], { prefix: '认证状态' }),
    },
  },
}, {
  layout: noLabelLayout,
  field: 'certificateType',
  width: 220,
  options: {
    initialValue: null,
  },
  exclude: [2, 3, 4].includes(type - 0),
  component: {
    name: 'Select',
    props: {
      defaultActiveFirstOption: false,
      filterOption: false,
      notFoundContent: false,
      optionLabelProp: 'title',
      onSearch: debounce(onSearch, 400),
      children: getOption(type - 0 === 1 ? [{
        id: null,
        name: '全部',
      }, ...registTypeList.map(item => ({ id: item.dicValue, name: item.dicValueText }))] : [{
        id: null,
        name: '全部',
      }, {
        id: 6,
        name: '服务承诺书',
      }, {
        id: 7,
        name: '廉政协议书',
      }], { prefix: '证书类型' }),
    },
  },
}, {
  layout: noLabelLayout,
  field: 'supplierOrgId',
  width: 220,
  component: {
    name: 'Select',
    props: {
      placeholder: '请选择供应商',
      showSearch: true,
      labelInValue: true,
      defaultActiveFirstOption: false,
      filterOption: false,
      notFoundContent: false,
      allowClear: true,
      optionLabelProp: 'title',
      onSearch: debounce(onSearch, 400),
      children: getOption(suppliersSelect, { idStr: 'supplierId', nameStr: 'supplierName', prefix: '供应商' }),
    },
  },
}, {
  label: '',
  layout: { wrapperCol: { span: 23 } },
  field: 'keywords',
  exclude: type - 0 === 5,
  width: 220,
  component: {
    name: 'Input',
    props: {
      placeholder: {
        1: '注册证号',
        2: '厂家/总代名称检索',
        3: '请输入授权公司/生产厂家',
        4: '委托客户名称',
      }[type],
    },
  },
}]

const baseColumns = ({
  excludeArr = [],
  check,
  view,
}) => [{
  title: '类型',
  dataIndex: 'certificateReviewType',
  className: 'aek-text-center',
  width: 80,
  render(certificateReviewType) {
    return {
      1: '新增',
      2: '换证',
    }[certificateReviewType]
  },
}, {
  title: '供应商',
  dataIndex: 'supplierOrgName',
}, {
  title: '认证状态',
  dataIndex: 'platformAuthStatus',
  className: 'aek-text-center',
  width: 100,
  render(type) {
    return {
      1: '待审核',
      2: '已认证',
      3: '未通过',
    }[type]
  },
}, {
  title: '提交时间',
  dataIndex: 'addTime',
  className: 'aek-text-center',
  width: 120,
}, {
  title: '审核人',
  dataIndex: 'reviewName',
}, {
  title: '审核时间',
  dataIndex: 'reviewTime',
  className: 'aek-text-center',
  width: 120,
}, {
  title: '操作',
  dataIndex: 'operation',
  className: 'aek-text-center',
  width: 80,
  render: (_, { platformAuthStatus, certificateId }) => (
    platformAuthStatus === 1
      ? <a onClick={() => check(certificateId)}>审核</a>
      : <a onClick={() => view(certificateId)}>查看</a>
  ),
}].filter(({ dataIndex }) => !excludeArr.includes(dataIndex))

const orderData = {
  title: '序号',
  dataIndex: 'order',
  className: 'aek-text-center',
  width: 60,
}

// 注册证表格
const registerColumns = registTypeList => [orderData, {
  title: '证件类型',
  dataIndex: 'certificateType',
  className: 'aek-text-center',
  width: 150,
  render(type) {
    const obj = find(registTypeList, item => item.dicValue === `${type}`)
    return obj && obj.dicValueText
  },
}, {
  title: '证号',
  dataIndex: 'certificateNo',
}]

// 厂家/总代三证表格
const factoryAgentColumns = [orderData, {
  title: '厂家/总代',
  dataIndex: 'produceFactoryName',
  render(produceFactoryName, { agentSupplierName }) {
    return (<CustmTabelInfo
      logoUrl="nil"
      otherInfo={[
        produceFactoryName,
        agentSupplierName,
      ]}
    />)
  },
}]

// 授权书表格
const authColumns = [orderData, {
  title: '授权公司/生产厂家',
  dataIndex: 'superiorAuthFactoryName',
  render(superiorAuthFactoryName, { produceFactoryName }) {
    return (<CustmTabelInfo
      logoUrl="nil"
      otherInfo={[
        superiorAuthFactoryName,
        produceFactoryName,
      ]}
    />)
  },
}]

// 委托书表格
const entrustColumns = [orderData, {
  title: '委托客户',
  dataIndex: 'customerOrgName',
}]

// 其他档案表格
const otherColumns = [orderData, {
  title: '证件类型',
  dataIndex: 'certificateType',
  render(type) {
    return {
      6: '服务承诺书',
      7: '廉政协议书',
    }[type]
  },
}, {
  title: '客户名称',
  dataIndex: 'customerOrgName',
}]

const addOrder = (arr, callback) => arr.map((item, index) => {
  callback && callback(item, index)
  item.order = index + 1
  return item
})

const getColumns = ({ type, check, view, registTypeList }) => ({
  1: registerColumns(registTypeList),
  2: factoryAgentColumns,
  3: authColumns,
  4: entrustColumns,
  5: otherColumns,
})[type].concat(baseColumns({
  excludeArr: type - 0 === 2 ? ['certificateReviewType'] : undefined,
  check,
  view,
}))

export default {
  addOrder,
  getFormData,
  getColumns,
}
