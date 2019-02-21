import React from 'react'
import CustmTabelInfo from '../../../components/CustmTabelInfo'

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
}
const noLabelLayout = {
  wrapperCol: { span: 22 },
}

const formItemData = [{
  layout: noLabelLayout,
  field: 'keywords',
  width: 220,
  component: {
    name: 'Input',
    props: {
      placeholder: '手机号/组织名称/联系人',
    },
  },
}]

const columns = ({ relationStatus }) => [{
  title: '序号',
  dataIndex: 'order',
  className: 'aek-text-center',
  width: 60,
}, {
  title: '名称',
  dataIndex: 'name',
  render: (text, {
    orgLogoUrl: logoUrl,
    sourceOrgName: orgName,
    contactPhone,
    contactName,
    sourceOrgId,
    relationType,
    status,
  }) => {
    const props = {
      logoUrl,
      orgName,
      contactName,
      contactPhone,
      isShowContact: true,
      to: relationType - 1 ?
        `/contacts/newContactsRelationHQ/customerDetail/${sourceOrgId}` :
        `/contacts/newContactsRelationHQ/supplierDetail/${sourceOrgId}`,
      query: { status: status - 2 ? 3 : 1, isNewRelation: true },
    }
    return <CustmTabelInfo {...props} />
  },
}, {
  title: '申请说明',
  dataIndex: 'applyDescription',
}, {
  title: '关系类型',
  dataIndex: 'relationType',
  render(type) {
    return ({
      1: '申请成为你的供应商',
      2: '申请成为你的客户',
    })[type]
  },
}, {
  title: '申请时间',
  dataIndex: 'applyDate',
  className: 'aek-text-center',
  width: 160,
}, {
  title: '操作',
  dataIndex: 'operation',
  className: 'aek-text-center aek-gray',
  width: 150,
  render: (text, { id, status }) => ({
    2: '已通过',
    3: '已拒绝',
    4: '已忽略',
    1: (
      <span>
        <a onClick={() => { relationStatus(id, 2) }}>通过</a>
        <span className="ant-divider" />
        <a onClick={() => { relationStatus(id, 3) }}>拒绝</a>
        <span className="ant-divider" />
        <a onClick={() => { relationStatus(id, 4) }}>忽略</a>
      </span>
    ),
  })[status],
}]

const formData = ({ id, status }) => [{
  label: '拒绝原因',
  layout: formItemLayout,
  field: 'reason',
  col: 22,
  options: {
    rules: [{ required: true, message: '必填项不能为空' }],
  },
  component: {
    name: 'TextArea',
    props: {
      placeholder: '请输入',
    },
  },
}, {
  field: 'id',
  otherProps: {
    style: { display: 'none' },
  },
  options: {
    initialValue: id,
  },
  component: {
    name: 'Input',
  },
}, {
  field: 'status',
  otherProps: {
    style: { display: 'none' },
  },
  options: {
    initialValue: status,
  },
  component: {
    name: 'Input',
  },
}]

const addOrder = (arr, callback) => arr.map((item, index) => {
  callback && callback(item, index)
  item.order = index + 1
  return item
})

export default {
  formItemData,
  columns,
  addOrder,
  formData,
}
