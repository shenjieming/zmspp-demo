import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Input, Select, Table, Menu, Dropdown, Icon, Modal, Button } from 'antd'
import { Link } from 'dva/router'
import Bread from '../../../components/Breadcrumb'
import SearchFormFilter from '../../../components/SearchFormFilter'
import CustmTable from '../../../components/CustmTabelInfo'
import EditContact from './editContact'
import AddCustomer from './addCustomer'

const Option = Select.Option
const confirm = Modal.confirm

function MyCustomer({ myCustomer, effects, dispatch, routes, addressList }) {
  const {
    pagination,
    dataSource,
    searchData,
    editContactVisible,
    defaultContactObj,
    addCustomerVisible,
    addCustomerList,
    addCustSearchData,
    applyVisible,
    customerId,
    applyType,
    addCustomerDetail,
  } = myCustomer
  // 搜索条件
  const searchFormProps = {
    components: [
      {
        field: 'customerStatus',
        component: (
          <Select optionLabelProp="title">
            <Option value={null} title="状态：全部">
              全部
            </Option>
            <Option value={'1'} title="状态：正常">
              正常
            </Option>
            <Option value={'2'} title="状态：被解除">
              被解除
            </Option>
          </Select>
        ),
        options: {
          initialValue: null,
        },
      },
      {
        field: 'customerType',
        component: (
          <Select optionLabelProp="title">
            <Option value={null} title="客户类型：全部">
              全部
            </Option>
            <Option value={'1'} title="客户类型：直销客户">
              直销客户
            </Option>
            <Option value={'2'} title="客户类型：分销客户">
              分销客户
            </Option>
          </Select>
        ),
        options: {
          initialValue: null,
        },
      },
      {
        field: 'keywords',
        component: <Input placeholder="输入手机号、组织名称、联系人查询" />,
        options: {
          initialValue: null,
        },
      },
    ],
    initialValues: searchData,
    onSearch: (value) => {
      dispatch({
        type: 'myCustomer/getCustomerList',
        payload: {
          ...value,
          current: 1,
          pageSize: searchData.pageSize || 10,
        },
      })
    },
  }

  // 解除恢复关系
  function showConfirm(data) {
    const content = data.customerStatus === 1 ? '您确定要解除与该机构关系吗？' : '您确定要恢复与该机构关系吗？'
    const url =
      data.customerStatus === 1
        ? 'myCustomer/setRemoveRelation'
        : 'myCustomer/setRecoverRelationSync'
    let reqdata = {}
    if (data.custormerStatus === 1) {
      reqdata = {
        customerOrgId: data.customerOrgId,
      }
    } else {
      reqdata = {
        customerOrgId: data.customerOrgId,
        applyType: 0,
      }
    }
    confirm({
      content,
      onOk() {
        dispatch({
          type: url,
          payload: reqdata,
        })
      },
    })
  }
  // 列表
  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      className: 'aek-text-center',
      width: 30,
      render: (value, record, index) => index + 1,
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      render: (value, record) => {
        const data = {
          logoUrl: record.orgLogoUrl,
          orgName: record.customerOrgName,
          contactName: record.customerContactName,
          contactPhone: record.customerContactPhone,
          status: record.customerStatus,
          isShowContact: true,
          to: `/contacts/myCustomer/detail/${record.customerOrgId}?status=${record.customerStatus}`,
          contactEditClick() {
            dispatch({
              type: 'myCustomer/updateState',
              payload: {
                editContactVisible: true,
                defaultContactObj: record,
              },
            })
          },
        }
        return <CustmTable {...data} />
      },
    },
    {
      title: '关系建立日期',
      dataIndex: 'relationBuildDate',
      key: 'relationBuildDate',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (value, record) => {
        const menu = (
          <Menu>
            <Menu.Item>
              {record.customerStatus === 2 ? (
                <a
                  onClick={() => {
                    showConfirm(record)
                  }}
                >
                  恢复关系
                </a>
              ) : (
                <a
                  onClick={() => {
                    showConfirm(record)
                  }}
                >
                  解除关系
                </a>
              )}
            </Menu.Item>
          </Menu>
        )
        return (
          <span>
            <Link
              to={`/contacts/myCustomer/detail/${record.customerOrgId}?status=${record.customerStatus}`}
            >
              查看
            </Link>
            <span className="ant-divider" />
            <Dropdown overlay={menu}>
              <a className="ant-dropdown-link">
                更多<Icon type="down" />
              </a>
            </Dropdown>
          </span>
        )
      },
    },
  ]
  const onChange = (value) => {
    dispatch({
      type: 'myCustomer/getCustomerList',
      payload: {
        ...searchData,
        ...value,
      },
    })
  }
  // 编辑联系人
  const editProps = {
    editContactVisible,
    defaultContactObj,
    dispatch,
    effects,
  }
  const handleAddCustomer = () => {
    dispatch({
      type: 'myCustomer/getAddCustomerList',
    })
  }
  // 增加客户
  const addCustomerProps = {
    addCustomerVisible,
    dispatch,
    effects,
    addressList,
    addCustomerList,
    addCustSearchData,
    applyVisible,
    addCustomerDetail,
    customerId,
    applyType,
  }
  return (
    <div className="aek-layout">
      <div className="bread">
        <Bread style={{ float: 'left' }} routes={routes} />
        <div style={{ float: 'right' }}>
          <Button type="primary" icon="plus" onClick={handleAddCustomer}>
            添加客户
          </Button>
        </div>
      </div>
      <div className="content">
        <SearchFormFilter {...searchFormProps} />
        <Table
          columns={columns}
          dataSource={dataSource}
          onChange={onChange}
          pagination={pagination}
          bordered
          rowKey="customerId"
          loading={!!effects['myCustomer/getCustomerList']}
          rowClassName={() => 'table-row-hover'}
        />
      </div>
      <EditContact {...editProps} />
      <AddCustomer {...addCustomerProps} />
    </div>
  )
}

MyCustomer.propTypes = {
  myCustomer: PropTypes.object,
  effects: PropTypes.object,
  dispatch: PropTypes.func,
  routes: PropTypes.array,
  addressList: PropTypes.array,
  children: PropTypes.element,
}

export default connect(
  ({ myCustomer, loading: { effects }, app: { constants: { addressList } } }) => ({
    myCustomer,
    effects,
    addressList,
  }),
)(MyCustomer)
