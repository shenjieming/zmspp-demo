import React from 'react'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import { Table, Input, Spin, Button, Alert } from 'antd'
import { get, trim, cloneDeep } from 'lodash'
import { Link } from 'dva/router'
import moment from 'moment'
import Breadcrumb from '../../../components/Breadcrumb'
import SearchForm from '../../../components/SearchFormFilter'
import { getBasicFn, getPagination, getOption } from '../../../utils'
import { NO_LABEL_LAYOUT } from '../../../utils/constant'
import columns from './columns'
import styles from './index.less'

const namespace = 'consignmentStock'
const Search = Input.Search
const FORM_ITEM_LAYOUT = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
}

function Page({ consignmentStock, loading }) {
  const {
    searchParams,
    searchParamsSave,
    tableData,
    pagination,
    depts,
    qty,
    selectedCustomer,
    customerListData,
    keywords,
    vipStatus,
  } = consignmentStock
  const { dispatchAction, getLoading } = getBasicFn({ namespace, loading })

  // 列表搜索
  const onSearch = (value) => {
    dispatchAction({ type: 'updateState', payload: { searchParamsSave: value } })
    const params = cloneDeep(value)
    if (params && params.orderTime && params.orderTime.length) {
      params.submitTimeEnd = moment(params.orderTime[1]).format('YYYY-MM-DD')
      params.submitTimeStart = moment(params.orderTime[0]).format('YYYY-MM-DD')
    }
    params.formKey = params.formKey && params.formKey.key
    params.formNo = trim(value.formNo) ? trim(value.formNo) : null
    dispatchAction({ type: 'updateState', payload: { searchParams: params } })
    dispatchAction({ type: 'getData', payload: { ...params, current: 1 } })
  }

  const searchProps = {
    key: selectedCustomer.hplId,
    formData: [
      {
        layout: FORM_ITEM_LAYOUT,
        label: '库房',
        field: 'whId',
        width: 300,
        options: {
          initialValue: null,
        },
        component: {
          name: 'Select',
          props: {
            children: getOption(depts, {
              prefix: '库房',
              idStr: 'deptId',
              nameStr: 'receiveDeptName',
            }),
          },
        },
      },
      {
        layout: NO_LABEL_LAYOUT,
        field: 'statisticsType',
        width: 220,
        options: {
          initialValue: '1',
        },
        component: {
          name: 'Select',
          props: {
            optionLabelProp: 'title',
            children: getOption(
              [
                {
                  id: '1',
                  name: '库存明细',
                },
                {
                  id: '2',
                  name: '批号',
                },
                {
                  id: '3',
                  name: '规格',
                },
              ],
              { prefix: '统计方式' },
            ),
          },
        },
      },
      {
        width: 150,
        layout: NO_LABEL_LAYOUT,
        field: 'gatherFlag',
        component: {
          name: 'Checkbox',
          props: {
            children: '不显示0库存物资',
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
  const filterFields = {
    2: ['lastEditTime'],
    3: ['batchNo', 'expiredDate', 'trackCode', 'lastEditTime'],
  }
  const fields = get(filterFields, get(searchParams, 'statisticsType', '1'), [])
  // 根据统计方式筛选字段
  const tableColumns = columns.filter(item => !fields.includes(item.key))
  const onChange = ({ current, pageSize }) => {
    dispatchAction({
      type: 'getExchangeList',
      payload: {
        current,
        pageSize,
        ...searchParams,
      },
    })
  }
  const tableParams = {
    columns: tableColumns,
    rowKey: 'exchangeId',
    dataSource: tableData,
    bordered: true,
    pagination: getPagination(pagination, onChange),
    loading: getLoading('getExchangeList'),
  }

  // 选中客户
  const selectCustomer = (item) => {
    dispatchAction({ type: 'updateState', payload: { selectedCustomer: item } })
    dispatchAction({ type: 'resetSearchParams' })
    dispatchAction({ type: 'getVipStatus' }) // 包含了判断和数据查询
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

Page.propTypes = {
  consignmentStock: PropTypes.object.isRequired,
  loading: PropTypes.object.isRequired,
}

const mapStateToProps = store => ({ [namespace]: store[namespace], loading: store.loading })

export default connect(mapStateToProps)(Page)
