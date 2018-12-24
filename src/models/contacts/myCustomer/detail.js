import {
  getCustomerDetailData,
  getEmptyCustomerDetailData,
  getDetailListData,
} from '../../../services/contacts/myCustomer/detail.js'
import {
  removeRelation,
  recoverRelation,
  recoverRelationSync,
} from '../../../services/contacts/myCustomer'
import modelExtend from '../../../utils/modelExtend'
import { message } from 'antd'
import pathToRegexp from 'path-to-regexp'
import { routerRedux } from 'dva/router'
import { retAppraiseList } from '../../../routes/contacts/mySupplier/detailData'
import { stringify, parse } from 'qs'
// 初始化数据
const initState = {
  id: '', // 我的客户Id
  contactsType: '', // 是否解除关系  1 是正常 2 是解除关系 3是区分申请过来的转台
  customerDetail: {},
  applyVisible: false,
  pathTo: '',
  detailData: [], // 评价列表
  detailPagination: {}, // 评价分页翻页
  searchData: {},
  isNewRelation: false,
} // 我的客户详情

export default modelExtend({
  namespace: 'myCustomerDetail',
  state: {},
  subscriptions: {
    setup({ dispatch, history }) {
      // 获取地址
      history.listen(({ pathname, search }) => {
        const query = parse(search, { ignoreQueryPrefix: true })
        const match = pathToRegexp('/contacts/myCustomer/detail/:id').exec(pathname)
        if (match) {
          const id = match[1]
          // 初始化数据
          dispatch({ type: 'updateState', payload: { ...initState, id, contactsType: query.status, pathTo: '/contacts/myCustomer' } })
          // 获取我的客户详情
          let reqData = {}
          if (query.status === '3' || query.status === '2') {
            reqData = {
              orgIdSign: id,
            }
          } else {
            reqData = {
              customerOrgId: id,
            }
          }
          dispatch({ type: 'getCustomerList', payload: reqData })
          dispatch({ type: 'getDetailList', payload: { orgIdSign: id, relation: query.status === '1' ? 1 : 2 } })
        }
        const detailMatch = pathToRegexp('/contacts/newContactsRelation/customerDetail/:id').exec(pathname)
        if (detailMatch) {
          const id = detailMatch[1]
          // 初始化数据
          dispatch({ type: 'updateState', payload: { ...initState, id, contactsType: query.status, pathTo: '/contacts/newContactsRelation', isNewRelation: query.isNewRelation === 'true' } })
          // 获取我的客户详情
          let reqData = {}
          if (query.status === '3' || query.status === '2') {
            reqData = {
              orgIdSign: id,
            }
          } else {
            reqData = {
              customerOrgId: id,
            }
          }
          dispatch({ type: 'getCustomerList', payload: reqData })
          dispatch({ type: 'getDetailList', payload: { orgIdSign: id, relation: query.status === '1' ? 1 : 2 } })
        }
      })
    },
  },
  effects: {
    // 获取我的客户详情
    * getCustomerList({ payload }, { call, update, select }) {
      const { contactsType } = yield select(({ myCustomerDetail }) => myCustomerDetail)
      if (parseInt(contactsType, 10) === 1) {
        const { content } = yield call(getCustomerDetailData, payload)
        content.appraise.counts = retAppraiseList(content.appraise.counts)
        yield update({
          customerDetail: content,
        })
      } else if (parseInt(contactsType, 10) === 2 || parseInt(contactsType, 10) === 3) {
        const { content } = yield call(getEmptyCustomerDetailData, payload)
        content.appraise.counts = retAppraiseList(content.appraise.counts)
        yield update({
          customerDetail: content,
        })
      }
    },
    // 解除我的客户关系
    * setRemoveRelation({ payload }, { call, put, select }) {
      const id = yield select(({ myCustomerDetail }) => myCustomerDetail.id)
      const data = yield call(removeRelation, payload)
      message.success('解除成功', 3)
      yield put(routerRedux.replace({
        pathname: `/contacts/myCustomer/detail/${id}?status=3`,
      }))
    },
    // 恢复我的客户关系 异步校验
    * setRecoverRelationSync({ payload }, { call, put }) {
      const data = yield call(recoverRelationSync, payload)
      if (data.code === 201) {
        yield put({
          type: 'updateState',
          payload: {
            applyVisible: true,
          },
        })
      } else if (data.code === 202) {
        message.error('你已经申请，请勿重复申请', 3)
      }
    },
    // 恢复我的客户关系
    * setRecoverRelation({ payload }, { call, put, select }) {
      const id = yield select(({ myCustomerDetail }) => myCustomerDetail.id)
      const data = yield call(recoverRelation, payload)
      message.success('恢复申请发送成功!', 3)
      yield put(routerRedux.replace({
        pathname: `/contacts/myCustomer/detail/${id}?status=2`,
      }))
    },
    // 获取详细评价列表
    * getDetailList({ payload }, { call, put }) {
      const { content } = yield call(getDetailListData, payload)
      yield put({
        type: 'updateState',
        payload: {
          detailData: content.data,
          searchData: payload,
          detailPagination: {
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
  },
  reducers: {

  },
})
