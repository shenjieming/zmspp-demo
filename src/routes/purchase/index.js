import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Table, Modal, Tabs, Button, Dropdown, Menu, Spin } from 'antd'
import { getBasicFn, getPagination, getTreeItem, getTabName } from '../../utils'
import AdvancedSearchForm from '../../components/SearchFormFilter/'
import { getColumns, getFormData, addOrder, verify, rowsColumns } from './data'
import ModalEditMaterial from './ModalEditMaterial'
import ModalSelsect from './ModalSelsect'
import ModalExcelSchedule from './ModalExcelSchedule'
import ModalHistory from './ModalHistory'
import ModalExcel from './ModalExcel'
import ModalRefuse from './ModalRefuse'
import ModalBarcode from './ModalBarcode'
import ModalCertificate from './ModalCertificate'
import DropOption from './DropOption'
import ModalCompare from '../../components/RowTable/ModalCompare'
import ContentLayout from '../../components/ContentLayout'
import PackageSpecifica from '../../components/PackageSpecifica'
import ViewModal from '../newCredentials/share/viewModal/ViewModal'
import RefusedModal from '../newCredentials/share/refusedModal/refusedModal'
import BarCode from './barCode'
import OtherBarCode from "../purchase/barCode/otherBarcode";
const confirm = Modal.confirm
const propTypes = {
  purchase: PropTypes.object,
  loading: PropTypes.object,
  form: PropTypes.object,
  packageUnit: PropTypes.array,
  functionList: PropTypes.object,
  dispatch: PropTypes.func,
  effects: PropTypes.object
}
function Purchase({ purchase, loading, packageUnit, functionList = {}, effects, dispatch  }) {
  const {
    tabStatus,
    statistics,
    modalSelsect,
    otherCodeVisible,
    otherCodeList,
    suppliersSelect,
    tableData,
    modalInitValue,
    searchKeys,
    pageConfig,
    editModalVisible,
    excelModalVisible,
    importButtonStatus,
    scheduleList,
    scheduleModalVisible,
    excelPageConfig,
    codeMust,
    modalType,
    packageModalVisible,
    packageList,
    tableIdArr,
    historyModalVisible,
    historyPagination,
    checkedHistoryArr,
    historyList,
    compareModalVisible,
    versionDoubleList,
    changeArr,
    tableKey,
    selectArr = [],
    refuseModalVisible,
    refuseModalData,
    compareModalType,
    barcodeVisible,
    barcodeList,
    certificateVisible,
    certificateData,
    viewModalVisible, // 审核弹框visible
    certificateDetail, // 证件审核详情
    selectedRowData,
    refusedReasonVisible, // 拒绝原因弹框
    refusedReasonList, // 拒绝原因
    codeBarVisible, // 之后追加 jarmey
    codeBarList,
    rowSelectData,
    customerId,
    supplierOrgId
  } = purchase

  // 维护条码
  const BarCodeProps = {
    dispatch,
    effects,
    codeBarVisible,
    codeBarList,
    rowSelectData,
    customerId,
    supplierOrgId
  }

  const funcButtonList = functionList['/purchase'] || [] // 功能按钮数组
  const addButton = funcButtonList.includes('addPurchaseCatalog')
  const batchButton = funcButtonList.includes('batchViewPurchaseCatalog')
  const editButton = funcButtonList.includes('updatePurchaseCatalog')
  const stopButton = funcButtonList.includes('stopPurchaseCatalog')
  const { toAction, getLoading, dispatchUrl, dispatchAction } = getBasicFn({
    namespace: 'purchase',
    loading,
  })
  const pageChange = (current, pageSize) => {
    if (tabStatus === 'pendingReview' && !verify(selectArr, changeArr)) {
      return false
    }
    toAction(
      {
        ...searchKeys,
        current,
        pageSize,
      },
      'suppliers',
    )
  }
  const tableProps = {
    className: 'aek-table-shadow',
    key: tableKey,
    // loading: getLoading('suppliers'),
    dataSource: addOrder(tableData || []),
    pagination: getPagination(pageChange, pageConfig),
    rowKey: 'pscId',
    bordered: true,
    rowSelection:
      tabStatus === 'refused'
        ? undefined
        : {
          type: 'checkbox',
          selectedRowKeys: tableIdArr,
          onChange: (selectedRowKeys, selectedRows) => {
            toAction({ tableIdArr: selectedRowKeys })
            if (tabStatus === 'pendingReview') {
              toAction({
                selectArr: selectedRows.map(
                  ({ pscId, changeType, price, materialsCommenName, inviteType, inviteNo, materialsUnit, materialsUnitText }) => ({
                    pscId,
                    changeType,
                    price,
                    materialsCommenName,
                    inviteType,
                    inviteNo,
                    materialsUnit,
                    materialsUnitText,
                  }),
                ),
                refuseModalData: selectedRows.map(
                  ({ pscId, changeType, supplierOrgId, materialsSku, materialsName }) => ({
                    supplierOrgId,
                    pscId,
                    materialsSku,
                    materialsName,
                    changeTypeStr: { 1: '新增', 2: '修改' }[changeType],
                  }),
                ),
              })
            }
          },
        },
    columns: getColumns(tabStatus, {
      tabStatus,
      editContact(initValue) {
        toAction('app/getPackageUnit')
        toAction({ keywords: null }, 'suppliersSelect')
        toAction({
          modalType: 'edit',
          editModalVisible: true,
          modalInitValue: initValue,
        })
      },
      more(key, rowData) {
        switch (key) {
          case 'maintain':
            toAction('app/getPackageUnit')
            toAction(
              {
                pscId: rowData.pscId,
                useType: ['inUse', 'disabled'].includes(tabStatus) & 1,
              },
              'viewPackage',
            )
            break
          case 'stop':
            confirm({
              content: `您确定要${tabStatus === 'inUse' ? '停用' : '启用'}该物料？`,
              onOk() {
                toAction(
                  {
                    pscIds: [rowData.pscId],
                    pscStatus: ((tabStatus === 'inUse') & 1) + 1,
                  },
                  'batchUpdate',
                )
              },
            })
            break
          case 'history':
            toAction(
              {
                historyModalVisible: true,
                historyPagination: { pscId: rowData.pscId },
              },
              true,
            )
            toAction(
              {
                pscId: rowData.pscId,
                current: 1,
                pageSize: 10,
              },
              'historys',
            )
            break
          default:
            break
        }
      },
      itemChange(changeItem) {
        if (
          getTreeItem(changeArr, 'pscId', changeItem.pscId, item => ({ ...item, ...changeItem }))
        ) {
          toAction({ changeArr })
        } else {
          changeArr.push(changeItem)
          toAction({ changeArr })
        }
        if (
          getTreeItem(tableData, 'pscId', changeItem.pscId, item => ({ ...item, ...changeItem }))
        ) {
          toAction({ tableData })
        }
      },
      batchReceive(data) {
        confirm({
          content: '您确定接受所选物料？',
          onOk() {
            const req = verify(data, changeArr)
            if (req) {
              toAction({ data: req }, 'batchReceive')
            }
          },
        })
      },
      batchRefuse(data) {
        toAction({
          refuseModalVisible: true,
          refuseModalData: [data],
        })
        dispatchAction({
          type: 'getRefusedReason',
          payload: {
            dicKey: 'PURCHASEREFUSEREASON',
          },
        })
      },
      seeChange(pscId) {
        toAction({ compareModalVisible: true })
        toAction({ pscId }, 'seeChange')
      },
      showBarcode(pscId) {
        toAction({ barcodeVisible: true })
        toAction({ pscId }, 'checkBarcode')
      },
      showCerticafite(certificateId, supplierOrgId) {
        toAction({ certificateVisible: true })
        toAction({ certificateId, supplierOrgId }, 'checkCertificate')
      },
      editButton,
      stopButton,
      changeAndSelectArr: [],
      showCerticaAudit(data) {
        dispatchAction({
          payload: {
            viewModalVisible: true,
            selectedRowData: data,
          },
        })
        dispatchAction({
          type: 'getCertificateDetail',
          payload: data,
        })
      },
    }),
  }
  const modalEditMaterialProps = {
    loading: getLoading('addMaterial', 'updateMaterial'),
    editModalVisible,
    modalInitValue,
    codeMust,
    packageUnit,
    modalType,
    toAction,
    suppliersSelect,
  }
  const modalExcelProps = {
    loading: getLoading('excelInput'),
    importButtonStatus,
    excelModalVisible,
    toAction,
  }
  const modalHistoryProps = {
    historyModalVisible,
    toAction,
    loading: getLoading('historys'),
    historyPagination,
    historyList,
    checkedHistoryArr,
  }
  const modalCompareProps = {
    compareModalVisible,
    rows: compareModalType !== 'seeChange' ? undefined : rowsColumns,
    loading: getLoading('historysDetail', 'historysCompare', 'seeChange'),
    dataSource: versionDoubleList,
    titleRender:
      compareModalType !== 'seeChange'
        ? undefined
        : ({ status }) => ({ 1: '使用中', 2: '待审核' }[status]),
    title: compareModalType !== 'seeChange' ? undefined : '查看对比',
    onCancel() {
      toAction({
        compareModalVisible: false,
      })
    },
  }
  const modalExcelSchedulProps = {
    scheduleList,
    excelPageConfig,
    loading: getLoading('excelSchedule'),
    scheduleModalVisible,
    toAction,
  }
  const modalRefuseProps = {
    loading: getLoading('batchRefuse'),
    refusedReasonList,
    refuseModalVisible,
    refuseModalData,
    toAction,
    onCancel() {
      toAction({ refuseModalVisible: false })
    },
  }
  const modalBarcodeProps = {
    loading: getLoading('checkBarcode'),
    barcodeVisible,
    barcodeList,
    toAction,
    onCancel() {
      toAction({ barcodeVisible: false })
    },
  }
  const modalCertificateProps = {
    loading: getLoading('checkCertificate'),
    certificateVisible,
    certificateData,
    toAction,
    onCancel() {
      toAction({ certificateVisible: false })
    },
  }
  const packageParam = {
    modalVisible: packageModalVisible,
    packageUnit, // 包装规格所有单位
    packageList: packageList.data, // 渲染表格数据
    handleModalCancel() {
      toAction({ packageModalVisible: false })
    },
    handleModalOk(list) {
      toAction({ ...packageList, data: list }, 'editPackage')
    },
    loading: getLoading('viewPackage'),
  }
  const getTabPane = () => {
    const tabArr = ['使用中', '待审核', '已拒绝', '已停用']
    const keyArr = ['inUse', 'pendingReview', 'refused', 'disabled']
    const num = keyArr.map(_ => statistics[`${_}Number`] || 0)
    return tabArr.map((item, index) => (
      <Tabs.TabPane tab={getTabName(item, num[index])} key={keyArr[index]} />
    ))
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
        dispatchUrl({ pathname: '/purchase/addForDic' })
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
  const modalSelsectProps = {
    visible: modalSelsect,
    menuClick,
    onCancel() {
      toAction({ modalSelsect: false })
    },
  }
  // 绑定其他物资的条码
  const otherBarcodeProps = {
    dispatch,
    effects,
    otherCodeVisible,
    otherCodeList,
    rowSelectData,
  }
  const getBatchButton = () => {
    if (tabStatus === 'refused') {
      return undefined
    }
    const flag = !!tableIdArr.length
    const btn = (
      <Button
        type="primary"
        disabled={!flag}
        children={flag ? `批量操作(${tableIdArr.length})` : '批量操作'}
      />
    )
    return !flag ? (
      btn
    ) : (
      <DropOption
        onMenuClick={(key) => {
          switch (key) {
            case 'stop':
              confirm({
                content: '您确定要停用所选物料？',
                onOk() {
                  toAction(
                    {
                      pscIds: tableIdArr,
                      pscStatus: 2,
                    },
                    'batchUpdate',
                  )
                },
              })
              break
            case 'inUse':
              confirm({
                content: '您确定要启用所选物料？',
                onOk() {
                  toAction(
                    {
                      pscIds: tableIdArr,
                      pscStatus: 1,
                    },
                    'batchUpdate',
                  )
                },
              })
              break
            case 'receive':
              confirm({
                content: '您确定接受用所选物料？',
                onOk() {
                  const req = verify(selectArr, changeArr)
                  if (req) {
                    toAction({ data: req }, 'batchReceive')
                  }
                },
              })
              break
            case 'refuse':
              toAction({ refuseModalVisible: true })
              dispatchAction({
                type: 'getRefusedReason',
                payload: {
                  dicKey: 'PURCHASEREFUSEREASON',
                },
              })
              break
            case 'clear':
              toAction({
                tableIdArr: [],
                selectArr: [],
                refuseModalData: [],
              })
              break
            default:
              break
          }
        }}
        menuOptions={
          tableIdArr.length
            ? {
              inUse: { stop: '停用', clear: '取消选择' },
              disabled: { inUse: '启用', clear: '取消选择' },
              pendingReview: {
                receive: '接受',
                refuse: '拒绝',
                clear: '取消选择',
              },
            }[tabStatus]
            : []
        }
      >
        {btn}
      </DropOption>
    )
  }
  const returnButton = () => {
    const arr = []
    if (true) {
      const button = getBatchButton()
      arr.push(button)
    }
    if (true) {
      arr.push(<Dropdown.Button
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
            <Menu.Item key="get">从平台标准数据中拉取</Menu.Item>
            <Menu.Item key="excelInput">EXCEL导入</Menu.Item>
            <Menu.Item key="schedule">EXCEL导入进度</Menu.Item>
          </Menu>
        }
      >
        添加物料
      </Dropdown.Button>)
    }
    return arr
  }


  const callback = () => {
    dispatchAction({
      payload: {
        viewModalVisible: false,
        refusedReasonVisible: false,
      },
    })
    dispatchAction({
      type: 'suppliers',
    })
    dispatchAction({ type: 'statistics' })
  }

  const viewModalProps = {
    viewType: 'approve',
    visible: viewModalVisible,
    certificateList: certificateDetail.certificates || [],
    refuseReason: certificateDetail.refuseReason || '',
    certificateNo: certificateDetail.certificateNo || '',
    productName: certificateDetail.productName || '',
    certificatePlace: certificateDetail.certificatePlace || '',
    loading: getLoading('getCertificateDetail', 'setPast'),
    approveHandler(position) {
      // 通过事件
      dispatchAction({
        type: 'setPast',
        payload: {
          supplierOrgId: selectedRowData.supplierOrgId,
          certificateIds: [selectedRowData.certificateId],
          certificatePlace: position,
          callback,
        },
      })
    },
    refuseHandler() {
      // 拒绝事件
      dispatchAction({
        payload: {
          refusedReasonVisible: true,
        },
      })
      dispatchAction({
        type: 'getRefusedReason',
        payload: {
          dicKey: 'REFUSEREASON',
        },
      })
    },
    onCancel() {
      dispatchAction({
        payload: {
          viewModalVisible: false,
          selectedRowData: {}, // 关闭需将其置空，否则拒绝时不知道取selectedRowData还是selectedRowKeys
        },
      })
    },
  }
  // 拒绝原因弹框
  const refusedModalProps = {
    loading: getLoading('getRefusedReason', 'setRefused'),
    handleCancel() {
      dispatchAction({
        payload: {
          refusedReasonVisible: false,
        },
      })
    },
    handleOk(value) {
      dispatchAction({
        type: 'setRefused',
        payload: {
          supplierOrgId: selectedRowData.supplierOrgId,
          reason: value.refuseReason || '未填写原因',
          certificateIds: [selectedRowData.certificateId],
          callback,
        },
      })
    },
    refusedReasonVisible,
    refusedReasonList,
  }

  const contentLayoutProps = {
    breadLeft: [{ name: 'Breadcrumb' }],
    // breadRight: returnButton(),
    content: (
      <span>
        <Spin spinning={getLoading('suppliers')}>
          <Tabs
            activeKey={tabStatus}
            style={{ marginBottom: 6 }}
            onChange={(key) => {
              toAction('statistics')
              toAction({
                tabStatus: key,
                suppliersSelect: [],
                tableData: [],
                tableIdArr: [],
                changeArr: [],
                selectArr: [],
                refuseModalData: [],
                searchKeys: {
                  current: 1,
                  pageSize: 10,
                },
              })
              toAction({ current: 1, pageSize: 10 }, 'suppliers')
              toAction({ keywords: null }, 'suppliersSelect')
            }}
          >
            {getTabPane()}
          </Tabs>
          <AdvancedSearchForm
            key={tabStatus}
            formData={getFormData(tabStatus, {
              suppliersSelect,
              onSearch(keywords) {
                toAction({ keywords }, 'suppliersSelect')
              },
            })}
            loading={getLoading('suppliers')}
            onSearch={(value) => {
              toAction({
                changeArr: [],
                tableIdArr: [],
                selectArr: [],
                refuseModalData: [],
                tableKey: Math.random(),
              })
              toAction(
                {
                  current: 1,
                  pageSize: 10,
                  ...value,
                },
                'suppliers',
              )
            }}
          />
          <Table {...tableProps} />
        </Spin>
        <ModalEditMaterial {...modalEditMaterialProps} />
        <ModalSelsect {...modalSelsectProps} />
        <ModalExcel {...modalExcelProps} />
        <ModalExcelSchedule {...modalExcelSchedulProps} />
        <ModalHistory {...modalHistoryProps} />
        <ModalCompare {...modalCompareProps} />
        <PackageSpecifica {...packageParam} />
        <ModalRefuse {...modalRefuseProps} />
        <ModalBarcode {...modalBarcodeProps} />
        <ModalCertificate {...modalCertificateProps} />
        <ViewModal {...viewModalProps} />
        <RefusedModal {...refusedModalProps} />
        <BarCode {...BarCodeProps} />
        <OtherBarCode {...otherBarcodeProps} />
      </span>
    ),
  }
  return <ContentLayout {...contentLayoutProps} />
}
Purchase.propTypes = propTypes
export default connect(
  ({ purchase, loading, app: { constants: { packageUnit }, functionList } }) => ({
    purchase,
    loading,
    packageUnit,
    functionList,
  }),
)(Purchase)
