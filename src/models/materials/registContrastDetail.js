import { message } from 'antd'
import { parse } from 'qs'
import pathToRegexp from 'path-to-regexp'
import modelExtend from '../../utils/modelExtend'
import { getServices } from '../../utils'


const servers = getServices({
  // 查看注册证对照详情
  getRegistDetailData: 'materials/register-certificate/compare/detail',
  // 分页查询标准注册证列表
  getCompaerRegistData: 'materials/register-certificate/compare/standard/page-list',
  // 保存注册证对照
  saveRegistData: 'materials/register-certificate/compare/save',
  // 新增标准注册证
  addRegistData: 'materials/register-certificate/compare/standard/add',
  getProduceFacList: 'organization/getProduceFactoryCompositionInfo',
  getAllTypeInfo: 'organization/getAllTypeInfo',
  getSuppProList: 'organization/getSupplierCompositionInfo',
  getNewCertList: 'materials/register/certificate/option/list',
})
const initState = {
  supplierCertificateId: '', // 供应商注册证id
  standardCertificateId: '', // 标准注册证Id
  searchData: {
    current: 1,
    pageSize: 10,
  }, // 注册证对照列表搜索条件
  pagination: {}, // 注册证对照列表翻页
  compareRegistList: [], // 标准注册证列表
  compareRegistDetail: {
    standardRegisterCertificate: {},
    supplierRegisterCertificate: {},
  }, // 注册郑对照详情
  addModalVisible: false, // 添加证件
  certSortShow: true, // 显示注册证表单
  timeIsOffReQuire: false, // 是否长期有效
  longStatus: false, // 长期有效
  certIsOff: true, // 换证是否不显示
  delayIsOff: true, // 延期是否不显示
  proxyIsOff: true, // 总代是否不显示
  produceList: [], // 标准生产企业列表
  suppProList: [], // 新证号异步补全列表
  newCertList: [], // 新证书里异步列表
  fileEndDate: undefined,
}
export default modelExtend({
  namespace: 'registContrastDetail',
  state: initState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const { pathname, search } = location
        const query = parse(search, { ignoreQueryPrefix: true })
        const match = pathToRegexp('/materials/registContrast/detail/:id').exec(pathname)
        if (match) {
          dispatch({
            type: 'updateState',
            payload: {
              ...initState,
              supplierCertificateId: match[1],
              standardCertificateId: query && query.id,
            },
          })
          dispatch({
            type: 'getRegistDetail',
            payload: {
              supplierCertificateId: match[1],
              standardCertificateId: query && query.id,
            },
          })
          dispatch({
            type: 'getCompaerRegist',
            payload: {
              certificateType: '1',
              current: 1,
              pageSize: 10,
              certificateNo: null,
              keywords: null,
              productName: null,
            },
          })
        }
      })
    },
  },
  effects: {
    // 获取注册证对照详情
    * getRegistDetail({ payload }, { call, update }) {
      const { content } = yield call(servers.getRegistDetailData, payload)
      yield update({
        compareRegistDetail: content,
      })
    },
    // 获取注册证标准证件列表
    * getCompaerRegist({ payload }, { call, update }) {
      const { content: { data, current, total, pageSize } } = yield call(servers.getCompaerRegistData, payload)
      yield update({
        searchData: payload,
        compareRegistList: data,
        pagination: {
          current,
          total,
          pageSize,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: tota => `共有 ${tota} 条数据`,
        },
      })
    },
    // 注册证对照
    * saveRegist({ payload }, { call }) {
      const data = yield call(servers.saveRegistData, payload)
      message.success('对照成功')
    },
    // 获取厂家列表
    * getProduceFacList({ payload }, { call, update }) {
      const { content } = yield call(servers.getProduceFacList, payload)
      yield update({ produceList: content })
    },
    // 获取所有厂家 、供应商列表（总代）
    * getAllTypeInfo({ payload }, { call, update }) {
      const { content } = yield call(servers.getAllTypeInfo, payload)
      yield update({ allProList: content })
    },
    // 获取总代列表
    * getAllProList({ payload }, { call, update }) {
      const { content } = yield call(servers.getSuppProList, payload)
      yield update({ suppProList: content })
    },
    // 获取新证号列表
    * getNewCertList({ payload }, { call, update }) {
      const { content } = yield call(servers.getNewCertList, payload)
      yield update({ newCertList: content })
    },
    // 新增注册证
    * addRegist({ payload }, { call, put }) {
      const { content } = yield call(servers.addRegistData, payload)
      yield message.success('新增成功')
      yield put({
        type: 'updateState',
        payload: {
          addModalVisible: false,
          ...content,
        },
      })
      yield put({
        type: 'getRegistDetail',
        payload: content,
      })
    },
    // 新增注册证详情
    * getAddRegistDetail({ payload }, { call, update, select }) {
      yield update({
        addModalVisible: true,
      })
      const supplierCertificateId = yield select(({ registContrastDetail }) => registContrastDetail.supplierCertificateId)
      const compareRegistDetail = yield select(({ registContrastDetail }) => registContrastDetail.compareRegistDetail)
      const { content } = yield call(servers.getRegistDetailData, { supplierCertificateId })
      yield update({
        compareRegistDetail: {
          ...compareRegistDetail,
          supplierRegisterCertificate: content.supplierRegisterCertificate,
        },
        certSortShow: Number(content.supplierRegisterCertificate.certificateType) !== 1,
        certIsOff: !content.supplierRegisterCertificate.replacedFlag,
        delayIsOff: !content.supplierRegisterCertificate.delayedFlag,
        proxyIsOff: !content.supplierRegisterCertificate.importedFlag,
        longStatus: content.supplierRegisterCertificate.validDateLongFlag,
        fileEndDate: content.supplierRegisterCertificate.validDateEnd,
        certificateId: content.supplierRegisterCertificate.certificateId,
      })
    },
  },
  reducers: {},
})
