import { message } from 'antd'
import qs from 'qs'
import { AUTO_LOGIN } from '@config'
import {
  turnOther,
  getParentOrgList,
  dicKey,
  saveOrg,
  updateOrgStatus,
  getOrgListZZ,
  getOrgAuditDetail,
  genAccount,
  verifyPhone,
  bindAccount,
} from '../../services/organization'
import modelExtend from '../../utils/modelExtend'

const initState = {
  visible: false,
  addAccountVisible: false,
  reviewModalVisible: false,
  accountExitFlag: false,
  backAccountObj: {}, // 异步查询手机号返回信息
  backAccountIdObj: {},
  currentItemOrg: {},
  auditDetailObj: {},
  list: [],
  parentOrgList: [],
  parentGradeList: [],
  secondGradeList: [],
  bankLevelList: [],
  registerAddressChanged: false,
  workAddressChanged: false,
  registerAddressVal: '',
  workAddressVal: '',
  selectOrg: {},
  searchParam: {},
  pagination: {
    showTotal: total => `共 ${total} 条`,
    current: 1,
    total: null,
  },
  hideItems: {
    sort1: false,
    sort2: false,
    sort3: false,
    sort4: false,
  },
  organizeType: [],
}
export default modelExtend({
  namespace: 'organizationZZ',
  state: initState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const { search } = location
        const { detailBack } = qs.parse(search, { ignoreQueryPrefix: true })
        if (location.pathname === '/newCredentials/organizationZZ') {
          dispatch({ type: 'app/queryAddress' })
          if (!detailBack) {
            if (history.action !== 'POP') {
              dispatch({ type: 'updateState', payload: initState })
            }
            dispatch({ type: 'queryTableList' })
          }
        }
      })
    },
  },
  effects: {
    // 查询table组织机构列表
    * queryTableList({ payload }, { call, select, update }) {
      const { searchParam, pagination } = yield select(({ organizationZZ }) => organizationZZ)
      const { content: { data, current, total, pageSize } } = yield call(getOrgListZZ, {
        ...searchParam,
        ...pagination,
        ...payload,
      })
      yield update({ list: data, pagination: { total, current, pageSize } })
    },
    // 异步查询上级机构下拉列表
    * queryParentOrgList({ payload }, { select, call, update }) {
      const { selectOrg } = yield select(({ organizationZZ }) => organizationZZ)
      const { content } = yield call(getParentOrgList, { ...payload })
      let handleSubmit = content || []
      const keys = content.map(({ orgId }) => orgId)
      if (!keys.includes(selectOrg.orgId) && selectOrg.orgId) {
        handleSubmit = [...content, selectOrg]
      }
      yield update({
        parentOrgList: handleSubmit,
      })
    },
    // 获取一级
    * firstLevel({ payload }, { call, update }) {
      const { content } = yield call(dicKey, { dicKey: 'HOSPITAL_LEVEL' })
      yield update({
        parentGradeList: content,
      })
    },
    // 获取甲等
    * secondLevel({ payload }, { call, update }) {
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
    // 新增机构
    * saveAddOrg({ payload }, { call, select, update }) {
      const { searchParam } = yield select(({ organizationZZ }) => organizationZZ)
      yield call(saveOrg, { ...payload })
      yield update({
        visible: false,
      })
      message.success('添加成功')
      const { content: { data, current, total, pageSize } } = yield call(getOrgListZZ, {
        ...searchParam,
      })
      yield update({ list: data, pagination: { total, current, pageSize } })
    },
    // 新增机构并添加账号
    * saveAddAccount({ payload }, { call, select, update }) {
      const { searchParam } = yield select(({ getOrgListZZ }) => getOrgListZZ)
      const { orgName } = payload
      const { content: { orgIdSign } } = yield call(saveOrg, { ...payload })
      yield update({
        visible: false,
        addAccountVisible: true,
        orgTypeValue: payload.orgTypeCode,
        backAccountIdObj: {
          orgIdSign,
          orgName,
        },
      })
      message.success('添加成功')
      const { content: { data, current, total, pageSize } } = yield call(getOrgListZZ, {
        ...searchParam,
      })
      yield update({ list: data, pagination: { total, current, pageSize } })
    },
    // 获取审核机构详情
    * getOrgAuditDetail({ payload }, { call, update }) {
      yield update({ reviewModalVisible: true })
      const { content: auditDetailObj } = yield call(getOrgAuditDetail, { ...payload })
      yield update({ auditDetailObj })
    },
    // 拒绝通过机构
    * refuseOrg({ payload }, { select, call, update }) {
      yield call(updateOrgStatus, { ...payload })
      yield update({ reviewModalVisible: false })
      message.success('操作成功')
      const { searchParam } = yield select(({ organizationZZ }) => organizationZZ)
      const { content: { data, current, total, pageSize } } = yield call(getOrgListZZ, {
        ...searchParam,
      })
      yield update({ list: data, pagination: { total, current, pageSize } })
    },
    // 审核通过机构
    * passOrg({ payload }, { select, call, update }) {
      yield call(updateOrgStatus, { ...payload })
      yield update({ reviewModalVisible: false })
      message.success('操作成功')
      const { searchParam } = yield select(({ organizationZZ }) => organizationZZ)
      const { content: { data, current, total, pageSize } } = yield call(getOrgListZZ, {
        ...searchParam,
      })
      yield update({ list: data, pagination: { total, current, pageSize } })
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
      const { orgTypeValue, backAccountIdObj: { orgIdSign: orgId } } = yield select(
        ({ getOrgListZZ }) => getOrgListZZ,
      )
      yield call(genAccount, { ...payload, orgId, orgTypeValue })
      message.success('生成账号成功')
      yield update({
        accountExitFlag: false,
        addAccountVisible: false,
        backAccountIdObj: {},
        backAccountObj: {},
      })
    },
    // 绑定账号
    * bindAccount({ payload }, { select, call, update }) {
      const { backAccountIdObj: { orgIdSign: orgId }, backAccountObj: { userId } } = yield select(
        ({ getOrgListZZ }) => getOrgListZZ,
      )
      yield call(bindAccount, { userId, orgId })
      message.success('绑定成功')
      yield update({
        accountExitFlag: false,
        addAccountVisible: false,
        backAccountIdObj: {},
        backAccountObj: {},
      })
    },
    // 跳转其他平台
    * turnOther({ payload }, { call }) {
      const { content: token } = yield call(turnOther, payload)
      window.open(`${AUTO_LOGIN}?token=${token}`)
    },
  },
  reducers: {},
})
