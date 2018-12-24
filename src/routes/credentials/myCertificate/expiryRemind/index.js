import React from 'react'
import PropTypes from 'prop-types'
import { Table, Row, Col, Radio } from 'antd'
import Style from './index.less'

const RadioButton = Radio.Button
const RadioGroup = Radio.Group

function ExpiryRemind({
  effects,
  dispatch,
  dataSource,
  pagination,
  searchData,
  tabIndex,
}) {
  const dateEven = (e) => {
    dispatch({
      type: 'myCertificate/getCertificateList',
      payload: {
        current: 1,
        pageSize: 10,
        certificateExpiredStatus: e.target.value,
      },
    })
  }
  const columns = [
    {
      key: 'certificateType',
      dataIndex: 'certificateType',
      title: '过期证件',
      render: (value) => {
        const domArr = []
        if (value && value.length !== 0) {
          const arr = `${value}`.split('-')
          for (const obj of arr) {
            domArr.push(<p key={`${obj}`}>{obj}</p>)
          }
        }
        return <div>{domArr}</div>
      },
    },
    {
      key: 'orgCertificate',
      dataIndex: 'orgCertificate',
      title: '证件类型',
    },
    {
      key: 'validDateEnd',
      dataIndex: 'validDateEnd',
      title: '过期时间',
      render: (value) => {
        const ret = {}
        const oldDate = new Date(new Date(value).getTime() + (24 * 60 * 60 * 1000)).getTime()
        const todayDate = new Date().getTime()
        if (oldDate > todayDate) {
          const diff = oldDate - todayDate
          const diffDay = Math.ceil(diff / (1000 * 60 * 60 * 24))
          ret.children = <span>{diffDay}天后过期</span>
        } else {
          const diff = todayDate - oldDate
          const diffDay = Math.ceil(diff / (1000 * 60 * 60 * 24))
          ret.children = <span>已过期<span className="aek-red">{diffDay}</span>天</span>
        }
        return ret
      },
    },
    {
      key: 'operation',
      dataIndex: 'operation',
      title: '操作',
      width: 150,
      className: 'aek-text-center',
      render: (value, { validDateEnd, orgCertificate, certificateId }) => {
        const handleClick = (index) => {
          let url = ''
          let modalTitle = ''
          let reqData = {}
          switch (orgCertificate) {
            case '生产厂家/总经销商':
              url = 'myCertificate/getprodFactoryDetai'
              modalTitle = index === 0 ? '查看厂家/总代证件' : '换证'
              reqData = {
                factoryAgentCertificateId: certificateId,
              }
              break
            case '注册证':
              url = 'myCertificate/getRegistDetaiList'
              modalTitle = index === 0 ? '查看注册证' : '换证'
              reqData = {
                certificateId,
                replacedFlag: index !== 0,
              }
              break
            case '企业证件':
              url = 'myCertificate/getCompanyDetail'
              modalTitle = index === 0 ? '查看企业证件' : '换证'
              reqData = {
                certificateId,
              }
              break
            case '授权书':
              url = 'myCertificate/getAuthDetail'
              modalTitle = index === 0 ? '查看授权书' : '换证'
              reqData = {
                certificateId,
              }
              break
            case '委托书':
              url = 'myCertificate/getPowerDetail'
              modalTitle = index === 0 ? '查看委托书' : '换证'
              reqData = {
                certificateId,
              }
              break
            case '服务承诺书':
              url = 'myCertificate/getOtherDetail'
              modalTitle = index === 0 ? '查看服务承诺书' : '换证'
              reqData = {
                certificateId,
              }
              break
            default:
              url = 'myCertificate/getOtherDetail'
              modalTitle = index === 0 ? `查看${orgCertificate}` : '换证'
              reqData = {
                certificateId,
              }
              break
          }
          dispatch({
            type: 'myCertificate/updateState',
            payload: {
              modalTitle,
            },
          })
          dispatch({
            type: url,
            payload: reqData,
          })
        }
        let ret = {}
        const oldDate = new Date(validDateEnd)
        const todayDate = new Date()
        if (oldDate > todayDate) {
          ret = <a onClick={() => { handleClick(0) }}>查看</a>
        } else {
          ret = <a onClick={() => { handleClick(1) }}>更换新证</a>
        }
        return ret
      },
    },
  ]
  // 翻页
  const handleChange = (value) => {
    dispatch({
      type: 'myCertificate/getCertificateList',
      payload: {
        ...searchData,
        ...value,
      },
    })
  }
  return (
    <div key={tabIndex}>
      <div>
        <div className={`${Style['aek-row-title']} ${Style.left}`}>
          过期时间：
        </div>
        <div style={{ height: '50px', lineHeight: '50px' }}>
          <RadioGroup value={searchData.certificateExpiredStatus} onChange={dateEven} defaultValue="5">
            <RadioButton key="1" value="1">已过期</RadioButton>
            <RadioButton key="2" value="2">一周内过期</RadioButton>
            <RadioButton key="3" value="3">一个月内过期</RadioButton>
            <RadioButton key="4" value="4">三个月内过期</RadioButton>
            <RadioButton key="5" value="5">六个月内过期</RadioButton>
          </RadioGroup>
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={pagination}
        bordered
        onChange={handleChange}
        loading={!!effects['myCertificate/getCertificateList']}
        rowKey={(record, index) => `${index}`}
      />
    </div>
  )
}

ExpiryRemind.propTypes = {
  effects: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  dataSource: PropTypes.array.isRequired,
  pagination: PropTypes.object.isRequired,
  searchData: PropTypes.object.isRequired,
  tabIndex: PropTypes.string.isRequired,
}

export default ExpiryRemind
