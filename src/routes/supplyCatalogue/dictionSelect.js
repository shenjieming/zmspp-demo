import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { debounce, isEmpty, cloneDeep } from 'lodash'
import { Select, Input, Table, TreeSelect, Alert, Modal, Button, Checkbox } from 'antd'
import Breadcrumb from '../../components/Breadcrumb'
import SearchForm from '../../components/SearchFormFilter'
import AddModal from './addCatalog'
import BatchAddModal from './batchAddCatalog'
import { IMPORT_TEMPLATE_URL } from '../../utils/constant'
import { getBasicFn } from '../../utils'

const Option = Select.Option
const namespace = 'dictionSelect'

function DictionSelect({
  dictionSelect,
  effects,
  dispatch,
  routes,
  accuracy,
  accuracyDecimal,
  packageUnit,
}) {
  const {
    customerId,
    searchData,
    dataSource,
    pagination,
    rowData,
    addModalVisible,
    inviteRequired,
    categoryList,
    factoryList = [],
    selectedRowKeys,
    selectedRows,
    batchAddModalVisible,
    branOptionList,

    allCheck,

  } = dictionSelect

  const { dispatchAction } = getBasicFn({ namespace })


  // 厂家搜索
  const factorySearch = (value) => {
    dispatch({
      type: 'dictionSelect/getFactoryList',
      payload: {
        keywords: value,
      },
    })
  }
  const factoryDebounce = debounce(factorySearch, 500)
  // 搜索条件
  const searchformPorps = {
    formData: [
      {
        field: 'categoryId',
        component: (
          <TreeSelect
            placeholder="请选择分类"
            treeData={categoryList}
            showSearch
            allowClear
            dropdownMatchSelectWidth={false}
            dropdownStyle={{
              height: '400px',
            }}
          />
        ),
      },
      {
        field: 'factoryId',
        component: (
          <Select
            placeholder="请选择厂家"
            onSearch={factoryDebounce}
            showSearch
            allowClear
            filterOption={false}
            optionFilterProp="children"
            labelInValue
          >
            {factoryList.map(item => (
              <Option key={item.factoryId} label={item.factoryName} value={`${item.factoryId}`}>
                {item.factoryName}
              </Option>
            ))}
          </Select>
        ),
      },
      {
        field: 'certificateId',
        width: 220,
        component: {
          name: 'LkcSelect',
          props: {
            url: '/materials/register/certificate/option/list',
            optionConfig: { idStr: 'certificateId', nameStr: 'certificateNo' },
            placeholder: '请选择注册证',
          },
        },
      },
      {
        field: 'materialsKeywords',
        component: <Input placeholder="物资名称/拼音" />,
      },
      {
        field: 'skuKeywords',
        component: <Input placeholder="规格型号/通用名称" />,
      },
    ],
    onSearch: (value) => {
      const reqData = value
      if (!isEmpty(reqData) && !isEmpty(reqData.certificateId)) {
        reqData.certificateId = reqData.certificateId.key
      }
      if (!isEmpty(reqData) && !isEmpty(reqData.factoryId)) {
        reqData.factoryId = reqData.factoryId.key
      }
      dispatch({
        type: 'dictionSelect/getDictionList',
        payload: {
          ...searchData,
          ...reqData,
          current: 1,
          pageSize: 10,
          customerOrgId: customerId,
        },
      })
      dispatchAction({
        payload: {
          allCheck: false,
          selectedRowKeys: [],
          selectedRows: [],
        },
      })
    },
  }

  const Title = () => (<Checkbox
    onChange={(even) => {
      const checked = even.target.checked
      let data = []
      if (checked) {
        data = cloneDeep(dataSource).filter((item) => {
          if (item.catalogFlag === 0) {
            return true
          }
          return false
        })
      }
      dispatchAction({
        payload: {
          selectedRowKeys: data.map(items => items.materialsSkuId),
          selectedRows: data,
          allCheck: checked,
        },
      })
    }}
    checked={allCheck}
  />)

  // 平台字典列表
  const columns = [
    {
      key: 'checked',
      dataIndex: 'checked',
      title: Title(),
      width: 40,
      className: 'aek-text-center',
      render(_, record) {
        const { materialsSkuId, catalogFlag } = record
        return (
          <Checkbox
            onClick={(even) => {
              const checked = even.target.checked
              const keys = cloneDeep(selectedRowKeys)
              const data = cloneDeep(selectedRows)
              if (checked) {
                keys.push(materialsSkuId)
                data.push(record)
                dispatchAction({
                  payload: {
                    selectedRowKeys: keys,
                    selectedRows: data,
                  },
                })
              } else {
                const keysArr = keys.filter((item) => {
                  if (item === materialsSkuId) {
                    return false
                  }
                  return true
                })
                const rowArr = data.filter((item) => {
                  const { materialsSkuId: id } = item
                  if (id === materialsSkuId) {
                    return false
                  }
                  return true
                })
                dispatchAction({
                  payload: {
                    selectedRowKeys: keysArr,
                    selectedRows: rowArr,
                  },
                })
              }
            }}
            checked={selectedRowKeys.indexOf(materialsSkuId) > -1}
            disabled={catalogFlag !== 0}
          />
        )
      },
    },
    {
      key: 'materialsName',
      dataIndex: 'materialsName',
      title: '物资名称',
    },
    {
      key: 'materialsSku',
      dataIndex: 'materialsSku',
      title: '规格型号',
    },
    {
      key: 'materialsUnitText',
      dataIndex: 'materialsUnitText',
      title: '单位',
    },
    {
      key: 'factoryName',
      dataIndex: 'factoryName',
      title: '厂家',
    },
    {
      title: '注册证',
      key: 'certificateNo',
      dataIndex: 'certificateNo',
    },
    {
      key: 'operation',
      dataIndex: 'operation',
      title: '操作',
      width: 100,
      className: 'aek-text-center',
      render: (value, record) => {
        // 未加入目录
        if (record.catalogFlag === 0) {
          return (
            <a
              onClick={() => {
                const reqData = record.certificateId && record.certificateNo ? [{
                  certificateId: record.certificateId,
                  certificateNo: record.certificateNo,
                }] : []
                dispatch({
                  type: 'dictionSelect/materialsCheck',
                  payload: {
                    customerOrgId: customerId,
                    certificates: reqData,
                  },
                }).then((data) => {
                  if (data && Object.keys(data).length && data.tipFlag) {
                    const certificateNos = data.certificateNos.join()
                    Modal.confirm({
                      title: '温馨提示',
                      content: `因为“${data.customerOrgName}”在零库存采购平台管理证件，
                        ${certificateNos}的物料无法添加，请先前往证件档案管理中心维护这些注册证，并推送给客户！`,
                      onOk() {
                        dispatch(routerRedux.push('/newCredentials/newMyCertificate?index=2'))
                      },
                    })
                  } else {
                    dispatch({
                      type: 'app/getPackageUnit',
                    })
                    dispatch({
                      type: 'dictionSelect/updateState',
                      payload: {
                        addModalVisible: true,
                        rowData: record,
                        inviteRequired: false,
                      },
                    })
                  }
                })
              }}
            >
              加入目录
            </a>
          )
        }
        return '已加入'
      },
    },
  ]
  // 翻页
  const handeChange = (value) => {
    dispatch({
      type: 'dictionSelect/getDictionList',
      payload: {
        ...searchData,
        ...value,
      },
    })
    dispatchAction({
      payload: {
        allCheck: false,
        selectedRowKeys: [],
        selectedRows: [],
      },
    })
  }

  // 复选框
  const selectProps = {
    selectedRowKeys,
    onChange(keys, rows) {
      dispatch({
        type: 'dictionSelect/updateState',
        payload: {
          selectedRowKeys: keys,
          selectedRows: rows,
        },
      })
    },
  }

  // 品牌异步搜索
  const onSearchBrandListFun = debounce((val) => {
    dispatchAction({
      type: 'getBrandList',
      payload: {
        keywords: val,
      },
    })
  }, 500)

  // 加入目录
  const addModalProps = {
    effects,
    dispatch,
    rowData,
    addModalVisible,
    accuracy,
    inviteRequired,
    accuracyDecimal,
    packageUnit,
    branOptionList,
    onSearchBrandListFun,
    customerId,
  }
  // 批量加入目录
  const batchAddModalProps = {
    effects,
    dispatch,
    batchAddModalVisible,
    packageUnit,
    batchDataList: selectedRows,
    modalType: 1,
    handleBack() {
      dispatchAction({
        payload: {
          batchAddModalVisible: false,
          rowData: {},
        },
      })
    }, // 返回
    handleSave(data) {
      dispatchAction({
        type: 'saveToPush',
        payload: {
          customerOrgId: customerId,
          materials: data,
        },
      }).then(() => {
        dispatchAction({
          payload: {
            selectedRowKeys: [],
            selectedRows: [],
            batchAddModalVisible: false,
          },
        })
      })
    }, // 保存至待推送
    handlePush(data) {
      dispatchAction({
        type: 'pushToExamine',
        payload: {
          customerOrgId: customerId,
          materials: data,
        },
      }).then(() => {
        dispatchAction({
          payload: {
            selectedRowKeys: [],
            selectedRows: [],
            batchAddModalVisible: false,
          },
        })
      })
    }, // 推送审核
    // branOptionList,
    // onSearchBrandListFun,
    // onSelectChange(data) {
    //   dispatchAction({
    //     payload: {
    //       selectedRows: data,
    //     },
    //   })
    // },
  }
  return (
    <div className="aek-layout">
      <div className="bread">
        <div style={{ float: 'left' }}>
          <Breadcrumb routes={routes} />
        </div>
        <div style={{ float: 'right' }}>
          <Button
            type="primary"
            disabled={!selectedRowKeys.length}
            onClick={() => {
              dispatch({
                type: 'dictionSelect/materialsCheck',
                payload: {
                  customerOrgId: customerId,
                  certificates: selectedRows.filter((item) => {
                    if (item.certificateId) {
                      return true
                    }
                    return false
                  }),
                },
              }).then((data) => {
                if (data && Object.keys(data).length && data.tipFlag) {
                  const certificateNos = data.certificateNos.join()
                  Modal.confirm({
                    title: '温馨提示',
                    content: `因为“${data.customerOrgName}”在零库存采购平台管理证件，
                      ${certificateNos}的物料无法添加，请先前往证件档案管理中心维护这些注册证，并推送给客户！`,
                    onOk() {
                      dispatch(routerRedux.push('/newCredentials/newMyCertificate?index=2'))
                    },
                  })
                } else {
                  dispatch({
                    type: 'app/getPackageUnit',
                  })
                  dispatchAction({
                    payload: {
                      batchAddModalVisible: true,
                    },
                  })
                }
              })
            }}
          >批量加入目录</Button>
        </div>
      </div>
      <div className="content">
        <SearchForm {...searchformPorps} />
        {/*<Alert*/}
          {/*type="info"*/}
          {/*message={*/}
            {/*<span>*/}
              {/*如果没有找到需要的物料，有注册证、备案证、消毒证的物资请联系客服添加，其他物资请*/}
              {/*<a className="aek-link" onClick={() => { window.open(IMPORT_TEMPLATE_URL) }}>点击此处下载模板</a>*/}
              {/*维护好后联系客服添加*/}
            {/*</span>*/}
          {/*}*/}
          {/*showIcon*/}
          {/*className="aek-mb10"*/}
        {/*/>*/}
        <Table
          // rowSelection={selectProps}
          columns={columns}
          bordered
          dataSource={dataSource}
          pagination={{ ...pagination, showSizeChanger: false }}
          onChange={handeChange}
          rowKey="materialsSkuId"
          loading={!!effects['dictionSelect/getDictionList']}

        />
      </div>
      <AddModal {...addModalProps} />
      {batchAddModalVisible && <BatchAddModal {...batchAddModalProps} />}
    </div>
  )
}

DictionSelect.propTypes = {
  dictionSelect: PropTypes.object,
  effects: PropTypes.object,
  dispatch: PropTypes.func,
  routes: PropTypes.array,
  children: PropTypes.element,
  accuracy: PropTypes.any,
  accuracyDecimal: PropTypes.any,
  packageUnit: PropTypes.array,
}

export default connect(
  ({ dictionSelect, loading: { effects }, app: {
    orgInfo: {
      accuracy,
      accuracyDecimal,
    },
    constants: {
      packageUnit,
    },
  } }) => ({
    dictionSelect,
    effects,
    accuracy,
    accuracyDecimal,
    packageUnit,
  }),
)(DictionSelect)
