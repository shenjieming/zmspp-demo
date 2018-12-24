import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Tabs, Table, Button, Alert } from 'antd'
import { getBasicFn, getPagination } from '../../../utils'
import { Breadcrumb, SearchFormFilter } from '../../../components'
import { formData, genColumns } from './props'
import TabItem from '../../shared/finance/repay/TabItem'

const { TabPane } = Tabs
const namespace = 'repayLoan'
const propTypes = {
  repayLoan: PropTypes.object,
  loading: PropTypes.object,
}
const IndexPage = ({ repayLoan, loading }) => {
  const { dispatchAction, getLoading } = getBasicFn({ namespace, loading })
  const {
    pagination,
    repayWillList,
    repayRecordList,
    searchSaveParam,
    currentTabIndex,
    checkedList,
    repayQty,
    repayAmount,
  } = repayLoan
  const tabsChange = (key) => {
    dispatchAction({
      payload: {
        currentTabIndex: Number(key),
        pagination: {
          current: 1,
          pageSize: 10,
          total: null,
        },
        searchSaveParam: {},
      },
    })
    if (Number(key) === -1) {
      dispatchAction({
        type: 'getRepayWillList',
      })
    } else {
      dispatchAction({
        type: 'getRepayRecordList',
      })
    }
  }
  const turnUrl = (ids) => {
    // 批量申请
    // console.log(ids)
    dispatchAction(routerRedux.push(`/financeLoan/repayLoan/repayApplyDetail/${ids}`))
  }
  const tableParam = {
    // rowSelection: {
    //   onChange: (selectedRowKeys) => {
    //     dispatchAction({
    //       payload: {
    //         checkedList: selectedRowKeys,
    //       },
    //     })
    //   },
    //   selectedRowKeys: checkedList,
    // },
    bordered: true,
    loading: getLoading('getRepayWillList'),
    columns: genColumns(),
    dataSource: repayWillList,
    pagination: getPagination((current, pageSize) => {
      dispatchAction({
        type: 'getRepayWillList',
        payload: { current, pageSize },
      })
    }, pagination),
    // scroll: { x: 1100 },
    rowKey: 'formId',
  }
  const itemParam = {
    type: 'supplier',
    loading: getLoading('getRepayRecordList'),
    dataSource: repayRecordList,
    initialValues: searchSaveParam,
    onSearch(data) {
      dispatchAction({
        payload: { searchSaveParam: data },
      })
      dispatchAction({
        type: 'getRepayRecordList',
        payload: { ...pagination, current: 1 },
      })
    },
    pagination: getPagination((current, pageSize) => {
      dispatchAction({
        type: 'getRepayRecordList',
        payload: { current, pageSize },
      })
    }, pagination),
  }
  const searchParams = {
    initialValues: searchSaveParam,
    onSearch(data) {
      dispatchAction({
        payload: { searchSaveParam: data },
      })
      dispatchAction({
        type: 'getRepayWillList',
        payload: { ...pagination, current: 1 },
      })
    },
    formData,
  }
  return (
    <div className="aek-layout">
      <div className="bread">
        <Breadcrumb />
      </div>
      <div className="content">
        <Tabs activeKey={String(currentTabIndex)} animated={false} onChange={tabsChange}>
          <TabPane tab="可还贷款" key="-1">
            <SearchFormFilter key={String(currentTabIndex)} {...searchParams} />
            <div>
              {
                // repayWillList &&
                // repayWillList.length > 0 && (
                //   <Button
                //     className="aek-mb10"
                //     disabled={checkedList.length === 0}
                //     onClick={() => turnUrl(checkedList.join(','))}
                //   >
                //     批量还款
                //   </Button>
                // )
              }
              {repayWillList &&
                repayWillList.length > 0 && (
                  <Alert
                    className="aek-mb10"
                    message={
                      <span>
                        共需还款情况：共{repayQty}笔 {repayAmount}
                      </span>
                    }
                    type="info"
                  />
                )}
            </div>
            <Table {...tableParam} />
          </TabPane>
          <TabPane tab="还款记录" key="1">
            <TabItem key={String(currentTabIndex)} {...itemParam} />
          </TabPane>
        </Tabs>
      </div>
    </div>
  )
}

IndexPage.propTypes = propTypes
export default connect(({ repayLoan, loading }) => ({ repayLoan, loading }))(IndexPage)
