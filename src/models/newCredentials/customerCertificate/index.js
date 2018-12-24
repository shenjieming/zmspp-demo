import { message } from 'antd'
import { parse } from 'qs'
import dvaModelExtend from '../../../utils/modelExtend'

import {
  certificateListData, // 效期
  certificateRemindData, // 效期提醒
  registListData, // 注册证
  registDetailData, // 注册证详情
  prodFactoryListData, // 厂家总代三证
  prodFactoryDetailData, // 厂家总代三证详情
  authListData, // 授权书
  authDetailData, // 查看授权书详情
  factoryOptionsData, // 生产厂家下拉列表
  powerListData, // 委托书
  powerDetailData, // 委托书详情
  otherListData, // 其他证件
  otherDetailData, // 其他证件详情
  otherReplaceData, // 其他证件换证
  otherCustomerData, // 其他证件客户名称
  customerOptionsData, // 所有供应商下拉列表
  // getCertificateNumData, // 获取所有证件数量
  getCompanyDetailData, // 获取企业证书
  getRefuseReasonListData, // 拒绝原因
  getValidStatisticsData, // 获取效期提醒证件数量
  getFactoryAgentData, // 厂家总代过期证件数量
  getOtherStatisticsData, // 其他档案过期证件数量
  getAuthStatisticsData, // 授权书过期证件数量
  getPowerStatisticsData, // 委托书过期证件数量
  getRegistStatisticsData, // 注册证过期证件数量
  authStatusData,
  powerStatusData,
  factoryStatusData,
  otherStatusData,
  registeStatusData,
  getOtherTypeOptions, // 获取其他证件类型下来选项


  getCertificates, // 获取回溯列表信息
} from '../../../services/newCredentials/customerCertificate'

const initState = {
  tabIndex: '1',
  selectedRowKeys: [], // 注册证批量选择
  searchData: {}, // 搜索条件
  dataSource: [], // 证件分页列表
  registDataSource: [], // 注册证
  factoryDataSource: [], // 生产厂家
  authDataSource: [], // 授权书分页列表
  powerDataSource: [], // 委托书分页列表
  otherDataSource: [], // 其他档案分页列表
  pagination: {}, // 证件列表分页
  rowSelectData: {}, // 列表点击行数据
  authDetail: {}, // 查看授权书详情
  authDetailVisible: false, // 查看授权书详情弹框
  modalTitle: '', // 所有弹框的标题
  agentOptions: [], // 总代下拉列表
  factoryOptions: [], // 生产厂家下拉列表
  prodFactoryVisible: false, // 厂家总代三证详情弹框
  prodFactoryDetail: {
    certificates: [],
  }, // 厂家总代三证详情
  eternalLifeObj: {}, // 复选框状态
  registDetail: {}, // 注册证详情
  registDetailVisible: false, // 注册证详情弹框
  registCodeOptions: [], // 证号模糊匹配查询
  registCodeSelected: false, // 默认没有点击模糊匹配的数据
  registDelaylVisible: false, // 注册证延期弹框
  powerDetail: {}, // 委托书详情
  powerDetailVisible: false, // 委托书详情弹框
  powerDetailCustOptions: [], // 授权书详情客户名称
  powerDetailPersonOptions: [], // 授权书详情人员名称
  powerCustomerVisible: false, // 授权客户弹框
  powerCustomerList: [], // 授权书默认全部客户列表
  powerCustomerTargetKeys: [], // 授权书已选择的客户
  otherDetail: {}, // 其他证件详情
  otherDetailVisible: false, // 其他证件详情弹框
  otherCustOptions: [], // 其他证件客户名称
  allCustomerOptions: [], // 所有供应商下拉列表
  certificateNum: {}, // 所有证件数据
  companyDetailVisible: false, // 企业证件
  companyDetail: {},
  companyLifeObj: {},
  refuseReasonList: [], // 拒绝原因
  otherTypeOptions: {}, // 其他证件 证件类型下拉选项


  viewStep: 2, // 查看步骤
  viewStatus: 4, // 查看注册证弹框状态


  detailModalVisible: false, // 回溯查看弹框
  certificateDetail: {}, // 回溯数据
}

export default dvaModelExtend({
  namespace: 'newCustomerCertificate',
  state: {},
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname, search }) => {
        const query = parse(search, { ignoreQueryPrefix: true })
        if (pathname === '/newCredentials/newCustomerCertificate') {
          // 初始化数据
          dispatch({
            type: 'updateState',
            payload: initState,
          })

          // 获取注册证配置
          dispatch({
            type: 'app/getRegistList',
          })

          // 获取我的客户列表数据
          dispatch({ type: 'getCertificateList', payload: { current: 1, pageSize: 10, certificateExpiredType: query && query.certificateExpiredType ? query.certificateExpiredType : null, certificateType: '1' } })
          // 获取证件数量
          // dispatch({ type: 'getCertificateNum' })
          // 获取拒绝原因
          dispatch({ type: 'getRefuseReasonList', payload: { dicKey: 'BGREFUSEREASON' } })
          // 默认查询默认下拉供应商
          dispatch({ type: 'getCustomerOptions', payload: { keywords: '' } })
        }
      })
    },
  },
  effects: {
    // 获取拒绝原因
    * getRefuseReasonList({ payload }, { call, put }) {
      const { content } = yield call(getRefuseReasonListData, payload)
      yield put({
        type: 'updateState',
        payload: {
          refuseReasonList: content,
        },
      })
    },
    // 获取证件数量
    * getCertificateNum({ payload }, { call, put, select }) {
      // const { content } = yield call(getCertificateNumData, payload)
      const list = [
        getValidStatisticsData,
        getFactoryAgentData,
        getOtherStatisticsData,
        getAuthStatisticsData,
        getPowerStatisticsData,
        getRegistStatisticsData,
      ]
      const obj = {}
      for (let i = 0; i < list.length; i += 1) {
        const { content } = yield call(list[i], payload)
        const key = Object.keys(content)
        obj[key] = content[key]
      }
      const certificateNum = yield select(({ newCustomerCertificate }) =>
        newCustomerCertificate.certificateNum)
      yield put({
        type: 'updateState',
        payload: {
          certificateNum: {
            ...certificateNum,
            ...obj,
          },
        },
      })
    },
    // 获取效期提醒过期证件数量
    * getValidStatistics({ payload }, { call, update, select }) {
      const { content } = yield call(getValidStatisticsData, payload)
      const certificateNum = yield select(({ newCustomerCertificate }) =>
        newCustomerCertificate.certificateNum)
      yield update({
        certificateNum: {
          ...certificateNum,
          ...content,
        },
      })
    },
    // 厂家总代过期证件数量
    * getFactoryAgent({ payload }, { call, update, select }) {
      const { content } = yield call(getFactoryAgentData, payload)
      const certificateNum = yield select(({ newCustomerCertificate }) =>
        newCustomerCertificate.certificateNum)
      yield update({
        certificateNum: {
          ...certificateNum,
          ...content,
        },
      })
    },
    // 其他档案过期证件数量
    * getOtherStatistics({ payload }, { call, update, select }) {
      const { content } = yield call(getOtherStatisticsData, payload)
      const certificateNum = yield select(({ newCustomerCertificate }) =>
        newCustomerCertificate.certificateNum)
      yield update({
        certificateNum: {
          ...certificateNum,
          ...content,
        },
      })
    },
    // 授权书过期证件数量
    * getAuthStatistics({ payload }, { call, update, select }) {
      const { content } = yield call(getAuthStatisticsData, payload)
      const certificateNum = yield select(({ newCustomerCertificate }) =>
        newCustomerCertificate.certificateNum)
      yield update({
        certificateNum: {
          ...certificateNum,
          ...content,
        },
      })
    },
    // 委托书过期证件数量
    * getPowerStatistics({ payload }, { call, update, select }) {
      const { content } = yield call(getPowerStatisticsData, payload)
      const certificateNum = yield select(({ newCustomerCertificate }) =>
        newCustomerCertificate.certificateNum)
      yield update({
        certificateNum: {
          ...certificateNum,
          ...content,
        },
      })
    },
    // 注册证过期证件数量
    * getRegistStatistics({ payload }, { call, update, select }) {
      const { content } = yield call(getRegistStatisticsData, payload)
      const certificateNum = yield select(({ newCustomerCertificate }) =>
        newCustomerCertificate.certificateNum)
      yield update({
        certificateNum: {
          ...certificateNum,
          ...content,
        },
      })
    },
    // 获取效期提醒列表
    * getCertificateList({ payload }, { call, put }) {
      const { content } = yield call(certificateListData, payload)
      yield put({
        type: 'updateState',
        payload: {
          searchData: payload,
          dataSource: content.data,
          pagination: {
            current: content.current,
            total: content.total,
            pageSize: content.pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: total => `共有 ${total} 条数据`,
          },
        },
      })
    },
    // 效期提醒
    * getCertificateRemind({ payload }, { call }) {
      yield call(certificateRemindData, payload)
      message.success('你已成功提醒供应商维护证件', 3)
    },
    // 获取注册证列表
    * getRegistList({ payload }, { call, put }) {
      const { content } = yield call(registListData, payload)
      yield put({
        type: 'updateState',
        payload: {
          searchData: payload,
          registDataSource: content.data,
          pagination: {
            current: content.current,
            total: content.total,
            pageSize: content.pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: total => `共有 ${total} 条数据`,
          },
        },
      })
    },
    // 获取注册证详情
    * getRegistDetaiList({ payload }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          registDetailVisible: true,
        },
      })
      const { content } = yield call(registDetailData, payload)
      yield put({
        type: 'updateState',
        payload: {
          registDetail: content,
        },
      })
    },
    // 获取厂家总代三证列表
    * prodFactoryList({ payload }, { call, put }) {
      const { content } = yield call(prodFactoryListData, payload)
      yield put({
        type: 'updateState',
        payload: {
          searchData: payload,
          factoryDataSource: content.data,
          pagination: {
            current: content.current,
            total: content.total,
            pageSize: content.pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: total => `共有 ${total} 条数据`,
          },
        },
      })
    },
    // 获取厂家总代三证列表详情
    * getprodFactoryDetai({ payload }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          prodFactoryVisible: true,
        },
      })
      const { content } = yield call(prodFactoryDetailData, payload)
      yield put({
        type: 'updateState',
        payload: {
          prodFactoryDetail: content,
          prodFactoryVisible: true,
        },
      })
    },
    // 获取授权书列表
    * authList({ payload }, { call, put }) {
      const { content } = yield call(authListData, payload)
      yield put({
        type: 'updateState',
        payload: {
          searchData: payload,
          authDataSource: content.data,
          pagination: {
            current: content.current,
            total: content.total,
            pageSize: content.pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: total => `共有 ${total} 条数据`,
          },
        },
      })
    },
    // 查看授权书详情
    * getAuthDetail({ payload }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          authDetailVisible: true,
        },
      })
      const { content } = yield call(authDetailData, payload)
      yield put({
        type: 'updateState',
        payload: {
          authDetail: content,
        },
      })
    },
    // 生产厂家下拉列表
    * getFactoryOptions({ payload }, { call, put }) {
      const { content } = yield call(factoryOptionsData, payload)
      yield put({
        type: 'updateState',
        payload: {
          factoryOptions: content,
        },
      })
    },
    // 获取委托书列表
    * powerList({ payload }, { call, put }) {
      const { content } = yield call(powerListData, payload)
      yield put({
        type: 'updateState',
        payload: {
          searchData: payload,
          powerDataSource: content.data,
          pagination: {
            current: content.current,
            total: content.total,
            pageSize: content.pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: total => `共有 ${total} 条数据`,
          },
        },
      })
    },
    // 获取委托书详情
    * getPowerDetail({ payload }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          powerDetailVisible: true,
        },
      })
      const { content } = yield call(powerDetailData, payload)
      yield put({
        type: 'updateState',
        payload: {
          powerDetail: content,
        },
      })
    },
    // 获取其他证件
    * otherList({ payload }, { call, put }) {
      const { content } = yield call(otherListData, payload)
      yield put({
        type: 'updateState',
        payload: {
          searchData: payload,
          otherDataSource: content.data,
          pagination: {
            current: content.current,
            total: content.total,
            pageSize: content.pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: total => `共有 ${total} 条数据`,
          },
        },
      })
    },
    // 获取其他证件详情
    * getOtherDetail({ payload }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          otherDetailVisible: true,
        },
      })
      const { content } = yield call(otherDetailData, payload)
      yield put({
        type: 'updateState',
        payload: {
          otherDetail: content,
        },
      })
    },
    // 其他证件换证
    * setOtherReplace({ payload }, { call, put, select }) {
      const searchData = yield select(({ myCertificate }) => myCertificate.searchData)
      yield call(otherReplaceData, payload)
      yield put({
        type: 'updateState',
        payload: {
          otherDetailVisible: false,
          otherDetailData: {},
        },
      })
      message.success('换证成功', 3)
      yield put({
        type: 'otherList',
        payload: searchData,
      })
    },
    // 其他证件查询客户名称
    * getOtherCustomer({ payload }, { call, put }) {
      const { content } = yield call(otherCustomerData, payload)
      yield put({
        type: 'updateState',
        payload: {
          otherCustOptions: content,
        },
      })
    },
    // 所有供应商下拉列表
    * getCustomerOptions({ payload }, { call, put }) {
      const { content } = yield call(customerOptionsData, payload)
      yield put({
        type: 'updateState',
        payload: {
          allCustomerOptions: content,
        },
      })
    },
    // 获取企业资料
    * getCompanyDetail({ payload }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          companyDetailVisible: true,
        },
      })
      const { content } = yield call(getCompanyDetailData, payload)
      yield put({
        type: 'updateState',
        payload: {
          companyDetail: content,
        },
      })
    },
    // 注册证状态
    * registeStatus({ payload }, { call, put, select }) {
      const searchData = yield select(({ newCustomerCertificate }) =>
        newCustomerCertificate.searchData)
      yield call(registeStatusData, payload)
      yield put({
        type: 'getRegistList',
        payload: searchData,
      })
    },
    // 授权书状态
    * authStatus({ payload }, { call, put, select }) {
      const searchData = yield select(({ newCustomerCertificate }) =>
        newCustomerCertificate.searchData)
      yield call(authStatusData, payload)
      yield put({
        type: 'authList',
        payload: searchData,
      })
    },
    // 委托书状态
    * powerStatus({ payload }, { call, put, select }) {
      const searchData = yield select(({ newCustomerCertificate }) =>
        newCustomerCertificate.searchData)
      yield call(powerStatusData, payload)
      yield put({
        type: 'powerList',
        payload: searchData,
      })
    },
    // 厂家-三证状态
    * factoryStatus({ payload }, { call, put, select }) {
      const searchData = yield select(({ newCustomerCertificate }) =>
        newCustomerCertificate.searchData)
      yield call(factoryStatusData, payload)
      yield put({
        type: 'prodFactoryList',
        payload: searchData,
      })
    },
    // 其他证件状态
    * otherStatus({ payload }, { call, put, select }) {
      const searchData = yield select(({ newCustomerCertificate }) =>
        newCustomerCertificate.searchData)
      yield call(otherStatusData, payload)
      yield put({
        type: 'otherList',
        payload: searchData,
      })
    },
    // 获取其他证件证件类型下拉选项
    * getOtherTypeOptions({ payload }, { call, update }) {
      const { content } = yield call(getOtherTypeOptions, payload)
      yield update({
        otherTypeOptions: content,
      })
    },

    // 获取回溯时间轴信息
    * getCertificates({ payload }, { call, update }) {
      const { content } = yield call(getCertificates, payload)
      yield update({
        certificateDetail: content,
      })
    },

  },
  reducers: {

  },
})

