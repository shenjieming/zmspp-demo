import React from 'react'
import PropTypes from 'prop-types'
import { Table, Button, Modal } from 'antd'
import { connect } from 'dva'
import { debounce } from 'lodash'
import { Breadcrumb, SearchFormFilter } from '../../../components'
import { getBasicFn, getPagination } from '../../../utils'
import styles from './index.less'
import { genColumns, getColumns, formData, defaultRows } from './data'
import AddSkuModal from './addSku'
import AddMaterialSkuModal from './addMaterialModal'

const namespace = 'materialCompareDetail'
const propTypes = {
  materialCompareDetail: PropTypes.object,
  app: PropTypes.object,
  loading: PropTypes.object,
}
const IndexPage = ({ materialCompareDetail, app: { constants: { packageUnit } }, loading }) => {
  const { dispatchAction, getLoading } = getBasicFn({ namespace, loading })
  const {
    selectRowId,
    addModalVisible,
    certAddModalList,
    produceAddModalList,
    brandAddModalList,
    GoodsCategoryTreeData,
    regOptionList,
    selectRegObj,
    branOptionList,
    produceList,
    productFacId,
    picLength,
    standardData,
    bringData,
    materialList,
    pagination,
    addSkuModalVisible,
    currentItem,
    addModalType,
  } = materialCompareDetail
  const tableParam = {
    loading: getLoading('queryPageList'),
    columns: genColumns(),
    dataSource: materialList,
    pagination: getPagination((current, pageSize) => {
      dispatchAction({
        type: 'queryPageList',
        payload: { current, pageSize },
      })
    }, pagination),
    rowKey: 'materialsSkuId',
    onRowClick(record) {
      const { materialsSkuId } = record
      dispatchAction({
        payload: {
          standardData: record,
          selectRowId: materialsSkuId,
        },
      })
    },
    rowClassName({ materialsSkuId }) {
      if (materialsSkuId === selectRowId) {
        return 'aek-tr-selected'
      }
      return undefined
    },
  }
  const searchParams = {
    formData: formData(),
    onSearch(data) {
      dispatchAction({
        payload: {
          searchSaveParam: data,
        },
      })
      dispatchAction({
        type: 'queryPageList',
        payload: {
          ...pagination,
          current: 1,
        },
      })
    },
  }
  // 对照表格dataSource
  const getDatasource = () => {
    const reqArr = []
    for (const obj of defaultRows) {
      const reqObj = {}
      reqObj.title = obj.title
      const render = obj.render || (_ => _)
      reqObj.contrast = render(bringData[obj.dataIndex])
      reqObj.standard = render(standardData[obj.dataIndex])
      reqArr.push(reqObj)
    }
    return reqArr
  }
  const compareTableProps = {
    columns: getColumns(),
    dataSource: getDatasource(),
    loading: !!getLoading(['getRegistDetail']),
    pagination: false,
    bordered: true,
    rowKey: (record, idx) => idx,
  }
  const addSku = () => {
    dispatchAction({
      payload: {
        addSkuModalVisible: true,
        currentSku: {},
        addModalType: 'create',
      },
    })
  }
  const addMaterialSku = () => {
    dispatchAction({
      payload: {
        addModalVisible: true,
        addModalType: 'create',
        currentItem: {},
        productFacId: '',
        selectRegObj: {},
      },
    })
  }
  const confirmCompare = () => {
    Modal.confirm({
      content: '确认对照吗？',
      onOk() {
        dispatchAction({
          type: 'confirmCompare',
        }).then(() => {
          window.history.back()
        })
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
    bringData,
    packageUnit,
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
    getLoading,
    dispatchAction,
    addModalVisible,
    addModalType,
    currentItem,
  }
  return (
    <div className="aek-layout">
      <div className="bread">
        <Breadcrumb />
      </div>
      <div className="full-content">
        <div className={styles.left}>
          <div className={styles.scroll}>
            <div className={styles.compareTitle}>对照</div>
            <div className="aek-mt20">
              <Table bordered {...compareTableProps} />
            </div>
          </div>
          <div className={styles.handleButton}>
            <Button
              type="primary"
              className={styles.buttonSpace}
              disabled={!standardData.materialsId}
              onClick={confirmCompare}
            >
              确认对照
            </Button>
            <Button
              className={styles.buttonSpace}
              onClick={addSku}
              disabled={!standardData.materialsId}
            >
              在所选物质下新增规格
            </Button>
            <Button className="aek-mt10" onClick={addMaterialSku}>
              新增物资和规格
            </Button>
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.compareTitle}>候选列表</div>
          <div className="aek-mt20">
            <SearchFormFilter {...searchParams} />
          </div>
          <Table bordered {...tableParam} />
        </div>
      </div>
      <AddSkuModal {...addSkuParam} />
      <AddMaterialSkuModal {...addModalParam} />
    </div>
  )
}

IndexPage.propTypes = propTypes
export default connect(({ materialCompareDetail, loading, app }) => ({
  materialCompareDetail,
  loading,
  app,
}))(IndexPage)
