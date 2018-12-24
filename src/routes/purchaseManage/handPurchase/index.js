import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Table, Tabs, Button } from 'antd'
import { debounce } from 'lodash'
import Decimal from 'decimal.js-light'
import { getBasicFn, getPagination, getTreeItem, formatNum } from '../../../utils'
import AdvancedSearchForm from '../../../components/SearchFormFilter/'
import { columns, formData, addOrder, cartItemColumns } from './data'
import Cart from './Cart'
import SupplierTable from './SupplierTable'
import style from './style.less'
import ContentLayout from '../../../components/ContentLayout'
import PackageSpecifica from '../../../components/PackageSpecifica'

const propTypes = {
  handPurchase: PropTypes.object,
  loading: PropTypes.object,
  form: PropTypes.object,
  packageUnit: PropTypes.array,
}
const delay = debounce((fun) => { fun() }, 500)

function HandPurchase({
  handPurchase,
  loading,
  packageUnit,
}) {
  const { tableData, searchKeys, pageConfig, tableTepy, addArr, changeArr, cartVisible, packageModalVisible, packageList, cartArr, tableIdObj, comSupplierData, supplierData, comIdArr, supplierList, selectId, disableIdArr } = handPurchase
  const { toAction, getLoading, dispatchUrl } = getBasicFn({
    namespace: 'handPurchase',
    loading,
  })
  const pageChange = (current, pageSize) => {
    toAction({
      ...searchKeys,
      current,
      pageSize,
    }, 'getList')
  }

  const changeUpdate = (obj) => {
    if (!getTreeItem(changeArr, 'pscId', obj.pscId, item => ({ ...item, ...obj }))) {
      changeArr.push(obj)
    }
    toAction({ changeArr })
  }

  const tableProps = {
    loading: getLoading('getList'),
    dataSource: addOrder(tableData || []),
    pagination: getPagination(pageChange, pageConfig),
    rowKey: 'pscId',
    bordered: true,
    rowClassName: () => 'table-hover',
    columns: columns({
      selectId,
      addArr,
      changeArr,
      packChange(changeItem) {
        const findItem = getTreeItem(addArr, 'pscId', changeItem.pscId)
        if (findItem) {
          const req = { ...findItem, ...changeItem }
          toAction('addToCart', req)
          toAction('addToCartServe', req)
        } else {
          changeUpdate(changeItem)
        }
      },
      itemAdd(addItem) {
        toAction('addToCart', addItem)
        delay(() => {
          toAction('addToCartServe', addItem)
        })
      },
      deleteCart(obj) {
        if (getTreeItem(addArr, 'pscId', obj.pscId)) {
          toAction('deleteCart', obj)
        }
      },
      addPack(pscId, minUnitText) {
        toAction('app/getPackageUnit')
        toAction({ pscId, useType: 1 }, 'viewPackage')
        toAction({ minUnitText })
      },
    }),
  }
  const packageParam = {
    modalVisible: packageModalVisible,
    packageUnit, // 包装规格所有单位
    packageList: packageList.data, // 渲染表格数据
    handleModalCancel() {
      toAction({ packageModalVisible: false })
    },
    handleModalOk(list) {
      toAction({ ...packageList, data: list }, 'editPackage').then(() => {
        const findItem = getTreeItem(addArr, 'pscId', packageList.pscId)
        if (findItem) {
          const req = {
            ...findItem,
            packageUnit: list,
            packageUnitValue: findItem.materialsUnit,
            packageUnitText: findItem.materialsUnitText,
            transformValue: 1,
          }
          toAction('addToCart', req)
          toAction('addToCartServe', req)
        } else {
          if (!getTreeItem(changeArr, 'pscId', packageList.pscId, item => ({
            ...item,
            packageUnit: list,
            packageUnitValue: item.materialsUnit,
            packageUnitText: item.materialsUnitText,
            transformValue: 1,
          }))) {
            changeArr.push({
              packageUnit: list,
              pscId: packageList.pscId,
            })
          }
          toAction({ changeArr })
        }
        toAction({ packageList: { data: {} } })
      })
    },
    loading: getLoading('viewPackage'),
    buttonLoading: getLoading('editPackage'),
  }
  const getSelectedArr = (obj) => {
    const ret = []
    for (const [key, value] of Object.entries(obj)) {
      if (value) {
        ret.push(key)
      }
    }
    return ret
  }
  const selectAllCart = (arr, flag = true, disableArr) => {
    const seleArr = {}
    arr.forEach(({ items }) => {
      if (Array.isArray(items)) {
        items.forEach(({ pscId }) => {
          if (!disableArr.includes(pscId)) {
            seleArr[pscId] = flag
          }
        })
      }
    })
    return seleArr
  }
  const getSunSelectNum = (arr) => {
    let sunSelectNum = 0
    arr.forEach(({ purchaseQty, pscId }) => {
      if (tableIdObj[pscId]) {
        sunSelectNum += (purchaseQty - 0)
      }
    })
    return sunSelectNum
  }
  const cartDispose = (arr) => {
    const tableArr = []
    if (Array.isArray(arr) && arr.length) {
      arr.forEach(({ items, supplierOrgName }, index) => {
        const dataSource = items
          ? items
            .filter(({ pscId }) => getTreeItem(addArr, 'pscId', pscId))
            .map(item => ({
              ...item,
              disabled: disableIdArr.includes(item.pscId),
            }))
          : []
        if (dataSource.length) {
          const cartTableProps = {
            size: 'middle',
            className: style.cartTabel,
            pagination: false,
            dataSource,
            rowKey: 'pscId',
            key: index,
            columns: cartItemColumns({
              supplierOrgName,
              addArr,
              itemAdd(obj) {
                const req = getTreeItem(addArr, 'pscId', obj.pscId)
                toAction('addToCart', { ...req, purchaseQty: obj.purchaseQty })
                delay(() => {
                  toAction('addToCartServe', { ...req, purchaseQty: obj.purchaseQty })
                })
              },
              deleteCart(obj) {
                toAction('deleteCart', obj)
              },
            }),
            rowSelection: {
              type: 'checkbox',
              selectedRowKeys: getSelectedArr(tableIdObj),
              onSelect: ({ pscId }, selected) => {
                tableIdObj[pscId] = selected
                toAction({ tableIdObj })
              },
              onSelectAll: (selected, _, changeRows) => {
                changeRows.forEach(({ pscId }) => {
                  tableIdObj[pscId] = selected
                })
                toAction({ tableIdObj })
              },
              getCheckboxProps: ({ disabled }) => ({ disabled }),
            },
            rowClassName: ({ disabled }) => {
              if (disabled) {
                return 'aek-text-disable'
              }
              return undefined
            },
          }
          tableArr.push(<Table {...cartTableProps} />)
        }
      })
    }
    return { tableArr }
  }
  const cartDataObj = cartDispose(cartArr)

  const onOrder = () => {
    const idArr = []
    for (const [key, value] of Object.entries(tableIdObj)) {
      if (value) {
        idArr.push(key)
      }
    }
    dispatchUrl({
      pathname: '/purchaseManage/handPurchase/orderConfirmation',
      state: { pscIds: idArr },
    })
  }
  const addArrLength = ((arr, disArr) => arr.filter(({ pscId }) => !disArr.includes(pscId)).length)(addArr, disableIdArr)
  const cartProps = {
    tableArr: cartDataObj.tableArr,
    cartVisible,
    sunSelectNum: getSunSelectNum(addArr),
    selectedNum: Object.values(tableIdObj).filter(_ => _).length,
    allSelected: Object.values(tableIdObj).every(_ => _),
    allSelect(flag) {
      toAction({ tableIdObj: selectAllCart(cartArr, flag, disableIdArr) })
    },
    displayToggle() {
      toAction({
        cartVisible: !cartVisible,
        tableIdObj: selectAllCart(cartArr, true, disableIdArr),
      })
    },
    onOrder,
  }
  const getSunPrice = (arr) => {
    let sunPrice = new Decimal(0)
    arr.forEach((item) => {
      if (item && !disableIdArr.includes(item.pscId)) {
        const formatPrice = new Decimal(item.materialsPrice)
        sunPrice = sunPrice.add(
          formatPrice
            .times(item.transformValue)
            .times(item.purchaseQty),
        )
      }
    })
    return sunPrice
  }
  const supplierTableProps = {
    supplierList,
    supplierData,
    comSupplierData,
    comIdArr,
    selectId,
    loading: getLoading('addCommonSupplier', 'commonSupplier', 'suppliers'),
    addComSup(all) {
      toAction('addCommonSupplier', all)
    },
    delectComSup(all) {
      if (all.supplierOrgId) {
        toAction('deleteCommonSupplier', all)
      }
    },
    clickRow({ supplierOrgId, supplierOrgNameHelper }) {
      toAction({
        ...searchKeys,
        supplierOrgId: supplierOrgId === 'all' ? null : supplierOrgId,
        current: 1,
        pageSize: 10,
      }, 'getList').then(() => {
        if (supplierOrgNameHelper && supplierOrgId !== 'all') {
          toAction({ selectId: supplierOrgId })
        } else {
          toAction({ selectId: `${supplierOrgId}|com` })
        }
      })
    },
  }

  const contentLayoutProps = {
    breadLeft: [{ name: 'Breadcrumb' }],
    leftContent: <SupplierTable {...supplierTableProps} />,
    content: (
      <span>
        <AdvancedSearchForm
          formData={formData}
          loading={getLoading('getList')}
          initialValues={searchKeys}
          onSearch={(value) => {
            toAction({
              ...searchKeys,
              ...value,
              current: 1,
              pageSize: 10,
            }, 'getList')
          }}
        />
        <Tabs
          activeKey={tableTepy}
          style={{ marginBottom: 6 }}
          tabBarExtraContent={
            <span>
              <span>
                {
                  addArrLength
                    ? (
                      <span>
                        <span>
                          {`已选${addArrLength}个品类，总价${formatNum(getSunPrice(addArr))}元`}
                        </span>&#x3000;
                        <Button type="primary" onClick={onOrder}>下单</Button>
                      </span>
                    )
                    : ''
                }
              </span>
            </span>
          }
          onChange={(key) => {
            toAction({ tableTepy: key })
            toAction({
              ...searchKeys,
              current: 1,
              pageSize: 10,
            }, 'getList')
          }}
        >
          <Tabs.TabPane tab="全部" key="materials" />
          <Tabs.TabPane tab="常采购" key="common" />
        </Tabs>
        <Table {...tableProps} />
        <PackageSpecifica {...packageParam} />
      </span>
    ),
    otherContent: <Cart {...cartProps} />,
  }
  return <ContentLayout {...contentLayoutProps} />
}
HandPurchase.propTypes = propTypes
export default connect(({
  handPurchase,
  loading,
  app: {
    constants: { packageUnit },
  },
}) => ({ handPurchase, loading, packageUnit }),
)(HandPurchase)
