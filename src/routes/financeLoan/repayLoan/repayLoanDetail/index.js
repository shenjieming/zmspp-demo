import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { getBasicFn } from '../../../../utils'
import Detail from '../../../shared/finance/repay/Detail'

const namespace = 'repayLoanDetail'
const propTypes = {
  repayLoanDetail: PropTypes.object,
  loading: PropTypes.object,
}

const DetailPage = ({ repayLoanDetail, loading }) => {
  const { getLoading } = getBasicFn({ namespace, loading })
  const detailParam = {
    namespace: repayLoanDetail,
    loading: getLoading('getLoanDetail'),
  }
  return <Detail {...detailParam} />
}

DetailPage.propTypes = propTypes
export default connect(({ repayLoanDetail, loading }) => ({ repayLoanDetail, loading }))(DetailPage)
