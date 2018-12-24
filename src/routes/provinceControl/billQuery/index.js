import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import moment from 'moment'
import { Tabs, Table, Pagination, Spin, Button } from 'antd'
import { Breadcrumb, SearchFormFilter } from '../../../components'
import { getBasicFn, getPagination, getTabName } from '../../../utils'
import { formData, genColumns } from './props'
import CheckModal from './CheckModal'
import FailedModal from './FailedModal'
import DownloadModal from './DownLoadModal'

const { TabPane } = Tabs
const namespace = 'billQuery'
const propTypes = {
  loading: PropTypes.object,
  billQuery: PropTypes.object,
}

const getItemList = (list) => {
  const itemList = []
  for (const item of list) {
    const { items = [] } = item
    if (items.length > 0) {
      for (const children of items) {
        if (items[0] === children) {
          if (item.orderStatus === 1) {
            itemList.push({
              ...item,
              key: children.orderDetailId,
              ...children,
              rowSpan: items.length,
            })
          } else {
            itemList.push({
              ...item,
              key: children.orderDetailId,
              ...children,
              rowSpan: items.length + 1,
            })
          }
        } else {
          itemList.push({ ...item, key: children.orderDetailId, ...children, rowSpan: 0 })
        }
      }
      if (item.orderStatus !== 1) {
        itemList.push({ ...item, key: item.formNo, colSpan: 4, rowSpan: 0 })
      }
    } else {
      itemList.push({ ...item, key: item.formNo, colSpan: 4 })
    }
  }
  return itemList
}
const IndexPage = ({ billQuery, loading }) => {
  const { dispatchAction, getLoading } = getBasicFn({ namespace, loading })
  const {
    billList,
    pagination,
    searchSaveParam,
    allQty,
    failQty,
    waitForSendQty,
    currentTabIndex,
    currentDetail,
    checkModalVisible,
    checkModalType,
    failedList,
    failModalVisible,

    downloadVisible,
  } = billQuery
  const searchParams = {
    key: currentTabIndex,
    initialValues: searchSaveParam,
    onSearch(data) {
      dispatchAction({
        payload: {
          searchSaveParam: {
            ...searchSaveParam,
            ...data,
          },
        },
      })
      dispatchAction({
        type: 'getBillList',
        payload: { ...pagination, current: 1 },
      })
    },
    formData: formData.filter((item) => {
      if (currentTabIndex !== -1 && item.field === 'purSyncStatus') {
        return false
      }
      return true
    }),
  }
  const modalShow = (formId) => {
    dispatchAction({
      type: 'queryDetail',
      payload: { formId },
    })
  }
  const purchaseModal = (orderId) => {
    dispatchAction({
      type: 'queryProvinceDetail',
      payload: { orderId },
    })
  }
  const failedModal = (formId) => {
    dispatchAction({
      payload: { formId },
    })
    dispatchAction({
      type: 'queryfailList',
      payload: { formId },
    })
  }
  const tableParam = {
    key: currentTabIndex,
    bordered: true,
    columns: genColumns({ modalShow, purchaseModal, failedModal }),
    dataSource: getItemList(billList),
    pagination: false,
    rowKey: 'key',
    onChange: (pag, _, sorter) => {
      dispatchAction({
        payload: {
          searchSaveParam: {
            ...searchSaveParam,
            sort: sorter.order === 'descend' ? 'DESC' : 'ASC',
          },
        },
      })
      dispatchAction({
        type: 'getBillList',
        payload: { sort: sorter.order === 'descend' ? 'DESC' : 'ASC' },
      })
    },
  }
  const tabChange = (param) => {
    dispatchAction({ payload: { currentTabIndex: Number(param), searchSaveParam: {} } })
    dispatchAction({
      type: 'getBillList',
      payload: { ...pagination, current: 1 },
    })
  }
  const checkModalParam = {
    checkModalType,
    loading: getLoading('queryDetail'),
    visible: checkModalVisible,
    onCancel() {
      dispatchAction({
        payload: { checkModalVisible: false, currentDetail: {} },
      })
    },
    currentDetail,
  }
  const failedModalParam = {
    loading: getLoading('queryfailList', 'repeatSend'),
    visible: failModalVisible,
    onCancel() {
      dispatchAction({
        payload: { failModalVisible: false },
      })
    },
    repeatSend(formId) {
      // 重发
      dispatchAction({
        type: 'repeatSend',
        payload: { formId },
      })
    },
    failedList,
  }
  const paginationProps = getPagination((current, pageSize) => {
    dispatchAction({
      type: 'getBillList',
      payload: { current, pageSize },
    })
  }, pagination)

  const downloadProps = {
    visible: downloadVisible,
    onCancel() {
      dispatchAction({
        payload: {
          downloadVisible: false,
        },
      })
    },
    handleOk(data) {
      dispatchAction({
        type: 'getDownload',
        payload: {
          periodNo: moment(data.periodNo).format('YYYYMM'),
        },
      })
    },
    loading: getLoading('getDownload'),
  }

  return (
    <div className="aek-layout">
      <div className="bread">
        <div style={{ display: 'inline-block', float: 'left' }}>
          <Breadcrumb />
        </div>
        <div style={{ display: 'inline-block', float: 'right' }}>
          <Button onClick={() => {
            dispatchAction({
              payload: {
                downloadVisible: true,
              },
            })
          }}
          >导出</Button>
        </div>
      </div>
      <div className="content">
        <Tabs activeKey={String(currentTabIndex)} onChange={tabChange}>
          <TabPane style={{ width: 100 }} tab={getTabName('全部', allQty)} key="-1" />
          <TabPane
            style={{ width: 100 }}
            tab={getTabName('等待供应商发货', waitForSendQty)}
            key="1"
          />
          <TabPane tab={getTabName('接口上传失败', failQty)} key="2" />
        </Tabs>
        <SearchFormFilter {...searchParams} />
        <Spin spinning={getLoading('getBillList')}>
          <Table {...tableParam} />
          {billList.length > 0 && (
            <div className="aek-mt20 aek-fr">
              <Pagination {...paginationProps} />,
            </div>
          )}
        </Spin>
      </div>
      <CheckModal {...checkModalParam} />
      <FailedModal {...failedModalParam} />
      {/* 导出 */}
      <DownloadModal {...downloadProps} />
    </div>
  )
}

IndexPage.propTypes = propTypes
export default connect(({ billQuery, loading }) => ({ billQuery, loading }))(IndexPage)
