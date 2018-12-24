import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Link } from 'dva/router'
import { Button } from 'antd'
import Breadcrumb from '../../../components/Breadcrumb'
import { getBasicFn } from '../../../utils/index'
import styles from '../shared/index.less'
import BusinessItem from '../shared/businessItem'
import InfoPanel from '../shared/infoPanel'
import AlertPanel from '../shared/alertPanel'
import AdPanel from '../shared/adPanel'
import Container from '../shared/container'

const namespace = 'myReply'
const MyReply = ({ myReply, app, loading }) => {
  const { dispatchAction, getLoading, dispatchUrl } = getBasicFn({ namespace, loading })
  const { dataList, pagination, broadCasts, infoNums } = myReply
  const { user, orgInfo } = app
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
                      pathname: '/business/myReply/detail',
                      query,
                    })
                  }}
                />
              ))}
            </Container>
          </div>
          <div className={styles.right}>
            <Link to="/business/myReply/release">
              <Button
                size="large"
                type="primary"
                style={{ width: '100%', fontSize: '16px', marginBottom: '16px' }}
              >
                我要发布需求
              </Button>
            </Link>
            <InfoPanel data={{ ...user, ...orgInfo, ...infoNums }} />
            <AlertPanel data={broadCasts} name="myReply" />
            <AdPanel />
          </div>
        </div>
      </div>
    </div>
  )
}

MyReply.propTypes = {
  myReply: PropTypes.object,
  app: PropTypes.object,
  loading: PropTypes.object,
}
export default connect(({ myReply, loading, app }) => ({
  myReply,
  loading,
  app,
}))(MyReply)
