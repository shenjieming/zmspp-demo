import pathToRegexp from 'path-to-regexp'
import React from 'react'
import { Modal } from 'antd'

import modelExtend from '../../../utils/modelExtend'
import { getServices } from '../../../utils'

const services = getServices({
  list: '/certificate/supplier/push/status/list',
  pushCertificates: '/certificate/supplier/push/certificate',
})
const initState = {
  // 推送列表
  data: [],
  // 分页信息
  pagination: {
    current: 1,
    pageSize: 10,
    total: undefined,
  },
  // 搜索参数
  searchParams: {},
  // 当前选中
  selectedRowKeys: [],
  customerOrgId: '',
}

export default modelExtend({
  namespace: 'pushCertificate',
  state: initState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const match = pathToRegexp('/newCredentials/certificatePush/push/:id').exec(pathname)
        if (match) {
          if (history.action !== 'POP') {
            // 初始化数据
            dispatch({ type: 'updateState', payload: initState })
          }
          dispatch({ type: 'updateState', payload: { customerOrgId: match[1] } })
          // 获取列表信息
          dispatch({ type: 'getData' })
        }
      })
    },
  },
  effects: {
    * getData({ payload }, { select, call, update }) {
      const { customerOrgId, pagination, searchParams } = yield select(
        ({ pushCertificate }) => pushCertificate,
      )
      const params = { ...pagination, ...searchParams, ...payload, customerOrgId }
      const {
        content: { numInfo, data, current, total, pageSize },
      } = yield call(services.list, { ...params })
      yield update({ numInfo, data, pagination: { current, total, pageSize }, selectedRowKeys: [] })
    },
    * pushCertificates({ payload }, { call, put }) {
      const { certificateIds, customerOrgId } = payload
      const { content } = yield call(services.pushCertificates, { certificateIds, customerOrgId })
      Modal.success({
        content: (
          <div>
            <div>已成功推送:</div>
            {content.map(item => <div key={item}>{item}</div>)}
          </div>
        ),
      })
      yield put({ type: 'getData' })
    },
  },
  reducers: {},
})
