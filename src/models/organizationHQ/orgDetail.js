import pathToRegexp from 'path-to-regexp'
import { message } from 'antd'
import { AUTO_LOGIN } from '@config'
import {
  turnOther,
  getSixEightCodeTree,
  genAccount,
  verifyPhone,
  bindAccount,
  queryRunScope,
  updateRunScope,
  updateUserTag,
  dicKey,
  queryPerson,
  stopOrganization,
  getSonOrgList,
  saveOrg,
  getParentOrgList,
  saveCertificate,
  getOrgDetail,
  getCertificateList,
  updateOrgBasis,
  updateCertificate,
  changeOrgType,
} from '../../services/organization/orgDetail'
import modelExtend from '../../utils/modelExtend'

const initState = {
  accuracy: 4,
  visible: false,
  newPage: '',
  orgIdSign: '',
  extraTabButton: false,
  currentItemOrg: {},
  currentTags: {},
  selectOrg: {},
  currentOrgDetail: {},
  personList: [],
  sonOrgList: [],
  backAccountObj: {},
  backAccountIdObj: {},
  accountExitFlag: false,
  addAccountVisible: false,
  parentOrgList: [],
  parentGradeList: [],
  secondGradeList: [],
  certificateList: [],
  registerAddressChanged: false,
  workAddressChanged: false,
  registerAddressVal: '',
  workAddressVal: '',
  searchParam: {},
  personSearchParam: {},
  longStatus: false,
  modelTypeQualifications: '',
  qualificationsModalVisible: false,
  currentQualifications: {},
  fileLookModalVisible: false,
  currentItemFileModal: {},
  categoryTree: [], // 经营范围树
  category68Ids: [], // 选中的树
  autoExpandParent: true, // 自动展开
  expandedKeys: [], // 默认展开的节点
  searchValue: '',
  changeStatus: false,
  scopeModalVisible: false,
  tagModalVisible: false,
  orgStatus: 0, // 组织机构停用启用
  orgSonPagination: {
    current: 1,
    total: null,
  },
  orgPersonPagination: {
    current: 1,
    pageSize: 10,
    total: null,
  },
  hideItems: {
    sort1: false,
    sort2: false,
    sort3: false,
    sort4: false,
  },
  organizeType: [],
  currentTab: '1',
  bankLevelList: [],
  changeTypeVisible: false,
}
const riskTypeArr = ['I类', 'II类', 'III类']
const riskTypeHelperArr = ['IL', 'IIL', 'IIIL']
const formData = (data) => {
  data.forEach((item, index) => {
    let label = ''
    label += item.categoryRiskType ? `${riskTypeArr[item.categoryRiskType - 1]} ` : ''
    if (item.categoryCode && item.parentCode) {
      item.categoryCode = item.categoryCode.replace(item.parentCode, '')
    }
    label += item.categoryCode ? `[${item.categoryCode}] ` : ''
    label += item.label
    item.label = label
    let helper = ''
    helper += item.categoryRiskType ? `${riskTypeHelperArr[item.categoryRiskType - 1]} ` : ''
    helper += item.categoryCode ? `[${item.categoryCode}] ` : ''
    helper += item.nameHelper
    item.textHelp = helper
    item.index = index + 1
    if (item.children && item.children.length > 0) {
      formData(item.children)
    }
  })
}
export default modelExtend({
  namespace: 'orgDetail',
  state: initState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const { pathname } = location
        const match = pathToRegexp('/organization/detail/:id').exec(pathname)
        if (match) {
          dispatch({ type: 'app/queryAddress' })
          if (history.action !== 'POP') {
            dispatch({ type: 'updateState', payload: initState })
          }
          dispatch({ type: 'updateState', payload: { orgIdSign: match[1] } })
          dispatch({ type: 'queryDetailPage' })
          dispatch({ type: 'getSixEightCodeTree' })
          dispatch({ type: 'firstLevel' })
          dispatch({ type: 'secondLevel' })
          dispatch({ type: 'bankLevel' })
          dispatch({ type: 'getSonOrgList' })
          dispatch({ type: 'getPersonList' })
        }
      })
    },
  },
  effects: {
    // 查询机构详情
    * queryDetailPage({ payload }, { select, call, update }) {
      const { orgIdSign } = yield select(({ orgDetail }) => orgDetail)
      const { content } = yield call(getOrgDetail, { ...payload, orgIdSign })
      const { orgName, orgStatus, accuracy, parentOrgName, orgParentId } = content
      yield update({
        currentOrgDetail: content,
        orgStatus,
        accuracy,
        backAccountIdObj: { orgName, orgIdSign },
        parentOrgList: parentOrgName ? [{ orgName: parentOrgName, orgId: orgParentId }] : [],
      })
    },
    // 查询证件列表
    * getCertificateList({ payload }, { select, call, update }) {
      const { orgIdSign } = yield select(({ orgDetail }) => orgDetail)
      const { content: certificateList } = yield call(getCertificateList, { ...payload, orgIdSign })
      yield update({ certificateList })
    },
    // 异步查询上级机构下拉列表
    * queryParentOrgList({ payload }, { select, call, update }) {
      const { selectOrg, orgIdSign } = yield select(({ orgDetail }) => orgDetail)
      const { content } = yield call(getParentOrgList, { ...payload, orgIdSign })
      let handleSubmit = content || []
      const keys = content.map(({ orgId }) => orgId)
      if (!keys.includes(selectOrg.orgId) && selectOrg.orgId) {
        handleSubmit = [...content, selectOrg]
      }
      yield update({
        parentOrgList: handleSubmit,
      })
    },
    // 查询人员列表
    * getPersonList({ payload }, { select, call, update }) {
      const { orgIdSign, personSearchParam, orgPersonPagination } = yield select(
        ({ orgDetail }) => orgDetail,
      )
      const {
        content: { organizationUserInfoPageVO: personList, current, total, pageSize },
      } = yield call(queryPerson, {
        ...personSearchParam,
        orgPersonPagination,
        ...payload,
        orgIdSign,
      })
      yield update({ personList, orgPersonPagination: { current, total, pageSize } })
    },
    // 获取一级
    * firstLevel(action, { call, update }) {
      const { content } = yield call(dicKey, { dicKey: 'HOSPITAL_LEVEL' })
      yield update({
        parentGradeList: content,
      })
    },
    // 获取甲等
    * secondLevel(action, { call, update }) {
      const { content } = yield call(dicKey, { dicKey: 'HOSPITAL_ADMINISTRATIVE_LEVEL' })
      yield update({
        secondGradeList: content,
      })
    },
    // 获取银行等级
    * bankLevel({ payload }, { call, update }) {
      const { content } = yield call(dicKey, { dicKey: 'BANK_LEVEL' })
      yield update({
        bankLevelList: content,
      })
    },
    // 编辑机构
    * saveAddOrg({ payload }, { call, select, update }) {
      const { orgIdSign } = yield select(({ orgDetail }) => orgDetail)
      yield call(saveOrg, { ...payload, orgIdSign })
      yield update({
        visible: false,
      })
      message.success('保存成功')
      const { content } = yield call(getOrgDetail, { orgIdSign })
      yield update({ currentOrgDetail: content, orgStatus: content.orgStatus })
    },
    // 查询子机构
    * getSonOrgList({ payload }, { select, call, update }) {
      const { orgIdSign } = yield select(({ orgDetail }) => orgDetail)
      const {
        content: { data: sonOrgList, total, current },
      } = yield call(getSonOrgList, {
        ...payload,
        orgIdSign,
      })
      yield update({ sonOrgList, orgSonPagination: { total, current } })
    },
    // 停用启用组织机构
    * stopOrganization({ payload }, { select, call, update }) {
      const { orgIdSign } = yield select(({ orgDetail }) => orgDetail)
      yield call(stopOrganization, { ...payload, orgIdSign })
      message.success('操作成功')
      const data = yield call(getOrgDetail, { ...payload })
      yield update({ currentOrgDetail: data.content, orgStatus: data.content.orgStatus })
    },
    // 添加资质证件
    * addQualifications({ payload }, { select, call, update }) {
      const { orgIdSign } = yield select(({ orgDetail }) => orgDetail)
      yield call(saveCertificate, { ...payload, orgIdSign })
      message.success('添加成功')
      yield update({ qualificationsModalVisible: false })
      const { content: certificateList } = yield call(getCertificateList, { orgIdSign })
      yield update({ certificateList })
    },
    // 编辑资质证件
    * editQualifications({ payload }, { select, call, update }) {
      const { orgIdSign } = yield select(({ orgDetail }) => orgDetail)
      yield call(updateCertificate, { ...payload, orgIdSign })
      message.success('修改成功')
      yield update({ qualificationsModalVisible: false })
      const { content: certificateList } = yield call(getCertificateList, { orgIdSign })
      yield update({ certificateList })
    },
    // 获取68码树经营范围
    * getSixEightCodeTree(_, { call, update }) {
      const { content } = yield call(getSixEightCodeTree)
      formData(content)
      yield update({
        categoryTree: content,
      })
    },
    // 查询默认经营范围
    * queryDefaultTree(action, { select, call, update }) {
      const { orgIdSign: orgId } = yield select(({ orgDetail }) => orgDetail)
      yield update({ scopeModalVisible: true })
      const { content } = yield call(queryRunScope, { orgId })
      yield update({
        category68Ids: content,
        expandedKeys: content,
        changeStatus: false,
      })
    },
    // 经营范围设置更新
    * setScope(action, { select, call, update }) {
      const { orgIdSign: orgId } = yield select(({ orgDetail }) => orgDetail)
      const { category68Ids, changeStatus } = yield select(({ orgDetail }) => orgDetail)
      if (changeStatus) {
        yield call(updateRunScope, { orgId, category68Ids })
        message.success('修改成功')
        yield update({
          scopeModalVisible: false,
          category68Ids: [],
          autoExpandParent: true,
          changeStatus: false,
        })
      } else {
        yield update({ scopeModalVisible: false, category68Ids: [], autoExpandParent: true })
      }
    },
    // 基础信息设置
    * setBasicMsg({ payload }, { select, call }) {
      const { orgIdSign } = yield select(({ orgDetail }) => orgDetail)
      yield call(updateOrgBasis, { ...payload, orgIdSign })
      message.success('设置成功')
    },
    // 人员设置标签
    * updateUserTag({ payload }, { select, call, update }) {
      const { orgIdSign, personSearchParam } = yield select(({ orgDetail }) => orgDetail)
      yield call(updateUserTag, { ...payload, orgIdSign })
      message.success('设置成功')
      yield update({
        tagModalVisible: false,
      })
      const {
        content: { organizationUserInfoPageVO: personList, current, total, pageSize },
      } = yield call(queryPerson, { ...payload, ...personSearchParam, orgIdSign })
      yield update({ personList, orgPersonPagination: { current, total, pageSize } })
    },
    // 校验手机号用户是否存在
    * acyMobile({ payload }, { call, update }) {
      const { content: backAccountObj } = yield call(verifyPhone, { ...payload })
      if (backAccountObj.mobile) {
        yield update({ accountExitFlag: true, backAccountObj })
      }
    },
    // 生成账号
    * genAccount({ payload }, { select, call, update }) {
      const {
        currentOrgDetail: { orgIdSign: orgId, orgTypeCode: orgTypeValue },
      } = yield select(({ orgDetail }) => orgDetail)
      yield call(genAccount, { ...payload, orgId, orgTypeValue })
      message.success('生成账号成功')
      yield update({
        accountExitFlag: false,
        addAccountVisible: false,
        backAccountIdObj: {},
        backAccountObj: {},
      })
      // 重新查询页面详情
      const { content } = yield call(getOrgDetail, { ...payload, orgIdSign: orgId })
      const { orgName, orgStatus, accuracy } = content
      yield update({
        currentOrgDetail: content,
        orgStatus,
        accuracy,
        backAccountIdObj: { orgName, orgIdSign: orgId },
      })
    },
    // 绑定账号
    * bindAccount({ payload }, { select, call, update }) {
      const {
        orgIdSign,
        backAccountObj: { userId },
      } = yield select(({ orgDetail }) => orgDetail)
      yield call(bindAccount, { userId, orgId: orgIdSign })
      message.success('绑定成功')
      yield update({
        accountExitFlag: false,
        addAccountVisible: false,
        backAccountIdObj: {},
        backAccountObj: {},
      })

      // 重新查询页面详情
      const { content } = yield call(getOrgDetail, { ...payload, orgIdSign })
      const { orgName, orgStatus, accuracy } = content
      yield update({
        currentOrgDetail: content,
        orgStatus,
        accuracy,
        backAccountIdObj: { orgName, orgIdSign },
      })
    },
    // 跳转其他平台
    * turnOther({ payload }, { call }) {
      const { content: token } = yield call(turnOther, payload)
      window.open(`${AUTO_LOGIN}?token=${token}`)
    },
    // 更改机构类型
    * changeOrgType({ payload }, { select, call, update, put }) {
      const { orgIdSign } = yield select(({ orgDetail }) => orgDetail)
      yield call(changeOrgType, { orgId: orgIdSign, ...payload })
      message.success('更改成功!')
      yield update({
        changeTypeVisible: false,
      })
      yield put({ type: 'queryDetailPage' })
    },
  },
  reducers: {},
})
