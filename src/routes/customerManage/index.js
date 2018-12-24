import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Table, Button } from 'antd'
import moment from 'moment'
import Breadcrumb from '../../components/Breadcrumb'
import SearchFormFilter from '../../components/SearchFormFilter'
import { getColumns, fromData } from './data'
import { getBasicFn, getPagination } from '../../utils'
import AddModal from './addSql'
import DetailModal from './detailModal'

const namespace = 'customerManage'
const CustomerManage = ({
  customerManage,
  loading,
}) => {
  const { dispatchAction, getLoading } = getBasicFn({ namespace, loading })
  const {
    addModalVisible,
    searchData,
    fileList,
    detailModalVisible,
    selectedRowData,
    splDetail,
    pageConfig,
  } = customerManage
  const searchProps = {
    // 搜索参数
    initialValues: searchData,
    formData: fromData(searchData),
    onSearch(data) {
      if (data.shipTime && data.shipTime.length) {
        const arr = data.shipTime.map(item => moment(item).format('YYYY-MM-DD'))
        data.shipTime = arr.join(',')
      } else {
        data.shipTime = ''
      }
      dispatchAction({
        type: 'getTableList',
        payload: {
          current: 1,
          pageSize: 10,
          ...data,
          hplId: data.hplId ? data.hplId.key : null,
        },
      })
    },
  }
  const handleDetailClick = (apiId, row) => {
    dispatchAction({
      payload: {
        detailModalVisible: true,
        selectedRowData: row,
      },
    })
    dispatchAction({
      type: 'getSqlDetail',
      payload: {
        apiId,
      },
    })
  }
  const tableProps = {
    bordered: true,
    loading: getLoading('getTableList'),
    columns: getColumns(handleDetailClick),
    dataSource: fileList,
    rowKey: 'apiId',
    pagination: getPagination((current, pageSize) => {
      dispatchAction({
        type: 'getTableList',
        payload: {
          ...searchData,
          current,
          pageSize,
        },
      })
    }, pageConfig),
  }
  // 新增sql
  const addProps = {
    addModalVisible,
    handleCancel: () => {
      dispatchAction({
        payload: {
          addModalVisible: false,
        },
      })
    },
    handleOk: (data) => {
      dispatchAction({
        type: 'addSql',
        payload: {
          ...data,
          hplId: data.hplId.key,
        },
      })
    },
    spining: getLoading('addSql'),
  }
  // sql详情
  const detailProps = {
    detailModalVisible,
    spining: getLoading('getSqlDetail', 'addSql'),
    selectedRowData,
    handleCancel: () => {
      dispatchAction({
        payload: {
          detailModalVisible: false,
          selectedRowData: {},
        },
      })
    },
    handleOk: (data) => {
      dispatchAction({
        type: 'addSql',
        payload: {
          hplId: selectedRowData.hplId,
          ...data,
        },
      }).then(() => {
        dispatchAction({
          payload: {
            detailModalVisible: false,
            selectedRowData: {},
            splDetail: {},
          },
        })
      })
    },
    splDetail,
  }
  return (
    <div className="aek-layout">
      <div className="bread">
        <Breadcrumb style={{ float: 'left' }} />
        <div style={{ float: 'right' }}>
          <Button
            type="primary"
            onClick={() => {
              dispatchAction({
                payload: {
                  addModalVisible: true,
                },
              })
            }}
          >添加sql</Button>
        </div>
      </div>
      <div className="content">
        <SearchFormFilter {...searchProps} />
        <Table {...tableProps} />
      </div>
      <AddModal {...addProps} />
      <DetailModal {...detailProps} />
    </div>
  )
}
CustomerManage.propTypes = {
  customerManage: PropTypes.object,
  loading: PropTypes.object,
}
export default connect(({ customerManage, loading }) =>
  ({ customerManage, loading }))(CustomerManage)
