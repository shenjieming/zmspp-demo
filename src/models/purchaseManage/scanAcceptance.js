import { parse } from 'qs'
import { message } from 'antd'
import { modelExtend } from '../../utils'
import { queryScanList, saveCheckOrder } from '../../services/purchaseManage/scanAcceptance'

const initState = {
  scanList: [],
  printModalVisible: false,
  detailPageData: {},
  postListData: [],
}

export default modelExtend({
  namespace: 'scanAcceptance',
  state: initState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname, search }) => {
        if (pathname === '/purchaseManage/scanAcceptance') {
          dispatch({ type: 'updateState', payload: initState })
          if (search) {
            const { formNo } = parse(search.slice(1))
            dispatch({ type: 'queryScanList', payload: { formNo } })
          }
        }
      })
    },
  },
  effects: {
    // 获取扫描验收信息
    * queryScanList({ payload }, { call, update }) {
      const { content } = yield call(queryScanList, payload)
      if (content) {
        for (const item of content.items) {
          item.acceptQty = item.deliverQty
        }
        if (content.formStatus === 2 || content.formStatus === 3) {
          yield update({
            scanList: content.items,
            postListData: content.items,
            detailPageData: content,
          })
        } else {
          message.warning('未搜索到信息')
          yield update({
            scanList: [],
            postListData: [],
            detailPageData: {},
          })
        }
      } else {
        message.warning('未搜索到信息')
        yield update({
          scanList: [],
          postListData: [],
          detailPageData: {},
        })
      }
    },
    * saveCheckOrder({ payload }, { call, select }) {
      const { postListData } = yield select(({ scanAcceptance }) => scanAcceptance)
      let flag = false
      for (const { acceptQty } of postListData) {
        if (!!acceptQty && Number(acceptQty)) {
          flag = true
          break
        }
      }
      if (flag) {
        const { content } = yield call(saveCheckOrder, { ...payload, items: postListData })
        payload.confirmShow(content)
      } else {
        message.warning('请输入验收数量')
      }
    },
  },
  reducers: {},
})
