import React from 'react'
import PropTypes from 'prop-types'
import { Table, Input, Menu, Dropdown, Icon } from 'antd'
import { debounce, trim } from 'lodash'
import SearchForm from '../../../../components/SearchFormFilter'
import { getOption, getBasicFn } from '../../../../utils'
import AuthCustomer from './authCustomer'
import AuthProduct from './authProduct'


const noLabelLayout = {
  wrapperCol: { span: 22 },
}

function Auth({
                editFlag,
  effects,
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
}) {
  const { getLoading, dispatchAction } = getBasicFn({ namespace: 'newMyCertificate', loading: { effects } })

  const searchProps = {
    formData: [{
      layout: noLabelLayout,
      field: 'certificateStatus',
      width: 220,
      options: {
        initialValue: null,
      },
      component: {
        name: 'Select',
        props: {
          optionLabelProp: 'title',
          children: getOption([{
            id: null,
            name: '全部',
          }, {
            id: '0',
            name: '启用',
          }, {
            id: '1',
            name: '停用',
          }], { prefix: '证件状态' }),
        },
      },
    },
    {
      layout: noLabelLayout,
      field: 'certificateExpiredStatus',
      width: 220,
      options: {
        initialValue: null,
      },
      component: {
        name: 'Select',
        props: {
          optionLabelProp: 'title',
          children: getOption([{
            id: null,
            name: '全部',
          }, {
            id: '1',
            name: '已过期',
          }, {
            id: '0',
            name: '未过期',
          }], { prefix: '效期 ' }),
        },
      },
    },
    {
      width: 220,
      layout: noLabelLayout,
      field: 'keywords',
      component: (
        <Input placeholder="请输入授权公司/生产厂商" />
      ),
      options: {
        initialValue: null,
      },
    },
    ],
    onSearch: (value) => {
      dispatchAction({
        type: 'authList',
        payload: {
          ...value,
          current: 1,
          pageSize: 10,
        },
      })
    },
  }
  const columns = [
    {
      key: 'superiorAuthFactoryName',
      dataIndex: 'superiorAuthFactoryName',
      title: '授权公司/生产厂商',
      render: (value, record) => (<span>
        <p>{value}</p>
        <p>{record.produceFactoryName}</p>
      </span>),
    },
    {
      key: 'validDateEnd',
      dataIndex: 'validDateEnd',
      title: '有效期',
      render: (value, record) => { // 先判断是否长期有效
        let dom
        const replace = () => (<span>
          {record.replacedFlag ? <p className="aek-red">(已换证,<a onClick={() => {
            dispatchAction({
              payload: {
                modalTitle: '查看授权书',
              },
            })
            dispatchAction({
              type: 'getAuthDetail',
              payload: {
                certificateId: record.replacedCertificateId,
              },
            })
          }}
          >查看新证件</a>)</p> : ''
          }
        </span>)
        // 先判断是否长期有效
        if (record.validDateLongFlag) {
          dom = (<p>长期有效</p>)
        } else {
          const oldDate = new Date(new Date(value).getTime() + (24 * 60 * 60 * 1000)).getTime()
          const todayDate = new Date().getTime()
          if (oldDate < todayDate) {
            dom = <p className="aek-text-disable">{`${record.validDateStart}至${record.validDateEnd}`}<span className="aek-red">（已过期）</span></p>
          } else {
            dom = <p>{`${record.validDateStart}至${record.validDateEnd}`}</p>
          }
        }
        return (<span>
          {dom}
          <span>{replace()}</span>
        </span>)
      },
    },
    {
      key: 'productAuthNum',
      dataIndex: 'productAuthNum',
      title: '授权产品',
      render: (value, record) => (<span>{`${value || 0}本，`}<a onClick={() => {
        dispatchAction({
          payload: {
            authProductVisible: true,
            rowSelectData: record,
          },
        })
        dispatchAction({
          type: 'getAuthProduct',
          payload: {
            certificateId: record.certificateId,
            keywords: '',
          },
        })
      }}
      >编辑</a></span>),
    },
    {
      key: 'certificateAuthNum',
      dataIndex: 'certificateAuthNum',
      title: '授权客户',
      render: (value, record) => (<span>{`${value}家客户已授权，`}<a onClick={() => {
        dispatchAction({
          payload: { rowSelectData: record },
        })
        dispatchAction({
          type: 'getPowerCustomer',
          payload: { certificateId: record.certificateId },
        })
      }}
      >编辑</a></span>),
    },
    {
      key: 'certificateStatus',
      dataIndex: 'certificateStatus',
      title: '状态',
      className: 'aek-text-center',
      render: (value) => {
        let str = ''
        if (value) {
          str = '停用'
        } else {
          str = '启用'
        }
        return str
      },
    },
    {
      key: 'operation',
      dataIndex: 'operation',
      title: '操作',
      width: 150,
      className: 'aek-text-center',
      render: (value, record) => {
        // 下拉按钮点击事件
        const handleMenuClick = (val) => {
          const key = val.key
          dispatchAction({
            payload: {
              modalTitle: '换证',
              rowSelectData: record,
            },
          })
          switch (key) {
            case '1':
              dispatchAction({
                type: 'getAuthDetail',
                payload: {
                  certificateId: record.certificateId,
                  replacedFlag: true,
                },
              })
              break
            default:
              showConfirm({
                content: record.certificateStatus ? '确定要启用该证件吗？' : '确定要停用该证件吗？',
                handleOk() {
                  dispatchAction({
                    type: 'setAuthStatus',
                    payload: {
                      certificateId: record.certificateId,
                      certificateStatus: record.certificateStatus ? 0 : 1,
                    },
                  })
                },
              })
              break
          }
        }
        // 下拉按钮
        const menu = (
          <Menu onClick={handleMenuClick}>
            {record.replacedFlag ? '' : <Menu.Item key="1">换证</Menu.Item>}
            <Menu.Item key="2">{record.certificateStatus ? '启用' : '停用'}</Menu.Item>
          </Menu>
        )
        if (editFlag == 0) {
          return (
            <span>
            {/*<Dropdown overlay={menu} trigger={['click']}>*/}
              {/*<a>*/}
                {/*更多<Icon type="down" />*/}
              {/*</a>*/}
            {/*</Dropdown>*/}
          </span>
          )
        } else {
          return (
            <span>
            <a
              onClick={() => {
                dispatchAction({
                  payload: {
                    modalTitle: '编辑授权书',
                  },
                })
                dispatchAction({
                  type: 'getAuthDetail',
                  payload: {
                    certificateId: record.certificateId,
                  },
                })
              }}
            >编辑</a>
            <span className="ant-divider" />
            <Dropdown overlay={menu} trigger={['click']}>
              <a>
                更多<Icon type="down" />
              </a>
            </Dropdown>
          </span>
          )
        }

      },
    },
  ]
  // 翻页
  const handleChange = (value) => {
    dispatchAction({
      type: 'authList',
      payload: {
        ...searchData,
        ...value,
      },
    })
  }
  // 授权客户
  const authCustomerProps = {
    data: allCustomerOptions,
    targetKeys: powerCustomerTargetKeys,
    handleTargetKeysChange(targetKeys) {
      dispatchAction({
        payload: {
          powerCustomerTargetKeys: targetKeys,
        },
      })
    },
    visible: powerCustomerVisible,
    loading: getLoading('getPowerCustomer', 'setAuthCustomerSub'),
    handleCancel() {
      dispatchAction({
        payload: {
          powerCustomerVisible: false,
          powerCustomerTargetKeys: [],
        },
      })
    },
    handleOk() {
      dispatchAction({
        type: 'setAuthCustomerSub',
        payload: {
          customerOrgIds: powerCustomerTargetKeys,
          certificateId: rowSelectData.certificateId,
        },
      })
    },
  }
  const onSearchOrgDelay = debounce((keywrods) => {
    dispatchAction({
      type: 'getAuthProduct',
      payload: {
        certificateId: rowSelectData.certificateId,
        keywrods,
      },
    })
  }, 500)
  // 授权产品参数
  const authProductProps = {
    data: authProductOption,
    targetKeys: authProductTargetKeys,
    handleTargetKeysChange(targetKeys) {
      dispatchAction({
        payload: {
          authProductTargetKeys: targetKeys,
        },
      })
    },
    visible: authProductVisible,
    loading: getLoading('getAuthProduct', 'setAuthProduct'),
    handleCancel() {
      dispatchAction({
        payload: {
          authProductVisible: false,
          authProductTargetKeys: [],
        },
      })
    },
    handleOk() {
      dispatchAction({
        type: 'setAuthProduct',
        payload: {
          registerCertIds: authProductTargetKeys,
          authCertId: rowSelectData.certificateId,
        },
      })
    },
  }
  return (
    <div key={tabIndex}>
      <SearchForm {...searchProps} />
      <Table
        columns={columns}
        dataSource={authDataSource}
        pagination={pagination}
        bordered
        onChange={handleChange}
        loading={!!effects['newMyCertificate/authList']}
        rowKey="certificateId"
      />
      <AuthCustomer {...authCustomerProps} />
      <AuthProduct {...authProductProps} />
    </div>
  )
}

Auth.propTypes = {
  effects: PropTypes.object,
  authDataSource: PropTypes.array,
  pagination: PropTypes.object,
  searchData: PropTypes.object,
  tabIndex: PropTypes.string,
  showConfirm: PropTypes.func,
  powerCustomerVisible: PropTypes.bool,
  allCustomerOptions: PropTypes.array,
  powerCustomerTargetKeys: PropTypes.array,
  rowSelectData: PropTypes.object,
  authProductVisible: PropTypes.bool,
  authProductOption: PropTypes.array,
  authProductTargetKeys: PropTypes.array,
}

export default Auth
