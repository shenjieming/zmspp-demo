import React from 'react'
import PropTypes from 'prop-types'
import { Table, Select, Input, Menu, Dropdown, Icon } from 'antd'
import SearchForm from '../../../../components/SearchFormFilter'
import { getOption, getBasicFn } from '../../../../utils'
import AuthCustomer from './authCustomer'


const noLabelLayout = {
  wrapperCol: { span: 22 },
}
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
}
const Option = Select.Option
function Auth({
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
}) {
  const { getLoading } = getBasicFn({ namespace: 'myCertificate', loading: { effects } })
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
      field: 'platformAuthStatus',
      width: 220,
      options: {
        initialValue: searchData.platformAuthStatus || null,
      },
      component: {
        name: 'Select',
        props: {
          optionLabelProp: 'title',
          children: getOption([{
            id: null,
            name: '全部',
          }, {
            id: '2',
            name: '已认证',
          }, {
            id: '1',
            name: '待审核',
          }, {
            id: '3',
            name: '未通过',
          }], { prefix: '认证状态 ' }),
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
      dispatch({
        type: 'myCertificate/authList',
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
          {record.replacedPlatformAuthStatus === 2 ? <p className="aek-red">(已换证,<a onClick={() => {
            dispatch({
              type: 'myCertificate/updateState',
              payload: {
                modalTitle: '查看授权书',
              },
            })
            dispatch({
              type: 'myCertificate/getAuthDetail',
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
      key: 'certificateAuthNum',
      dataIndex: 'certificateAuthNum',
      title: '授权客户',
      render: (value, record) => <span>{`${value}家客户已授权，`}<a onClick={() => { dispatch({ type: 'myCertificate/updateState', payload: { rowSelectData: record } }); dispatch({ type: 'myCertificate/getPowerCustomer', payload: { certificateId: record.certificateId } }) }}>编辑</a></span>,
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
      key: 'platformAuthStatus',
      dataIndex: 'platformAuthStatus',
      title: '平台认证状态',
      className: 'aek-text-center',
      render: (value) => {
        let str = ''
        switch (value) {
          case 1:
            str = '待审核'
            break
          case 2:
            str = '已认证'
            break
          default:
            str = '未通过'
            break
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
          dispatch({
            type: 'myCertificate/updateState',
            payload: {
              modalTitle: '换证',
              rowSelectData: record,
            },
          })
          switch (key) {
            case '1':
              dispatch({
                type: 'myCertificate/getAuthDetail',
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
                  dispatch({
                    type: 'myCertificate/setAuthStatus',
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
            {record.replacedPlatformAuthStatus === 2 ? '' : <Menu.Item key="1">换证</Menu.Item>}
            <Menu.Item key="2">{record.certificateStatus ? '启用' : '停用'}</Menu.Item>
          </Menu>
        )
        return (
          <span>
            <a
              onClick={() => {
                dispatch({
                  type: 'myCertificate/updateState',
                  payload: {
                    modalTitle: record.platformAuthStatus === 2 ? '查看授权书' : '编辑授权书',
                  },
                })
                dispatch({
                  type: 'myCertificate/getAuthDetail',
                  payload: {
                    certificateId: record.certificateId,
                  },
                })
              }}
            >{record.platformAuthStatus === 2 ? '查看' : '编辑'}</a>
            {record.platformAuthStatus === 2 ?
              <span>
                <span className="ant-divider" />
                <Dropdown overlay={menu} trigger={['click']}>
                  <a>
                    更多<Icon type="down" />
                  </a>
                </Dropdown>
              </span>
              : ''}
          </span>
        )
      },
    },
  ]
  // 翻页
  const handleChange = (value) => {
    dispatch({
      type: 'myCertificate/authList',
      payload: {
        ...searchData,
        ...value,
      },
    })
  }
  const authCustomerProps = {
    data: allCustomerOptions,
    targetKeys: powerCustomerTargetKeys,
    handleTargetKeysChange(targetKeys) {
      dispatch({
        type: 'myCertificate/updateState',
        payload: {
          powerCustomerTargetKeys: targetKeys,
        },
      })
    },
    visible: powerCustomerVisible,
    loading: getLoading('getPowerCustomer', 'setsetAuthCustomerSub'),
    handleCancel() {
      dispatch({
        type: 'myCertificate/updateState',
        payload: {
          powerCustomerVisible: false,
          powerCustomerList: [],
          powerCustomerTargetKeys: [],
        },
      })
    },
    handleOk() {
      dispatch({
        type: 'myCertificate/setsetAuthCustomerSub',
        payload: {
          customerOrgIds: powerCustomerTargetKeys,
          certificateId: rowSelectData.certificateId,
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
        loading={!!effects['myCertificate/authList']}
        rowKey="certificateId"
      />
      <AuthCustomer {...authCustomerProps} />
    </div>
  )
}

Auth.propTypes = {
  effects: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  authDataSource: PropTypes.array.isRequired,
  pagination: PropTypes.object.isRequired,
  searchData: PropTypes.object.isRequired,
  tabIndex: PropTypes.string.isRequired,
  showConfirm: PropTypes.func.isRequired,
  powerCustomerVisible: PropTypes.bool.isRequired,
  allCustomerOptions: PropTypes.array.isRequired,
  powerCustomerTargetKeys: PropTypes.array.isRequired,
  rowSelectData: PropTypes.object.isRequired,
}

export default Auth
