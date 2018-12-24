// 商机审核
import React from 'react'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import { Table, Tabs, Button, Spin } from 'antd'
import { cloneDeep } from 'lodash'
import moment from 'moment'

import { getBasicFn, getPagination } from '../../utils'

import Breadcrumb from '../../components/Breadcrumb'
import SearchForm from '../../components/SearchFormFilter'
import { tableColumns, advancedForm, getDigital } from './props'
import Styles from './index.less'

const propTypes = {
  businessExamine: PropTypes.object,
  loading: PropTypes.object,
}
const namespace = 'businessExamine'
const CertificatePush = ({ businessExamine, loading }) => {
  const {
    data,
    pagination,
    searchParams,
    accountNum,
    tabType, // tab类型
  } = businessExamine
  const { dispatchAction, getLoading } = getBasicFn({ namespace, loading })

  // tab页切换
  const tabChange = (val) => {
    dispatchAction({
      payload: {
        tabType: val,
        searchParams: {},
        pagination: {
          ...pagination,
          current: 1,
          pageSize: 10,
        },
      },
    })
    let url = 'getPendData'
    const payload = {
      current: 1,
      pageSize: 10,
    }
    if (val === 'all') {
      url = 'getData'
    }
    dispatchAction({
      type: url,
      payload,
    })
    dispatchAction({
      type: 'getAccount',
    })
  }

  const searchPorps = {
    key: tabType,
    initialValues: searchParams,
    advancedForm: advancedForm({ tabType }).filter((item) => {
      if (tabType === 'all') {
        return true
      }
      if (item.field !== 'chanceStatus') {
        return true
      }
      return false
    }),
    formData: [],
    onSearch: (val) => {
      dispatchAction({
        payload: {
          searchParams: val,
        },
      })
      const handleData = (params = {}) => {
        const obj = cloneDeep(params)
        if (params && params.releaseTimeRangeStart && params.releaseTimeRangeStart.length) {
          obj.releaseTimeRangeEnd = moment(params.releaseTimeRangeStart[1]).format('YYYY-MM-DD')
          obj.releaseTimeRangeStart = moment(params.releaseTimeRangeStart[0]).format('YYYY-MM-DD')
        } else {
          obj.releaseTimeRangeEnd = undefined
          obj.releaseTimeRangeStart = undefined
        }
        return obj
      }

      let url = 'getPendData'
      if (tabType === 'all') {
        url = 'getData'
      }
      dispatchAction({
        type: url,
        payload: {
          ...handleData(val),
          current: 1,
        },
      })
    },
  }
  // 翻页
  const pageChange = (current, pageSize) => {
    dispatchAction({
      payload: {
        pagination: {
          ...pagination,
          current,
          pageSize,
        },
      },
    })
    let url = 'getPendData'
    if (tabType === 'all') {
      url = 'getData'
    }
    dispatchAction({
      type: url,
    })
  }
  // 表格参数
  const tableProps = {
    bordered: true,
    rowKey: 'chanceId',
    loading: getLoading('getData', 'getPendData'),
    columns: tableColumns({ tabType }).filter((item) => {
      if (tabType === 'all') {
        return true
      }
      if (item.dataIndex === 'chanceRemark' || item.dataIndex === 'chanceIntentionOrgName' || item.dataIndex === 'chanceLastReplayDate') {
        return false
      }
      return true
    }),
    pagination: getPagination(pageChange, pagination),
    dataSource: data,
  }
  return (
    <div className="aek-layout">
      <div className="bread">
        <Breadcrumb />
      </div>
      <div className="content">
        <Tabs defaultActiveKey={tabType} onChange={tabChange}>
          <Tabs.TabPane tab="待审核" key="pending" />
          <Tabs.TabPane tab="全部" key="all" />
        </Tabs>
        <SearchForm {...searchPorps} />
        <Spin spinning={getLoading('getAccount')}>
          <div className={Styles['examine-account']}>
            <p>
              <span className="aek-text-bold aek-font-mid">今日新增</span>
              <span>：求购信息/<span className="aek-text-bold aek-font-mid">{getDigital(accountNum.todayChanceNum)}条</span></span>
              <span className="aek-ml20">需求回复/<span className="aek-text-bold aek-font-mid">{getDigital(accountNum.todayReplayNum)}条</span></span>
            </p>
            <p>
              <span className="aek-text-bold aek-font-mid">历史汇总</span>
              <span>：求购信息/<span className="aek-text-bold aek-font-mid">{getDigital(accountNum.historyChanceNum)}条</span></span>
              <span className="aek-ml20">需求回复/
                <span className="aek-text-bold aek-font-mid">{getDigital(accountNum.historyReplayNum)}条</span>
                <Button
                  size="small"
                  className="aek-ml20"
                  onClick={() => {
                    dispatchAction({
                      type: 'refresh',
                    }).then(() => {
                      dispatchAction({
                        type: 'getAccount',
                      })
                    })
                  }}
                >刷新</Button>
              </span>
            </p>
          </div>
        </Spin>
        <Table {...tableProps} />
      </div>
    </div>
  )
}

CertificatePush.propTypes = propTypes
export default connect(({ businessExamine, loading }) =>
  ({
    businessExamine,
    loading,
  }))(
  CertificatePush,
)
