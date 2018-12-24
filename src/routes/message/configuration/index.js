import React from 'react'
import { connect } from 'dva'
import { Spin } from 'antd'
import PropTypes from 'prop-types'
import Breadcrumb from '../../../components/Breadcrumb'
import { getBasicFn, getPagination } from '../../../utils/'
import CfgPanel from './CfgPanel'
import Modal from './Modal'

const namespace = 'msgConfig'

const propTypes = {
  msgConfig: PropTypes.object,
  loading: PropTypes.object,
  routes: PropTypes.array,
}

function MsgConfig({ msgConfig, loading, routes }) {
  const { dispatchAction, getLoading } = getBasicFn({ namespace, loading })

  const { configList } = msgConfig

  const modalProp = {
    visible: msgConfig.visible,
    keywords: msgConfig.keywords,
    handleSearch: (keywords) => {
      dispatchAction({ type: 'advancedSeach', payload: keywords })
    },
    handleSearchChange: (e) => {
      dispatchAction({
        type: 'updateState',
        payload: { keywords: e.target.value },
      })
    },
    dataSource: msgConfig.dataSource,
    pagination: getPagination(
      (current, pageSize) => {
        dispatchAction({
          type: 'getAllUser',
          payload: { keywords: msgConfig.keywords, current, pageSize },
        })
      },
      {
        total: msgConfig.total,
        current: msgConfig.current,
        pageSize: msgConfig.pageSize,
      },
    ),
    tableLoading: getLoading('getAllUser', 'recevierUpdate'),
    onBtnClick: (row) => {
      dispatchAction({
        type: 'recevierUpdate',
        payload: {
          msgReceiveUserIds: [row.userId],
          msgTemplateId: msgConfig.currentSwitchTemplate.msgTemplateId,
        },
      })
    },
    onClose: () => {
      dispatchAction({ type: 'updateState', payload: { visible: false } })
    },
    currentSwitchTemplate: msgConfig.currentSwitchTemplate,
  }

  return (
    <div className="aek-layout">
      <div className="bread">
        <Breadcrumb routes={routes} />
      </div>
      <Spin spinning={getLoading('getMsgConfigList', 'changeConfigStatus')}>
        <div className="aek-shadow">
          {configList.map(data => (
            <CfgPanel
              data={data}
              key={data.menuId}
              onSwitch={(item) => {
                dispatchAction({
                  type: 'openAndSearch',
                  payload: item,
                })
              }}
              onToggle={(msgTemplateId, disable) => {
                dispatchAction({
                  type: 'changeConfigStatus',
                  payload: { msgTemplateId, disable },
                })
              }}
            />
          ))}
        </div>
      </Spin>
      <Modal {...modalProp} />
    </div>
  )
}

MsgConfig.propTypes = propTypes

export default connect(({ msgConfig, loading }) => ({ msgConfig, loading }))(MsgConfig)
