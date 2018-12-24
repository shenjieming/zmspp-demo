import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { get, debounce, isEmpty } from 'lodash'
import { Table, Button, Modal, Spin, message } from 'antd'
import Bread from '../../../components/Breadcrumb'
import SearchForm from '../../../components/SearchFormFilter'
import scrollToTop from '../../../components/LkcForm/scrollToTop'
import { getSearchParams, getBarcodeColumns } from './props'
import { getBasicFn, getPagination } from '../../../utils/'
import AddModal from './AddModal'
import TestModal from './TestModal'
import BarcodeModal from './BarcodeModal'
import Version from './Version'
import Detail from './DetailModal'
import ResolveModal from './ResolveModal'

const propTypes = {
  barcode: PropTypes.object.isRequired,
  app: PropTypes.object.isRequired,
  loading: PropTypes.object.isRequired,
}

const namespace = 'barcode'

function Barcode({ barcode, loading, app }) {
  const { dispatchAction, getLoading } = getBasicFn({ namespace, loading })

  const permissionList = app.functionList['/materials/barcode'] || [] // 功能按钮数组
  const addPermission = permissionList.includes('addBarcode')
  const editPermission = permissionList.includes('editBarcode')
  const approvePermission = permissionList.includes('approveBarcode')
  const searchFormComponents = getSearchParams({
    supplierData: barcode.supplierData,
    handleSupplierSearch: debounce((payload) => {
      dispatchAction({ type: 'getSupplierData', payload })
    }, 400),
    factoryData: barcode.factoryData,
    handleFactorySearch: debounce((payload) => {
      dispatchAction({ type: 'getFactoryData', payload })
    }, 400),
  })

  const { editSupplierData, editFactoryData } = barcode

  const barcodeTableLoading = getLoading('getBarcodeTable')

  const searchFormProps = {
    components: searchFormComponents,
    onSearch: (payload) => {
      dispatchAction({
        type: 'barcodeTableAdvancedSearch',
        payload: {
          ...payload,
          supplierOrgId: get(payload.supplierOrgId, 'key'),
          factoryOrgId: get(payload.factoryOrgId, 'key'),
          customerOrgId: get(payload.customerOrgId, 'key'),
        },
      })
    },
    loading: barcodeTableLoading,
  }

  const barcodeTableProps = {
    pagination: getPagination((current, pageSize) => {
      dispatchAction({
        type: 'getBarcodeTable',
        payload: {
          barcodeTablePagination: {
            ...barcode.barcodeTablePagination,
            current,
            pageSize,
          },
        },
      })
    }, barcode.barcodeTablePagination),
    dataSource: barcode.barcodeTableDataSource,
    bordered: true,
    loading: barcodeTableLoading,
    columns: getBarcodeColumns({
      handleAction: ({ id, key }) => {
        if (key === 'version') {
          dispatchAction({
            type: 'initialGetBarcodeVerList',
            payload: id,
          })
        } else if (key === 'edit') {
          dispatchAction({
            type: 'updateState',
            payload: { addModalVisible: true, addModalStatus: 'edit' },
          })
          dispatchAction({
            type: 'getBarcodeEditDetail',
            payload: id,
          })
        } else {
          dispatchAction({
            type: 'updateState',
            payload: { addModalVisible: true, addModalStatus: 'copy' },
          })
          dispatchAction({
            type: 'getBarcodeEditDetail',
            payload: id,
          })
        }
      },
      editPermission,
    }),
    scroll: { x: 1400 },
    rowKey: 'barcodeRuleId',
  }
  const testModalProps = {
    visible: barcode.testModalVisible,
    searchHandler: (values) => {
      if (values.barcodeParseType === '1' && isEmpty(values.customerOrgId)) {
        message.error('请选择医疗机构')
        return
      }
      values.barcode = values.barcode && values.barcode.trim()
      dispatchAction({ type: 'testBarcode', payload: values })
    },
    dataSource: barcode.testDataSource,
    onCancel: () => {
      dispatchAction({
        type: 'updateState',
        payload: { testModalVisible: false, testDataSource: [] },
      })
    },
    tableLoading: getLoading('testBarcode'),
  }
  const barcodeProps = {
    visible: barcode.barcodeModalVisible,
    loading: getLoading('testBeforeCreate'),
    onOk: barcodeExample =>
      dispatchAction({ type: 'testBeforeCreate', payload: { barcode: barcodeExample } }).then(
        () => {
          dispatchAction({
            type: 'barcodeEditChange',
            payload: { barcodeExample, barcodeLength: barcodeExample.length },
          })
        },
      ),
    onCancel: () => {
      dispatchAction({ type: 'updateState', payload: { barcodeModalVisible: false } })
    },
  }
  const addModalProps = {
    approvePermission,
    visible: barcode.addModalVisible,
    status: barcode.addModalStatus,
    supplierData: editSupplierData,
    factoryData: editFactoryData,
    handleSelectSearch: debounce((payload, key) => {
      if (key === 'supplier') {
        dispatchAction({ type: 'getEditSupplierData', payload })
      } else {
        dispatchAction({ type: 'getEditFactoryData', payload })
      }
    }, 400),
    approveHandler: (payload) => {
      scrollToTop('sourceCustomer')
      dispatchAction({
        type: 'auditBarcodeRule',
        payload: {
          ...payload,
          barcodeImageUrls: payload.barcodeImageUrls.map(x => x.value).join(),
        },
      })
    },
    saveEdit: (data, status) => {
      scrollToTop('sourceCustomer')
      const temp = {
        ...data,
        barcodeImageUrls: data.barcodeImageUrls.map(x => x.value).join(),
      }
      if (status === 'edit') {
        dispatchAction({
          type: 'saveEditBarcode',
          payload: temp,
        })
      } else {
        dispatchAction({
          type: 'saveNewBarcode',
          payload: temp,
        })
      }
    },
    onCancel: () => {
      scrollToTop('sourceCustomer')
      dispatchAction({
        type: 'updateState',
        payload: { addModalVisible: false },
      })
    },
    onAfterClose: () => {
      dispatchAction({
        type: 'barcodeReset',
      })
    },
    details: barcode.editBarcode,
    addReasonList: barcode.addReasonList,
    barcodeMakeList: barcode.barcodeMakeList,
    loading: getLoading('saveNewBarcode', 'saveEditBarcode', 'getBarcodeEditDetail'),
    handleValueChange: (payload) => {
      dispatchAction({
        type: 'barcodeEditChange',
        payload,
      })
    },
  }

  // 查看版本
  const versionProps = {
    compareClick: () => {
      dispatchAction({ type: 'versionCompare' })
    },
    visible: barcode.verListModalVisible,
    viewDetail: (row) => {
      dispatchAction({
        type: 'updateState',
        payload: { detailModalVisible: true },
      })
      dispatchAction({
        type: 'getBarcodeDetail',
        payload: row.barcodeRuleVersionId,
      })
    },
    dataSource: barcode.verTableDataSource,
    onCancel: () => {
      dispatchAction({
        type: 'updateState',
        payload: {
          verListModalVisible: false,
          verTableDataSource: [],
          compareSelectedKeys: [],
        },
      })
    },
    tablePagination: barcode.verTablePagination,
    pageChange: (current, pageSize) => {
      dispatchAction({
        type: 'getBarcodeVerList',
        payload: {
          verTablePagination: {
            ...barcode.verTablePagination,
            current,
            pageSize,
          },
        },
      })
    },
    tableLoading: getLoading('getBarcodeVerList'),
    selectedKeys: barcode.compareSelectedKeys,
    selectedKeysChange: (keys) => {
      dispatchAction({
        type: 'updateState',
        payload: { compareSelectedKeys: keys.slice(-2) },
      })
    },
  }

  const detailProps = {
    visible: barcode.detailModalVisible,
    title: '查看详情',
    onCancel: () => {
      dispatchAction({
        type: 'updateState',
        payload: { detailModalVisible: false, barcodeDetail: {} },
      })
    },
    footer: null,
    width: 800,
    wrapClassName: 'aek-modal',
  }

  const compareProps = {
    visible: barcode.compareModalVisible,
    width: 1200,
    title: '版本对比',
    onCancel: () => {
      dispatchAction({
        type: 'updateState',
        payload: {
          compareModalVisible: false,
          compareBarcodeDetail: {},
        },
      })
    },
    footer: null,
    wrapClassName: 'aek-modal',
  }

  const resolveModalProps = {
    visible: barcode.resolveModalVisible,
    dataSource: barcode.resolveDataSource,
    onSearch: value =>
      dispatchAction({
        type: 'resolveBarcode',
        payload: value,
      }),
    onCancel: () => {
      dispatchAction({
        type: 'updateState',
        payload: {
          resolveModalVisible: false,
          resolveDataSource: [],
        },
      })
    },
    tableLoading: getLoading('resolveBarcode'),
  }

  return (
    <div className="aek-layout">
      <div className="bread">
        <Bread />
        <div className="aek-fr">
          <Button
            style={{ marginRight: 10 }}
            onClick={() => {
              dispatchAction({
                type: 'updateState',
                payload: {
                  testModalVisible: true,
                },
              })
            }}
          >
            条码测试
          </Button>
          <Button
            style={{ marginRight: 10 }}
            onClick={() => {
              dispatchAction({
                type: 'updateState',
                payload: {
                  resolveModalVisible: true,
                },
              })
            }}
          >
            条码解析
          </Button>
          {addPermission ? (
            <Button
              type="primary"
              icon="plus"
              onClick={() => {
                dispatchAction({ type: 'updateState', payload: { barcodeModalVisible: true } })
              }}
            >
              添加规则
            </Button>
          ) : (
            ''
          )}
        </div>
      </div>
      <div className="content">
        <SearchForm {...searchFormProps} />
        <Table {...barcodeTableProps} />
      </div>
      <TestModal {...testModalProps} />
      <BarcodeModal {...barcodeProps} />
      <AddModal {...addModalProps} />
      <Version {...versionProps} />
      <Modal {...detailProps}>
        <Spin spinning={getLoading('getBarcodeDetail')}>
          <Detail
            data={barcode.barcodeDetail}
            addReasonList={barcode.addReasonList}
            barcodeMakeList={barcode.barcodeMakeList}
          />
        </Spin>
      </Modal>
      <Modal {...compareProps}>
        <Spin spinning={getLoading('versionCompare')}>
          <Detail
            data={barcode.compareBarcodeDetail}
            addReasonList={barcode.addReasonList}
            barcodeMakeList={barcode.barcodeMakeList}
          />
        </Spin>
      </Modal>
      <ResolveModal {...resolveModalProps} />
    </div>
  )
}

Barcode.propTypes = propTypes

export default connect(({ barcode, loading, app }) => ({ barcode, loading, app }))(Barcode)
