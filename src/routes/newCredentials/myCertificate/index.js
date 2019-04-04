  import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Button, Tabs, Modal, Alert, message } from 'antd'
import { debounce, cloneDeep } from 'lodash'
import moment from 'moment'
import Breadcrumb from '../../../components/Breadcrumb'
import ExpiryRemind from './expiryRemind'
import Regist from './regist'
import ProdFactory from './prodFactory'
import Auth from './auth'
import Power from './power'
import Other from './other'
import { getTabName, getBasicFn } from '../../../utils'
import { EXCEL_DOWNLOAD } from '../../../utils/config'
import AuthDetailModal from '../share/authDetail' // 授权书详情
// 生产厂家、总经销商
import ProdFactoryModal from '../share/prodFactoryDetail'
// 注册证详情
// import RegistDetailModal from '../share/registDetail'
import RegistDetail from '../share/registDetail/registModal'

// 注册证标准同步对照
import RegistCompaerModal from '../../../components/RowTable/ModalCompare'

// 注册证延期
import RegistDelayModal from './regist/delayModal'
// 委托书详情
import PowerDetailModal from '../share/powerDetail'
// 其他证件详情
import OtherDetailModal from '../share/otherDetail'
// 企业证件详情
import CompanyDetailModal from '../share/companyModal'

const confirm = Modal.confirm
const TabPane = Tabs.TabPane
const namespace = 'newMyCertificate'
function MyCertificate({
  newMyCertificate,
  effects,
  dispatch,
  routes,
  orgName,
  registTypeList,
}) {
  const { dispatchAction, getLoading } = getBasicFn({ namespace, loading: effects })
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
    firstFormData, // 注册证弹框 下拉选中的数据
    registDelaylVisible, // 注册证延期弹框
    powerDetail, // 委托书详情
    powerDetailVisible, // 委托书详情弹框
    powerDetailCustOptions, // 授权书详情客户名称
    powerDetailPersonOptions, // 授权书详情人员名称
    powerCustomerVisible, // 授权客户弹框
    authProductVisible, // 授权产品弹框
    authProductOption, // 授权产品列表
    authProductTargetKeys, // 授权产品已选择列表
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
    otherTypeOptions, // 其他证件 证件类型下拉选项

    step,
    status, // 注册证弹框状态  1 新增 2 编辑 3 换证
    compareModalVisible, // 标准信息对照弹框
    compareModalList, // 标准注册证信息对照

    viewRegistModalVisible, // 查看态注册证
    viewStep, // 查看态弹框
    viewStatus, //
    viewRegistDetail, // 查看态详情信息
    editFlag,
  } = newMyCertificate
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
  // 上级授权单位
  const handleParent = (value) => {
    dispatchAction({ type: 'getAuthTypeInfo', payload: { keywords: value } })
  }
  const handleParentChange = debounce(handleParent, 500, { trailing: true })
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
  // 停用启用confirm
  function showConfirm({ title = '', content = '', handleOk, zIndex = 1000 }) {
    confirm({
      title,
      content,
      onOk() {
        handleOk()
      },
      zIndex,
    })
  }

  let rightButton = ''

  switch (tabIndex) {
    case '2':
      rightButton = (<div style={{ float: 'right' }}>
        <Button
          type="primary"
          style={{ marginLeft: '20px' }}
          icon="plus"
          key="addRegist"
          onClick={() => {
            dispatchAction({
              payload: {
                modalTitle: '添加注册证',
                registDetailVisible: true,
                step: 1,
                status: 1,
                firstFormData: {},
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
            dispatchAction({
              payload: {
                authDetailVisible: true,
                modalTitle: '添加授权书',
              },
            })
            dispatchAction({
              type: 'getAuthTypeInfo',
              payload: {
                keywords: '',
              },
            })
            dispatchAction({
              type: 'getFactoryOptions',
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
            dispatchAction({
              payload: {
                powerDetailVisible: true,
                modalTitle: '添加委托书',
              },
            })
            dispatchAction({
              type: 'getPowerDetailCust',
              payload: {
                keywords: '',
              },
            })
            dispatchAction({
              type: 'getPowerDetailPerson',
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
        <a
          onClick={() => {
            window.open(`${EXCEL_DOWNLOAD}/word/template/承诺书模板.doc`)
          }}
        >下载承诺书模板</a>
        <Button
          type="primary"
          style={{ marginLeft: '20px' }}
          icon="plus"
          key="addCertificate"
          onClick={() => {
            dispatchAction({
              payload: {
                otherDetailVisible: true,
                modalTitle: '添加证件',
              },
            })
            dispatchAction({
              type: 'getOtherCustomer',
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
    dispatchAction({
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
    dispatchAction({
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
      url = 'getCertificateList'
      reqData.certificateExpiredStatus = '5'
      disFunc(url, reqData)
    } else if (e === '2') {
      url = 'getRegistList'
      disFunc(url, reqData)
    } else if (e === '3') {
      url = 'prodFactoryList'
      disFunc(url, reqData)
    } else if (e === '4') {
      url = 'authList'
      disFunc(url, reqData)
    } else if (e === '5') {
      url = 'powerList'
      disFunc(url, reqData)
    } else {
      url = 'otherList'
      disFunc(url, reqData)
      // 其他证件 证件类型下拉选项
      dispatchAction({
        type: 'getOtherTypeOptions',
        payload: {
          dicKey: 'OTHER_CERTIFICATE_TYPE',
        },
      })
    }
    dispatchAction({ type: 'getCertificateNum' })
  }
  // 效期提醒参数
  const expiryRemindProps = {
    editFlag,
    effects,
    dispatch,
    dataSource,
    pagination,
    searchData,
    tabIndex,
    registTypeList,
  }
  // 注册证
  const registProps = {
    editFlag,
    effects,
    dispatch,
    registDataSource,
    pagination,
    searchData,
    tabIndex,
    showConfirm,
    registTypeList,
  }

  // 注册证号模糊匹配
  const codehandl = (value, certificateType, excludeCertificateId) => {
    dispatchAction({
      type: 'getregistDetailOptions',
      payload: {
        keywords: value,
        certificateType,
        excludeCertificateId,
      },
    })
  }
  const handleRegistChange = debounce(codehandl, 500, { trailing: true })

  // 新增 编辑注册证弹框
  const registDetailProps = {
    modalVisible: registDetailVisible,
    loading: !!effects[`${namespace}/getRegistDetaiList`] ||
    !!effects[`${namespace}/getRegistDetail`] ||
    !!effects[`${namespace}/setRegistReplace`] ||
    !!effects[`${namespace}/setRegistSubmit`],
    status,
    step,
    handleCancel() {
      dispatchAction({
        payload: {
          registDetailVisible: false,
          rowSelectData: {}, // 选择的行数据清空
          registDetail: {}, // 注册证详情清空
          firstFormData: {}, // 第一步清空数据
          registCodeOptions: [], // 注册证号异步搜索清空
          factoryOptions: [], // 生产企业关闭弹框清空
        },
      })
    },

    handleOk(data) { // 提交
      const reqData = cloneDeep(data)
      let str = ''
      if (data.certificateImageUrls) {
        for (const obj of data.certificateImageUrls) {
          str += `${obj.value},`
        }
        str = str.substring(0, str.length - 1)
      }


      const { standardCertificateId, platformAuthStatus, certificateType } = registDetail

      const getView = () => {
        console.log(status)
        if (status === 1) {
          if (standardCertificateId) {
            return true
          }
          return false
        } else if (status === 2) {
          if (Number(certificateType) < 0) {
            return false
          }
          // 2019/4/3 修改
        // || platformAuthStatus === 2/
          if (standardCertificateId) {
            return true
          }
          return false
        } else if (status === 3) {
        // || platformAuthStatus === 2
          if (standardCertificateId ) {
            return true
          }
          return false
        }
        return true
      }

      const flag = getView()
      console.log(flag, data)
      if (!flag) {
        if (data.validDateLongFlag) {
          reqData.validDateStart = data.validDateEnd
        } else {
          reqData.validDateStart = data.validDateStart[0]
          reqData.validDateEnd = data.validDateStart[1]
        }
      }

      let url = ''
      let payload = {}
      if (status === 3) {
        url = 'setRegistReplace'
        payload = {
          ...registDetail,
          ...reqData,
          certificateType: firstFormData.certificateType.key,
          certificateId: firstFormData.oldCertificateId,
          certificateImageUrls: str,
        }
      } else if (status === 2) {
        url = 'setRegistSubmit'
        payload = {
          ...registDetail,
          ...reqData,
          certificateImageUrls: str,
        }
      } else if (status === 1) {
        url = 'setRegistSubmit'
        payload = {
          ...registDetail,
          ...reqData,
          certificateType: firstFormData.certificateType.key,
          certificateImageUrls: str,
        }
      }
      dispatchAction({
        type: url,
        payload,
      })
    },
    firstFormData, // 下拉框选中的数据
    nextHandleClick(values) { // 下一步点击事件
      const data = cloneDeep(values)


      let flag = false
      for (const obj of registCodeOptions) {
        if (obj.certificateNo === data.certificateNo) {
          flag = true
        }
      }

      const obj = {
        ...firstFormData,
        ...data,
      }
      // 清空上次标准的certificateId
      if (!flag && firstFormData.certificateId) {
        obj.certificateId = undefined
      }

      dispatchAction({
        payload: {
          firstFormData: obj,
        },
      })


      if (data.certificateType) {
        data.certificateType = data.certificateType.key
      }

      let submitFlag = false

      for (const o of registCodeOptions) {
        if (o.certificateNo === data.certificateNo) {
          submitFlag = true
        }
      }

      const reqObj = {
        ...firstFormData,
        ...data,
      }

      // 清空上次标准的certificateId
      if (!submitFlag && firstFormData.certificateId) {
        reqObj.certificateId = undefined
      }


      const type = () => {
        let reqData = {}
        if (status === 1) {
          reqData = {
            certificateReviewType: 1,
          }
        } else if (status === 3) {
          reqData = {
            certificateReviewType: 2,
            originalCertificateId: firstFormData.oldCertificateId,
          }
        }
        return reqData
      }
      return dispatchAction({
        type: 'getRegistDetail',
        payload: {
          ...reqObj,
          ...type(),
        },
      })
    },
    getRegistList() {
      dispatchAction({
        payload: {
          registDetailVisible: false,
        },
      })

      let url = 'getRegistList'
      if (tabIndex === '1') {
        url = 'getCertificateList'
      }

      dispatchAction({
        type: url,
        payload: searchData,
      })
    },
    detail: registDetail,
    checkedLongchange(e) { // 长期有效事件
      const flag = e.target.checked
      dispatchAction({
        payload: {
          registDetail: {
            ...registDetail,
            validDateLongFlag: flag,
          },
        },
      })
    },
    agentOptionsSearch(value, certificateType, excludeCertificateId) { // 注册证号异步搜索
      handleRegistChange(value, certificateType, excludeCertificateId)
    },

    registCodeSelect(value) {
      let optionObj = {}
      for (const obj of registCodeOptions) {
        if (obj.certificateNo === value) {
          optionObj = obj
        }
      }
      dispatchAction({
        payload: {
          firstFormData: {
            ...firstFormData,
            certificateNo: optionObj.certificateNo,
            certificateId: optionObj.certificateId,
          },
        },
      })
    },
    registCodeOptions, // 注册证号
    handleChangeStep(val) {
      const req = {
        step: val,
      }
      dispatchAction({
        payload: req,
      })
    },
    agentOptions, // 总代下拉框数据
    registRadioChange(e) { // 是否进口事件
      const flag = e.target.value
      dispatchAction({
        payload: {
          registDetail: {
            ...registDetail,
            importedFlag: flag,
          },
        },
      })
    },
    produceOptionsSearch(value) {
      handleAgentChange(value)
    }, // 总代异步搜索
    factoryOptions,
    checkedFactorychange(value) {
      handleFacroryChange(value)
    },
    checkedFactorySelect(value) {
      let optionObj = {}
      for (const obj of factoryOptions) {
        if (obj.produceFactoryName === value) {
          optionObj = obj
        }
      }
      dispatchAction({
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
      dispatchAction({
        payload: {
          registDetail: {
            ...registDetail,
            ...optionObj,
            agentSupplierName: optionObj.agentSupplierId,
            certificateId: registDetail.certificateId,
          },
        },
      })
    }, // 总代下拉选择
    refuseReasonList, // 拒绝原因
    handleRelieve(id) {
      showConfirm({
        content: '确定要解除换证吗？',
        zIndex: 1001,
        handleOk() {
          dispatchAction({
            type: 'replaceUnbind',
            payload: {
              certificateId: id,
            },
          }).then(() => {
            dispatchAction({
              type: 'getRegistDetaiList',
              payload: {
                certificateId: rowSelectData.certificateId,
              },
            })
            showConfirm({
              content: '是否要为该注册证继续更换新证',
              zIndex: 1001,
              handleOk() {
                dispatchAction({
                  payload: {
                    step: 1,
                    status: 3,
                    firstFormData: {
                      oldCertificateId: registDetail.certificateId,
                      oldCertificateNo: registDetail.certificateNo,
                    },
                    registDetail: {},
                  },
                })
                dispatchAction({
                  type: 'getRegistList',
                  payload: searchData,
                })
              },
            })
          })
        },
      })
    }, // 解除换证
    radioButtonClick() {
      dispatchAction({
        payload: {
          registCodeOptions: [],
        },
      })
    }, // 证件类型点击事件

    handleReload(data) {
      dispatchAction({
        payload: {
          compareModalVisible: true,
        },
      })
      dispatchAction({
        type: 'getCompareModalList',
        payload: data,
      })
    },
    viewModal(certificateId) {
      dispatchAction({
        payload: {
          viewRegistModalVisible: true,
        },
      })
      dispatchAction({
        type: 'getRegistViewDetail',
        payload: {
          certificateId,
        },
      })
    },
    registTypeList,

    noCertificateClick(value) {
      dispatchAction({
        payload: {
          firstFormData: {
            ...firstFormData,
            certificateType: value,
          },
          registDetail: {
            certificateType: value.key,
            certificateNo: '系统自动生成',
            // platformAuthStatus: 2,
          },
          step: 2,
        },
      })
    },
  }

  // 查看态注册证弹框
  const registViewDetailProps = {
    registTypeList,
    modalVisible: viewRegistModalVisible,
    loading: !!effects[`${namespace}/getRegistViewDetail`],
    status: viewStatus,
    step: viewStep,
    handleCancel() {
      dispatchAction({
        payload: {
          viewRegistModalVisible: false,
          viewRegistDetail: {},
        },
      })
    },
    detail: viewRegistDetail,
    refuseReasonList,
    viewModal(certificateId) {
      dispatchAction({
        type: 'getRegistViewDetail',
        payload: {
          certificateId,
        },
      })
    },
    handleRelieve(id) { // 解除换证
      showConfirm({
        content: '确定要解除换证吗？',
        zIndex: 1001,
        handleOk() {
          dispatchAction({
            type: 'replaceUnbind',
            payload: {
              certificateId: id,
            },
          }).then(() => {
            dispatchAction({
              type: 'getRegistViewDetail',
              payload: {
                certificateId: rowSelectData.certificateId,
              },
            })
            showConfirm({
              content: '是否要为该注册证继续更换新证',
              zIndex: 1001,
              handleOk() {
                dispatchAction({
                  payload: {

                    viewRegistModalVisible: false,
                    registDetailVisible: true,

                    step: 1,
                    status: 3,
                    firstFormData: {
                      oldCertificateId: viewRegistDetail.certificateId,
                      oldCertificateNo: viewRegistDetail.certificateNo,
                    },
                    registDetail: {},
                  },
                })
                dispatchAction({
                  type: 'getRegistList',
                  payload: searchData,
                })
              },
            })
          })
        },
      })
    }, // 解除换证
  }

  const getCompareFlag = () => {
    if (compareModalList && compareModalList.length) {
      /** @description 针对js自动过滤 为null的数据并且过滤掉certificateId
       *  2018-7-17
       */

      const base = [
        'agentSupplierName',
        'certificateNo',
        'certificateType',
        'importedFlag',
        'produceFactoryName',
        'productName',
        'validDateEnd',
        'validDateLongFlag',
        'validDateLongFlag',
      ]

      for (const key of base) {
        if (compareModalList[0][key] !== compareModalList[1][key]) {
          return false
        }
      }
      return true
    }
    return false
  }
  // 注册证标注证件对照
  let compareDatasource = []
  if (compareModalList && compareModalList.length) {
    const arr = cloneDeep(compareModalList)
    arr[0].title = '当前证件信息'
    arr[1].title = '标准证件信息'
    compareDatasource = arr
  }

  // 注册证对比
  const registCompareModalProps = {
    dataSource: compareDatasource,
    compareModalVisible,
    onCancel() {
      dispatchAction({
        payload: {
          compareModalVisible: false,
        },
      })
    },
    loading: effects[`${namespace}/getCompareModalList`] || effects[`${namespace}/updateRegist`],
    rows: [{
      title: '证件编号',
      dataIndex: 'certificateNo',
      render: text => text,
    }, {
      title: '证件类型',
      dataIndex: 'certificateType',
      render: (value) => {
        if (value === '1') {
          return '注册证'
        } else if (value === '2') {
          return '备案证'
        }
        return '消毒证'
      },
    }, {
      title: '产品名称',
      dataIndex: 'productName',
    }, {
      title: '生产企业',
      dataIndex: 'produceFactoryName',
    }, {
      title: '有效期',
      dataIndex: 'validDateStart',
      render: (text, { validDateEnd, validDateLongFlag }) => {
        let str = ''
        if (validDateLongFlag) {
          str = `${text || ''}至长期有效`
        } else {
          str = `${text || ''}至${validDateEnd || ''}`
        }
        return str
      },
    }, {
      title: '是否进口',
      dataIndex: 'importedFlag',
      render: text => (text ? '进口' : '非进口'),
    }, {
      title: '总代',
      dataIndex: 'agentSupplierName',
    }],
    titleRender(item) {
      return (<span>{item.title}</span>)
    },
    title: '同步标准证件信息',
    footer: [
      <Button
        key="cancel"
        onClick={() => {
          dispatchAction({
            payload: {
              compareModalVisible: false,
            },
          })
        }}
      >取消</Button>,
      <Button
        type="primary"
        key="reload"
        disabled={getCompareFlag()}
        onClick={() => {
          showConfirm({
            title: '确定要更新吗？',
            zIndex: 1001,
            handleOk() {
              dispatchAction({
                type: 'updateRegist',
                payload: {
                  standardCertificateId: registDetail.standardCertificateId,
                  standardCertificateNo: registDetail.standardCertificateNo,
                  supplierCertificateId: registDetail.certificateId,
                },
              }).then(({ syncFlag, certificateNo }) => {
                if (!syncFlag) {
                  Modal.error({
                    title: `${certificateNo}，已存在，无法应用更新！`,
                    zIndex: 1001,
                  })
                } else {
                  message.success('更新成功！')
                  dispatchAction({
                    payload: {
                      compareModalVisible: false,
                    },
                  })
                  dispatchAction({
                    type: 'getRegistDetaiList',
                    payload: {
                      certificateId: rowSelectData.certificateId,
                    },
                  })
                  dispatchAction({
                    type: 'getRegistList',
                    payload: searchData,
                  })
                }
              })
            },
          })
        }}
      >更新</Button>,
    ],
    alertInfo: () => {
      const flag = getCompareFlag()
      let props
      if (flag) {
        props = {
          message: '与平台标准库中不存在差异，无需更新',
          type: 'info',
          showIcon: true,
          className: 'aek-mb20',
        }
      } else {
        props = {
          message: '与平台标准库中的证件信息存在如下差异，如果要使用标准注册证信息，请单击更新',
          type: 'warning',
          showIcon: true,
          className: 'aek-mb20',
        }
      }
      return (
        <Alert
          {...props}
        />)
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
      dispatchAction({
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
      dispatchAction({
        type: 'setRegistDelay',
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
    editFlag,
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
          eternalLifeObj: {},
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
          factoryAgentCertificateId: rowSelectData.factoryAgentCertificateId || prodFactoryDetail.factoryAgentCertificateId,
          ...reqData,
        },
      })
    },
  }
  // 授权书
  const authProps = {
    editFlag,
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
    authProductVisible,
    authProductOption,
    authProductTargetKeys,
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
        reqData.validDateStart = data.validDateEnd[0].format('YYYY-MM-DD')
        reqData.validDateEnd = data.validDateEnd[1].format('YYYY-MM-DD')
      } else {
        reqData.validDateStart = data.validDateStart.format('YYYY-MM-DD')
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
    editFlag,
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
        reqData.validDateStart = data.validDateEnd[0].format('YYYY-MM-DD')
        reqData.validDateEnd = data.validDateEnd[1].format('YYYY-MM-DD')
      } else {
        reqData.validDateStart = data.validDateStart.format('YYYY-MM-DD')
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
    powerPersonSetPhone(value, setFieldsValue) {
      setFieldsValue({
        customerContactPhone: value,
      })
      dispatchAction({
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
    editFlag,
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
    otherTypeOptions,
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
          otherDetail: {},
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
        reqData.validDateStart = data.validDateEnd[0].format('YYYY-MM-DD')
        reqData.validDateEnd = data.validDateEnd[1].format('YYYY-MM-DD')
      } else {
        reqData.validDateStart = data.validDateStart.format('YYYY-MM-DD')
      }
      if (data.customerOrgName) {
        reqData.customerOrgId = data.customerOrgName.key
        reqData.customerOrgName = data.customerOrgName.label
      }
      dispatchAction({
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
    orgName,
    handleCancel() {
      dispatchAction({
        payload: {
          companyDetailVisible: false,
          companyLifeObj: {},
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
      {/* <RegistDetailModal {...registDetailProps} /> */}
      <RegistDetail {...registDetailProps} />
      {/* 查看态注册证 */}
      <RegistDetail {...registViewDetailProps} />
      {/* 注册证标准对照 */}
      <RegistCompaerModal {...registCompareModalProps} />
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
  newMyCertificate: PropTypes.object.isRequired,
  effects: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  routes: PropTypes.array,
  orgName: PropTypes.string,
  registTypeList: PropTypes.array,
}

export default connect(
  ({
    newMyCertificate,
    loading: {
      effects,
    },
    app: {
      orgInfo: {
        orgName,
      },
      constants: {
        registTypeList,
      },
    },
  }) => ({ newMyCertificate, effects, orgName, registTypeList }))(MyCertificate)
