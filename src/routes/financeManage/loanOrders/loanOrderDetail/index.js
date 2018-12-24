import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import windowNewOpen from '@shared/windowNewOpen'
import { aekConnect, dispatchUrl } from '../../../../utils'
import { ContentLayout, PlainForm, LkcLightBox } from '../../../../components'
import { genHeadStatus } from '../../../shared/finance'
import CheckModal from '../../../shared/finance/checkModal'
import { popoverPhotoList } from '../../../shared/fianceLoan'

import {
  formStatusInfo,
  refundColumns,
  stockListColumns,
  invoiceColumns,
  tabInfoArr,
  operationRecordListColumns,
} from './data'
import ModalStock from './ModalStock'

const propTypes = {
  toAction: PropTypes.func,
  getLoading: PropTypes.func,
  loanOrderDetail: PropTypes.object,
}
function LoanOrderDetail({
  toAction,
  getLoading,
  loanOrderDetail: {
    headInfoItem,
    baseItem,
    repayItem,
    stockSummary,
    invoiceList,
    loanOrderItem,
    stockModalVisible,
    modalList,
    pageConfig,
    operationRecordList,
    pageType,
    formId,
    lightBoxVisible,
    lightBoxUrl,
  },
}) {
  const loading = getLoading('getPageInfo')
  const baseInfoData = {
    贷款机构: baseItem.applyOrgName,
    法人: baseItem.legalName,
    联系电话: baseItem.legalPhone,
  }
  const loanTopData = {
    支付申请编号: loanOrderItem.formNo,
    交易流水号: loanOrderItem.transNo,
    合同编号: loanOrderItem.loanAgreementCode,
    [[tabInfoArr[0].tabKey, tabInfoArr[3].tabKey].includes(String(headInfoItem.formStatus))
      ? '放款金额'
      : '申请金额']: [tabInfoArr[0].tabKey, tabInfoArr[3].tabKey].includes(
      String(headInfoItem.formStatus),
    )
      ? `${loanOrderItem.grantAmount}元（申请金额：${loanOrderItem.loanAmount}元）`
      : `${loanOrderItem.loanAmount}元`,
    自有支付金额: `${loanOrderItem.ownAmount}元`,
    贷款到期时间: loanOrderItem.expiredTime,
    卖方客户编号: loanOrderItem.sellerCustomerNo,
    买方客户编号: loanOrderItem.buyerCustomerNo,
    行业商户代码: loanOrderItem.industryBusinessCode,
    贷款账号: loanOrderItem.loanAccountCode,
  }
  const returnUrl = loanOrderItem.returnUrl
  const loanBottomData = {
    供货资质: popoverPhotoList({ imageList: loanOrderItem.qualificationImges }),
    '上游开具发票|img': loanOrderItem.invoiceImges,
    申请说明: loanOrderItem.loanRemark,
    [`贷款确认链接|${String(headInfoItem.formStatus) === tabInfoArr[1].tabKey}`]: (
      returnUrl && <a onClick={() => windowNewOpen(returnUrl)}>{returnUrl.length > 56 ? `${returnUrl.slice(0, 56)}...` : returnUrl}</a>
    ),
  }
  const refundTableProps = {
    loading,
    dataSource: repayItem || [],
    rowKey: 'formId',
    bordered: true,
    columns: refundColumns((id) => {
      const itemStr = pageType.slice(7)
      dispatchUrl({
        pathname: `/finance${itemStr}/repay${itemStr}/repay${itemStr}Detail/${id}`,
      })
    }),
    pagination: false,
  }
  const stockSummaryTableProps = {
    loading,
    dataSource: stockSummary.stockList || [],
    rowKey: 'formId',
    bordered: true,
    columns: stockListColumns((id) => {
      toAction({
        stockModalVisible: true,
        modalFormId: id,
        pageConfig: {},
        modalList: [],
      })
      toAction('getModalList', {
        current: 1,
        pageSize: 10,
      })
    }),
    pagination: false,
    key: 'stockSummaryTable',
  }
  const invoiceTableProps = {
    loading,
    dataSource: invoiceList || [],
    rowKey: 'invoiceNo',
    bordered: true,
    columns: invoiceColumns((url) => {
      toAction({
        lightBoxUrl: url,
        lightBoxVisible: true,
      })
    }),
    pagination: false,
  }
  const operationRecordListProps = {
    key: 'table',
    loading,
    dataSource: operationRecordList || [],
    rowKey: 'eventId',
    bordered: true,
    columns: operationRecordListColumns,
    pagination: false,
  }
  const modalStockProps = {
    key: 'modal',
    stockModalVisible,
    modalList,
    pageConfig,
    loading: getLoading('getModalList'),
    onCancel() {
      toAction({ stockModalVisible: false })
    },
    pageChange(current, pageSize) {
      toAction(
        {
          current,
          pageSize,
        },
        'getModalList',
      )
    },
  }
  const LkcLightBoxProps = {
    key: 'LkcLightBox',
    isOpen: lightBoxVisible,
    url: lightBoxUrl,
    photoIndex: 0,
    onCancel() {
      toAction({
        lightBoxVisible: false,
        lightBoxUrl: '',
      })
    },
  }
  const getTopInfo = ({ formStatus, failRemark, expiredTime }) => {
    const formStatusStr = String(formStatus)
    const baseInfo = formStatusInfo[pageType][formStatusStr] || []
    if (formStatusStr === tabInfoArr[0].tabKey) {
      return baseInfo.concat(`贷款到期时间：${expiredTime}`)
    } else if (formStatusStr === tabInfoArr[2].tabKey) {
      return baseInfo.concat(failRemark)
    }
    return baseInfo
  }
  const contentLayoutProps = {
    breadLeft: [{ name: 'Breadcrumb' }],
    customContent: [
      {
        contentType: 'card',
        key: 'topCard',
        loading,
        children: genHeadStatus(...getTopInfo(headInfoItem)),
      },
      {
        contentType: 'card',
        key: 'baseItem',
        title: '基础信息',
        loading,
        children: <PlainForm data={baseInfoData} size={3} />,
      },
      {
        contentType: 'card',
        key: 'loanItem',
        title: '贷款信息',
        loading,
        children: [
          <PlainForm key="loanTopData" data={loanTopData} size={3} />,
          <PlainForm key="loanBottomData" data={loanBottomData} size={1} />,
        ],
      },
      {
        exclude: String(headInfoItem.formStatus) !== tabInfoArr[3].tabKey,
        contentType: 'card',
        key: 'refundItem',
        title: '还款信息',
        children: <Table {...refundTableProps} />,
      },
      {
        contentType: 'card',
        key: 'stockSummary',
        title: '入库单与发票信息',
        extra: <CheckModal formId={formId} />,
        children: [
          <Table {...stockSummaryTableProps} />,
          <div
            style={{ textAlign: 'right', height: 40, lineHeight: '60px', fontSize: '15px' }}
            key="all"
          >
            <span className="aek-ml30">共选择入库单：{stockSummary.totalQty}笔</span>
            <span className="aek-ml30">共贷款：{stockSummary.totalAmount}元</span>
          </div>,
          <ModalStock {...modalStockProps} />,
        ],
      },
      {
        contentType: 'card',
        key: 'invoiceItem',
        title: '发票信息',
        children: <Table {...invoiceTableProps} />,
      },
      {
        contentType: 'card',
        key: 'operationRecordList',
        title: '操作记录',
        children: [<Table {...operationRecordListProps} />, <LkcLightBox {...LkcLightBoxProps} />],
      },
    ],
  }
  return <ContentLayout {...contentLayoutProps} />
}
LoanOrderDetail.propTypes = propTypes
export default aekConnect()(LoanOrderDetail)
