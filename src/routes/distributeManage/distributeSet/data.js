import React from 'react'
import { Button, Avatar, Switch } from 'antd'
import { Link } from 'dva/router'
import style from './style.less'
import { IMG_COMPRESS } from '../../../utils/config'
import Logo from '../../../assets/lkc-org-logo.png'

const searchLeft = [
  {
    field: 'keywords',
    component: {
      name: 'Input',
      props: {
        placeholder: '请输入客户名称',
      },
    },
  },
]
const searchRight = [
  {
    field: 'keywords',
    component: {
      name: 'Input',
      props: {
        placeholder: '请输入配送商名称',
      },
    },
  },
]

const getLeftColumns = ({
  deleteCustomer,
  customerClick,
  distributeFlagChange,
  distributeModeChange,
}) => [
  {
    title: '医院名称',
    dataIndex: 'customerOrgName',
    render(customerOrgName, row) {
      const { distributorOrgQty } = row
      return (
        <span
          style={{ display: 'inline-block', width: '100%' }}
          onClick={() => {
            customerClick(row)
          }}
        >
          <span>{customerOrgName}</span>
          <span className="aek-orange">
            {distributorOrgQty ? `（已拥有${distributorOrgQty}个配送商）` : null}
          </span>
        </span>
      )
    },
  },
  {
    title: '分发开关',
    key: 'distributeSwitch',
    width: 100,
    className: 'aek-text-center',
    render(_, row) {
      return (
        <Switch
          checkedChildren="开"
          unCheckedChildren="关"
          checked={row.useDistributeFlag}
          onChange={checked => distributeFlagChange(row, checked)}
        />
      )
    },
  },
  {
    title: '分发模式',
    key: 'distributeMode',
    width: 100,
    className: 'aek-text-center',
    render(_, row) {
      return (
        <Switch
          checkedChildren="代配"
          unCheckedChildren="分销"
          disabled={!row.useDistributeFlag}
          checked={row.distributeType === 1}
          onChange={(checked) => {
            distributeModeChange(row, checked)
          }}
        />
      )
    },
  },
  {
    title: '操作',
    dataIndex: 'customerOrgId',
    width: 50,
    render(customerOrgId) {
      return (
        <a
          onClick={(e) => {
            deleteCustomer(e, customerOrgId)
          }}
        >
          移除
        </a>
      )
    },
  },
]

const getRightColumns = ({ distributeMode, autoDistribute, delDistributor, customerOrgId }) =>
  [
    {
      dataIndex: 'distributorOrgName',
    },
    {
      dataIndex: 'autoDistributeFlag',
      width: 100,
      exclude: distributeMode === 2,
      render(autoDistributeFlag, { distributorOrgId }) {
        return (
          <Switch
            defaultChecked={autoDistributeFlag}
            checkedChildren="自动分发"
            unCheckedChildren="手动分发"
            onChange={(checked) => {
              autoDistribute({
                autoDistributeFlag: checked,
                distributorOrgId,
              })
            }}
          />
        )
      },
    },
    {
      dataIndex: 'Link',
      width: 90,
      render(_, { distributorOrgId }) {
        return (
          <Link to={`distributeSet/safeguard/${customerOrgId}+${distributorOrgId}`}>
            配送目录维护
          </Link>
        )
      },
    },
    {
      dataIndex: 'distributorOrgId',
      width: 50,
      render(distributorOrgId) {
        return (
          <a
            onClick={() => {
              delDistributor(distributorOrgId)
            }}
          >
            移除
          </a>
        )
      },
    },
  ].filter(item => !item.exclude)

const getModalColumns = add => [
  {
    dataIndex: 'orgName',
    render(orgName, { orgLogoUrl }) {
      return (
        <div className={style.modal}>
          <div>
            <Avatar src={orgLogoUrl ? `${orgLogoUrl}` : Logo} />
          </div>
          <div>{orgName}</div>
        </div>
      )
    },
  },
  {
    dataIndex: 'unAddedFlag',
    width: 80,
    className: 'aek-text-center',
    render(unAddedFlag, { orgId }) {
      if (unAddedFlag) {
        return (
          <Button
            onClick={() => {
              add(orgId)
            }}
            type="primary"
          >
            添加
          </Button>
        )
      }
      return <span className="aek-text-help">已添加</span>
    },
  },
]

export default {
  searchLeft,
  searchRight,
  getLeftColumns,
  getRightColumns,
  getModalColumns,
}
