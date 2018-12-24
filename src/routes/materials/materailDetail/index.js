import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Icon, Modal, Button, Dropdown, Table, Menu, Tabs, Spin } from 'antd'
import Breadcrumb from '../../../components/Breadcrumb'
import PlainForm from '../../../components/PlainForm'
import SearchFormFilter from '../../../components/SearchFormFilter'
import AddSkuModal from './addSku'
import BarCodeModal from './barCodeModal'
import { components, genColumns, getDetailData } from './data'
import { getBasicFn, getPagination } from '../../../utils/index'
import HistoryModal from './historyModal'
import CompareModal from './compareModal'
import ViewModal from './viewModal'
import PackageSpecifica from '../../../components/PackageSpecifica'
import DetailBarCodeForm from '../barcode/DetailModal'

const TabPane = Tabs.TabPane
const { confirm } = Modal
const namespace = 'materialDetail'
const propTypes = {
  materialDetail: PropTypes.object,
  app: PropTypes.object,
  loading: PropTypes.object,
}
function IndexPage({ materialDetail, app: { constants: { packageUnit } }, loading }) {
  const { dispatchAction, getLoading } = getBasicFn({ namespace, loading })
  const {
    barCodeRuleObj,
    ruleModalVisible,
    packageList, // 渲染表格数据
    packageModalVisible,
    viewModalVisible,
    viewCurrentData,
    historyModalVisible,
    historyPagination,
    historyList,
    checkedHistoryArr,
    versionDoubleList,
    compareModalVisible,
    barCodeList,
    barCodeModalVisible,
    addModalType,
    currentItem,
    addSkuModalVisible,
    skuList,
    currentPageData,
    checkedArr,
    pagination,
  } = materialDetail
  const searchParam = {
    // 搜索参数
    components,
    onSearch(data) {
      dispatchAction({
        payload: { searchSaveParam: data },
      })
      dispatchAction({
        type: 'querySkuList',
      })
    },
  }
  const genColumnsParam = {
    handleAction(e, { materialsSkuId }) {
      const key = Number(e.key)
      if (key === 0 || key === 1) {
        confirm({
          content: !key ? '确定要启用吗？' : '确定要停用吗？',
          onOk() {
            dispatchAction({
              type: 'onOffStatus',
              payload: { materialsSkuStatus: !!key, materialsSkuId },
            })
          },
        })
      } else if (key === 2) {
        dispatchAction({
          type: 'queryPackageList',
          payload: { materialsSkuId },
        })
      } else if (key === 3) {
        dispatchAction({
          type: 'queryBarCodeList',
          payload: { materialsSkuId },
        })
        dispatchAction({
          payload: { barCodeModalVisible: true },
        })
      } else if (key === 4) {
        dispatchAction({
          payload: { materialsSkuId },
        })
        dispatchAction({
          type: 'getVersionList',
        })
      }
    },
    addModalShow({ materialsSkuId }) {
      dispatchAction({
        type: 'querySkuDetail',
        payload: { materialsSkuId },
      })
    },
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
    loading: getLoading('querySkuList', 'onOffStatus', 'mountOnOffStatus'),
    columns: genColumns(genColumnsParam),
    dataSource: skuList,
    rowClassName: ({ materialsSkuStatus }) => {
      if (materialsSkuStatus) {
        return 'aek-text-disable'
      }
      return ''
    },
    pagination: getPagination((current, pageSize) => {
      dispatchAction({
        type: 'querySkuList',
        payload: { current, pageSize },
      })
    }, pagination),
    rowKey: 'materialsSkuId',
    scroll: { x: 1000 },
  }
  const changeStatus = (e) => {
    const key = Number(e.key)
    confirm({
      content: key ? '确定要批量停用吗？' : '确定要批量启用吗？',
      onOk() {
        dispatchAction({
          type: 'mountOnOffStatus',
          payload: { materialsSkuStatus: !!key, materialsSkuIds: checkedArr.join() },
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
  const addSkuModalShow = () => {
    dispatchAction({
      payload: {
        addSkuModalVisible: true,
        addModalType: 'create',
        currentItem: {},
      },
    })
  }
  const addSkuParam = {
    dispatchAction,
    getLoading,
    addSkuModalVisible,
    currentItem,
    addModalType,
    packageUnit,
  }
  const barCodeParam = {
    getLoading,
    dispatchAction,
    barCodeModalVisible,
    barCodeList,
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
  }
  const viewModalParam = {
    viewModalVisible,
    dispatchAction,
    getLoading,
    viewCurrentData,
  }
  const compareProps = {
    visible: ruleModalVisible,
    width: 600,
    title: '查看规则',
    onCancel: () => {
      dispatchAction({
        payload: {
          ruleModalVisible: false,
          barCodeRuleObj: {},
        },
      })
    },
    footer: null,
    wrapClassName: 'aek-modal',
  }

  const packageParam = {
    modalVisible: packageModalVisible, // 弹框visible
    handleModalCancel() {
      dispatchAction({ payload: { packageModalVisible: false } })
    }, //  modal 关闭事件
    handleModalOk(list) {
      dispatchAction({
        type: 'savePackage',
        payload: {
          packageInfos: list,
        },
      })
    }, // modal 保存事件
    packageUnit, // 包装规格所有单位
    packageList, // 渲染表格数据
    loading: getLoading('savePackage', 'queryPackageList'), // 提交loading
  }
  return (
    <div className="aek-layout">
      <div className="bread">
        <div>
          <Breadcrumb />
        </div>
      </div>
      <div className="content">
        <div className="aek-content-title">基本信息</div>
        <div className="aek-mt20">
          <PlainForm size={3} data={getDetailData(currentPageData)} />
        </div>
        <div style={{ marginTop: 30 }}>
          <Tabs
            animated={false}
            defaultActiveKey="1"
            tabBarExtraContent={
              <div>
                {checkedArr.length > 1 && (
                  <Dropdown disabled={checkedArr.length === 0} overlay={menu} trigger={['click']}>
                    <Button
                      type="primary"
                      style={{ marginRight: 15 }}
                    >
                      批量操作<Icon type="down" />
                    </Button>
                  </Dropdown>
                )}
                <Button type="primary" onClick={addSkuModalShow}>
                  <Icon type="plus" />新增规格
                </Button>
              </div>
            }
          >
            <TabPane tab="规格" key="1">
              <SearchFormFilter {...searchParam} />
              <Table bordered {...tableParam} />
            </TabPane>
          </Tabs>
        </div>
      </div>
      <AddSkuModal {...addSkuParam} />
      <BarCodeModal {...barCodeParam} />
      <HistoryModal {...historyModalParam} />
      <CompareModal {...compareModalParam} />
      <ViewModal {...viewModalParam} />
      <PackageSpecifica {...packageParam} />
      <Modal {...compareProps}>
        <Spin spinning={getLoading('queryRuleDetail')}>
          <DetailBarCodeForm data={barCodeRuleObj} noBasicInfo />
        </Spin>
      </Modal>
    </div>
  )
}
IndexPage.propTypes = propTypes

export default connect(({ materialDetail, loading, app }) => ({ materialDetail, app, loading }))(
  IndexPage,
)
