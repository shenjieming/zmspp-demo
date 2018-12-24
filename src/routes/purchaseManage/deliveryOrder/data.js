import React from 'react'
import { Link } from 'dva/router'
import { stringify } from 'qs'
import { getOption } from '../../../utils'

const noLabelLayout = {
  wrapperCol: { span: 22 },
}
const FORM_ITEM_LAYOUT = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
}
const formStatusArr = [
  '',
  <span>暂存</span>,
  <span className="aek-green">配送中</span>,
  <span>已验收</span>,
  <span className="aek-red">已作废</span>,
]
const formTypeArr = ['', '普耗', '寄销', '跟台']

const formData = ({ supplierOPList, onSearchListDelay }) => [
  {
    layout: noLabelLayout,
    field: 'supplierOrgId',
    width: 220,
    otherProps: { style: { marginLeft: 12 } },
    component: {
      name: 'Select',
      props: {
        placeholder: '请选择供应商',
        labelInValue: true,
        children: getOption(supplierOPList, {
          idStr: 'supplierOrgId',
          nameStr: 'supplierOrgName',
        }),
        onSearch: onSearchListDelay,
        showSearch: true,
        defaultActiveFirstOption: false,
        filterOption: false,
        notFoundContent: false,
        allowClear: true,
      },
    },
    options: {
      initialValue: undefined,
    },
  },
  {
    layout: noLabelLayout,
    field: 'formStatus',
    width: 220,
    component: {
      name: 'Select',
      props: {
        optionLabelProp: 'title',
        children: getOption(
          [
            {
              id: null,
              name: '全部',
            },
            {
              id: '2',
              name: '配送中',
            },
            {
              id: '3',
              name: '已验收',
            },
          ],
          { prefix: '配送单状态' },
        ),
      },
    },
    options: {
      initialValue: null,
    },
  },
  // {
  //   layout: noLabelLayout,
  //   field: 'type',
  //   component: {
  //     name: 'Select',
  //     props: {
  //       optionLabelProp: 'title',
  //       children: getOption(
  //         [
  //           {
  //             id: '0',
  //             name: '全部',
  //           },
  //           {
  //             id: '1',
  //             name: '普耗',
  //           },
  //           {
  //             id: '2',
  //             name: '寄销',
  //           },
  //           {
  //             id: '5',
  //             name: '跟台',
  //           },
  //           {
  //             id: '3',
  //             name: '过票-普耗',
  //           },
  //           {
  //             id: '4',
  //             name: '过票-寄销',
  //           },
  //           {
  //             id: '6',
  //             name: '过票-跟台',
  //           },
  //         ],
  //         { prefix: '订单类型' },
  //       ),
  //     },
  //   },
  //   options: {
  //     initialValue: '0',
  //   },
  // },
  // {
  //   layout: noLabelLayout,
  //   field: 'deliverTime',
  //   width: 220,
  //   component: {
  //     name: 'RangePicker',
  //   },
  // },
  {
    layout: noLabelLayout,
    field: 'keywords',
    width: 220,
    component: {
      name: 'Input',
      props: {
        placeholder: '订单编号/配送单号/收货单位',
      },
    },
  },
]

const advancedFormData = ({ supplierOPList, onSearchListDelay }) => [
  {
    layout: FORM_ITEM_LAYOUT,
    label: '供应商',
    field: 'supplierOrgId',
    otherProps: { style: { marginLeft: 12 } },
    component: {
      name: 'Select',
      props: {
        placeholder: '请选择供应商',
        labelInValue: true,
        children: getOption(supplierOPList, {
          idStr: 'supplierOrgId',
          nameStr: 'supplierOrgName',
        }),
        onSearch: onSearchListDelay,
        showSearch: true,
        defaultActiveFirstOption: false,
        filterOption: false,
        notFoundContent: false,
        allowClear: true,
      },
    },
    options: {
      initialValue: undefined,
    },
  },
  {
    layout: FORM_ITEM_LAYOUT,
    label: '订单状态',
    field: 'formStatus',
    component: {
      name: 'Select',
      props: {
        optionLabelProp: 'title',
        children: getOption(
          [
            {
              id: null,
              name: '全部',
            },
            {
              id: '2',
              name: '配送中',
            },
            {
              id: '3',
              name: '已验收',
            },
          ],
          { prefix: '配送单状态' },
        ),
      },
    },
    options: {
      initialValue: null,
    },
  },
  {
    layout: FORM_ITEM_LAYOUT,
    label: '类型',
    field: 'type',
    component: {
      name: 'Select',
      props: {
        optionLabelProp: 'title',
        children: getOption(
          [
            {
              id: '0',
              name: '全部',
            },
            {
              id: '1',
              name: '普耗',
            },
            {
              id: '2',
              name: '寄销',
            },
            {
              id: '5',
              name: '跟台',
            },
            {
              id: '3',
              name: '过票-普耗',
            },
            {
              id: '4',
              name: '过票-寄销',
            },
            {
              id: '6',
              name: '过票-跟台',
            },
          ],
          { prefix: '订单类型' },
        ),
      },
    },
    options: {
      initialValue: '0',
    },
  },
  {
    layout: FORM_ITEM_LAYOUT,
    label: '配送时间',
    field: 'deliverTime',
    component: {
      name: 'RangePicker',
    },
  },
  {
    layout: FORM_ITEM_LAYOUT,
    label: '关键词',
    field: 'keywords',
    component: {
      name: 'Input',
      props: {
        placeholder: '订单编号/配送单号/收货单位',
      },
    },
  },
]

const genColumns = ({ printDeliverOrder, orgId }) =>
  [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      className: 'aek-text-center',
      render: (text, { urgentFlag, originalFormStatus }, idx) => {
        if (urgentFlag && originalFormStatus < 3) {
          return {
            children: <span>{idx + 1}</span>,
            props: { className: 'aek-urgent aek-text-center' },
          }
        }
        return <span>{idx + 1}</span>
      },
    },
    {
      title: '配送单号',
      dataIndex: 'formNo',
      key: 'formNo',
      render: (text, { formId }) => (
        <Link
          className="aek-text-overflow  aek-link"
          to={`/purchaseManage/deliveryOrder/deliveryDetail/${formId}`}
        >
          {text}
        </Link>
      ),
    },
    {
      title: '供应商名称',
      dataIndex: 'supplierOrgName',
    },
    {
      title: '配送信息',
      dataIndex: 'deliverType',
      key: 'deliverType',
      render: (text, record) => {
        const {
          deliverType,
          deliverCompany,
          deliverNo,
          deliverName,
          deliverPhone,
          formId,
          formType,
        } = record
        if (deliverType === 1 && formType !== 3) {
          return (
            <Link
              className="aek-link"
              to={`/purchaseManage/deliveryOrder/purchaseLogistics/${formId}`}
            >
              {deliverCompany}-{deliverNo}
            </Link>
          )
        } else if (deliverType === 2 && formType !== 3) {
          return (
            <Link
              className="aek-link"
              to={`/purchaseManage/deliveryOrder/purchaseLogistics/${formId}`}
            >
              自送{deliverName && <span>-{deliverName}</span>}
              {deliverPhone && <span>-{deliverPhone}</span>}
            </Link>
          )
        }
        return ''
      },
    },
    {
      title: '订单金额',
      dataIndex: 'formAmount',
      className: 'aek-text-right',
      render: text => `￥${text}`,
    },
    {
      title: '类型',
      dataIndex: 'formType',
      key: 'formType',
      render: (text, { saleType }) => {
        if (saleType && Number(saleType) === 2) {
          return <span>过票-{text && formTypeArr[Number(text)]}</span>
        }
        return text && formTypeArr[Number(text)]
      },
    },
    {
      title: '状态',
      dataIndex: 'formStatus',
      key: 'formStatus',
      render: text => text && formStatusArr[Number(text)],
    },
    {
      title: '发货时间',
      dataIndex: 'deliverTime',
      key: 'deliverTime',
      render: text => <span className="aek-text-overflow">{text}</span>,
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      fixed: 'right',
      render: (text, record) => {
        const { formStatus: status, formNo, receiveOrgId } = record
        if (status && Number(status) === 2 && receiveOrgId === orgId) {
          return (
            <Link
              className="aek-link"
              key={1}
              to={`/purchaseManage/scanAcceptance?${stringify({ formNo })}`}
            >
              验收
            </Link>
          )
        } else if (status && Number(status) === 3 && receiveOrgId === orgId) {
          return (
            <a className="aek-link" onClick={() => printDeliverOrder(record)}>
              打印验收单
            </a>
          )
        }
        return ''
      },
    },
  ].filter(_ => !_.exclude)

export default {
  genColumns,
  formData,
  advancedFormData,
}
