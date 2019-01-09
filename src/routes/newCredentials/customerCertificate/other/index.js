import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import SearchForm from '../../../../components/SearchFormFilter'
import { getOption, getBasicFn } from '../../../../utils'
import { MenuButton } from '../data'

const noLabelLayout = {
  wrapperCol: { span: 22 },
}
const namespace = 'newCustomerCertificate'
function Other({
  effects,
  otherDataSource,
  pagination,
  searchData,
  tabIndex,
  allCustomerOptions,
  debounceCusotmer,
  otherTypeOptions,
}) {
  const typeOptions = (data = {}) => {
    const retArr = []
    for (const [key, value] of Object.entries(data)) {
      const obj = {
        id: key,
        name: value,
      }
      retArr.push(obj)
    }
    return retArr
  }
  const { dispatchAction } = getBasicFn({ namespace, loading: { effects } })
  const searchProps = {
    formData: [{
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
          placeholder: '请输入供应商名称检索',
          showSearch: true,
          defaultActiveFirstOption: false,
          filterOption: false,
          notFoundContent: '',
          allowClear: true,
          labelInValue: true,
          children: getOption(allCustomerOptions, { idStr: 'supplierOrgId', nameStr: 'supplierOrgName', prefix: '供应商 ' }),
        },
      },
    }, {
      layout: noLabelLayout,
      field: 'certificateType',
      width: 220,
      options: {
        initialValue: null,
      },
      component: {
        name: 'Select',
        props: {
          optionLabelProp: 'title',
          children: getOption([{
            id: null,
            name: '全部',
          }, ...typeOptions(otherTypeOptions)], { prefix: '类型 ' }),
        },
      },
    }, {
      layout: noLabelLayout,
      width: 220,
      field: 'certificateStatus',
      component: {
        name: 'Select',
        props: {
          optionLabelProp: 'title',
          children: getOption([{
            id: null,
            name: '全部',
          }, {
            id: '0',
            name: '启用',
          }, {
            id: '1',
            name: '停用',
          }], { prefix: '状态 ' }),
        },
      },
      options: {
        initialValue: '0',
      },
    }, {
      layout: noLabelLayout,
      field: 'validDate',
      width: 220,
      options: {
        initialValue: null,
      },
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
            id: '0',
            name: '未过期',
          }], { prefix: '效期 ' }),
        },
      },
    }],
    onSearch: (value) => {
      dispatchAction({
        type: 'otherList',
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
      title: '证件类型',
      render: value => (<span>{otherTypeOptions[value]}</span>),
    },
    {
      key: 'supplierOrgName',
      dataIndex: 'supplierOrgName',
      title: '供应商名称',
    },
    {
      key: 'validDateEnd',
      dataIndex: 'validDateEnd',
      title: '有效期至',
      render: (value, record) => { // 先判断是否长期有效
        let dom
        const replace = () => (<span>
          {record.replacedFlag ? <p className="aek-red">(已换证,<a onClick={() => {
            const type = record.certificateType === 6 ? '服务承诺书' : '廉政协议书'
            dispatchAction({
              payload: {
                modalTitle: `查看${type}`,
              },
            })
            dispatchAction({
              type: 'getOtherDetail',
              payload: {
                certificateId: record.replacedCertificateId,
              },
            })
          }}
          >查看新证件</a>)</p> : ''
          }
        </span>)
        // 先判断是否长期有效
        if (record.validDateLongFlag) {
          dom = (<p>长期有效</p>)
        } else {
          const oldDate = new Date(new Date(value).getTime() + (24 * 60 * 60 * 1000)).getTime()
          const todayDate = new Date().getTime()
          if (oldDate < todayDate) {
            dom = <span className="aek-text-disable">{`${record.validDateStart}至${record.validDateEnd}`}<span className="aek-red">（已过期）</span></span>
          } else {
            dom = <span >{`${record.validDateStart}至${record.validDateEnd}`}</span>
          }
        }
        return (<span>
          {dom}
          <span>{replace()}</span>
        </span>)
      },
    },
    // {
    //   key: 'certificatePlace',
    //   dataIndex: 'certificatePlace',
    //   title: '档案存放位置',
    // },
    {
      key: 'operation',
      dataIndex: 'operation',
      title: '操作',
      width: 150,
      className: 'aek-text-center',
      render: (value, record) => {
        const menuProps = {
          status: record.certificateStatus,
          handleMenuClick: () => {
            dispatchAction({
              type: 'otherStatus',
              payload: {
                certificateId: record.certificateId,
                certificateStatus: !record.certificateStatus,
              },
            })
          },
        }
        return (
          <span>
            <a
              onClick={() => {
                const type = () => {
                  if (record.certificateType === 6) {
                    return '服务承诺书'
                  } else if (record.certificateType === 7) {
                    return '廉政协议书'
                  }
                  return '其他证件'
                }
                dispatchAction({
                  payload: {
                    modalTitle: `查看${type()}`,
                  },
                })
                dispatchAction({
                  type: 'getOtherDetail',
                  payload: {
                    certificateId: record.certificateId,
                  },
                })
              }}
            >查看</a>
            <span className="ant-divider" />
            <MenuButton {...menuProps} />
          </span>
        )
      },
    },
  ]
  // 翻页
  const handleChange = (value) => {
    dispatchAction({
      type: 'otherList',
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
        dataSource={otherDataSource}
        pagination={pagination}
        bordered
        onChange={handleChange}
        loading={!!effects['customerCertificate/otherList']}
        rowKey="certificateId"
      />
    </div>
  )
}

Other.propTypes = {
  effects: PropTypes.object.isRequired,
  otherDataSource: PropTypes.array.isRequired,
  pagination: PropTypes.object.isRequired,
  searchData: PropTypes.object.isRequired,
  tabIndex: PropTypes.string.isRequired,
  allCustomerOptions: PropTypes.array.isRequired,
  debounceCusotmer: PropTypes.func.isRequired,
  otherTypeOptions: PropTypes.object,
}

export default Other
