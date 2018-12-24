import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col } from 'antd'

import { getBasicFn } from '../../../utils/index'
import { Breadcrumb } from '../../../components'
import Styles from './index.less'
import First from './first'
import Second from './second'
import Third from './third'
import Fourth from './fourth'
import OrderDetail from './orderDetail'

const namespace = 'loanApply'
const propTypes = {
  loanApply: PropTypes.object,
  loading: PropTypes.object,
}
const LoanApply = ({ loanApply, loading }) => {
  const {
    stepIndex,
  } = loanApply
  const props = {
    loanApply,
    loading,
  }
  const list = [
    {
      title: '第一步：选择医院',
      content: <First {...props} />,
    }, {
      title: '第二步：选择入库单',
      content: <Second {...props} />,
    }, {
      title: '第三步：信息补全',
      content: <Third {...props} />,
    }, {
      title: '第四步：确认贷款金额',
      content: <Fourth {...props} />,
    },
  ]
  // 自定义面包屑
  const breadList = () => {
    const retCol = []
    list.map((item, index) => {
      retCol.push(<Col span={6} key={index} className={`${Styles['aek-breadcrumb-title-list']} ${index === (stepIndex - 1) ? Styles['aek-title-selected'] : ''}`}>
        {item.title}
      </Col>)
    })
    return retCol
  }
  return (
    <div className="aek-layout">
      <div className="bread">
        <Breadcrumb />
      </div>
      <div className="full-content">
        <div className={`${Styles['aek-title']}`}>
          <Row span={24} className={`${Styles['aek-breadcrumb-title']}`}>
            {breadList()}
          </Row>
        </div>
        <div className={`${Styles['aek-content']}`}>
          <div className={`${Styles['aek-content-title']}`}>
            {list[stepIndex - 1].title}
          </div>
          <div className={`${Styles['aek-content-main']}`}>
            {list[stepIndex - 1].content}
          </div>
        </div>
      </div>
      <OrderDetail {...props} />
    </div>
  )
}

LoanApply.propTypes = propTypes
export default connect(({ loanApply, loading, app: { orgInfo: accuracyDecimal } }) => ({ loanApply, loading, accuracyDecimal }))(LoanApply)
