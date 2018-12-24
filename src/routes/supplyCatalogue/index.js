import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Input, Table, Menu, Dropdown, Icon } from 'antd'
import { Link } from 'dva/router'
import Breadcrumb from '../../components/Breadcrumb'
import SearchForm from '../../components/SearchFormFilter'
import LkcTable from '../../components/LkcTable'


function SupplyCatalogue({ supplyCatalogue, effects, dispatch, routes, user }) {
  const { searchData, dataSource, pagination, LkcTableColumns = [] } = supplyCatalogue
  const searchformPorps = {
    components: [
      {
        field: 'keywords',
        component: <Input placeholder="客户名称" />,
        options: {
          initialValue: null,
        },
      },
    ],
    initialValues: searchData,
    onSearch: (value) => {
      dispatch({
        type: 'supplyCatalogue/getCustomerList',
        payload: {
          ...value,
          current: 1,
          pageSize: searchData.pageSize || 10,
        },
      })
    },
  }
  const columns = [
    {
      key: 'index',
      dataIndex: 'index',
      title: '序号',
      width: 50,
      className: 'aek-text-center',
      render: (value, record, index) => index + 1,
    },
    {
      key: 'customerOrgName',
      dataIndex: 'customerOrgName',
      title: '客户名称',
    },
    {
      key: 'inUseNumber',
      dataIndex: 'inUseNumber',
      title: '使用中',
    },
    {
      key: 'pendingReviewNumber',
      dataIndex: 'pendingReviewNumber',
      title: '待审核',
    },
    {
      key: 'refusedNumber',
      dataIndex: 'refusedNumber',
      title: '已拒绝',
    },
    {
      key: 'disabledNumber',
      dataIndex: 'disabledNumber',
      title: '已停用',
    },
    {
      key: 'operation',
      dataIndex: 'operation',
      title: '操作',
      width: 100,
      className: 'aek-text-center',
      render: (value, record) => (
        <Link to={`/supplyCatalogue/detail/${record.customerOrgId}`}>查看目录</Link>
      ),
    },
  ]
  const handleChange = (value) => {
    dispatch({
      type: 'supplyCatalogue/getCustomerList',
      payload: {
        ...searchData,
        ...value,
      },
    })
  }


  const arr = [{
    title: '姓名',
    key: 'name',
    dataIndex: 'name',
  }, {
    title: '性别',
    key: 'gender',
    dataIndex: 'gender',
  }, {
    key: 'operation',
    dataIndex: 'operatoin',
    headConfigFlag: true,
    render() {
      // 下拉按钮
      const menu = (
        <Menu>
          <Menu.Item key="1">维护包装</Menu.Item>
          <Menu.Item key="2">条码维护</Menu.Item>
          <Menu.Item key="3">绑定注册证</Menu.Item>
          <Menu.Item key="4">修改历史</Menu.Item>
        </Menu>
      )
      return (
        <Dropdown
          overlay={menu}
        >
          <a>
            <Icon type="ellipsis" />
          </a>
        </Dropdown>
      )
    },
  }]

  /**
   * @description JSON.stringify 将不会转换不具有 JSON 表示形式的值
   * JSON的值可以是：  数字（整数或浮点数）
   *                  字符串（在双引号中）
   *                  逻辑值（true 或 false）
   *                  数组（在方括号中）
   *                  对象（在花括号中）
   *                  null
   * 将localStorage中的值和本地的值做合并
   *
   */
  // const getTableColumns = () => {
  //   const retArr = []
  //   LkcTableColumns.forEach((items) => {
  //     const { dataIndex, key } = items
  //     arr.forEach((item) => {
  //       const storageKey = dataIndex || key
  //       const localKey = item.dataIndex || item.key
  //       if (storageKey === localKey) {
  //         const obj = {
  //           ...item,
  //           ...items,
  //         }
  //         retArr.push(obj)
  //       }
  //     })
  //   })
  //   return retArr
  // }

  // const LkcTableProps = {
  //   columns: LkcTableColumns.length ? getTableColumns() : arr,
  //   dataSource: [
  //     {
  //       name: '张三',
  //       gender: '男',
  //     },
  //   ],
  //   bordered: true,
  //   handleSave(data) {
  //     const obj = {
  //       config: {
  //         supplyCatalogue: data,
  //       },
  //     }
  //     localStorage.setItem(user.userId, JSON.stringify(obj))
  //     dispatch({
  //       type: 'supplyCatalogue/updateState',
  //       payload: {
  //         LkcTableColumns: data,
  //       },
  //     })
  //   },
  // }

  return (
    <div className="aek-layout">
      <div className="bread">
        <Breadcrumb routes={routes} />
      </div>
      <div className="content">
        <SearchForm {...searchformPorps} />
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={pagination}
          bordered
          onChange={handleChange}
          loading={!!effects['supplyCatalogue/getCustomerList']}
          rowKey="customerOrgId"
        />
        {/* <LkcTable {...LkcTableProps} /> */}
      </div>
    </div>
  )
}

SupplyCatalogue.propTypes = {
  supplyCatalogue: PropTypes.object,
  effects: PropTypes.object,
  dispatch: PropTypes.func,
  routes: PropTypes.array,
  children: PropTypes.element,
  user: PropTypes.object,
}

export default connect(({ supplyCatalogue, loading: { effects }, app: { user } }) => ({
  supplyCatalogue,
  effects,
  user,
}))(SupplyCatalogue)
