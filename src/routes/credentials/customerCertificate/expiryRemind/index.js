import React from 'react'
import PropTypes from 'prop-types'
import { Table, message } from 'antd'
import SearchForm from '../../../../components/SearchFormFilter'
import { getOption } from '../../../../utils'

const noLabelLayout = {
  wrapperCol: { span: 22 },
}
function ExpiryRemind({
  effects,
  dispatch,
  dataSource,
  pagination,
  searchData,
  tabIndex,
  debounceCusotmer,
  allCustomerOptions,
}) {
  const searchProps = {
    formData: [{
      layout: noLabelLayout,
      width: 220,
      field: 'certificateType',
      component: {
        name: 'Select',
        props: {
          optionLabelProp: 'title',
          children: getOption([{ /** @desc 后端接口集合查询慢，接口拆分 删除全部查询条件 */
            id: '1',
            name: '注册证',
          }, {
            id: '2',
            name: '厂家/总代三证',
          }, {
            id: '3',
            name: '企业三证',
          }, {
            id: '4',
            name: '授权书',
          }, {
            id: '5',
            name: '委托书',
          }, {
            id: '6',
            name: '其他档案',
          }], { prefix: '证件类型 ' }),
        },
      },
      options: {
        initialValue: '1',
      },
    },
    {
      layout: noLabelLayout,
      width: 220,
      field: 'certificateExpiredType',
      component: {
        name: 'Select',
        props: {
          optionLabelProp: 'title',
          children: getOption([{
            id: null,
            name: '全部',
          }, {
            id: '1',
            name: '已过期',
          }, {
            id: '2',
            name: '一周内过期',
          }, {
            id: '3',
            name: '一个月内过期',
          }, {
            id: '4',
            name: '三个月内过期',
          }], { prefix: '效期情况' }),
        },
      },
      options: {
        initialValue: searchData.certificateExpiredType || null,
      },
    },
    {
      layout: noLabelLayout,
      width: 220,
      field: 'supplierOrgId',
      component: {
        name: 'Select',
        props: {
          onSearch(value) {
            debounceCusotmer(value)
          },
          optionLabelProp: 'title',
          placeholder: '请输入',
          showSearch: true,
          defaultActiveFirstOption: false,
          filterOption: false,
          notFoundContent: '',
          allowClear: true,
          labelInValue: true,
          children: getOption(allCustomerOptions, { idStr: 'supplierOrgId', nameStr: 'supplierOrgName', prefix: '供应商 ' }),
        },
      },
    }],
    onSearch: (value) => {
      dispatch({
        type: 'customerCertificate/getCertificateList',
        payload: {
          ...value,
          supplierOrgId: value.supplierOrgId ? value.supplierOrgId.key : null,
          current: 1,
          pageSize: 10,
        },
      })
    },
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
            domArr.push(<p key={obj}>{obj}</p>)
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
      key: 'orgName',
      dataIndex: 'orgName',
      title: '供应商/电话',
      className: 'aek-text-center',
      render: (value, record) => (
        <span>
          <p>{value}</p>
          <p>{record.orgContactPhone}</p>
        </span>
      ),
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
      width: 100,
      className: 'aek-text-center',
      render: (value, { validDateEnd, certificateType, certificateId, addBy, orgCertificate, supplierOrgId }) => {
        const handleClick = (index) => {
          let url = ''
          let modalTitle = ''
          let reqData = {}
          if (index === 1) {
            switch (orgCertificate) {
              case '生产厂家/总经销商':
                url = 'customerCertificate/getprodFactoryDetai'
                modalTitle = '查看厂家/总代证件'
                reqData = {
                  factoryAgentCertificateId: certificateId,
                }
                break
              case '注册证':
                url = 'customerCertificate/getRegistDetaiList'
                modalTitle = '查看注册证'
                reqData = {
                  certificateId,
                  replacedFlag: false,
                }
                break
              case '企业三证':
                url = 'customerCertificate/getCompanyDetail'
                modalTitle = '查看企业三证'
                reqData = {
                  certificateId,
                  orgId: supplierOrgId,
                }
                break
              case '授权书':
                url = 'customerCertificate/getAuthDetail'
                modalTitle = '查看授权书'
                reqData = {
                  certificateId,
                }
                break
              case '委托书':
                url = 'customerCertificate/getPowerDetail'
                modalTitle = '查看委托书'
                reqData = {
                  certificateId,
                }
                break
              case '服务承诺书':
                url = 'customerCertificate/getOtherDetail'
                modalTitle = '查看服务承诺书'
                reqData = {
                  certificateId,
                }
                break
              default:
                url = 'customerCertificate/getOtherDetail'
                modalTitle = `查看${orgCertificate}`
                reqData = {
                  certificateId,
                }
                break
            }
            dispatch({
              type: 'customerCertificate/updateState',
              payload: {
                modalTitle,
              },
            })
            dispatch({
              type: url,
              payload: reqData,
            })
          } else {
            /** @desc 临时注释 提醒直接置为成功 */
            // dispatch({
            //   type: 'customerCertificate/getCertificateRemind',
            //   payload: {
            //     addBy,
            //     orgCertificate,
            //     supplierOrgId,
            //     certificateId,
            //     validDateEnd,
            //   },
            // })
            message.success('你已成功提醒供应商维护证件', 3)
          }
        }
        let ret = {}
        const oldDate = new Date(validDateEnd)
        const todayDate = new Date()
        if (oldDate > todayDate) {
          ret = <a onClick={() => { handleClick(1) }}>查看</a>
        } else {
          ret = (<span>
            <a onClick={() => { handleClick(0) }}>提醒</a>
            <a className="aek-ml10" onClick={() => { handleClick(1) }}>查看</a>
          </span>)
        }
        return ret
      },
    },
  ]
  // 翻页
  const handleChange = (value) => {
    dispatch({
      type: 'customerCertificate/getCertificateList',
      payload: {
        ...searchData,
        ...value,
      },
    })
  }
  return (
    <div key={tabIndex}>
      <SearchForm {...searchProps} />
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={pagination}
        bordered
        onChange={handleChange}
        loading={!!effects['customerCertificate/getCertificateList']}
        rowKey="index"
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
  debounceCusotmer: PropTypes.func.isRequired,
  allCustomerOptions: PropTypes.array.isRequired,
}

export default ExpiryRemind
