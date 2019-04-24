import React from 'react'
import { message, Modal } from 'antd'
import { parse } from 'qs'
import { isEmpty } from 'lodash'
import modelExtend from '../../../utils/modelExtend'
import { getServices } from '../../../utils'

const services = getServices({
  getCustomerListData: { url: '/certificate/register/push/supplier/list/endowment', type: 'post' },
  customerDetail: '/contacts/supplier/relation/finish/org', // 供应商详情
  getCustomerNo: '/certificate/customer/register/push/statistics/endowment',
  getReviewListData: '/certificate/customer/register/push/list/review', // 待审核证件列表
  getRefusedListData: '/certificate/customer/register/push/list/refused/endowment', // 已拒绝证件列表
  refusedReasonList: '/system/dicValue/dicKey', // 拒绝原因
  getCertificateDetail: '/certificate/register/push/detail', // 获取审核证件列表
  setPastData: '/certificate/customer/receive/certificate', // 审核通过
  setRefusedData: '/certificate/register/push/status/refuse', // 审核拒绝
})
const initState = {
  tabType: 'review', // review默认是待审核  refused已拒绝
  data: [],
  pagination: {
    current: 1,
    pageSize: 10,
    total: undefined,
  },
  selectedRowKeys: [], // 选择表格的复选框
  selectedRowData: {}, // 审核和重新审核的数据
  selectedCustomer: {}, // 点击选择的客户
  customerNo: {}, // 审核证件数量
  customerList: [],
  reviewSearchData: {},
  refusedSearchData: {},
  certificateDetail: {
    certificates: [],
  }, // 获取审核证件详情
  detailModalVisible: false, // 详情弹框 detailModal
  refusedReasonVisible: false, // 拒绝原因弹框
  refusedReasonList: [], // 拒绝原因列表
  keywords: '', // 关键字搜索
}

const getContent = (data = []) => {
  (data.map((item, index) => (<span className="aek-mr10" key={`${index + 1}`}>
    {index + 1 === data.length ? `${item}` : `${item},`}
  </span>))
  )
}

export default modelExtend({
  namespace: 'newCertificateAuditZZ',
  state: initState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname, search }) => {
        if (pathname === '/newCredentials/newCertificateAuditZZ') {
          if (history.action !== 'POP') {
            // 初始化数据
            dispatch({ type: 'updateState', payload: initState })
          }
          const query = parse(search, { ignoreQueryPrefix: true })
          /** @desc 1待审核 2已拒绝 */
          let tabType = 1
          if (!isEmpty(query)) {
            tabType = 2
            dispatch({
              type: 'updateState',
              payload: {
                tabType: query.tabType,
              },
            })
            dispatch({
              type: 'getRefusedList',
            })
            dispatch({
              type: 'getCustomerNo',
            })
          } else {
            dispatch({
              type: 'getCustomerList',
              payload: {
                certificateStatus: tabType,
              },
            })
          }
        }
      })
    },
  },
  effects: {
    // 获取客户列表
    * getCustomerList({ payload }, { call, update, put }) {
      const { content } = yield call(services.getCustomerListData, payload)
      yield update({
        customerList: content,
      })
      if (content && content.length) {
        yield put({
          type: 'updateState',
          payload: {
            selectedCustomer: {
              supplierOrgId: content[0].supplierOrgId,
              supplierOrgName: content[0].supplierOrgName,
            },
          },
        })
        yield put({
          type: 'getCustomerDetail',
          payload: {
            supplierOrgId: content[0].supplierOrgId,
          },
        })
        const url = 'getReviewList'
        yield put({
          type: url,
          payload: {
            supplierOrgId: content[0].supplierOrgId,
          },
        })
        yield put({
          type: 'getCustomerNo',
        })
      }
    },
    // 获取客户详情
    * getCustomerDetail({ payload }, { select, call, update }) {
      const { selectedCustomer } = yield select(({ newCertificateAuditZZ }) => newCertificateAuditZZ)
      const { content } = yield call(services.customerDetail, payload)
      yield update({
        selectedCustomer: { ...selectedCustomer, ...content },
      })
    },
    // 或者待审核和拒绝证件数量
    * getCustomerNo({ payload }, { call, update }) {
      const {
        content,
      } = yield call(services.getCustomerNo, payload)
      yield update({
        customerNo: content,
      })
    },
    // 获取待审核证件列表
    * getReviewList({ payload }, { call, update }) {
      yield update({
        selectedRowKeys: [],
      })
      const {
        content: { data, current, total, pageSize },
      } = yield call(services.getReviewListData, payload)
      yield update({
        data,
        reviewSearchData: payload,
        pagination: { current, total, pageSize },
      })
    },
    // 获取已拒绝证件列表
    * getRefusedList({ payload }, { call, update }) {
      const {
        content: { data, current, total, pageSize },
      } = yield call(services.getRefusedListData, payload)
      yield update({
        data,
        refusedSearchData: payload,
        pagination: { current, total, pageSize },
      })
    },
    // 获取待审核证件列表
    * getCertificateDetail({ payload }, { call, update }) {
      const { content } = yield call(services.getCertificateDetail, payload)
      yield update({
        certificateDetail: content,
      })
    },

    // 获取拒绝原因列表
    * getRefusedReason({ payload }, { call, update }) {
      const { content } = yield call(services.refusedReasonList, payload)
      yield update({
        refusedReasonList: content,
        refusedReasonVisible: true,
      })
    },
    // 审核证件通过
    * setPast({ payload }, { call, put }) {
      const { content } = yield call(services.setPastData, payload)
      yield put({
        type: 'getCustomerList',
        payload: {
          certificateStatus: 1,
        },
      })
      if (payload.certificateIds.length !==
        content.checkCertificates.length) {
        Modal.error({
          content: (<div>
            <p>成功审核通过{content.checkCertificates.length}本证件</p>
            {
              content.checkCertificates.length ?
                <div>
                  <p className="aek-mtb10">如下证件已被审核通过：</p>
                  <div>
                    {getContent(content.checkCertificates)}
                  </div>
                </div>
                : undefined
            }
            {
              content.undoAndDeleteCertificates.length ?
                <div>
                  <p className="aek-mtb10">如下证件已被供应商主动撤销或删除推送：</p>
                  <div>
                    {getContent(content.undoAndDeleteCertificates.concat(content.rejectedCertificates))}
                  </div>
                </div>
                : undefined
            }
          </div>),
          zIndex: 1002,
          onOk() {
            payload.callback()
          },
        })
      } else {
        payload.callback()
        message.success('操作成功，该证件已审核通过！')
      }
    },
    // 审核证件拒绝
    * setRefused({ payload }, { call, put }) {
      const { content } = yield call(services.setRefusedData, payload)
      yield put({
        type: 'getCustomerList',
        payload: {
          certificateStatus: 1,
        },
      })
      if (payload.certificateIds.length !==
        (content.checkCertificates.length + content.rejectedCertificates.length)) {
        Modal.error({
          content: (<div>
            <p>成功审核拒绝{content.passedCertificates.length}本证件</p>
            {
              content.passedCertificates.length ?
                <div>
                  <p className="aek-mtb10">如下证件已被审核拒绝：</p>
                  <div>
                    {getContent(content.passedCertificates)}
                  </div>
                </div>
                : undefined
            }
            {
              content.undoAndDeleteCertificates.length ?
                <div>
                  <p className="aek-mtb10">如下证件已被供应商主动撤销或删除推送：</p>
                  <div>
                    {getContent(content.undoAndDeleteCertificates)}
                  </div>
                </div>
                : undefined
            }
          </div>),
          zIndex: 1002,
          onOk() {
            payload.callback()
          },
        })
      } else {
        payload.callback()
        message.success('操作成功，该证件已审核拒绝！')
      }
    },
  },
  reducers: {},
})
