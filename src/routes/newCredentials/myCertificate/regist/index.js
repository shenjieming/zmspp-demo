import React from 'react'
import PropTypes from 'prop-types'
import { Table, Input, Menu, Dropdown, Icon } from 'antd'
import { find } from 'lodash'
import SearchForm from '../../../../components/SearchFormFilter'
import { getOption } from '../../../../utils'
import { MATERIALS_CERTIFICATE_TYPE } from '../../../../utils/constant'

const noLabelLayout = {
  wrapperCol: { span: 22 },
}
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
}
function Regist({
                  editFlag,
  effects,
  dispatch,
  registDataSource,
  pagination,
  searchData,
  tabIndex,
  showConfirm,
  registTypeList,
}) {
  const searchProps = {
    formData: [{
      layout: noLabelLayout,
      field: 'certificateStatus',
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
            id: '0',
            name: '启用',
          }, {
            id: '1',
            name: '停用',
          }], { prefix: '证件状态' }),
        },
      },
    },
    {
      layout: noLabelLayout,
      field: 'platformAuthStatus',
      width: 220,
      options: {
        initialValue: searchData.platformAuthStatus || null,
      },
      component: {
        name: 'Select',
        props: {
          optionLabelProp: 'title',
          children: getOption([{
            id: null,
            name: '全部',
          }, {
            id: '2',
            name: '已认证',
          }, {
            id: '1',
            name: '待审核',
          }, {
            id: '3',
            name: '未通过',
          }], { prefix: '认证状态 ' }),
        },
      },
    },
    {
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
          }, ...registTypeList.map(item => ({ id: item.dicValue, name: item.dicValueText }))], { prefix: '证件类型 ' }),
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
      dispatch({
        type: 'newMyCertificate/getRegistList',
        payload: {
          ...value,
          current: 1,
          pageSize: 10,
        },
      })
    },
    advancedForm: [
      {
        layout: formItemLayout,
        label: '状态',
        field: 'certificateStatus',
        options: {
          initialValue: null,
        },
        component: {
          name: 'Select',
          props: {
            children: getOption([{
              id: null,
              name: '全部',
            }, {
              id: '0',
              name: '启用',
            }, {
              id: '1',
              name: '停用',
            }]),
          },
        },
      },
      {
        layout: formItemLayout,
        label: '认证状态',
        field: 'platformAuthStatus',
        options: {
          initialValue: null,
        },
        component: {
          name: 'Select',
          props: {
            children: getOption([{
              id: null,
              name: '全部',
            }, {
              id: '2',
              name: '已认证',
            }, {
              id: '1',
              name: '待审核',
            }, {
              id: '3',
              name: '未通过',
            }]),
          },
        },
      },
      {
        label: '证件类型',
        layout: formItemLayout,
        field: 'certificateType',
        component: {
          name: 'Select',
          props: {
            children: getOption([{
              id: null,
              name: '全部',
            }, ...MATERIALS_CERTIFICATE_TYPE]),
          },
        },
        options: {
          initialValue: null,
        },
      },
      {
        layout: formItemLayout,
        label: '是否进口',
        field: 'importedFlag',
        options: {
          initialValue: null,
        },
        component: {
          name: 'Select',
          props: {
            children: getOption([{
              id: null,
              name: '全部',
            }, {
              id: '1',
              name: '进口',
            }, {
              id: '0',
              name: '国内',
            }]),
          },
        },
      },
      {
        layout: formItemLayout,
        label: '全部效期',
        field: 'validDate',
        options: {
          initialValue: null,
        },
        component: {
          name: 'Select',
          props: {
            children: getOption([{
              id: null,
              name: '全部',
            }, {
              id: '1',
              name: '已过期',
            }, {
              id: '2',
              name: '一个星期内',
            }, {
              id: '3',
              name: '一个月内',
            }, {
              id: '4',
              name: '三个月内',
            }, {
              id: '5',
              name: '六个月内',
            }]),
          },
        },
      },
      {
        layout: formItemLayout,
        label: '关键字',
        field: 'keywords',
        options: {
          initialValue: null,
        },
        component: {
          name: 'Input',
          props: {
            placeholder: '注册证号/产品名称/厂家',
          },
        },
      },
    ],
  }

  const getCertificateType = (value) => {
    // const retStr = ''
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

    // registTypeList

    const obj = find(registTypeList, item => `${value}` === item.dicValue)

    return obj.dicValueText
  }
  const columns = [
    {
      key: 'index',
      dataIndex: 'index',
      title: '序号',
      className: 'aek-text-center',
      render: (value, record, index) => index + 1,
    },
    {
      key: 'certificateType',
      dataIndex: 'certificateType',
      title: '证件类型',
      render: value => getCertificateType(value),
    },
    {
      key: 'certificateNo',
      dataIndex: 'certificateNo',
      title: '注册证号/产品名称',
      render: (value, record) => (<span>
        <p>{value}</p>
        <p>{record.productName}</p>
        {record.replacedFlag ?
          <p>
            有新证<a
              onClick={() => {
                dispatch({
                  type: 'newMyCertificate/updateState',
                  payload: {
                    modalTitle: '查看注册证',
                    viewRegistModalVisible: true,
                  },
                })
                dispatch({
                  type: 'newMyCertificate/getRegistViewDetail',
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
      title: '有效期至',
      render: (value, record) => {
        let dom
        const replace = () => (<span>
          {record.replacedFlag ? <p className="aek-red">(已换证,<a onClick={() => {
            dispatch({
              type: 'newMyCertificate/updateState',
              payload: {
                modalTitle: '查看注册证',
                viewRegistModalVisible: true,
                status: 3,
              },
            })
            dispatch({
              type: 'newMyCertificate/getRegistViewDetail',
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
            const oldDate = new Date(new Date(record.delayedDateEnd).getTime() + (24 * 60 * 60 * 1000)).getTime()
            const todayDate = new Date().getTime()
            if (oldDate < todayDate) {
              dom = (<p className="aek-text-disable">{`${record.validDateStart}延期至${record.delayedDateEnd}`}<span className="aek-red">（已过期）</span></p>)
            } else {
              dom = <p>{`${record.validDateStart}延期至${record.delayedDateEnd}`}</p>
            }
          }
          if (!record.delayedFlag) {
            const oldDate = new Date(new Date(record.validDateEnd).getTime() + (24 * 60 * 60 * 1000)).getTime()
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
      title: '生产厂家',
      render: (value, record) => (<span>
        <p>{value}</p>
        {record.importedFlag ? `总代：${record.agentSupplierName}` : ''}
      </span>),
    },
    {
      key: 'certificateStatus',
      dataIndex: 'certificateStatus',
      title: '状态',
      render: (value) => {
        let str = ''
        if (value) {
          str = '停用'
        } else {
          str = '启用'
        }
        return str
      },
    },
    {
      key: 'platformAuthStatus',
      dataIndex: 'platformAuthStatus',
      title: '平台认证状态',
      className: 'aek-text-center',
      render: (value) => {
        let str = ''
        switch (value) {
          case 1:
            str = '待审核'
            break
          case 2:
            str = '已认证'
            break
          default:
            str = '未通过'
            break
        }
        return str
      },
    },
    {
      key: 'operation',
      dataIndex: 'operation',
      title: '操作',
      width: 150,
      className: 'aek-text-center',
      render: (value, record) => {
        // 下拉按钮点击事件
        const handleMenuClick = (val) => {
          const key = val.key
          dispatch({
            type: 'newMyCertificate/updateState',
            payload: {
              modalTitle: '换证',
              rowSelectData: record,
            },
          })
          switch (key) {
            case '1':
              dispatch({
                type: 'newMyCertificate/updateState',
                payload: {
                  registDetailVisible: true,
                  step: 1,
                  status: 3,
                  firstFormData: {
                    oldCertificateId: record.certificateId,
                    oldCertificateNo: record.certificateNo,
                    certificateType: {
                      label: getCertificateType(record.certificateType),
                      key: `${record.certificateType}`,
                    },
                  },
                },
              })
              break
            case '2':
              dispatch({
                type: 'newMyCertificate/updateState',
                payload: {
                  modalTitle: '延期',
                  registDelaylVisible: true,
                },
              })
              break
            default:
              showConfirm({
                content: record.certificateStatus ? '确定要启用该证件吗？' : '确定要停用该证件吗？',
                handleOk() {
                  dispatch({
                    type: 'newMyCertificate/setRegistStatus',
                    payload: {
                      certificateIds: record.certificateId,
                      certificateStatus: !record.certificateStatus,
                    },
                  })
                },
              })
              break
          }
        }
        // 下拉按钮
        const menu = (
          <Menu onClick={handleMenuClick}>
            {!record.replacedFlag ? <Menu.Item key="1">更换新证</Menu.Item> : undefined}
            {record.delayedFlag || record.validDateLongFlag ? '' : <Menu.Item key="2">延期</Menu.Item>}
            <Menu.Item key="3">{record.certificateStatus ? '启用' : '停用'}</Menu.Item>
          </Menu>
        )

        const platformAuthStatus = record.platformAuthStatus
        if (editFlag == 0) {
          return (
            <span>
              {platformAuthStatus !== 2 &&
              <span>
                <span className="ant-divider" />
                <a
                  onClick={() => {
                    showConfirm({
                      content: '确定要删除该证件吗？',
                      handleOk() {
                        dispatch({
                          type: 'newMyCertificate/deleteRegist',
                          payload: {
                            certificateId: record.certificateId,
                          },
                        })
                      },
                    })
                  }}
                >删除</a>
              </span>
              }
          </span>
          )
        } else {
          return (
            <span>
            <a
              onClick={() => {
                const title = '编辑注册证'
                const url = 'newMyCertificate/getRegistDetaiList'
                const reqData = {
                  certificateId: record.certificateId,
                }
                dispatch({
                  type: 'newMyCertificate/updateState',
                  payload: {
                    rowSelectData: record,
                    modalTitle: title,
                    step: 2,
                    status: 2,
                    registDetailVisible: true,
                  },
                })
                dispatch({
                  type: url,
                  payload: reqData,
                })
              }}
            >编辑</a>
              {platformAuthStatus !== 2 &&
              <span>
                <span className="ant-divider" />
                <a
                  onClick={() => {
                    showConfirm({
                      content: '确定要删除该证件吗？',
                      handleOk() {
                        dispatch({
                          type: 'newMyCertificate/deleteRegist',
                          payload: {
                            certificateId: record.certificateId,
                          },
                        })
                      },
                    })
                  }}
                >删除</a>
              </span>
              }
              {
                platformAuthStatus === 2 &&
                <span>
                <span className="ant-divider" />
                <Dropdown overlay={menu} >
                  <a>
                更多<Icon type="down" />
                  </a>
                </Dropdown>
              </span>
              }
          </span>
          )
        }

      },
    },
  ]
  // 翻页
  const handleChange = (value) => {
    dispatch({
      type: 'newMyCertificate/getRegistList',
      payload: {
        ...searchData,
        ...value,
      },
    })
  }
  return (
    <div>
      <SearchForm key={tabIndex} {...searchProps} />
      <Table
        columns={columns}
        dataSource={registDataSource}
        pagination={pagination}
        bordered
        onChange={handleChange}
        loading={!!effects['newMyCertificate/getRegistList']}
        rowKey="certificateId"
      />
    </div>
  )
}

Regist.propTypes = {
  effects: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  registDataSource: PropTypes.array.isRequired,
  pagination: PropTypes.object.isRequired,
  searchData: PropTypes.object.isRequired,
  tabIndex: PropTypes.string.isRequired,
  showConfirm: PropTypes.func.isRequired,
  registTypeList: PropTypes.array,
}

export default Regist
