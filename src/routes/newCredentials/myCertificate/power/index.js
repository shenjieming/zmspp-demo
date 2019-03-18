import React from 'react'
import PropTypes from 'prop-types'
import { Table, Select, Input, Menu, Dropdown, Icon } from 'antd'
import SearchForm from '../../../../components/SearchFormFilter'
import { getOption } from '../../../../utils'
import { MATERIALS_CERTIFICATE_TYPE } from '../../../../utils/constant'

const noLabelLayout = {
  wrapperCol: { span: 22 },
}
const Option = Select.Option
function Power({
                 editFlag,
  effects,
  dispatch,
  powerDataSource,
  pagination,
  searchData,
  tabIndex,
  showConfirm,
}) {
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
        <Input placeholder="客户名称/业务员/手机号码" />
      ),
      options: {
        initialValue: null,
      },
    },
    ],
    onSearch: (value) => {
      dispatch({
        type: 'newMyCertificate/powerList',
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
      key: 'customerOrgName',
      dataIndex: 'customerOrgName',
      title: '客户名称',
    },
    {
      key: 'customerContactName',
      dataIndex: 'customerContactName',
      title: '业务员/手机号',
      render: (value, record) => (<span>{`${value}-${record.customerContactPhone}`}</span>),
    },
    {
      key: 'validDateEnd',
      dataIndex: 'validDateEnd',
      title: '有效期至',
      render: (value, record) => {
        let dom
        const replace = () => (<span>
          {record.replacedFlag ? <p className="aek-red">(已换证,<a onClick={() => {
            dispatch({
              type: 'newMyCertificate/updateState',
              payload: {
                modalTitle: '查看委托书',
              },
            })
            dispatch({
              type: 'newMyCertificate/getPowerDetail',
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
            type: 'newMyCertificate/updateState',
            payload: {
              modalTitle: '换证',
            },
          })
          switch (key) {
            case '1':
              dispatch({
                type: 'newMyCertificate/getPowerDetail',
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
                    type: 'newMyCertificate/setPowerStatus',
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
                dispatch({
                  type: 'newMyCertificate/updateState',
                  payload: {
                    modalTitle: '编辑委托书',
                  },
                })
                dispatch({
                  type: 'newMyCertificate/getPowerDetail',
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
    dispatch({
      type: 'newMyCertificate/powerList',
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
        dataSource={powerDataSource}
        pagination={pagination}
        bordered
        onChange={handleChange}
        loading={!!effects['newMyCertificate/powerList']}
        rowKey="certificateId"
      />
    </div>
  )
}

Power.propTypes = {
  effects: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  powerDataSource: PropTypes.array.isRequired,
  pagination: PropTypes.object.isRequired,
  searchData: PropTypes.object.isRequired,
  tabIndex: PropTypes.string.isRequired,
  showConfirm: PropTypes.func.isRequired,
}

export default Power
