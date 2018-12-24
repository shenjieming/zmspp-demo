import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col, Button, Spin, Form } from 'antd'
import Breadcrumb from '../../../components/Breadcrumb'
import { getBasicFn } from '../../../utils/index'
import formData from './data'
import GetFormItem from '../../../components/GetFormItem'
import Styles from './index.less'

const namespace = 'accountApply'
function AccountBalance({
  accountApply,
  loading,
  form: {
    validateFields,
  },
}) {
  const { dispatchAction, getLoading } = getBasicFn({ namespace, loading })
  const { accountDetail } = accountApply
  // 提交申请
  const handleSubmit = () => {
    validateFields((errors, value) => {
      dispatchAction({
        type: 'submitApply',
        payload: {
          ...accountDetail,
          ...value,
        },
      })
    })
  }
  return (
    <div className="aek-layout">
      <div className="bread">
        <Breadcrumb />
      </div>
      <div className="content">
        <Spin spinning={getLoading('getBalanceDetail', 'submitApply')}>
          <div className="aek-content-title">提现申请</div>
          <Form>
            <GetFormItem
              formData={formData(accountDetail)}
            />
            <Row>
              <Col span={6} />
              <Col span={14}><Button loading={getLoading('submitApply')} onClick={handleSubmit} type="primary">提交申请</Button></Col>
            </Row>
          </Form>
          <div className={`${Styles.border} aek-mtb30`} />
          <div>
            <p className={`${Styles['detail-title']}`}>温馨提示：</p>
            <p>1、提现申请提交后，请耐心等待银行审核。</p>
            <p>2、提现金额只能提现至与签约信息时填写的华夏银行结算账户。</p>
            <p>3、7天内最多提现4次。</p>
          </div>
        </Spin>
      </div>
    </div>
  )
}

AccountBalance.propTypes = {
  accountApply: PropTypes.object,
  loading: PropTypes.object,
  form: PropTypes.object,
}

export default connect(({ accountApply, loading }) => ({
  accountApply,
  loading,
}))(Form.create()(AccountBalance))
