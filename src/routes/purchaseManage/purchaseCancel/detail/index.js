import PropTypes from 'prop-types'
import { connect } from 'dva'

import CancelDetailData from '../../../shared/cancelOrder/detail/index'

const namespace = 'purchaseCancelDetail'
const PurchaseCancelDetail = ({ purchaseCancelDetail, loading }) => {
  const content = CancelDetailData({ namespace, cancelDetailBean: purchaseCancelDetail, loading })
  return content
}

PurchaseCancelDetail.propTypes = {
  purchaseCancelDetail: PropTypes.object,
  loading: PropTypes.object,
}
export default connect(({ purchaseCancelDetail, loading }) => ({ purchaseCancelDetail, loading }))(
  PurchaseCancelDetail,
)
