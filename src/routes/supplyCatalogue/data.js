import React from 'react'
import { Menu, Dropdown, Icon } from 'antd'
import { concat } from 'lodash'
import { getBasicFn } from '../../utils'


const namespace = 'supplyCatalogueDetail'
const { dispatchAction } = getBasicFn({ namespace })

const getOpera = (status, handleMenuClick, customerDetail) => [
  {
    key: 'operation',
    dataIndex: 'operation',
    title: '操作',
    width: 100,
    fixed: 'right',
    className: 'aek-text-center',
    render: (value, record) => {
      /** @description 省立同德不允许维护条码
       * true 允许维护；false 不允许维护
       * barcodeManageFlag
       *
      */

      const { barcodeManageFlag } = customerDetail
      const menu = val => (
        <Menu onClick={({ key }) => {
          handleMenuClick(key, record)
        }}
        >
          {val === '5' && <Menu.Item key="7">删除</Menu.Item>}
          <Menu.Item key="1">维护包装</Menu.Item>
          {barcodeManageFlag && <Menu.Item key="2">条码维护</Menu.Item>}
          {/* <Menu.Item key="3">绑定注册证</Menu.Item> */}
          <Menu.Item key="4">修改历史</Menu.Item>
        </Menu>
      )
      let retArr
      const getRetArr = (val) => {
        // 使用中 已拒绝 待推送
        if (val === '2') {
          retArr = (
            <span>
              <a
                onClick={() => {
                  handleMenuClick('6', record)
                }}
              >
              撤销
              </a>
              <span className="ant-divider" />
              <Dropdown overlay={menu(val)}>
                <a>
                  更多<Icon type="down" />
                </a>
              </Dropdown>
            </span>
          )
        } else if (val === '2' || val === '3' || val === '5' ) {
          retArr = (
            <span>
              <a
                onClick={() => {
                  handleMenuClick('5', record)
                }}
              >
                编辑
              </a>
              <span className="ant-divider" />
              <Dropdown overlay={menu(val)}>
                <a>
                  更多<Icon type="down" />
                </a>
              </Dropdown>
            </span>
          )
        } else if (val === '1') {
          retArr = (
            <span>
              <Dropdown overlay={menu(val)}>
                <a>
                  更多<Icon type="down" />
                </a>
              </Dropdown>
            </span>
          )
        } else { // 已停用
          retArr = (
            <span>
              <a onClick={() => {
                handleMenuClick('4', record)
              }}
              >修改历史</a>
            </span>
          )
        }
      }
      if (status !== '6') {
        getRetArr(status)
      } else {
        getRetArr(`${record.pscStatus}`)
      }
      return retArr
    },
  },
]

const tableColumns = ({ tabIndex, handleMenuClick, customerDetail }) => {
  const getTitle = (index) => {
    let retStr = ''
    switch (index) {
      case '3':
        retStr = '拒绝时间'
        break
      case '4':
        retStr = '停用时间'
        break
      default:
        retStr = '修改时间'
        break
    }
    return retStr
  }


  const base = [{
    key: 'productCode',
    dataIndex: 'productCode',
    title: '产品编号',
    width: 105,
  },
  {
    key: 'materialsName',
    dataIndex: 'materialsName',
    title: '物资名称',
  },
  {
    key: 'materialsSku',
    dataIndex: 'materialsSku',
    title: '规格型号',
    width: 130,
  },
  {
    key: 'commenName',
    dataIndex: 'commenName',
    title: '通用名称',
    width: 200,
  },
  {
    title: '单位',
    dataIndex: 'materialsUnitText',
    key: 'materialsUnitText',
    width: 40,
  },
  {
    title: '生产厂家',
    dataIndex: 'factoryName',
    key: 'factoryName',
  },
  {
    key: 'certificateNo',
    dataIndex: 'certificateNo',
    title: '注册证',
  },
  {
    key: 'brandName',
    title: '品牌',
    dataIndex: 'brandName',
    width: 55,
  },
  // {
  //   key: 'inviteType',
  //   title: '招标信息',
  //   dataIndex: 'inviteType',
  //   width: 100,
  //   render(value, record) {
  //     let str = ''
  //     switch (value) {
  //       case 1:
  //         str = '无招标信息'
  //         break
  //       case 2:
  //         str = '省标'
  //         break
  //       case 3:
  //         str = '市标'
  //         break
  //       case 4:
  //         str = '院标'
  //         break
  //       default:
  //         break
  //     }
  //     return (
  //       <p>{value === 1 ? str : `${str}-${record.inviteNo}`}</p>
  //     )
  //   },
  // },
  {
    key: 'packageNumber',
    dataIndex: 'packageNumber',
    title: '包装/条码',
    width: 100,
    render: (value, record) => {
      // 维护条码
      let useType = ''
      if (tabIndex !== '6') {
        useType = (tabIndex === '2' || tabIndex === '3') ? 0 : 1
      } else {
        useType = (record.pscStatus === 2 || record.pscStatus === 3) ? 0 : 1
      }
      return (
        <div>
          <p>
            包装：
            <a
              onClick={() => {
                dispatchAction({
                  type: 'supplyCatalogueDetail/updateState',
                  payload: {
                    rowSelectData: record,
                  },
                })
                dispatchAction({
                  type: 'supplyCatalogueDetail/getPackageList',
                  payload: {
                    pscId: record.pscId,
                    useType,
                  },
                })
              }}
            >{value || 0}</a>
            <a
              className="aek-pl10"
              onClick={() => {
                dispatchAction({
                  type: 'supplyCatalogueDetail/updateState',
                  payload: {
                    rowSelectData: record,
                  },
                })
                dispatchAction({
                  type: 'supplyCatalogueDetail/getPackageList',
                  payload: {
                    pscId: record.pscId,
                    useType: tabIndex === '2' || tabIndex === '3' ? 0 : 1,
                  },
                })
              }}
            >
              维护
            </a>
          </p>
          <p>
              条码：
            <a
              onClick={() => {
                dispatchAction({
                  type: 'supplyCatalogueDetail/updateState',
                  payload: {
                    rowSelectData: record,
                  },
                })
                dispatchAction({
                  type: 'supplyCatalogueDetail/getCodeBarList',
                  payload: {
                    pscId: record.pscId,
                  },
                })
              }}
            >{record.barcodeNumber || 0}</a>
            <a
              className="aek-pl10"
              onClick={() => {
                dispatchAction({
                  type: 'supplyCatalogueDetail/updateState',
                  payload: {
                    rowSelectData: record,
                  },
                })
                dispatchAction({
                  type: 'supplyCatalogueDetail/getCodeBarList',
                  payload: {
                    pscId: record.pscId,
                  },
                })
              }}
            >
                维护
            </a>
          </p>
        </div>
      )
    },
  },
  {
    key: 'lastEditTime',
    dataIndex: 'lastEditTime',
    width: 150,
    title: getTitle(tabIndex),
  }]
  const opeartion = getOpera(tabIndex, handleMenuClick, customerDetail)
  const all = concat(base, opeartion)
  let retArr = []
  if (tabIndex === '4' || tabIndex === '5') {
    retArr = all.filter((items) => {
      if (items.key === 'commenName' || items.key === 'brandName') {
        return false
      }
      return true
    })
  } else if (tabIndex === '3') {
    const other = [{
      key: 'refuseReason',
      dataIndex: 'refuseReason',
      title: '拒绝原因',
      width: 150,
    }]
    const arr = base.filter((items) => {
      if (items.key === 'commenName' || items.key === 'brandName') {
        return false
      }
      return true
    })
    retArr = concat(arr, other, opeartion)
  } else if (tabIndex === '6') {
    retArr = all.filter((items) => {
      if (items.key === 'commenName' || items.key === 'brandName') {
        return false
      }
      return true
    })
    const arr = concat([{
      key: 'pscStatus',
      title: '状态',
      dataIndex: 'pscStatus',
      render(text) {
        let str = ''
        switch (text) {
          case 1:
            str = '使用中'
            break
          case 2:
            str = '待审核'
            break
          case 3:
            str = '已拒绝'
            break
          case 4:
            str = '已停用 '
            break
          default:
            str = '待推送'
            break
        }
        return str
      },
    }], retArr)
    retArr = arr
  } else {
    retArr = all
  }
  // retArr.push({
  //   headConfigFlag: true,
  //   key: 'ope',
  //   dataIndex: 'ope',
  // })
  return retArr
}

export default {
  tableColumns,
}
