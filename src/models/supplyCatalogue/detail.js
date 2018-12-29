import { message } from 'antd'
import pathToRegexp from 'path-to-regexp'
import {
  customerDetailData,
  catalogDisList,
  catalogRefuseList,
  packageListData,
  editPackageListData,
  editMaterialListData,
  setEditMaterialListData,
  getCodeBarListData,
  setCodeBarListData,
  historyListData,
  compareHistoryData,
  singleCompareHistoryData,
  getRegistListData, // 查看注册证列表
  registSubmitData, // 保存单个或者批量保存注册证
  delSkuBarcodeData, // 删除条码
  useTableData, // 使用中
  pendingTableData, // 待审核
  pushTableData, // 待推送
  refusedTableData, // 已拒绝
  disabledTableData, // 已停用
  getBrandList, // 品牌Option
  saveUseToPushData,
  saveUnseToPushData,
  pushUseToExamineData,
  pushUnseToExamineData,
  getCompareData,
  batchCancel, // 批量撤销
  pendingPushDel, // 待推送删除
  getCertificateList,
  allTableData,
} from '../../services/supplyCatalogue/detail'
import dvaModelExtend from '../../utils/modelExtend'
import * as services from "../../services/purchase";

const initState = {
  customerId: '', // 客户Id
  searchData: {}, // tab页每页的搜索条件
  customerDetail: {}, // 统计状态和客户信息
  dataSource: [], // 所有tab页表格数据
  pagination: {}, // 所有tab页表格分页
  tabIndex: '6', // 所属tab页序号
  selectedRowKeys: [], // 表格复选框所选id的值
  selectedRows: [], // 使用复选框所选的值
  packageList: {}, // 查看包装规格
  packageModalVisible: false, // 规格包装modal
  editMaterialVisible: false, // 编辑物料
  rowSelectData: {}, // 点击编辑时获取当前行的数据
  inviteRequired: false, // 招标默认选无时招标标号不用填写
  codeBarVisible: false, // 维护条码弹框
  codeBarList: [], // 获取维护条码列表
  historyVisible: false, // 查看历史列表modal
  historyList: [], // 历史列表数据
  historyPagiantion: {}, // 历史列表分页
  historySelected: [], // 选中需要对比的历史版本
  compareVisible: false, // 历史对比
  compareList: {
    first: {},
    comparaInfo: {},
  }, // 历史对比数据
  singleCompareVisible: false, // 单条历史
  singleCompareList: {}, // 单条历史数据
  registVisible: false, // 注册证弹框
  registList: [], // 注册证列表
  registPagitantion: {},
  registSearchData: {},
  otherCodeList: [], // 绑定该条码的其他物资
  otherCodeVisible: false, // 绑定该条码的其他物资弹框

  batchEditModalVisible: false, // 批量编辑物料
  batchDataList: [], // 批量编辑列表

  compareModalVisible: false, // 标准物料对照弹框
  compareModalList: [], // 标准物料对照列表
  branOptionList: [], // 品牌

  batchCancelModalVisible: false, // 批量撤销
  hatchCancelList: [], // 批量不通过数据

  cloneSelectRowData: [], // 拷贝数据




  statistics: {},
  editModalVisible: false,
  modalSelsect: false,
  applyModalVisible: false,
  excelModalVisible: false,
  historyModalVisible: false,
  refuseModalVisible: false,
  codeMust: false,
  scheduleModalVisible: false,
  importButtonStatus: true,
  modalType: 'edit',
  scheduleList: [],
  tableIdArr: [],
  suppliersSelect: [],
  checkedHistoryArr: [],
  versionDoubleList: [],
  searchKeys: {
    current: 1,
    pageSize: 10,
  },
  tableData: [],
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

const getUrl = [
  useTableData,
  pendingTableData,
  refusedTableData,
  disabledTableData,
  pushTableData,
  allTableData,
]

export default dvaModelExtend({
  namespace: 'supplyCatalogueDetail',
  state: {},
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const match = pathToRegexp('/supplyCatalogue/detail/:id').exec(pathname)
        if (match) {
          // 获取包装规格单位
          dispatch({ type: 'app/getPackageUnit' })
          const customerId = match[1]
          // 初始化数据
          dispatch({
            type: 'updateState',
            payload: {
              ...initState,
              customerId,
            },
          })
          // 获取统计状态和客户信息
          dispatch({ type: 'getCustomerDetail', payload: { customerOrgId: customerId } })
          // 获取我的客户列表数据
          dispatch({
            type: 'getTableData',
            payload: { current: 1, pageSize: 10, customerOrgId: customerId },
          })
          // 品牌列表
          // dispatch({
          //   type: 'getBrandList',
          //   payload: {
          //     keywords: '',
          //   },
          // })
        }
      })
    },
  },
  effects: {
    // 获取统计状态和客户信息
    * getCustomerDetail({ payload }, { call, put }) {
      const { content } = yield call(customerDetailData, payload)
      yield put({
        type: 'updateState',
        payload: {
          customerDetail: content,
        },
      })
    },

    // 获取表格数据
    * getTableData({ payload }, { call, put, select }) {
      const { tabIndex, searchData, pagination, customerId } = yield select(
        ({ supplyCatalogueDetail }) => supplyCatalogueDetail,
      )
      const index = Number(tabIndex) - 1
      const reqData = {
        ...searchData,
        ...pagination,
        ...payload,
        customerOrgId: customerId,
      }
      const { content } = yield call(getUrl[index], reqData)
      yield put({
        type: 'updateState',
        payload: {
          searchData: payload,
          dataSource: content.data,
          pagination: {
            current: content.current,
            total: content.total,
            pageSize: content.pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: total => `共有 ${total} 条数据`,
          },
        },
      })

      yield put({
        type: 'getCustomerDetail',
        payload: {
          customerOrgId: customerId,
        },
      })
    },

    // 获取使用中/已停用数据
    * getDisabledList({ payload }, { call, put, select }) {
      const { content } = yield call(catalogDisList, payload)
      yield put({
        type: 'updateState',
        payload: {
          searchData: payload,
          dataSource: content.data,
          pagination: {
            current: content.current,
            total: content.total,
            pageSize: content.pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: total => `共有 ${total} 条数据`,
          },
        },
      })
      const customerId = yield select(
        ({ supplyCatalogueDetail }) => supplyCatalogueDetail.customerId,
      )
      yield put({
        type: 'getCustomerDetail',
        payload: {
          customerOrgId: customerId,
        },
      })
    },
    // 获取待审核/已拒绝数据/待推送
    * getRefuseList({ payload }, { call, put, select }) {
      const { content } = yield call(catalogRefuseList, payload)
      yield put({
        type: 'updateState',
        payload: {
          searchData: payload,
          dataSource: content.data,
          pagination: {
            current: content.current,
            total: content.total,
            pageSize: content.pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: total => `共有 ${total} 条数据`,
          },
        },
      })
      const customerId = yield select(
        ({ supplyCatalogueDetail }) => supplyCatalogueDetail.customerId,
      )
      yield put({
        type: 'getCustomerDetail',
        payload: {
          customerOrgId: customerId,
        },
      })
    },
    // 新增/编辑包装规格维护
    * setPackageList({ payload }, { call, put }) {
      yield call(editPackageListData, payload)
      message.success('操作成功')
      yield put({
        type: 'updateState',
        payload: {
          packageModalVisible: false,
          packageList: {},
        },
      })

      yield put({
        type: 'getTableData',
      })
    },
    // 获取物料 物料详情
    * getEditMaterialList({ payload }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          editMaterialVisible: true,
        },
      })
      const { content } = yield call(editMaterialListData, payload)
      yield put({
        type: 'updateState',
        payload: {
          rowSelectData: content,
        },
      })
    },
    // 设置物料
    * setEditMaterialList({ payload }, { call, put, select }) {
      const tabindex = yield select(({ supplyCatalogueDetail }) => supplyCatalogueDetail.tabIndex)

      let catalogInfoType = 1
      if (tabindex === '2' || tabindex === '3') {
        catalogInfoType = 2
      }
      yield call(setEditMaterialListData, { ...payload, catalogInfoType })
      message.success('操作成功', 3)
      yield put({
        type: 'updateState',
        payload: {
          editMaterialVisible: false,
        },
      })
      yield put({
        type: 'getTableData',
      })
    },
    // 绑定条码
    * setCodeBarList({ payload }, { call, put }) {
      const data = yield call(setCodeBarListData, payload)
      let updateData = {
        codeBarList: data.content.data,
      }
      if (data.content && data.content.customCode !== 200) {
        if (data.content.customCode === 203) {
          updateData = {
            otherCodeList: data.content.useData, // 绑定该条码的其他物资
            otherCodeVisible: true,
          }
          yield put({
            type: 'updateState',
            payload: updateData,
          })
          return
        }
        message.error(data.content.customMessages)
        return
      }
      message.success('解析成功', 3)
      yield put({
        type: 'updateState',
        payload: updateData,
      })
      payload.func()

      yield put({
        type: 'getTableData',
      })
    },
    // 获取历史列表
    * getHistoryList({ payload }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          historyVisible: true,
        },
      })
      const { content } = yield call(historyListData, payload)
      yield put({
        type: 'updateState',
        payload: {
          historyList: content.data,
          historyPagiantion: {
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
    //  版本对比
    * getCompareHistory({ payload }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          compareVisible: true,
        },
      })
      const { content } = yield call(compareHistoryData, payload)
      yield put({
        type: 'updateState',
        payload: {
          compareList: content,
        },
      })
    },
    // 单条历史
    * getSingleCompareHistory({ payload }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          singleCompareVisible: true,
        },
      })
      const { content } = yield call(singleCompareHistoryData, payload)
      yield put({
        type: 'updateState',
        payload: {
          singleCompareList: content,
        },
      })
    },
    // 查看注册证列表
    * getRegistList({ payload }, { call, put }) {
      const { content } = yield call(getRegistListData, payload)
      yield put({
        type: 'updateState',
        payload: {
          registList: content.data,
          registSearchData: payload,
          registPagitantion: {
            current: content.current,
            total: content.total,
            pageSize: content.pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: total => `共有 ${total} 条数据`,
            size: 'small',
          },
        },
      })
    },
    // 选择注册证保存
    * registSubmit({ payload }, { call, put }) {
      yield call(registSubmitData, payload)
      yield put({
        type: 'updateState',
        payload: {
          registVisible: false,
        },
      })
      yield put({
        type: 'getTableData',
      })
      message.success('保存成功', 3)
    },
    // 条码删除
    * delSkuBarcode({ payload }, { call, put, select }) {
      yield call(delSkuBarcodeData, payload)
      const codeBarList = yield select(
        ({ supplyCatalogueDetail }) => supplyCatalogueDetail.codeBarList,
      )
      codeBarList.splice(payload.index, 1)
      message.success('物资删除成功！')
      yield put({
        type: 'updateState',
        payload: {
          codeBarList,
        },
      })
      yield put({
        type: 'getTableData',
      })
    },
    // 获取标注物料对照
    * compareModalData({ payload }, { call, update, select }) {
      const { rowSelectData } = yield select(({ supplyCatalogueDetail }) => supplyCatalogueDetail)
      const { content } = yield call(getCompareData, payload)
      yield update({
        compareModalList: [{ ...rowSelectData }, { ...content }],
      })
    },
    // 获取品牌异步搜索
    * getBrandList({ payload }, { call, update }) {
      const { content } = yield call(getBrandList, payload)
      yield update({
        branOptionList: content,
      })
      return content
    },

    // 保存待推送
    * saveToPush({ payload }, { call, select }) {
      const { tabIndex, rowSelectData } = yield select(
        ({ supplyCatalogueDetail }) => supplyCatalogueDetail,
      )
      if (tabIndex === '1' || tabIndex === '4') {
        yield call(saveUseToPushData, payload)
      } else if (tabIndex === '6') {
        // 全部Tab下还要用单一状态进行判断
        if (rowSelectData.pscStatus === 1 || rowSelectData.pscStatus === 4) {
          yield call(pushUseToExamineData, payload)
        } else {
          yield call(pushUnseToExamineData, payload)
        }
      } else {
        yield call(saveUnseToPushData, payload)
      }
    },
    // 保存至待审核
    * saveToExamine({ payload }, { call, select }) {
      const { tabIndex, rowSelectData } = yield select(
        ({ supplyCatalogueDetail }) => supplyCatalogueDetail,
      )
      if (tabIndex === '1' || tabIndex === '4') {
        yield call(pushUseToExamineData, payload)
      } else if (tabIndex === '6') {
        // 全部Tab下还要用单一状态进行判断
        if (rowSelectData.pscStatus === 1 || rowSelectData.pscStatus === 4) {
          yield call(pushUseToExamineData, payload)
        } else {
          yield call(pushUnseToExamineData, payload)
        }
      } else {
        yield call(pushUnseToExamineData, payload)
      }
    },
    // 查看Excel导入进度
    * excelSchedule({ payload }, { call, toAction }) {
      const req = payload
      req.taskType = 4
      const { content } = yield call(services.excelSchedule, req)
      const { data, total, current } = content
      yield toAction({
        scheduleList: data,
        excelPageConfig: { total, current },
      })
    },
    // 新增物料
    * addMaterial({ payload }, { call, toAction }) {
      yield call(services.splAddMaterial, payload)
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
    // 批量撤销
    * batchCancel({ payload }, { call, update }) {
      const { content } = yield call(batchCancel, payload)
      yield update({
        hatchCancelList: content,
      })
      return content
    },
    // 待推送删除
    * pendingPushDel({ payload }, { call }) {
      const { content } = yield call(pendingPushDel, payload)
      return content
    },
    // Excel导入
    * excelInput({ payload }, { call, toAction }) {
      yield call(services.excelInput, payload)
      yield toAction({ excelModalVisible: false })
    },
    * getCertificateList({ payload }, { call, update }) {
      const { content } = yield call(getCertificateList, payload)
      yield update({
        certificateOptionList: content,
      })
      return content
    },

    * getOptions({ payload }, { call, update }) {
      const { content: a } = yield call(getCertificateList, payload)
      const { content: b } = yield call(getBrandList, payload)
      yield update({
        branOptionList: b,
        certificateOptionList: a,
      })
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
  },
  reducers: {},
})
