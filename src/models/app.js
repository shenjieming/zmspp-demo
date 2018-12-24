import { routerRedux } from 'dva/router'
import Cookies from 'js-cookie'
import { message } from 'antd'
import { get, has, differenceWith, partition } from 'lodash'
import dvaModelExtend from 'dva-model-extend'
import { devModel, TOKEN, openUrl, IS_CONFIG_PROD_ENV, publicPath } from '../utils/config'
import services from '../services/app'
import { setRequestUserId } from '../utils/axiosInstance'
import { USER_INFO_TEMP } from '../utils/constant'
import { mockMenuData, mockUser, mockOrgInfo, mockOrgList } from '../utils/menuData'
import organizationInfo from './organizationInfo'

const namespace = 'app'

let action = null

const initialState = {
  // 用户登录状态
  isLogin: false,
  user: {
    // 用户真实姓名
    userRealName: undefined,
    // 用户ID
    userId: undefined,
    // token
    token: undefined,
    // 用户头像
    userImageUrl: undefined,
  },
  orgInfo: {
    // 组织ID
    orgId: undefined,
    // 组织名称
    orgName: undefined,
    // 金额精度
    accuracy: undefined,
    // 金额精度（小数形式）
    accuracyDecimal: undefined,
    // 组织机构类型 01-平台;02-医院（医疗机构）;03-耗材供应商;04-厂家;05银行;06-监管机构;
    //  07-供应商 & 厂家; 08-配件供应商; 09-设备供应商; 10-设备维修商',
    orgType: undefined,
  },
  // 菜单收缩
  siderCollapsed: false,
  // 菜单栏数据
  menuData: [],
  // 用户鉴权
  menuAuthData: [],
  // 当前选中菜单
  menuSelectedKeys: [],
  // 个人信息配置
  baseConfigMenu: [],
  // 组织机构
  orgList: [],
  // 全局保存常量
  constants: {
    // 地址
    addressList: [],
    // 物资标准分类
    standardCategoryTree: [],
    // 68码树数据
    sixEightCodeTree: [],
    // 包装单位
    packageUnit: [],
    // 注册证配置类型
    registTypeList: [],
  },
  // 未读消息
  msgDataSource: [],
  // 机构信息补全
  organizationInfo: {
    auditStatus: 2,
    needCompleteInfo: 1,
    orgType: '',
    reason: '',
    parentGrade: [],
    secondGrade: [],
    eternalLifeObj: {},
    profit: true,
    orgCertificateType: 1,
    orgDetail: {},
    selectOrg: {},
    parentOrgList: [],
    orgName: '',
    orgIdSign: '',
  },
  // 选择默认供应商modal
  chooseOrgModalVisible: false,
  // 功能按钮
  functionList: {},
  // 个性化配置
  personalityConfig: {
    deliveryQtyCanOverPurchaseQtyFlag: true, // 配送数量是否可以超出采购数量标记
    displayPurchaseItemRemarkFlag: false, // 采购明显是否显示备注标记
    deliveryCanEnterRfidFlag: true, // 发货时是否可以录入RFID
    deliveryBarcodeShape: 1, // 配送单条码样式 1是一维码 2是二维码
    deliveryCanCancelFlag: true, // 配送单是否可以作废标记
    deliveryPrintDynamicConfigFlag: false, // 配送单打印动态配置标记
  },
}

export default dvaModelExtend(organizationInfo, {
  namespace,
  state: initialState,
  subscriptions: {
    setup({ dispatch, history }) {
      action = dispatch
      if (!devModel) {
        dispatch({ type: 'getStorageUser', payload: history.location })
        history.listen(({ pathname }) => {
          if (!openUrl.includes(pathname)) {
            dispatch({ type: 'checkAuth' })
          }
        })
      } else {
        dispatch({ type: 'getMockData' })
      }
    },
    // 检查版本更新
    checkVersion: ({ history }) => {
      // history.listen(() => {
      //   const versionRequest = new Request(`${publicPath}version.js`, {
      //     method: 'GET',
      //     cache: 'reload',
      //   })
      //   fetch(versionRequest)
      //     .then(res => (res.status === 200 ? res.text() : ''))
      //     .then((version) => {
      //       if (!version) {
      //         return
      //       }
      //       if (
      //         (localStorage.frontendVersion && version !== localStorage.frontendVersion) ||
      //         (window.frontendVersion && version !== window.frontendVersion)
      //       ) {
      //         location.reload() // 刷新页面
      //       }
      //       localStorage.frontendVersion = version // 保存 以便下次使用判断
      //       window.frontendVersion = version // 保存 以便下次使用判断
      //     })
      // })
    },
    // 监听路由变化
    watchHistory({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (!openUrl.includes(pathname)) {
          // 切换选中的菜单
          const key = pathname
            .split('/')
            .slice(0, 3)
            .join('/')
          dispatch({ type: 'updateState', payload: { menuSelectedKeys: [key] } })
        }
        /* 生产环境使用百度统计追踪路由 */
        if (IS_CONFIG_PROD_ENV) {
          if (pathname !== '/') {
            _hmt.push(['_trackPageview', pathname])
          }
        }
      })
    },
  },
  effects: {
    // 用户超时点击确定回调
    * pushToLogin(_, { put }) {
      yield put({ type: 'userLogout' })
      yield put(routerRedux.push('/login'))
    },
    // 登录成功
    * loginSuccess({ payload }, { put, update }) {
      const { userInfo, orgList, menuList, target, functionList } = payload
      yield update({ functionList })
      yield put({
        type: 'queryUserSuccess',
        payload: userInfo,
      })
      yield put({
        type: 'getOrgSuccess',
        payload: orgList,
      })
      yield put({
        type: 'getMenuDataSuccess',
        payload: menuList,
      })
      yield put(routerRedux.replace(target || '/'))
      yield put({ type: 'saveUserData' })
      yield put({ type: 'afterLogin' })
      message.success('登录成功')
      // yield put({ type: 'startGetMsg' }) 11/30删除
    },
    // 保存用户所有信息
    * saveUserData(_, { select }) {
      const { user, orgInfo, menuData, baseConfigMenu, orgList } = yield select(({ app }) => app)
      const { token } = user
      for (const prop of Object.keys(localStorage)) {
        if (prop.startsWith(USER_INFO_TEMP)) {
          localStorage.removeItem(prop)
        }
      }
      localStorage.setItem(
        `${USER_INFO_TEMP}${token}`,
        JSON.stringify({
          user,
          orgInfo,
          menuData: [...baseConfigMenu, ...menuData],
          orgList,
        }),
      )
    },
    // 获取localStorage中的缓存用户信息, 获取不到则返回登录页
    * getStorageUser({ payload }, { put, update }) {
      const { pathname } = payload
      if (openUrl.includes(pathname)) {
        return
      }
      const cookie = Cookies.get(TOKEN)
      if (cookie) {
        const prop = `${USER_INFO_TEMP}${cookie}`
        if (has(localStorage, prop)) {
          const { user, orgInfo, menuData, orgList } = JSON.parse(localStorage.getItem(prop))
          yield put({ type: 'queryUserSuccess', payload: user })
          yield put({ type: 'getMenuDataSuccess', payload: menuData })
          yield update({ orgInfo, orgList })
          yield put({ type: 'getMenuData' })
          yield put({ type: 'afterLogin' })
          // yield put({ type: 'startGetMsg' }) 11/30删除
        } else {
          yield put(routerRedux.replace('/login'))
        }
      } else {
        yield put(routerRedux.replace('/login'))
      }
    },
    // 确认用户当前登录状态
    * checkAuth(_, { put, select }) {
      const isLogin = yield select(({ app }) => app.isLogin)
      if (!isLogin) {
        yield put(routerRedux.replace('/login'))
      }
    },
    // 获取开发模拟数据
    * getMockData(_, { put, update }) {
      yield put({ type: 'getMenuDataSuccess', payload: mockMenuData })
      yield put({ type: 'queryUserSuccess', payload: mockUser })
      yield update({ orgInfo: mockOrgInfo, orgList: mockOrgList })
    },
    // 用户点击注销
    * logout(_, { put, call }) {
      yield call(services.logout)
      yield put({ type: 'pushToLogin' })
      // yield call(services.msgSocketDisconnect)  11/30 删除
      setRequestUserId(null)
      message.success('注销成功')
    },
    // 获取菜单
    * getMenuData(_, { call, put, update }) {
      const {
        content: { menuList, functionList },
      } = yield call(services.getMenuData)
      yield put({ type: 'getMenuDataSuccess', payload: menuList })
      yield update({ functionList })
      yield put({ type: 'saveUserData' })
    },
    // 切换组织
    * switchOrg({ payload }, { call, put, select }) {
      yield call(services.switchOrg, { orgId: payload })
      const orgList = yield select(({ app }) => app.orgList)
      const selected = orgList.find(({ orgId }) => orgId === payload)
      yield put({ type: 'switchOrgSuccess', payload: selected })
      yield put({ type: 'getMenuData' })
      // yield call(services.msgSocketDisconnect)  11/30删除
      yield put(routerRedux.push('/'))
      // yield put({ type: 'startGetMsg' }) 11/30删除
    },
    // 获取地址
    * queryAddress(_, { call, put, select }) {
      const addressList = yield select(({ app }) => app.constants.addressList)
      if (!addressList.length) {
        const { content } = yield call(services.queryAddress, {})
        yield put({
          type: 'queryConstant',
          payload: { addressList: content },
        })
      }
    },
    // 获取标准物资分类树
    * getStandardCategoryTree(_, { call, put, select }) {
      const standardCategoryTree = yield select(({ app }) => app.constants.standardCategoryTree)
      if (!standardCategoryTree.length) {
        const { content } = yield call(services.queryStandardCategoryTree)
        yield put({
          type: 'queryConstant',
          payload: { standardCategoryTree: content },
        })
      }
    },
    // 获取68码树
    * getSixEightCodeTree(_, { call, put, select }) {
      const sixEightCodeTree = yield select(({ app }) => app.constants.sixEightCodeTree)
      if (!sixEightCodeTree.length) {
        const { content } = yield call(services.getSexEightCodeTree)
        yield put({
          type: 'queryConstant',
          payload: {
            sixEightCodeTree: content,
          },
        })
      }
    },
    // 获取包装单位
    * getPackageUnit(_, { call, put, select }) {
      const packageUnit = yield select(({ app }) => app.constants.packageUnit)
      if (!packageUnit.length) {
        const { content } = yield call(services.packageUnitData, { dicKey: 'MEASUREMENT_UNIT' })
        yield put({
          type: 'queryConstant',
          payload: {
            packageUnit: content,
          },
        })
      }
    },
    // 将所有消息设为已读
    * setAllRead(_, { call, update }) {
      yield call(services.setReadAll)
      yield update({ msgDataSource: [] })
    },
    // 单条已读
    * setOneRead({ payload }, { call }) {
      yield call(services.setReadOne, { msgId: payload })
    },
    // 打开websocket 11/30删除
    // * startGetMsg(_, { select, call, update }) {
    //   const { content: msgDataSource } = yield call(services.getAllNoReadMsg)
    //   yield update({ msgDataSource })
    //   const {
    //     user: { userId },
    //     orgInfo: { orgId },
    //   } = yield select(store => store[namespace])
    //   yield call(services.msgSocketConnect, {
    //     orgId,
    //     userId,
    //     action: (rs) => {
    //       action({ type: 'receiveMsg', payload: rs })
    //     },
    //   })
    // },
    // 选择默认供应商
    * chooseDefaultOrg({ payload }, { call, update }) {
      const { content } = yield call(services.chooseDefaultOrg, { defaultOrgId: payload })
      yield update({ orgList: content })
    },
    // 获取个性化配置
    * getPersonalityConfig({ payload }, { call, update }) {
      const { content } = yield call(services.getPersonalityConfig, payload)
      yield update({
        personalityConfig: content,
      })
      return content
    },
    // 获取注册证配置参数
    * getRegistList({ _ }, { call, put, select }) {
      const registTypeList = yield select(({ app }) => app.constants.registTypeList)
      if (!registTypeList.length) {
        const { content } = yield call(services.getRegistList, {
          dicKey: 'REGISTER_CERTIFICATE_TYPE',
        })
        yield put({
          type: 'queryConstant',
          payload: {
            registTypeList: content,
          },
        })
      }
    },
  },
  reducers: {
    // 获取常量成功
    queryConstant(state, { payload }) {
      const constants = state.constants
      return {
        ...state,
        constants: {
          ...constants,
          ...payload,
        },
      }
    },
    // 获取用户成功
    queryUserSuccess(state, { payload }) {
      const { token } = payload

      Cookies.set(TOKEN, token)
      // 设置请求用户id
      setRequestUserId(payload.userId)

      return {
        ...state,
        user: payload,
        isLogin: true,
      }
    },
    // 切换组织成功
    switchOrgSuccess(state, { payload }) {
      const accuracy = Number(payload.orgAccuracy)
      const accuracyDecimal = 1 / 10 ** accuracy // eslint-disable-line

      return {
        ...state,
        orgInfo: { ...payload, accuracy, accuracyDecimal, orgType: payload.orgTypeValue },
      }
    },
    // 获取组织列表成功
    getOrgSuccess(state, { payload }) {
      const orgList = payload
      const item = orgList.find(x => x.isDefaultOrg)
      const accuracy = Number(item.orgAccuracy)
      const accuracyDecimal = 1 / 10 ** accuracy // eslint-disable-line

      return {
        ...state,
        orgList,
        orgInfo: {
          ...item,
          accuracy,
          accuracyDecimal,
          orgType: item.orgTypeValue,
        },
      }
    },
    // 用户注销时删除所有信息
    userLogout() {
      Cookies.remove(TOKEN)
      for (const prop of Object.keys(localStorage)) {
        if (prop.startsWith(USER_INFO_TEMP)) {
          localStorage.removeItem(prop)
        }
      }
      return { ...initialState }
    },
    // 获取菜单成功
    getMenuDataSuccess(state, { payload: menuData }) {
      // 菜单鉴权数据
      const menuAuthData = []

      for (const x of menuData) {
        if (x.hasMenu) {
          if (get(x.children, 'length')) {
            for (const child of x.children) {
              menuAuthData.push(`/${x.key}/${child.key}`)
            }
          }
        } else {
          menuAuthData.push(`/${x.key}`)
        }
      }

      const [baseConfigMenu, restMenuData] = partition(
        menuData,
        ({ key }) => key === 'personInfo' || key === 'organinfo' || key === 'vipPage',
      )

      return { ...state, menuData: restMenuData, baseConfigMenu, menuAuthData }
    },
    // 接收websocket消息
    receiveMsg(state, { payload }) {
      let list = [...state.msgDataSource]
      const { type, msgList } = payload
      if (type === 1) {
        list = msgList.concat(list)
      } else {
        list = differenceWith(list, msgList, (arrVal, othVal) => arrVal.msgId === othVal.msgId)
      }
      return { ...state, msgDataSource: list }
    },
  },
})
