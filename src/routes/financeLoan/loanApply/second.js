import React from 'react'
import PropTypes from 'prop-types'
import { Table, Input, Button, message, Select } from 'antd'
import { cloneDeep } from 'lodash'
import Decimal from 'decimal.js-light'
import { getBasicFn, formatNum } from '../../../utils/index'
import SearchForm from '../../../components/SearchFormFilter'
import Styles from './index.less'


const namespace = 'loanApply'
const Option = Select.Option
const propTypes = {
  loanApply: PropTypes.object,
  loading: PropTypes.object,
}
const Second = ({ loanApply, loading }) => {
  const {
    stepIndex,
    receivableOrderSelected,
    customerSelected,
    receivableOrderSearchdata,
    receivableOrderMoney,
    receivableOrderList,
    receivableOrderListPag,
  } = loanApply
  const { dispatchAction, getLoading } = getBasicFn({ namespace, loading })
  const columns = [{
    dataIndex: 'index',
    key: 'index',
    title: '序号',
    className: 'aek-text-center',
    width: 50,
    render(value, record, index) {
      return index + 1
    },
  }, {
    dataIndex: 'formNo',
    key: 'formNo',
    title: '入库单号',
  }, {
    dataIndex: 'stockInTime',
    key: 'stockInTime',
    title: '入库时间',
    className: 'aek-text-center',
  }, {
    dataIndex: 'formAmount',
    key: 'formAmount',
    title: '入库单金额（元）',
    className: 'aek-text-right',
  }, {
    dataIndex: 'balance',
    key: 'balance',
    title: '可贷金额（元）',
    className: 'aek-text-right',
  }, {
    dataIndex: 'formId',
    key: 'formId',
    title: '操作',
    className: 'aek-text-center',
    width: 60,
    render(value) {
      const review = () => {
        dispatchAction({
          type: 'getReceivableOrderDetail',
          payload: {
            current: 1,
            formId: value,
            pageSize: 10,
          },
        })
      }
      return (<a onClick={review}>详情</a>)
    },
  }]
  // 搜索条件
  const searchFormProps = {
    components: [{
      field: 'stockTimeRangeType',
      component: (
        <Select optionLabelProp="title">
          <Option value={null} title="入库时间：全部">
              全部
          </Option>
          <Option value={'1'} title="入库时间：近一个星期内">
            近一个星期内
          </Option>
          <Option value={'2'} title="入库时间：近一个月内">
            近一个月内
          </Option>
        </Select>
      ),
      options: {
        initialValue: null,
      },
    }, {
      field: 'keywords',
      component: (
        <Input placeholder="请输入入库单号" />
      ),
      options: {
        initialValue: null,
      },
    }],
    onSearch: (value) => {
      dispatchAction({
        type: 'getReceivableOrderList',
        payload: {
          customerOrgId: customerSelected[0],
          ...receivableOrderSearchdata,
          ...value,
        },
      })
    },
    initialValues: receivableOrderSearchdata,
  }

  const tableProps = {
    dataSource: receivableOrderList,
    bordered: true,
    columns,
    rowKey: 'formId',
    loading: getLoading('getReceivableOrderList'),
    pagination: receivableOrderListPag,
    rowSelection: {
      selectedRowKeys: receivableOrderSelected,
      onChange(selectedRowKeys) {
        dispatchAction({
          payload: {
            receivableOrderSelected: selectedRowKeys,
          },
        })
      },
      onSelect(record, selected) {
        let money = new Decimal(cloneDeep(receivableOrderMoney))
        if (selected) {
          money = money.add(record.balance)
        } else {
          money = money.sub(record.balance)
        }
        dispatchAction({
          payload: {
            receivableOrderMoney: formatNum(money, { unit: '' }),
          },
        })
      },
      onSelectAll(selected, selectedRows, changeRows) {
        let money = new Decimal(cloneDeep(receivableOrderMoney))
        if (selected) {
          selectedRows.map((item) => {
            money = money.add(item.balance)
          })
        } else {
          changeRows.map((item) => {
            money = money.sub(item.balance)
          })
        }
        dispatchAction({
          payload: {
            receivableOrderMoney: formatNum(money, { unit: '' }),
          },
        })
      },
    },
    onChange(pagination) {
      dispatchAction({
        type: 'getReceivableOrderList',
        payload: {
          ...receivableOrderSearchdata,
          ...pagination,
        },
      })
    },
  }
  // 上一步按钮
  const firstPrevClick = () => {
    dispatchAction({
      payload: {
        stepIndex: stepIndex - 1,
        customerSelected: [],
        receivableOrderSearchdata: {},
        receivableOrderSelected: [],
        receivableOrderMoney: 0,
      },
    })
    dispatchAction({
      type: 'getCustomerList',
    })
  }
  // 下一步按钮事件
  const secondNextClick = () => {
    if (!receivableOrderSelected || !receivableOrderSelected.length) {
      message.error('请选择入库单')
      return
    }
    dispatchAction({
      type: 'setSecondSubmit',
      payload: {
        formIds: receivableOrderSelected.join(','),
        loanAmount: receivableOrderMoney,
      },
    })
  }
  return (
    <div>
      <SearchForm
        {...searchFormProps}
      />
      <Table
        {...tableProps}
      />
      <div className="aek-mt30">
        <Button onClick={secondNextClick} className="aek-mr20" type="primary">下一步</Button>
        <Button onClick={firstPrevClick} >上一步</Button>
        <span className="aek-ml20">共选择<span className={`${Styles['aek-info']}`}>{receivableOrderSelected.length || 0}</span>笔订单，可贷金额<span className={`${Styles['aek-info']}`}>{receivableOrderMoney || 0}</span>元</span>
      </div>
    </div>
  )
}

Second.propTypes = propTypes
export default Second
