import qs from 'qs'
import { cloneDeep } from 'lodash'
import { message } from 'antd'
import moment from 'moment'
import axios from '../../utils/axiosInstance'
import { modelExtend, getServices } from '../../utils'
import { baseURL } from '../../utils/config'


async function getContent(data) {
  return axios.get(`${baseURL}/hcapi/stockin/generate-excel`, {
    params: data,
    responseType: 'arraybuffer',
  }).catch((error) => {
    message.error('导出失败！')
    return error
  })
}

const {
  queryBillList,
  queryNumber,
  queryDetail,
  queryProvinceDetail,
  queryfailList,
  repeatSend,
} = getServices({
  // 入库单号分页查询
  queryBillList: '/hcapi/stockin',
  // 根据发货状态查询查询发货数量
  queryNumber: '/hcapi/stockin/summary',
  // 查询单据详情
  queryDetail: '/hcapi/stockin/detail',
  // 查询省平台采购单详情
  queryProvinceDetail: '/hcapi/purchase/order/detail',
  // 查询失败列表
  queryfailList: '/hcapi/stockin/error/detail',
  // 重发
  repeatSend: '/hcapi/stockin/error/resend',
})
const handleData = (data) => {
  const copyData = cloneDeep(data)
  if (data.periodNo) {
    copyData.periodNo = data.periodNo.label
  }
  if (data.accountStartTime && data.accountStartTime.length) {
    copyData.accountEndTime = moment(data.accountStartTime[1]).format('YYYY-MM-DD')
    copyData.accountStartTime = moment(data.accountStartTime[0]).format('YYYY-MM-DD')
  } else {
    copyData.accountEndTime = undefined
    copyData.accountStartTime = undefined
  }
  return copyData
}

export default modelExtend({
  namespace: 'billQuery',
  state: {
    billList: [],
    pagination: {
      current: 1,
      pageSize: 10,
      total: null,
    },
    searchSaveParam: {},
    allQty: 0,
    failQty: 0,
    waitForSendQty: 0,
    currentTabIndex: -1,
    currentDetail: {},
    checkModalVisible: false,
    checkModalType: '',
    failModalVisible: false,
    failedList: [], // 失败列表

    downloadVisible: false, // 导出
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const { pathname, search } = location
        const query = qs.parse(search, { ignoreQueryPrefix: true })
        if (pathname === '/provinceControl/billQuery') {
          if (history.action !== 'POP') {
            dispatch({ type: 'reset' })
          }
          if (query.key) {
            dispatch({
              type: 'updateState',
              payload: {
                searchSaveParam: {
                  periodNo: query,
                },
                currentTabIndex: Number(query.currentTabIndex),
              },
            })
          }
          /** @description 删除数量查询接口 */
          // dispatch({ type: 'queryNumber' })
          dispatch({ type: 'getBillList' })
        }
      })
    },
  },
  effects: {
    // 查询账单
    * getBillList({ payload }, { call, select, update }) {
      const { searchSaveParam, pagination, currentTabIndex } = yield select(
        ({ billQuery }) => billQuery,
      )
      const { content: { data, current, total, pageSize } } = yield call(queryBillList, {
        ...handleData(searchSaveParam),
        queryType: currentTabIndex,
        ...pagination,
        ...payload,
      })
      yield update({
        billList: data,
        pagination: { current, total, pageSize },
      })
    },
    // 查询数量
    * queryNumber(_, { call, update }) {
      const { content: { allQty, failQty, waitForSendQty } } = yield call(queryNumber)
      yield update({ allQty, failQty, waitForSendQty })
    },
    // 查询单据详情
    * queryDetail({ payload }, { call, update }) {
      yield update({
        checkModalVisible: true,
        checkModalType: 'storage',
      })
      const { content: currentDetail } = yield call(queryDetail, payload)
      yield update({ currentDetail })
    },
    // 查询省平台采购单详情
    * queryProvinceDetail({ payload }, { call, update }) {
      yield update({
        checkModalVisible: true,
        checkModalType: 'province',
      })
      const { content: currentDetail } = yield call(queryProvinceDetail, payload)
      yield update({ currentDetail })
    },
    // 查询上传失败列表
    * queryfailList({ payload }, { call, update }) {
      yield update({
        failModalVisible: true,
      })
      const { content: failedList } = yield call(queryfailList, payload)
      yield update({ failedList })
    },
    // 重发
    * repeatSend({ payload }, { call, update, toAction }) {
      const { content } = yield call(repeatSend, payload)
      if (content) {
        message.success('重发成功')
        yield update({
          failModalVisible: false,
        })
      } else {
        message.warning('重发失败，仍有部分明细存在问题，请处理！')
        yield toAction('queryfailList', payload)
      }
      yield toAction('queryNumber')
      yield toAction('getBillList')
    },
    // 导出
    * getDownload({ payload }, { call }) {
      const response = yield call(getContent, payload)

      if (response.status === 200) {
        // Add BOM to text for open in excel correctly
        if (window.Blob && window.URL && window.URL.createObjectURL) {
          const csvData = new Blob([response.data], { type: 'application/vnd.ms-excel;charset=utf-8' })
          const link = document.createElement('a')
          link.download = `省采数据对接情况(${payload.periodNo}).xls`
          link.href = URL.createObjectURL(csvData)
          link.target = '_blank'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        } else {
          const link = document.createElement('a')
          link.download = `省采数据对接情况(${payload.periodNo}).xls`
          link.href = `data:attachment/xls;charset=utf-8,${encodeURIComponent(response.data)}`
          link.target = '_blank'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }
      }
    },
  },
  reducers: {},
})
