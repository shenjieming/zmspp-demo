import { message } from 'antd'
import * as services from '../../../services/contacts/mySupplier/detail'
import { modelExtend, getSetup } from '../../../utils'

const initState = {
  supplierOrgId: '',
  supplierStatus: '', // 1 已建立 2 已解除 3 未建立
  supplierDetail: {},
  appraise: {},
  detailData: [],
  applyModalVisible: false,
  isNewRelation: false,
  tabStatus: '1',
  pageConfig: {
    current: 1,
    pageSize: 10,
    total: null,
  },
  searchKey: {
    appraise: null,
    appraiseFlag: '1',
    orgIdSign: null,
    relation: null,
    starLevel: null,
    current: 1,
    pageSize: 10,
  },
}

export default modelExtend({
  namespace: 'mySupplierDetail',
  state: initState,
  subscriptions: getSetup({
    path: [
      '/contacts/mySupplier/detail/:id',
      '/contacts/newContactsRelation/supplierDetail/:id',
      '/contacts/newContactsRelationHQ/supplierDetail/:id',
      '/contacts/newContactsRelationZZ/supplierDetail/:id',
    ],
    initFun({ toAction, id, query }) {
      toAction(initState)
      toAction({
        supplierOrgId: id,
        supplierStatus: query.status,
        isNewRelation: query.isNewRelation === 'true',
      })
      toAction({
        supplierOrgId: id,
        supplierStatus: query.status,
      }, 'supplierDetail')
      toAction({
        ...initState.searchKey,
        orgIdSign: id,
        relation: query.status === '1' ? 1 : 2,
      }, 'appraises')
    },
  }),
  effects: {
    // 供应商详情
    * supplierDetail({ payload: { supplierOrgId, supplierStatus } }, { call, toAction }) {
      if (supplierStatus - 0 === 1) {
        const { content } = yield call(services.supplierDetail, { supplierOrgId })
        const appraise = content.appraise
        yield toAction({ supplierDetail: content, appraise })
      } else if ([2, 3].includes(supplierStatus - 0)) {
        const { content } = yield call(services.emptySupplierDetail, { orgIdSign: supplierOrgId })
        const appraise = content.appraise
        yield toAction({ supplierDetail: content, appraise })
      }
    },
    // 解除供应商关系
    * removeRelation({ payload }, { call }) {
      yield call(services.removeRelation, payload)
      message.success('解除成功')
    },
    // 恢复供应商关系异步校验
    * recoverRelationCheck({ payload }, { call, toAction }) {
      const { code } = yield call(services.recoverRelationCheck, payload)
      if (code === 201) {
        yield toAction({ applyModalVisible: true })
      } else if (code === 202) {
        message.error('你已经申请，请勿重复申请')
      }
    },
    // 恢复供应商关系
    * recoverRelation({ payload }, { call, toAction }) {
      yield call(services.recoverRelation, payload)
      message.success('发起申请成功')
      yield toAction({ applyModalVisible: false })
    },
    // 评价列表
    * appraises({ payload }, { call, toAction }) {
      const { content } = yield call(services.appraises, payload)
      yield toAction({
        searchKey: payload,
        detailData: content.data,
        pageConfig: {
          current: content.current,
          pageSize: content.pageSize,
          total: content.total,
        },
      })
    },
  },
})
