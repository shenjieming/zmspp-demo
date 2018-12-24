import { message } from 'antd'
import { modelExtend, getSetup } from '../../../utils'
import * as services from '../../../services/purchase/addForDic'

const initState = {
  editModalVisible: false,
  codeMust: false,
  modalInitValue: {},
  suppliersSelect: [],
  poduceFactoryArr: [],
  certificateArr: [],
  categoryTree: [],
  searchKeys: {
    current: 1,
    pageSize: 10,
    categoryId: '',
    certificateId: '',
    factoryId: '',
    materialsKeywords: '',
    skuKeywords: '',
  },
  tableData: [],
  pageConfig: {
    current: 1,
    pageSize: 10,
    total: null,
  },
}

export default modelExtend({
  namespace: 'addForDic',
  state: initState,
  subscriptions: getSetup({
    path: '/purchase/addForDic',
    initFun({ toAction }) {
      toAction(initState)
      toAction('terrace')
      toAction('getProduceFactoryInfo')
      toAction('certificate')
      toAction('category68')
    },
  }),

  effects: {
    // 平台标准字典查询（方仪楠）
    * terrace({ payload }, { call, toAction, select }) {
      const req = payload ||
        (yield select(({ addForDic }) => addForDic.searchKeys))
      const { content } = yield call(services.terrace, req)
      yield toAction({
        tableData: content.data || [],
        searchKeys: req,
        pageConfig: {
          current: content.current,
          pageSize: content.pageSize,
          total: content.total,
        },
      })
    },
    // 我的供应商下拉列表
    * suppliersSelect({ payload }, { call, toAction }) {
      const { content } = yield call(services.suppliers, payload)
      yield toAction({ suppliersSelect: content })
    },
    // 添加物料
    * addStandardMaterial({ payload }, { call, toAction }) {
      yield call(services.addStandardMaterial, payload)
      yield [
        toAction('terrace'),
        toAction({
          editModalVisible: false,
          modalInitValue: {},
        }),
      ]
      message.success('添加成功')
    },
    // 获取生产厂家信息
    * getProduceFactoryInfo({ payload }, { call, toAction }) {
      const { content } = yield call(services.getProduceFactoryInfo, payload || { keywords: null })
      yield toAction({ poduceFactoryArr: content })
    },
    // 获取注册证选项
    * certificate({ payload }, { call, toAction }) {
      const { content } = yield call(services.certificate, payload || { keywords: null })
      yield toAction({ certificateArr: content })
    },
    // 物料68分类选项查询
    * category68({ payload }, { call, toAction }) {
      const { content } = yield call(services.category68, payload)
      yield toAction({ categoryTree: content })
    },
  },
})
