import { message } from 'antd'
import pathToRegexp from 'path-to-regexp'
import { stringify, parse } from 'qs'
import {
  getSixEightCodeTree,
  orgDetailData,
  orgDetailCertifiData,
  orgPersonData,
  orgPersonTransData,
  editOrgDetailData,
  certificatesListData,
  editCertificateForFront,
  queryRunScope,
  updateRunScope,
  changeLogoImage,
  downloadFileData,
} from '@services/home/organInfo'
import modelExtend from '@utils/modelExtend'
import {dicKey, getParentOrgList,savePoolId,getRelationEdit} from "../../services/organization";

// 初始化数据
const initState = {
  orgDetail: {}, // 组织机构详情
  certificateList: [], // 组织机构下证件列表
  searchData: {}, // 人员搜索条件
  orgPersonList: [], // 组织机构下可转让组织管理关系的人员列表
  orgPersonVisible: false, // 组织管理权转让弹框
  orgPersonListPagination: {}, // 组织机构下可转让组织管理关系的人员列表 分页
  orgEditVisible: false, // 编辑企业资料
  searchValue: '', // 搜索的值
  expandedKeys: [], // 默认展开的节点
  autoExpandParent: true, // 自动展开
  category68Ids: [], // 选中的树
  categoryTree: [], // 经营范围树
  scopeModalVisible: false, // 维护经营范围弹框
  poolModalVisible: false,
  modalVisible: false, // 编辑企业证件弹框
  eternalLifeObj: {}, // 复选框选择数据
  certificates: [], // 审核机构详情页  扩展信息
  reason: undefined, // 拒绝原因
  auditStatus: undefined, // 拒绝状态
  parentOrgList: [],
  parentGradeList: [],
  secondGradeList: [],
  registerAddressChanged: false,
  workAddressChanged: false,
  registerAddressVal: '',
  workAddressVal: '',
  searchParam: {},
  personSearchParam: {},
  longStatus: false,
  modelTypeQualifications: '',
  qualificationsModalVisible: false,
  currentQualifications: {},
  fileLookModalVisible: false,
  currentItemFileModal: {},
  changeStatus: false,
  tagModalVisible: false,
  orgStatus: 0, // 组织机构停用启用
  orgSonPagination: {
    current: 1,
    total: null,
  },
  orgPersonPagination: {
    current: 1,
    pageSize: 10,
    total: null,
  },
  organizeType: [],
  currentTab: '1',
  bankLevelList: [],
  changeTypeVisible: false,
  editFlag: 0,
}
const riskTypeArr = ['I类', 'II类', 'III类']
const riskTypeHelperArr = ['IL', 'IIL', 'IIIL']
const formData = (data) => {
  data.forEach((item, index) => {
    let label = ''
    label += item.categoryRiskType ? `${riskTypeArr[item.categoryRiskType - 1]} ` : ''
    if (item.categoryCode && item.parentCode) {
      item.categoryCode = item.categoryCode.replace(item.parentCode, '')
    }
    label += item.categoryCode ? `[${item.categoryCode}] ` : ''
    label += item.label
    item.label = label
    let helper = ''
    helper += item.categoryRiskType ? `${riskTypeHelperArr[item.categoryRiskType - 1]} ` : ''
    helper += item.categoryCode ? `[${item.categoryCode}] ` : ''
    helper += item.nameHelper
    item.textHelp = helper
    item.index = index + 1
    if (item.children && item.children.length > 0) {
      formData(item.children)
    }
  })
}

export default modelExtend({
  namespace: 'organInfo',
  state: {},
  subscriptions: {
    setup({ dispatch, history }) {
      // 获取地址
      history.listen(({ pathname, search }) => {
        const query = parse(search, { ignoreQueryPrefix: true })
        const match = pathToRegexp('/organInfo').exec(pathname)
        if (match) {
          dispatch({ type: 'app/queryAddress' })
          // 初始化数据
          dispatch({ type: 'updateState', payload: initState })
          // 获取组织机构详情
          dispatch({ type: 'getOrgDetail' })
          // 获取组织下的证件信息
          dispatch({ type: 'getOrgCertificate' })
          // 获取68码树数据
          dispatch({ type: 'getSixEightCodeTree' })
          dispatch({ type: 'getAuth' })
          if (Object.keys(query).length && query.from === 'msg') {
            dispatch({ type: 'organInfo/getCertificatesList' })
          }
        }
      })
    },
  },
  effects: {
    // 异步查询上级机构下拉列表
    * queryParentOrgList({ payload }, { select, call, update }) {
      const { selectOrg } = yield select(({ organInfo }) => organInfo)
      const { content } = yield call(getParentOrgList, { ...payload })
      let handleSubmit = content
      yield update({
        parentOrgList: handleSubmit,
      })
    },
    // 获取一级
    * firstLevel({ payload }, { call, update }) {
      const { content } = yield call(dicKey, { dicKey: 'HOSPITAL_LEVEL' })
      yield update({
        parentGradeList: content,
      })
    },
    // 获取甲等
    * secondLevel({ payload }, { call, update }) {
      const { content } = yield call(dicKey, { dicKey: 'HOSPITAL_ADMINISTRATIVE_LEVEL' })
      yield update({
        secondGradeList: content,
      })
    },
    // 获取银行等级
    * bankLevel({ payload }, { call, update }) {
      const { content } = yield call(dicKey, { dicKey: 'BANK_LEVEL' })
      yield update({
        bankLevelList: content,
      })
    },
    // 获取 组织机构详情
    * getOrgDetail({ payload }, { call, update, select }) {
      const { orgId } = yield select(({ app }) => app.orgInfo)
      const { content } = yield call(orgDetailData, { ...payload, orgIdSign: orgId })
      yield update({
        orgDetail: content,
      })
    },
    // 获取组织机构下的企业证件详情
    * getOrgCertificate({ payload }, { call, update, select }) {
      const { orgId } = yield select(({ app }) => app.orgInfo)
      const { content } = yield call(orgDetailCertifiData, { ...payload, orgIdSign: orgId })
      yield update({
        certificateList: content,
      })
    },
    // 获取组织下的人员列表
    * getOrgPerson({ payload }, { call, update }) {
      yield update({
        orgPersonVisible: true,
      })
      const { content } = yield call(orgPersonData, payload)
      yield update({
        orgPersonList: content.data,
        searchData: payload,
        orgPersonListPagination: {
          current: content.current,
          total: content.total,
          pageSize: content.pageSize,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: total => `共有 ${total} 条数据`,
        },
      })
    },
    // 组织关系转让
    * setPogPersonTrans({ payload }, { call, put, select }) {
      const { userId } = yield select(({ app }) => app.user)
      payload.moveUserId = userId
      const data = yield call(orgPersonTransData, payload)
      message.success('转让成功', 3)
      yield put({
        type: 'updateState',
        payload: {
          orgPersonVisible: false,
        },
      })
    },
    // 编辑机构
    * editOrgDetail({ payload }, { call, put }) {
      let str =  ''
      if (payload.orgLegalPersonUrls.length) {
        payload.orgLegalPersonUrls.forEach(item => {
          str = str + item.url + ','
        })
        payload.orgLegalPersonUrls =  str.substring(0, str.length-1)
      }
      const data = yield call(editOrgDetailData, payload)
      yield put({
        type: 'updateState',
        payload: {
          orgEditVisible: false,
        },
      })
      message.success('操作成功', 3)
      yield put({
        type: 'getOrgDetail',
      })
    },
    // 获取机构详情
    * getCertificatesList({ payload }, { call, put, select }) {
      const { orgId } = yield select(({ app }) => app.orgInfo)
      yield put({
        type: 'updateState',
        payload: {
          modalVisible: true,
        },
      })
      const { content } = yield call(certificatesListData, { ...payload, orgIdSign: orgId })
      if (content.certificates) {
        for (const obj of content.certificates) {
          if (obj.certificateType.length === 1) {
            obj.certificateType = `0${obj.certificateType}`
          }
        }
      }
      yield put({
        type: 'updateState',
        payload: {
          certificates: content.certificates,
          reason: content.reason, // 拒绝原因
          auditStatus: content.draftAuditStatus, // 拒绝状态
        },
      })
    },
    // 编辑企业证件
    * setCertificateForFront({ payload }, { call, put }) {
      const data = yield call(editCertificateForFront, payload)
      yield put({
        type: 'updateState',
        payload: {
          modalVisible: false,
        },
      })
      message.success('操作成功', 3)
      yield put({
        type: 'getOrgCertificate',
      })
    },
    // 获取68码树经营范围
    * getSixEightCodeTree(_, { call, update }) {
      const { content } = yield call(getSixEightCodeTree)
      formData(content)
      yield update({
        categoryTree: content,
      })
    },
    // 查询默认经营范围
    * queryDefaultTree({ payload }, { select, call, update }) {
      const { orgId } = yield select(({ app }) => app.orgInfo)
      yield update({ scopeModalVisible: true })
      const { content } = yield call(queryRunScope, { orgId })
      yield update({
        category68Ids: content,
        expandedKeys: content,
        changeStatus: false,
      })
    },
    // 总库ID 更新
    * upDatePool({ payload }, { select, call, update, put }) {
      yield call(savePoolId, { ...payload })
      message.success('保存成功')
      yield update({
        poolModalVisible: false,
      })
      yield put({ type: 'getOrgDetail' })
      // const { category68Ids, changeStatus } = yield select(({ organInfo }) => organInfo)
      // if (changeStatus) {
      //   yield call(updateRunScope, { orgId, category68Ids })
      //   message.success('修改成功')
      //   yield update({
      //     scopeModalVisible: false,
      //     category68Ids: [],
      //     autoExpandParent: true,
      //     changeStatus: false,
      //   })
      // } else {
      //   yield update({ scopeModalVisible: false, category68Ids: [], autoExpandParent: true })
      // }
    },
    // 经营范围设置更新
    * setScope({ payload }, { select, call, update }) {
      const { orgId } = yield select(({ app }) => app.orgInfo)
      const { category68Ids, changeStatus } = yield select(({ organInfo }) => organInfo)
      if (changeStatus) {
        yield call(updateRunScope, { orgId, category68Ids })
        message.success('修改成功')
        yield update({
          scopeModalVisible: false,
          category68Ids: [],
          autoExpandParent: true,
          changeStatus: false,
        })
      } else {
        yield update({ scopeModalVisible: false, category68Ids: [], autoExpandParent: true })
      }
    },
    // 图片上传
    * uploadImage({ payload }, { call, put, select }) {
      const { orgId } = yield select(({ app }) => app.orgInfo)
      const data = yield call(changeLogoImage, { ...payload, orgIdSign: orgId })
      message.success('上传成功', 3)
      yield put({
        type: 'getOrgDetail',
      })
    },
    // 激活下载文件
    * downloadFile({ payload }, { call }) {
      const reponse = yield call(downloadFileData, payload)
      function downFile(blob, fileName) {
        if (window.navigator.msSaveOrOpenBlob) {
          navigator.msSaveBlob(blob, fileName)
        } else {
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = fileName
          link.click()
          window.URL.revokeObjectURL(link.href)
        }
      }
      if (reponse.status === 200) {
        const blob = new Blob([JSON.stringify(reponse.data)])
        const fileName = ''
        downFile(blob, fileName)
      }
    },
    // 证件管理权限调用
    * getAuth({ payload }, { call, update }) {
      const { content } = yield call(getRelationEdit, {})
      yield update({
        editFlag: content.editFlag,
      })
    },
  },
  reducers: {},
})
