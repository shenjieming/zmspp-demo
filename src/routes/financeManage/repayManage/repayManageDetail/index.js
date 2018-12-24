import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { getBasicFn } from '../../../../utils'
import Detail from '../../../shared/finance/repay/Detail'

const namespace = 'repayManageDetail'
const propTypes = {
  repayManageDetail: PropTypes.object,
  loading: PropTypes.object,
}

const DetailPage = ({ repayManageDetail, loading }) => {
  const { dispatchAction, getLoading } = getBasicFn({ namespace, loading })
  const detailParam = {
    namespace: repayManageDetail,
    loading: getLoading('getLoanDetail'),
    dispatchAction,
    type: 'manage',
  }
  return <Detail {...detailParam} />
}

DetailPage.propTypes = propTypes
export default connect(({ repayManageDetail, loading }) => ({ repayManageDetail, loading }))(
  DetailPage,
)
