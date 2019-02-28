import { message, Modal } from 'antd'
import { parse } from 'qs'
import dvaModelExtend from '../../../utils/modelExtend'
import {
  certificateListData, // 效期
  registListData, // 注册证
  registDetailListData, // 注册证详情
  checkRegistDetailData, // 注册证校验
  setRegistReplaceData, // 注册证换证
  setRegistStatusData, // 更改注册证状态
  setRegistSubmitData, // 注册证新增编辑
  prodFactoryListData, // 厂家总代三证
  prodFactoryDetailData, // 厂家总代三证详情
  setProdFactoryStatusData, // 厂家总代三证更改状态
  setProdFactorySubmitData, // 厂家总代三证编辑提交
  setProdFactoryReplaceData, // 厂家总代三证换证
  authListData, // 授权书
  authDetailData, // 查看授权书详情
  setAuthStatusData, // 授权书启用停用
  setAuthReplaceData, // 授权书换证
  setAuthSubmitData, // 授权书新增编辑
  setAuthCustomerData, // 授权客户列表
  setAuthCustomerSubData, // 授权客户提交
  registDetailSelectData,
  setRegistDelayData, // 注册证延期
  agentOptionsData, // 总代下拉列表
  factoryOptionsData, // 生产厂家下拉列表
  powerListData, // 委托书
  powerDetailData, // 委托书详情
  powerDetailCustData, // 委托书详情客户名称
  powerDetailPersonData, // 委托书人员名称
  powerStatusData, // 委托书停用启用
  powerReplaceData, // 委托书换证
  powerSubmitData, // 委托书新增编辑
  otherListData, // 其他证件
  otherDetailData, // 其他证件详情
  otherStatusData, // 其他证件启用停用
  otherReplaceData, // 其他证件换证
  otherSubmitData, // 其他证件新增编辑
  otherCustomerData, // 其他证件客户名称
  getCertificateNumData, // 获取证件数量
  getAuthTypeInfoData, // 获取授权书上级授权单位
  getCompanyDetailData, // 获取企业证书
  updateCerticicate, // 企业证件换证
  getRefuseReasonListData, // 拒绝原因
  getAuthProductData, // 授权产品列表
  setAuthProductData, // 提交
  getOtherTypeOptions, // 获取其他证件类型下来选项


  replaceUnbind, // 解除换证
  getCompareModalList, // 获取注册证标准信息对照

  updateRegist, // 注册证更新
  deleteRegist, // 删除注册证
} from '../../../services/newCredentials/myCertificate'

const initState = {
  tabIndex: '1',
  selectedRowKeys: [], // 注册证批量选择
  searchData: {}, // 搜索条件
  dataSource: [], // 证件分页列表
  registDataSource: [], // 注册证
  factoryDataSource: [], // 生产厂家
  authDataSource: [], // 授权书分页列表
  powerDataSource: [], // 委托书分页列表
  otherDataSource: [], // 其他档案分页列表
  pagination: {}, // 证件列表分页
  rowSelectData: {}, // 列表点击行数据
  authDetail: {}, // 查看授权书详情
  authDetailVisible: false, // 查看授权书详情弹框
  modalTitle: '', // 所有弹框的标题
  agentOptions: [], // 总代下拉列表
  factoryOptions: [], // 生产厂家下拉列表
  authTypeInfoOptions: [], // 授权书上级授权单位
  prodFactoryVisible: false, // 厂家总代三证详情弹框
  prodFactoryDetail: {
    certificates: [],
  }, // 厂家总代三证详情
  eternalLifeObj: {}, // 复选框状态
  registDetail: {}, // 注册证详情
  registDetailVisible: false, // 注册证详情弹框
  registCodeOptions: [], // 证号模糊匹配查询
  registDelaylVisible: false, // 注册证延期弹框
  powerDetail: {}, // 委托书详情
  powerDetailVisible: false, // 委托书详情弹框
  powerDetailCustOptions: [], // 授权书详情客户名称
  powerDetailPersonOptions: [], // 授权书详情人员名称
  powerCustomerVisible: false, // 授权客户弹框
  authProductVisible: false, // 授权产品弹框
  authProductOption: [], // 所有的授权产品列表
  authProductTargetKeys: [], // 授权产品已选择的证件
  powerCustomerList: [], // 授权书默认全部客户列表
  powerCustomerTargetKeys: [], // 授权书已选择的客户
  otherDetail: {}, // 其他证件详情
  otherDetailVisible: false, // 其他证件详情弹框
  otherCustOptions: [], // 其他证件客户名称
  allCustomerOptions: [],
  certificateNum: {}, // 证件数量
  companyDetailVisible: false, // 企业证件
  companyDetail: {},
  companyLifeObj: {}, // 企业证件复选框状态
  refuseReasonList: [], // 拒绝原因
  otherTypeOptions: {}, // 其他证件 证件类型下拉选项


  firstFormData: {}, // 注册证弹框第一步的数据
  step: 2, // 默认第一步弹框
  status: 1, // 1 是新增 2 编辑 3 换证
  compareModalVisible: false,
  compareModalList: [{ title: '当前证件信息' }, { title: '标准证件信息' }],


  viewRegistModalVisible: false, // 查看态注册证
  viewStep: 2, // 查看态弹框
  viewStatus: 4, // 查看弹框 状态  只存在4
  viewRegistDetail: {}, // 查看态详情信息
}
const certificate = [
  { type: '企业三证', url: 'getCompanyDetail', listUrl: 'getCertificateList', id: 'certificateId' },
  { type: '注册证', url: 'getRegistDetaiList', listUrl: 'getRegistList', id: 'certificateId' },
  { type: '生产厂家/总经销商', listUrl: 'prodFactoryList', url: 'getprodFactoryDetai', id: 'factoryAgentCertificateId' },
  { type: '授权书', listUrl: 'authList', url: 'getAuthDetail', id: 'certificateId' },
  { type: '委托书', listUrl: 'powerList', url: 'getPowerDetail', id: 'certificateId' },
  { type: '其他档案', listUrl: 'otherList', url: 'getOtherDetail', id: 'certificateId' },
]
export default dvaModelExtend({
  namespace: 'newMyCertificate',
  state: {},
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname, search }) => {
        const query = parse(search, { ignoreQueryPrefix: true })
        if (pathname === '/newCredentials/newMyCertificate') {
          // 初始化数据
          dispatch({
            type: 'updateState',
            payload: initState,
          })

          /** @desc 效期提醒查看其它证件信息 */

          dispatch({
            type: 'getOtherTypeOptions',
            payload: {
              dicKey: 'OTHER_CERTIFICATE_TYPE',
            },
          })
          // 获取注册证配置
          dispatch({
            type: 'app/getRegistList',
          })

          // 获取证件数量
          dispatch({ type: 'getCertificateNum' })
          // 获取拒绝原因
          dispatch({ type: 'getRefuseReasonList', payload: { dicKey: 'BGREFUSEREASON' } })
          // 新增页面跳转逻辑信息跳转
          if (Object.keys(query).length && query.id && query.type) {
            const id = query.id
            const index = query.index
            const type = query.type
            dispatch({
              type: 'updateState',
              payload: {
                tabIndex: index,
                modalTitle: type === '1' ? `编辑${certificate[index - 1].type}` : '换证',
              },
            })
            const url = certificate[index - 1].url
            const listUrl = certificate[index - 1].listUrl
            dispatch({
              type: url,
              payload: {
                [certificate[index - 1].id]: id,
                type,
                index,
              },
            })
            dispatch({
              type: listUrl,
              payload: {
                current: 1,
                pageSize: 10,
              },
            })
            // 首页看板挑战
          } else if (Object.keys(query).length && query.index && query.platformAuthStatus) {
            const index = query.index
            const listUrl = certificate[index - 1].listUrl
            const platformAuthStatus = query.platformAuthStatus
            dispatch({
              type: 'updateState',
              payload: {
                tabIndex: index,
              },
            })
            dispatch({
              type: listUrl,
              payload: {
                current: 1,
                pageSize: 10,
                platformAuthStatus,
              },
            })
          } else if (Object.keys(query).length && query.index) {
            const index = query.index
            const listUrl = certificate[index - 1].listUrl
            dispatch({
              type: 'updateState',
              payload: {
                tabIndex: index,
              },
            })
            dispatch({
              type: listUrl,
              payload: {
                current: 1,
                pageSize: 10,
              },
            })
          } else {
            const certificateExpiredStatus = query.certificateExpiredStatus
            // 获取我的客户列表数据
            dispatch({ type: 'getCertificateList', payload: { current: 1, pageSize: 10, certificateExpiredStatus: certificateExpiredStatus || '5' } })
          }
        }
      })
    },
  },
  effects: {
    // 获取拒绝原因
    * getRefuseReasonList({ payload }, { call, put }) {
      const { content } = yield call(getRefuseReasonListData, payload)
      yield put({
        type: 'updateState',
        payload: {
          refuseReasonList: content,
        },
      })
    },
    // 获取证件数量
    * getCertificateNum({ payload }, { call, put }) {
      const { content } = yield call(getCertificateNumData, payload)
      yield put({
        type: 'updateState',
        payload: {
          certificateNum: content,
        },
      })
    },
    // 获取效期提醒列表
    * getCertificateList({ payload }, { call, put }) {
      const { content } = yield call(certificateListData, payload)
      yield put({
        type: 'updateState',
        payload: {
          searchData: payload,
          dataSource: content.data,
          tabIndex: '1',
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
    // 获取注册证列表
    * getRegistList({ payload }, { call, put }) {
      const { content } = yield call(registListData, payload)
      yield put({
        type: 'updateState',
        payload: {
          searchData: payload,
          registDataSource: content.data,
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
    // 获取注册证详情
    * getRegistDetaiList({ payload }, { call, put }) {
      const { content } = yield call(registDetailListData, payload)
      yield put({
        type: 'updateState',
        payload: {
          registDetail: content,
        },
      })
      // if (content.platformAuthStatus === 2 && payload.type && payload.index) {
      //   yield put({
      //     type: 'updateState',
      //     payload: {
      //       registDetailVisible: true,
      //       modalTitle: `查看${certificate[payload.index - 1].type}`,
      //     },
      //   })
      // }
    },

    // 查看态获取注册证详情
    * getRegistViewDetail({ payload }, { call, put }) {
      const { content } = yield call(registDetailListData, payload)
      yield put({
        type: 'updateState',
        payload: {
          viewRegistDetail: content,
        },
      })
    },

    // 获取注册证详情
    * getRegistDetail({ payload }, { call, update }) {
      const { content } = yield call(checkRegistDetailData, payload)
      if (content.maintenanceFlag) {
        return content
      }
      yield update({
        registDetail: {
          ...content.registerCertificateDetailVO,
          standardCertificateId: content.registerCertificateDetailVO.certificateId,
          certificateId: undefined,
        },
      })
      return content
    },
    // 取消换证
    * replaceUnbind({ payload }, { call }) {
      yield call(replaceUnbind, payload)
    },
    // 注册证标准对照
    * getCompareModalList({ payload }, { call, update }) {
      const { content: { certificateDetail, standardCertificateDetail } } =
      yield call(getCompareModalList, payload)
      yield update({
        compareModalList: [{ ...certificateDetail }, { ...standardCertificateDetail }],
      })
    },
    // 注册证更新
    * updateRegist({ payload }, { call }) {
      const { content } = yield call(updateRegist, payload)
      return content
    },
    // 删除注册证
    * deleteRegist({ payload }, { call, select, put }) {
      const searchData = yield select(({ newMyCertificate }) => newMyCertificate.searchData)
      yield call(deleteRegist, payload)
      yield put({
        type: 'getRegistList',
        payload: searchData,
      })
    },
    // 获取注册证号模糊匹配
    * getregistDetailOptions({ payload }, { call, put }) {
      const { content } = yield call(registDetailSelectData, payload)
      yield put({
        type: 'updateState',
        payload: {
          registCodeOptions: content,
        },
      })
    },
    // 注册证延期提交
    * setRegistDelay({ payload }, { call, put, select }) {
      const searchData = yield select(({ newMyCertificate }) => newMyCertificate.searchData)
      yield call(setRegistDelayData, payload)
      message.success('延期成功', 3)
      yield put({
        type: 'updateState',
        payload: {
          registDelaylVisible: false,
        },
      })
      yield put({
        type: 'getRegistList',
        payload: searchData,
      })
    },
    // 注册证更改状态
    * setRegistStatus({ payload }, { call, put, select }) {
      const searchData = yield select(({ newMyCertificate }) => newMyCertificate.searchData)
      yield call(setRegistStatusData, payload)
      message.success('成功', 3)
      yield put({
        type: 'getRegistList',
        payload: searchData,
      })
    },
    // 注册证换证提交
    * setRegistReplace({ payload }, { call, put, select }) {
      const { searchData, tabIndex } = yield select(({ newMyCertificate }) => newMyCertificate)
      const { content: { status, certificateNo } } = yield call(setRegistReplaceData, payload)
      if (status === 0) {
        message.success('已提交至客服进行审核，请耐心等待，如果紧急请联系客服：400-052-5256')
        let url = 'getRegistList'
        if (tabIndex === '1') {
          url = 'getCertificateList'
        }
        yield put({
          type: 'updateState',
          payload: {
            registDetailVisible: false,
          },
        })
        yield put({
          type: url,
          payload: searchData,
        })
      } else if (status === 1) {
        message.error('当前注册证已经被换证！')
      } else if (status === 2) {
        message.success('该注册证已存在！')
        let url = 'getRegistList'
        if (tabIndex === '1') {
          url = 'getCertificateList'
        }
        yield put({
          type: 'updateState',
          registDetailVisible: false,
        })
        yield put({
          type: url,
          payload: searchData,
        })
      } else {
        message.error(`${payload.certificateNo}已是${certificateNo}新证，请检查是否换错。`)
      }
    },
    // 注册证新增编辑
    * setRegistSubmit({ payload }, { call, put, select }) {
      const searchData = yield select(({ newMyCertificate }) => newMyCertificate.searchData)
      if (payload.validDateStart.length) {
        payload.validDateStart = payload.validDateStart[0]
      }
      const { content } = yield call(setRegistSubmitData, payload)

      if (content === 0) {
        if (payload.platformAuthStatus === 2) {
          message.success('操作成功')
        } else {
          message.success('已提交至客服进行审核，请耐心等待，如果紧急请联系客服：400-052-5256')
        }
        yield put({
          type: 'updateState',
          payload: {
            registDetailVisible: false,
          },
        })
        yield put({
          type: 'getRegistList',
          payload: searchData,
        })
        yield put({ type: 'getCertificateNum' })
      } else if (content === 1) {
        message.error('该注册证已存在！')
      } else if (content === 2) {
        Modal.error({
          title: '该证件已被平台审核通过！',
          zIndex: 910,
        })
      } else if (content === 3) {
        Modal.error({
          title: '证件已被删除！',
          zIndex: 910,
        })
      } else if (content === 4) {
        message.success('新增成功！')
        yield put({
          type: 'updateState',
          payload: {
            registDetailVisible: false,
          },
        })
        yield put({
          type: 'getRegistList',
          payload: searchData,
        })
        yield put({ type: 'getCertificateNum' })
      }
    },
    // 获取厂家总代三证列表
    * prodFactoryList({ payload }, { call, put }) {
      const { content } = yield call(prodFactoryListData, payload)
      yield put({
        type: 'updateState',
        payload: {
          searchData: payload,
          factoryDataSource: content.data,
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
    // 获取厂家总代三证列表详情
    * getprodFactoryDetai({ payload }, { call, put }) {
      const { content } = yield call(prodFactoryDetailData, payload)
      yield put({
        type: 'updateState',
        payload: {
          prodFactoryDetail: content,
        },
      })
      if (content.platformAuthStatus === 2 && payload.type && payload.index) {
        yield put({
          type: 'updateState',
          payload: {
            prodFactoryVisible: true,
            modalTitle: `查看${certificate[payload.index - 1].type}`,
          },
        })
      }
      yield put({
        type: 'updateState',
        payload: {
          prodFactoryVisible: true,
        },
      })
    },
    // 生产厂家总代三证停用启用
    * setProdFactoryStatus({ payload }, { call, put, select }) {
      yield call(setProdFactoryStatusData, payload)
      const searchData = yield select(({ newMyCertificate }) => newMyCertificate.searchData)
      message.success('成功', 3)
      yield put({
        type: 'prodFactoryList',
        payload: searchData,
      })
    },
    // 生产厂家总代三证编辑提交
    * setProdFactorySubmit({ payload }, { call, put, select }) {
      const searchData = yield select(({ newMyCertificate }) => newMyCertificate.searchData)
      yield call(setProdFactorySubmitData, payload)
      yield put({
        type: 'updateState',
        payload: {
          prodFactoryVisible: false,
        },
      })
      message.success('成功', 3)
      yield put({
        type: 'prodFactoryList',
        payload: searchData,
      })
    },
    // 生产厂家总代三证换证提交
    * setProdFactoryReplace({ payload }, { call, put, select }) {
      const searchData = yield select(({ newMyCertificate }) => newMyCertificate.searchData)
      yield call(setProdFactoryReplaceData, payload)
      yield put({
        type: 'updateState',
        payload: {
          prodFactoryVisible: false,
        },
      })
      message.success('成功', 3)
      yield put({
        type: 'prodFactoryList',
        payload: searchData,
      })
    },
    // 获取授权书列表
    * authList({ payload }, { call, put }) {
      const { content } = yield call(authListData, payload)
      yield put({
        type: 'updateState',
        payload: {
          searchData: payload,
          authDataSource: content.data,
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
    // 查看授权书详情
    * getAuthDetail({ payload }, { call, put }) {
      const { content } = yield call(authDetailData, payload)
      yield put({
        type: 'updateState',
        payload: {
          authDetail: content,
        },
      })
      if (content.platformAuthStatus === 2 && payload.type && payload.index) {
        yield put({
          type: 'updateState',
          payload: {
            authDetailVisible: true,
            modalTitle: `查看${certificate[payload.index - 1].type}`,
          },
        })
      }
      yield put({
        type: 'updateState',
        payload: {
          authDetailVisible: true,
        },
      })
      yield put({
        type: 'getAuthTypeInfo',
        payload: {
          keywords: '',
        },
      })
      yield put({
        type: 'getFactoryOptions',
        payload: {
          keywords: '',
        },
      })
    },
    // 授权书停用启用
    * setAuthStatus({ payload }, { call, put, select }) {
      const searchData = yield select(({ newMyCertificate }) => newMyCertificate.searchData)
      yield call(setAuthStatusData, payload)
      yield put({
        type: 'authList',
        payload: searchData,
      })
    },
    // 授权书编辑提交
    * setAuthSubmit({ payload }, { call, put, select }) {
      const searchData = yield select(({ newMyCertificate }) => newMyCertificate.searchData)
      yield call(setAuthSubmitData, payload)
      yield put({
        type: 'updateState',
        payload: {
          authDetailVisible: false,
        },
      })
      message.success('成功', 3)
      yield put({
        type: 'authList',
        payload: searchData,
      })
      yield put({ type: 'getCertificateNum' })
    },
    // 授权书换证提交
    * setAuthReplace({ payload }, { call, put, select }) {
      const searchData = yield select(({ newMyCertificate }) => newMyCertificate.searchData)
      yield call(setAuthReplaceData, payload)
      yield put({
        type: 'updateState',
        payload: {
          authDetailVisible: false,
        },
      })
      message.success('成功', 3)
      yield put({
        type: 'authList',
        payload: searchData,
      })
    },
    // 授权书授权客户列表
    * getPowerCustomer({ payload }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          powerCustomerVisible: true,
        },
      })
      const { content } = yield call(setAuthCustomerData, payload)
      const powerCustomerTargetKeys = []
      for (const obj of content) {
        if (obj.flag) {
          powerCustomerTargetKeys.push(obj.customerOrgId)
        }
      }
      yield put({
        type: 'updateState',
        payload: {
          allCustomerOptions: content,
          powerCustomerTargetKeys,
        },
      })
    },
    // 授权客户提交
    * setAuthCustomerSub({ payload }, { call, put, select }) {
      const searchData = yield select(({ newMyCertificate }) => newMyCertificate.searchData)
      yield call(setAuthCustomerSubData, payload)
      yield put({
        type: 'updateState',
        payload: {
          powerCustomerVisible: false,
        },
      })
      message.success('提交成功', 3)
      yield put({
        type: 'authList',
        payload: searchData,
      })
    },
    // 授权书授权产品列表
    * getAuthProduct({ payload }, { call, put }) {
      const { content } = yield call(getAuthProductData, payload) // TODO
      const authProductTargetKeys = []
      for (const obj of content) {
        if (obj.flag) {
          authProductTargetKeys.push(obj.registerCertId)
        }
      }
      yield put({
        type: 'updateState',
        payload: {
          authProductOption: content,
          authProductTargetKeys,
        },
      })
    },
    // 授权书授权产品提交
    * setAuthProduct({ payload }, { call, put, select }) {
      const searchData = yield select(({ newMyCertificate }) => newMyCertificate.searchData)
      yield call(setAuthProductData, payload)
      yield put({
        type: 'updateState',
        payload: {
          authProductVisible: false,
        },
      })
      message.success('提交成功', 3)
      yield put({
        type: 'authList',
        payload: searchData,
      })
    },
    // 总代下拉列表
    * getAgentOptions({ payload }, { call, put }) {
      const { content } = yield call(agentOptionsData, payload)
      yield put({
        type: 'updateState',
        payload: {
          agentOptions: content,
        },
      })
    },
    // 生产厂家下拉列表
    * getFactoryOptions({ payload }, { call, put }) {
      const { content } = yield call(factoryOptionsData, payload)
      yield put({
        type: 'updateState',
        payload: {
          factoryOptions: content,
        },
      })
    },
    // 获取委托书列表
    * powerList({ payload }, { call, put }) {
      const { content } = yield call(powerListData, payload)
      yield put({
        type: 'updateState',
        payload: {
          searchData: payload,
          powerDataSource: content.data,
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
    // 获取委托书详情
    * getPowerDetail({ payload }, { call, put }) {
      const { content } = yield call(powerDetailData, payload)
      yield put({
        type: 'updateState',
        payload: {
          powerDetail: content,
        },
      })
      if (content.platformAuthStatus === 2 && payload.type && payload.index) {
        yield put({
          type: 'updateState',
          payload: {
            powerDetailVisible: true,
            modalTitle: `查看${certificate[payload.index - 1].type}`,
          },
        })
      }
      yield put({
        type: 'updateState',
        payload: {
          powerDetailVisible: true,
        },
      })
      yield put({
        type: 'getPowerDetailCust',
        payload: {
          keywords: '',
        },
      })
      yield put({
        type: 'getPowerDetailPerson',
        payload: {
          keywords: '',
        },
      })
    },
    // 委托书客户名称
    * getPowerDetailCust({ payload }, { call, put }) {
      const { content } = yield call(powerDetailCustData, payload)
      yield put({
        type: 'updateState',
        payload: {
          powerDetailCustOptions: content,
        },
      })
    },
    // 委托书人员名称
    * getPowerDetailPerson({ payload }, { call, put }) {
      const { content } = yield call(powerDetailPersonData, payload)
      yield put({
        type: 'updateState',
        payload: {
          powerDetailPersonOptions: content,
        },
      })
    },
    // 委托书停用启用
    * setPowerStatus({ payload }, { call, put, select }) {
      const searchData = yield select(({ newMyCertificate }) => newMyCertificate.searchData)
      yield call(powerStatusData, payload)
      yield put({
        type: 'powerList',
        payload: searchData,
      })
    },
    // 委托书换证
    * setPowerReplace({ payload }, { call, put, select }) {
      const searchData = yield select(({ newMyCertificate }) => newMyCertificate.searchData)
      yield call(powerReplaceData, payload)
      yield put({
        type: 'updateState',
        payload: {
          powerDetailVisible: false,
        },
      })
      message.success('换证成功', 3)
      yield put({
        type: 'powerList',
        payload: searchData,
      })
    },
    // 委托书新增编辑
    * setPowerSubmit({ payload }, { call, put, select }) {
      const searchData = yield select(({ newMyCertificate }) => newMyCertificate.searchData)
      yield call(powerSubmitData, payload)
      yield put({
        type: 'updateState',
        payload: {
          powerDetailVisible: false,
        },
      })
      message.success('成功', 3)
      yield put({
        type: 'powerList',
        payload: searchData,
      })
      yield put({ type: 'getCertificateNum' })
    },
    // 获取其他证件
    * otherList({ payload }, { call, put }) {
      const { content } = yield call(otherListData, payload)
      yield put({
        type: 'updateState',
        payload: {
          searchData: payload,
          otherDataSource: content.data,
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
    // 获取其他证件详情
    * getOtherDetail({ payload }, { call, put }) {
      const { content } = yield call(otherDetailData, payload)
      yield put({
        type: 'updateState',
        payload: {
          otherDetail: content,
        },
      })
      if (content.platformAuthStatus === 2 && payload.index && payload.type) {
        yield put({
          type: 'updateState',
          payload: {
            otherDetailVisible: true,
            modalTitle: `查看${certificate[payload.index - 1].type}`,
          },
        })
      }
      yield put({
        type: 'updateState',
        payload: {
          otherDetailVisible: true,
        },
      })
      yield put({
        type: 'getOtherCustomer',
        payload: {
          keywords: '',
        },
      })
    },
    // 其他证件停用启用
    * setOtherStatus({ payload }, { call, put, select }) {
      const searchData = yield select(({ newMyCertificate }) => newMyCertificate.searchData)
      yield call(otherStatusData, payload)
      yield put({
        type: 'otherList',
        payload: searchData,
      })
    },
    // 其他证件新增编辑
    * setOtherSubmit({ payload }, { call, put, select }) {
      const searchData = yield select(({ newMyCertificate }) => newMyCertificate.searchData)
      yield call(otherSubmitData, payload)
      yield put({
        type: 'updateState',
        payload: {
          otherDetailVisible: false,
          otherDetailData: {},
        },
      })
      message.success('成功', 3)
      yield put({
        type: 'otherList',
        payload: searchData,
      })
      yield put({ type: 'getCertificateNum' })
    },
    // 其他证件换证
    * setOtherReplace({ payload }, { call, put, select }) {
      const searchData = yield select(({ newMyCertificate }) => newMyCertificate.searchData)
      yield call(otherReplaceData, payload)
      yield put({
        type: 'updateState',
        payload: {
          otherDetailVisible: false,
          otherDetailData: {},
        },
      })
      message.success('换证成功', 3)
      yield put({
        type: 'otherList',
        payload: searchData,
      })
    },
    // 其他证件查询客户名称
    * getOtherCustomer({ payload }, { call, put }) {
      const { content } = yield call(otherCustomerData, payload)
      yield put({
        type: 'updateState',
        payload: {
          otherCustOptions: content,
        },
      })
    },
    // 授权书获取上级授权单位
    * getAuthTypeInfo({ payload }, { call, put }) {
      const { content } = yield call(getAuthTypeInfoData, payload)
      yield put({
        type: 'updateState',
        payload: {
          authTypeInfoOptions: content,
        },
      })
    },
    // 获取企业资料
    * getCompanyDetail({ payload }, { call, put }) {
      const { content } = yield call(getCompanyDetailData, payload)
      yield put({
        type: 'updateState',
        payload: {
          companyDetail: content,
        },
      })
      if (content.platformAuthStatus === 2 && payload.index && payload.type) {
        yield put({
          type: 'updateState',
          payload: {
            companyDetailVisible: true,
            modalTitle: `查看${certificate[payload.index - 1].type}`,
          },
        })
      }
      yield put({
        type: 'updateState',
        payload: {
          companyDetailVisible: true,
        },
      })
    },
    // 企业证件换证
    * setUpdateCerticicate({ payload }, { call, put, select }) {
      yield call(updateCerticicate, payload)
      yield put({
        type: 'updateState',
        payload: {
          companyDetailVisible: false,
        },
      })
      message.success('换证成功', 3)
      const searchData = yield select(({ newMyCertificate }) => newMyCertificate.searchData)
      yield put({
        type: 'getCertificateList',
        payload: searchData,
      })
    },
    // 获取其他证件证件类型下拉选项
    * getOtherTypeOptions({ payload }, { call, update }) {
      const { content } = yield call(getOtherTypeOptions, payload)
      yield update({
        otherTypeOptions: content,
      })
    },
  },
  reducers: {

  },
})
