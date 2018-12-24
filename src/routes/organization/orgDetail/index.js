import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Modal, Icon, Row, Col, Spin } from 'antd'
import FormModel from './modal/editModal'
import QualificationsModal from './modal/QualificationsModal'
import ScopeModal from './modal/ScopeModal'
import ModalFileLook from './modal/ModalFileLook'
import TagModal from './modal/TagModal'
import PlainForm from '../../../components/PlainForm'
import Breadcrumb from '../../../components/Breadcrumb'
import AddAccount from '../organization/addAccount'
import { getBasicFn } from '../../../utils/index'
import Style from './index.less'
import ChangeType from './modal/changeType'
import Tab from './Tab'
import dataDetail from './data'

const { confirm } = Modal
const namespace = 'orgDetail'
const organizeType = [
  { label: '供应商', value: '03' },
  { label: '医疗机构', value: '02' },
  { label: '生产厂家', value: '04' },
  { label: '监管机构', value: '06' },
  { label: '供应商&生产厂家', value: '07' },
  { label: '银行', value: '05' },
]
function IndexPage({
  orgDetail,
  loading,
  app: {
    constants: { addressList },
  },
}) {
  const { dispatchAction, getLoading } = getBasicFn({ namespace, loading })
  const {
    bankLevelList,
    personSearchParam,
    currentTab,
    category68Ids,
    categoryTree,
    backAccountObj,
    backAccountIdObj,
    accountExitFlag,
    addAccountVisible,
    currentTags,
    accuracy,
    parentGradeList,
    secondGradeList,
    parentOrgList,
    orgIdSign,
    orgStatus,
    certificateList,
    personList,
    sonOrgList,
    currentOrgDetail,
    orgPersonPagination,
    orgSonPagination,
    visible,
    hideItems,
    longStatus,
    modelTypeQualifications,
    qualificationsModalVisible,
    currentQualifications,
    extraTabButton,
    scopeLoadingStatus,
    searchValue,
    expandedKeys,
    autoExpandParent,
    scopeModalVisible,
    fileLookModalVisible,
    currentItemFileModal,
    tagModalVisible,
    changeTypeVisible,
  } = orgDetail
  const { leftData, rightData, scopeShowStatus } = dataDetail(currentOrgDetail)
  let hideInputStatus = {
    sort1: false,
    sort2: false,
    sort3: false,
    sort4: false,
  }
  const checkInputShow = (e) => {
    switch (e) {
      // 供应商厂家
      case '03':
        hideInputStatus = {
          sort1: false,
          sort2: true,
          sort3: true,
          sort4: true,
        }
        break
      case '04':
        hideInputStatus = {
          sort1: false,
          sort2: true,
          sort3: true,
          sort4: true,
        }
        break
      case '07':
        hideInputStatus = {
          sort1: false,
          sort2: true,
          sort3: true,
          sort4: true,
        }
        break
      // 医疗机构
      case '02':
        hideInputStatus = {
          sort1: true,
          sort2: false,
          sort3: true,
          sort4: true,
        }
        break
      // 监管机构
      case '06':
        hideInputStatus = {
          sort1: true,
          sort2: true,
          sort3: false,
          sort4: true,
        }
        break
      // 银行
      case '05':
        hideInputStatus = {
          sort1: true,
          sort2: true,
          sort3: true,
          sort4: false,
        }
        break
      default:
        hideInputStatus = {
          sort1: false,
          sort2: false,
          sort3: false,
          sort4: false,
        }
        break
    }
    dispatchAction({ payload: { hideItems: hideInputStatus } })
  }
  const onChange = (e) => {
    checkInputShow(e)
  }
  const showChangeType = () => {
    dispatchAction({ type: 'updateState', payload: { changeTypeVisible: true } })
  }
  const showEditModel = () => {
    checkInputShow(currentOrgDetail.orgTypeCode)
    dispatchAction({ payload: { visible: true } })
    dispatchAction({ type: 'queryParentOrgList', payload: { orgName: '' } })
  }
  const changeStatus = (e) => {
    confirm({
      content: e ? '您确定要停用该机构吗？' : '您确定要启用该机构吗？',
      onOk() {
        dispatchAction({
          type: 'stopOrganization',
          payload: {
            orgIdSign: currentOrgDetail.orgIdSign,
            orgStatus: e,
          },
        })
      },
    })
  }
  const showScopeModel = () => {
    dispatchAction({ type: 'queryDefaultTree' })
  }
  const showAccountModel = () => {
    dispatchAction({ payload: { addAccountVisible: true } })
  }
  // 编辑组织机构参数
  const formParam = {
    dispatchAction,
    saveAddOrg(data) {
      dispatchAction({
        type: 'saveAddOrg',
        payload: data,
      })
    },
    onSearchOrg(e) {
      dispatchAction({
        type: 'queryParentOrgList',
        payload: {
          orgName: e,
        },
      })
    },
    parentGradeList,
    secondGradeList,
    bankLevelList,
    parentOrgList,
    currentOrgDetail,
    onWorkAddressChange(val, selectedOptions) {
      const adressArray = [...val]
      for (const item of selectedOptions) {
        adressArray.push(item.label)
      }
      dispatchAction({
        workAddressChanged: true,
        workAddressVal: adressArray.join(),
      })
    },
    onRegisterAddressChange(val, selectedOptions) {
      const adressArray = [...val]
      for (const item of selectedOptions) {
        adressArray.push(item.label)
      }
      dispatchAction({
        registerAddressChanged: true,
        registerAddressVal: adressArray.join(),
      })
    },
    hideItems,
    onChange,
    addressList,
    visible,
    organizeType,
    onCancel() {
      dispatchAction({
        payload: {
          visible: false,
        },
      })
    },
  }
  // 证件modal参数
  const qualificationParam = {
    certificateList,
    currentOrgDetail,
    qualificationsLoadingStatus: false,
    longStatus,
    checkboxChange(data) {
      dispatchAction({
        payload: {
          longStatus: data.target.checked,
        },
      })
    },
    modelTypeQualifications,
    qualificationsModalVisible,
    onOkQualifications(data) {
      const sourse =
        modelTypeQualifications === 'create' ? 'addQualifications' : 'editQualifications'
      dispatchAction({
        type: sourse,
        payload: data,
      })
    },
    currentQualifications,
    fileExit: [],
    onCancel() {
      dispatchAction({
        payload: { qualificationsModalVisible: false },
      })
    },
  }
  // 选项卡参数
  const tabParam = {
    personSearchParam,
    currentTab,
    orgIdSign,
    dispatchAction,
    accuracy,
    getLoading,
    currentOrgDetail,
    tagModalShow(data) {
      dispatchAction({
        payload: {
          tagModalVisible: true,
          currentTags: data,
        },
      })
    },
    fileLookShow(data) {
      dispatchAction({
        payload: {
          fileLookModalVisible: true,
          currentQualifications: data,
        },
      })
    },
    editFileShow(data) {
      dispatchAction({
        payload: {
          qualificationsModalVisible: true,
          modelTypeQualifications: 'update',
          currentQualifications: data,
          longStatus: data.eternalLife,
        },
      })
    },
    extraTabButton,
    addFileModel() {
      dispatchAction({
        payload: {
          qualificationsModalVisible: true,
          modelTypeQualifications: 'create',
          currentQualifications: {},
        },
      })
    },
    getCertificateList() {
      dispatchAction({ type: 'getCertificateList', payload: {} })
    },
    getSonOrgList() {
      dispatchAction({ type: 'getSonOrgList', payload: {} })
    },
    getPersonList() {
      dispatchAction({ type: 'getPersonList', payload: {} })
    },
    tabOnChange(e) {
      dispatchAction({
        payload: {
          currentTab: String(e),
        },
      })
      if (Number(e) === 3) {
        dispatchAction({ payload: { extraTabButton: true } })
      } else {
        dispatchAction({ payload: { extraTabButton: false } })
      }
    },
    certificateList,
    personList,
    orgPersonPagination,
    orgSonPagination,
    organizeType,
    sonOrgList,
  }

  const getParentKey = (value, tree) => {
    let parentId
    for (const items of tree) {
      const node = items
      if (node.children) {
        if (node.children.some(item => item.value === value)) {
          parentId = node.value
        } else if (getParentKey(value, node.children)) {
          parentId = getParentKey(value, node.children)
        }
      }
    }
    return parentId
  }
  // 经营范围设置
  const scopeParam = {
    category68Ids,
    scopeLoadingStatus,
    searchValue,
    expandedKeys,
    autoExpandParent,
    categoryTree,
    scopeModalVisible,
    onCancel() {
      dispatchAction({
        payload: {
          scopeModalVisible: false,
        },
      })
    },
    onChangePara(e) {
      if (!e.target.value.startsWith(' ')) {
        const value = e.target.value.toUpperCase()
        const gData = []
        if (e.target.value) {
          const loopArr = data =>
            data.map((item) => {
              if (item.children) {
                loopArr(item.children)
              }
              return gData.push({
                label: item.label,
                value: item.value,
                wordArr: [item.label, item.textHelp ? item.textHelp : ''],
              })
            })
          loopArr(categoryTree)
        }
        dispatchAction({
          payload: {
            searchValue: value,
          },
        })
        const expand = gData
          .map((item) => {
            let index
            item.wordArr.some((_items) => {
              index = _items.search(value)
              return index > -1
            })
            if (index > -1) {
              return getParentKey(item.value, categoryTree)
            }
            return null
          })
          .filter((item, i, self) => item && self.indexOf(String(item)) === i)
        dispatchAction({
          payload: {
            searchValue: value,
            expandedKeys: [...expand, ...category68Ids],
            autoExpandParent: true,
          },
        })
      }
    },
    onExpand(onExpandedKeys) {
      dispatchAction({
        payload: {
          autoExpandParent: false, // 自动展开
          expandedKeys: onExpandedKeys, // 默认展开的节点
        },
      })
    },
    onCheckTree(checkedKeys) {
      dispatchAction({
        payload: {
          category68Ids: checkedKeys,
          changeStatus: true,
        },
      })
    },
    onOkScope() {
      dispatchAction({ type: 'setScope' })
    },
  }
  // 证件查看
  const modalFileLookParam = {
    fileLookModalVisible,
    currentQualifications,
    onCancel() {
      dispatchAction({
        payload: {
          fileLookModalVisible: false,
          currentQualifications: {},
        },
      })
    },
  }
  // 标签modal
  const tagModalParam = {
    onSaveTag(data) {
      dispatchAction({
        type: 'updateUserTag',
        payload: data,
      })
    },
    currentTags,
    // fileLookLoadingStatus,
    orgIdSign,
    tagModalVisible,
    currentItemFileModal,
    onCancel() {
      dispatchAction({
        payload: {
          tagModalVisible: false,
          currentTags: '',
        },
      })
    },
  }
  const changeTypeParams = {
    visible: changeTypeVisible,
    loading: getLoading('changeType'),
    onOk: (orgTypeValue) => {
      dispatchAction({ type: 'changeOrgType', payload: orgTypeValue })
    },
    onCancel: () => {
      dispatchAction({ type: 'updateState', payload: { changeTypeVisible: false } })
    },
    currentType: currentOrgDetail.orgTypeCode,
  }
  const addAccountModalParam = {
    backAccountObj,
    backAccountIdObj,
    accountExitFlag,
    addAccountVisible,
    dispatchAction,
    getLoading,
  }
  return (
    <div className="aek-layout">
      <div className="bread">
        <div>
          <Breadcrumb />
        </div>
      </div>
      <div className="content">
        <Spin spinning={getLoading('queryDetailPage', 'stopOrganization')}>
          <div className={Style.topContent}>
            <div className={`aek-content-title ${Style.headline}`}>
              <div className="aek-title-left">基本信息</div>
              <div className="aek-title-right">
                {!(['03', '04', '07'].indexOf(currentOrgDetail.orgTypeCode) < 0) && (
                  <a className="aek-red aek-mr20" onClick={showChangeType}>
                    更改机构类型
                  </a>
                )}
                <a className={Style.mr} onClick={showEditModel}>
                  <Icon style={{ marginRight: 8 }} type="edit" />
                  编辑
                </a>
                {!orgStatus ? (
                  <a className={Style.mr} onClick={() => changeStatus(1)}>
                    <Icon style={{ marginRight: 8 }} type="close-circle-o" />
                    停用
                  </a>
                ) : (
                  <a className={Style.mr} onClick={() => changeStatus(0)}>
                    <Icon style={{ marginRight: 8 }} type="down-circle-o" />
                    启用
                  </a>
                )}
                {!scopeShowStatus ? (
                  <a className={Style.mr} onClick={showScopeModel}>
                    <Icon style={{ marginRight: 8 }} type="edit" />
                    维护经营范围
                  </a>
                ) : (
                  ''
                )}
                {currentOrgDetail.adminFlag && (
                  <a className={Style.mr} onClick={showAccountModel}>
                    <Icon style={{ marginRight: 8 }} type="edit" />
                    生成管理员账号
                  </a>
                )}
              </div>
            </div>
            <div className="aek-mt20">
              <Row>
                <Col span={12}>
                  <PlainForm size={1} data={leftData} />
                </Col>
                <Col span={12}>
                  <PlainForm size={1} data={rightData} />
                </Col>
              </Row>
            </div>
          </div>
        </Spin>
        <div className={Style.bottomContent}>
          <Tab {...tabParam} />
        </div>
      </div>
      <ChangeType {...changeTypeParams} />
      <FormModel {...formParam} />
      <QualificationsModal {...qualificationParam} />
      <ScopeModal {...scopeParam} />
      <ModalFileLook {...modalFileLookParam} />
      <TagModal {...tagModalParam} />
      <AddAccount {...addAccountModalParam} />
    </div>
  )
}
IndexPage.propTypes = {
  routes: PropTypes.array,
  children: PropTypes.node,
  loading: PropTypes.object,
  orgDetail: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ orgDetail, app, loading }) => ({ orgDetail, loading, app }))(IndexPage)
