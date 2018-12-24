import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Table, Tabs } from 'antd'
import { getBasicFn, getPagination, getTabName } from '../../utils'
import AdvancedSearchForm from '../../components/SearchFormFilter/'
import ContentLayout from '../../components/ContentLayout'
import { getColumns, getFormData, addOrder } from './data'

import RegistApprove from './modals/registApprove'
import FactoryAgentApprove from './modals/factoryAgentApprove'
import AuthApprove from './modals/authApprove'
import EntrustApprove from './modals/entrustApprove'
import OtherApprove from './modals/otherApprove'

const propTypes = {
  certificateAudit: PropTypes.object,
  loading: PropTypes.object,
  form: PropTypes.object,
  registTypeList: PropTypes.array,
}
function CertificateAudit({ certificateAudit, loading, registTypeList }) {
  const {
    backPageType,
    searchKeys,
    tableData,
    pageConfig,
    statistics,
    suppliersSelect,
    currentId,
    certificateDetail,
    oprateType,
    refuseTypeArr,
    registVisible,
    factoryAgentVisible,
    authVisible,
    entrustVisible,
    otherVisible,
  } = certificateAudit
  const { toAction, getLoading } = getBasicFn({
    namespace: 'certificateAudit',
    loading,
  })
  const pageChange = (current, pageSize) => {
    toAction(
      {
        ...searchKeys,
        current,
        pageSize,
      },
      'tableList',
    )
  }
  const getCertificationDetail = (pageType, certificateId) => {
    toAction({ certificateDetail: {} })
    // 根据type选择不同的effect
    const keyArr = ['regist', 'factoryAgent', 'auth', 'entrust', 'other']
    toAction(
      {
        certificateId,
      },
      `${keyArr[pageType - 1]}Detail`,
    ).then(() => {
      toAction({ currentId: certificateId })
    })
  }
  const showModal = (pageTyp, type) => {
    // 根据type选择展示不同modal
    const visibleArr = [
      'registVisible',
      'factoryAgentVisible',
      'authVisible',
      'entrustVisible',
      'otherVisible',
    ]
    const param = {}
    param[visibleArr[pageTyp - 1]] = true
    // 操作类型决定展示方法
    param.oprateType = type
    toAction(param)
  }
  const registParam = {
    detailData: certificateDetail,
    visible: registVisible,
    certificateId: currentId,
    hideHandler: () => {
      toAction({ registVisible: false })
    },
    okHandler: (values) => {
      toAction({ ...values }, 'registReview')
    },
    reviewAgain: () => {
      toAction({ oprateType: 'edit' })
    },
    toAction,
    refuseTypeArr,
    loading: getLoading('registDetail', 'registReview'),
    oprateType,
    registTypeList,
  }
  const factoryAgentParam = {
    detailData: certificateDetail,
    visible: factoryAgentVisible,
    certificateId: currentId,
    hideHandler: () => {
      toAction({ factoryAgentVisible: false })
    },
    okHandler: (values) => {
      toAction({ ...values }, 'factoryAgentReview')
    },
    reviewAgain: () => {
      toAction({ oprateType: 'edit' })
    },
    toAction,
    refuseTypeArr,
    loading: getLoading('factoryAgentDetail', 'factoryAgentReview'),
    oprateType,
  }
  const authParam = {
    detailData: certificateDetail,
    visible: authVisible,
    certificateId: currentId,
    hideHandler: () => {
      toAction({ authVisible: false })
    },
    okHandler: (values) => {
      toAction({ ...values }, 'authReview')
    },
    reviewAgain: () => {
      toAction({ oprateType: 'edit' })
    },
    toAction,
    refuseTypeArr,
    loading: getLoading('authDetail', 'authReview'),
    oprateType,
  }
  const entrustParam = {
    detailData: certificateDetail,
    visible: entrustVisible,
    certificateId: currentId,
    hideHandler: () => {
      toAction({ entrustVisible: false })
    },
    okHandler: (values) => {
      toAction({ ...values }, 'entrustReview')
    },
    reviewAgain: () => {
      toAction({ oprateType: 'edit' })
    },
    toAction,
    refuseTypeArr,
    loading: getLoading('entrustDetail', 'entrustReview'),
    oprateType,
  }

  const otherParam = {
    detailData: certificateDetail,
    visible: otherVisible,
    certificateId: currentId,
    hideHandler: () => {
      toAction({ otherVisible: false })
    },
    okHandler: (values) => {
      toAction({ ...values }, 'otherReview')
    },
    reviewAgain: () => {
      toAction({ oprateType: 'edit' })
    },
    toAction,
    refuseTypeArr,
    loading: getLoading('otherDetail', 'otherReview'),
    oprateType,
  }
  const tableProps = {
    loading: getLoading('tableList'),
    dataSource: addOrder(tableData || []),
    pagination: getPagination(pageChange, pageConfig),
    rowKey: 'certificateId',
    bordered: true,
    columns: getColumns({
      type: backPageType,
      check(certificateId) {
        toAction({ certificateDetail: {} })
        getCertificationDetail(backPageType, certificateId)
        showModal(backPageType, 'edit')
      },
      view(certificateId) {
        toAction({ certificateDetail: {} })
        getCertificationDetail(backPageType, certificateId)
        showModal(backPageType, 'view')
      },
      registTypeList,
    }),
  }
  const getTabPane = () => {
    // const tabArr = ['注册证', '厂家/总代三证', '授权书', '委托书', '其他档案']
    /** @description 只放开注册证 */
    const tabArr = ['注册证']
    const keyArr = ['register', 'factoryAgent', 'auth', 'entrust', 'other']
    const num = keyArr.map(_ => statistics[`${_}Total`] || 0)
    return tabArr.map((item, index) => (
      <Tabs.TabPane tab={getTabName(item, num[index])} key={String(index + 1)} />
    ))
  }

  const contentLayoutProps = {
    breadLeft: [{ name: 'Breadcrumb' }],
    content: (
      <span>
        <Tabs
          activeKey={backPageType}
          style={{ marginBottom: 6 }}
          onChange={(key) => {
            toAction('statistics')
            toAction({
              backPageType: key,
              tableData: [],
              suppliersSelect: [],
              searchKeys: {
                backPageType: key - 0,
                current: 1,
                pageSize: 10,
              },
            })
            toAction('tableList')
            toAction({ keywords: null }, 'suppliersSelect')
          }}
        >
          {getTabPane()}
        </Tabs>
        <AdvancedSearchForm
          key={backPageType}
          formData={getFormData({
            type: backPageType,
            suppliersSelect,
            onSearch(keywords) {
              toAction({ keywords }, 'suppliersSelect')
            },
            registTypeList,
          })}
          loading={getLoading('tableList')}
          onSearch={(value) => {
            const data = value
            data.certificateType = value.certificateType && value.certificateType - 0
            data.platformAuthStatus = value.platformAuthStatus && value.platformAuthStatus - 0
            data.supplierOrgId = value.supplierOrgId && value.supplierOrgId.key
            data.backPageType = backPageType - 0
            toAction(
              {
                current: 1,
                pageSize: 10,
                ...data,
              },
              'tableList',
            )
          }}
        />
        <Table {...tableProps} />
        <RegistApprove {...registParam} />
        <FactoryAgentApprove {...factoryAgentParam} />
        <AuthApprove {...authParam} />
        <EntrustApprove {...entrustParam} />
        <OtherApprove {...otherParam} />
      </span>
    ),
  }
  return <ContentLayout {...contentLayoutProps} />
}
CertificateAudit.propTypes = propTypes
export default connect(({ certificateAudit, loading, app: {
  constants: {
    registTypeList,
  },
} }) => ({ certificateAudit, loading, registTypeList }))(
  CertificateAudit,
)
