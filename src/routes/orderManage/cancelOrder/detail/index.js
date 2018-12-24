import PropTypes from 'prop-types'
import { connect } from 'dva'

import CancelDetailData from '../../../shared/cancelOrder/detail/index'

const namespace = 'cancelDetail'
const CancelDetail = ({ cancelDetail, loading }) => {
  const content = CancelDetailData({ namespace, cancelDetailBean: cancelDetail, loading })
  return content
}

CancelDetail.propTypes = {
  cancelDetail: PropTypes.object,
  loading: PropTypes.object,
}
export default connect(({ cancelDetail, loading }) => ({ cancelDetail, loading }))(CancelDetail)
