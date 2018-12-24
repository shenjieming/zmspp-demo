import React from 'react'
import PropTypes from 'prop-types'
import { Table, Input, Button, message } from 'antd'
import { getBasicFn } from '../../../utils/index'
import SearchForm from '../../../components/SearchFormFilter'

const namespace = 'loanApply'
const propTypes = {
  loanApply: PropTypes.object,
  loading: PropTypes.object,
}
const First = ({ loanApply, loading }) => {
  const { stepIndex, customerSelected, customerList } = loanApply
  const { dispatchAction, getLoading } = getBasicFn({ namespace, loading })
  const columns = [{
    dataIndex: 'customerOrgName',
    key: 'customerOrgName',
    title: '医院名称',
  }]
  // 搜索条件
  const searchFormProps = {
    components: [{
      field: 'keywords',
      component: (
        <Input placeholder="请输入关键字" />
      ),
    }],
    onSearch: (value) => {
      dispatchAction({
        type: 'getCustomerList',
        payload: value,
      })
    },
  }
  const tableProps = {
    dataSource: customerList,
    bordered: true,
    columns,
    pagination: false,
    rowKey: 'customerOrgId',
    loading: getLoading('getCustomerList'),
    rowSelection: {
      type: 'radio',
      selectedRowKeys: customerSelected,
      hideDefaultSelections: true,
      onChange(selectedRowKeys) {
        dispatchAction({
          payload: {
            customerSelected: selectedRowKeys,
          },
        })
      },
    },
    scroll: {
      x: true,
      y: 390,
    },
    style: {
      minHeight: '390px',
    },
  }
  // 下一步按钮事件
  const firstNextClick = () => {
    if (!customerSelected || !customerSelected.length) {
      message.error('请选择医院')
      return
    }
    dispatchAction({
      payload: {
        stepIndex: stepIndex + 1,
      },
    })
    dispatchAction({
      type: 'getReceivableOrderList',
      payload: {
        current: 1,
        pageSize: 10,
        customerOrgId: customerSelected[0],
      },
    })
  }
  return (
    <div>
      <div style={{ display: 'none' }}>
        <SearchForm
          {...searchFormProps}
        />
      </div>
      <div>
        <Table
          {...tableProps}
        />
        <Button onClick={firstNextClick} className="aek-mt30" type="primary">下一步</Button>
      </div>
    </div>
  )
}

First.propTypes = propTypes
export default First
