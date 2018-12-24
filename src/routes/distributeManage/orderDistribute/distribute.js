import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { cloneDeep, set, debounce } from 'lodash'
import { Table, Button, Select } from 'antd'

import { getBasicFn } from '../../../utils'
import Breadcrumb from '../../../components/Breadcrumb'
import ConfirmModal from './confirmModal'
import DistributeSuccess from './distributeSuccess'
import LkcSelect from '../../../components/LkcSelect'

const propTypes = {
  loading: PropTypes.object,
  orderDistribute: PropTypes.object,
}
const namespace = 'orderDistribute'
const Option = Select.Option
class OrderDistribute extends React.Component {
  componentDidMount() {
    window.addEventListener('resize', this.onWindowResize)
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize)
  }
  onWindowResize = () => {
    this.dispatchNull()
  }
  dispatchNull = debounce(() => {
    const { dispatchAction } = getBasicFn({ namespace })
    dispatchAction({})
  }, 300)
  render() {
    const { loading, orderDistribute } = this.props
    const { dispatchAction, getLoading } = getBasicFn({ namespace, loading })
    const {
      detail,
      distributorList,
      checkedItems,
      distributeConfirmVisible,
      groupedData,
      successModalVisible,
      resultForm,
    } = orderDistribute
    const hideConfirm = () => {
      dispatchAction({ payload: { distributeConfirmVisible: false } })
    }
    const hideSuccess = () => {
      dispatchAction({ payload: { successModalVisible: false } })
    }
    const columns = [
      {
        title: '物资名称',
        width: 150,
        dataIndex: 'materialsName',
      },
      {
        title: '规格型号',
        width: 150,
        dataIndex: 'materialsSku',
      },
      {
        title: '厂家/注册证',
        dataIndex: 'certificateNo',
        width: 150,
        render: (value, record) => (
          <div>
            <div>{record.factoryName}</div>
            <div>{record.certificateNo}</div>
          </div>
        ),
      },
      {
        title: '待分发数量',
        dataIndex: 'purchaseQty',
        width: 150,
      },
      {
        title: '单价',
        dataIndex: 'distributorPrice',
        width: 150,
        className: 'aek-text-right',
        render: text => `￥${text}`,
      },
      {
        title: '配送商',
        dataIndex: 'distributorOrgId',
        width: 250,
        render: (text, row) => {
          if (detail.distributeType === 2) {
            return (
              <LkcSelect
                style={{ width: '100%' }}
                allowClear={false}
                modeType="select"
                url="/distribute/distributor/distribution-option-list"
                value={{
                  key: row.distributorOrgId,
                  label: row.distributorOrgName,
                }}
                transformPayload={() => ({
                  pscId: row.pscId,
                  customerOrgId: detail.customerOrgId,
                  purchasePrice: row.materialsPrice,
                })}
                optionConfig={{ idStr: 'distributorOrgId', nameStr: 'distributorOrgName' }}
                onSelect={(value, option) => {
                  dispatchAction({
                    type: 'distributorOrgSelect',
                    payload: {
                      pscId: row.pscId,
                      distributorOrgId: option.distributorOrgId,
                      distributorOrgName: option.distributorOrgName,
                      distributorPrice: option.distributorPrice,
                      contactName: option.contactName,
                      contactPhone: option.contactPhone,
                    },
                  })
                }}
              />
            )
          }
          return (
            <Select
              value={text}
              style={{ width: '100%', minWidth: '200px' }}
              al
              onSelect={(value, option) => {
                dispatchAction({
                  type: 'distributorOrgSelect',
                  payload: {
                    pscId: row.pscId,
                    distributorOrgId: value,
                    distributorOrgName: option.props.children,
                  },
                })
              }}
            >
              {distributorList.map(item => (
                <Option value={item.distributorOrgId} key={item.distributorOrgId}>
                  {item.distributorOrgName}
                </Option>
              ))}
            </Select>
          )
        },
      },
    ]
    // 批量操作相关
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        dispatchAction({
          payload: {
            checkedItems: selectedRows,
          },
        })
      },
      getCheckboxProps: record => ({
        disabled: record.status === 1,
      }),
    }
    // 确认分发配置
    const confirmParams = {
      visible: distributeConfirmVisible,
      dataList: groupedData,
      loading: getLoading('confirmDistribute'),
      hideHandler: hideConfirm,
      okHandler: (value) => {
        const savePayload = cloneDeep(groupedData)
        savePayload.every((item) => {
          let itemIds = []
          item.orderItems.every((psc) => {
            itemIds = itemIds.concat(psc.itemIds.split(','))
            return true
          })
          set(item, 'purchaseRemark', value[item.distributorOrgId])
          set(item, 'itemIds', itemIds.toString())
          return true
        })
        const params = {}
        params.formId = detail.formId
        params.distributeItems = savePayload
        dispatchAction({ type: 'confirmDistribute', payload: { ...params } })
      },
    }
    const successParams = {
      visible: successModalVisible,
      resultForm,
      hideHandler: hideSuccess,
      dataLength: detail.orderItems.length || 0,
    }
    return (
      <div className="aek-layout">
        <div className="bread">
          <Breadcrumb />
        </div>
        <div className="content">
          <Button
            type="primary"
            className="aek-mb10"
            disabled={checkedItems.length === 0}
            onClick={() => {
              dispatchAction({ type: 'groupUpData' })
              dispatchAction({ payload: { distributeConfirmVisible: true } })
            }}
          >
            确认分发
          </Button>
          <Table
            bordered
            rowKey="pscId"
            rowSelection={rowSelection}
            pagination={false}
            loading={getLoading('getMaterialsDetail', 'getDistributorList')}
            columns={columns}
            scroll={{ x: '100%', y: document.body.clientHeight - 240 }}
            dataSource={detail.orderItems}
          />
          <ConfirmModal {...confirmParams} />
          <DistributeSuccess {...successParams} />
        </div>
      </div>
    )
  }
}
OrderDistribute.propTypes = propTypes
export default connect(({ loading, orderDistribute }) => ({ loading, orderDistribute }))(
  OrderDistribute,
)
