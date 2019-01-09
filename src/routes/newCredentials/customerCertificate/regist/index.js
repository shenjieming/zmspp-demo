import React from 'react'
import PropTypes from 'prop-types'
import { Table, Input } from 'antd'
import { find } from 'lodash'
import SearchForm from '../../../../components/SearchFormFilter'
import { getOption, getBasicFn } from '../../../../utils'
import { MATERIALS_CERTIFICATE_TYPE } from '../../../../utils/constant'
import { MenuButton } from '../data'
// import ViewModal from '../../share/viewModal/ViewModal'

const noLabelLayout = {
  wrapperCol: { span: 22 },
}
const namespace = 'newCustomerCertificate'
function Regist({
  effects,
  registDataSource,
  pagination,
  searchData,
  tabIndex,
  allCustomerOptions,
  debounceCusotmer,
  registTypeList,
}) {
  const { dispatchAction } = getBasicFn({ namespace })
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
      width: 220,
      field: 'certificateType',
      component: {
        name: 'Select',
        props: {
          optionLabelProp: 'title',
          children: getOption([{
            id: null,
            name: '全部',
          }, ...registTypeList.map(item => ({ id: item.dicValue, name: item.dicValueText }))], { prefix: '证件类型' }),
        },
      },
      options: {
        initialValue: null,
      },
    },
    {
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
          }], { prefix: '状态' }),
        },
      },
      options: {
        initialValue: '0',
      },
    },
    {
      layout: noLabelLayout,
      width: 220,
      field: 'validDate',
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
          }], { prefix: '效期情况' }),
        },
      },
      options: {
        initialValue: null,
      },
    },
    {
      width: 220,
      layout: noLabelLayout,
      field: 'keywords',
      component: (
        <Input placeholder="注册证号/产品名称/厂家" />
      ),
      options: {
        initialValue: null,
      },
    },
    ],
    onSearch: (value) => {
      dispatchAction({
        type: 'getRegistList',
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
      render: (value) => {
        // let retStr = ''
        // switch (value) {
        //   case 1:
        //     retStr = '注册证'
        //     break
        //   case 3:
        //     retStr = '消毒证'
        //     break
        //   default:
        //     retStr = '备案证'
        //     break
        // }
        const obj = find(registTypeList, item => Number(value) === Number(item.dicValue))
        return obj && obj.dicValueText
      },
    },
    {
      key: 'certificateNo',
      dataIndex: 'certificateNo',
      title: '医疗器械注册证号/产品名称',
      render: (value, record) => (<span>
        <p>{value}</p>
        <p>{record.productName}</p>
        {record.replacedFlag ?
          <p>
            有新证<a
              onClick={() => {
                dispatchAction({
                  payload: {
                    modalTitle: '查看注册证',
                  },
                })
                dispatchAction({
                  type: 'getRegistDetaiList',
                  payload: {
                    certificateId: record.replacedCertificateId,
                  },
                })
              }}
            >查看</a>
          </p> : ''}
      </span>),
    },
    {
      key: 'validDateEnd',
      dataIndex: 'validDateEnd',
      title: '有效期',
      render: (value, record) => {
        let dom
        const replace = () => (<span>
          {record.replacedFlag ? <p className="aek-red">(已换证,<a onClick={() => {
            dispatchAction({
              payload: {
                modalTitle: '查看注册证',
              },
            })
            dispatchAction({
              type: 'getRegistDetaiList',
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
          // 判断是否延期
          if (record.delayedFlag) {
            const oldDate = new Date(new Date(record.delayedDateEnd).getTime() +
              (24 * 60 * 60 * 1000)).getTime()
            const todayDate = new Date().getTime()
            if (oldDate < todayDate) {
              dom = (<p className="aek-text-disable">{`${record.validDateStart}延期至${record.delayedDateEnd}`}<span className="aek-red">（已过期）</span></p>)
            } else {
              dom = <p>{`${record.validDateStart}延期至${record.delayedDateEnd}`}</p>
            }
          }
          if (!record.delayedFlag) {
            const oldDate = new Date(new Date(record.validDateEnd).getTime() +
              (24 * 60 * 60 * 1000)).getTime()
            const todayDate = new Date().getTime()
            if (oldDate < todayDate) {
              dom = <p className="aek-text-disable">{record.validDateEnd}<span className="aek-red">（已过期）</span></p>
            } else {
              dom = <p>{value}</p>
            }
          }
        }
        return (<span>
          {dom}
          <span>{replace()}</span>
        </span>)
      },
    },
    {
      key: 'produceFactoryName',
      dataIndex: 'produceFactoryName',
      title: '厂家',
      render: (value, record) => (<span>
        <p>{value}</p>
        {record.importedFlag ? `总代：${record.agentSupplierName}` : ''}
      </span>),
    },
    {
      key: 'supplierOrgName',
      dataIndex: 'supplierOrgName',
      title: '供应商',
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
      width: 120,
      className: 'aek-text-center',
      render: (value, record) => {
        const menuProps = {
          status: record.certificateStatus,
          handleMenuClick: () => {
            dispatchAction({
              type: 'registeStatus',
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
                const title = '查看注册证'
                const url = 'getRegistDetaiList'
                const reqData = {
                  certificateId: record.certificateId,
                }
                dispatchAction({
                  payload: {
                    modalTitle: title,
                  },
                })
                dispatchAction({
                  type: url,
                  payload: reqData,
                })
              }}
            >查看</a>
            <span className="ant-divider" />
            <a
              onClick={() => {
                dispatchAction({
                  payload: {
                    detailModalVisible: true,
                    rowSelectData: record,
                  },
                })
                dispatchAction({
                  type: 'getCertificates',
                  payload: {
                    certificateId: record.certificateId,
                  },
                })
              }}
            >
              回溯
            </a>
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
      type: 'getRegistList',
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
        dataSource={registDataSource}
        pagination={pagination}
        bordered
        onChange={handleChange}
        loading={!!effects['newCustomerCertificate/getRegistList']}
        rowKey="certificateId"
      />
    </div>
  )
}

Regist.propTypes = {
  effects: PropTypes.object.isRequired,
  registDataSource: PropTypes.array.isRequired,
  pagination: PropTypes.object.isRequired,
  searchData: PropTypes.object.isRequired,
  tabIndex: PropTypes.string.isRequired,
  allCustomerOptions: PropTypes.array.isRequired,
  debounceCusotmer: PropTypes.func.isRequired,
}

export default Regist
