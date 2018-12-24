/** 商机发布编辑 */
import { isEmpty } from 'lodash'
import { parse } from 'qs'
import modelExtend from '../../../utils/modelExtend'
import { getServices } from '../../../utils'

const services = getServices({
  releaseDetail: {
    url: '/business-chance/release-edit-detail',
    type: 'get',
  }, // 商机详情
  tagTypeList: '/system/dicValue/dicKey', // 类型列表
  releaseSubmit: '/business-chance/release', // 发布
  saveSubmit: '/business-chance/draft-release', // 保存草稿
})
const initState = {
  // 发布信息
  data: {},
  chanceId: '', // 发布Id
  typeList: [], // 标签类型列表
  currentFileList: [], // 文件列表
  currentImageList: [], // 上传图片列表
}

export default modelExtend({
  namespace: 'releaseDetail',
  state: initState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname, search }) => {
        const query = parse(search, { ignoreQueryPrefix: true })
        if (pathname === '/business/myRelease/release' ||
          pathname === '/business/list/release' ||
          pathname === '/business/myReply/release' ||
          pathname === '/business/mySuccess/release'
        ) {
          if (history.action !== 'POP') {
            // 初始化数据
            dispatch({ type: 'updateState', payload: initState })
          }
          // 获取标签类型
          dispatch({
            type: 'getTagTypeList',
            payload: {
              dicKey: 'BUSINESS_CHANCE_TAG',
            },
          })
          if (!isEmpty(query)) {
            // 获取我的发布详情
            dispatch({
              type: 'getData',
              payload: query,
            })
          }
        }
      })
    },
  },
  effects: {
    /** 发布信息详情 */
    * getData({ payload }, { call, update }) {
      const { content } = yield call(services.releaseDetail, payload)
      yield update({
        ...payload,
        data: content,
        currentFileList: JSON.parse(content.chanceAppendixUrls).map((item, index) => ({
          uid: index,
          status: 'done',
          ...item,
        })),
        currentImageList: content.chanceImageUrls.split(','),
      })
    },
    /** 标签类型列表 */
    * getTagTypeList({ payload }, { call, update }) {
      const { content } = yield call(services.tagTypeList, payload)
      yield update({
        typeList: content,
      })
    },
    /** 发布 */
    * releaseSubmit({ payload }, { call }) {
      yield call(services.releaseSubmit, payload)
    },
    /** 保存草稿 */
    * saveSubmit({ payload }, { call }) {
      yield call(services.saveSubmit, payload)
    },
  },
  reducers: {},
})
