import React from 'react'
import moment from 'moment'
import { Link } from 'dva/router'
import { getOption } from '../../utils'
import { FORM_ITEM_LAYOUT } from '../../utils/constant'

const getDigital = (value = 0) => {
  if (Number(value) > 1000) {
    return `${(Number(value) / 1000).toFixed(1)}k`
  }
  return value
}

const getStatus = (tabType = 'all') => {
  const obj = {
    3: '审核未通过',
    4: '发布中',
    5: '手动结束',
    6: '逾期结束',
    7: '达成合作',
    8: '屏蔽',
  }
  if (tabType === 'pending') {
    return [{
      id: '2',
      name: '待审核',
    }]
  }
  const arr = []
  arr.push({
    id: null,
    name: '全部',
  })
  for (const [key, value] of Object.entries(obj)) {
    arr.push({
      id: key,
      name: value,
    })
  }
  return arr
}

const advancedForm = ({ tabType }) => {
  const status = getStatus(tabType)
  return [
    {
      label: '机构名称',
      layout: FORM_ITEM_LAYOUT,
      field: 'chanceReleaseOrgNameLike',
      options: {
        initialValue: undefined,
      },
      component: {
        name: 'Input',
        props: {
          placeholder: '请输入机构名称',
        },
      },
    },
    {
      label: '关键字',
      field: 'keywords',
      layout: FORM_ITEM_LAYOUT,
      component: {
        name: 'Input',
        props: {
          placeholder: '请输入需求关键字',
        },
      },
    },
    {
      label: '状态',
      layout: FORM_ITEM_LAYOUT,
      field: 'chanceStatus',
      options: {
        initialValue: null,
      },
      component: {
        name: 'Select',
        props: {
          optionLabelProp: 'title',
          children: getOption(status),
          disabled: tabType !== 'all',
        },
      },
    },
    {
      label: '发布时间',
      layout: FORM_ITEM_LAYOUT,
      field: 'releaseTimeRangeStart',
      options: {
        initialValue: undefined,
      },
      component: {
        name: 'RangePicker',
      },
    },
  ]
}

const tableColumns = ({ tabType }) => [{
  title: '序号',
  key: 'index',
  className: 'aek-text-center',
  width: 50,
  render: (value, row, index) => index + 1,
},
{
  title: '机构名称',
  dataIndex: 'chanceReleaseOrgName',
}, {
  title: '用户',
  dataIndex: 'addName',
}, {
  title: '回复数',
  dataIndex: 'chanceReplyTotalNum',
  render: text => getDigital(text),
}, {
  title: '查看数',
  dataIndex: 'chanceLookTotalNum',
  render: text => getDigital(text),
}, {
  title: '意向机构',
  dataIndex: 'chanceIntentionOrgName',
}, {
  title: '最后回复时间',
  dataIndex: 'chanceLastReplayDate',
  render: text => text && moment(text).format('YYYY-MM-DD'),
}, {
  title: '发布时间',
  dataIndex: 'addTime',
  render: text => text && moment(text).format('YYYY-MM-DD'),
}, {
  title: '状态',
  dataIndex: 'chanceStatus',
  render(text) {
    const obj = {
      1: '草稿',
      2: '待审核',
      3: '审核未通过',
      4: '发布中',
      5: '手动结束',
      6: '逾期结束',
      7: '达成合作',
      8: '已屏蔽',
    }
    return (text && obj[text]) ? obj[text] : ''
  },
}, {
  title: '置顶状态',
  dataIndex: 'chanceTopFlag',
  className: 'aek-text-center',
  render(text) {
    return text ? '是' : '否'
  },
}, {
  title: '备注',
  dataIndex: 'chanceRemark',
}, {
  title: '操作',
  dataIndex: 'operation',
  className: 'aek-text-center',
  render: (_, { chanceId }) => {
    let url = `/businessExamine/${chanceId}`
    if (tabType === 'all') {
      url = `/businessExamine/${chanceId}?isPublisher=true`
    }
    return <Link to={url}>{ tabType === 'all' ? '查看' : '审核' }</Link>
  },
}]

const detailForm = chanceRemark => [{
  label: '备注',
  layout: {
    labelCol: { span: 3 },
    wrapperCol: { span: 16 },
  },
  field: 'chanceRemark',
  options: {
    initialValue: chanceRemark,
    rules: [{
      required: true,
      message: '必填项不能为空',
      whitespace: true,
    }],
  },
  component: {
    name: 'TextArea',
  },
}]

export default {
  advancedForm,
  tableColumns,
  getDigital,
  detailForm,
}
