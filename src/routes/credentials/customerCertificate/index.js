import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Tabs } from 'antd'
import { debounce, cloneDeep } from 'lodash'
import moment from 'moment'
import Breadcrumb from '../../../components/Breadcrumb'
import ExpiryRemind from './expiryRemind'
import Regist from './regist'
import ProdFactory from './prodFactory'
import Auth from './auth'
import Power from './power'
import Other from './other'
import { getTabName } from '../../../utils'
import AuthDetailModal from '../authDetail' // 授权书详情
// 生产厂家、总经销商
import ProdFactoryModal from '../prodFactoryDetail'
// 注册证详情
import RegistDetailModal from '../registDetail'
// 委托书详情
import PowerDetailModal from '../powerDetail'
// 其他证件详情
import OtherDetailModal from '../otherDetail'
// 企业证件详情
import CompanyDetailModal from '../companyModal'

const TabPane = Tabs.TabPane
function CustomerCertificate({
  customerCertificate,
  effects,
  dispatch,
  routes,
}) {
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
  } = customerCertificate
  const handleCustomer = (value) => {
    dispatch({
      type: 'customerCertificate/getCustomerOptions',
      payload: {
        keywords: value,
      },
    })
  }
  const debounceCusotmer = debounce(handleCustomer, 500, { trailing: true })
  // 生产厂家下拉列表
  const handl = (value) => {
    dispatch({ type: 'customerCertificate/getFactoryOptions', payload: { keywords: value } })
  }
  const handleFacroryChange = debounce(handl, 500, { trailing: true })
  // 上级机构就是 总代
  const handle = (value) => {
    dispatch({ type: 'customerCertificate/getAgentOptions', payload: { keywords: value } })
  }
  const handleAgentChange = debounce(handle, 500, { trailing: true })
  // 其他证件客户名称
  const ohherCus = (value) => {
    dispatch({
      type: 'customerCertificate/getOtherCustomer',
      payload: {
        keywords: value,
      },
    })
  }
  const getOtherCust = debounce(ohherCus, 500, { trailing: true })
  // tabs页切换
  const tabsChange = (value) => {
    dispatch({
      type: 'customerCertificate/updateState',
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
      url = 'customerCertificate/getCertificateList'
      numUrl = 'customerCertificate/getValidStatistics'
      reqObj.certificateType = '1'
    } else if (value === '2') {
      url = 'customerCertificate/getRegistList'
      numUrl = 'customerCertificate/getRegistStatistics'
    } else if (value === '3') {
      url = 'customerCertificate/prodFactoryList'
      numUrl = 'customerCertificate/getFactoryAgent'
    } else if (value === '4') {
      url = 'customerCertificate/authList'
      numUrl = 'customerCertificate/getAuthStatistics'
    } else if (value === '5') {
      url = 'customerCertificate/powerList'
      numUrl = 'customerCertificate/getPowerStatistics'
    } else {
      url = 'customerCertificate/otherList'
      numUrl = 'customerCertificate/getOtherStatistics'
    }
    /**
     * @desc 临时注释 不查询tab数量统计 2017-05-05
     * @author wangyang
     */
    // dispatch({
    //   type: numUrl,
    // })
    dispatch({
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
  }
  // 注册证号模糊匹配
  const codehandl = (value) => {
    dispatch({ type: 'customerCertificate/getregistDetailOptions', payload: { keywords: value } })
  }
  const handleRegistChange = debounce(codehandl, 500, { trailing: true })
  // 注册证详情
  const registDetailProps = {
    refuseReasonList,
    registCodeSelected,
    registDetail, // 注册证详情
    registDetailVisible, // 注册证弹框
    registCodeOptions, // 证号模糊匹配
    factoryOptions, // 生产厂家
    effects,
    modalTitle,
    registRadioChange(e) {
      const flag = e.target.value
      dispatch({
        type: 'customerCertificate/updateState',
        payload: {
          registDetail: {
            ...registDetail,
            importedFlag: flag,
          },
        },
      })
    },
    handleCancel() {
      dispatch({
        type: 'customerCertificate/updateState',
        payload: {
          registDetailVisible: false,
          modalTitle: '',
          registDetail: {},
          registCodeOptions: [],
          registCodeSelected: false,
        },
      })
    },
    handleOk(data) {
      let str = ''
      if (data.certificateImageUrls) {
        for (const obj of data.certificateImageUrls) {
          str += `${obj.value},`
        }
        str = str.substring(0, str.length - 1)
      }
      if (modalTitle === '换证') {
        dispatch({
          type: 'customerCertificate/setRegistReplace',
          payload: {
            ...registDetail,
            ...data,
            fromStandardFlag: registCodeSelected,
            certificateImageUrls: str,
          },
        })
      } else {
        dispatch({
          type: 'customerCertificate/setRegistSubmit',
          payload: {
            ...registDetail,
            ...data,
            fromStandardFlag: registCodeSelected,
            certificateImageUrls: str,
          },
        })
      }
    },
    checkedLongchange(e) {
      const flag = e.target.checked
      dispatch({
        type: 'customerCertificate/updateState',
        payload: {
          registDetail: {
            ...registDetail,
            validDateLongFlag: flag,
          },
        },
      })
    },
    agentOptionsSearch(value) {
      handleRegistChange(value)
    },
    checkedFactorychange(value) {
      handleFacroryChange(value)
    },
    produceOptionsSearch(value) {
      handleAgentChange(value)
    },
    onStartTimeChange(filed) {
      if (filed) {
        dispatch({
          type: 'customerCertificate/updateState',
          payload: {
            registDetail: {
              ...registDetail,
              validDateEnd: moment(moment(filed).add(4, 'year')).add(-1, 'days').format('YYYY-MM-DD'),
            },
          },
        })
      }
    },
    typeSelectChange(value) {
      dispatch({
        type: 'customerCertificate/updateState',
        payload: {
          registDetail: {
            ...registDetail,
            certificateType: value,
          },
        },
      })
    },
    registCodeSelect(value) {
      let optionObj = {}
      for (const obj of registCodeOptions) {
        if (obj.certificateNo === value) {
          optionObj = obj
        }
      }
      dispatch({
        type: 'customerCertificate/updateState',
        payload: {
          registCodeSelected: true,
          registDetail: {
            ...registDetail,
            ...optionObj,
            standardCertificateId: optionObj.certificateId,
            certificateId: registDetail.certificateId,
          },
        },
      })
    },
    regitstCodeBlur(data) {
      if (registCodeSelected) {
        return
      }
      if (data) {
        dispatch({
          type: 'customerCertificate/getregistDetailOptions',
          payload: {
            keywords: data.label,
          },
        }).then(() => {
          let flag = false
          if (registCodeOptions.length === 1 && data.label === registCodeOptions[0].certificateNo) {
            flag = true
            dispatch({
              type: 'customerCertificate/updateState',
              payload: {
                registDetail: {
                  ...registDetail,
                  ...registCodeOptions[0],
                  standardCertificateId: registCodeOptions[0].certificateId,
                  certificateId: registDetail.certificateId,
                },
              },
            })
          }
          dispatch({
            type: 'customerCertificate/updateState',
            payload: {
              registCodeSelected: flag,
              registDetail: {
                ...registDetail,
                ...registCodeOptions[0],
              },
            },
          })
        })
      }
    },
    checkedFactorySelect(value) {
      let optionObj = {}
      for (const obj of factoryOptions) {
        if (obj.produceFactoryName === value) {
          optionObj = obj
        }
      }
      dispatch({
        type: 'customerCertificate/updateState',
        payload: {
          registDetail: {
            ...registDetail,
            ...optionObj,
            produceFactoryId: optionObj.produceFactoryId,
            certificateId: registDetail.certificateId,
          },
        },
      })
    },
    produceOptionsSelect(value) {
      let optionObj = {}
      for (const obj of factoryOptions) {
        if (obj.agentSupplierName === value) {
          optionObj = obj
        }
      }
      dispatch({
        type: 'customerCertificate/updateState',
        payload: {
          registDetail: {
            ...registDetail,
            ...optionObj,
            agentSupplierName: optionObj.agentSupplierId,
            certificateId: registDetail.certificateId,
          },
        },
      })
    },
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
      dispatch({
        type: 'customerCertificate/updateState',
        payload: {
          prodFactoryDetail: {
            ...prodFactoryDetail,
            certificateDetailType: value,
          },
        },
      })
    },
    handleCancel() {
      dispatch({
        type: 'customerCertificate/updateState',
        payload: {
          prodFactoryVisible: false,
          prodFactoryDetail: {},
        },
      })
    },
    handleOk(reqData) {
      // 需要判断是换证 还是 编辑证件
      let url = 'customerCertificate/setProdFactorySubmit'
      if (modalTitle === '换证') {
        url = 'customerCertificate/setProdFactoryReplace'
      }
      dispatch({
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
      dispatch({
        type: 'customerCertificate/updateState',
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
      dispatch({
        type: 'customerCertificate/updateState',
        payload: {
          authDetail: {
            ...authDetail,
            validDateLongFlag: flag,
          },
        },
      })
    },
    handleCancel() {
      dispatch({
        type: 'customerCertificate/updateState',
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
      let url = 'customerCertificate/setAuthSubmit'
      if (modalTitle === '换证') {
        url = 'customerCertificate/setAuthReplace'
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
      dispatch({
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
    dispatch({
      type: 'customerCertificate/getPowerDetailCust',
      payload: {
        keywords: value,
      },
    })
  }
  const getPowerCust = debounce(handleCust, 500, { trailing: true })
  // 委托书员工真实姓名
  const handlePerson = (value) => {
    dispatch({
      type: 'customerCertificate/getPowerDetailPerson',
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
      dispatch({
        type: 'customerCertificate/updateState',
        payload: {
          powerDetailVisible: false,
          powerDetail: {},
        },
      })
    },
    handleOk(data) {
      const reqData = cloneDeep(data)
      let url = 'customerCertificate/setPowerSubmit'
      if (modalTitle === '换证') {
        url = 'customerCertificate/setPowerReplace'
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
      dispatch({
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
      dispatch({
        type: 'customerCertificate/updateState',
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
    handleCancel() {
      dispatch({
        type: 'customerCertificate/updateState',
        payload: {
          otherDetailVisible: false,
          otherDetai: {},
        },
      })
    },
    handleOk(data) {
      const reqData = cloneDeep(data)
      let url = 'customerCertificate/setOtherSubmit'
      if (modalTitle === '换证') {
        url = 'customerCertificate/setOtherReplace'
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
      dispatch({
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
      dispatch({
        type: 'customerCertificate/updateState',
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
      dispatch({
        type: 'customerCertificate/updateState',
        payload: {
          companyDetailVisible: false,
        },
      })
    },
    radioChange(value) {
      dispatch({
        type: 'customerCertificate/updateState',
        payload: {
          companyDetail: {
            ...companyDetail,
            certificateDetailType: value,
          },
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
      <RegistDetailModal {...registDetailProps} />
      {/* 委托书详情 */}
      <PowerDetailModal {...powerDetailProps} />
      {/* 其他证件详情 */}
      <OtherDetailModal {...otherDetailProps} />
      {/* 企业证件详情 */}
      <CompanyDetailModal {...companyProps} />
    </div>
  )
}

CustomerCertificate.propTypes = {
  customerCertificate: PropTypes.object.isRequired,
  effects: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  routes: PropTypes.array,
}

export default connect(
  ({
    customerCertificate,
    loading: {
      effects,
    },
  }) => ({ customerCertificate, effects }))(CustomerCertificate)
