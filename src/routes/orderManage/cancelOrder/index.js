import PropTypes from 'prop-types'
import { connect } from 'dva'

import CancelOrderList from '../../shared/cancelOrder/index'

const namespace = 'cancelOrder'
const CancelOrder = ({ cancelOrder, loading }) => {
  const content = CancelOrderList({ namespace, orderListBean: cancelOrder, loading })
  return content
}

CancelOrder.propTypes = {
  cancelOrder: PropTypes.object,
  loading: PropTypes.object,
}
export default connect(({ cancelOrder, loading }) => ({ cancelOrder, loading }))(CancelOrder)
