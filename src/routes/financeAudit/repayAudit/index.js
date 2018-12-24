import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { getBasicFn, getPagination } from '../../../utils'
import { Breadcrumb } from '../../../components'
import TabItem from '../../shared/finance/repay/TabItem'

const namespace = 'repayAudit'
const propTypes = {
  repayAudit: PropTypes.object,
  loading: PropTypes.object,
}
const IndexPage = ({ repayAudit, loading }) => {
  const { searchSaveParam, pagination, repayRecordList } = repayAudit
  const { dispatchAction, getLoading } = getBasicFn({ namespace, loading })
  const itemParam = {
    type: 'bank',
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
  return (
    <div className="aek-layout">
      <div className="bread">
        <Breadcrumb />
      </div>
      <div className="content">
        <TabItem {...itemParam} />
      </div>
    </div>
  )
}

IndexPage.propTypes = propTypes
export default connect(({ repayAudit, loading }) => ({ repayAudit, loading }))(IndexPage)
