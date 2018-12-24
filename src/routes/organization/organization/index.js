import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Button, Select, Input, Table } from 'antd'
import FormModel from './addOrg'
import ReviewModal from './checkOrg'
import AddAccount from './addAccount'
import Breadcrumb from '../../../components/Breadcrumb'
import SearchForm from '../../../components/SearchFormFilter'
import { getBasicFn, getOption } from '../../../utils'
import { columns } from './data'

const organizeType = [
  { label: '供应商', value: '03' },
  { label: '医疗机构', value: '02' },
  { label: '生产厂家', value: '04' },
  { label: '监管机构', value: '06' },
  { label: '供应商&生产厂家', value: '07' },
  { label: '银行', value: '05' },
]
const namespace = 'organization'
function IndexPage({ organization, dispatch, loading, app: { constants: { addressList } } }) {
  const { dispatchAction, getLoading } = getBasicFn({ namespace, loading })
  const {
    searchParam,
    backAccountObj,
    backAccountIdObj,
    accountExitFlag,
    addAccountVisible,
    auditDetailObj,
    reviewModalVisible,
    secondGradeList,
    parentGradeList,
    bankLevelList,
    parentOrgList,
    visible,
    hideItems,
    currentItemOrg,
    list,
    pagination,
  } = organization
  const renderOption = item => (
    <Select.Option {...item.props} title={`机构类型：${item.props.children}`}>
      {item.props.children}
    </Select.Option>
  )
  const components = [
    {
      field: 'orgTypeCode',
      component: (
        <Select optionLabelProp="title">
          <Select.Option value={null} title="机构类型：全部">
            全部
          </Select.Option>
          {getOption(organizeType).map(renderOption)}
        </Select>
      ),
      options: {
        initialValue: null,
      },
    },
    {
      field: 'auditStatus',
      component: (
        <Select optionLabelProp="title">
          <Select.Option value={null} title="审核状态：全部">
            全部
          </Select.Option>
          <Select.Option value="0" title="审核状态：待完善">
            待完善
          </Select.Option>
          <Select.Option value="1" title="审核状态：待审核">
            待审核
          </Select.Option>
          <Select.Option value="2" title="审核状态：已审核">
            已审核
          </Select.Option>
          <Select.Option value="3" title="审核状态：已拒绝">
            已拒绝
          </Select.Option>
        </Select>
      ),
      options: {
        initialValue: null,
      },
    },
    {
      field: 'orgStatus',
      component: (
        <Select optionLabelProp="title">
          <Select.Option value={null} title="机构状态：全部">
            全部
          </Select.Option>
          <Select.Option value="0" title="机构状态：启用中">
            启用中
          </Select.Option>
          <Select.Option value="1" title="机构状态：已停用">
            已停用
          </Select.Option>
        </Select>
      ),
      options: {
        initialValue: null,
      },
    },
    {
      field: 'keywords',
      width: '220px',
      component: <Input placeholder="输入名称、姓名、手机号" />,
      options: {
        initialValue: null,
      },
    },
  ]
  const searchVal = (data) => {
    // 搜索框函数
    dispatchAction({ payload: { searchParam: data } })
    dispatchAction({
      type: 'queryTableList',
      payload: { ...pagination, current: 1 },
    })
  }
  const onPageChange = (data) => {
    dispatchAction({
      type: 'queryTableList',
      payload: data,
    })
  }
  const columnParam = {
    onCheckOrg(e, orgId) {
      dispatchAction({
        type: 'getOrgAuditDetail',
        payload: {
          orgIdSign: orgId,
        },
      })
    },
    organizeType,
    turnOther(userId) {
      dispatchAction({
        type: 'turnOther',
        payload: { targetOrgId: userId },
      })
    },
  }

  let hideInputStatus = {
    sort1: false, // 供应商厂家
    sort2: false, // 医疗机构
    sort3: false, // 监管机构
    sort4: false, // 银行
  }
  const onChange = (e) => {
    switch (e) {
      // 供应商厂家
      case '03':
        hideInputStatus = {
          sort1: false,
          sort2: true,
          sort3: true,
          sort4: true,
        }
        break
      case '04':
        hideInputStatus = {
          sort1: false,
          sort2: true,
          sort3: true,
          sort4: true,
        }
        break
      case '07':
        hideInputStatus = {
          sort1: false,
          sort2: true,
          sort3: true,
          sort4: true,
        }
        break
      // 医疗机构
      case '02':
        hideInputStatus = {
          sort1: true,
          sort2: false,
          sort3: true,
          sort4: true,
        }
        break
      // 监管机构
      case '06':
        hideInputStatus = {
          sort1: true,
          sort2: true,
          sort3: false,
          sort4: true,
        }
        break
      // 银行
      case '05':
        hideInputStatus = {
          sort1: true,
          sort2: true,
          sort3: true,
          sort4: false,
        }
        break
      default:
        hideInputStatus = {
          sort1: false,
          sort2: false,
          sort3: false,
          sort4: false,
        }
        break
    }
    dispatchAction({ payload: { hideItems: hideInputStatus } })
  }
  const showModel = () => {
    dispatchAction({
      payload: {
        visible: true,
        hideItems: {
          sort1: false,
          sort2: false,
          sort3: false,
          sort4: false,
        },
      },
    })
    dispatchAction({
      type: 'queryParentOrgList',
      payload: {
        orgName: '',
      },
    })
    dispatchAction({
      type: 'firstLevel',
    })
    dispatchAction({
      type: 'secondLevel',
    })
    dispatchAction({
      type: 'bankLevel',
    })
  }
  const formParam = {
    dispatchAction,
    getLoading,
    secondGradeList,
    parentGradeList,
    bankLevelList,
    parentOrgList,
    onSearchOrg(e) {
      dispatchAction({
        type: 'queryParentOrgList',
        payload: {
          orgName: e,
        },
      })
    },
    saveAddOrg(data) {
      const { accountFlag } = data
      if (!accountFlag) {
        dispatchAction({
          type: 'saveAddOrg',
          payload: data,
        })
      } else {
        dispatchAction({
          type: 'saveAddAccount',
          payload: data,
        })
      }
    },
    currentItemOrg,
    onWorkAddressChange(val, selectedOptions) {
      const adressArray = [...val]
      for (const item of selectedOptions) {
        adressArray.push(item.label)
      }
      dispatchAction({
        payload: {
          workAddressChanged: true,
          workAddressVal: adressArray.join(),
        },
      })
    },
    onRegisterAddressChange(val, selectedOptions) {
      const adressArray = [...val]
      for (const item of selectedOptions) {
        adressArray.push(item.label)
      }
      dispatchAction({
        payload: {
          registerAddressChanged: true,
          registerAddressVal: adressArray.join(),
        },
      })
    },
    dispatch,
    hideItems,
    onChange,
    addressList,
    visible,
    organizeType,
    onCancel() {
      dispatchAction({
        payload: {
          visible: false,
          // hideItems: {
          //   sort1: false,
          //   sort2: false,
          //   sort3: false,
          // },
        },
      })
    },
  }
  const reviewModalParam = {
    getLoading,
    auditDetailObj,
    onRefuse(data) {
      dispatchAction({
        type: 'refuseOrg',
        payload: data,
      })
    },
    onPassOrg(data) {
      dispatchAction({
        type: 'passOrg',
        payload: data,
      })
    },
    reviewModalVisible,
    onCancel() {
      dispatchAction({
        payload: {
          reviewModalVisible: false,
        },
      })
    },
  }
  const addAccountModalParam = {
    backAccountObj,
    backAccountIdObj,
    accountExitFlag,
    addAccountVisible,
    dispatchAction,
    getLoading,
  }
  return (
    <div className="aek-layout">
      <div className="bread">
        <Breadcrumb />
        <div style={{ float: 'right' }}>
          <Button icon="plus" type="primary" onClick={showModel}>
            新建机构
          </Button>
        </div>
      </div>
      <div className="content">
        <SearchForm initialValues={searchParam} components={components} onSearch={searchVal} />
        <Table
          bordered
          columns={columns(columnParam)}
          dataSource={list}
          loading={getLoading('queryTableList', 'saveAddOrg', 'saveAddAccount')}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: total => `共 ${total} 条`,
          }}
          onChange={onPageChange}
          rowKey="orgIdSign"
        />
      </div>
      <FormModel {...formParam} />
      <ReviewModal {...reviewModalParam} />
      <AddAccount {...addAccountModalParam} />
    </div>
  )
}
IndexPage.propTypes = {
  routes: PropTypes.array,
  loading: PropTypes.object,
  app: PropTypes.object,
  organization: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ organization, app, loading }) => ({ organization, app, loading }))(
  IndexPage,
)
