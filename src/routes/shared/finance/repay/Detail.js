import React from 'react'
import PropTypes from 'prop-types'
import { Table, Card } from 'antd'
import { Breadcrumb, PlainForm } from '../../../../components'
import { genHeadStatus } from '../../finance'
import CheckModal from '../../finance/checkModal'
import { formatNum } from '../../../../utils'
import windowNewOpen from '@shared/windowNewOpen'

const propTypes = {
  namespace: PropTypes.object,
  loading: PropTypes.bool,
  showModal: PropTypes.func,
  type: PropTypes.string,
}

const Detail = ({ namespace, loading, type }) => {
  const { current } = namespace
  const {
    failRemark,
    applyOrgName,
    formNo,
    formStatus,
    loanAmount,
    interestAmount,
    loanSummary = {},
    repayName,
    repayTime,
    returnUrl,
  } = current
  const { loanOrderList = [], totalAmount, totalQty } = loanSummary
  const plainData = {
    还款机构: applyOrgName,
    还款人: repayName,
    还款时间: repayTime,
    还款申请编号: formNo,
    还款本金: loanAmount,
    利息: interestAmount,
  }
  if (formStatus === 1 && returnUrl) {
    plainData['还款确认链接|fill'] = (
      <a onClick={() => windowNewOpen(returnUrl)}>{returnUrl && returnUrl.slice(0, 56)}...</a>
    )
  }
  let statusText = {
    0: ['   '],
    1: ['申请中', '您的还款申请已成功提交，请您耐心等待银行审核.....'],
    2: ['申请失败', failRemark],
    3: ['还款成功', '感谢您按时还贷，良好的还贷记录会为您的账户信用加分哦！'],
    4: ['还款失败', failRemark],
  }
  if (type === 'manage') {
    statusText = {
      0: ['   '],
      1: ['申请中', '银行正在审核该笔还款申请'],
      2: ['申请失败', failRemark],
      3: ['还款成功', '当前用户信誉保持良好。'],
      4: ['还款失败', failRemark],
    }
  }
  if (type === 'bank') {
    statusText = {
      0: ['   '],
      1: ['审核中', '顾客已成功提交还款申请，请及时审核'],
      2: ['申请失败', failRemark],
      3: ['还款成功', '该笔还款已审核通过！用户信誉维持良好。'],
      4: ['还款失败', '还款失败，请充分做好售后工作。'],
    }
  }
  const columns = [
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
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      className: 'aek-text-center',
      render: (text, { formId }) => <CheckModal formId={formId} />,
    },
  ]
  const tableParam = {
    bordered: true,
    loading,
    columns,
    dataSource: loanOrderList,
    pagination: false,
    // scroll: { x: 1100 },
    rowKey: 'formId',
  }
  return (
    <div className="aek-layout">
      <div className="bread">
        <Breadcrumb />
      </div>
      <div className="full-content" style={{ background: 'transparent' }}>
        <Card className="aek-card">{genHeadStatus(...statusText[formStatus || 0])}</Card>
        <Card className="aek-card" title="还款信息">
          <PlainForm data={plainData} size={3} />
        </Card>
        <Card className="aek-card" title="所还贷款">
          <Table {...tableParam} />
          {loanOrderList &&
            loanOrderList.length > 0 && (
              <div
                style={{
                  textAlign: 'right',
                  height: 40,
                  lineHeight: '60px',
                  fontSize: '15px',
                  fontWeight: 'bold',
                }}
              >
                <span className="aek-ml30">共选择入库单: {totalQty} 笔</span>
                <span className="aek-ml30">金额： {totalAmount} 元</span>
              </div>
            )}
        </Card>
      </div>
    </div>
  )
}

Detail.propTypes = propTypes
export default Detail
