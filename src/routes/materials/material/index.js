import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Modal, Button, Dropdown, Table, Menu } from 'antd'
import { debounce, cloneDeep } from 'lodash'
import Breadcrumb from '../../../components/Breadcrumb'
import SearchFormFilter from '../../../components/SearchFormFilter'
import { formData, advancedForm, genColumns } from './data'
import { getBasicFn, getPagination } from '../../../utils/index'
import AddMaterialModal from './addMaterialModal'
import ImportExcelModal from './importExcelModal'
import ImportScheduleModal from './importScheduleModal'
import HistoryModal from './historyModal'
import CompareModal from './compareModal'
import ViewModal from './viewModal'

const { confirm } = Modal
const namespace = 'material'
const propTypes = {
  children: PropTypes.node,
  material: PropTypes.object,
  loading: PropTypes.object,
}
function IndexPage({ material, loading }) {
  const { dispatchAction, getLoading } = getBasicFn({ namespace, loading })
  const {
    searchSaveParam,
    viewCurrentData,
    viewModalVisible,
    picLength,
    scheduleList,
    productFacId,
    produceList,
    branOptionList,
    selectRegObj,
    regOptionList,
    GoodsCategoryTreeData,
    versionDoubleList,
    compareModalVisible,
    checkedHistoryArr,
    historyList,
    historyPagination,
    historyModalVisible,
    schedulePagination,
    scheduleModalVisible,
    importButtonStatus,
    excelModalVisible,
    brandAddModalList,
    produceAddModalList,
    certAddModalList,
    certificateList,
    addModalVisible,
    addModalType,
    currentItem,
    pagination,
    materialList,
  } = material
  const genColumnsParam = {
    handleAction(e, { materialsId }) {
      const key = Number(e.key)
      if (key === 0 || key === 1) {
        confirm({
          content: !key ? '确定要启用吗？' : '确定要停用吗？',
          onOk() {
            dispatchAction({
              type: 'onOffStatus',
              payload: { materialsStatus: !!key, materialsId },
            })
          },
        })
      } else if (key === 3) {
        dispatchAction({
          type: 'getVersionList',
          payload: { materialsId },
        })
      }
    },
    addModalShow({ materialsId }) {
      dispatchAction({
        type: 'queryMaterialDetail',
        payload: { materialsId },
      })
    },
  }
  const tableParam = {
    loading: getLoading(
      'getMaterialList',
      'addMaterial',
      'editMaterialSave',
      'onOffStatus',
      'mountOnOffStatus',
    ),
    columns: genColumns(genColumnsParam),
    dataSource: materialList,
    rowClassName: ({ materialsStatus }) => {
      if (materialsStatus) {
        return 'aek-text-disable'
      }
      return ''
    },
    pagination: getPagination((current, pageSize) => {
      dispatchAction({
        type: 'getMaterialList',
        payload: { current, pageSize },
      })
    }, pagination),
    rowKey: 'materialsId',
    scroll: { x: 1150 },
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
  const addModalParam = {
    picLength,
    productFacId,
    onSearchProListFun: onSearchProListFunDelay,
    produceList,
    branOptionList,
    onSearchBrandListFun: onSearchBrandListFunDelay,
    selectRegObj,
    regOptionList,
    asyncRegList: asyncRegListDelay,
    GoodsCategoryTreeData,
    brandAddModalList,
    produceAddModalList,
    certAddModalList,
    certificateList,
    getLoading,
    dispatchAction,
    addModalVisible,
    addModalType,
    currentItem,
  }
  const importModalParam = {
    getLoading,
    importButtonStatus,
    excelModalVisible,
    dispatchAction,
  }
  const scheduleModalParam = {
    scheduleList,
    schedulePagination,
    getLoading,
    scheduleModalVisible,
    dispatchAction,
  }
  const initialValues = cloneDeep(searchSaveParam)
  const searchParam = {
    // 搜索参数
    initialValues,
    formData: formData({ regOptionList, asyncRegList: asyncRegListDelay }),
    advancedForm: advancedForm({
      regOptionList,
      asyncRegList: asyncRegListDelay,
      GoodsCategoryTreeData,
      produceList,
      onSearchProList: onSearchProListFunDelay,
    }),
    onSearch(data) {
      dispatchAction({
        payload: { searchSaveParam: data },
      })
      dispatchAction({
        type: 'getMaterialList',
        payload: { ...pagination, current: 1 },
      })
    },
  }
  const scheduleModalShow = () => {
    dispatchAction({
      type: 'importSchedule',
    })
  }
  const menu = (
    <Menu onClick={scheduleModalShow}>
      <Menu.Item key="1">导入进度</Menu.Item>
    </Menu>
  )
  const importExcel = () => {
    dispatchAction({
      payload: { excelModalVisible: true, importButtonStatus: true },
    })
  }
  const addModalShow = () => {
    dispatchAction({
      payload: {
        addModalType: 'create',
        addModalVisible: true,
        currentItem: {},
        productFacId: '',
        selectRegObj: {},
      },
    })
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
    viewCurrentData,
    viewModalVisible,
    dispatchAction,
    getLoading,
  }
  return (
    <div className="aek-layout">
      <div className="bread">
        <Breadcrumb />
        <div className="aek-fr">
          <Dropdown.Button type="primary" className="aek-mr15" onClick={importExcel} overlay={menu}>
            Excel导入
          </Dropdown.Button>
          <Button type="primary" onClick={addModalShow} icon="plus">
            新增物料
          </Button>
        </div>
      </div>
      <div className="content">
        <SearchFormFilter {...searchParam} />
        <Table bordered {...tableParam} />
        <AddMaterialModal {...addModalParam} />
        <ImportExcelModal {...importModalParam} />
        <ImportScheduleModal {...scheduleModalParam} />
        <HistoryModal {...historyModalParam} />
        <CompareModal {...compareModalParam} />
        <ViewModal {...viewModalParam} />
      </div>
    </div>
  )
}
IndexPage.propTypes = propTypes

export default connect(({ material, loading }) => ({ material, loading }))(IndexPage)
