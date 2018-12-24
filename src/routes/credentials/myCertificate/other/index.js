import React from 'react'
import PropTypes from 'prop-types'
import { Table, Select, Input, Menu, Dropdown, Icon } from 'antd'
import SearchForm from '../../../../components/SearchFormFilter'
import { getOption } from '../../../../utils'

const noLabelLayout = {
  wrapperCol: { span: 22 },
}
function Other({
  effects,
  dispatch,
  otherDataSource,
  pagination,
  searchData,
  tabIndex,
  otherCustOptions,
  showConfirm,
  otherOptionsSearch,
}) {
  const searchProps = {
    formData: [{
      layout: noLabelLayout,
      field: 'certificateType',
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
            id: '6',
            name: '服务承诺书',
          }, {
            id: '7',
            name: '廉政协议书',
          }], { prefix: '类型 ' }),
        },
      },
    }, {
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
    }, {
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
    }, {
      layout: noLabelLayout,
      field: 'customerOrgId',
      width: 220,
      component: {
        name: 'Select',
        props: {
          placeholder: '请输入客户名称',
          showSearch: true,
          defaultActiveFirstOption: false,
          filterOption: false,
          notFoundContent: '',
          allowClear: true,
          labelInValue: true,
          onSearch: otherOptionsSearch,
          children: getOption(otherCustOptions, { idStr: 'customerOrgId', nameStr: 'customerOrgName', prefix: '客户 ' }),
        },
      },
    }],
    onSearch: (value) => {
      dispatch({
        type: 'myCertificate/otherList',
        payload: {
          ...value,
          customerOrgId: value.customerOrgId ? value.customerOrgId.key : null,
          current: 1,
          pageSize: 10,
        },
      })
    },
  }
  const columns = [
    {
      key: 'customerOrgName',
      dataIndex: 'customerOrgName',
      title: '客户名称',
    },
    {
      key: 'certificateType',
      dataIndex: 'certificateType',
      title: '证件类型',
      render: value => (<span>{value === 6 ? '服务承诺书' : '廉政协议书'}</span>),
    },
    {
      key: 'validDateEnd',
      dataIndex: 'validDateEnd',
      title: '有效期至',
      render: (value, record) => {
        let dom
        const replace = () => (<span>
          {record.replacedPlatformAuthStatus === 2 ? <p className="aek-red">(已换证,<a onClick={() => {
            const type = record.certificateType === 6 ? '服务承诺书' : '廉政协议书'
            dispatch({
              type: 'myCertificate/updateState',
              payload: {
                modalTitle: `查看${type}`,
              },
            })
            dispatch({
              type: 'myCertificate/getOtherDetail',
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
            dom = <span className="aek-text-disable">{`${record.validDateStart}至${record.validDateEnd}`}<span className="aek-red">（已过期）</span></span>
          } else {
            dom = <span >{`${record.validDateStart}至${record.validDateEnd}`}</span>
          }
        }
        return (<span>
          {dom}
          <span>{replace()}</span>
        </span>)
      },
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
            },
          })
          switch (key) {
            case '1':
              dispatch({
                type: 'myCertificate/getOtherDetail',
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
                    type: 'myCertificate/setOtherStatus',
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
                const type = record.certificateType === 6 ? '服务承诺书' : '廉政协议书'
                dispatch({
                  type: 'myCertificate/updateState',
                  payload: {
                    modalTitle: record.platformAuthStatus === 2 ? `查看${type}` : `编辑${type}`,
                  },
                })
                dispatch({
                  type: 'myCertificate/getOtherDetail',
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
      type: 'myCertificate/otherList',
      payload: {
        ...searchData,
        ...value,
      },
    })
  }
  return (
    <div key={tabIndex}>
      <SearchForm {...searchProps} />
      <Table
        columns={columns}
        dataSource={otherDataSource}
        pagination={pagination}
        bordered
        onChange={handleChange}
        loading={!!effects['myCertificate/otherList']}
        rowKey="certificateId"
      />
    </div>
  )
}

Other.propTypes = {
  effects: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  otherDataSource: PropTypes.array.isRequired,
  pagination: PropTypes.object.isRequired,
  searchData: PropTypes.object.isRequired,
  tabIndex: PropTypes.string.isRequired,
  showConfirm: PropTypes.func.isRequired,
  otherCustOptions: PropTypes.array.isRequired,
  otherOptionsSearch: PropTypes.func.isRequired,
}

export default Other
