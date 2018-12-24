import React from 'react'
import { Badge } from 'antd'
import { getOption, formatNum } from '../../../utils'

const noLabelLayout = {
  wrapperCol: { span: 23 },
}

const getUrl = (pageType) => {
  if (pageType === 'financeManage') {
    // 运营后台
    return '/finance/loan-mgmt/loan-apply-org/list-option'
  } else if (pageType === 'financeAudit') {
    // 银行
    return '/finance/loan-audit/loan-apply-org/list-option'
  }
  return 'null'
}

const tabInfoArr = [{
  name: '使用中',
  key: 'useIngTotal',
  tabKey: '3',
}, {
  name: '申请中',
  key: 'applyIngTotal',
  tabKey: '2',
}, {
  name: '申请失败',
  key: 'applyFailTotal',
  tabKey: '4',
}, {
  name: '已结清',
  key: 'settledTotal',
  tabKey: '5',
}]

const getFormData = ({ tabType, pageType }) => [{
  layout: noLabelLayout,
  field: 'applyTimeRangeType',
  width: 220,
  options: { initialValue: null },
  component: {
    name: 'Select',
    props: {
      defaultActiveFirstOption: false,
      filterOption: false,
      notFoundContent: false,
      optionLabelProp: 'title',
      children: getOption([{
        id: null,
        name: '全部',
      }, {
        id: 1,
        name: '最近一星期内',
      }, {
        id: 2,
        name: '最近一个月内',
      }, {
        id: 3,
        name: '最近三个月内',
      }, {
        id: 4,
        name: '三个月以上',
      }], { prefix: '贷款时间' }),
    },
  },
}, {
  layout: noLabelLayout,
  field: 'expireTimeRangeType',
  width: 220,
  options: { initialValue: null },
  exclude: tabType !== tabInfoArr[0].tabKey,
  component: {
    name: 'Select',
    props: {
      defaultActiveFirstOption: false,
      filterOption: false,
      notFoundContent: false,
      optionLabelProp: 'title',
      children: getOption([{
        id: null,
        name: '全部',
      }, {
        id: 5,
        name: '已逾期',
      }, {
        id: 1,
        name: '最近一星期内',
      }, {
        id: 2,
        name: '最近一个月内',
      }, {
        id: 6,
        name: '一个月以上',
      }], { prefix: '贷款到期时间' }),
    },
  },
}, {
  label: '',
  layout: { wrapperCol: { span: 23 } },
  field: 'applyOrg',
  width: 220,
  exclude: pageType === 'financeLoan',
  component: {
    name: 'LkcSelect',
    props: {
      url: getUrl(pageType),
      optionConfig: { prefix: '贷款机构' },
      placeholder: '贷款机构',
    },
  },
}, {
  label: '',
  layout: { wrapperCol: { span: 23 } },
  field: 'keywords',
  width: 220,
  component: {
    name: 'AutoComplete',
    props: {
      allowClear: true,
      placeholder: '支付申请编号',
    },
  },
}]

const getColumns = ({
  pageType,
  tabType,
  view,
}) => [{
  title: '序号',
  dataIndex: 'readFlag',
  className: 'aek-text-center',
  width: 60,
  render: (readFlag, __, idx) => {
    if (pageType === 'financeLoan'
      && tabType === tabInfoArr[2].tabKey
      && !readFlag) {
      return <Badge status="error" text={idx + 1} />
    }
    return idx + 1
  },
}, {
  title: '贷款时间',
  dataIndex: 'loanTime',
  className: 'aek-text-center',
}, {
  title: '支付申请编号',
  dataIndex: 'formNo',
}, {
  title: [tabInfoArr[1].tabKey, tabInfoArr[2].tabKey].includes(tabType) ? '申请金额' : '放款金额',
  className: [tabInfoArr[1].tabKey, tabInfoArr[2].tabKey].includes(tabType) ? 'aek-text-right' : undefined,
  dataIndex: 'loanAmount',
  render(loanAmount, { grantAmount }) {
    if ([tabInfoArr[1].tabKey, tabInfoArr[2].tabKey].includes(tabType)) {
      return formatNum(loanAmount)
    }
    return `${formatNum(grantAmount, { unit: '' })}（申请金额：${formatNum(loanAmount, { unit: '' })}）`
  },
}, {
  title: '贷款到期时间',
  dataIndex: 'expiredTime',
  render: (text, { overDueFlag }) => (
    !overDueFlag
      ? <span>{text}</span>
      : <span className="aek-red">{text}（已逾期）</span>
  ),
}, {
  title: '贷款机构',
  dataIndex: 'applyOrgName',
}, {
  title: '操作',
  dataIndex: 'formId',
  className: 'aek-text-center',
  width: 100,
  render: formId => <a onClick={() => view(formId)}>查看</a>,
}].filter(({ dataIndex }) => {
  if (dataIndex === 'expiredTime') {
    return [tabInfoArr[0].tabKey, tabInfoArr[3].tabKey].includes(tabType)
  } else if (dataIndex === 'applyOrgName' && pageType === 'financeLoan') {
    return false
  }
  return true
})

export default {
  getFormData,
  getColumns,
  tabInfoArr,
}
