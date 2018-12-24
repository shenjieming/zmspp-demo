import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'dva/router'
import { connect } from 'dva'
import { Table, Cascader, Avatar, Badge } from 'antd'
import Bread from '../../../components/Breadcrumb'
import { getBasicFn, getPagination } from '../../../utils/'

const columns = [
  {
    key: 'msgReadStatus',
    dataIndex: 'msgReadStatus',
    width: 24,
    render: (text) => {
      if (!text) {
        return <Badge status="error" style />
      }
      return ''
    },
  },
  {
    key: 'menuIconBig',
    dataIndex: 'menuIconBig',
    width: 60,
    className: 'aek-text-center',
    render: text => <Avatar src={text} shape="square" style={{ verticalAlign: 'middle' }} />,
  },
  {
    key: 'menuName',
    dataIndex: 'menuName',
    width: 100,
    className: 'aek-text-help',
  },
  {
    key: 'msgTemplateName',
    dataIndex: 'msgTemplateName',
    width: 200,
    className: 'aek-text-help',
  },
  {
    key: 'msgContent',
    dataIndex: 'msgContent',
    render: (text, row) => {
      if (row.msgUrl) {
        return (
          <Link to={row.msgUrl} className="aek-link">
            {text}
          </Link>
        )
      }
      return text
    },
  },
  {
    key: 'msgTime',
    width: 150,
    dataIndex: 'msgTime',
    className: 'aek-text-help',
  },
]

const propTypes = {
  routes: PropTypes.array,
  messageList: PropTypes.object,
  loading: PropTypes.object,
}

const namespace = 'messageList'

function MessageList({ routes, messageList, loading }) {
  const { dispatchAction, getLoading } = getBasicFn({ namespace, loading })

  const cascaderProps = {
    options: messageList.msgTypes,
    placeholder: '请选择消息类型',
    changeOnSelect: true,
    size: 'large',
    allowClear: true,
    value: [messageList.menuId, messageList.msgTemplateId],
    onChange: (payload) => {
      dispatchAction({ type: 'cascaderChange', payload })
    },
  }

  const tableProps = {
    columns,
    showHeader: false,
    dataSource: messageList.dataSource,
    rowKey: 'msgId',
    pagination: getPagination(
      (current, pageSize) => {
        dispatchAction({
          type: 'getMsgList',
          payload: {
            current,
            pageSize,
            menuId: messageList.menuId,
            msgTemplateId: messageList.msgTemplateId,
          },
        })
      },
      {
        current: messageList.current,
        pageSize: messageList.pageSize,
        total: messageList.total,
      },
    ),
    loading: getLoading('getMsgList'),
    onRowClick: (row) => {
      dispatchAction({ type: 'setReadOne', payload: row.msgId })
    },
  }

  return (
    <div className="aek-layout">
      <div className="bread">
        <Bread routes={routes} />
        <a
          style={{ float: 'right' }}
          onClick={() => {
            dispatchAction({ type: 'setAllRead' })
          }}
        >
          全部标记为已读
        </a>
      </div>
      <div className="content">
        <div>
          <Cascader {...cascaderProps} />
        </div>
        <Table {...tableProps} />
      </div>
    </div>
  )
}

MessageList.propTypes = propTypes

export default connect(({ messageList, loading }) => ({ messageList, loading }))(MessageList)
