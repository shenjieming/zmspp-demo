import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Table, Button, Modal, message } from 'antd'
import { getBasicFn, formatNum } from '../../../../utils'
import { Breadcrumb } from '../../../../components'
import style from './index.less'

const { confirm } = Modal
const namespace = 'repayApplyDetail'
const propTypes = {
  repayApplyDetail: PropTypes.object,
  loading: PropTypes.object,
}

const DetailPage = ({ repayApplyDetail, loading }) => {
  const { dispatchAction, getLoading } = getBasicFn({ namespace, loading })
  const { currentApply, loanFormIds } = repayApplyDetail
  const { loanOrderList = [], repayAmount, repayAmountCapital, total } = currentApply
  const payMoney = (formIds) => {
    confirm({
      content: '确认申请吗？',
      onOk() {
        dispatchAction({
          type: 'confirmApply',
          payload: { formIds, repayAmount },
        }).then(() => {
          message.success('提交成功')
          window.history.back()
        })
      },
      // onCancel() {},
    })
  }
  const tableParam = {
    loading: getLoading('getApplyDetail'),
    columns: [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        width: 50,
        className: 'aek-text-center',
        render: (text, _, idx) => idx + 1,
      },
      {
        title: '贷款到期时间',
        dataIndex: 'loanExpireTime',
        key: 'loanExpireTime',
        className: 'aek-text-center',
      },
      {
        title: '支付申请单号',
        dataIndex: 'formNo',
        key: 'formNo',
        className: 'aek-text-center',
      },
      {
        title: '应还本金',
        dataIndex: 'grantAmount',
        key: 'grantAmount',
        className: 'aek-text-right',
        render: text => !!text && formatNum(text),
      },
    ],
    dataSource: loanOrderList,
    pagination: false,
    bordered: true,
    rowKey: 'formId',
  }
  return (
    <div className="aek-layout">
      <div className="bread">
        <Breadcrumb />
      </div>
      <div className="content" style={{ padding: 0 }}>
        <div className={style.topWrap}>
          <div className={style.title}>还款申请</div>
          <div className={style.totalHead}>
            还款金额合计<span className={style.color}>{repayAmount}</span>元
          </div>
          <div className={style.totalSub}>
            金额大写：<span className={style.color}>{repayAmountCapital}</span>
          </div>
          <Button className="aek-ml30" type="primary" onClick={() => payMoney(loanFormIds)}>
            提交申请
          </Button>
        </div>
        <div className={style.footerWrap}>
          <div className={style.dashTitle}>已选择的贷款</div>
          <div className={style.tableWrap}>
            <Table {...tableParam} />
            {loanOrderList &&
              loanOrderList.length > 0 && (
                <div className={style.tableFooter}>
                  <span className="aek-ml30">共选择入库单: {total} 笔</span>
                  <span className="aek-ml30">金额： {repayAmount} 元</span>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  )
}

DetailPage.propTypes = propTypes
export default connect(({ repayApplyDetail, loading }) => ({ repayApplyDetail, loading }))(
  DetailPage,
)
