import React from 'react'
import { message } from 'antd'
import { modelExtend, getSetup, getTreeItem, cloneDeep } from '../../../utils'
import * as services from '../../../services/purchaseManage/handPurchase'

const initState = {
  editModalVisible: false,
  packageModalVisible: false,
  tableData: [],
  addArr: [],
  changeArr: [],
  cartArr: [],
  tableIdObj: {},
  disableIdArr: [],
  packageList: { data: {} },
  supplierData: [],
  supplierList: [],
  comSupplierData: [],
  comIdArr: [],
  cartVisible: false,
  addFlag: false,
  pageConfig: {
    current: 1,
    pageSize: 10,
    total: null,
  },
}
const unstableState = {
  selectId: 'all|com',
  tableTepy: 'materials',
  searchKeys: {
    current: 1,
    pageSize: 10,
    supplierOrgId: null,
    keywords: null,
  },
}

export default modelExtend({
  namespace: 'handPurchase',
  state: cloneDeep({ ...initState, ...unstableState }),
  subscriptions: getSetup({
    path: '/purchaseManage/handPurchase',
    initFun({ toAction, history }) {
      toAction(cloneDeep(initState))
      if (history.action !== 'POP') {
        toAction(cloneDeep(unstableState))
      }
      toAction('app/getPackageUnit')
      toAction('getList')
      toAction('cartDetail')
      toAction('suppliers')
      toAction('commonSupplier')
    },
  }),

  effects: {
    // 物料列表查询
    * getList({ payload }, { toAction, select, call }) {
      const { searchKeys, tableTepy } = yield select(({ handPurchase }) => handPurchase)
      const req = payload || searchKeys
      let res = {}
      if (tableTepy === 'common') {
        res = (yield call(services.commonList, req)).content
      } else {
        res = (yield call(services.materialsList, req)).content
      }
      yield toAction({
        tableData: res.data || [],
        searchKeys: req,
        pageConfig: {
          current: res.current,
          pageSize: res.pageSize,
          total: res.total,
        },
      })
    },

    // 查看包装规格详情
    * viewPackage({ payload }, { call, toAction }) {
      yield toAction({ packageModalVisible: true })
      const { content } = yield call(services.viewPackage, payload)
      yield toAction({
        packageList: {
          data: content,
          ...payload,
        },
      })
    },

    // 维护包装规格
    * editPackage({ payload }, { call, toAction }) {
      yield call(services.editPackage, payload)
      yield [
        toAction({
          packageModalVisible: false,
        }),
      ]
      message.success('维护成功')
    },

    // 购物车详情处理
    * disposeDetail({ payload: { content } }, { toAction, select }) {
      const { changeArr, disableIdArr } = yield select(({ handPurchase }) => handPurchase)
      const selectAllCart = (arr, disableArr) => {
        const seleArr = {}
        arr.forEach(({ items }) => {
          if (Array.isArray(items)) {
            items.forEach(({ pscId }) => {
              if (!disableArr.includes(pscId)) {
                seleArr[pscId] = true
              }
            })
          }
        })
        return seleArr
      }
      const addChangeArr = (arr, chgArr, disableArr) => {
        arr.forEach(({ items }) => {
          if (Array.isArray(items)) {
            items.forEach((itm) => {
              if (!getTreeItem(chgArr, 'pscId', itm.pscId, item => (
                { ...item, ...itm }
              ))) {
                if (!disableArr.includes(itm.pscId)) {
                  chgArr.push({ ...itm })
                }
              }
            })
          }
        })
        return chgArr
      }
      const cartList = (arr, disableArr) => {
        const ret = []
        arr.forEach(({ items }) => {
          if (Array.isArray(items)) {
            items.forEach((itm) => {
              if (!disableArr.includes(itm.pscId)) {
                ret.push({ ...itm })
              }
            })
          }
        })
        return ret
      }
      yield toAction({
        cartArr: content,
        tableIdObj: selectAllCart(content, disableIdArr),
        addArr: cartList(content, disableIdArr),
        changeArr: addChangeArr(content, changeArr, disableIdArr),
      })
    },

    // 查看购物车
    * cartDetail({ payload }, { call, toAction, select }) {
      const { content } = yield call(services.cartDetail, payload)
      const selectAllCart = (arr) => {
        const seleArr = {}
        arr.forEach(({ items }) => {
          if (Array.isArray(items)) {
            items.forEach(({ pscId }) => {
              seleArr[pscId] = true
            })
          }
        })
        return seleArr
      }
      const pscIds = Object.keys(selectAllCart(content))
      const { disableIdArr: disIdArr } = yield select(({ handPurchase }) => handPurchase)
      const disableIdArr = []
      if (pscIds.length && !disIdArr.length) {
        let stateArr = []
        const { content: content1 } = yield call(services.usingStatus, { pscIds })
        stateArr = content1
        stateArr.forEach((item) => {
          if (item.pscStatus === 2) {
            disableIdArr.push(item.pscId)
          }
        })
      }
      yield toAction({ disableIdArr })
      yield toAction({ content }, 'disposeDetail')
    },

    // 添加到购物车(本地)
    * addToCart({ payload }, { toAction, select }) {
      const { cartArr } = yield select(({ handPurchase }) => handPurchase)
      let req = cloneDeep(cartArr)
      const findSupplier = getTreeItem(req, 'supplierOrgId', payload.supplierOrgId)
      if (findSupplier) {
        const findItem = getTreeItem(findSupplier.items, 'pscId', payload.pscId)
        if (findItem) {
          findItem.purchaseQty = payload.purchaseQty
          findItem.packageUnit = payload.packageUnit
          findItem.packageUnitText = payload.packageUnitText
          findItem.packageUnitValue = payload.packageUnitValue
          findItem.transformValue = payload.transformValue
        } else {
          findSupplier.items.unshift(payload)
        }
      } else {
        req = [{
          items: [payload],
          supplierOrgId: payload.supplierOrgId,
          supplierOrgName: payload.supplierOrgName,
        }].concat(cartArr)
      }
      yield toAction('disposeDetail', { content: req })
    },

    // 添加到购物车
    * addToCartServe({ payload }, { call }) {
      yield call(services.addToCart, payload)
    },

    // 移除购物车
    * deleteCart({ payload }, { call, toAction, select }) {
      const { cartArr } = yield select(({ handPurchase }) => handPurchase)
      const req = []
      cartArr.forEach((item) => {
        if (item.supplierOrgId === payload.supplierOrgId) {
          const itemArr = []
          item.items.forEach((itm) => {
            if (itm.pscId !== payload.pscId) {
              itemArr.push(itm)
            }
          })
          if (itemArr.length) {
            req.push({
              ...item,
              items: itemArr,
            })
          }
        } else {
          req.push(item)
        }
      })
      yield toAction('disposeDetail', { content: req })
      yield call(services.deleteCart, payload)
      message.success('移除成功')
    },
    // 获取供应商
    * suppliers({ payload }, { call, toAction }) {
      const { content } = yield call(services.suppliers, payload)
      const getSupplierTable = (arr) => {
        const retArr = []
        arr.forEach((item) => {
          const index = item.supplierOrgNameHelper[0]
          if (!getTreeItem(retArr, 'index', index, (itm) => {
            itm.data.push(item)
            return itm
          })) {
            retArr.push({
              index,
              data: [item],
            })
          }
        })
        return retArr
      }
      yield toAction({
        supplierData: getSupplierTable(content),
        supplierList: content,
      })
    },
    // 获取常用供应商
    * commonSupplier({ payload }, { call, toAction }) {
      const { content } = yield call(services.commonSupplier, payload)
      yield toAction({
        comIdArr: [null].concat(content.map(({ supplierOrgId }) => supplierOrgId)),
        comSupplierData: [{
          index: '常用',
          data: [{
            supplierOrgId: 'all',
            supplierOrgName: <span style={{ marginLeft: 22 }}>全部</span>,
          }].concat(content),
        }],
      })
    },
    // 添加常用供应商
    * addCommonSupplier({ payload }, { call, toAction }) {
      yield call(services.addCommonSupplier, payload)
      yield toAction('commonSupplier')
      message.success('添加成功')
    },
    // 移除常用供应商
    * deleteCommonSupplier({ payload }, { call, toAction }) {
      yield call(services.deleteCommonSupplier, payload)
      yield toAction('commonSupplier')
      message.success('移除成功')
    },
  },
})
