import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Button, Tabs, Icon, Dropdown, Menu, message, Modal, Alert } from 'antd'
import { cloneDeep } from 'lodash'
import { Link } from 'dva/router'
import Breadcrumb from '../../components/Breadcrumb'
import Use from './useing'
import Pend from './pending'
import Reject from './rejected'
import Didaled from './disabled'
import Push from './push'
import RegistModal from './registModal'
import { getTabName, getBasicFn } from '../../utils'
import BatchModal from './batchAddCatalog'
// 标准物料同步对照
import CompaerModal from '../../components/RowTable/ModalCompare'

const namespace = 'supplyCatalogueDetail'
const confirm = Modal.confirm
const TabPane = Tabs.TabPane


function SupplyCatalogueDetail({
  supplyCatalogueDetail,
  effects,
  dispatch,
  routes,
  packageUnit,
  accuracy,
  accuracyDecimal,
}) {
  const {
    customerId,
    searchData,
    customerDetail,
    dataSource,
    pagination,
    tabIndex,
    selectedRowKeys,
    packageList,
    packageModalVisible,
    editMaterialVisible,
    rowSelectData,
    inviteRequired,
    codeBarVisible,
    codeBarList,
    historyVisible, // 查看历史列表modal
    historyList, // 历史列表数据
    historyPagiantion, // 历史列表分页
    historySelected, // 选中需要对比的历史版本
    compareVisible, // 历史对比
    compareList, // 历史对比数据
    singleCompareVisible, // 单条历史
    singleCompareList, // 单条历史数据
    registVisible, // 绑定注册证弹框
    registList, // 注册证列表
    registPagitantion, // 注册证列表分页
    registSearchData,
    otherCodeVisible,
    otherCodeList,

    batchEditModalVisible, // 批量编辑弹框
    batchDataList, // 批量编辑列表

    compareModalVisible, // 标准物料对照弹框
    compareModalList, // 标准物料对照列表

  } = supplyCatalogueDetail


  const { dispatchAction } = getBasicFn({ namespace })


  // 批量绑定注册证
  const handleMenuClick = ({ key }) => {
    if (!selectedRowKeys.length) {
      message.error('请选择物资', 3)
      return
    }
    /** @desc 需求更改没有批量绑定注册证 */
    // dispatch({
    //   type: 'supplyCatalogueDetail/updateState',
    //   payload: {
    //     registVisible: true,
    //   },
    // })
    // dispatch({
    //   type: 'supplyCatalogueDetail/getRegistList',
    //   payload: {
    //     current: 1,
    //     pageSize: 10,
    //   },
    // })

    /** @param key 1 批量编辑 2 批量撤销 3 批量推送 */
    switch (key) {
      case '1':
        break
      case '2':
        break
      default:
        break
    }
  }
  // 下拉按钮

  // let menuList = []
  // if (tabIndex === '1' || tabIndex === '3') {
  //   menuList.push(
  //     <Menu.item key="1">批量编辑</Menu.item>,
  //   )
  // } else if (tabIndex === '2') {
  //   menuList = [
  //     <Menu.Item key="1">批量编辑</Menu.Item>,
  //     <Menu.Item key="2">批量撤销</Menu.Item>,
  //   ]
  // } else if (tabIndex === '5') {
  //   menuList.push(
  //     <Menu.item key="3">批量推送</Menu.item>,
  //   )
  // }

  // const menu = (
  //   <Menu onClick={handleMenuClick}>
  //     {menuList.map(item => item)}
  //   </Menu>
  // )

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.item key="3">批量推送</Menu.item>
    </Menu>
  )

  // tabs页切换
  const tabsChange = (value) => {
    if (value && !Array.isArray(value) && typeof value === 'object') {
      return
    }
    dispatch({
      type: 'supplyCatalogueDetail/updateState',
      payload: {
        tabIndex: value,
        dataSource: [],
        pagination: {},
        rowSelectData: {},
        searchData: {},
        selectedRowKeys: [],
      },
    })
    let url = ''
    let pscStatus = 1
    if (value === '1') {
      url = 'supplyCatalogueDetail/getDisabledList'
    } else if (value === '2') {
      url = 'supplyCatalogueDetail/getRefuseList'
    } else if (value === '3') {
      pscStatus = 2
      url = 'supplyCatalogueDetail/getRefuseList'
    } else {
      pscStatus = 2
      url = 'supplyCatalogueDetail/getDisabledList'
    }
    dispatch({
      type: url,
      payload: {
        current: 1,
        pageSize: 10,
        pscStatus,
        customerOrgId: customerId,
      },
    })
  }
  // 使用中参数
  const useProps = {
    effects,
    dispatch,
    dataSource,
    pagination,
    searchData,
    selectedRowKeys,
    packageList,
    packageModalVisible,
    packageUnit,
    editMaterialVisible,
    rowSelectData,
    inviteRequired,
    accuracy,
    accuracyDecimal,
    tabIndex,
    codeBarVisible,
    codeBarList,
    historyVisible, // 查看历史列表modal
    historyList, // 历史列表数据
    historyPagiantion, // 历史列表分页
    historySelected, // 选中需要对比的历史版本
    compareVisible, // 历史对比
    compareList, // 历史对比数据
    singleCompareVisible, // 单条历史
    singleCompareList, // 单条历史数据
    customerId,
    otherCodeVisible,
    otherCodeList,
  }
  // 待审核参数
  const pendProps = {
    effects,
    dispatch,
    dataSource,
    pagination,
    searchData,
    customerId,
    tabIndex,
    packageUnit,
  }
  // 待推送
  const pushProps = {
    effects,
    dispatch,
    dataSource,
    pagination,
    searchData,
    customerId,
    tabIndex,
    packageUnit,
  }
  // 已拒绝
  const rejectProps = {
    effects,
    dispatch,
    dataSource,
    pagination,
    searchData,
    customerId,
    tabIndex,
    packageUnit,
  }
  // 已停用
  const disProps = {
    effects,
    dispatch,
    dataSource,
    pagination,
    searchData,
    customerId,
    tabIndex,
  }
  // 绑定注册证参数
  const registProps = {
    effects,
    dispatch,
    registVisible, // 绑定注册证弹框
    registList, // 注册证列表
    selectedRowKeys,
    registPagitantion,
    registSearchData,
  }

  // 批量编辑
  const batchProps = {
    effects,
    dispatch,
    batchAddModalVisible: batchEditModalVisible,
    packageUnit,
    batchDataList,
    modalType: 1,
    handleBack() {
      dispatch({
        payload: {
          batchAddModalVisible: false,
        },
      })
    }, // 返回
    handleSave(data) {
      dispatch({
        type: 'saveToPush',
        payload: data,
      })
    }, // 保存至待推送
    handlePush() {

    }, // 推送审核

  }


  const getCompareFlag = () => {
    if (compareModalList && compareModalList.length) {
      /** @description 针对js自动过滤 为null的数据并且过滤掉certificateId
       *  2018-7-17
       */

      const base = [
        'agentSupplierName',
        'certificateNo',
        'certificateType',
        'importedFlag',
        'produceFactoryName',
        'productName',
        'validDateEnd',
        'validDateLongFlag',
        'validDateLongFlag',
      ]

      for (const key of base) {
        if (compareModalList[0][key] !== compareModalList[1][key]) {
          return false
        }
      }
      return true
    }
    return false
  }


  function showConfirm({ title = '', content = '', handleOk, zIndex = 1000 }) {
    confirm({
      title,
      content,
      onOk() {
        handleOk()
      },
      zIndex,
    })
  }


  // 注册证标注证件对照
  let compareDatasource = []
  if (compareModalList && compareModalList.length) {
    const arr = cloneDeep(compareModalList)
    arr[0].title = '当前物料'
    arr[1].title = '标准物料'
    compareDatasource = arr
  }


  // 标准物料对照
  const compareModalProps = {
    dataSource: compareDatasource,
    compareModalVisible,
    onCancel() {
      dispatchAction({
        payload: {
          compareModalVisible: false,
        },
      })
    },
    loading: effects[`${namespace}/getCompareModalList`] || effects[`${namespace}/updateRegist`],
    rows: [{
      title: '物资名称',
      dataIndex: 'materialsName',
    }, {
      title: '规格型号',
      dataIndex: 'materialsSku',
    }, {
      title: '厂家',
      dataIndex: 'factoryName',
    }],
    titleRender(item) {
      return (<span>{item.title}</span>)
    },
    title: '同步标准物料',
    footer: [
      <Button
        key="cancel"
        onClick={() => {
          dispatchAction({
            payload: {
              compareModalVisible: false,
            },
          })
        }}
      >取消</Button>,
      <Button
        type="primary"
        key="reload"
        disabled={getCompareFlag()}
        onClick={() => {
          showConfirm({
            title: '确定要更新吗？',
            zIndex: 1001,
            handleOk() {
              dispatchAction({
                type: 'updateRegist',
                payload: {
                  standardCertificateId: rowSelectData.standardCertificateId,
                  standardCertificateNo: rowSelectData.standardCertificateNo,
                  supplierCertificateId: rowSelectData.certificateId,
                },
              }).then(({ syncFlag, certificateNo }) => {
                if (!syncFlag) {
                  Modal.error({
                    title: `${certificateNo}，已存在，无法应用更新！`,
                    zIndex: 1001,
                  })
                } else {
                  message.success('更新成功！')
                  dispatchAction({
                    payload: {
                      compareModalVisible: false,
                    },
                  })
                  dispatchAction({
                    type: 'getRegistDetaiList',
                    payload: {
                      certificateId: rowSelectData.certificateId,
                    },
                  })
                  dispatchAction({
                    type: 'getRegistList',
                    payload: searchData,
                  })
                }
              })
            },
          })
        }}
      >更新</Button>,
    ],
    alertInfo: () => {
      const flag = getCompareFlag()
      let props
      if (flag) {
        props = {
          message: '与平台标准库中不存在差异，无需更新',
          type: 'info',
          showIcon: true,
          className: 'aek-mb20',
        }
      } else {
        props = {
          message: '与平台标准库中的物料信息存在如下差异，如果要使用标准物料信息，请单击更新',
          type: 'warning',
          showIcon: true,
          className: 'aek-mb20',
        }
      }
      return (
        <Alert
          {...props}
        />)
    },
  }

  return (
    <div className="aek-layout">
      <div className="bread">
        <div style={{ float: 'left' }}>
          <Breadcrumb routes={routes} />
        </div>
        <div style={{ float: 'right' }}>
          {tabIndex !== '4' ? (
            <Dropdown overlay={menu} disabled={selectedRowKeys.length === 0} trigger={['click']}>
              <Button>
                批量操作<Icon type="down" />
              </Button>
            </Dropdown>
          ) : (
            ''
          )}
          <Link to={`/supplyCatalogue/detail/${customerId}/dictionSelect`}>
            <Button type="primary" style={{ marginLeft: '20px' }} icon="plus">
              从平台标准物料中添加
            </Button>
          </Link>
        </div>
      </div>
      <div className="content">
        <div className="aek-border-bottom aek-mb10">
          <div>
            <h3 style={{ fontWeight: '600', color: '#757575' }}>
              {customerDetail.customerOrgName}
              <span style={{ margin: '0 10px' }}>
                <Icon type="phone" />
              </span>
              <span style={{ fontSize: '14px' }}>
                {customerDetail.contactName}-{customerDetail.contactPhone}
              </span>
            </h3>
          </div>
        </div>
        <div>
          <Tabs onChange={tabsChange} animated={false}>
            <TabPane
              tab={getTabName('使用中', customerDetail.inUseNumber)}
              key="1"
            >
              <Use {...useProps} />
            </TabPane>
            <TabPane
              key="2"
              tab={getTabName('待审核', customerDetail.pendingReviewNumber)}
            >
              <Pend {...pendProps} />
            </TabPane>
            <TabPane
              key="5"
              tab={getTabName('待推送', customerDetail.pendingReviewNumber)}
            >
              <Push {...pushProps} />
            </TabPane>
            <TabPane
              tab={getTabName('已拒绝', customerDetail.refusedNumber)}
              key="3"
            >
              <Reject {...rejectProps} />
            </TabPane>
            <TabPane
              tab={getTabName('已停用', customerDetail.disabledNumber)}
              key="4"
            >
              <Didaled {...disProps} />
            </TabPane>
          </Tabs>
        </div>
      </div>
      <RegistModal {...registProps} />
      {/* //批量编辑 */}
      <BatchModal {...batchProps} />
      {/* 标准物料同步对照 */}
      <CompaerModal {...compareModalProps} />
    </div>
  )
}

SupplyCatalogueDetail.propTypes = {
  supplyCatalogueDetail: PropTypes.object,
  effects: PropTypes.object,
  dispatch: PropTypes.func,
  addressList: PropTypes.array,
  sixEightCodeTree: PropTypes.array,
  routes: PropTypes.array,
  packageUnit: PropTypes.array,
  children: PropTypes.element,
  accuracy: PropTypes.any,
  accuracyDecimal: PropTypes.any,
  historyVisible: PropTypes.bool, // 查看历史列表modal
  historyList: PropTypes.array, // 历史列表数据
  historyPagiantion: PropTypes.object, // 历史列表分页
  historySelected: PropTypes.array, // 选中需要对比的历史版本
  compareVisible: PropTypes.bool, // 历史对比
  compareList: PropTypes.object, // 历史对比数据
  singleCompareVisible: PropTypes.bool, // 单条历史
  singleCompareList: PropTypes.object, // 单条历史数据
}

export default connect(({
  supplyCatalogueDetail,
  loading: { effects },
  app: {
    constants: {
      packageUnit,
    },
    orgInfo: {
      accuracy,
      accuracyDecimal,
    },
  },
}) =>
  ({
    supplyCatalogueDetail,
    effects,
    packageUnit,
    accuracy,
    accuracyDecimal,
  }))(SupplyCatalogueDetail)
