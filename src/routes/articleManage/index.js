import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'dva/router'
import { connect } from 'dva'
import { Input, Table, Select, Icon, TreeSelect, Button, Modal, InputNumber } from 'antd'
import { cloneDeep } from 'lodash'
import Breadcrumb from '../../components/Breadcrumb'
import SearchForm from '../../components/SearchFormFilter'
import { getBasicFn } from '../../utils/index'

const namespace = 'articleManage'
const Option = Select.Option
const confirm = Modal.confirm
function ArticleManage({
  articleManage,
  loading,
  routes,
}) {
  const { dispatchAction, getLoading } = getBasicFn({ namespace, loading })
  const { treeList, articleList, atricleSerachData, articlePagination } = articleManage

  // 二次确认框
  function showConfirm(title = '', content = '', callback) {
    confirm({
      title,
      content,
      onOk() {
        if (callback) {
          callback()
        }
      },
    })
  }
  const searchformPorps = {
    components: [
      {
        field: 'columnId',
        component: (
          <TreeSelect
            showSearch
            allowClear
            treeDefaultExpandAll
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder="请选择栏目"
            treeData={treeList}
            getPopupContainer={() => {
              const layout = document.querySelector('.aek-layout')
              if (layout) {
                return layout
              }
              return document.querySelector('body')
            }}
          />
        ),
      },
      {
        field: 'articleStatus',
        component: (
          <Select
            optionLabelProp="title"
            getPopupContainer={() => {
              const layout = document.querySelector('.aek-layout')
              if (layout) {
                return layout
              }
              return document.querySelector('body')
            }}
          >
            <Option value={null} title="状态：全部">
                全部
            </Option>
            <Option value={'0'} title="状态：启用">
              启用
            </Option>
            <Option value={'1'} title="状态：停用">
              停用
            </Option>
          </Select>
        ),
        options: {
          initialValue: null,
        },
      },
      {
        field: 'keywords',
        component: <Input placeholder="检索标题" />,
        options: {
          initialValue: null,
        },
      },
    ],
    initialValues: atricleSerachData,
    onSearch: (value) => {
      dispatchAction({
        type: 'getArticleList',
        payload: {
          ...atricleSerachData,
          ...value,
          current: 1,
          pageSize: 10,
        },
      })
    },
  }
  const columns = [
    {
      key: 'index',
      dataIndex: 'index',
      title: '序号',
      width: 50,
      className: 'aek-text-center',
      render: (value, record, index) => index + 1,
    },
    {
      key: 'articleTitle',
      dataIndex: 'articleTitle',
      title: '标题',
    },
    {
      key: 'columnName',
      dataIndex: 'columnName',
      title: '栏目',
    },
    {
      key: 'lastEditTime',
      dataIndex: 'lastEditTime',
      title: '更新时间',
      sorter: true,
    },
    {
      key: 'articleClickRate',
      dataIndex: 'articleClickRate',
      title: <Icon type="eye-o" />,
      sorter: true,
    },
    {
      key: 'voteUp',
      dataIndex: 'voteUp',
      title: <Icon type="like-o" />,
      sorter: true,
    },
    {
      key: 'voteDown',
      dataIndex: 'voteDown',
      title: <Icon type="dislike-o" />,
      sorter: true,
    },
    {
      key: 'articleStatus',
      dataIndex: 'articleStatus',
      title: '状态',
      className: 'aek-text-center',
      render(value) {
        if (value) {
          return '停用'
        }
        return '启用'
      },
    },
    {
      key: 'articleIndex',
      dataIndex: 'articleIndex',
      title: '排序',
      width: 150,
      render(value, record, index) {
        const handleBlur = (e) => {
          const inputVal = e.target.value
          const list = cloneDeep(articleList)
          list[index].articleIndex = inputVal
          dispatchAction({
            payload: {
              articleList: list,
            },
          })
        }
        return <InputNumber min={0} defaultValue={value} step={1} max={100} onBlur={handleBlur} />
      },
    },
    {
      key: 'relation',
      dataIndex: 'relation',
      title: '操作',
      width: 120,
      className: 'aek-text-center',
      render(value, record, index) {
        // 更改状态
        const statusClick = () => {
          const title = `确定要${record.articleStatus ? '启用' : '停用'}该条数据吗？`
          showConfirm(title, '', () => {
            dispatchAction({
              type: 'setArticleStatus',
              payload: {
                articleId: record.articleId,
                articleStatus: !record.articleStatus, // false 启用 true 停用
              },
            })
          })
        }
        // 删除文章
        const deleteClick = () => {
          const title = '确定要删除该条数据吗？'
          showConfirm(title, '', () => {
            dispatchAction({
              type: 'deleteArticle',
              payload: {
                articleId: record.articleId,
              },
            })
          })
        }
        return (<div>
          <Link to={`/websiteManage/articleManage/eidtDetail/${record.articleId}`}>编辑</Link>
          <span className="ant-divider" />
          <a onClick={statusClick}>{record.articleStatus ? '启用' : '停用'}</a>
          <span className="ant-divider" />
          <a onClick={deleteClick}>删除</a>
        </div>)
      },
    },
  ]
  // 翻页
  const handleChange = (pagination, filters, sorter) => {
    const { columnKey, order } = sorter
    const keys = {
      lastEditTime: 'last_edit_time',
      articleClickRate: 'article_click_rate',
      voteUp: 'vote_up',
      voteDown: 'vote_down',
    }
    const sort = {
      descend: 2,
      ascend: 1,
    }
    let reqSort = {}
    if (Object.keys(sorter).length) {
      reqSort = {
        sortBy: sort[order],
        sortField: keys[columnKey],
      }
    }
    dispatchAction({
      type: 'getArticleList',
      payload: {
        ...atricleSerachData,
        ...reqSort,
        ...pagination,
      },
    })
  }
  // 保存排序
  const saveSord = () => {
    if (articleList && articleList.length) {
      const reqArray = []
      articleList.map((item) => {
        const obj = {
          articleId: item.articleId,
          articleIndex: item.articleIndex,
        }
        reqArray.push(obj)
      })
      dispatchAction({
        type: 'saveArticleSort',
        payload: {
          sorts: reqArray,
        },
      })
    }
  }
  return (
    <div className="aek-layout">
      <div className="bread">
        <Breadcrumb style={{ float: 'left' }} routes={routes} />
        <div style={{ float: 'right' }}>
          <Button
            className="aek-mr10"
            onClick={saveSord}
          >保存排序</Button>
          <Link to={'/websiteManage/articleManage/detail'}>
            <Button>
              新增
            </Button>
          </Link>
        </div>
      </div>
      <div className="content">
        <SearchForm {...searchformPorps} />
        <Table
          columns={columns}
          dataSource={articleList}
          pagination={articlePagination}
          bordered
          onChange={handleChange}
          rowKey="articleId"
          loading={getLoading('getArticleList')}
          rowClassName={(record) => { if (record.articleStatus) { return 'aek-text-disable' } }}
        />
      </div>
    </div>
  )
}

ArticleManage.propTypes = {
  articleManage: PropTypes.object,
  loading: PropTypes.object,
  routes: PropTypes.array,
}

export default connect(({ articleManage, loading }) => ({
  articleManage,
  loading,
}))(ArticleManage)
