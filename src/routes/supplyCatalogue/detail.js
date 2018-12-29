import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import {
  Button,
  Tabs,
  Icon,
  Dropdown,
  Menu,
  message,
  Modal,
  Alert,
  Table,
  Select,
  Input,
  Spin,
} from 'antd'
import { cloneDeep, debounce } from 'lodash'
import { Link } from 'dva/router'
import Breadcrumb from '../../components/Breadcrumb'
import Package from './packageStandard'
import EditMaterial from './editMaterial'
import BarCode from './barCode'
import History from './history'
import OtherBarCode from './barCode/otherBarcode'
import RegistModal from './registModal'
import { getTabName, getBasicFn } from '../../utils'
import BatchModal from './batchAddCatalog'
// 批量撤销
import BatchCancelModal from './cancelModal'
// 标准物料同步对照
import CompaerModal from '../../components/RowTable/ModalCompare'
import SearchForm from '../../components/SearchFormFilter'
import AddModal from "../materials/material/addMaterialModal"
import { tableColumns } from './data'

import LkcIcon from '../../components/LkcTable'
import Styles from './detail.less'
import ModalEditMaterial from "./ModalEditMaterial";
import ModalExcel from "./ModalExcel";
import ModalExcelSchedule from "./ModalExcelSchedule";



const namespace = 'supplyCatalogueDetail'
const confirm = Modal.confirm
const TabPane = Tabs.TabPane
// supplyCatalogueDetail,
//   effects,
//   packageUnit,
//   accuracy,
//   accuracyDecimal,

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
    selectedRows,
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

    compareModalVisible, // 标准物料对照弹框
    compareModalList, // 标准物料对照列表


    branOptionList,

    hatchCancelList,
    batchCancelModalVisible,
    certificateOptionList, // 注册证下拉列表
    cloneSelectRowData,

  //  后续添加
    importButtonStatus,
    excelModalVisible,
    scheduleList,
    excelPageConfig,
    scheduleModalVisible,
    editModalVisible,
    modalInitValue,
    codeMust,
    suppliersSelect,
    modalType,
  } = supplyCatalogueDetail


  const { toAction, dispatchAction, getLoading, dispatchUrl } = getBasicFn({ namespace, loading: { effects } })

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
  const asyncRegListDelay = debounce((val) => {
    dispatchAction({
      type: 'queryOptionRegList',
      payload: {
        keywords: val,
      },
    })
  }, 500)
  const onSearchBrandListFunDelay = debounce((val) => {
    dispatchAction({
      type: 'getBrandList',
      payload: {
        keywords: val,
        produceFactoryId: productFacId,
      },
    })
  }, 500)
  const onSearchProListFunDelay = debounce((val) => {
    dispatchAction({
      type: 'getProduceFacList',
      payload: {
        keywords: val,
      },
    })
  }, 500)

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

    // dispatchAction({
    //   type: 'getOptions',
    //   payload: {
    //     keywords: '',
    //   },
    // }).then(() => {
    // dispatchAction({
    //   payload: {
    //     cloneSelectRowData: cloneDeep(selectedRows),
    //   },
    // })
    // })
    /** @param key 1 批量编辑 2 批量撤销 3 批量推送 */
    switch (key) {
      case '1':
        dispatchAction({
          payload: {
            batchEditModalVisible: true,
          },
        })
        break
      case '2':
        showConfirm({
          title: '是否要撤销所勾选的物料？',
          handleOk() {
            dispatchAction({
              type: 'batchCancel',
              payload: {
                pscIds: selectedRowKeys,
              },
            }).then((data) => {
              dispatchAction({
                payload: {
                  selectedRowKeys: [],
                  selectedRows: [],
                },
              })
              if (data && data.length) {
                dispatchAction({
                  payload: {
                    batchCancelModalVisible: true,
                  },
                })
              } else {
                message.success('撤销成功')
                dispatchAction({
                  type: 'getTableData',
                })
              }
            })
          },
        })
        break
      default:
        showConfirm({
          title: '是否要推送所勾选的物料',
          handleOk() {
            dispatchAction({
              type: 'saveToExamine',
              payload: {
                customerOrgId: customerId,
                catalogs: selectedRows.map(item => ({
                  ...item,
                  materialsCommenName: item.commenName,
                  supplierCertificateNo: item.certificateNo,
                })),
              },
            }).then(() => {
              dispatchAction({
                payload: {
                  selectedRowKeys: [],
                  selectedRows: [],
                },
              })
              message.success('操作成功')
              dispatchAction({
                type: 'getTableData',
              })
            })
          },
        })
        break
    }
  }

  const menu = () => {
    if (tabIndex === '1' || tabIndex === '3') {
      return (<Menu onClick={handleMenuClick}>
        <Menu.Item key="1">批量编辑</Menu.Item>
      </Menu>)
    } else if (tabIndex === '2') {
      return (<Menu onClick={handleMenuClick}>
        {/* <Menu.Item key="1">批量编辑</Menu.Item> */}
        <Menu.Item key="2">批量撤销</Menu.Item>
      </Menu>)
    } else if (tabIndex === '5') {
      return (<Menu onClick={handleMenuClick}>
        <Menu.Item key="1">批量编辑</Menu.Item>
        <Menu.Item key="3">批量推送</Menu.Item>
      </Menu>)
    }
    return <Menu />
  }

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
        selectedRows: [],
        cloneSelectRowData: [],
      },
    })

    dispatchAction({
      type: 'getTableData',
      payload: {
        current: 1,
        pageSize: 10,
        customerOrgId: customerId,
      },
    })
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

  // 品牌异步搜索
  const onSearchBrandListFun = debounce((val, index) => {
    dispatchAction({
      type: 'getBrandList',
      payload: {
        keywords: val,
      },
    }).then((content) => {
      if (index) {
        const arr = cloneDeep(cloneSelectRowData)
        arr[index].branOptionList = content
        dispatchAction({
          payload: {
            cloneSelectRowData: arr,
          },
        })
      }
    })
  }, 500)


  // const handleCertificate = debounce((val, index) => {
  //   dispatchAction({
  //     type: 'getCertificateList',
  //     payload: {
  //       keywords: val,
  //     },
  //   }).then((content) => {
  //     const arr = cloneDeep(cloneSelectRowData)
  //     arr[index].certificateOptionList = content
  //     dispatchAction({
  //       payload: {
  //         cloneSelectRowData: arr,
  //       },
  //     })
  //   })
  // })

  // 批量编辑
  const batchProps = {
    effects,
    dispatch,
    batchAddModalVisible: batchEditModalVisible,
    packageUnit,
    batchDataList: selectedRows,
    modalType: 2,
    handleBack() {
      dispatchAction({
        payload: {
          batchEditModalVisible: false,
        },
      })
    }, // 返回
    handleSave(data) {
      // 需要判断状态类型
      dispatchAction({
        type: 'saveToPush',
        payload: {
          customerOrgId: customerId,
          catalogs: data,
        },
      }).then(() => {
        message.success('操作成功')
        dispatchAction({
          payload: {
            batchEditModalVisible: false,
            selectedRowKeys: [],
            selectedRows: [],
            cloneSelectRowData: [],
          },
        })
        dispatchAction({
          type: 'getTableData',
        })
      })
    }, // 保存至待推送
    handlePush(data) {
      // 需要判断状态类型
      dispatchAction({
        type: 'saveToExamine',
        payload: {
          customerOrgId: customerId,
          catalogs: data,
        },
      }).then(() => {
        message.success('操作成功')
        dispatchAction({
          payload: {
            batchEditModalVisible: false,
            selectedRowKeys: [],
            selectedRows: [],
            cloneSelectRowData: [],
          },
        })
        dispatchAction({
          type: 'getTableData',
        })
      })
    }, // 推送审核
  }


  const getCompareFlag = () => {
    if (compareModalList && compareModalList.length) {
      /** @description 针对js自动过滤 为null的数据并且过滤掉certificateId
       *  2018-7-17
       */

      const base = [
        'materialsName',
        'materialsSku',
        'factoryName',
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
    loading: effects[`${namespace}/compareModalData`],
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
                payload: {
                  rowSelectData: {
                    ...rowSelectData,
                    ...compareModalList[1],
                  },
                  compareModalVisible: false,
                },
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


  // 复选框参数
  const rowSelection = {
    selectedRowKeys,
    onChange(selectedRowKey, selectedRow) {
      dispatch({
        type: 'supplyCatalogueDetail/updateState',
        payload: {
          selectedRowKeys: selectedRowKey,
          selectedRows: selectedRow,
        },
      })
    },
  }

  // 翻页
  const handleChange = (value) => {
    dispatchAction({
      type: 'getTableData',
      payload: {
        ...searchData,
        ...value,
      },
    })
  }


  // 搜索条件
  const searchformPorps = {
    components: [
      {
        field: 'platformAuthStatus',
        component: (
          <Select optionLabelProp="title">
            <Select.Option value={null} title="平台认证状态：全部">
                全部
            </Select.Option>
            <Select.Option value={'1'} title="平台认证状态：已认证">
                已认证
            </Select.Option>
            <Select.Option value={'2'} title="平台认证状态：待认证">
                待认证
            </Select.Option>
            <Select.Option value={'3'} title="平台认证状态：已忽略">
                已忽略
            </Select.Option>
          </Select>
        ),
        options: {
          initialValue: null,
        },
      },
      {
        field: 'keywords',
        component: <Input placeholder="物料/规格/省标/厂家/注册证" />,
      },
    ].filter((item) => {
      if (tabIndex === '6' && item.field === 'keywords') {
        return true
      } else if (tabIndex !== '6') {
        return true
      }
      return false
    }),
    onSearch: (value) => {
      dispatchAction({
        type: 'getTableData',
        payload: {
          pscStatus: 1,
          customerOrgId: customerId,
          ...value,
          current: 1,
          pageSize: 10,
        },
      })
    },
  }

  const tableProps = {
    className: Styles['aek-table-content'],
    columns: tableColumns({
      tabIndex,
      handleMenuClick: (key, record) => {
        /**
         * 1 维护包装规格
         * 2 条码维护
         * 3 绑定注册证
         * 4 修改历史
         * 5 编辑
         * 6 撤销 // 只有待审核可以撤销
         * 7 删除 // 只有待推送有删除
         */
        dispatchAction({
          payload: {
            rowSelectData: record,
          },
        })

        // 编辑传参
        let catalogInfoType = ''
        // 维护条码
        let useType = ''
        if (tabIndex !== '6') {
          catalogInfoType = (tabIndex === '1' || tabIndex === '4') ? 1 : 2
          useType = (tabIndex === '2' || tabIndex === '3') ? 0 : 1
        } else {
          catalogInfoType = (record.pscStatus === 1 || record.pscStatus === 4) ? 1 : 2
          useType = (record.pscStatus === 2 || record.pscStatus === 3) ? 0 : 1
        }


        switch (key) {
          case '1':
            dispatch({
              type: 'supplyCatalogueDetail/getPackageList',
              payload: {
                pscId: record.pscId,
                useType,
              },
            })
            break
          case '2':
            dispatch({
              type: 'supplyCatalogueDetail/getCodeBarList',
              payload: {
                pscId: record.pscId,
              },
            })
            break
          case '3':
            dispatch({
              type: 'supplyCatalogueDetail/updateState',
              payload: {
                registVisible: true,
                selectedRowKeys: [record.pscId],
              },
            })
            dispatch({
              type: 'supplyCatalogueDetail/getRegistList',
            })
            break
          case '4':
            dispatch({
              type: 'supplyCatalogueDetail/getHistoryList',
              payload: {
                curren: 1,
                pageSize: 10,
                pscId: record.pscId,
              },
            })
            break
          case '5':
            dispatchAction({
              type: 'app/getPackageUnit',
            })

            dispatchAction({
              type: 'getEditMaterialList',
              payload: {
                editMaterialVisible: true,
                catalogInfoType,
                pscId: record.pscId,
              },
            })
            break
          case '6':
            showConfirm({
              title: '确定要撤销该推送吗？',
              zIndex: 1001,
              handleOk() {
                dispatchAction({
                  type: 'batchCancel',
                  payload: {
                    pscIds: [record.pscId],
                  },
                }).then((data) => {
                  if (data && data.length) {
                    dispatchAction({
                      payload: {
                        batchCancelModalVisible: true,
                      },
                    })
                  } else {
                    message.success('撤销成功')
                    dispatchAction({
                      type: 'getTableData',
                    })
                  }
                })
              },
            })
            break
          default:
            showConfirm({
              title: '确定要删除吗？',
              zIndex: 1001,
              handleOk() {
                dispatchAction({
                  type: 'pendingPushDel',
                  payload: {
                    pscId: record.pscId,
                  },
                }).then((content) => {
                  if (!content) {
                    Modal.error({
                      title: '物料已被推送，无法删除！',
                    })
                  } else {
                    dispatchAction({ type: 'getTableData' })
                  }
                })
              },
            })
            break
        }
      },
      customerDetail,
    }),
    dataSource,
    pagination: {
      ...pagination,
      showSizeChanger: false,
    },
    bordered: true,
    onChange: handleChange,
    rowKey({ pscId, pscStatus }) {
      return pscStatus ? `${pscId}${pscStatus}` : pscId
    },
    rowSelection,
    scroll: { x: 1300 },
  }

  if (tabIndex === '4' || tabIndex === '6') {
    delete tableProps.rowSelection
  }


  const packageProps = {
    packageList,
    packageModalVisible,
    dispatch,
    effects,
    packageUnit,
    rowSelectData,
  }


  const EditProps = {
    editMaterialVisible,
    rowSelectData,
    dispatch,
    effects,
    inviteRequired,
    accuracy,
    accuracyDecimal,
    tabIndex,
    packageUnit,
    onSearchBrandListFun,
    branOptionList,
    customerId,
  }
  // 维护条码
  const BarCodeProps = {
    dispatch,
    effects,
    codeBarVisible,
    codeBarList,
    rowSelectData,
    customerId,
  }
  const historyprops = {
    dispatch,
    effects,
    historyVisible, // 查看历史列表modal
    historyList, // 历史列表数据
    historyPagiantion, // 历史列表分页
    historySelected, // 选中需要对比的历史版本
    compareVisible, // 历史对比
    compareList, // 历史对比数据
    singleCompareVisible, // 单条历史
    singleCompareList, // 单条历史数据
    rowSelectData,
  }
  // 绑定其他物资的条码
  const otherBarcodeProps = {
    dispatch,
    effects,
    otherCodeVisible,
    otherCodeList,
    rowSelectData,
  }
  // 批量撤销
  const cancelPorps = {
    effects,
    batchCancelModalVisible,
    batchDataList: hatchCancelList,
    handleCancel() {
      dispatchAction({
        payload: {
          batchCancelModalVisible: false,
        },
      })
    },
  }
  // 后续添加
  const modalEditMaterialProps = {
    loading: getLoading('addMaterial', 'updateMaterial'),
    editModalVisible,
    modalInitValue,
    codeMust,
    suppliersSelect,
    packageUnit,
    modalType,
    toAction,
  }
  const modalExcelProps = {
    loading: getLoading('excelInput'),
    importButtonStatus,
    excelModalVisible,
    toAction,
  }
  const modalExcelSchedulProps = {
    scheduleList,
    excelPageConfig,
    scheduleModalVisible,
    loading: getLoading('excelSchedule'),
    toAction,
  }
  const menuClick = (key) => {
    toAction({ modalSelsect: false })
    switch (key) {
      case 'add':
        toAction('app/getPackageUnit')
        toAction({ keywords: null }, 'suppliersSelect')
        toAction({
          editModalVisible: true,
          modalType: 'add',
        })
        break
      case 'get':
        dispatchUrl({ pathname: `/supplyCatalogue/detail/${customerId}/dictionSelect` })
        break
      case 'excelInput':
        toAction({
          excelModalVisible: true,
        })
        break
      case 'schedule':
        toAction({
          scheduleModalVisible: true,
        })
        toAction(
          {
            current: 1,
            pageSize: 10,
          },
          'excelSchedule',
        )
        break
      default:
        break
    }
  }
  return (
    <div className="aek-layout">
      <div className="bread">
        <div style={{ float: 'left' }}>
          <Breadcrumb routes={routes} />
        </div>
        <div style={{ float: 'right'}}>
          {(tabIndex !== '4' && tabIndex !== '6') ? (
            <Dropdown overlay={menu()} disabled={selectedRowKeys.length === 0} trigger={['click']}>
              <Button>
                批量操作<Icon type="down" />
              </Button>
            </Dropdown>
          ) : (
            ''
          )}
          &nbsp;&nbsp;
          <Dropdown.Button
            onClick={() => {
              toAction({ modalSelsect: true })
            }}
            type="primary"
            overlay={
              <Menu
                onClick={({ key }) => {
                  menuClick(key)
                }}
              >
                <Menu.Item key="add">手工新增</Menu.Item>
                {/*<Menu.Item key="get">从平台标准数据中拉取</Menu.Item>*/}
                <Menu.Item key="excelInput">EXCEL导入</Menu.Item>
                <Menu.Item key="schedule">EXCEL导入进度</Menu.Item>
              </Menu>
            }
          >
            添加物料
          </Dropdown.Button>
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
          <Spin spinning={getLoading('getTableData')}>
            <Tabs onChange={tabsChange} animated={false}>
              <TabPane
                tab={getTabName('全部', customerDetail.allNumber)}
                key="6"
              />
              <TabPane
                tab={getTabName('使用中', customerDetail.inUseNumber)}
                key="1"
              />
              <TabPane
                key="2"
                tab={getTabName('待审核', customerDetail.pendingReviewNumber)}
              />
              <TabPane
                key="5"
                tab={getTabName('待推送', customerDetail.pendingPushNumber)}
              />
              <TabPane
                tab={getTabName('已拒绝', customerDetail.refusedNumber)}
                key="3"
              />
              <TabPane
                tab={getTabName('已停用', customerDetail.disabledNumber)}
                key="4"
              />
            </Tabs>
            <SearchForm key={tabIndex} {...searchformPorps} />
            <Table {...tableProps} />
          </Spin>
        </div>
      </div>
      <RegistModal {...registProps} />
      <ModalEditMaterial {...modalEditMaterialProps} />
      <ModalExcel {...modalExcelProps} />
      <ModalExcelSchedule {...modalExcelSchedulProps} />
      {/* //批量编辑 */}
      {batchEditModalVisible && <BatchModal {...batchProps} />}
      {/* 标准物料同步对照 */}
      <CompaerModal {...compareModalProps} />
      <Package {...packageProps} />
      <EditMaterial {...EditProps} />
      <BarCode {...BarCodeProps} />
      <History {...historyprops} />
      <OtherBarCode {...otherBarcodeProps} />
      {/* 批量撤销 */}
      <BatchCancelModal {...cancelPorps} />
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
