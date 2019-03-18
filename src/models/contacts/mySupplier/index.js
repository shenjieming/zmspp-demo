import { message } from 'antd'
import { modelExtend, getSetup } from '../../../utils'
import * as services from '../../../services/contacts/mySupplier'

const initState = {
  modalVisible: false,
  editModalVisible: false,
  applyModalVisible: false,
  supplierOrgId: '',
  modalType: 'edit',
  tableData: [],
  applyList: [],
  modalInitValue: {},
  orgIdSign: '',
  pageConfig: {
    current: 1,
    pageSize: 10,
    total: null,
  },
}
const unstableState = {
  searchKeys: {
    current: 1,
    pageSize: 10,
    supplierStatus: null,
    keywords: null,
  },
}

export default modelExtend({
  namespace: 'mySupplier',
  state: { ...initState, ...unstableState },
  subscriptions: getSetup({
    path: '/contacts/mySupplier',
    initFun({ toAction, history }) {
      toAction(initState)
      if (history.action !== 'POP') {
        toAction(unstableState)
      }
      toAction('suppliers')
    },
  }),

  effects: {
    // 分页显示我的供应商列表
    * suppliers({ payload }, { call, toAction, select }) {
      const req = payload ||
        (yield select(({ mySupplier }) => mySupplier.searchKeys))
      const { content } = yield call(services.suppliers, req)
      yield toAction({
        tableData: content.suppliers || [],
        searchKeys: req,
        modalInitValue: {},
        pageConfig: {
          current: content.current,
          pageSize: content.pageSize,
          total: content.total,
        },
      })
    },

    // 编辑供应商联系人信息
    * contact({ payload }, { call, toAction }) {
      yield call(services.contact, payload)
      yield [
        toAction({ editModalVisible: false }),
        toAction('suppliers'),
      ]
      message.success('修改成功')
    },
    // 解除供应商关系
    * remove({ payload }, { call, toAction }) {
      yield call(services.remove, payload)
      yield toAction('suppliers')
      message.success('解除成功')
    },
    // 恢复供应商关系异步校验
    * check({ payload }, { call, toAction }) {
      const { code } = yield call(services.check, payload)
      if (code === 201) {
        yield toAction({
          modalType: 'check',
          editModalVisible: true,
        })
      } else if (code === 202) {
        message.error('你已经申请，请勿重复申请')
      }
    },
    // 开启证件修改
    * open({ payload }, { call, toAction }) {
      yield call(services.open, payload)
      yield toAction('suppliers')
      message.success('开启成功')
    },
    // 关闭证件修改
    * close({ payload }, { call, toAction }) {
      const { code } = yield call(services.close, payload)
      yield toAction('suppliers')
      if (code === 201) {
        yield toAction({
          modalType: 'check',
          editModalVisible: true,
        })
      } else if (code === 202) {
        message.error('你已经申请，请勿重复申请')
      }
    },
    // 申请恢复供应商关系
    * recover({ payload }, { call, toAction, select }) {
      const { supplierOrgId } = yield select(({ mySupplier }) => mySupplier)
      const { applyDescription } = payload
      yield call(services.recover, { applyDescription, supplierOrgId })
      yield [
        toAction({ editModalVisible: false }),
        toAction('suppliers'),
      ]
      message.success('发起申请成功')
    },
    // 添加供应商列表
    * addSuppliersList({ payload }, { call, toAction }) {
      const req = payload || {
        keywords: null,
        orgRegAddr: null,
      }
      const { content } = yield call(services.addSuppliersList, req)
      const applyList = content.applyList.map(item => ({
        ...item,
        orgSupplierReviewFlag: content.orgSupplierReviewFlag,
        orgTypeValue: content.orgTypeValue,
      }))

      yield toAction({ applyList })
    },
    // 申请添加供应商
    * applyAddSuppliers({ payload }, { call, toAction, select }) {
      const { orgIdSign } = yield select(({ mySupplier }) => mySupplier)
      const req = payload
      req.orgIdSign = orgIdSign
      yield call(services.applyAddSuppliers, req)
      yield [
        toAction('addSuppliersList'),
        toAction('suppliers'),
        toAction({
          orgIdSign: '',
          applyModalVisible: false,
        }),
      ]
      message.success('发起申请成功！')
    },
    // 直接添加供应商
    * addSuppliers({ payload }, { call, toAction }) {
      yield call(services.applyAddSuppliers, payload)
      yield [
        toAction('addSuppliersList'),
        toAction('suppliers'),
        toAction({ orgIdSign: '' }),
      ]
      message.success('添加成功！')
    },
  },
})
