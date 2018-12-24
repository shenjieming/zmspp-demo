import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { getBasicFn } from '../../../../utils'
import Detail from '../../../shared/finance/repay/Detail'

const namespace = 'repayAuditDetail'
const propTypes = {
  repayAuditDetail: PropTypes.object,
  loading: PropTypes.object,
}

const DetailPage = ({ repayAuditDetail, loading }) => {
  const { dispatchAction, getLoading } = getBasicFn({ namespace, loading })
  const detailParam = {
    namespace: repayAuditDetail,
    loading: getLoading('getLoanDetail'),
    dispatchAction,
    type: 'bank',
  }
  return <Detail {...detailParam} />
}

DetailPage.propTypes = propTypes
export default connect(({ repayAuditDetail, loading }) => ({ repayAuditDetail, loading }))(
  DetailPage,
)
