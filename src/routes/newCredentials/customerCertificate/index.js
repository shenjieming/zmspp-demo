import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Tabs } from 'antd'
import { debounce, cloneDeep } from 'lodash'
import Breadcrumb from '../../../components/Breadcrumb'
import ExpiryRemind from './expiryRemind'
import Regist from './regist'
import ProdFactory from './prodFactory'
import Auth from './auth'
import Power from './power'
import Other from './other'
import { getTabName, getBasicFn } from '../../../utils'
import AuthDetailModal from '../share/authDetail' // 授权书详情
// 生产厂家、总经销商
import ProdFactoryModal from '../share/prodFactoryDetail'
// 注册证详情
// import RegistDetailModal from '../share/registDetail'

import RegistDetail from '../share/registDetail/registModal'

// 委托书详情
import PowerDetailModal from '../share/powerDetail'
// 其他证件详情
import OtherDetailModal from '../share/otherDetail'
// 企业证件详情
import CompanyDetailModal from '../share/companyModal'

import ViewModal from '../share/viewModal/ViewModal'

const TabPane = Tabs.TabPane
const namespace = 'newCustomerCertificate'
function CustomerCertificate({
  newCustomerCertificate,
  effects,
  dispatch,
  routes,
  registTypeList,
}) {
  const { dispatchAction, getLoading } = getBasicFn({ namespace, loading: { effects } })
  const {
    searchData,
    dataSource,
    registDataSource, // 注册证
    factoryDataSource, // 生产厂家
    authDataSource, // 授权书分页列表
    powerDataSource, // 委托书分页列表
    otherDataSource, // 其他档案分页列表
    pagination,
    tabIndex,
    rowSelectData,
    // selectedRowKeys,
    authDetail, // 查看授权书详情
    authDetailVisible, // 查看授权书详情弹框
    modalTitle, // 所有弹框的标题
    agentOptions,
    factoryOptions,
    prodFactoryVisible, // 厂家总代三证详情弹框
    prodFactoryDetail, // 厂家总代三证详情
    eternalLifeObj, // 复选框状态
    registDetail, // 注册证详情
    registDetailVisible, // 注册证弹框
    registCodeOptions, // 证号模糊匹配
    registCodeSelected, // 默认没有点击模糊匹配的数据
    powerDetail, // 委托书详情
    powerDetailVisible, // 委托书详情弹框
    powerDetailCustOptions, // 授权书详情客户名称
    powerDetailPersonOptions, // 授权书详情人员名称
    powerCustomerVisible, // 授权客户弹框
    powerCustomerList, // 授权客户列表
    powerCustomerTargetKeys, // 授权客户已选择列表
    otherDetail, // 其他证件详情
    otherDetailVisible, // 其他证件详情弹框
    otherCustOptions, // 其他证件详情客户名称
    allCustomerOptions, // 授权书授权客户列表
    certificateNum,
    companyDetailVisible,
    companyDetail,
    companyLifeObj,
    refuseReasonList, // 拒绝原因
    otherTypeOptions, // 其他证件 证件类型下拉选项

    viewStep, // 查看步骤
    viewStatus, // 查看注册证弹框状态


    detailModalVisible,
    certificateDetail,
  } = newCustomerCertificate
  const handleCustomer = (value) => {
    dispatchAction({
      type: 'getCustomerOptions',
      payload: {
        keywords: value,
      },
    })
  }
  const debounceCusotmer = debounce(handleCustomer, 500, { trailing: true })
  // 生产厂家下拉列表
  const handl = (value) => {
    dispatchAction({ type: 'getFactoryOptions', payload: { keywords: value } })
  }
  const handleFacroryChange = debounce(handl, 500, { trailing: true })
  // 上级机构就是 总代
  const handle = (value) => {
    dispatchAction({ type: 'getAgentOptions', payload: { keywords: value } })
  }
  const handleAgentChange = debounce(handle, 500, { trailing: true })
  // 其他证件客户名称
  const ohherCus = (value) => {
    dispatchAction({
      type: 'getOtherCustomer',
      payload: {
        keywords: value,
      },
    })
  }
  const getOtherCust = debounce(ohherCus, 500, { trailing: true })
  // tabs页切换
  const tabsChange = (value) => {
    dispatchAction({
      payload: {
        tabIndex: value,
        pagination: {},
        rowSelectData: {},
        searchData: {},
      },
    })
    let url = ''
    let numUrl = ''
    const reqObj = {}
    if (value === '1') {
      url = 'getCertificateList'
      numUrl = 'getValidStatistics'
      reqObj.certificateType = '1'
    } else if (value === '2') {
      url = 'getRegistList'
      numUrl = 'getRegistStatistics'
      reqObj.certificateStatus = '0'
    } else if (value === '3') {
      url = 'prodFactoryList'
      numUrl = 'getFactoryAgent'
      reqObj.certificateStatus = '0'
    } else if (value === '4') {
      url = 'authList'
      numUrl = 'getAuthStatistics'
      reqObj.certificateStatus = '0'
    } else if (value === '5') {
      url = 'powerList'
      numUrl = 'getPowerStatistics'
      reqObj.certificateStatus = '0'
    } else {
      url = 'otherList'
      numUrl = 'getOtherStatistics'
      reqObj.certificateStatus = '0'
      dispatchAction({
        type: 'getOtherTypeOptions',
        payload: {
          dicKey: 'OTHER_CERTIFICATE_TYPE',
        },
      })
    }
    /**
     * @desc 临时注释 不查询tab数量统计 2017-05-05
     * @author wangyang
     */
    // dispatch({
    //   type: numUrl,
    // })
    dispatchAction({
      type: url,
      payload: {
        current: 1,
        pageSize: 10,
        ...reqObj,
      },
    })
  }
  // 效期提醒参数
  const expiryRemindProps = {
    effects,
    dispatch,
    dataSource,
    pagination,
    searchData,
    tabIndex,
    debounceCusotmer,
    allCustomerOptions,
    registTypeList,
  }
  // 注册证
  const registProps = {
    effects,
    dispatch,
    registDataSource,
    pagination,
    searchData,
    tabIndex,
    allCustomerOptions,
    debounceCusotmer,
    registTypeList,
  }

  const registDetailProps = {
    modalVisible: registDetailVisible,
    loading: !!effects[`${namespace}/getRegistViewDetail`],
    status: viewStatus,
    step: viewStep,
    handleCancel() {
      dispatchAction({
        payload: {
          registDetailVisible: false,
          viewRegistDetail: {},
        },
      })
    },
    detail: registDetail,
    registTypeList,
  }

  // 生产厂家/总经销商
  const prodFactory = {
    effects,
    dispatch,
    factoryDataSource,
    pagination,
    searchData,
    tabIndex,
    allCustomerOptions,
    debounceCusotmer,
  }
  // 生产厂商/总经销商详情
  const ProdFactoryPorps = {
    refuseReasonList,
    effects,
    dispatch,
    prodFactoryVisible, // 厂家总代三证详情弹框
    eternalLifeObj,
    prodFactoryDetail, // 厂家总代三证详情
    modalTitle,
    rowSelectData,
    radioChange(value) {
      dispatchAction({
        payload: {
          prodFactoryDetail: {
            ...prodFactoryDetail,
            certificateDetailType: value,
          },
        },
      })
    },
    handleCancel() {
      dispatchAction({
        payload: {
          prodFactoryVisible: false,
          prodFactoryDetail: {},
        },
      })
    },
    handleOk(reqData) {
      // 需要判断是换证 还是 编辑证件
      let url = 'setProdFactorySubmit'
      if (modalTitle === '换证') {
        url = 'setProdFactoryReplace'
      }
      dispatchAction({
        type: url,
        payload: {
          factoryAgentCertificateId: rowSelectData.factoryAgentCertificateId,
          ...reqData,
        },
      })
    },
  }
  // 授权书
  const authProps = {
    effects,
    dispatch,
    authDataSource,
    pagination,
    searchData,
    tabIndex,
    powerCustomerVisible,
    powerCustomerList,
    powerCustomerTargetKeys,
    allCustomerOptions,
    debounceCusotmer,
  }
  // 授权书详情
  const authDetailProps = {
    refuseReasonList,
    authDetailVisible,
    effects,
    authDetail,
    modalTitle,
    agentOptions,
    factoryOptions,
    agentOptionsSearch(value) {
      handleFacroryChange(value)
    },
    produceOptionsSearch(value) {
      handleAgentChange(value)
    },
    checkedFacAuthchange(e) {
      const flag = e.target.checked
      dispatchAction({
        payload: {
          authDetail: {
            ...authDetail,
            factoryAuthFlag: flag,
          },
        },
      })
    },
    checkedLongchange(e) {
      const flag = e.target.checked
      dispatchAction({
        payload: {
          authDetail: {
            ...authDetail,
            validDateLongFlag: flag,
          },
        },
      })
    },
    handleCancel() {
      dispatchAction({
        payload: {
          authDetailVisible: false,
          authDetail: {},
        },
      })
    },
    handleOk(data) {
      const reqData = cloneDeep(data)
      // 逐级授权书
      let str = ''
      if (data.businessImageUrls) {
        for (const obj of data.businessImageUrls) {
          str += `${obj.value},`
        }
        str = str.substring(0, str.length - 1)
      }
      // 授权书
      let authUrls = ''
      if (data.certificateImageUrls) {
        for (const obj of data.certificateImageUrls) {
          authUrls += `${obj.value},`
        }
        authUrls = authUrls.substring(0, authUrls.length - 1)
      }
      // 是否长期有效
      if (!data.validDateLongFlag) {
        reqData.validDateStart = data.validDateEnd[0]
        reqData.validDateEnd = data.validDateEnd[1]
      }
      let url = 'setAuthSubmit'
      if (modalTitle === '换证') {
        url = 'setAuthReplace'
      }
      if (data.produceFactoryName) {
        reqData.produceFactoryId = data.produceFactoryName.key
        reqData.produceFactoryName = data.produceFactoryName.label
      }
      if (data.superiorAuthFactoryName) {
        reqData.superiorAuthFactoryId = data.superiorAuthFactoryName.key
        reqData.superiorAuthFactoryName = data.superiorAuthFactoryName.label
      }
      if (data.factoryAuthFlag) {
        reqData.factoryAuthFlag = 1
      } else {
        reqData.factoryAuthFlag = 0
      }
      dispatchAction({
        type: url,
        payload: {
          ...data,
          ...reqData,
          businessImageUrls: str,
          certificateImageUrls: authUrls,
          certificateId: authDetail.certificateId,
        },
      })
    },
  }
  // 委托书
  const powerProps = {
    effects,
    dispatch,
    powerDataSource,
    pagination,
    searchData,
    tabIndex,
    allCustomerOptions,
    debounceCusotmer,
  }
  // 委托书客户名称搜索
  const handleCust = (value) => {
    dispatchAction({
      type: 'getPowerDetailCust',
      payload: {
        keywords: value,
      },
    })
  }
  const getPowerCust = debounce(handleCust, 500, { trailing: true })
  // 委托书员工真实姓名
  const handlePerson = (value) => {
    dispatchAction({
      type: 'getPowerDetailPerson',
      payload: {
        keywords: value,
      },
    })
  }
  const getPowerPerson = debounce(handlePerson, 500, { trailing: true })
  // 委托书详情
  const powerDetailProps = {
    refuseReasonList,
    effects,
    modalTitle,
    powerDetail, // 委托书详情
    powerDetailVisible, // 委托书详情弹框
    powerDetailCustOptions, // 授权书详情客户名称
    powerDetailPersonOptions, // 授权书详情人员名称
    handleCancel() {
      dispatchAction({
        payload: {
          powerDetailVisible: false,
          powerDetail: {},
        },
      })
    },
    handleOk(data) {
      const reqData = cloneDeep(data)
      let url = 'setPowerSubmit'
      if (modalTitle === '换证') {
        url = 'setPowerReplace'
      }
      if (data.customerOrgName) {
        reqData.customerOrgId = data.customerOrgName.key
        reqData.customerOrgName = data.customerOrgName.label
      }
      if (data.customerContactName) {
        reqData.customerContactUserId = data.customerContactName.key
        reqData.customerContactName = data.customerContactName.label
      }
      let str = ''
      if (data.certificateImageUrls) {
        for (const obj of data.certificateImageUrls) {
          str += `${obj.value},`
        }
        str = str.substring(0, str.length - 1)
      }
      let bStr = ''
      if (data.businessImageUrls) {
        for (const obj of data.businessImageUrls) {
          bStr += `${obj.value},`
        }
        bStr = bStr.substring(0, bStr.length - 1)
      }
      if (!data.validDateLongFlag) {
        reqData.validDateStart = data.validDateEnd[0]
        reqData.validDateEnd = data.validDateEnd[1]
      }
      dispatchAction({
        type: url,
        payload: {
          certificateId: powerDetail.certificateId,
          ...data,
          ...reqData,
          certificateImageUrls: str,
          businessImageUrls: bStr,
        },
      })
    },
    checkedLongchange(e) {
      const flag = e.target.checked
      dispatchAction({
        payload: {
          powerDetail: {
            ...powerDetail,
            validDateLongFlag: flag ? 1 : 0,
          },
        },
      })
    },
    powerCustOptions(value) {
      getPowerCust(value)
    },
    powerPersonOptions(value) {
      getPowerPerson(value)
    },
  }
  // 其他证件
  const otherProps = {
    effects,
    dispatch,
    otherDataSource,
    pagination,
    searchData,
    tabIndex,
    otherCustOptions,
    otherTypeOptions,
    otherOptionsSearch(value) {
      getOtherCust(value)
    },
    allCustomerOptions,
    debounceCusotmer,
  }
  // 其他证件详情
  const otherDetailProps = {
    refuseReasonList,
    otherDetail, // 其他证件详情
    otherDetailVisible, // 其他证件详情弹框
    otherCustOptions, // 其他证件详情客户名称
    effects,
    modalTitle,
    otherTypeOptions,
    handleCancel() {
      dispatchAction({
        payload: {
          otherDetailVisible: false,
          otherDetai: {},
        },
      })
    },
    handleOk(data) {
      const reqData = cloneDeep(data)
      let url = 'setOtherSubmit'
      if (modalTitle === '换证') {
        url = 'setOtherReplace'
      }
      let bStr = ''
      if (data.certificateImageUrls) {
        for (const obj of data.certificateImageUrls) {
          bStr += `${obj.value},`
        }
        bStr = bStr.substring(0, bStr.length - 1)
      }
      if (!data.validDateLongFlag) {
        reqData.validDateStart = data.validDateEnd[0]
        reqData.validDateEnd = data.validDateEnd[1]
      }
      if (data.customerOrgName) {
        reqData.customerOrgId = data.customerOrgName.key
        reqData.customerOrgName = data.customerOrgName.label
      }
      dispatchAction({
        type: url,
        payload: {
          certificateId: powerDetail.certificateId,
          ...data,
          ...reqData,
          certificateImageUrls: bStr,
        },
      })
    },
    checkedLongchange(e) {
      const flag = e.target.checked
      dispatchAction({
        payload: {
          otherDetail: {
            ...otherDetail,
            validDateLongFlag: flag ? 1 : 0,
          },
        },
      })
    },
    otherOptionsSearch(value) {
      getOtherCust(value)
    },
  }
  // 企业证件详情
  const companyProps = {
    effects,
    dispatch,
    modalTitle,
    companyDetailVisible,
    companyDetail,
    companyLifeObj,
    handleCancel() {
      dispatchAction({
        payload: {
          companyDetailVisible: false,
        },
      })
    },
    radioChange(value) {
      dispatchAction({
        payload: {
          companyDetail: {
            ...companyDetail,
            certificateDetailType: value,
          },
        },
      })
    },
  }

  // 审核弹框
  const viewModalProps = {
    viewType: 'view',
    visible: detailModalVisible,
    certificateList: certificateDetail.certificates || [],
    refuseReason: certificateDetail.refuseReason,
    certificateNo: rowSelectData.certificateNo,
    productName: rowSelectData.productName,
    loading: getLoading('getCertificates'),
    onCancel() {
      dispatchAction({
        payload: {
          detailModalVisible: false,
          rowSelectData: {},
        },
      })
    },
  }


  return (
    <div className="aek-layout">
      <div className="bread">
        <div>
          <Breadcrumb routes={routes} />
        </div>
      </div>
      <div className="content">
        <div>
          <Tabs activeKey={tabIndex} onChange={tabsChange} animated={false}>
            <TabPane tab={getTabName('证件过期提醒', certificateNum.validDateCertificateNum)} key="1" value="1">
              <ExpiryRemind {...expiryRemindProps} />
            </TabPane>
            <TabPane tab={getTabName('注册证', certificateNum.registerCertificateNum)} key="2" value="2">
              <Regist {...registProps} />
            </TabPane>
            <TabPane tab={getTabName('生产厂家/总经销商', certificateNum.factoryAgentCertificateNum)} key="3" value="3">
              <ProdFactory {...prodFactory} />
            </TabPane>
            <TabPane tab={getTabName('授权书', certificateNum.authCertificateNum)} key="4" value="4">
              <Auth {...authProps} />
            </TabPane>
            <TabPane tab={getTabName('委托书', certificateNum.entrustCertificateNum)} key="5" value="5">
              <Power {...powerProps} />
            </TabPane>
            <TabPane tab={getTabName('其他档案', certificateNum.otherCertificateNum)} key="6" value="6">
              <Other {...otherProps} />
            </TabPane>
          </Tabs>
        </div>
      </div>
      {/* 授权书详情 */}
      <AuthDetailModal {...authDetailProps} />
      {/* 生产厂家/总经销商 */}
      <ProdFactoryModal {...ProdFactoryPorps} />
      {/* 注册证详情 */}
      <RegistDetail {...registDetailProps} />
      {/* 委托书详情 */}
      <PowerDetailModal {...powerDetailProps} />
      {/* 其他证件详情 */}
      <OtherDetailModal {...otherDetailProps} />
      {/* 企业证件详情 */}
      <CompanyDetailModal {...companyProps} />
      {/* 回溯 */}
      <ViewModal {...viewModalProps} />
    </div>
  )
}

CustomerCertificate.propTypes = {
  newCustomerCertificate: PropTypes.object.isRequired,
  effects: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  routes: PropTypes.array,
  registTypeList: PropTypes.array,
}

export default connect(
  ({
    newCustomerCertificate,
    loading: {
      effects,
    },

    app: {
      constants: {
        registTypeList,
      },
    },

  }) => ({ newCustomerCertificate, effects, registTypeList }))(CustomerCertificate)
