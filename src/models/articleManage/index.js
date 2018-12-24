import { message } from 'antd'
import { routerRedux } from 'dva/router'
import { modelExtend, getServices } from '../../utils'

const services = getServices({
  // 获取栏目下拉框数据
  getTreeListData: 'home/content-mgmt/column/tree-option',
  // 所有文章数据
  getArticleListData: 'home/content-mgmt/article/list-page',
  // 更改状态
  setArticleStatusData: 'home/content-mgmt/article/edit-status',
  // 删除文章
  deleteArticleData: 'home/content-mgmt/article/remove',
  // 排序保存
  saveArticleSortData: 'home/content-mgmt/article/sort',
})
const initalState = {
  treeList: [], // 栏目下拉框列表
  articleList: [], // 文章列表
  atricleSerachData: {
    current: 1,
    pageSize: 10,
    articleStatus: null,
    columnId: null,
    keywords: '',
  }, // 文章列表搜索条件
  articlePagination: {}, // 文章列表分页条件
}
export default modelExtend({
  namespace: 'articleManage',
  state: initalState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const { pathname } = location
        if (pathname === '/websiteManage/articleManage') {
          if (history.action !== 'POP') {
            dispatch({ type: 'updateState', payload: initalState })
          }
          // 获取下拉框数据
          dispatch({ type: 'getTreeList' })
          // 获取文章列表数据
          dispatch({
            type: 'getArticleList',
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
    // 获取所有的文章列表
    * getArticleList({ payload }, { call, update, select }) {
      const { atricleSerachData } = yield select(({ articleManage }) => articleManage)
      const { content: { current, total, pageSize, data } } = yield call(services.getArticleListData, { ...atricleSerachData, ...payload })
      yield update({
        atricleSerachData: { ...atricleSerachData, ...payload },
        articleList: data,
        articlePagination: {
          current,
          total,
          pageSize,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: tota => `共有 ${tota} 条数据`,
        },
      })
    },
    // 更改状态
    * setArticleStatus({ payload }, { call, put, select }) {
      const { atricleSerachData } = yield select(({ articleManage }) => articleManage)
      const data = yield call(services.setArticleStatusData, payload)
      message.success('更改成功')
      yield put({
        type: 'getArticleList',
        payload: atricleSerachData,
      })
    },
    // 删除文章
    * deleteArticle({ payload }, { call, put, select }) {
      const { atricleSerachData } = yield select(({ articleManage }) => articleManage)
      const data = yield call(services.deleteArticleData, payload)
      message.success('删除成功')
      yield put({
        type: 'getArticleList',
        payload: atricleSerachData,
      })
    },
    // 排序保存
    * saveArticleSort({ payload }, { call, put, select }) {
      const { atricleSerachData } = yield select(({ articleManage }) => articleManage)
      const data = yield call(services.saveArticleSortData, payload)
      message.success('保存成功')
      yield put({
        type: 'getArticleList',
        payload: atricleSerachData,
      })
    },
  },
  reducers: {
  },
})
