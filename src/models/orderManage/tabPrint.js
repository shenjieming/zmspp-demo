import { modelExtend, getSetup } from '../../utils'
import {
  getCheckData,
  checkDataList,
} from '../../services/orderManage/deliveryOrder'


const initState = {
  isbarCode: true,
  barcode: false,

  isSinglePrint: true,
  modalPrintView: false,
  printData: {},

  tabPrintType: false,
  tabType: 1,
  tabPrintModalVisible: false,
  tabPrintData: [],
}

export default modelExtend({
  namespace: 'tabPrint',
  state: initState,
  subscriptions: getSetup({
    path: '/orderManage/tabPrint',
    initFun({ toAction }) {
      toAction(initState)
    },
  }),
  effects: {
    //   getCheckData,
    * check({ payload }, { call }) {
      const { content } = yield call(getCheckData, payload)
      return content
    },
    * checkDataList({ payload }, { call, update }) {
      const { content } = yield call(checkDataList, payload)
      yield update({
        tabPrintData: content.data,
        tabPrintPagination: {
          current: content.current,
          pageSize: content.pageSize,
          total: content.total,
        },
      })
    },
  },
})
