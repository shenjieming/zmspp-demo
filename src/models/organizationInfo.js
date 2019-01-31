import { message } from 'antd'
import { modelExtend } from '../utils'
import {
  afterLogin,
  dicKey,
  getOrgAuditDetail,
  complementInfo,
  getParentOrgList,
} from '../services/organizationInfo'
import { typeId } from '../routes/App/modalData'

export default modelExtend({
  state: {
  },
  effects: {
    // 是否需要补全
    * afterLogin({ payload }, { call, toAction, put }) {
      const { content } = yield call(afterLogin, payload)
      if (content.needCompleteInfo === 1) {
        content.auditStatus = 2
      }
      yield toAction(content, 'organizationInfo')
      if ([0, 1, 3].includes(content.auditStatus)) {
        if (content.orgType === typeId.hospital) {
          yield toAction('dicKey')
        }
        if ([1, 3].includes(content.auditStatus)) {
          yield toAction({ orgIdSign: content.orgIdSign }, 'getOrgAuditDetail')
        }
        yield toAction('queryAddress')
      }
    },

    // 异步查询上级机构下拉列表
    * queryParentOrgList({ payload }, { select, call, toAction }) {
      const { organizationInfo } = yield select(({ app }) => app)
      const { selectOrg, orgIdSign } = organizationInfo
      const { content } = yield call(getParentOrgList, { ...payload, orgIdSign })
      let handleSubmit = content || []
      const keys = content.map(({ orgId }) => orgId)
      if (!keys.includes(selectOrg.orgId) && selectOrg.orgId) {
        handleSubmit = [...content, selectOrg]
      }
      yield toAction(
        {
          parentOrgList: handleSubmit,
        },
        'organizationInfo',
      )
    },

    // 根据字典唯一关键字获取字典值列表
    * dicKey(_, { call, toAction }) {
      const { content: parentGrade } = yield call(dicKey, { dicKey: 'HOSPITAL_LEVEL' })
      const { content: secondGrade } = yield call(dicKey, {
        dicKey: 'HOSPITAL_ADMINISTRATIVE_LEVEL',
      })
      const mapFun = arr =>
        arr.map(({ dicValue, dicValueText }) => ({
          id: dicValue,
          name: dicValueText,
        }))
      yield toAction(
        {
          parentGrade: mapFun(parentGrade),
          secondGrade: mapFun(secondGrade),
        },
        'organizationInfo',
      )
    },

    // 获取审核机构详情
    * getOrgAuditDetail({ payload }, { call, toAction }) {
      const { content } = yield call(getOrgAuditDetail, payload)
      const { orgParentName, orgParentId } = content
      yield toAction(
        {
          orgDetail: content,
          profit: content.profit === undefined ? true : content.profit,
          parentOrgList: orgParentName ? [{ orgName: orgParentName, orgId: orgParentId }] : [],
        },
        'organizationInfo',
      )
    },

    // 提交审核
    * complementInfo({ payload }, { call, toAction }) {
      const req = payload
      if (['0', '1'].includes(req.profit)) {
        req.profit = !!(req.profit - 0)
      }
      yield call(complementInfo, req)
      message.success('提交成功')
      yield toAction('afterLogin')
    },
  },
  reducers: {
    organizationInfo(state, { payload }) {
      const organizationInfo = {
        ...state.organizationInfo,
        ...payload,
      }
      return { ...state, organizationInfo }
    },
  },
})
