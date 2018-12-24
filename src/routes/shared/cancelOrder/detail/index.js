import React from 'react'
import PropTypes from 'prop-types'
import { Table, Spin, Button, Collapse, Icon } from 'antd'

import Breadcrumb from '../../../../components/Breadcrumb'
import APanel from '../../../../components/APanel'
import PlainForm from '../../../../components/PlainForm'
import { getBasicFn } from '../../../../utils'
import { MANAGE_MODEL, CANCEL_STATUS } from '../../../../utils/constant'

import { returnItemColumns, operationItemColumns } from './props'
import styles from './index.less'
import CancelPrint from '../print/index'

const Panel = Collapse.Panel
const CancelDetailData = ({ namespace, cancelDetailBean, loading }) => {
  const { dispatchAction, getLoading } = getBasicFn({ namespace, loading })
  const { orderBean, printVisible, collapseStatus } = cancelDetailBean
  const { baseInfo, intranetFormInfo, returnItemList, operationItemList } = orderBean
  const showPrint = () => {
    dispatchAction({ type: 'updateState', payload: { printVisible: true } })
  }
  const hidePrint = () => {
    dispatchAction({ type: 'updateState', payload: { printVisible: false } })
  }
  const baseInfoHtml = () => {
    const data =
      namespace === 'cancelDetail'
        ? {
          退货单号: baseInfo.formNo,
          客户名称: baseInfo.customerOrgName,
          退货时间: baseInfo.submitTime,
          退货人: baseInfo.submitName,
          退货金额: baseInfo.formAmount,
          类型: MANAGE_MODEL[baseInfo.formType],
          '备注|fill': baseInfo.formRemark,
        }
        : {
          退货单号: baseInfo.formNo,
          供应商名称: baseInfo.supplierOrgName,
          退货时间: baseInfo.submitTime,
          退货人: baseInfo.submitName,
          退货金额: baseInfo.formAmount,
          类型: MANAGE_MODEL[baseInfo.formType],
          '备注|fill': baseInfo.formRemark,
        }
    return <PlainForm data={data} size={3} />
  }
  const intranetFormInfoHtml = () => {
    const data =
      namespace === 'cancelDetail'
        ? {
          原单号: intranetFormInfo.intranetFormNo,
          退货科室: intranetFormInfo.deptName,
          退货金额: intranetFormInfo.formAmount,
          客户名称: intranetFormInfo.customerOrgName,
          提交人: intranetFormInfo.submitName,
          提交时间: intranetFormInfo.submitTime,
          审核人: intranetFormInfo.approveName,
          审核时间: intranetFormInfo.approveTime,
          '备注|fill': intranetFormInfo.formRemark,
        }
        : {
          原单号: intranetFormInfo.intranetFormNo,
          退货科室: intranetFormInfo.deptName,
          退货金额: intranetFormInfo.formAmount,
          供应商名称: intranetFormInfo.supplierOrgName,
          提交人: intranetFormInfo.submitName,
          提交时间: intranetFormInfo.submitTime,
          审核人: intranetFormInfo.approveName,
          审核时间: intranetFormInfo.approveTime,
          '备注|fill': intranetFormInfo.formRemark,
        }
    return <PlainForm data={data} size={3} />
  }
  const returnItemInfoHtml = () => (
    <div className={styles.tableWrapper}>
      <Table
        bordered
        rowKey="itemId"
        size="small"
        columns={returnItemColumns}
        pagination={false}
        dataSource={returnItemList}
      />
    </div>
  )
  const oprationInfoHtml = () => (
    <div className={styles.tableWrapper}>
      <Table
        bordered
        rowKey="id"
        size="small"
        columns={operationItemColumns}
        pagination={false}
        dataSource={operationItemList}
      />
    </div>
  )
  const printParams = {
    orderBean,
    namespace,
    hideHandler: hidePrint,
    visible: printVisible,
  }
  const CollapseHeader = (
    <div>
      <div className={styles.collapseLine} />
      <span className={styles.collapseTitle}>原始单据信息</span>
      <span className={styles.collapseArrow}>
        {collapseStatus ? (
          <span className={styles.arrowText}>
            收起<Icon type="caret-up" />
          </span>
        ) : (
          <span className={styles.arrowText}>
            展开<Icon type="caret-down" />
          </span>
        )}
      </span>
    </div>
  )
  return (
    <div className="aek-layout">
      <div className="bread">
        <Breadcrumb />
      </div>
      <Spin spinning={getLoading('getOrderDetail')}>
        <APanel>
          <div className={styles.formStatus}>{CANCEL_STATUS[baseInfo.formStatus || 4]}</div>
          <Button onClick={showPrint}>打印退货单</Button>
        </APanel>
        <APanel>
          <div className={styles.orderInfo}>
            <div className={styles.infoBox}>
              <div className={styles.title}>基本信息</div>
              {baseInfoHtml()}
            </div>
            <div className={styles.infoBox}>
              <Collapse
                bordered={false}
                onChange={() => {
                  dispatchAction({
                    type: 'updateState',
                    payload: { collapseStatus: !collapseStatus },
                  })
                }}
              >
                <Panel header={CollapseHeader}>{intranetFormInfoHtml()}</Panel>
              </Collapse>
            </div>
          </div>
        </APanel>
        <APanel>
          <div className={styles.title}>退货明细</div>
          {returnItemInfoHtml()}
        </APanel>
        <APanel>
          <div className={styles.title}>操作日志</div>
          {oprationInfoHtml()}
        </APanel>
      </Spin>
      <CancelPrint {...printParams} />
    </div>
  )
}

CancelDetailData.propTypes = {
  namespace: PropTypes.string,
  cancelDetailBean: PropTypes.object,
  loading: PropTypes.object,
}
export default CancelDetailData
