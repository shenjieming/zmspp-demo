import React from 'react'
import { message, Modal } from 'antd'
import { modelExtend, getSetup, getServices } from '../../utils'
import * as services from '../../services/purchase'
import {getCodeBarListData, packageListData} from "../../services/supplyCatalogue/detail";

const servicesObj = getServices({
  refusedReasonList: '/system/dicValue/dicKey', // 拒绝原因
  getCertificateDetail: '/certificate/register/push/detail', // 获取审核证件列表
  setPastData: '/certificate/customer/receive/certificate', // 审核通过
  setRefusedData: '/certificate/register/push/status/refuse', // 审核拒绝
})

const getContent = (data = []) => {
  (data.map((item, index) => (<span className="aek-mr10" key={`${index + 1}`}>
    {index + 1 === data.length ? item : `${item},`}
  </span>))
  )
}

const initState = {
  tabStatus: 'inUse',
  statistics: {},
  editModalVisible: false,
  modalSelsect: false,
  applyModalVisible: false,
  excelModalVisible: false,
  packageModalVisible: false,
  historyModalVisible: false,
  compareModalVisible: false,
  refuseModalVisible: false,
  codeMust: false,
  scheduleModalVisible: false,
  importButtonStatus: true,
  modalType: 'edit',
  scheduleList: [],
  tableIdArr: [],
  packageList: { data: {} },
  suppliersSelect: [],
  checkedHistoryArr: [],
  versionDoubleList: [],
  searchKeys: {
    current: 1,
    pageSize: 10,
  },
  tableData: [],
  historyList: [],
  changeArr: [],
  selectArr: [],
  modalTableData: [],
  modalInitValue: {},
  refuseModalData: [],
  orgIdSign: '',
  compareModalType: '',
  pageConfig: {
    current: 1,
    pageSize: 10,
    total: null,
  },
  excelPageConfig: {
    current: 1,
    pageSize: 10,
    total: null,
  },
  historyPagination: {
    current: 1,
    pageSize: 10,
    total: null,
    pscId: null,
  },
  tableKey: 1,
  barcodeVisible: false,
  barcodeList: [],
  certificateVisible: false,
  certificateData: {},
  viewModalVisible: false, // 审核弹框visible
  certificateDetail: {
    certificates: [],
  }, // 证件审核详情
  selectedRowData: {}, // 选择的行数据
  refusedReasonVisible: false, // 拒绝原因
  refusedReasonList: [], // 拒绝原因数组
}

export default modelExtend({
  namespace: 'purchase',
  state: initState,
  subscriptions: getSetup({
    path: '/purchase',
    initFun({ toAction, query: { tabStatus } }) {
      toAction(initState)
      if (tabStatus === 'pendingReview') {
        toAction({ tabStatus: 'pendingReview' })
      }
      toAction('statistics')
      toAction({ keywords: null }, 'suppliersSelect')
      toAction('suppliers')
    },
  }),

  effects: {
    // 列表目录统计数查询
    * statistics({ payload }, { call, toAction }) {
      const { content } = yield call(services.statistics, payload)
      yield toAction({ statistics: content })
    },
    // 我的供应商下拉列表
    * suppliersSelect({ payload }, { call, toAction }) {
      const { content } = yield call(services.suppliers, payload)
      yield toAction({ suppliersSelect: content })
    },
    // 分页显示我的供应商列表
    * suppliers({ payload }, { call, toAction, select }) {
      const { searchKeys, tabStatus } = yield select(({ purchase }) => purchase)
      const req = payload || { ...searchKeys }
      if (req.supplierOrgId && req.supplierOrgId.key) {
        req.supplierOrgId = req.supplierOrgId.key
      }
      let contentMain = {}
      if (['inUse', 'disabled'].includes(tabStatus)) {
        req.pscStatus = ((tabStatus === 'disabled') & 1) + 1
        const { content } = yield call(services.inUseDisabled, req)
        contentMain = content
      } else if (['pendingReview', 'refused'].includes(tabStatus)) {
        req.pscStatus = ((tabStatus === 'refused') & 1) + 1
        const { content } = yield call(services.pendingReviewRefused, req)
        contentMain = content
      }
      yield toAction({
        tableData: contentMain.data || [],
        searchKeys: req,
        pageConfig: {
          current: contentMain.current,
          pageSize: contentMain.pageSize,
          total: contentMain.total,
        },
      })
    },
    // Excel导入
    * excelInput({ payload }, { call, toAction }) {
      console.log(payload)
      yield call(services.excelInput, payload)
      yield toAction({ excelModalVisible: false })
    },
    // 查看Excel导入进度
    * excelSchedule({ payload }, { call, toAction }) {
      const req = payload
      req.taskType = 2
      const { content } = yield call(services.excelSchedule, req)
      const { data, total, current } = content
      yield toAction({
        scheduleList: data,
        excelPageConfig: { total, current },
      })
    },
    // 新增物料
    * addMaterial({ payload }, { call, toAction }) {
      yield call(services.addMaterial, payload)
      yield [toAction('statistics'), toAction('suppliers'), toAction({ editModalVisible: false })]
      message.success('新增成功')
    },
    // 编辑物料
    * updateMaterial({ payload }, { call, toAction }) {
      yield call(services.updateMaterial, payload)
      yield [
        toAction('suppliers'),
        toAction({
          editModalVisible: false,
          modalInitValue: {},
        }),
      ]
      message.success('编辑成功')
    },
    // 批量停用启用
    * batchUpdate({ payload }, { call, toAction }) {
      yield call(services.batchUpdate, payload)
      yield [toAction('statistics'), toAction('suppliers'), toAction({ tableIdArr: [] })]
      if (payload.pscStatus - 1) {
        message.success('停用成功')
      } else {
        message.success('启用成功')
      }
    },
    // 查看包装规格详情
    * viewPackage({ payload }, { call, toAction }) {
      yield toAction({ packageModalVisible: true })
      const { content } = yield call(services.viewPackage, payload)
      yield toAction({
        packageList: {
          data: content,
          ...payload,
        },
      })
    },
    // 维护包装规格
    * editPackage({ payload }, { call, toAction }) {
      yield call(services.editPackage, payload)
      yield [
        toAction('suppliers'),
        toAction({
          packageModalVisible: false,
          packageList: { data: {} },
        }),
      ]
      message.success('维护成功')
    },
    // 查看历史列表
    * historys({ payload }, { call, toAction }) {
      const { content } = yield call(services.historys, payload)
      yield toAction({ historyList: content.data })
      yield toAction(
        {
          historyPagination: {
            current: content.current,
            pageSize: content.pageSize,
            total: content.total,
          },
        },
        true,
      )
    },
    // 查看历史详情
    * historysDetail({ payload }, { call, toAction }) {
      const { content } = yield call(services.historysDetail, payload)
      yield toAction({ versionDoubleList: [content] })
    },
    // 查看历史对比
    * historysCompare({ payload }, { call, toAction }) {
      const { content } = yield call(services.historysCompare, payload)
      yield toAction({ versionDoubleList: [content.first, content.comparaInfo] })
    },
    // 批量接收
    * batchReceive({ payload }, { call, toAction }) {
      yield call(services.batchReceive, payload.data)
      yield [
        toAction('statistics'),
        toAction('suppliers'),
        toAction({
          refuseModalData: [],
          tableIdArr: [],
          selectArr: [],
        }),
      ]
      message.success('接受成功')
    },
    // 批量拒绝
    * batchRefuse({ payload }, { call, toAction }) {
      yield call(services.batchRefuse, payload.data)
      yield [
        toAction('statistics'),
        toAction('suppliers'),
        toAction({
          refuseModalData: [],
          tableIdArr: [],
          selectArr: [],
          refuseModalVisible: false,
        }),
      ]
      message.success('拒绝成功')
    },
    // 查看历史
    * seeChange({ payload }, { call, toAction }) {
      const { content } = yield call(services.seeChange, payload)
      yield toAction({
        versionDoubleList: content,
        compareModalType: 'seeChange',
      })
    },
    // 查看条码
    * checkBarcode({ payload }, { call, toAction }) {
      const { content } = yield call(services.checkBarcode, payload)
      yield toAction({
        barcodeList: content,
      })
    },
    // 查看注册证
    * checkCertificate({ payload }, { call, toAction }) {
      const { content } = yield call(services.checkCertificate, payload)
      yield toAction({
        certificateData: content,
      })
    },

    // 获取待审核证件列表
    * getCertificateDetail({ payload }, { call, update }) {
      const { content } = yield call(servicesObj.getCertificateDetail, payload)
      yield update({
        certificateDetail: content,
      })
    },

    // 获取拒绝原因列表
    * getRefusedReason({ payload }, { call, update }) {
      const { content } = yield call(servicesObj.refusedReasonList, payload)
      yield update({
        refusedReasonList: content,
      })
    },
    // 审核证件通过
    * setPast({ payload }, { call }) {
      const { content } = yield call(servicesObj.setPastData, payload)
      if (payload.certificateIds.length !==
        content.passedCertificates.length) {
        Modal.error({
          content: (<div>
            <p>成功审核通过{content.passedCertificates.length}本证件</p>
            {
              content.passedCertificates.length ?
                <div>
                  <p className="aek-mtb10">如下证件已被审核通过：</p>
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
    // 获取条码列表
    * getCodeBarList({ payload }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          codeBarVisible: true,
        },
      })
      const { content } = yield call(getCodeBarListData, payload)
      yield put({
        type: 'updateState',
        payload: {
          codeBarList: content,
        },
      })
    },
    // 查看包装规格维护
    * getPackageList({ payload }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          packageModalVisible: true,
        },
      })
      const { content } = yield call(packageListData, payload)
      yield put({
        type: 'updateState',
        payload: {
          packageList: content,
        },
      })
    },
    // 审核证件拒绝
    * setRefused({ payload }, { call }) {
      const { content } = yield call(servicesObj.setRefusedData, payload)
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
})
