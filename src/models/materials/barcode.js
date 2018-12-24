import { message as Message } from 'antd'
import { get } from 'lodash'
import { modelExtend, getServices } from '../../utils'
import { value2File } from '../../components/UploadButton'

const services = getServices({
  // 获取条码表格
  getBarcodeTableData: '/materials/barcode-rule/list',
  // 新增条码保存
  saveNewBarcode: '/materials/barcode-rule/save',
  // 编辑条码保存
  saveEditBarcode: '/materials/barcode-rule/update',
  // 查看条码版本列表
  getBarcodeVerList: '/materials/barcode-rule-version/list',
  // 获取条码版本详情
  getBarcodeDetail: '/materials/barcode-rule-version/detail',
  // 获取条码详情
  getBarcodeEditDetail: '/materials/barcode-rule/detail',
  // 查询条码版本比对
  versionCompare: '/materials/barcode-rule-version/compare',
  // 条码解析
  barcodeResolve: '/materials/barcode/resolve',
  // 新建前的条码解析
  testBeforeCreate: '/materials/barcode-rule/save-parse-test',
  // 条码测试
  testBarcode: '/barcode/parse-test',
  // 审核
  auditBarcodeRule: '/materials/barcode-rule/review',
  // 字典
  dic: 'system/dicValue/dicKey',
})

const tableDefaultPagination = {
  current: 1,
  total: 0,
  pageSize: 10,
}

const initialBarcodeEditState = {
  barcodeLength: 0,
  batchNoLength: 0,
  materialsCodeLength: 0,
  trackCodeLength: 0,
  barcodeType: '1',
  barcodeRuleReviewStatus: 1,
  barcodeRuleStatus: '0',
  barcodeExample: '',
  barcodeImageUrls: [],
}

const initialState = {
  currentBarcodeId: '',
  barcodeTableSearchParams: {},
  barcodeTableDataSource: [],
  barcodeTablePagination: tableDefaultPagination,
  addModalVisible: false,
  verTableDataSource: [],
  verTablePagination: tableDefaultPagination,
  verListModalVisible: false,
  barcodeDetail: {},
  detailModalVisible: false,
  compareBarcodeDetail: [],
  compareModalVisible: false,
  compareSelectedKeys: [],
  resolveDataSource: [],
  resolveModalVisible: false,
  testDataSource: [],
  testModalVisible: false,
  addModalStatus: 'add',
  addReasonList: [],
  barcodeMakeList: [],
  editBarcode: initialBarcodeEditState,
}

const namespace = 'barcode'

export default modelExtend({
  namespace,

  state: initialState,

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/materials/barcode') {
          dispatch({ type: 'reset' })
          dispatch({ type: 'getBarcodeTable' })
          dispatch({ type: 'addReasonList' })
          dispatch({ type: 'barcodeMakeList' })
        }
      })
    },
  },

  effects: {
    // 条码表格分页查询
    * getBarcodeTable({ payload }, { call, update, select }) {
      yield update(payload)
      const { barcodeTableSearchParams, barcodeTablePagination } = yield select(
        ({ barcode }) => barcode,
      )
      const rs = yield call(services.getBarcodeTableData, {
        ...barcodeTablePagination,
        ...barcodeTableSearchParams,
      })
      const { data, current, pageSize, total } = rs.content
      yield update({
        barcodeTableDataSource: data,
        barcodeTablePagination: { current, pageSize, total },
      })
    },
    // 条码表格高级搜索
    * barcodeTableAdvancedSearch({ payload }, { put }) {
      yield put({
        type: 'getBarcodeTable',
        payload: {
          barcodeTablePagination: tableDefaultPagination,
          barcodeTableSearchParams: payload,
        },
      })
    },
    // 新增条码保存
    * saveNewBarcode({ payload }, { call, update, put }) {
      yield call(services.saveNewBarcode, payload)
      Message.success('新增成功')
      yield update({ addModalVisible: false })
      yield put({ type: 'getBarcodeTable' })
    },
    // 编辑条码保存
    * saveEditBarcode({ payload }, { call, update, put }) {
      yield call(services.saveEditBarcode, payload)
      Message.success('保存成功')
      yield update({ addModalVisible: false })
      yield put({ type: 'getBarcodeTable' })
    },
    // 查看条码版本列表
    * getBarcodeVerList({ payload }, { call, update, select }) {
      yield update(payload)
      const { currentBarcodeId, verTablePagination } = yield select(store => store[namespace])
      const rs = yield call(services.getBarcodeVerList, {
        barcodeRuleId: currentBarcodeId,
        ...verTablePagination,
      })
      const content = rs.content
      yield update({
        verTableDataSource: content.data,
        verTablePagination: {
          current: content.current,
          pageSize: content.pageSize,
          total: content.total,
        },
      })
    },
    // 初始化查询条码版本列表
    * initialGetBarcodeVerList({ payload }, { update, put }) {
      yield update({ verListModalVisible: true })
      yield put({
        type: 'getBarcodeVerList',
        payload: {
          currentBarcodeId: payload,
          verTablePagination: tableDefaultPagination,
        },
      })
    },
    // 获取条码版本详情
    * getBarcodeDetail({ payload }, { call, update }) {
      const { content } = yield call(services.getBarcodeDetail, { barcodeRuleVersionId: payload })
      yield update({ barcodeDetail: content })
    },
    // 获取条码编辑详情
    * getBarcodeEditDetail({ payload }, { call, update }) {
      const { content } = yield call(services.getBarcodeEditDetail, { barcodeRuleId: payload })
      yield update({
        editBarcode: {
          ...content,
          barcodeImageUrls: get(content, 'barcodeImageUrls', '')
            .split(',')
            .filter(x => !!x)
            .map(value2File),
          supplierId: content.supplierId
            ? {
              key: get(content, 'supplierId', ''),
              label: get(content, 'supplierName', ''),
            }
            : undefined,
          produceFactoryId: content.produceFactoryId
            ? {
              key: get(content, 'produceFactoryId', ''),
              label: get(content, 'produceFactoryName', ''),
            }
            : undefined,
        },
      })
    },
    // 版本对比
    * versionCompare(_, { call, update, select }) {
      yield update({ compareModalVisible: true })
      const { compareSelectedKeys } = yield select(store => store[namespace])
      const { content } = yield call(services.versionCompare, {
        barcodeRuleVersionIds: compareSelectedKeys.join(),
      })
      yield update({ compareBarcodeDetail: content })
    },
    // 条码解析
    * resolveBarcode({ payload }, { call, update }) {
      const { content } = yield call(services.barcodeResolve, { barcode: payload })
      yield update({ resolveDataSource: content.map(x => ({ ...x, barcode: payload })) })
    },
    // 创建前解析
    * testBeforeCreate({ payload }, { call, update }) {
      // yield call(services.testBeforeCreate, { barcode: payload.barcode })
      yield update({
        barcodeModalVisible: false,
        addModalVisible: true,
        addModalStatus: 'add',
      })
    },
    // 条码测试
    * testBarcode({ payload }, { call, update }) {
      const supplierOrgId = payload.supplierOrgId && payload.supplierOrgId.key
      const factoryOrgId = payload.factoryOrgId && payload.factoryOrgId.key
      const customerOrgId = payload.customerOrgId && payload.customerOrgId.key
      const params = { ...payload, supplierOrgId, factoryOrgId, customerOrgId }
      const { content } = yield call(services.testBarcode, { ...params })
      yield update({ testDataSource: content })
    },
    // 条码审核
    * auditBarcodeRule({ payload }, { call, put, update }) {
      yield call(services.auditBarcodeRule, { ...payload })
      yield update({ addModalVisible: false })
      yield put({
        type: 'getBarcodeTable',
      })
    },
    // 获取添加原因
    * addReasonList(_, { call, update }) {
      const { content } = yield call(services.dic, { dicKey: 'BARCODE_RULE_ADD_REASON' })
      yield update({ addReasonList: content })
    },
    // 获取条码制作方
    * barcodeMakeList(_, { call, update }) {
      const { content } = yield call(services.dic, { dicKey: 'BARCODE_MAKE' })
      yield update({ barcodeMakeList: content })
    },
  },

  reducers: {
    barcodeEditChange(state, { payload }) {
      return {
        ...state,
        editBarcode: {
          ...state.editBarcode,
          ...payload,
        },
      }
    },
    barcodeReset(state) {
      return { ...state, editBarcode: initialBarcodeEditState }
    },
    reset() {
      return { ...initialState }
    },
  },
})
