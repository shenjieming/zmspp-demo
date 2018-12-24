import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Dropdown, Button, Icon, Table, Menu, Modal } from 'antd'

import { getBasicFn } from '../../../utils/index'
import Breadcrumb from '../../../components/Breadcrumb'
import SearchFormFilter from '../../../components/SearchFormFilter'
import { getSearchProps, getTableColumns } from './props'
import AddBrandModal from './addModal/'
import EditBrandModal from './editModal/'
import { debounce } from 'lodash'

const propTypes = {
  brand: PropTypes.object,
  routes: PropTypes.array,
  loading: PropTypes.object,
}
const { confirm } = Modal
const namespace = 'brand'
const Brand = ({ brand, routes, loading }) => {
  const {
    brandList,
    searchingFactory,
    factoryList,
    currentBrandDetail,
    pagination,
    searchParam,
    addModalVisible,
    editModalVisible,
    checkedArr,
  } = brand
  const { dispatchAction, getLoading } = getBasicFn({ namespace, loading })
  const getFactorys = (value) => {
    if (value.trim()) {
      dispatchAction({
        type: 'getFactoryList', payload: { keywords: value },
      })
    }
  }
  const factoryChangeHandler = debounce(getFactorys, 300)
  // 显示隐藏添加modal
  const showAddModal = () => {
    dispatchAction({
      payload: {
        addModalVisible: true,
      },
    })
  }
  const hideAddModal = () => {
    dispatchAction({
      payload: {
        addModalVisible: false,
      },
    })
  }
  // 显示隐藏编辑按钮
  const showEditModal = (brandId) => {
    dispatchAction({ payload: { editModalVisible: true } })
    dispatchAction({
      type: 'loadDetail', payload: { brandId },
    })
  }
  const hideEditModal = () => {
    dispatchAction({
      payload: {
        editModalVisible: false,
      },
    })
  }
  // 新增提交
  const saveHandler = ({ values }) => {
    let brandNames = values.brandNames
    const brandArr = brandNames.split('\n')
    for (let i = 0; i < brandArr.length; i++) {
      if (!brandArr[i].trim()) {
        brandArr.splice(i, 1)
        i--
      } else {
        brandArr[i] = brandArr[i].trim()
      }
    }
    brandNames = brandArr.toString()
    console.dir(values)
    dispatchAction({
      type: 'addBrand',
      payload: {
        produceFactoryId: values.produceFactoryId && values.produceFactoryId.key,
        brandNames,
      },
    })
  }
  // 编辑提交
  const updateHandler = (value) => {
    dispatchAction({
      type: 'editBrand',
      payload: { ...value, brandId: currentBrandDetail.brandId },
    })
  }
  // 停用/启用品牌
  const updateSingleBrandStatus = (brandId, brandStatus) => {
    confirm({
      content: !brandStatus ? '确定要启用吗？' : '确定要停用吗？',
      onOk() {
        dispatchAction({
          type: 'updateSingleState',
          payload: { brandId, brandStatus },
        })
      },
    })
  }
  // 批量停用/启用品牌
  const updateBatchBrandStatus = (e) => {
    const key = Number(e.key)
    confirm({
      content: !key ? '确定要全部启用吗？' : '确定要全部停用吗？',
      onOk() {
        dispatchAction({
          type: 'updateBatchStates',
          payload: { brandIds: checkedArr.toString(), brandStatus: !!key },
        })
      },
    })
  }
  // 搜索操作
  const searchHandler = (value) => {
    value.produceFactoryId = value.produceFactoryId && value.produceFactoryId.key
    dispatchAction({
      type: 'filterData',
      payload: { ...value },
    })
  }
  // 翻页操作
  const pageChange = (page) => {
    dispatchAction({
      type: 'pageChange',
      payload: { ...page },
    })
  }
  // 批量操作相关
  const rowSelection = {
    onChange: (selectedRowKeys) => {
      dispatchAction({
        payload: {
          checkedArr: selectedRowKeys,
        },
      })
    },
    selectedRowKeys: checkedArr,
    getCheckboxProps: record => ({
      disabled: record.status === 1,
    }),
  }
  const menu = (
    <Menu onClick={updateBatchBrandStatus}>
      <Menu.Item key="1">停用</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="0">启用</Menu.Item>
    </Menu>
  )
  // table参数
  const tableParams = {
    loading: getLoading('getNoFilterData', 'filterData', 'pageChange', 'searchCurrentParam'),
    rowKey: 'brandId',
    rowSelection,
    columns: getTableColumns({ showEditModal, updateSingleBrandStatus }),
    dataSource: brandList,
    pagination: {
      ...pagination,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
    },
    rowClassName: ({ brandStatus }) => {
      if (brandStatus) {
        return 'aek-text-disable'
      }
      return ''
    },
    onChange: pageChange,
  }
  // 添加modal参数
  const addModalParam = {
    title: '新增厂家品牌',
    visible: addModalVisible,
    onHide: hideAddModal,
    onOk: saveHandler,
    onSearch: factoryChangeHandler,
    factoryList,
  }
  // 编辑modal参数
  const editModalParam = {
    title: '编辑厂家品牌',
    visible: editModalVisible,
    onHide: hideEditModal,
    onOk: updateHandler,
    getLoading,
    currentBrandDetail,
  }
  return (
    <div className="aek-layout">
      <div className="bread">
        <div style={{ display: 'inline-block' }}>
          <Breadcrumb routes={routes} />
        </div>
        <div className="aek-fr">
          <Dropdown disabled={checkedArr.length === 0} overlay={menu} trigger={['click']}>
            <Button style={{ marginRight: 15 }}>
              批量操作<Icon type="down" />
            </Button>
          </Dropdown>
          <Button icon="plus" onClick={showAddModal} type="primary">新增</Button>
        </div>
      </div>
      <div className="content">
        <SearchFormFilter
          components={getSearchProps({ searchParam, factoryList, factoryChangeHandler, searchingFactory })}
          onSearch={searchHandler}
        />
        <Table bordered {...tableParams} />
        <AddBrandModal {...addModalParam} />
        <EditBrandModal {...editModalParam} />
      </div>
    </div>
  )
}

Brand.propTypes = propTypes

export default connect(({ brand, loading }) => ({ brand, loading }))(Brand)
