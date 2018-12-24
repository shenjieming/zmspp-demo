import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Button, Tabs, Modal } from 'antd'
import Breadcrumb from '../../../components/Breadcrumb'
import ExpiryRemind from './expiryRemind'
import Regist from './regist'
import ProdFactory from './prodFactory'
import Auth from './auth'
import Power from './power'
import Other from './other'
import { debounce, cloneDeep } from 'lodash'
import moment from 'moment'
import { getTabName } from '../../../utils'
import AuthDetailModal from '../authDetail' // 授权书详情
// 生产厂家、总经销商
import ProdFactoryModal from '../prodFactoryDetail'
// 注册证详情
import RegistDetailModal from '../registDetail'
// 注册证延期
import RegistDelayModal from './regist/delayModal'
// 委托书详情
import PowerDetailModal from '../powerDetail'
// 其他证件详情
import OtherDetailModal from '../otherDetail'
// 企业证件详情
import CompanyDetailModal from '../companyModal'


const confirm = Modal.confirm
const TabPane = Tabs.TabPane
function MyCertificate({
  myCertificate,
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
    selectedRowKeys,
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
    registDelaylVisible, // 注册证延期弹框
    powerDetail, // 委托书详情
    powerDetailVisible, // 委托书详情弹框
    powerDetailCustOptions, // 授权书详情客户名称
    powerDetailPersonOptions, // 授权书详情人员名称
    powerCustomerVisible, // 授权客户弹框
    powerCustomerTargetKeys, // 授权客户已选择列表
    otherDetail, // 其他证件详情
    otherDetailVisible, // 其他证件详情弹框
    otherCustOptions, // 其他证件详情客户名称
    allCustomerOptions, // 授权书授权客户授权列表
    certificateNum, // 证件数量
    authTypeInfoOptions,
    companyDetailVisible,
    companyDetail,
    companyLifeObj,
    refuseReasonList, // 拒绝原因
  } = myCertificate
  // 生产厂家下拉列表
  const handl = (value) => {
    dispatch({ type: 'myCertificate/getFactoryOptions', payload: { keywords: value } })
  }
  const handleFacroryChange = debounce(handl, 500, { trailing: true })
  // 上级机构就是 总代
  const handle = (value) => {
    dispatch({ type: 'myCertificate/getAgentOptions', payload: { keywords: value } })
  }
  const handleAgentChange = debounce(handle, 500, { trailing: true })
  // 上级授权单位
  const handleParent = (value) => {
    dispatch({ type: 'myCertificate/getAuthTypeInfo', payload: { keywords: value } })
  }
  const handleParentChange = debounce(handleParent, 500, { trailing: true })
  // 其他证件客户名称
  const ohherCus = (value) => {
    dispatch({
      type: 'myCertificate/getOtherCustomer',
      payload: {
        keywords: value,
      },
    })
  }
  const getOtherCust = debounce(ohherCus, 500, { trailing: true })
  // 停用启用confirm
  function showConfirm({ title = '', content = '', handleOk }) {
    confirm({
      title,
      content,
      onOk() {
        handleOk()
      },
    })
  }
  // 注册证证号在选择标准证件的时候setFieldsValue
  const setProps = (data) => {
    const props = {}
    if (data.productName) {
      props.productName = data.productName
    }
    if (data.produceFactoryName) {
      props.produceFactoryName = data.produceFactoryName
    }
    if (!(data.validDateLongFlag === null ||
      data.validDateLongFlag === undefined ||
      data.certificateType === undefined ||
      data.certificateType === null ||
      data.certificateType !== '1')) {
      props.validDateLongFlag = data.validDateLongFlag
    }
    if (data.validDateStart && data.validDateEnd) {
      props.validDateStart = [data.validDateStart, data.validDateEnd]
    } else {
      props.validDateEnd = data.validDateStart
    }
    if (data.certificateType === undefined || data.certificateType === 'undefined' || data.certificateType === '1') {
      props.importedFlag = data.importedFlag
    }
    if (!(data.importedFlag === null || data.importedFlag === undefined)) {
      props.agentSupplierName = data.agentSupplierName
    }
    return props
  }
  let rightButton = ''
  /*   const handleMenuClick = (value) => {
    console.log(value)
  }
  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="0" value="0">停用</Menu.Item>
      <Menu.Item key="1" value="1">启用</Menu.Item>
    </Menu>
  ) */
  switch (tabIndex) {
    case '2':
      rightButton = (<div style={{ float: 'right' }}>
        <Button
          type="primary"
          style={{ marginLeft: '20px' }}
          icon="plus"
          key="addRegist"
          onClick={() => {
            dispatch({
              type: 'myCertificate/updateState',
              payload: {
                modalTitle: '添加注册证',
                registDetailVisible: true,
              },
            })
          }}
        >添加注册证</Button>
      </div>)
      break
    case '4':
      rightButton = (<div style={{ float: 'right' }}>
        <Button
          type="primary"
          style={{ marginLeft: '20px' }}
          icon="plus"
          key="addAuth"
          onClick={() => {
            dispatch({
              type: 'myCertificate/updateState',
              payload: {
                authDetailVisible: true,
                modalTitle: '添加授权书',
              },
            })
            dispatch({
              type: 'myCertificate/getAuthTypeInfo',
              payload: {
                keywords: '',
              },
            })
            dispatch({
              type: 'myCertificate/getFactoryOptions',
              payload: {
                keywords: '',
              },
            })
          }}
        >添加授权书</Button>
      </div>)
      break
    case '5':
      rightButton = (<div style={{ float: 'right' }}>
        <Button
          type="primary"
          style={{ marginLeft: '20px' }}
          icon="plus"
          key="addPower"
          onClick={() => {
            dispatch({
              type: 'myCertificate/updateState',
              payload: {
                powerDetailVisible: true,
                modalTitle: '添加委托书',
              },
            })
            dispatch({
              type: 'myCertificate/getPowerDetailCust',
              payload: {
                keywords: '',
              },
            })
            dispatch({
              type: 'myCertificate/getPowerDetailPerson',
              payload: {
                keywords: '',
              },
            })
          }}
        >添加委托书</Button>
      </div>)
      break
    case '6':
      rightButton = (<div style={{ float: 'right' }}>
        <Button
          type="primary"
          style={{ marginLeft: '20px' }}
          icon="plus"
          key="addCertificate"
          onClick={() => {
            dispatch({
              type: 'myCertificate/updateState',
              payload: {
                otherDetailVisible: true,
                modalTitle: '添加证件',
              },
            })
            dispatch({
              type: 'myCertificate/getOtherCustomer',
              payload: {
                keywords: '',
              },
            })
          }}
        >添加证件</Button>
      </div>)
      break
    default:
      break
  }
  // 封装派遣函数
  const disFunc = (url, reqData) => {
    dispatch({
      type: url,
      payload: {
        current: 1,
        pageSize: 10,
        ...reqData,
      },
    })
  }
  // tabs页切换
  const tabsChange = (e) => {
    dispatch({
      type: 'myCertificate/updateState',
      payload: {
        tabIndex: e,
        pagination: {},
        rowSelectData: {},
        searchData: {},
      },
    })
    let url = ''
    const reqData = {}
    if (e === '1') {
      url = 'myCertificate/getCertificateList'
      reqData.certificateExpiredStatus = '5'
      disFunc(url, reqData)
    } else if (e === '2') {
      url = 'myCertificate/getRegistList'
      disFunc(url, reqData)
    } else if (e === '3') {
      url = 'myCertificate/prodFactoryList'
      disFunc(url, reqData)
    } else if (e === '4') {
      url = 'myCertificate/authList'
      disFunc(url, reqData)
    } else if (e === '5') {
      url = 'myCertificate/powerList'
      disFunc(url, reqData)
    } else {
      url = 'myCertificate/otherList'
      disFunc(url, reqData)
    }
    dispatch({ type: 'getCertificateNum' })
  }
  // 效期提醒参数
  const expiryRemindProps = {
    effects,
    dispatch,
    dataSource,
    pagination,
    searchData,
    tabIndex,
  }
  // 注册证
  const registProps = {
    effects,
    dispatch,
    registDataSource,
    pagination,
    searchData,
    tabIndex,
    showConfirm,
  }
  // 注册证号模糊匹配
  const codehandl = (value, certificateType) => {
    dispatch({ type: 'myCertificate/getregistDetailOptions', payload: { keywords: value, certificateType } })
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
    agentOptions, // 总代
    effects,
    modalTitle,
    registRadioChange(e) {
      const flag = e.target.value
      dispatch({
        type: 'myCertificate/updateState',
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
        type: 'myCertificate/updateState',
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
      const reqData = cloneDeep(data)
      let str = ''
      if (data.certificateImageUrls) {
        for (const obj of data.certificateImageUrls) {
          str += `${obj.value},`
        }
        str = str.substring(0, str.length - 1)
      }
      if (data.validDateLongFlag) {
        reqData.validDateStart = data.validDateEnd
      } else {
        reqData.validDateStart = data.validDateStart[0]
        reqData.validDateEnd = data.validDateStart[1]
      }
      if (modalTitle === '换证') {
        dispatch({
          type: 'myCertificate/setRegistReplace',
          payload: {
            ...registDetail,
            ...data,
            ...reqData,
            fromStandardFlag: registCodeSelected,
            certificateImageUrls: str,
          },
        })
      } else {
        dispatch({
          type: 'myCertificate/setRegistSubmit',
          payload: {
            ...registDetail,
            ...data,
            ...reqData,
            fromStandardFlag: registCodeSelected,
            certificateImageUrls: str,
          },
        })
      }
    },
    checkedLongchange(e) {
      const flag = e.target.checked
      dispatch({
        type: 'myCertificate/updateState',
        payload: {
          registDetail: {
            ...registDetail,
            validDateLongFlag: flag,
          },
        },
      })
    },
    agentOptionsSearch(value, certificateType) {
      handleRegistChange(value, certificateType)
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
          type: 'myCertificate/updateState',
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
        type: 'myCertificate/updateState',
        payload: {
          registDetail: {
            ...registDetail,
            certificateType: value,
          },
        },
      })
    },
    registCodeSelect(value, callback) {
      let optionObj = {}
      for (const obj of registCodeOptions) {
        if (obj.certificateNo === value) {
          optionObj = obj
          if (modalTitle === '换证') {
            delete optionObj.produceFactoryId
            delete optionObj.produceFactoryName
          }
        }
      }
      dispatch({
        type: 'myCertificate/updateState',
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
      const props = setProps({ ...registDetail, ...optionObj })
      callback(props)
    },
    regitstCodeBlur(data, callback, certificateType) {
      if (registCodeSelected) {
        return
      }
      if (data && data.length) {
        dispatch({
          type: 'myCertificate/getregistDetailOptions',
          payload: {
            keywords: data,
            certificateType,
          },
        }).then(() => {
          let flag = false
          if (registCodeOptions.length === 1 && data === registCodeOptions[0].certificateNo) {
            flag = true
            if (modalTitle === '换证') {
              delete registCodeOptions[0].produceFactoryId
              delete registCodeOptions[0].produceFactoryName
            }
            dispatch({
              type: 'myCertificate/updateState',
              payload: {
                registCodeSelected: flag,
                registDetail: {
                  ...registDetail,
                  ...registCodeOptions[0],
                  standardCertificateId: registCodeOptions[0].certificateId,
                  certificateId: registDetail.certificateId,
                },
              },
            })
            const props = setProps()
            callback(props)
          } else {
            // 新增失焦时判断输入文本是否包含进字 从而判断是否进口
            const importedFlag = data.includes('进')
            if (registDetail.certificateType === undefined || registDetail.certificateType === '1') {
              const props = {
                importedFlag,
              }
              callback(props)
              dispatch({
                type: 'myCertificate/updateState',
                payload: {
                  registDetail: {
                    ...registDetail,
                    importedFlag,
                  },
                },
              })
            }
          }
        })
        /*           else {
            const reqData = {
              ...registDetail,
              productName: undefined,
              validDateEnd: undefined,
              validDateStart: undefined,
              agentSupplierId: undefined,
              agentSupplierName: undefined,
              standardCertificateId: undefined,
            }
            if (modalTitle !== '换证') {
              reqData.produceFactoryId = undefined
              reqData.produceFactoryName = undefined
            }
            dispatch({
              type: 'myCertificate/updateState',
              payload: {
                registCodeSelected: flag,
                registDetail: reqData,
              },
            })
          } */
        /* }) */
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
        type: 'myCertificate/updateState',
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
        type: 'myCertificate/updateState',
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
    handleReplaced(value) {
      dispatch({
        type: 'myCertificate/getRegistDetaiList',
        payload: {
          certificateId: value,
        },
      })
    },
  }
  // 注册证延期
  const registDelayProps = {
    rowSelectData,
    registDelaylVisible, // 注册证弹框
    effects,
    modalTitle,
    registCodeOptions,
    agentOptionsSearch(value) {
      handleFacroryChange(value)
    },
    handleCancel() {
      dispatch({
        type: 'myCertificate/updateState',
        payload: {
          registDelaylVisible: false,
          registCodeOptions: [],
          rowSelectData: {},
        },
      })
    },
    handleOk(data) {
      let str = ''
      if (data.delayedCertificateImageUrls) {
        for (const obj of data.delayedCertificateImageUrls) {
          str += `${obj.value},`
        }
        str = str.substring(0, str.length - 1)
      }
      dispatch({
        type: 'myCertificate/setRegistDelay',
        payload: {
          ...data,
          delayedCertificateImageUrls: str,
          certificateId: rowSelectData.certificateId,
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
    showConfirm,
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
        type: 'myCertificate/updateState',
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
        type: 'myCertificate/updateState',
        payload: {
          prodFactoryVisible: false,
          prodFactoryDetail: {},
          eternalLifeObj: {},
        },
      })
    },
    handleOk(reqData) {
      // 需要判断是换证 还是 编辑证件
      let url = 'myCertificate/setProdFactorySubmit'
      if (modalTitle === '换证') {
        url = 'myCertificate/setProdFactoryReplace'
      }
      dispatch({
        type: url,
        payload: {
          factoryAgentCertificateId: rowSelectData.factoryAgentCertificateId || prodFactoryDetail.factoryAgentCertificateId,
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
    showConfirm,
    powerCustomerVisible,
    allCustomerOptions,
    powerCustomerTargetKeys,
    rowSelectData,
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
    authTypeInfoOptions,
    agentOptionsSearch(value) {
      handleFacroryChange(value)
    },
    produceOptionsSearch(value) {
      handleParentChange(value)
    },
    checkedFacAuthchange(e) {
      const flag = e.target.checked
      dispatch({
        type: 'myCertificate/updateState',
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
        type: 'myCertificate/updateState',
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
        type: 'myCertificate/updateState',
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
        reqData.validDateStart = data.validDateEnd[0].format('YYYY-MM-DD')
        reqData.validDateEnd = data.validDateEnd[1].format('YYYY-MM-DD')
      } else {
        reqData.validDateStart = data.validDateStart.format('YYYY-MM-DD')
      }
      let url = 'myCertificate/setAuthSubmit'
      if (modalTitle === '换证') {
        url = 'myCertificate/setAuthReplace'
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
    showConfirm,
  }
  // 委托书客户名称搜索
  const handleCust = (value) => {
    dispatch({
      type: 'myCertificate/getPowerDetailCust',
      payload: {
        keywords: value,
      },
    })
  }
  const getPowerCust = debounce(handleCust, 500, { trailing: true })
  // 委托书员工真实姓名
  const handlePerson = (value) => {
    dispatch({
      type: 'myCertificate/getPowerDetailPerson',
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
        type: 'myCertificate/updateState',
        payload: {
          powerDetailVisible: false,
          powerDetail: {},
        },
      })
    },
    handleOk(data) {
      const reqData = cloneDeep(data)
      let url = 'myCertificate/setPowerSubmit'
      if (modalTitle === '换证') {
        url = 'myCertificate/setPowerReplace'
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
        reqData.validDateStart = data.validDateEnd[0].format('YYYY-MM-DD')
        reqData.validDateEnd = data.validDateEnd[1].format('YYYY-MM-DD')
      } else {
        reqData.validDateStart = data.validDateStart.format('YYYY-MM-DD')
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
        type: 'myCertificate/updateState',
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
    powerPersonSetPhone(value, setFieldsValue) {
      setFieldsValue({
        customerContactPhone: value,
      })
      dispatch({
        type: 'myCertificate/updateState',
        payload: {
          powerDetail: {
            ...powerDetail,
            customerContactPhone: value,
          },
        },
      })
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
    showConfirm,
    otherCustOptions,
    otherOptionsSearch(value) {
      getOtherCust(value)
    },
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
        type: 'myCertificate/updateState',
        payload: {
          otherDetailVisible: false,
          otherDetail: {},
        },
      })
    },
    handleOk(data) {
      const reqData = cloneDeep(data)
      let url = 'myCertificate/setOtherSubmit'
      if (modalTitle === '换证') {
        url = 'myCertificate/setOtherReplace'
      }
      let bStr = ''
      if (data.certificateImageUrls) {
        for (const obj of data.certificateImageUrls) {
          bStr += `${obj.value},`
        }
        bStr = bStr.substring(0, bStr.length - 1)
      }
      if (!data.validDateLongFlag) {
        reqData.validDateStart = data.validDateEnd[0].format('YYYY-MM-DD')
        reqData.validDateEnd = data.validDateEnd[1].format('YYYY-MM-DD')
      } else {
        reqData.validDateStart = data.validDateStart.format('YYYY-MM-DD')
      }
      if (data.customerOrgName) {
        reqData.customerOrgId = data.customerOrgName.key
        reqData.customerOrgName = data.customerOrgName.label
      }
      dispatch({
        type: url,
        payload: {
          certificateId: otherDetail.certificateId,
          ...data,
          ...reqData,
          certificateImageUrls: bStr,
        },
      })
    },
    checkedLongchange(e) {
      const flag = e.target.checked
      dispatch({
        type: 'myCertificate/updateState',
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
        type: 'myCertificate/updateState',
        payload: {
          companyDetailVisible: false,
          companyLifeObj: {},
        },
      })
    },
    radioChange(value) {
      dispatch({
        type: 'myCertificate/updateState',
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
        <div style={{ float: 'left' }}>
          <Breadcrumb routes={routes} />
        </div>
        {rightButton}
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
      {/* 注册证延期 */}
      <RegistDelayModal {...registDelayProps} />
      {/* 委托书详情 */}
      <PowerDetailModal {...powerDetailProps} />
      {/* 其他证件详情 */}
      <OtherDetailModal {...otherDetailProps} />
      {/* 企业证件详情 */}
      <CompanyDetailModal {...companyProps} />
    </div>
  )
}

MyCertificate.propTypes = {
  myCertificate: PropTypes.object.isRequired,
  effects: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  routes: PropTypes.array,
}

export default connect(
  ({
    myCertificate,
    loading: {
      effects,
    },
  }) => ({ myCertificate, effects }))(MyCertificate)
