import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Modal, Button } from 'antd'
import { Link } from 'dva/router'

import Breadcrumb from '../../../components/Breadcrumb'
import { getBasicFn } from '../../../utils/index'
import styles from '../shared/index.less'
import BusinessItem from '../shared/businessItem'
import InfoPanel from '../shared/infoPanel'
import AlertPanel from '../shared/alertPanel'
import AdPanel from '../shared/adPanel'
import ReachModal from '../shared/reachModal'
import Container from '../shared/container'

const namespace = 'myRelease'
const MyRelease = ({ myRelease, app, loading }) => {
  const { dispatchAction, getLoading, dispatchUrl } = getBasicFn({ namespace, loading })
  const { dataList, pagination, broadCasts, infoNums, combineModalVisible, currentItem } = myRelease
  const { chanceVersionGuid } = currentItem
  const { user, orgInfo } = app
  const getBtnGroup = (item) => {
    const { canEdit, canDelete, canGetCombine, canManuallyEnd, chanceVersionGuid: id } = item
    const editBtn = <Link to={`/business/myRelease/release?chanceId=${item.chanceId}`}>编辑</Link>
    const deleteBtn = (
      <a
        onClick={() => {
          Modal.confirm({
            content: '确定删除',
            onOk: () => {
              dispatchAction({
                type: 'deleteChance',
                payload: { chanceId: item.chanceId, chanceVersionGuid: id },
              })
            },
          })
        }}
      >
        删除
      </a>
    )
    const combineBtn = (
      <a
        onClick={() => {
          dispatchAction({
            type: 'updateState',
            payload: { currentItem: item, combineModalVisible: true },
          })
        }}
      >
        达成合作
      </a>
    )
    const endBtn = (
      <a
        onClick={() => {
          Modal.confirm({
            content: '确定手动结束',
            onOk: () => {
              dispatchAction({
                type: 'manuallyEnd',
                payload: { chanceId: item.chanceId, chanceVersionGuid: id },
              })
            },
          })
        }}
      >
        手动结束
      </a>
    )
    return (
      <span className={styles.operationArea}>
        {canEdit && editBtn}
        {canDelete && deleteBtn}
        {canGetCombine && combineBtn}
        {canManuallyEnd && endBtn}
      </span>
    )
  }
  const modalProps = {
    loading: getLoading('combine'),
    modalVisible: combineModalVisible,
    handleCancel: () => {
      dispatchAction({ type: 'updateState', payload: { combineModalVisible: false } })
    },
    handleOk: (payload) => {
      dispatchAction({ type: 'combine', payload: { ...payload, chanceVersionGuid } })
    },
  }
  // 翻页
  const pageChange = (current, pageSize) => {
    dispatchAction({
      type: 'getData',
      payload: { current, pageSize },
    })
  }
  const containerProps = {
    data: dataList,
    loading: getLoading('getData'),
    pageChange,
    pagination,
  }
  return (
    <div className="aek-layout">
      <div className="bread">
        <Breadcrumb />
      </div>
      <div className={styles.layout}>
        <div className={styles.container}>
          <div className={styles.left}>
            <Container {...containerProps}>
              {dataList.map(item => (
                <BusinessItem
                  key={item.chanceId}
                  detail={item}
                  onClick={(query) => {
                    dispatchUrl({
                      pathname: item.canEdit
                        ? '/business/myRelease/release'
                        : '/business/myRelease/detail',
                      query,
                    })
                  }}
                  optionBtnGroup={getBtnGroup(item)}
                />
              ))}
            </Container>
          </div>
          <div className={styles.right}>
            <Link to="/business/myRelease/release">
              <Button
                size="large"
                type="primary"
                style={{ width: '100%', fontSize: '16px', marginBottom: '16px' }}
              >
                我要发布需求
              </Button>
            </Link>
            <InfoPanel data={{ ...user, ...orgInfo, ...infoNums }} />
            <AlertPanel data={broadCasts} name="myRelease" />
            <AdPanel />
          </div>
          <ReachModal {...modalProps} />
        </div>
      </div>
    </div>
  )
}

MyRelease.propTypes = {
  myRelease: PropTypes.object,
  app: PropTypes.object,
  loading: PropTypes.object,
}
export default connect(({ myRelease, loading, app }) => ({
  myRelease,
  loading,
  app,
}))(MyRelease)
