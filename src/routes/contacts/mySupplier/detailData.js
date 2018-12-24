import React from 'react'
import { Rate } from 'antd'
import { getTreeItem } from '../../../utils'

const render = (value, record, index) => {
  if (index !== 5) {
    return value
  }
  return <span className="aek-primary-color">{value}</span>
}
// 星级评价
const columns = [
  {
    title: '总计',
    dataIndex: 'totalEvaluation',
    key: 'totalEvaluation',
    className: 'aek-text-center',
    render,
  },
  {
    title: '最近一年',
    dataIndex: 'oneYear',
    key: 'oneYear',
    className: 'aek-text-center',
    render,
  },
  {
    title: '最近半年',
    dataIndex: 'halfYear',
    key: 'halfYear',
    className: 'aek-text-center',
    render,
  },
  {
    title: '最近三个月',
    dataIndex: 'threeMonth',
    key: 'threeMonth',
    className: 'aek-text-center',
    render,
  },
  {
    title: '最近一个月',
    dataIndex: 'oneMonth',
    key: 'oneMonth',
    className: 'aek-text-center',
    render,
  },
  {
    title: '星级',
    dataIndex: 'starLevel',
    key: 'starLevel',
    className: 'aek-text-center',
    render: (value, record, index) => {
      if (index !== 5) {
        return <Rate disabled defaultValue={5 - index} />
      }
      return ''
    },
  },
]

const detailColumns = [
  {
    title: '星级',
    dataIndex: 'starLevel',
    key: 'starLevel',
    width: 180,
    className: 'aek-text-center',
    render: value => <Rate disabled value={value} />,
  },
  {
    title: '评价内容',
    dataIndex: 'appraiseContent',
    key: 'appraiseContent',
    render: (value, record) => (
      <span>
        <p>{value || '无'}</p>
        <p className="aek-text-disable">{record.addTime}</p>
      </span>
    ),
  },
  {
    title: '评价人',
    dataIndex: 'orgName',
    width: 220,
    key: 'orgName',
  },
  {
    title: '交易信息',
    dataIndex: 'formNo',
    width: 220,
    key: 'formNo',
    render: value => <span>订单号：{value}</span>,
  },
]

const retAppraiseList = (list = []) => {
  const obj = {
    totalEvaluation: 0,
    oneYear: 0,
    halfYear: 0,
    threeMonth: 0,
    oneMonth: 0,
  }
  const variable = { ...obj }
  const retArr = []
  for (let i = 5; i > 0; i--) {
    const index = 5 - i
    const findItem = getTreeItem(list, 'starLevel', i)
    if (findItem) {
      for (const [key, value] of Object.entries(variable)) {
        variable[key] = value + findItem[key]
      }
      retArr.push(findItem)
    } else {
      retArr.push({
        ...obj,
        starLevel: 6 + index,
      })
    }
  }
  variable.starLevel = 'all'
  retArr.push(variable)
  return retArr
}
export default {
  columns,
  detailColumns,
  retAppraiseList,
}
