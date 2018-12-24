import { message } from 'antd'
import { cloneDeep } from 'lodash'
import {
  getAllTypeInfo,
  getSuppProList,
  getProduceFacList,
  getCertList,
  onOffCert,
  mountOnOff,
  editCert,
  addCert,
  viewDetailCert,
  viewCerNoList,
  viewCertNoCompareList,
  getCertNoDetail,
  getNewCertList,
} from '../../services/materials/certificate'
import modelExtend from '../../utils/modelExtend'

const handleData = (data) => {
  const copyData = cloneDeep(data)
  if (data.handleProduceFactoryId) {
    copyData.produceFactoryId = data.handleProduceFactoryId.key
  }
  if (data.handleAgentSupplierId) {
    copyData.agentSupplierId = data.handleAgentSupplierId.key
  }
  delete copyData.handleProduceFactoryId
  delete copyData.handleAgentSupplierId
  return copyData
}
const initState = {
  produceList: [], // 标准生产企业列表
  suppProList: [], // 新证号异步补全列表
  newCertList: [], // 新证书里异步列表
  proxyIsOff: true, // 总代是否不显示
  delayIsOff: true, // 延期是否不显示
  certIsOff: true, // 换证是否不显示
  longStatus: false, // 长期有效
  timeIsOffReQuire: false, // 是否长期有效
  certSortShow: true, // 显示注册证表单
  visible: false,
  historyModalVisible: false,
  currentItem: {},
  certificateList: [],
  addModalVisible: false,
  addModalType: '',
  checkedArr: [],
  fileEndDate: undefined,
  pagination: {
    current: 1,
    pageSize: 10,
    total: null,
  },
  searchSaveParam: {},
  historyPagination: {
    current: 1,
    pageSize: 10,
    total: null,
  },
  historyList: [],
  checkedHistoryArr: [],
  compareModalVisible: false,
  versionDoubleList: [{}, {}],
  viewCurrentData: {},
  viewModalVisible: false,
  certificateId: '',
  allProList: [],
}
export default modelExtend({
  namespace: 'certificate',
  state: initState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/materials/certificate') {
          if (history.action !== 'POP') {
            dispatch({ type: 'updateState', payload: initState })
          }
          dispatch({ type: 'getCertList' })

          // 获取注册证配置
          dispatch({
            type: 'app/getRegistList',
          })

          dispatch({
            type: 'getAllTypeInfo',
            payload: {
              keywords: '',
            },
          })
          dispatch({
            type: 'getProduceFacList',
            payload: {
              keywords: '',
            },
          })
        }
      })
    },
  },
  effects: {
    // 获取注册证表格列表
    * getCertList({ payload }, { call, select, update }) {
      const { searchSaveParam } = yield select(({ certificate }) => certificate)
      const { content: { current, total, data, pageSize } } = yield call(getCertList, {
        ...handleData(searchSaveParam),
        ...payload,
      })
      yield update({ certificateList: data, pagination: { current, total, pageSize } })
    },
    // 新增注册证
    * addCert({ payload }, { call, select, update }) {
      const { searchSaveParam } = yield select(({ certificate }) => certificate)
      yield call(addCert, payload)
      message.success('添加成功')
      const { content: { current, total, data, pageSize } } = yield call(
        getCertList,
        handleData(searchSaveParam),
      )
      yield update({
        certificateList: data,
        pagination: { current, total, pageSize },
        addModalVisible: false,
      })
    },
    // 编辑注册证
    * editCert({ payload }, { call, select, update }) {
      const { certificateId, searchSaveParam } = yield select(({ certificate }) => certificate)
      yield call(editCert, { ...payload, certificateId })
      message.success('操作成功')
      const { content: { current, total, pageSize, data } } = yield call(
        getCertList,
        handleData(searchSaveParam),
      )
      yield update({
        certificateList: data,
        pagination: { current, total, pageSize },
        addModalVisible: false,
      })
    },
    // 停用启用注册证
    * onOffCert({ payload }, { call, select, update }) {
      const { searchSaveParam } = yield select(({ certificate }) => certificate)
      yield call(onOffCert, payload)
      message.success('操作成功')
      const { content: { current, total, pageSize, data } } = yield call(
        getCertList,
        handleData(searchSaveParam),
      )
      yield update({ certificateList: data, pagination: { current, total, pageSize } })
    },
    // 批量停用启用
    * mountOnOff({ payload }, { call, select, update }) {
      const { searchSaveParam } = yield select(({ certificate }) => certificate)
      yield call(mountOnOff, payload)
      message.success('操作成功')
      const { content: { current, total, pageSize, data } } = yield call(
        getCertList,
        handleData(searchSaveParam),
      )
      yield update({ certificateList: data, pagination: { current, total, pageSize } })
    },
    // 查看注册证详情
    * viewDetailCert({ payload }, { call, update }) {
      yield update({ addModalVisible: true, addModalType: 'update' })
      const { content } = yield call(viewDetailCert, payload)
      yield update({
        currentItem: content,
        certSortShow: Number(content.certificateType) !== 1,
        certIsOff: !content.replacedFlag,
        delayIsOff: !content.delayedFlag,
        proxyIsOff: !content.importedFlag,
        longStatus: content.validDateLongFlag,
        fileEndDate: content.validDateEnd,
        certificateId: content.certificateId,
      })
    },
    // 查看注册证版本列表
    * viewCerNoList({ payload }, { call, update, select }) {
      yield update({
        historyModalVisible: true,
        checkedHistoryArr: [],
      })
      const { certificateId } = yield select(({ certificate }) => certificate)
      const { content: { data, total, current } } = yield call(viewCerNoList, {
        ...payload,
        certificateId,
      })
      yield update({ historyList: data, historyPagination: { total, current } })
    },
    // 查看注册证版本比对列表
    * viewCertNoCompareList({ payload }, { call, update }) {
      yield update({ compareModalVisible: true })
      const { content } = yield call(viewCertNoCompareList, payload)
      yield update({ versionDoubleList: content })
    },
    // 查询注册证版本详情
    * getCertNoDetail({ payload }, { call, update }) {
      yield update({
        viewModalVisible: true,
      })
      const { content } = yield call(getCertNoDetail, payload)
      yield update({
        viewCurrentData: content,
      })
    },
    // 获取厂家列表
    * getProduceFacList({ payload }, { call, update }) {
      const { content } = yield call(getProduceFacList, payload)
      yield update({ produceList: content })
    },
    // 获取所有厂家 、供应商列表（总代）
    * getAllTypeInfo({ payload }, { call, update }) {
      const { content } = yield call(getAllTypeInfo, payload)
      yield update({ allProList: content })
    },
    // 获取总代列表
    * getAllProList({ payload }, { call, update }) {
      const { content } = yield call(getSuppProList, payload)
      yield update({ suppProList: content })
    },
    // 获取新证号列表
    * getNewCertList({ payload }, { call, update }) {
      const { content } = yield call(getNewCertList, payload)
      yield update({ newCertList: content })
    },
  },
  reducers: {
    updateState(state, action) {
      return {
        ...state,
        ...action.payload,
      }
    },
  },
})
