import { message } from 'antd'
import modelExtend from '../utils/modelExtend'
import {
  update,
  create,
  remove,
  getTree,
  getForm,
  drop,
  getTable,
  updateTable,
  createTable,
  funStatus,
  removeTable,
} from '../services/menuManage'
import { COMMON_REDUCER } from '../utils/constant'

const namespace = 'menuManage'

const initialState = {
  gData: [],
  formData: {},
  submit: 'update',
  tableData: [],
  menuId: null,
  modalVisible: false,
  modalContent: {},
  modalType: '',
}

export default modelExtend({
  namespace,
  state: initialState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/menuManage') {
          dispatch({
            type: COMMON_REDUCER,
            payload: initialState,
          })
          dispatch({ type: 'query' })
        }
      })
    },
  },

  effects: {
    * query(_, { call, put }) {
      const treeData = yield call(getTree)
      yield put({
        type: COMMON_REDUCER,
        payload: {
          gData: treeData.content,
          formData: {},
        },
      })
    },
    * queryForm({ payload }, { call, put }) {
      const formData = yield call(getForm, payload)
      yield put({
        type: COMMON_REDUCER,
        payload: {
          formData: formData.content,
          submit: 'update',
        },
      })
    },
    * update({ payload }, { call, put }) {
      yield call(update, payload)
      message.success('修改成功')
      yield put({ type: 'query' })
    },
    * create({ payload }, { call, put }) {
      yield call(create, payload)
      message.success('添加成功')
      yield put({ type: 'query' })
    },
    * remove({ payload }, { call, put }) {
      yield call(remove, payload)
      message.success('删除成功')
      yield put({ type: 'query' })
    },
    * dropNode({ payload }, { call, put }) {
      yield call(drop, payload)
      message.success('拖拽成功')
      yield put({ type: 'query' })
    },
    * queryTable(_, { call, put, select }) {
      const { menuId } = yield select(({ menuManage }) => (menuManage))
      const tableData = yield call(getTable, { menuId })
      yield put({
        type: COMMON_REDUCER,
        payload: {
          tableData: tableData.content,
        },
      })
    },
    * updateTable({ payload }, { call, put }) {
      yield call(updateTable, payload)
      yield put({ type: 'queryTable' })
      message.success('编辑功能成功')
    },
    * removeTable({ payload }, { call, put }) {
      yield call(removeTable, { id: payload.id })
      yield put({ type: 'queryTable' })
      message.success('删除功能成功')
    },
    * createTable({ payload }, { call, put }) {
      yield call(createTable, payload)
      yield put({
        type: COMMON_REDUCER,
        payload: {
          modalVisible: false,
        },
      })
      yield put({ type: 'queryTable' })
      message.success('添加功能成功')
    },
    * funStatus({ payload }, { call, put }) {
      const req = {
        id: payload.id,
        status: payload.status,
      }
      yield call(funStatus, req)
      yield put({ type: 'queryTable' })
      message.success('功能状态更改成功')
    },
  },
})
