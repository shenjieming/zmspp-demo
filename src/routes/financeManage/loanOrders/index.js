import React from 'react'
import PropTypes from 'prop-types'
import { Table, Tabs, Alert } from 'antd'
import { getPagination, getTabName, aekConnect } from '../../../utils'
import SearchFormFilter from '../../../components/SearchFormFilter/'
import ContentLayout from '../../../components/ContentLayout'
import { getColumns, getFormData, tabInfoArr } from './data'

const propTypes = {
  toAction: PropTypes.func,
  getLoading: PropTypes.func,
  loanOrders: PropTypes.object,
}
function LoanOrders({ toAction, getLoading, loanOrders: {
  pageType, tabType, searchKeys, statistics,
  tableData, pageConfig, form,
} }) {
  const alertProps = {
    message: `使用中的贷款情况: ${statistics.useIngTotalCount}笔，共贷款金额${statistics.useIngTotalAmount}元`,
    type: 'info',
    banner: true,
    showIcon: false,
    style: { marginTop: '-4px', marginBottom: 10 },
  }
  const tableProps = {
    loading: getLoading('tableList'),
    dataSource: tableData || [],
    rowKey: 'formId',
    bordered: true,
    columns: getColumns({
      tabType,
      pageType,
      view(formId) { toAction('view', { formId }) },
    }),
    pagination: getPagination(pageConfig, (current, pageSize) => {
      toAction({
        ...searchKeys,
        current,
        pageSize,
      }, 'tableList')
    }),
  }
  const getTabPane = () => {
    const num = tabInfoArr.map(({ key }) => statistics[`${key}Count`] || 0)
    return tabInfoArr.map(({ name, tabKey }, index) => (
      <Tabs.TabPane
        tab={getTabName(name, num[index])}
        key={tabKey}
      />
    ))
  }
  const tabsProps = {
    activeKey: tabType,
    style: { margin: '0 -15px 6px' },
    onChange(key) {
      toAction({
        tabType: key,
        tableData: [],
        searchKeys: {
          formStatus: key - 0,
          current: 1,
          pageSize: 10,
        },
      })
      toAction('tableList')
      if (form) { form.resetFields() }
    },
  }
  const searchFormFilterProps = {
    loading: getLoading('tableList'),
    formData: getFormData({ tabType, pageType }),
    initialValues: searchKeys,
    getPropsForm(data) {
      toAction({ form: data })
    },
    onSearch(value) {
      toAction({
        current: 1,
        pageSize: 10,
        formStatus: tabType - 0,
        ...value,
      }, 'tableList')
    },
  }
  const contentLayoutProps = {
    breadLeft: [{ name: 'Breadcrumb' }],
    customContent: [{
      contentType: 'card',
      key: 'mainContent',
      style: { minHeight: 'calc(100% - 50px)' },
      children: (
        <span>
          <Tabs {...tabsProps}>{getTabPane()}</Tabs>
          <SearchFormFilter {...searchFormFilterProps} />
          {
            tabType === tabInfoArr[0].tabKey
              && statistics.useIngTotalCount
              && statistics.useIngTotalAmount
              ? <Alert {...alertProps} />
              : null
          }
          <Table {...tableProps} />
        </span>
      ),
    }],
  }
  return <ContentLayout {...contentLayoutProps} />
}
LoanOrders.propTypes = propTypes
export default aekConnect()(LoanOrders)
