import React from 'react'
import PropTypes from 'prop-types'
import { Button, Table, Modal, Checkbox } from 'antd'
import style from './style.less'
import { aekConnect, getPagination, getCurrent } from '../../../utils'
import { SearchFormFilter, ContentLayout } from '../../../components'
import { searchLeft, searchRight, getLeftColumns, getRightColumns } from './data'
import ModalAdd from './ModalAdd'

const propTypes = {
  toAction: PropTypes.func,
  getLoading: PropTypes.func,
  distributeSet: PropTypes.object,
}

function DistributeSet({
  toAction,
  getLoading,
  distributeSet: {
    leftTableData,
    searchKeysLeft,
    pageConfigLeft,
    selectedCustomerId,
    selectedCustomerName,
    selectedDistributeMode,
    form,
    modalVisible,
    modalType,
    modalTableData,
    rightTableData,
    searchKeysRight,
  },
}) {
  const modalAddProps = {
    modalVisible,
    modalType,
    customerName: selectedCustomerName,
    modalTableData,
    loading: getLoading('getModalList'),
    onCancel() {
      toAction({ modalVisible: false })
    },
    afterClose() {
      toAction({ modalTableData: [] })
    },
    onSearch(keywords) {
      toAction({ keywords }, 'getModalList')
    },
    addForModal(orgId) {
      toAction(
        {
          [modalType === 'left' ? 'customerOrgId' : 'distributorOrgId']: orgId,
        },
        'addForModal',
      )
    },
  }
  const deleteCustomer = (e, customerOrgId) => {
    e.stopPropagation()
    Modal.confirm({
      title: '操作提醒',
      content: '您确定要移除该客户？',
      onOk() {
        toAction({ customerOrgId }, 'delCustomer').then(() => {
          toAction(
            {
              ...searchKeysLeft,
              current: getCurrent(pageConfigLeft),
            },
            'pageList',
          )
          if (customerOrgId === selectedCustomerId) {
            toAction({
              selectedCustomerId: null,
              selectedCustomerName: '',
              rightTableData: [],
            })
            if (form.resetFields) {
              form.resetFields()
            }
          }
        })
      },
    })
  }
  const customerClick = ({ customerOrgId, customerOrgName, distributeType }) => {
    toAction({
      selectedCustomerId: customerOrgId,
      selectedCustomerName: customerOrgName,
      selectedDistributeMode: distributeType,
    })
    toAction(
      {
        customerOrgId,
      },
      'distributorList',
    )
    if (form.resetFields) {
      form.resetFields()
    }
  }
  const distributeFlagChange = (row, checked) => {
    toAction(
      {
        customerOrgId: row.customerOrgId,
        useDistributeFlag: checked,
      },
      'setDistributeFlag',
    )
  }
  const distributeModeChange = (row, checked) => {
    Modal.confirm({
      title: '请注意：',
      maskClosable: false,
      content: checked ? (
        <span>
          代配模式下每个配送商只能配送一个耗材，并且支持自动分发和手动分发两种模式，切换后系统会请空当前分
          销客户下的所有配送目录设置。如果您确定要切换为“代配模式”，请勾选下方“切换为代配模式”，并单击确定”
          <Checkbox
            onChange={(e) => {
              toAction({ modalChecked: e.target.checked })
            }}
          >
            切换为代配模式
          </Checkbox>
        </span>
      ) : (
        <span>
          分销模式允许设置每个配送商的配送价格，并且一个耗材可设置多个配送商进行配送，切换为分销模式后将不
          支持代配模式的自动分发功能，只能在接收到客户订单以后进行手工分发，同时系统也会清空当前分销客户下
          的配送目录配置。如果您确定要切换为“分销模式”，请勾选下方“切换为分销模式”，并单击确定
          <Checkbox
            onChange={(e) => {
              toAction({ modalChecked: e.target.checked })
            }}
          >
            切换为分销模式
          </Checkbox>
        </span>
      ),
      onOk: () => {
        toAction(
          {
            customerOrgId: row.customerOrgId,
            distributeType: checked ? 1 : 2,
          },
          'setDistributeMode',
        )
        toAction({ modalChecked: false })
      },
      onCancel: () => {
        toAction({ modalChecked: false })
      },
    })
  }
  const leftTableProps = {
    className: style.tableLeft,
    loading: getLoading('pageList'),
    dataSource: leftTableData || [],
    pagination: getPagination(pageConfigLeft, (current, pageSize) => {
      toAction(
        {
          ...searchKeysLeft,
          current,
          pageSize,
        },
        'pageList',
      )
    }),
    rowKey: 'customerOrgId',
    columns: getLeftColumns({
      deleteCustomer,
      customerClick,
      distributeFlagChange,
      distributeModeChange,
    }),
    rowClassName({ customerOrgId }) {
      if (customerOrgId === selectedCustomerId) {
        return 'aek-tr-selected'
      }
      return undefined
    },
  }
  const rightTableProps = {
    showHeader: false,
    pagination: false,
    loading: getLoading('distributorList'),
    dataSource: rightTableData || [],
    rowKey: 'distributorOrgId',
    columns: getRightColumns({
      customerOrgId: selectedCustomerId,
      distributeMode: selectedDistributeMode,
      autoDistribute(infoObj) {
        toAction(
          {
            ...infoObj,
            customerOrgId: selectedCustomerId,
          },
          'distributorState',
        )
      },
      delDistributor(distributorOrgId) {
        Modal.confirm({
          title: '操作提醒',
          content: '您确定要移除该配送商？',
          onOk() {
            toAction(
              {
                customerOrgId: selectedCustomerId,
                distributorOrgId,
              },
              'delDistributor',
            )
          },
        })
      },
    }),
  }
  const contentLayoutProps = {
    breadLeft: [{ name: 'Breadcrumb' }],
    otherContent: (
      <div className={`full-content ${style.content}`}>
        <div className="aek-shadow">
          <div className="aek-content-title">
            <div className="aek-title-left">需要分销配送的客户</div>
          </div>
          <div className={style.search}>
            <SearchFormFilter
              formData={searchLeft}
              loading={getLoading('pageList')}
              initialValues={searchKeysLeft}
              onSearch={(value) => {
                toAction(
                  {
                    current: 1,
                    pageSize: 10,
                    ...value,
                  },
                  'pageList',
                )
              }}
            />
            <Button
              type="primary"
              size="large"
              onClick={() => {
                toAction({
                  modalVisible: true,
                  modalType: 'left',
                })
                toAction('getModalList')
              }}
            >
              添加分销单位
            </Button>
          </div>
          <div className={style.table}>
            <Table {...leftTableProps} />
          </div>
        </div>
        <div>
          <div className="aek-content-title">
            <div className="aek-title-left">
              {selectedCustomerName ? `${selectedCustomerName}拥有的配送商` : '配送商'}
            </div>
          </div>
          <div className={style.search}>
            <SearchFormFilter
              getPropsForm={(formObj) => {
                toAction({ form: formObj })
              }}
              initialValues={searchKeysRight}
              buttonDisabled={!selectedCustomerId}
              formData={searchRight}
              loading={getLoading('distributorList')}
              onSearch={(value) => {
                toAction(
                  {
                    ...searchKeysRight,
                    ...value,
                  },
                  'distributorList',
                )
              }}
            />
            <Button
              type="primary"
              size="large"
              disabled={!selectedCustomerId}
              onClick={() => {
                toAction({
                  modalVisible: true,
                  modalType: 'right',
                })
                toAction('getModalList')
              }}
            >
              添加配送商
            </Button>
          </div>
          <div className={style.table}>
            <Table {...rightTableProps} />
          </div>
        </div>
        <ModalAdd {...modalAddProps} />
      </div>
    ),
  }
  return <ContentLayout {...contentLayoutProps} />
}

DistributeSet.propTypes = propTypes
export default aekConnect()(DistributeSet)
