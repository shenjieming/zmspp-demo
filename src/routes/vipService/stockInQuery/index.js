import React from 'react'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import { Link } from 'dva/router'
import { cloneDeep, trim } from 'lodash'
import moment from 'moment'
import { Input, Table, Spin, Alert, Button } from 'antd'

import Breadcrumb from '../../../components/Breadcrumb'
import SearchForm from '../../../components/SearchFormFilter'
import { getBasicFn, getOption, formatNum, getPagination } from '../../../utils'
import { NO_LABEL_LAYOUT } from '../../../utils/constant.js'
import styles from './index.less'

const Search = Input.Search
const propTypes = {
  stockInQuery: PropTypes.object,
  loading: PropTypes.object,
}
const namespace = 'stockInQuery'
const StockInQuery = ({ stockInQuery, loading }) => {
  const { dispatchAction, getLoading } = getBasicFn({ namespace, loading })
  const {
    customerListData,
    selectedCustomer,
    searchParamsSave,
    tableData,
    vipStatus,
    pagination,
    keywords,
  } = stockInQuery
  // 选中客户
  const selectCustomer = (item) => {
    dispatchAction({ type: 'updateState', payload: { selectedCustomer: item } })
    dispatchAction({ type: 'resetSearchParams' })
    dispatchAction({ type: 'getVipStatus' })
  }
  // 列表搜索
  const onSearch = (value) => {
    dispatchAction({ type: 'updateState', payload: { searchParamsSave: value } })
    const params = cloneDeep(value)
    if (params && params.orderTime && params.orderTime.length) {
      params.accountTimeEnd = moment(params.orderTime[1]).format('YYYY-MM-DD')
      params.accountTimeStart = moment(params.orderTime[0]).format('YYYY-MM-DD')
    }
    params.formKey = params.formKey && params.formKey.key
    params.formNo = trim(value.formNo) ? trim(value.formNo) : null
    dispatchAction({ type: 'updateState', payload: { searchParams: params } })
    dispatchAction({ type: 'getData', payload: { ...params, current: 1 } })
  }
  const onPageChange = (current, pageSize) => {
    dispatchAction({ type: 'getData', payload: { current, pageSize } })
  }
  const customerList = () => {
    let lis = ''
    if (customerListData.length === 0) {
      lis = <div className={styles.noSupplier}>—— 暂无可选择客户 ——</div>
    } else {
      lis = (
        <ul className="aek-mt10">
          {customerListData.filter(item => item.hplName.indexOf(keywords) > -1).map(item => (
            <li
              key={item.hplId}
              className={`${styles.li} ${
                item.hplId === selectedCustomer.hplId ? styles.activeLi : ''
              }`}
            >
              <a
                onClick={() => {
                  selectCustomer(item)
                }}
              >
                {item.hplName}
              </a>
            </li>
          ))}
        </ul>
      )
    }
    return <Spin spinning={getLoading('getCustomerData', 'getVipStatus', 'getData')}>{lis}</Spin>
  }
  const searchProps = {
    key: selectedCustomer.hplId,
    formData: [
      {
        width: 220,
        layout: NO_LABEL_LAYOUT,
        field: 'orderTime',
        component: {
          name: 'RangePicker',
        },
        options: {
          initialValue: null,
        },
      },
      {
        layout: NO_LABEL_LAYOUT,
        field: 'formStatus',
        width: 150,
        options: {
          initialValue: null,
        },
        component: {
          name: 'Select',
          props: {
            optionLabelProp: 'title',
            children: getOption(
              [
                {
                  id: null,
                  name: '不限',
                },
                {
                  id: '3',
                  name: '发票已录',
                },
                {
                  id: '2',
                  name: '发票未录',
                },
              ],
              { prefix: '发票' },
            ),
          },
        },
      },
      {
        layout: NO_LABEL_LAYOUT,
        field: 'formKey',
        width: 150,
        options: {
          initialValue: null,
        },
        component: {
          name: 'LkcSelect',
          props: {
            url: '/system/dicValue/dicKey',
            optionConfig: { idStr: 'dicValue', nameStr: 'dicValueText' },
            transformPayload: () => ({
              dicKey: 'STOCKIN_TYPE',
            }),
            placeholder: '类型',
            modeType: 'select',
          },
        },
      },
      {
        width: 220,
        layout: NO_LABEL_LAYOUT,
        field: 'keywords',
        component: {
          name: 'Input',
          props: {
            placeholder: '入库单号',
          },
        },
        options: {
          initialValue: null,
        },
      },
    ],
    initialValues: searchParamsSave,
    loading: getLoading('getVipStatus', 'getData'),
    onSearch,
  }
  const tableParams = {
    style: { marginBottom: '40px' },
    className: 'aek-mt10',
    bordered: true,
    dataSource: tableData,
    pagination: getPagination(onPageChange, pagination),
    rowKey: 'formId',
    columns: [
      {
        title: '序号',
        key: 'index',
        className: 'aek-text-center',
        width: 50,
        render: (value, row, index) => index + 1,
      },
      {
        title: '入库单号',
        dataIndex: 'formNo',
      },
      {
        title: '类型',
        dataIndex: 'formName',
      },
      {
        title: '送货单号',
        dataIndex: 'transferNo',
        render(data, row) {
          if (!row.transferId) {
            return data
          }
          return (
            <Link
              to={`/orderManage/deliveryOrder/deliveryDetail/${row.transferId}`}
              target="_blank"
            >
              {data}
            </Link>
          )
        },
      },
      {
        title: '记账时间',
        dataIndex: 'accountTime',
      },
      {
        title: '金额',
        dataIndex: 'formAmount',
        className: 'aek-text-right',
        render(data) {
          return formatNum(data)
        },
      },
      {
        title: '发票状态',
        dataIndex: 'invoiceStatus',
      },
      {
        title: '操作',
        key: 'oprate',
        width: 150,
        className: 'aek-text-center',
        render(_, row) {
          return <Link to={`/vipService/stockInQuery/detail/${row.formId}`}>查看</Link>
        },
      },
    ],
  }
  const getContetByStatus = () => {
    const { status, day } = vipStatus
    if (status === 1) {
      return (
        <div className={styles.noPermissionBg}>
          <div className="aek-font-large aek-mb20">{`您尚未开通“${
            selectedCustomer.hplName
          }”增值服务`}</div>
          <Link to={`/vipPage/${selectedCustomer.hplId}`}>
            <Button type="primary">立即开通</Button>
          </Link>
        </div>
      )
    }
    const getContent = () => (
      <div>
        剩余
        {day}
        天到期
        <span className="aek-fr">
          <Link to={`/vipPage/${selectedCustomer.hplId}`}>立即续费</Link>
        </span>
      </div>
    )
    return (
      <div>
        <SearchForm {...searchProps} />
        {status === 3 ? <Alert message={getContent()} type="warning" showIcon /> : ''}
        <Table {...tableParams} />
      </div>
    )
  }
  return (
    <div className="aek-layout">
      <div className="bread">
        <Breadcrumb />
      </div>
      <div className="content">
        <div className="aek-layout-hor">
          <div className="left">
            <Search
              placeholder="客户名称检索"
              style={{ width: 280 }}
              onChange={(e) => {
                dispatchAction({
                  payload: {
                    keywords: trim(e.target.value),
                  },
                })
              }}
            />
            {customerList()}
          </div>
          <div className="right aek-pl10">
            <Spin spinning={getLoading('getCustomerData', 'getVipStatus', 'getData')}>
              {getContetByStatus()}
            </Spin>
          </div>
        </div>
      </div>
    </div>
  )
}

StockInQuery.propTypes = propTypes
export default connect(({ stockInQuery, loading }) => ({ stockInQuery, loading }))(StockInQuery)
