import { message } from 'antd'
import {
  deptTreeData,
  personTableData,
  deptDetailData,
  deptSelectData,
  putDeptData,
  postDeptData,
  delDeptData,
  registPersonData,
  noRegistPersonData,
  registFlagData,
} from '../../services/personAdmin'
import dvaModelExtend from '../../utils/modelExtend'

const initState = {
  deptTreeList: [], // 部门树数据
  deptTreeSlected: [], // 树选择数据
  dataSource: [], // 人员列表数据
  searchData: { current: 1, gender: null, status: null, pageSize: 10, keywords: null }, //  搜索人员数据
  deptId: '', // 部门选择时的部门Id
  deptName: '', // 部门选择时的部门名称
  pagination: {}, // 人员详情分页
  deptDetail: {}, //  部门详情
  deptSelect: [], // 组织下上级部门下拉
  editModalVisible: false, // 编辑部门
  addModalVisible: false, // 新增部门
  addPersonModalVisible: false, // 新增人员
  personRegistFlag: false, // 人员是否已经注册  false 未注册  true已注册
  registPerson: {}, // 人员已经注册的信息

}

export default dvaModelExtend({
  namespace: 'personAdmin',
  state: initState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/personAdmin') {
          if (history.action !== 'POP') {
            // 清空modal数据
            dispatch({
              type: 'updateState',
              payload: initState,
            })
          }
          // 获取部门树数据
          dispatch({ type: 'getDeptTreeData' })
          dispatch({
            type: 'getPersonTableData',
          })
          // 上级部门
          dispatch({
            type: 'getDeptSelect',
          })
        }
      })
    },
  },
  effects: {
    // 获取部门树数据
    * getDeptTreeData({ payload }, { call, put, select }) {
      const { content } = yield call(deptTreeData, payload)
      const { deptId, deptName } = yield select(({ personAdmin }) => personAdmin)
      yield put({
        type: 'updateState',
        payload: {
          deptTreeList: content,
          deptName: deptName || content[0].deptName,
          deptId: deptId || content[0].deptId,
        },
      })
    },
    // 获取部门下人员列表
    * getPersonTableData({ payload = {} }, { call, put, select }) {
      const { searchData, deptId, deptName } = yield select(({ personAdmin }) => personAdmin)
      yield put({
        type: 'updateState',
        payload: {
          searchData: {
            ...searchData,
            ...payload,
          },
          deptId: payload.deptId || deptId,
          deptName: payload.deptName || deptName,
        },
      })
      const { content } = yield call(personTableData, { ...searchData, ...payload })
      yield put({
        type: 'updateState',
        payload: {
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
    },
    // 获取部门详情
    * getDeptDetail({ payload }, { call, put }) {
      yield put({ type: 'updateState', payload: { editModalVisible: true } })
      const { content } = yield call(deptDetailData, payload)
      yield put({
        type: 'updateState',
        payload: {
          deptDetail: content,
        },
      })
    },
    // 获取上级部门下拉列表
    * getDeptSelect({ payload }, { call, put }) {
      const { content } = yield call(deptSelectData, payload)
      const megra = (data) => {
        for (const obj of data) {
          obj.label = obj.deptName
          obj.value = obj.deptId
          obj.key = obj.deptId
          if (obj.children) {
            megra(obj.children)
          }
        }
      }
      megra(content)
      yield put({
        type: 'updateState',
        payload: {
          deptSelect: content,
        },
      })
    },
    // 修改编辑部门 , postDeptData
    * putDept({ payload }, { call, put }) {
      const { code } = yield call(putDeptData, payload)
      message.success('操作成功', 3)
      yield put({
        type: 'updateState',
        payload: {
          editModalVisible: false,
        },
      })
      yield put({
        type: 'getDeptTreeData',
      })
      yield put({
        type: 'getDeptSelect',
      })
    },
    // 新增部门
    * postDept({ payload }, { call, put }) {
      const { code } = yield call(postDeptData, payload)
      message.success('操作成功', 3)
      yield put({
        type: 'updateState',
        payload: {
          addModalVisible: false,
        },
      })
      yield put({
        type: 'getDeptTreeData',
      })
      yield put({
        type: 'getDeptSelect',
      })
    },
    // 删除部门
    * delDept({ payload }, { call, put }) {
      const { code } = yield call(delDeptData, payload)
      message.success('操作成功', 3)
      yield put({
        type: 'updateState',
        payload: {
          editModalVisible: false,
        },
      })
      yield put({
        type: 'getDeptTreeData',
      })
      yield put({
        type: 'getDeptSelect',
      })
    },
    // 判断用户是否已经注册
    * postRegistFlag({ payload }, { call, put }) {
      const { content } = yield call(registFlagData, payload)
      if (content && Object.keys(content).length !== 0) {
        yield put({
          type: 'updateState',
          payload: {
            personRegistFlag: true,
            registPerson: content,
          },
        })
      }
    },
    // 人员已注册新增
    * postRegistPerson({ payload }, { call, put, select }) {
      const { code } = yield call(registPersonData, payload)
      const searchData = yield select(({ personAdmin }) => personAdmin.searchData)
      yield put({
        type: 'updateState',
        payload: {
          addPersonModalVisible: false,
        },
      })
      yield put({
        type: 'getPersonTableData',
        payload: {
          ...searchData,
          pageSize: 10,
          current: 1,
        },
      })
    },
    // 人员未注册新增
    * postNoRegistPerson({ payload }, { call, put, select }) {
      const { code } = yield call(noRegistPersonData, payload)
      const searchData = yield select(({ personAdmin }) => personAdmin.searchData)
      yield put({
        type: 'updateState',
        payload: {
          addPersonModalVisible: false,
        },
      })
      yield put({
        type: 'getPersonTableData',
        payload: {
          ...searchData,
          pageSize: 10,
          current: 1,
        },
      })
    },
  },
  reducers: {

  },
})
