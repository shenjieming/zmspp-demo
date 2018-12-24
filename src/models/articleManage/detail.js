import pathToRegexp from 'path-to-regexp'
import { message } from 'antd'
import { routerRedux } from 'dva/router'
import { modelExtend, getServices } from '../../utils'

const services = getServices({
  // 获取栏目下拉框数据
  getTreeListData: 'home/content-mgmt/column/tree-option',
  // 所有文章数据
  getArticleDetailData: 'home/content-mgmt/article/detail',
  // 新增文章
  setArticleAddData: 'home/content-mgmt/article/save',
  // 编辑文章
  setArticleEditData: 'home/content-mgmt/article/edit',
})
const initalState = {
  treeList: [], // 栏目下拉框列表
  articleDetail: {}, // 文章详情
  articleContent: '',
  articleId: '',
  fileList: [], // 上传图片列表
}
export default modelExtend({
  namespace: 'articleManageDetail',
  state: initalState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const { pathname } = location
        const match = pathToRegexp('/websiteManage/articleManage/eidtDetail/:id').exec(pathname)
        if (pathname === '/websiteManage/articleManage/detail') {
          dispatch({ type: 'updateState', payload: initalState })
          // 获取下拉框数据
          dispatch({ type: 'getTreeList' })
        } else if (match) {
          dispatch({ type: 'updateState', payload: initalState })
          // 获取下拉框数据
          dispatch({ type: 'getTreeList' })
          dispatch({
            type: 'getArticleDetail',
            payload: {
              articleId: match[1],
            },
          })
        }
      })
    },
  },
  effects: {
    // 获取栏目下拉框数据
    * getTreeList({ payload }, { call, update }) {
      const { content } = yield call(services.getTreeListData, payload)
      yield update({
        treeList: content,
      })
    },
    // 获取栏目详情
    * getArticleDetail({ payload }, { call, update }) {
      const { content } = yield call(services.getArticleDetailData, payload)
      yield update({
        ...payload,
        articleDetail: content,
      })
    },
    // 新增文章
    * setArticleAdd({ payload }, { call }) {
      const { content } = yield call(services.setArticleAddData, payload)
      message.success('新增成功')
    },
    // 编辑文章
    * setArticleEdit({ payload }, { call }) {
      const { content } = yield call(services.setArticleEditData, payload)
      message.success('编辑成功')
    },
  },
  reducers: {
  },
})
