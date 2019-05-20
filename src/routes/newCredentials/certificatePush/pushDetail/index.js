import React from 'react'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import { Link } from 'dva/router'
import { Table, Input, Button, Icon, Tabs, Spin, Modal } from 'antd'

import { getBasicFn, getPagination } from '../../../../utils'
import { NO_LABEL_LAYOUT } from '../../../../utils/constant'

import Breadcrumb from '../../../../components/Breadcrumb'
import SearchForm from '../../../../components/SearchFormFilter'

import ViewModal from '../../share/viewModal/ViewModal'

const TabPane = Tabs.TabPane
const propTypes = {
  pushDetail: PropTypes.object,
  loading: PropTypes.object,
}
const namespace = 'pushDetail'
const PushDetail = ({ pushDetail, loading }) => {
  const {
    currentIndex,
    customerInfo,
    numInfo,
    searchParams,
    data,
    pagination,
    viewModalVisble,
    certificateDetail,
  } = pushDetail
  const { dispatchAction, getLoading } = getBasicFn({ namespace, loading })
  const searchHandlder = (value) => {
    dispatchAction({ type: 'updateState', payload: { searchParams: value } })
    dispatchAction({ type: 'getCurrentTabData', payload: { ...value, current: 1 } })
  }
  const pageChange = (current, pageSize) => {
    dispatchAction({ type: 'getCurrentTabData', payload: { current, pageSize } })
  }
  const tabChange = (key) => {
    dispatchAction({
      type: 'updateState',
      payload: { searchParams: {}, pagination: { current: 1, pageSize: 10 }, currentIndex: key },
    })
    dispatchAction({ type: 'getCurrentTabData' })
  }
  // 查看详情
  const getDetail = (id) => {
    dispatchAction({ type: 'updateState', payload: { viewModalVisble: true } })
    dispatchAction({ type: 'getDetail', payload: { id } })
  }
  // 撤销
  const revertPush = (id) => {
    dispatchAction({
      type: 'revertPush',
      payload: { certificateIds: [id], customerOrgId: customerInfo.customerOrgId },
    })
  }
  // 重新推送
  const repush = (id) => {
    dispatchAction({
      type: 'repush',
      payload: {
        certificateId: id,
        customerOrgId: customerInfo.customerOrgId,
      },
    })
  }
  // 删除
  const deletePush = (id) => {
    dispatchAction({
      type: 'deletePush',
      payload: { certificateIds: [id], customerOrgId: customerInfo.customerOrgId },
    })
  }
  const operateRenderArr = [
    '',
    (_, row) => (
      <a
        onClick={() => {
          Modal.confirm({
            content: '确认要撤销吗?',
            onOk: () => {
              revertPush(row.certificateId)
            },
          })
        }}
      >
        撤销
      </a>
    ),
    (_, row) => (
      <span>
        <a
          onClick={() => {
            getDetail(row.id)
          }}
        >
          查看原因
        </a>
        <span className="ant-divider" />
        <a
          onClick={() => {
            Modal.confirm({
              content: '确认要重新推送吗?',
              onOk: () => {
                repush(row.certificateId)
              },
            })
          }}
        >
          重新推送
        </a>
        <span className="ant-divider" />
        <a
          onClick={() => {
            Modal.confirm({
              content: '确认要删除吗?',
              onOk: () => {
                deletePush(row.certificateId)
              },
            })
          }}
        >
          删除
        </a>
      </span>
    ),
    (_, row) =>
      !row.guidRandomFlag && (
        <a
          onClick={() => {
            Modal.confirm({
              content: '确认要重新推送吗?',
              onOk: () => {
                repush(row.certificateId)
              },
            })
          }}
        >
          重新推送
        </a>
      ),
    (_, row) => (
      <span>
        <a
          onClick={() => {
            Modal.confirm({
              content: '确认要重新推送吗?',
              onOk: () => {
                repush(row.certificateId)
              },
            })
          }}
        >
          重新推送
        </a>
        <span className="ant-divider" />
        <a
          onClick={() => {
            Modal.confirm({
              content: '确认要删除吗?',
              onOk: () => {
                deletePush(row.certificateId)
              },
            })
          }}
        >
          删除
        </a>
      </span>
    ),
  ]
  const searhProps = {
    initialValues: searchParams,
    key: currentIndex,
    formData: [
      {
        layout: NO_LABEL_LAYOUT,
        field: 'keywords',
        width: 300,
        options: {
          initialValue: '',
        },
        component: <Input placeholder="请输入注册证号、产品名称、厂家" />,
      },
    ],
    onSearch: searchHandlder,
  }
  const tableColumns = (id)=> {
    if (currentIndex === '2') {
      return [
          {
            title: '序号',
            key: 'index',
            className: 'aek-text-center',
            width: 50,
            render: (value, row, index) => index + 1,
          },
          {
            title: '注册证',
            dataIndex: 'certificateNo',
            render(text, row) {
              return (
                <span>
                  <div>{text}</div>
                  <div className="aek-gray">{row.productName}</div>
                </span>
              )
            },
          },
          {
            title: '厂家',
            dataIndex: 'produceFactoryName',
          },
          {
          title: '审批人',
          dataIndex: 'lastEditName',
          },
          {
            title: '推送时间',
            dataIndex: 'lastEditTime',
          },
          {
            title: '操作',
            key: 'oprate',
            render: operateRenderArr[currentIndex],
          },
      ]
    } else {
      return [
          {
            title: '序号',
            key: 'index',
            className: 'aek-text-center',
            width: 50,
            render: (value, row, index) => index + 1,
          },
          {
            title: '注册证',
            dataIndex: 'certificateNo',
            render(text, row) {
              return (
                <span>
                  <div>{text}</div>
                  <div className="aek-gray">{row.productName}</div>
                </span>
              )
            },
          },
          {
            title: '厂家',
            dataIndex: 'produceFactoryName',
          },
          {
            title: '推送时间',
            dataIndex: 'lastEditTime',
          },
          {
            title: '操作',
            key: 'oprate',
            render: operateRenderArr[currentIndex],
          }
      ]
    }
  }
  // const tableColumns = [
  //   {
  //     title: '序号',
  //     key: 'index',
  //     className: 'aek-text-center',
  //     width: 50,
  //     render: (value, row, index) => index + 1,
  //   },
  //   {
  //     title: '注册证',
  //     dataIndex: 'certificateNo',
  //     render(text, row) {
  //       return (
  //         <span>
  //           <div>{text}</div>
  //           <div className="aek-gray">{row.productName}</div>
  //         </span>
  //       )
  //     },
  //   },
  //   {
  //     title: '厂家',
  //     dataIndex: 'produceFactoryName',
  //   },
  //   {
  //     title: '推送时间',
  //     dataIndex: 'lastEditTime',
  //   },
  //   {
  //     title: '操作',
  //     key: 'oprate',
  //     render: operateRenderArr[currentIndex],
  //   },
  // ]
  const tableProps = {
    bordered: true,
    rowKey: 'id',
    columns: tableColumns(),
    pagination: getPagination(pageChange, pagination),
    dataSource: data,
  }
  const titleWithNum = (title, num) => {
    if (!num) {
      return title
    }
    return (
      <span>
        {title}
        <span className="aek-red aek-ml10 aek-font-small">({num})</span>
      </span>
    )
  }
  const viewModalProps = {
    visible: viewModalVisble,
    loading: getLoading('getDetail'),
    onCancel: () => {
      dispatchAction({ type: 'updateState', payload: { viewModalVisble: false } })
    },
    // 查看类型  view & approve
    viewType: 'view',
    // 注册证号
    certificateNo: certificateDetail.certificateNo,
    // 产品名称
    productName: certificateDetail.productName,
    // 拒绝原因
    refuseReason: certificateDetail.refuseReason,
    // 证件列表
    certificateList: certificateDetail.certificates,
  }
  return (
    <div className="aek-layout">
      <div className="bread">
        <Breadcrumb />
        <div style={{ float: 'right' }}>
          <Link to={`/newCredentials/certificatePush/push/${customerInfo.customerOrgId}`}>
            <Button type="primary">
              <Icon type="plus" />推送证件
            </Button>
          </Link>
        </div>
      </div>
      <div className="content">
        <div className="aek-content-title">
          <span className="aek-font-middle">{customerInfo.customerOrgName}</span>
          <Icon type="phone" style={{ margin: '0px 10px' }} />
          <span>{customerInfo.contactName}</span>-<span>{customerInfo.contactPhone}</span>
        </div>
        <Spin spinning={getLoading('getCurrentTabData', 'getCertificateNum')}>
          <Tabs defaultActiveKey={currentIndex} onChange={tabChange}>
            <TabPane tab={titleWithNum('待审核', numInfo.pendingReviewNumber)} key="1" />
            <TabPane tab={titleWithNum('已拒绝', numInfo.refusedNumber)} key="2" />
            <TabPane tab={titleWithNum('已通过', numInfo.acceptNumber)} key="3" />
            <TabPane tab={titleWithNum('已撤销', numInfo.cancelNumber)} key="4" />
          </Tabs>
          <SearchForm {...searhProps} />
          <Table {...tableProps} />
        </Spin>
        <ViewModal {...viewModalProps} />
      </div>
    </div>
  )
}

PushDetail.propTypes = propTypes
export default connect(({ pushDetail, loading }) => ({ pushDetail, loading }))(PushDetail)
