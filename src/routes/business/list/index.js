import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { cloneDeep } from 'lodash'
import { Link } from 'dva/router'
import { Button } from 'antd'
import Breadcrumb from '../../../components/Breadcrumb'
import SearchFormFillter from '../../../components/SearchFormFilter'
import { getBasicFn, getOption } from '../../../utils/index'
import { NO_LABEL_LAYOUT } from '../../../utils/constant'
import styles from '../shared/index.less'
import BusinessItem from '../shared/businessItem'
import InfoPanel from '../shared/infoPanel'
import AlertPanel from '../shared/alertPanel'
import AdPanel from '../shared/adPanel'
import Container from '../shared/container'

const namespace = 'businessList'
const BusinessList = ({ businessList, app, loading }) => {
  const { dispatchAction, getLoading, dispatchUrl } = getBasicFn({ namespace, loading })
  const { dataList, searchParams, pagination, broadCasts, infoNums, category } = businessList
  const { user, orgInfo } = app
  // 搜索
  const searchHandler = (value) => {
    const param = cloneDeep(value)
    dispatchAction({
      type: 'getData',
      payload: { ...param, current: 1 },
    }).then(() => {
      dispatchAction({ payload: { searchParams: param } })
    })
  }
  // 翻页
  const pageChange = (current, pageSize) => {
    dispatchAction({
      type: 'getData',
      payload: { current, pageSize },
    })
  }
  const formData = [
    {
      layout: NO_LABEL_LAYOUT,
      field: 'chanceTagValue',
      width: 160,
      options: {
        initialValue: null,
      },
      component: {
        name: 'Select',
        props: {
          defaultActiveFirstOption: false,
          filterOption: false,
          notFoundContent: false,
          optionLabelProp: 'title',
          children: getOption(
            [
              {
                dicValue: null,
                dicValueText: '全部',
              },
              ...category,
            ],
            {
              idStr: 'dicValue',
              nameStr: 'dicValueText',
              prefix: '类型',
            },
          ),
        },
      },
    },
    {
      layout: NO_LABEL_LAYOUT,
      field: 'chanceReleaseOrgNameLike',
      width: 150,
      options: {
        initialValue: '',
      },
      component: {
        name: 'Input',
        props: {
          placeholder: '请输入机构名称',
        },
      },
    },
    {
      layout: NO_LABEL_LAYOUT,
      field: 'keywords',
      width: 150,
      options: {
        initialValue: '',
      },
      component: {
        name: 'Input',
        props: {
          placeholder: '请输入搜索关键字',
        },
      },
    },
  ]
  // 搜索参数
  const searchProps = {
    initialValues: searchParams,
    formData,
    className: styles.panel,
    onSearch: searchHandler,
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
            <div className={styles.panel} style={{ paddingBottom: '0px' }}>
              <SearchFormFillter {...searchProps} />
            </div>
            <Container {...containerProps}>
              {dataList.map(item => (
                <BusinessItem
                  key={item.chanceId}
                  detail={item}
                  isCommon // 公共页面不显示发布中
                  onClick={(query) => {
                    dispatchUrl({
                      pathname: '/business/list/detail',
                      query,
                    })
                  }}
                />
              ))}
            </Container>
          </div>
          <div className={styles.right}>
            <Link to="/business/list/release">
              <Button
                size="large"
                type="primary"
                style={{ width: '100%', fontSize: '16px', marginBottom: '16px' }}
              >
                我要发布需求
              </Button>
            </Link>
            <InfoPanel data={{ ...user, ...orgInfo, ...infoNums }} />
            <AlertPanel data={broadCasts} name="list" />
            <AdPanel />
          </div>
        </div>
      </div>
    </div>
  )
}

BusinessList.propTypes = {
  children: PropTypes.node,
  businessList: PropTypes.object,
  app: PropTypes.object,
  loading: PropTypes.object,
}
export default connect(({ businessList, loading, app }) => ({
  businessList,
  loading,
  app,
}))(BusinessList)
