import React from 'react'
import PropTypes from 'prop-types'
import { Table, Select, Input, Menu, Dropdown, Icon } from 'antd'
import SearchForm from '../../../../components/SearchFormFilter'
import { getOption } from '../../../../utils'

const noLabelLayout = {
  wrapperCol: { span: 22 },
}
const Option = Select.Option
function ProdFactory({
  effects,
  dispatch,
  factoryDataSource,
  pagination,
  searchData,
  tabIndex,
  showConfirm,
}) {
  const searchProps = {
    formData: [
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
            }], { prefix: '状态' }),
          },
        },
      },
      {
        layout: noLabelLayout,
        field: 'importedFlag',
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
              name: '国内',
            }, {
              id: '1',
              name: '进口',
            }], { prefix: '厂家类型' }),
          },
        },
      },
      {
        width: 220,
        layout: noLabelLayout,
        field: 'keywords',
        component: (
          <Input placeholder="生产厂家/总经销商" />
        ),
        options: {
          initialValue: null,
        },
      },
    ],
    onSearch: (value) => {
      dispatch({
        type: 'myCertificate/prodFactoryList',
        payload: {
          ...value,
          current: 1,
          pageSize: 10,
        },
      })
    },
  }
  // 表格
  const columns = [
    {
      key: 'produceFactoryName',
      dataIndex: 'produceFactoryName',
      title: '生产厂家/总经销商',
      render: (value, record) => (<span>
        <p>{value}</p>
        {record.importedFlag ? `总代：${record.agentSupplierName}` : ''}
      </span>),
    },
    {
      key: 'importedFlag',
      dataIndex: 'importedFlag',
      title: '厂家类型',
      className: 'aek-text-center',
      render: (value) => {
        if (value) {
          return '进口'
        }
        return '国内'
      },
    },
    {
      key: 'maintainStatus',
      dataIndex: 'maintainStatus',
      title: '维护状态',
      className: 'aek-text-center',
      render: (value) => {
        if (value === 1) {
          return '已维护'
        }
        return <span className="aek-red">未维护</span>
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
        // 下拉按钮点击事件 TODO
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
                type: 'myCertificate/getprodFactoryDetai',
                payload: {
                  factoryAgentCertificateId: record.factoryAgentCertificateId,
                  replacedFlag: true,
                },
              })
              break
            default:
              showConfirm({
                content: record.certificateStatus ? '确定要启用该证件吗？' : '确定要停用该证件吗？',
                handleOk() {
                  dispatch({
                    type: 'myCertificate/setProdFactoryStatus',
                    payload: {
                      factoryAgentCertificateId: record.factoryAgentCertificateId,
                      certificateStatus: !record.certificateStatus,
                    },
                  })
                },
              })
              break
          }
          dispatch({
            type: 'myCertificate/updateState',
            payload: {
              rowSelectData: record,
            },
          })
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
                    modalTitle: record.platformAuthStatus === 2 ? '查看厂家/总代证件' : '编辑厂家/总代证件',
                    rowSelectData: record,
                  },
                })
                dispatch({
                  type: 'myCertificate/getprodFactoryDetai',
                  payload: {
                    factoryAgentCertificateId: record.factoryAgentCertificateId,
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
      type: 'myCertificate/prodFactoryList',
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
        dataSource={factoryDataSource}
        pagination={pagination}
        bordered
        onChange={handleChange}
        loading={!!effects['myCertificate/prodFactoryList']}
        rowKey={record => record.factoryAgentCertificateId || record.certificateId}
      />
    </div>
  )
}

ProdFactory.propTypes = {
  effects: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  factoryDataSource: PropTypes.array.isRequired,
  pagination: PropTypes.object.isRequired,
  searchData: PropTypes.object.isRequired,
  tabIndex: PropTypes.string.isRequired,
  showConfirm: PropTypes.func.isRequired,
}

export default ProdFactory
