import React from 'react'
import { getOption } from '../../../utils'

const statusText = [
  '',
  <span>
    <span className="aek-green">生成采购单</span>
    {' > '}
    <span>已发货</span>
    {' > '}
    <span>已入库</span>
  </span>,
  <span>
    <span className="aek-green">生成采购单</span>
    {' > '}
    <span className="aek-green">已发货</span>
    {' > '}
    <span>已入库</span>
  </span>,
  <span>
    <span className="aek-green">生成采购单</span>
    {' > '}
    <span className="aek-green">已发货</span>
    {' > '}
    <span className="aek-green">已入库</span>
  </span>,
]

const genColumns = ({ modalShow, purchaseModal, failedModal }) => [
  {
    title: '入库单信息',
    children: [
      {
        title: '入库单号',
        dataIndex: 'formNo',
        key: 'formNo',
        className: 'aek-text-center',
        render: (text, { formId, rowSpan }) => ({
          children: (
            <a className="aek-link" onClick={() => modalShow(formId)}>
              {text}
            </a>
          ),
          props: {
            rowSpan,
          },
        }),
      },
      {
        title: '金额',
        dataIndex: 'formAmount',
        key: 'formAmount',
        render: (text, { rowSpan }) => ({
          children: text,
          props: {
            rowSpan,
          },
        }),
      },
      {
        title: '记账时间',
        dataIndex: 'accountTime',
        key: 'accountTime',
        render: (text, { rowSpan }) => ({
          children: text,
          props: {
            rowSpan,
          },
        }),
        sorter: true,
      },
      {
        title: '供应商',
        dataIndex: 'splName',
        key: 'splName',
        render: (text, { rowSpan }) => ({
          children: text,
          props: {
            rowSpan,
          },
        }),
      },
    ],
  },
  {
    title: '省平台采购单信息',
    children: [
      {
        title: '采购单号',
        dataIndex: 'orderId',
        key: 'orderId',
        className: 'aek-text-center',
        render: (text, { colSpan, orderStatus, formId, orderId }) => {
          const orderStatusText = [
            <span>还未上传，请等待</span>,
            '',
            <a
              onClick={() => {
                failedModal(formId)
              }}
              className="aek-link"
            >
              入库单中有物资上传至省平台失败，请点击这里处理
            </a>,
            <a
              onClick={() => {
                failedModal(formId)
              }}
              className="aek-link"
            >
              入库单中有物资不符合上传规则，请点击这里处理
            </a>,
          ]
          if (colSpan) {
            return {
              children: orderStatusText[orderStatus],
              props: {
                colSpan,
              },
            }
          }
          return (
            <a className="aek-link" onClick={() => purchaseModal(orderId)}>
              {text}
            </a>
          )
        },
      },
      {
        title: '金额',
        dataIndex: 'itemAmount',
        key: 'itemAmount',
        render: (text, { colSpan }) => {
          if (colSpan) {
            return {
              children: text,
              props: {
                colSpan: 0,
              },
            }
          }
          return text
        },
      },
      {
        title: '生成时间',
        dataIndex: 'addTime',
        key: 'addTime',
        render: (text, { colSpan }) => {
          if (colSpan) {
            return {
              children: text,
              props: {
                colSpan: 0,
              },
            }
          }
          return text
        },
      },
      {
        title: '省采购平台订单状态',
        dataIndex: 'itemStatus',
        key: 'itemStatus',
        render: (text, { colSpan }) => {
          if (colSpan) {
            return {
              children: '',
              props: {
                colSpan: 0,
              },
            }
          }
          return statusText[text]
        },
      },
    ],
  },
]
const formData = [
  {
    field: 'periodNo',
    component: {
      name: 'LkcSelect',
      props: {
        url: '/organization/accounting-period/list',
        contentRender: ({ items }) => items,
        optionConfig: { idStr: 'id', nameStr: 'periodNo', prefix: '对账周期' },
        placeholder: '对账周期',
        modeType: 'select',
      },
    },
  },
  {
    field: 'splName',
    component: {
      name: 'Input',
      props: {
        placeholder: '供应商名称',
      },
    },
  },
  {
    field: 'formNo',
    component: {
      name: 'Input',
      props: {
        placeholder: '入库单号',
      },
    },
  },
  {
    field: 'purSyncStatus',
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
          name: '失败',
        }, {
          id: '0',
          name: '成功',
        }], { prefix: '采购状态' }),
      },
    },
  },
  {
    field: 'accountStartTime',
    component: {
      name: 'RangePicker',
    },
  },
]
export default {
  statusText,
  genColumns,
  formData,
}
