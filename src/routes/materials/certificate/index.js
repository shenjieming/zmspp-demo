import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Icon, Modal, Button, Table, Menu, Dropdown } from 'antd'
import { debounce } from 'lodash'
import Breadcrumb from '../../../components/Breadcrumb'
import SearchFormFillter from '../../../components/SearchFormFilter'
import { formData, advancedForm, genColumns } from './data'
import { getBasicFn, getPagination } from '../../../utils/index'
import AddModal from './addCertificate'
import HistoryModal from './historyModal'
import CompareModal from './compareModal'
import ViewModal from './viewModal'

const { confirm } = Modal
const namespace = 'certificate'
function IndexPage({ certificate, loading, registTypeList }) {
  const { dispatchAction, getLoading } = getBasicFn({ namespace, loading })
  const {
    searchSaveParam,
    viewCurrentData,
    viewModalVisible,
    versionDoubleList,
    currentItem,
    historyPagination,
    historyList,
    checkedHistoryArr,
    newCertList,
    certSortShow,
    longStatus,
    timeIsOffReQuire,
    certIsOff,
    delayIsOff,
    proxyIsOff,
    produceList,
    allProList,
    suppProList,
    fileEndDate,
    historyModalVisible,
    addModalVisible,
    addModalType,
    pagination,
    checkedArr,
    certificateList,
    compareModalVisible,
  } = certificate
  const columnsParam = {
    handleAction(e, { certificateId }) {
      const key = Number(e.key)
      if (key === 0 || key === 1) {
        confirm({
          content: key === 0 ? '确定要启用吗？' : '确定要停用吗？',
          onOk() {
            dispatchAction({
              type: 'onOffCert',
              payload: { certificateStatus: !!key, certificateId },
            })
          },
        })
      } else if (key === 3) {
        dispatchAction({
          payload: { certificateId },
        })
        dispatchAction({
          type: 'viewCerNoList',
        })
      }
    },
    editAction({ certificateId }) {
      // 查看注册证详情详情
      dispatchAction({
        type: 'viewDetailCert',
        payload: { certificateId },
      })
    },
    registTypeList,
  }
  const tableParam = {
    rowSelection: {
      onChange: (selectedRowKeys) => {
        dispatchAction({
          payload: {
            checkedArr: selectedRowKeys,
          },
        })
      },
      selectedRowKeys: checkedArr,
    },
    loading: getLoading('getCertList', 'addCert', 'editCert', 'onOffCert'),
    columns: genColumns(columnsParam),
    dataSource: certificateList,
    pagination: getPagination((current, pageSize) => {
      dispatchAction({
        type: 'getCertList',
        payload: { current, pageSize },
      })
    }, pagination),
    rowClassName: ({ certificateStatus }) => (certificateStatus ? 'aek-text-disable' : ''),
    rowKey: 'certificateId',
    scroll: { x: 1150 },
  }
  const changeStatus = (e) => {
    const key = Number(e.key)
    confirm({
      content: key ? '确定要批量停用吗？' : '确定要批量启用吗？',
      onOk() {
        dispatchAction({
          type: 'mountOnOff',
          payload: { certificateStatus: !!key, certificateIds: checkedArr.join() },
        })
      },
    })
  }
  const menu = (
    <Menu onClick={changeStatus}>
      <Menu.Item key="1">停用</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="0">启用</Menu.Item>
    </Menu>
  )
  const addModalShow = () => {
    dispatchAction({
      payload: {
        addModalVisible: true,
        addModalType: 'create',
        currentItem: {},
      },
    })
  }
  // 获取厂家
  const onSearchProListDelay = debounce((val) => {
    dispatchAction({
      type: 'getProduceFacList',
      payload: {
        keywords: val,
      },
    })
  }, 500)
  // 获取所有厂家 、供应商列表（总代）
  const onSearchAllListDelay = debounce((val) => {
    dispatchAction({
      type: 'getAllTypeInfo',
      payload: {
        keywords: val,
      },
    })
  }, 500)
  // 获取总代
  const onSearchProxyFacListDelay = debounce((val) => {
    dispatchAction({
      type: 'getAllProList',
      payload: {
        keywords: val,
      },
    })
  }, 500)
  // 获取新证号
  const onSearchNewCertListDelays = debounce((val) => {
    dispatchAction({
      type: 'getNewCertList',
      payload: {
        keywords: val,
      },
    })
  }, 500)
  // 搜索参数
  const searchParam = {
    initialValues: searchSaveParam,
    formData: formData({ registTypeList }),
    advancedForm: advancedForm({
      produceList,
      allProList,
      onSearchProList: onSearchProListDelay,
      onSearchAllList: onSearchAllListDelay,
      registTypeList,
    }),
    onSearch(data) {
      dispatchAction({
        payload: { searchSaveParam: data },
      })
      dispatchAction({
        type: 'getCertList',
        payload: { ...pagination, current: 1 },
      })
    },
  }
  const addModalParam = {
    onSearchProList: onSearchProListDelay,
    onSearchProxyFacList: onSearchProxyFacListDelay,
    onSearchNewCertList: onSearchNewCertListDelays,
    currentItem,
    certSortShow,
    timeIsOffReQuire,
    longStatus,
    certIsOff,
    delayIsOff,
    proxyIsOff,
    produceList,
    suppProList,
    newCertList,
    fileEndDate,
    dispatchAction,
    addModalType,
    addModalVisible,
    getLoading,
    registTypeList,
  }
  const historyModalParam = {
    historyModalVisible,
    dispatchAction,
    getLoading,
    historyPagination,
    historyList,
    checkedHistoryArr,
  }
  const compareModalParam = {
    versionDoubleList,
    compareModalVisible,
    dispatchAction,
    getLoading,
    historyPagination,
    historyList,
    checkedHistoryArr,
    registTypeList,
  }
  const viewModalParam = {
    viewCurrentData,
    viewModalVisible,
    dispatchAction,
    getLoading,
    registTypeList,
  }
  return (
    <div className="aek-layout">
      <div className="bread">
        <Breadcrumb />
        <div className="aek-fr">
          {checkedArr.length > 1 && (
            <Dropdown overlay={menu} disabled={checkedArr.length === 0} trigger={['click']}>
              <Button type="primary" style={{ marginRight: 15 }}>
                批量操作<Icon type="down" />
              </Button>
            </Dropdown>
          )}
          <Button type="primary" icon="plus" onClick={addModalShow} style={{ marginRight: 15 }}>
            添加注册证
          </Button>
        </div>
      </div>
      <div className="content">
        <SearchFormFillter {...searchParam} />
        <Table bordered {...tableParam} />
        <AddModal {...addModalParam} />
        <HistoryModal {...historyModalParam} />
        <CompareModal {...compareModalParam} />
        <ViewModal {...viewModalParam} />
      </div>
    </div>
  )
}
IndexPage.propTypes = {
  routes: PropTypes.array,
  certificate: PropTypes.object,
  app: PropTypes.object,
  loading: PropTypes.object,
  registTypeList: PropTypes.array,
}

export default connect(({
  certificate,
  loading,
  app: {
    constants: {
      registTypeList,
    },
  } }) => ({ certificate, loading, registTypeList }))(IndexPage)
