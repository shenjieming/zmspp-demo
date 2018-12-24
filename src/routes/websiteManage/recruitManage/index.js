import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { debounce } from 'lodash'
import { Table, Button, Icon, Input, Select, Modal } from 'antd'

import { getBasicFn, getPagination } from '../../../utils'
import { NO_LABEL_LAYOUT } from '../../../utils/constant'
import { Breadcrumb, SearchFormFilter } from '../../../components'
import RecruitModal from './recruitModal'

const namespace = 'recruitManage'
const propTypes = {
  recruitManage: PropTypes.object,
  loading: PropTypes.object,
}
const confirm = Modal.confirm
const textAreaDebounce = debounce((callback) => {
  callback()
}, 300)
const RecruitManage = ({ recruitManage, loading }) => {
  const { dispatchAction, getLoading } = getBasicFn({ namespace, loading })
  const { data, searchParam, pagination, modalVisible, currentDetail, degreeList } = recruitManage
  // dispachAction
  const pageChange = (current, pageSize) => {
    dispatchAction({ type: 'pageChange', payload: { ...searchParam, current, pageSize } })
  }
  const searchHandler = (values) => {
    dispatchAction({ type: 'searchData', payload: values })
  }
  // 编辑招聘
  const editRecruit = (hireId) => {
    dispatchAction({
      type: 'updateState',
      payload: {
        modalVisible: true,
      },
    })
    dispatchAction({ type: 'getDetail', payload: { hireId } })
  }
  // 停用启用
  const changeStatus = (hireId, hirePostStatus) => {
    confirm({
      content: `您确定要${hirePostStatus ? '启用' : '停用'}该招聘信息吗？`,
      onOk() {
        dispatchAction({
          type: 'changeStatus',
          payload: { hireId, hirePostStatus: !hirePostStatus },
        })
      },
    })
  }
  // 搜索参数
  const searchParams = {
    initialValues: searchParam,
    components: [
      {
        layout: NO_LABEL_LAYOUT,
        field: 'hirePostStatus',
        width: 220,
        options: {
          initialValue: 'false',
        },
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
            <Select.Option value={null} title="状态：全部">
              全部
            </Select.Option>
            <Select.Option value="false" title="状态：启用">
              启用
            </Select.Option>
            <Select.Option value="true" title="状态：停用">
              停用
            </Select.Option>
          </Select>
        ),
      },
      {
        layout: NO_LABEL_LAYOUT,
        field: 'keywords',
        width: 220,
        options: {
          initialValue: null,
        },
        component: <Input placeholder="关键字" />,
      },
    ],
    onSearch: searchHandler,
  }
  // 列表参数
  const tableParams = {
    columns: [
      {
        title: '序号',
        key: 'index',
        width: '50px',
        className: 'aek-text-center',
        render: (text, record, index) => index + 1,
      },
      {
        title: '岗位',
        dataIndex: 'hirePostName',
      },
      {
        title: '发布时间',
        dataIndex: 'releaseTime',
      },
      {
        title: '状态',
        dataIndex: 'hirePostStatus',
        className: 'aek-text-center',
        render: value => (value ? '停用' : '启用'),
      },
      {
        title: '操作',
        key: 'oprate',
        className: 'aek-text-center',
        render: (_, record) => (
          <span>
            <a
              onClick={() => {
                editRecruit(record.hireId)
              }}
            >
              编辑
            </a>
            <span className="aek-fill-15" />
            <a
              onClick={() => {
                changeStatus(record.hireId, record.hirePostStatus)
              }}
            >
              {record.hirePostStatus ? '启用' : '停用'}
            </a>
          </span>
        ),
      },
    ],
    bordered: true,
    dataSource: data,
    rowKey: 'hireId',
    rowClassName: (record) => {
      if (record.hirePostStatus) {
        return 'aek-text-disable'
      }
      return undefined
    },
    loading: getLoading('queryData', 'searchData', 'pageChange'),
    pagination: getPagination(pageChange, pagination),
  }
  // 弹窗参数
  const modalParams = {
    visible: modalVisible,
    detail: currentDetail,
    degreeList,
    loading: getLoading('getDetail', 'submitRecruit'),
    onHide: () => {
      dispatchAction({ type: 'updateState', payload: { modalVisible: false, currentDetail: {} } })
    },
    onSubmit: (values) => {
      dispatchAction({ type: 'submitRecruit', payload: { ...values } })
    },
    textAreaChange: (event) => {
      const value = event.target.value
      textAreaDebounce(() => {
        dispatchAction({
          type: 'updateState',
          payload: { currentDetail: { hirePostDescription: value } },
        })
      })
    },
  }
  return (
    <div className="aek-layout">
      <div className="bread">
        <Breadcrumb />
        <div className="aek-fr">
          <Button
            type="primary"
            onClick={() => {
              dispatchAction({
                type: 'updateState',
                payload: { modalVisible: true, currentDetail: {} },
              })
            }}
          >
            <Icon type="plus-circle-o" />
            新增
          </Button>
        </div>
      </div>
      <div className="content">
        <SearchFormFilter {...searchParams} />
        <Table {...tableParams} />
        <RecruitModal {...modalParams} />
      </div>
    </div>
  )
}

RecruitManage.propTypes = propTypes
export default connect(({ recruitManage, loading }) => ({ recruitManage, loading }))(RecruitManage)
