import React from 'react'
import { Link } from 'dva/router'
import CustmTabelInfo from '../../../components/CustmTabelInfo'
import { getOption, segmentation } from '../../../utils'
import { REGEXP_TELEPHONE } from '../../../utils/constant'
import { Button } from 'antd'

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
}
const noLabelLayout = {
  wrapperCol: { span: 22 },
}

const formItemData = [{
  layout: noLabelLayout,
  field: 'supplierStatus',
  width: 220,
  options: {
    initialValue: null,
  },
  component: {
    name: 'Select',
    props: {
      optionLabelProp: 'title',
      children: getOption([{
        id: null,
        name: '全部',
      }, {
        id: '1',
        name: '已通过',
      }, {
        id: '2',
        name: '被解除',
      }], { prefix: '状态' }),
    },
  },
}, {
  label: '',
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

const columns = ({ editContact, relationChange }) => [{
  title: '序号',
  dataIndex: 'order',
  className: 'aek-text-center',
  width: 60,
}, {
  title: '名称',
  dataIndex: 'name',
  render: (text, {
    orgLogoUrl: logoUrl,
    supplierOrgName: orgName,
    intranetOrgName,
    supplierStatus: status,
    supplierContactPhone: contactPhone,
    supplierContactName: contactName,
    supplierOrgId,
    supplierId,
  }) => {
    const props = {
      logoUrl,
      orgName,
      contactName,
      contactPhone,
      intranetOrgName,
      isShowContact: true,
      status,
      to: `/contacts/mySupplier/detail/${supplierOrgId}`,
      query: { status },
      contactEditClick: () => {
        editContact({ contactName, contactPhone, supplierId })
      },
    }
    return <CustmTabelInfo {...props} />
  },
}, {
  title: '关系建立日期',
  dataIndex: 'relationBuildDate',
  className: 'aek-text-center',
  width: 160,
}, {
  title: '操作',
  dataIndex: 'operation',
  className: 'aek-text-center',
  width: 150,
  render: (text, { supplierOrgId, supplierStatus }) => (<span>
    <Link
      to={`/contacts/mySupplier/detail/${supplierOrgId}?status=${supplierStatus}`}
    >查看</Link>
    <span className="ant-divider" />
    <a onClick={() => { relationChange(supplierOrgId, supplierStatus) }}>
      {`${supplierStatus - 1 ? '恢复' : '解除'}关系`}
    </a>
  </span>),
}]

const modalFormData = addressList => [{
  layout: noLabelLayout,
  field: 'orgRegAddr',
  width: 270,
  options: {
    getValueFromEvent: (val, selectedOptions) => {
      const addressArray = [...val]
      for (const item of selectedOptions) {
        addressArray.push(item.label)
      }
      return addressArray
    },
  },
  component: {
    name: 'Cascader',
    props: {
      placeholder: '全部地址',
      options: addressList,
    },
  },
}, {
  label: '',
  layout: noLabelLayout,
  field: 'keywords',
  width: 180,
  component: {
    name: 'Input',
    props: {
      placeholder: '名称/拼音码',
    },
  },
}]

const modalTableColumns = (apply, loading, orgIdSign, linkClick) => [{
  title: '',
  dataIndex: 'orgName',
  key: 'orgName',
  width: 442,
  render: (orgName, record) => {
    const props = {
      logoUrl: record.orgLogoUrl,
      orgName,
      linkClick,
      to: `/contacts/mySupplier/detail/${record.orgId}`,
      query: { status: 3 },
      otherInfo: segmentation([record.address, record.orgRegAddrDetail], ' '),
    }
    return (
      <CustmTabelInfo {...props} />
    )
  },
}, {
  title: '',
  dataIndex: 'orgId',
  key: 'orgId',
  render: (orgId, { orgRelationStatus, orgSupplierReviewFlag, orgTypeValue }) => {
    if (orgRelationStatus === 2) {
      return (<Button
        size="large"
        disabled
      >已申请</Button>)
    } else if (orgRelationStatus === 3) {
      return (<Button
        size="large"
        disabled
      >已添加</Button>)
    } else if (orgRelationStatus === 1) {
      return (
        orgSupplierReviewFlag && !(orgTypeValue - 2) ?
          <Button
            size="large"
            type="primary"
            style={{ width: 80 }}
            onClick={() => { apply(orgId, false) }}
            loading={loading && orgIdSign === orgId}
          >添加</Button> :
          <Button
            size="large"
            type="primary"
            style={{ width: 80 }}
            onClick={() => { apply(orgId, true) }}
          >申请</Button>
      )
    }
    return null
  },
}]

const editFormData = (modalType, { contactName, contactPhone, supplierId }) => [{
  label: '联系负责人',
  layout: formItemLayout,
  field: 'supplierContactName',
  col: 22,
  exclude: modalType !== 'edit',
  options: {
    initialValue: contactName,
  },
  component: {
    name: 'Input',
    props: {
      placeholder: '请输入',
    },
  },
}, {
  label: '手机号',
  layout: formItemLayout,
  field: 'supplierContactPhone',
  col: 22,
  exclude: modalType !== 'edit',
  options: {
    initialValue: contactPhone,
    rules: [{
      pattern: REGEXP_TELEPHONE,
      message: '号码格式有误',
    }],
  },
  component: {
    name: 'Input',
    props: {
      placeholder: '请输入',
    },
  },
}, {
  label: '申请说明',
  layout: formItemLayout,
  field: 'applyDescription',
  col: 22,
  exclude: modalType === 'edit',
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
  field: 'supplierId',
  otherProps: {
    style: { display: 'none' },
  },
  options: {
    initialValue: supplierId,
  },
  component: {
    name: 'Input',
  },
}]

const applyFormData = [{
  label: '申请说明',
  layout: formItemLayout,
  field: 'applyDescription',
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
}]

const addOrder = (arr, callback) => arr.map((item, index) => {
  callback && callback(item, index)
  item.order = index + 1
  return item
})

export default {
  formItemData,
  columns,
  modalFormData,
  addOrder,
  editFormData,
  modalTableColumns,
  applyFormData,
}
