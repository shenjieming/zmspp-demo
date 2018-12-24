import React from 'react'
import { Link } from 'dva/router'
import { Dropdown, Icon, Menu } from 'antd'
import { getOption, formatNum } from '../../../utils'

const noLabelLayout = {
  wrapperCol: { span: 22 },
}
const FORM_ITEM_LAYOUT = {
  labelCol: { span: 7 },
  wrapperCol: { span: 17 },
}
const formStatusArr = [
  '',
  <span>暂存</span>,
  <span className="aek-green">配送中</span>,
  <span>已验收</span>,
  <span className="aek-red">已作废</span>,
]
const invoiceStatusArr = ['', '尚未开票', '部分开票', '开票完结']
const formTypeArr = ['', '普耗', '寄销', '跟台']
const advancedForm = ({ customerOPList, onSearchListDelay }) => [
  {
    layout: FORM_ITEM_LAYOUT,
    label: '客户',
    field: 'customerOrgId',
    component: {
      name: 'Select',
      props: {
        placeholder: '请选择客户',
        labelInValue: true,
        children: getOption(customerOPList, {
          idStr: 'customerOrgId',
          nameStr: 'customerOrgName',
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
    label: '配送单状态',
    field: 'formStatus',
    component: {
      name: 'Select',
      props: {
        children: getOption([
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
          {
            id: '4',
            name: '已作废',
          },
        ]),
      },
    },
    options: {
      initialValue: null,
    },
  },
  {
    layout: FORM_ITEM_LAYOUT,
    label: '开票状态',
    field: 'invoiceStatus',
    component: {
      name: 'Select',
      props: {
        children: getOption([
          {
            id: null,
            name: '全部',
          },
          {
            id: '1',
            name: '尚未开票',
          },
          {
            id: '2',
            name: '部分开票',
          },
          {
            id: '3',
            name: '开票完结',
          },
        ]),
      },
    },
    options: {
      initialValue: null,
    },
  },
  {
    layout: FORM_ITEM_LAYOUT,
    label: '订单类型',
    field: 'type',
    component: {
      name: 'Select',
      props: {
        children: getOption([
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
        ]),
      },
    },
    options: {
      initialValue: '0',
    },
  },
  {
    layout: FORM_ITEM_LAYOUT,
    label: '发货时间',
    field: 'deliverTime',
    component: {
      name: 'RangePicker',
    },
  },
  {
    layout: FORM_ITEM_LAYOUT,
    label: '采购时间',
    field: 'purchaseTime',
    component: {
      name: 'RangePicker',
    },
  },
  {
    layout: FORM_ITEM_LAYOUT,
    label: '关键字',
    field: 'keywords',
    component: {
      name: 'Input',
      props: {
        placeholder: '请输入订单编号/配送单号/收货单位',
      },
    },
  },
]

const formData = ({ customerOPList, onSearchListDelay }) => [
  {
    layout: noLabelLayout,
    field: 'customerOrgId',
    width: 220,
    otherProps: { style: { marginLeft: 12 } },
    component: {
      name: 'Select',
      props: {
        placeholder: '请选择客户',
        labelInValue: true,
        children: getOption(customerOPList, {
          idStr: 'customerOrgId',
          nameStr: 'customerOrgName',
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
            {
              id: '4',
              name: '已作废',
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
    layout: noLabelLayout,
    field: 'invoiceStatus',
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
              id: '1',
              name: '尚未开票',
            },
            {
              id: '2',
              name: '部分开票',
            },
            {
              id: '3',
              name: '开票完结',
            },
          ],
          { prefix: '开票状态' },
        ),
      },
    },
    options: {
      initialValue: null,
    },
  },
  {
    layout: noLabelLayout,
    field: 'keywords',
    width: 220,
    component: {
      name: 'Input',
      props: {
        placeholder: '请输入订单编号/配送单号/收货单位',
      },
    },
  },
]
const genColumns = ({ printDeliverOrder, againDeliver, changeLogisInfo }) =>
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
        <Link className="aek-link" to={`/orderManage/deliveryOrder/deliveryDetail/${formId}`}>
          {text}
        </Link>
      ),
    },
    {
      title: '客户名称',
      dataIndex: 'customerOrgName',
      key: 'customerOrgName',
      // render: (text, { receiveOrgName, saleType }) =>
      //   (!text && !receiveOrgName ? (
      //     ''
      //   ) : (
      //     <span>
      //       <p>{text || <span>&nbsp;</span>}</p>
      //       {saleType === 2 && (
      //         <p>
      //           {receiveOrgName ? <span>收货单位：{receiveOrgName}</span> : <span>&nbsp;</span>}
      //         </p>
      //       )}
      //     </span>
      //   )),
    },
    {
      title: '配送金额',
      dataIndex: 'formAmount',
      className: 'aek-text-right',
      render(text) {
        return formatNum(text, { format: true })
      },
    },
    {
      title: '开票情况',
      dataIndex: 'invoiceStatus',
      key: 'invoiceStatus',
      render: text => text && invoiceStatusArr[Number(text)],
    },
    {
      title: '客户订单号',
      dataIndex: 'originalFormNo',
      key: 'originalFormNo',
      render: (text, { originalFormId }) => (
        <Link className="aek-link" to={`/orderManage/customerOrder/detail/${originalFormId}`}>
          {text}
        </Link>
      ),
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
      title: '配送人',
      dataIndex: 'deliverName',
    },
    {
      title: '配送时间',
      dataIndex: 'deliverTime',
      key: 'deliverTime',
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (text, record) => {
        const { formId, formType } = record
        const handleMenuClick = (val) => {
          switch (val.key) {
            case '1':
              changeLogisInfo({ formId })
              break
            default:
              break
          }
        }
        const menu = (
          <Menu onClick={handleMenuClick}>
            <Menu.Item key="1">
              <a>修改配送信息</a>
            </Menu.Item>
          </Menu>
        )

        return (
          <span>
            {Number(formType) === 1 && [
              <Link
                className="aek-link"
                key={1}
                to={`/orderManage/deliveryOrder/deliveryDetail/${formId}`}
              >
                发票补录
              </Link>,
              <span key={2} className="ant-divider" />,
            ]}
            {
              Number(record.formStatus) === 4 && [
                <a
                  key="again"
                  onClick={() => {
                    againDeliver(formId, formType)
                  }}
                >再次发货</a>,
                <span key={3} className="ant-divider" />,
              ]
            }
            <a onClick={() => printDeliverOrder(record)}>打印配送单</a>
            {
              Number(record.formStatus) === 2 && [
                <span key={4} className="ant-divider" />,
                <Dropdown key="dropdown" overlay={menu} trigger={['click']}>
                  <a
                    key="more"
                  >更多<Icon type="down" /></a>
                </Dropdown>,
              ]
            }
          </span>
        )
      },
    },
  ].filter(_ => !_.exclude)

export default {
  genColumns,
  formData,
  advancedForm,
}
