import React from 'react'
import PropTypes from 'prop-types'
import { Table, Form, Input, Select, Icon, Button, message, Modal, Spin, TreeSelect } from 'antd'
import { Link } from 'dva/router'
import SearchFormFilter from '../../../components/SearchFormFilter'
import { FORM_ITEM_LAYOUT } from '../../../utils/constant'
import Styles from '../index.less'

const FormItem = Form.Item
const confirm = Modal.confirm

const Option = Select.Option
const RightContent = ({
  dataSource,
  dispatch,
  searchData,
  deptId,
  deptName,
  effects,
  pagination,
  deptDetail,
  editModalVisible,
  deptSelect,
  deptTreeList,
  form: {
    getFieldDecorator,
    validateFields,
    resetFields,
  },
}) => {
  // 编辑部门
  const editDept = () => {
    if (!deptId || deptId === '-1') {
      message.error('请先选择部门！', 3)
      return
    }
    dispatch({
      type: 'personAdmin/getDeptDetail',
      payload: { deptId },
    })
  }
  // 搜索
  const handleSearch = (values) => {
    dispatch({
      type: 'personAdmin/getPersonTableData',
      payload: { ...searchData, ...values, current: 1, pageSize: 10 },
    })
  }
  // 搜索
  const searchFormProps = {
    components: [{
      field: 'status',
      component: (
        <Select optionLabelProp="title">
          <Option value={null} title="账号状态：全部">全部</Option>
          <Option value="0" title="账号状态：启用">启用</Option>
          <Option value="1" title="账号状态：停用">停用</Option>
        </Select>
      ),
      options: {
        initialValue: null,
      },
    },
    {
      field: 'gender',
      component: (
        <Select optionLabelProp="title">
          <Option value={null} title="性别：全部">全部</Option>
          <Option value="1" title="性别：男">男</Option>
          <Option value="0" title="性别：女">女</Option>
          <Option value="2" title="性别：不详">不详</Option>
        </Select>
      ),
      options: {
        initialValue: null,
      },
    },
    {
      field: 'keywords',
      component: (
        <Input placeholder="用户名/手机号/真实姓名" />
      ),
    },
    ],
    onSearch: handleSearch,
    initialValues: searchData,
  }
  // 表格数据
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
      title: '用户名',
      dataIndex: 'userName',
      key: 'userName',
      render: (value, record) => {
        if (record.adminFlag) {
          return <span>{`【管】${value}`}</span>
        }
        return value
      },
    },
    {
      title: '真实姓名',
      dataIndex: 'realName',
      key: 'realName',
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      className: 'aek-text-center',
      width: 30,
      render: (value) => {
        if (value === 0) {
          return '女'
        } else if (value === 1) {
          return '男'
        }
        return '不详'
      },
    },
    {
      title: '联系手机',
      dataIndex: 'mobile',
      key: 'mobile',
    },
    {
      title: '部门',
      dataIndex: 'deptName',
      key: 'deptName',
    },
    {
      title: '创建时间',
      dataIndex: 'addTime',
      key: 'addTime',
    },
    {
      title: '账号状态',
      dataIndex: 'status',
      key: 'status',
      className: 'aek-text-center',
      width: 50,
      render: (value) => {
        if (!value) {
          return '启用'
        }
        return '停用'
      },
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      className: 'aek-text-center',
      width: 30,
      render: (value, record) => <Link to={`/personAdmin/detail/${record.userId}`}>查看</Link>,
    },
  ]

  // 翻页
  const onChange = (data) => {
    dispatch({
      type: 'personAdmin/getPersonTableData',
      payload: { ...searchData, ...data, deptId, deptName },
    })
  }
  // 确认修改部门信息、
  const handleEdit = () => {
    validateFields((errors, values) => {
      if (errors) {
        return
      }
      dispatch({
        type: 'personAdmin/putDept',
        payload: {
          ...deptDetail,
          ...values,
          deptParentId: values.dept.value,
          deptParentName: values.dept.label,
        },
      })
    })
  }
  // 删除确认框
  function showConfirm() {
    confirm({
      title: '确定删除本部门吗?',
      onOk() {
        dispatch({ type: 'personAdmin/delDept', payload: { deptId } })
      },
    })
  }
  // 编辑部门弹框数据
  const editModalProp = {
    title: '编辑部门',
    visible: editModalVisible,
    maskClosable: false,
    onCancel() {
      dispatch({ type: 'personAdmin/updateState', payload: { editModalVisible: false } })
    },
    afterClose() {
      resetFields()
    },
    footer: [
      <Button key="delate" style={{ float: 'left' }} onClick={() => { showConfirm() }}>删除</Button>,
      <Button key="cancel" onClick={() => { dispatch({ type: 'personAdmin/updateState', payload: { editModalVisible: false } }) }}>取消</Button>,
      <Button key="submit" type="primary" onClick={handleEdit}>确定</Button>,
    ],
  }
  // selectTree 上级菜单树
  const selectTreesProps = {
    treeDefaultExpandAll: true,
    treeData: deptSelect,
    labelInValue: true,
  }
  return (
    <div>
      <div className={Styles.bread}>
        <div className={Styles['aek-bread-left']}>{deptName}</div>
        <div className={Styles['aek-bread-right']}>
          <Button
            onClick={() => {
              if (deptTreeList && !deptTreeList[0].children.length && deptId === '-1') {
                message.error('请先维护部门！')
                return
              }
              dispatch({ type: 'personAdmin/updateState', payload: { addPersonModalVisible: true, personRegistFlag: false, registPerson: {} } })
            }}
            type="primary"
            icon="plus"
          > 新增人员</Button>
        </div>
      </div>
      <div>
        <SearchFormFilter key={deptId} {...searchFormProps} />
        <Table
          columns={columns}
          dataSource={dataSource}
          onChange={onChange}
          pagination={pagination}
          bordered
          rowKey="userId"
          loading={!!effects['personAdmin/getPersonTableData']}
          rowClassName={({ status }) => {
            if (status) {
              return 'aek-text-disable'
            }
          }}
        />
      </div>
      <Modal {...editModalProp} >
        <Spin spinning={!!effects['personAdmin/getDeptDetail']}>
          <Form>
            <FormItem {...FORM_ITEM_LAYOUT} label="上级部门">
              {getFieldDecorator('dept', {
                initialValue: { label: deptDetail.deptParentName, value: `${deptDetail.deptParentId}` },
                rules: [{
                  required: true,
                  message: '上级部门不能为空',
                }],
              })(
                <TreeSelect
                  {...selectTreesProps}
                />,
              )}
            </FormItem>
            <FormItem {...FORM_ITEM_LAYOUT} label="部门名称">
              {getFieldDecorator('deptName', {
                initialValue: deptDetail.deptName,
                rules: [{
                  required: true,
                  message: '部门名称不能为空',
                }],
              })(
                <Input maxLength="40" />,
              )}
            </FormItem>
          </Form>
        </Spin>
      </Modal>
    </div>
  )
}
RightContent.propTypes = {
  dataSource: PropTypes.array,
  dispatch: PropTypes.func,
  searchData: PropTypes.object,
  form: PropTypes.object.isRequired,
  effects: PropTypes.object,
  pagination: PropTypes.object,
  deptId: PropTypes.string,
  deptName: PropTypes.string,
  deptDetail: PropTypes.object,
  editModalVisible: PropTypes.bool,
  deptSelect: PropTypes.array,
  deptTreeList: PropTypes.array,
}
export default Form.create()(RightContent)
