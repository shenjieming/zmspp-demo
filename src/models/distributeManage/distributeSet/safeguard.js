import { message } from 'antd'
import { modelExtend, getSetup, getServices } from '../../../utils'

const services = getServices({
  // 分销商配送目录列表(郑锋)
  pageList: '/distribute/distributor/deliver-catalog/page-list',
  // 分销商配送目录列表来源（代配）
  substitutePageList: '/distribute/distributor/deliver-catalog-source/page-list',
  // 分销商配送目录列表来源（分销）
  distributePageList: '/distribute/distributor/distribution-source-catalog/page-list',
  // 分销商配送目录数据源列表(郑锋)
  pageModalList: '/distribute/distributor/deliver-catalog-source/page-list',
  // 新增分销商配送目录(郑锋)
  addPscs: '/distribute/distributor/deliver-catalog/batch-save',
  // 移除分销商配送目录(郑锋)
  delPsc: '/distribute/distributor/deliver-catalog/delete',
  // 获取分发模式
  getDistributeType: '/distribute-customer/get-distribute-type',
  // 更改物资价格
  changePrice: '/distribute/distributor/deliver-catalog/update-price',
})

const initState = {
  modalVisible: false,
  tableData: [],
  modalTableData: [],
  pscIdArr: [],
  modalForm: {},
  prevPageInfo: {
    distributorOrgId: undefined,
    customerOrgId: undefined,
  },
  pageConfig: {
    current: 1,
    pageSize: 10,
    total: null,
  },
  modalPageConfig: {
    current: 1,
    pageSize: 10,
    total: null,
  },
  searchKeys: {
    current: 1,
    pageSize: 10,
    keywords: null,
  },
  modalSearchKeys: {
    current: 1,
    pageSize: 10,
    keywords: null,
  },
  distributeType: 1,
}

export default modelExtend({
  namespace: 'safeguard',
  state: initState,
  subscriptions: getSetup({
    path: '/distributeManage/distributeSet/safeguard/:id',
    initFun({ toAction, id }) {
      toAction(initState)
      const urlArr = id.split('+')
      toAction({
        prevPageInfo: {
          customerOrgId: urlArr[0],
          distributorOrgId: urlArr[1],
        },
      })
      toAction('pageList')
      toAction({ customerOrgId: urlArr[0] }, 'getDistributeType')
    },
  }),

  effects: {
    // 分销模式查询
    * getDistributeType({ payload }, { select, call, update }) {
      const {
        orgInfo: { orgId: supplierOrgId },
      } = yield select(({ app }) => app)
      const { content } = yield call(services.getDistributeType, { ...payload, supplierOrgId })
      yield update({ distributeType: content })
    },
    // 分销商配送目录列表(郑锋)
    * pageList({ payload }, { call, toAction, select }) {
      const { searchKeys, prevPageInfo } = yield select(({ safeguard }) => safeguard)
      const req = payload || searchKeys
      const { content } = yield call(services.pageList, {
        ...req,
        ...prevPageInfo,
      })
      yield toAction({
        searchKeys: req,
        tableData: content.data,
        pageConfig: {
          current: content.current,
          pageSize: content.pageSize,
          total: content.total,
        },
      })
    },
    // 分销商配送目录数据源列表(郑锋)
    * pageModalList({ payload }, { call, toAction, select }) {
      const { modalSearchKeys, prevPageInfo, distributeType } = yield select(
        ({ safeguard }) => safeguard,
      )
      const req = payload || modalSearchKeys
      let response = {}
      if (distributeType === 1) {
        response = yield call(services.substitutePageList, {
          ...req,
          ...prevPageInfo,
        })
      } else {
        response = yield call(services.distributePageList, {
          ...req,
          ...prevPageInfo,
        })
      }
      const { content } = response
      yield toAction({
        modalSearchKeys: req,
        modalTableData: content.data,
        modalPageConfig: {
          current: content.current,
          pageSize: content.pageSize,
          total: content.total,
        },
      })
    },
    // 新增分销商配送目录(郑锋)
    * addPscs({ payload }, { call, select, toAction }) {
      const { prevPageInfo } = yield select(({ safeguard }) => safeguard)
      yield call(services.addPscs, {
        ...payload,
        ...prevPageInfo,
      })
      message.success('添加成功')
    },
    // 移除分销商配送目录(郑锋)
    * delPsc({ payload }, { call, select }) {
      const { prevPageInfo } = yield select(({ safeguard }) => safeguard)
      yield call(services.delPsc, {
        ...payload,
        ...prevPageInfo,
      })
      message.success('移除成功')
    },
    //
    * changePscPrice({ payload }, { update, call, select, put }) {
      const { row, distributorPrice } = payload
      if (Number(row.distributorPrice) === Number(distributorPrice)) {
        row.editing = false
        yield update({})
      } else {
        const { prevPageInfo } = yield select(({ safeguard }) => safeguard)
        const { pscId } = row
        yield call(services.changePrice, {
          pscId,
          distributorPrice,
          ...prevPageInfo,
        })
        message.success('修改成功')
        yield put({ type: 'pageList' })
      }
    },
  },
})
