import { personDetailData, personRoleData, delpersonRoleData, delPersonData, orgRoleData, setPersonRole, setPersonDept, deptTreeData } from '../../services/personAdmin/detail'
import { message } from 'antd'
import dvaModelExtend from '../../utils/modelExtend'
import pathToRegexp from 'path-to-regexp'
import { routerRedux } from 'dva/router'

const initState = {
  userId: '', // 人员Id
  personDetail: {}, // 人员详情
  roleList: [], // 人员所拥有的角色列表
  addRoleVisible: false, // 新增角色
  orgRoleList: [], // 组织下的全部角色
  personDeptVisible: false, // 更改部门
  deptSelect: [], //  部门下拉列表
  orgName: '', // 组织名称
}
export default dvaModelExtend({
  namespace: 'personAdminDetail',
  state: {},
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const match = pathToRegexp('/personAdmin/detail/:id').exec(pathname)
        if (match) {
          const id = match[1]
          // 初始化数据
          dispatch({
            type: 'updateState',
            payload: initState,
          })
          // 人员Id
          dispatch({
            type: 'updateState',
            payload: {
              userId: id,
            },
          })
          // 查询人员详情
          dispatch({
            type: 'getPersonDetail',
            payload: {
              userId: id,
            },
          })
          // 人员下的角色
          dispatch({
            type: 'getPersonRole',
            payload: {
              userId: id,
            },
          })
          // 获取部门
          dispatch({
            type: 'getDeptSelect',
          })
          // 组织名称
          dispatch({
            type: 'getOrginfo',
          })
        }
      })
    },
  },
  effects: {
    // 获取组织名称
    * getOrginfo({ payload }, { put, select }) {
      const { orgName } = yield select(({ app }) => app.orgInfo)
      yield put({
        type: 'updateState',
        payload: {
          orgName,
        },
      })
    },
    // 获取人员详情
    * getPersonDetail({ payload }, { call, put }) {
      const { content } = yield call(personDetailData, payload)
      yield put({
        type: 'updateState',
        payload: {
          personDetail: content,
        },
      })
    },
    // 获取人员下的角色信息
    * getPersonRole({ payload }, { call, put }) {
      const { content } = yield call(personRoleData, payload)
      yield put({
        type: 'updateState',
        payload: {
          roleList: content,
        },
      })
    },
    // 移除人员 delPersonData
    * delPerson({ payload }, { call, put, select }) {
      const userId = yield select(({ personAdminDetail }) => personAdminDetail.userId)
      const data = yield call(delPersonData, { userId })
      message.success('移除成功', 3)
      yield put(routerRedux.push('/personAdmin'))
    },
    // 移除人员下的角色
    * delPersonRole({ payload }, { call, put, select }) {
      const data = yield call(delpersonRoleData, payload)
      message.success('移除成功', 3)
      const userId = yield select(({ personAdminDetail }) => personAdminDetail.userId)
      yield put({
        type: 'getPersonRole',
        payload: {
          userId,
        },
      })
    },
    // 获取组织下的全部角色
    * getOrgRole({ payload }, { call, put }) {
      const { content } = yield call(orgRoleData, payload)
      yield put({
        type: 'updateState',
        payload: {
          orgRoleList: content,
          addRoleVisible: true,
        },
      })
    },
    // 编辑人员下的角色
    * postPersonRole({ payload }, { call, put, select }) {
      const userId = yield select(({ personAdminDetail }) => personAdminDetail.userId)
      const data = yield call(setPersonRole, { ...payload, userId })
      message.success('操作成功', 3)
      yield put({
        type: 'updateState',
        payload: {
          addRoleVisible: false,
        },
      })
      yield put({
        type: 'getPersonRole',
        payload: {
          userId,
        },
      })
    },
    // 获取上级部门下拉列表
    * getDeptSelect({ payload }, { call, put }) {
      const { content } = yield call(deptTreeData, payload)
      let list = []
      if (content && content[0]) {
        list = content[0].children
      }
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
      megra(list)
      yield put({
        type: 'updateState',
        payload: {
          deptSelect: list,
        },
      })
    },
    // 编辑人员部门
    * postPersonDept({ payload }, { call, put, select }) {
      const data = yield call(setPersonDept, payload)
      const userId = yield select(({ personAdminDetail }) => personAdminDetail.userId)
      yield put({
        type: 'updateState',
        payload: {
          personDeptVisible: false,
        },
      })
      message.success('操作成功', 3)
      // 查询人员详情
      yield put({
        type: 'getPersonDetail',
        payload: {
          userId,
        },
      })
      // 人员下的角色
      yield put({
        type: 'getPersonRole',
        payload: {
          userId,
        },
      })
      // 获取部门
      yield put({
        type: 'getDeptSelect',
      })
    },
  },
  reducers: {

  },
})
