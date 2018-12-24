import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'dva/router'
import { cloneDeep } from 'lodash'
import { Modal, Table, Icon, Button } from 'antd'

import { formatNum } from '../../../utils'

import style from './style.less'

const propTypes = {
  visible: PropTypes.bool,
  dataLength: PropTypes.number,
  hideHandler: PropTypes.func,
  resultForm: PropTypes.array,
}

const DistributeSuccess = ({ visible, resultForm, dataLength, hideHandler }) => {
  const dataSource = cloneDeep(resultForm)
  const totalUnit = {
    formAmount: 0,
    formId: 'total',
    formNo: '合计',
    formQty: 0,
    supplierOrgId: -1,
    supplierOrgName: '-',
  }
  dataSource.every((item) => {
    totalUnit.formAmount += Number(item.formAmount)
    totalUnit.formQty += Number(item.formQty)
    return true
  })
  totalUnit.formAmount = formatNum(totalUnit.formAmount, { unit: '' })
  dataSource.push(totalUnit)
  const tableProps = {
    pagination: false,
    dataSource: dataSource || [],
    rowKey: 'formId',
    bordered: true,
    rowClassName: (record) => {
      if (record.formId === 'total') {
        return 'aek-primary-color'
      }
      return ''
    },
    columns: [
      {
        title: '订单编号',
        className: 'aek-text-center',
        dataIndex: 'formNo',
      },
      {
        title: '配送商',
        className: 'aek-text-center',
        dataIndex: 'supplierOrgName',
      },
      {
        title: '数量',
        className: 'aek-text-center',
        dataIndex: 'formQty',
      },
      {
        title: '金额',
        className: 'aek-text-right',
        dataIndex: 'formAmount',
        render: value => `￥${value}`,
      },
    ],
    size: 'small',
  }
  const modalOpts = {
    visible,
    closable: false,
    maskClosable: false,
    title: null,
    footer: null,
    width: 800,
    wrapClassName: 'aek-modal',
  }
  return (
    <Modal {...modalOpts}>
      <div className={style.modalInfo}>
        <Icon className="aek-blue" type="check-circle" />
        <p>订单提交成功</p>
        <p className="aek-text-help">稍后供应商会收到短信提醒</p>
      </div>
      <div className={style.modalTable}>
        <p className="aek-text-help">根据您的采购物资，本次生成如下订单：</p>
        <Table {...tableProps} />
      </div>
      <div className={style.modalButton}>
        <Link to="/purchaseManage/purchaseOrder">
          <Button type="primary">前往订单列表</Button>
        </Link>
        {dataLength ? (
          <Button onClick={hideHandler}>关闭</Button>
        ) : (
          <Link to="/distributeManage/orderDistribute">
            <Button>关闭</Button>
          </Link>
        )}
      </div>
    </Modal>
  )
}

DistributeSuccess.propTypes = propTypes

export default DistributeSuccess
