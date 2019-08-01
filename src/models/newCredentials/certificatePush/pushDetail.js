import React from 'react'
import pathToRegexp from 'path-to-regexp'
import { message, Modal } from 'antd'

import modelExtend from '../../../utils/modelExtend'
import {generateRequest, getServices} from '../../../utils'
import {getMenuData, useTableDataExport} from "../../../services/supplyCatalogue/detail";
import {baseURL, exportUrl} from '../../../utils/config'
console.log(exportUrl)
const services = getServices({
  // 用户详情
  customerDetail: '/supply/catalog/customer/statistic',
  // 证件数量
  certificateNum: '/certificate/supplier/register/push/statistics',
  // 待审核证件
  pendingReviewCertificate: '/certificate/supplier/register/push/list/review',
  // 已通过
  refusedCertificate: '/certificate/supplier/register/push/list/refused',
  // 已拒绝
  acceptCertificate: '/certificate/supplier/register/push/list/accept',
  // 已撤销
  cancelNumberCertificate: '/certificate/supplier/register/push/list/cancel',
  // 待主任审核
  secondReviewNumber: '/certificate/supplier/register/push/list/second-review',
  // getMenuData: generateRequest(`${baseURL}/menu/own`, 'post'),
  getMenuData: { url: '/menu/own', type: 'post'},
  revertPush: '/certificate/register/push/status/cancel',
  repush: '/certificate/supplier/repush/certificate',
  deletePush: '/certificate/register/push/delete',
  // 获取审核证件列表
  certificateDetail: { url: '/certificate/register/push/detail', type: 'post' },
})
const tableExport = exportUrl + '/certificate/supplier/register/push/list/refused/export'
const initState = {
  // 当前分页
  currentIndex: '1',
  // 客户信息
  customerInfo: {},
  // 数量信息
  numInfo: {},
  // 推送列表
  data: [],
  // 分页信息
  pagination: {
    current: 1,
    pageSize: 10,
    total: undefined,
  },
  tabKey: '',
  // 搜索参数
  searchParams: {},
  // 查看推送详情
  viewModalVisble: false,
  certificateDetail: {
    certificates: [],
  },
}

const errorMessage = errorList =>
  errorList.map(({ data, title }) => {
    if (!data.length) {
      return ''
    }
    const certificateNos = data.map(item => <div>{item}</div>)
    return (
      <div>
        {title}：{certificateNos}
      </div>
    )
  })
export default modelExtend({
  namespace: 'pushDetail',
  state: initState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const match = pathToRegexp('/newCredentials/certificatePush/detail/:id').exec(pathname)
        if (match) {
          if (history.action !== 'POP') {
            // 初始化数据
            dispatch({ type: 'updateState', payload: initState })
          }
          dispatch({ type: 'updateState', payload: { customerInfo: { customerId: match[1] } } })
          // 获取客户详情
          dispatch({ type: 'getCustomerDetail', payload: match[1] }).then(() => {
            // 获取当前页列表
            dispatch({ type: 'getCurrentTabData' })
            // 获取证件数量
            dispatch({ type: 'getCertificateNum' })
          })
        }
      })
    },
  },
  effects: {
    * getCustomerDetail({ payload }, { call, update }) {
      const { content } = yield call(services.customerDetail, { customerOrgId: payload })
      yield update({ customerInfo: content })
    },
    * getCurrentTabData({ payload = {} }, { select, call, update }) {
      const { toPrevWhenShould } = payload
      const {
        currentIndex,
        searchParams,
        pagination,
        data: tableData,
        customerInfo: { customerOrgId },
      } = yield select(({ pushDetail }) => pushDetail)
      if (toPrevWhenShould && tableData.length === 1) {
        pagination.current = pagination.current - 1 || 1
      }
      const params = { ...pagination, ...searchParams, ...payload, customerOrgId }
      let content = {}
      switch (currentIndex) {
        case '1':
          content = yield call(services.pendingReviewCertificate, { ...params })
          break
        case '2':
          content = yield call(services.refusedCertificate, { ...params })
          break
        case '3':
          content = yield call(services.acceptCertificate, { ...params })
          break
        case '4':
          content = yield call(services.cancelNumberCertificate, { ...params })
          break
        case '5':
          content = yield call(services.secondReviewNumber, { ...params })
          break
        default:
          break
      }
      const {
        content: { data, current, total, pageSize },
      } = content
      yield update({ data, pagination: { current, total, pageSize } })
    },
    * getCertificateNum(_, { select, call, update }) {
      const {
        customerInfo: { customerOrgId },
      } = yield select(({ pushDetail }) => pushDetail)
      const {
        content: { data },
      } = yield call(services.certificateNum, { customerOrgId })
      yield update({ numInfo: data[0] || {} })
    },
    * revertPush({ payload }, { call, put }) {
      const {
        content: {
          checkCertificates,
          passedCertificates,
          rejectedCertificates,
          undoAndDeleteCertificates,
        },
      } = yield call(services.revertPush, payload)
      if (checkCertificates.length === payload.certificateIds.length) {
        message.success('撤销成功')
      } else {
        Modal.warning({
          title: undoAndDeleteCertificates.length
            ? `操作成功${undoAndDeleteCertificates.length}本证件`
            : '',
          content: errorMessage([
            { data: undoAndDeleteCertificates, title: '以下证件已被撤销或删除，无法撤销' },
            { data: passedCertificates, title: '以下证件已被医院审核通过，无法撤销' },
            { data: rejectedCertificates, title: '以下证件已被医院审核拒绝，无法撤销' },
          ]),
        })
      }
      yield put({ type: 'getCurrentTabData', payload: { toPrevWhenShould: true } })
      yield put({ type: 'getCertificateNum' })
    },
    * repush({ payload }, { call, put }) {
      const {
        content: { rePushFlag },
      } = yield call(services.repush, payload)
      if (rePushFlag) {
        message.success('重新推送成功')
      } else {
        Modal.error({ content: '重新推送失败!证件已被删除' })
      }
      yield put({ type: 'getCurrentTabData', payload: { toPrevWhenShould: true } })
      yield put({ type: 'getCertificateNum' })
    },
    * deletePush({ payload }, { call, put }) {
      const {
        content: {
          checkCertificates,
          passedCertificates,
          rejectedCertificates,
          undoAndDeleteCertificates,
        },
      } = yield call(services.deletePush, payload)
      if (
        undoAndDeleteCertificates.length + rejectedCertificates.length ===
        payload.certificateIds.length
      ) {
        message.success('删除成功')
      } else {
        Modal.warning({
          title:
            rejectedCertificates.length || undoAndDeleteCertificates.length
              ? `操作成功${rejectedCertificates.length + undoAndDeleteCertificates.length}本证件`
              : '',
          content: errorMessage([
            { data: checkCertificates, title: '以下证件待医院审核，无法撤销' },
            { data: passedCertificates, title: '以下证件已被医院审核通过，无法撤销' },
          ]),
        })
      }
      yield put({ type: 'getCurrentTabData', payload: { toPrevWhenShould: true } })
      yield put({ type: 'getCertificateNum' })
    },
    * getDetail({ payload }, { call, update }) {
      const { content } = yield call(services.certificateDetail, payload)
      yield update({ certificateDetail: content })
    },
    // 表格导出
    * exportTable({ payload }, { call, update}) {
      const { content } = yield call(services.getMenuData, payload)
      window.open(tableExport + '?orgId=' + content.currentOrgId +'&orgName=' + content.currentOrgName)
    },
  },
  reducers: {},
})
