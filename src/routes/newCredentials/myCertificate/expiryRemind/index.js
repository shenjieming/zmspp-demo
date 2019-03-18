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
  registTypeList,
                        editFlag,
}) {
  const dateEven = (e) => {
    dispatch({
      type: 'newMyCertificate/getCertificateList',
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
      render: (value, { validDateEnd, orgCertificate, certificateId, certificateType, orgCertificateType }) => {
        const update = (index, key) => {
          dispatch({
            type: 'newMyCertificate/updateState',
            payload: {
              viewRegistModalVisible: !index,
              registDetailVisible: !!index,
              step: index ? 1 : 2,
              status: index ? 3 : 4,
              firstFormData: {
                oldCertificateId: certificateId,
                oldCertificateNo: certificateType ? certificateType.split('-')[0] : '',
                certificateType: {
                  label: orgCertificate,
                  key,
                },
              },
            },
          })
        }

        const handleClick = (index) => {
          let url = ''
          let modalTitle = ''
          let reqData = {}
          /**
           * orgCertificateType  1 注册证 2 生产厂家/总经销商 3 授权书 4委托书 5 其他证件 6 企业证件
           *
          */
          if (orgCertificateType === '1') {
            url = 'newMyCertificate/getRegistViewDetail'
            modalTitle = index === 0 ? '查看注册证' : '换证'
            reqData = {
              certificateId,
              replacedFlag: index !== 0,
            }
            const getId = () => {
              const obj = find(registTypeList, item => orgCertificate === item.dicValueText)
              return obj && obj.decValue
            }
            update(index, getId())
          } else if (orgCertificateType === '2') {
            url = 'newMyCertificate/getprodFactoryDetai'
            modalTitle = index === 0 ? '查看厂家/总代证件' : '换证'
            reqData = {
              factoryAgentCertificateId: certificateId,
            }
          } else if (orgCertificateType === '3') {
            url = 'newMyCertificate/getAuthDetail'
            modalTitle = index === 0 ? '查看授权书' : '换证'
            reqData = {
              certificateId,
            }
          } else if (orgCertificateType === '4') {
            url = 'newMyCertificate/getPowerDetail'
            modalTitle = index === 0 ? '查看委托书' : '换证'
            reqData = {
              certificateId,
            }
          } else if (orgCertificateType === '5') {
            url = 'newMyCertificate/getOtherDetail'
            modalTitle = index === 0 ? `查看${orgCertificate}` : '换证'
            reqData = {
              certificateId,
            }
          } else if (orgCertificateType === '6') {
            url = 'newMyCertificate/getCompanyDetail'
            modalTitle = index === 0 ? '查看企业证件' : '换证'
            reqData = {
              certificateId,
            }
          }


          dispatch({
            type: 'newMyCertificate/updateState',
            payload: {
              modalTitle,
              rowSelectData: {
                certificateId,
              },
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
      type: 'newMyCertificate/getCertificateList',
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
        loading={!!effects['newMyCertificate/getCertificateList']}
        rowKey="index"
      />
    </div>
  )
}

ExpiryRemind.propTypes = {
  effects: PropTypes.object,
  dispatch: PropTypes.func,
  dataSource: PropTypes.array,
  pagination: PropTypes.object,
  searchData: PropTypes.object,
  tabIndex: PropTypes.string,
  registTypeList: PropTypes.array,
}

export default ExpiryRemind
