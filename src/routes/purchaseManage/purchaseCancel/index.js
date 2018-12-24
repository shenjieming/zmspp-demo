import PropTypes from 'prop-types'
import { connect } from 'dva'

import CancelOrderList from '../../shared/cancelOrder/index'

const namespace = 'purchaseCancel'
const PurchaseCancel = ({ purchaseCancel, loading }) => {
  const content = CancelOrderList({ namespace, orderListBean: purchaseCancel, loading })
  return content
}

PurchaseCancel.propTypes = {
  purchaseCancel: PropTypes.object,
  loading: PropTypes.object,
}
export default connect(({ purchaseCancel, loading }) => ({ purchaseCancel, loading }))(
  PurchaseCancel,
)
