import React from 'react'
import { Spin, Pagination } from 'antd'
import propTypes from 'prop-types'
import { getPagination } from '../../../../utils/index'
import styles from './index.less'

const PropTypes = {
  data: propTypes.array,
  children: propTypes.node,
  loading: propTypes.bool,
  pageChange: propTypes.func,
  pagination: propTypes.object,
}
const Container = ({ data = [], children, loading, pageChange, pagination }) => (
  <div
    className={styles.container}
    style={data.length === 0 ? { height: '100%', backgroundColor: 'white' } : {}}
  >
    <Spin spinning={loading}>
      {!loading && data.length === 0 && <div className={styles.empty} />}
      {children}
    </Spin>
    <span className="aek-fr">
      {data.length > 0 && <Pagination {...getPagination(pageChange, pagination)} />}
    </span>
  </div>
)
Container.propTypes = PropTypes
export default Container
