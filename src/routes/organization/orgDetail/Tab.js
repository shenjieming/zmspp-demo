import React from 'react'
import PropTypes from 'prop-types'
import qs from 'qs'
import { Table, Icon, Tabs, Select, Input } from 'antd'
import { Link } from 'dva/router'
import SearchForm from '../../../components/SearchFormFilter'
import BasicSetForm from './BasicSetForm'
import { CERTIFICATE_TYPE } from '../../../utils/constant'

const TabPane = Tabs.TabPane
const openNewPage = (id) => {
  window.open(`#/organization/detail/${id}`)
}
const Tab = ({
  personSearchParam,
  currentTab,
  orgIdSign,
  dispatchAction,
  accuracy,
  getLoading,
  currentOrgDetail,
  sonOrgList,
  orgSonPagination,
  orgPersonPagination,
  certificateList,
  personList,
  getPersonList,
  getSonOrgList,
  getCertificateList,
  addFileModel,
  tabOnChange,
  extraTabButton,
  editFileShow,
  fileLookShow,
  tagModalShow,
}) => {
  const tabChange = (e) => {
    tabOnChange(e)
    Number(e) === 1 && getSonOrgList()
    Number(e) === 2 && getPersonList()
    Number(e) === 3 && getCertificateList()
  }
  const components = [
    {
      field: 'status',
      component: (
        <Select optionLabelProp="title">
          <Select.Option value={null} title="账号状态：全部">
            全部
          </Select.Option>
          <Select.Option value="0" title="账号状态：已启用">
            已启用
          </Select.Option>
          <Select.Option value="1" title="账号状态：停用">
            停用
          </Select.Option>
        </Select>
      ),
      options: {
        initialValue: null,
      },
    },
    {
      field: 'keywords',
      component: <Input placeholder="用户名/手机号/真实姓名" />,
    },
  ]
  const searchVal = (data) => {
    // 搜索框函数
    dispatchAction({
      payload: { personSearchParam: data },
    })
    dispatchAction({
      type: 'getPersonList',
      payload: { ...orgPersonPagination, current: 1 },
    })
  }
  const onPageChangeSonOrg = (page) => {
    dispatchAction({
      type: 'getSonOrgList',
      payload: page,
    })
  }
  const onPageChangePerson = (page) => {
    dispatchAction({
      type: 'getPersonList',
      payload: page,
    })
  }
  const turnOther = (userId) => {
    dispatchAction({
      type: 'turnOther',
      payload: { targetOrgId: userId },
    })
  }
  const basicObj = { currentOrgDetail, dispatchAction, accuracy }
  const columns1 = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      width: 50,
      className: 'aek-text-center',
      render: (text, record, idx) => idx + 1,
    },
    {
      title: '机构名称',
      dataIndex: 'orgName',
      key: 'orgName',
    },
    {
      title: '机构类型',
      dataIndex: 'orgTypeText',
      key: 'orgTypeText',
    },
    {
      title: '联系负责人',
      dataIndex: 'principal',
      key: 'principal',
    },
    {
      title: '移动电话',
      dataIndex: 'mobile',
      key: 'mobile',
    },
    {
      title: '注册/创建时间',
      dataIndex: 'addTime',
      key: 'addTime',
    },
    {
      title: '机构状态',
      dataIndex: 'orgStatus',
      key: 'orgStatus',
      render: text => (text ? '已停用' : '启用中'),
    },
    {
      title: '操作',
      key: 'action',
      className: 'aek-text-center',
      width: 160,
      render: (text, { orgIdSign: orgId }) => <a onClick={() => openNewPage(orgId)}>查看</a>,
    },
  ]
  const columns2 = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      width: 50,
      className: 'aek-text-center',
      render: (text, record, idx) => idx + 1,
    },
    {
      title: '用户名',
      dataIndex: 'userName',
      key: 'userName',
      render: (text, { adminFlag }) => {
        if (adminFlag) {
          return (
            <span>
              <span style={{ fontWeight: 'bold' }}>【管】</span>
              {text}
            </span>
          )
        }
        return <span>{text}</span>
      },
      // render: (text, { adminFlag, userId }) => {
      //   if (adminFlag) {
      //     return (
      //       <a className="aek-link" onClick={() => turnOther(userId)}>
      //         <span style={{ fontWeight: 'bold' }}>【管】</span>
      //         {text}
      //       </a>
      //     )
      //   }
      //   return (
      //     <a className="aek-link" onClick={() => turnOther(userId)}>
      //       {text}
      //     </a>
      //   )
      // },
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
      render: (text) => {
        if (text && Number(text) === 0) {
          return '女'
        } else if (text && Number(text) === 1) {
          return '男'
        }
        return '不详'
      },
    },
    {
      title: '岗位标签',
      dataIndex: 'userTag',
      key: 'userTag',
    },
    {
      title: '联系手机号',
      dataIndex: 'mobile',
      key: 'mobile',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '出生日期',
      dataIndex: 'birthday',
      key: 'birthday',
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
      render: text => (text ? '已停用' : '启用中'),
    },
    {
      title: '操作',
      key: 'action',
      className: 'aek-text-center',
      width: 160,
      render: (text, record) => (
        <span>
          <Link
            to={`/organization/detail/${orgIdSign}/personDetail/${record.userId}${qs.stringify(
              { orgIdSign },
              { addQueryPrefix: true },
            )}`}
          >
            查看
          </Link>
          <span className="ant-divider" />
          <a onClick={() => tagModalShow(record)}>标签</a>
        </span>
      ),
    },
  ]
  const columns3 = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      width: 50,
      className: 'aek-text-center',
      render: (text, record, idx) => idx + 1,
    },
    {
      title: '证号',
      dataIndex: 'certificateCode',
      key: 'certificateCode',
    },
    {
      title: '证件类型',
      dataIndex: 'certificateType',
      key: 'certificateType',
      render: text => CERTIFICATE_TYPE[text],
    },
    {
      title: '有效期',
      dataIndex: 'eternalLife',
      key: 'eternalLife',
      render: (text, { startDate, endDate }) => {
        if (text) {
          return <span>{startDate}-长期</span>
        }
        return (
          <span>
            {startDate || ''}-{endDate || ''}
          </span>
        )
      },
    },
    {
      title: '操作',
      key: 'action',
      className: 'aek-text-center',
      width: 160,
      render: (text, record) => (
        <span>
          <a onClick={() => fileLookShow(record)}>查看</a>
          <span className="ant-divider" />
          <a onClick={() => editFileShow(record)}>编辑</a>
        </span>
      ),
    },
  ]
  return (
    <div>
      <Tabs
        onChange={tabChange}
        animated={false}
        // defaultActiveKey="1"
        activeKey={currentTab}
        tabBarExtraContent={
          extraTabButton && (
            <a onClick={addFileModel}>
              <Icon type="plus" />新增
            </a>
          )
        }
      >
        <TabPane tab="子机构" key="1">
          <Table
            bordered
            loading={getLoading('getSonOrgList')}
            columns={columns1}
            dataSource={sonOrgList}
            pagination={{
              ...orgSonPagination,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: total => `共 ${total} 条`,
            }}
            rowClassName={({ orgStatus }) => {
              if (orgStatus) {
                return 'aek-text-disable'
              }
              return ''
            }}
            onChange={onPageChangeSonOrg}
            rowKey="orgIdSign"
          />
        </TabPane>
        <TabPane tab="员工" key="2">
          <SearchForm
            initialValues={personSearchParam}
            components={components}
            onSearch={searchVal}
          />
          <Table
            bordered
            loading={getLoading('getPersonList')}
            columns={columns2}
            dataSource={personList}
            pagination={{
              ...orgPersonPagination,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: total => `共 ${total} 条`,
            }}
            rowClassName={({ status }) => {
              if (status) {
                return 'aek-text-disable'
              }
              return ''
            }}
            onChange={onPageChangePerson}
            rowKey="userId"
          />
        </TabPane>
        {currentOrgDetail.orgTypeCode !== '06' &&
          currentOrgDetail.orgTypeCode !== '05' && (
            <TabPane tab="企业三证" key="3">
              <Table
                bordered
                loading={getLoading(
                  'getCertificateList',
                  'addQualifications',
                  'editQualifications',
                )}
                columns={columns3}
                dataSource={certificateList}
                rowKey="certificateId"
                pagination={false}
              />
            </TabPane>
          )}
        <TabPane tab="基础设置" key="4">
          <BasicSetForm {...basicObj} />
        </TabPane>
      </Tabs>
    </div>
  )
}
Tab.propTypes = {
  personSearchParam: PropTypes.object,
  currentTab: PropTypes.string,
  orgIdSign: PropTypes.string,
  dispatchAction: PropTypes.func,
  accuracy: PropTypes.number,
  getLoading: PropTypes.func,
  currentOrgDetail: PropTypes.object,
  tagModalShow: PropTypes.func,
  fileLookShow: PropTypes.func,
  editFileShow: PropTypes.func,
  extraTabButton: PropTypes.bool,
  tabOnChange: PropTypes.func,
  addFileModel: PropTypes.func,
  getSonOrgList: PropTypes.func,
  getCertificateList: PropTypes.func,
  getPersonList: PropTypes.func,
  certificateList: PropTypes.array,
  organizeType: PropTypes.array,
  sonOrgList: PropTypes.array,
  personList: PropTypes.array,
  orgSonPagination: PropTypes.object,
  orgPersonPagination: PropTypes.object,
  form: PropTypes.object,
}
export default Tab
