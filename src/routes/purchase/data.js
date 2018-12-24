import React from 'react'
import { Modal, Tag } from 'antd'
import { debounce } from 'lodash'
import CustmTabelInfo from '../../components/CustmTabelInfo'
import getComponent from '../../components/GetFormItem/getComponent'
import { getOption, segmentation, getTreeItem, verticalContent } from '../../utils'
import { INVITE_TYPE } from '../../utils/constant'
import DropOption from './DropOption'
// editor:jarmey start
// import { getBasicFn } from '../../utils'
// const namespace = 'purchase'
// const { dispatchAction } = getBasicFn({ namespace })
// console.log(dispatchAction)
// editor:jarmey end
const noLabelLayout = {
  wrapperCol: { span: 22 },
}

const formData = (excludeArr = [], { suppliersSelect, onSearch }) =>
  [
    {
      layout: noLabelLayout,
      field: 'supplierOrgId',
      width: 220,
      component: {
        name: 'Select',
        props: {
          placeholder: '请选择供应商',
          showSearch: true,
          labelInValue: true,
          defaultActiveFirstOption: false,
          filterOption: false,
          notFoundContent: false,
          allowClear: true,
          onSearch: debounce(onSearch, 400),
          children: getOption(suppliersSelect, {
            idStr: 'supplierOrgId',
            nameStr: 'supplierOrgName',
            prefix: '供应商',
          }),
        },
      },
    },
    {
      layout: noLabelLayout,
      field: 'changeType',
      width: 220,
      options: {
        initialValue: null,
      },
      component: {
        name: 'Select',
        props: {
          optionLabelProp: 'title',
          children: getOption(
            [
              {
                id: null,
                name: '全部',
              },
              {
                id: '1',
                name: '新增',
              },
              {
                id: '2',
                name: '修改',
              },
            ],
            { prefix: '变更类型' },
          ),
        },
      },
    },
    {
      layout: noLabelLayout,
      field: 'platformAuthStatus',
      width: 220,
      options: { initialValue: null },
      component: {
        name: 'Select',
        props: {
          optionLabelProp: 'title',
          children: getOption(
            [
              {
                id: null,
                name: '全部',
              },
              {
                id: '1',
                name: '已认证',
              },
              {
                id: '2',
                name: '待认证',
              },
              {
                id: '3',
                name: '已忽略',
              },
            ],
            { prefix: '平台认证状态' },
          ),
        },
      },
    },
    {
      label: '',
      layout: { wrapperCol: { span: 23 } },
      field: 'keywords',
      width: 420,
      component: {
        name: 'Input',
        props: {
          placeholder: '物料名称/拼音码/规格型号/通用名称/省标编号/厂家/注册证号',
        },
      },
    },
  ].filter(({ field }) => !excludeArr.includes(field))

const baseColumns = ({ excludeArr = [], showCerticafite, tabStatus, showCerticaAudit }) =>
  [
    {
      title: '物资名称',
      dataIndex: 'materialsName',
      render(materialsName, { materialsCommenName }) {
        return (
          <CustmTabelInfo
            logoUrl="nil"
            otherInfo={[
              materialsName,
              <span className="aek-text-disable">{materialsCommenName}</span>,
            ]}
          />
        )
      },
    },
    {
      title: '单位/规格型号',
      dataIndex: 'materialsUnitText',
      render(materialsUnitText, { materialsSku }) {
        return segmentation([materialsUnitText, materialsSku], '/')
      },
    },
    {
      title: '供应商/厂家/注册证',
      dataIndex: 'supplierName',
      render(supplierName, {
        factoryName,
        supplierCertificateNo,
        certificateId,
        certificateStatus,
        supplierOrgId,
        customerOrgId,
      }) {
        let regist = ''
        /**
         * @desc 新增需求 待审核和已拒绝的情况下需要判断注册证的审核状态
         * 判断是类型 pendingReview 待审核 refused 已拒绝
         * @author wy 20180524
         * TODO 点击事件有待更改(已拒绝和待审核的点击事件)
         */
        const getStatus = () => {
          let retStatus = ''
          if (tabStatus === 'pendingReview' || tabStatus === 'refused') {
            switch (certificateStatus) {
              case 2:
                retStatus = (
                  <a
                    onClick={() => {
                      showCerticaAudit({ certificateId, supplierOrgId, customerOrgId })
                    }}
                  ><Tag color="#f50">已拒绝</Tag>{supplierCertificateNo}</a>
                )
                break
              case 3:
                retStatus = (
                  <a onClick={() => showCerticafite(certificateId, supplierOrgId)}><Tag color="#189A63">已通过</Tag>{supplierCertificateNo}</a>
                )
                break
              case 1:
                retStatus = (
                  <a onClick={() => {
                    showCerticaAudit({ certificateId, supplierOrgId, customerOrgId })
                  }}
                  >
                    <Tag color="#9A9B96">待审核</Tag>{supplierCertificateNo}
                  </a>
                )
                break
              case 5:
                retStatus = supplierCertificateNo
                break
              default:
                retStatus = supplierCertificateNo
                break
            }
          } else {
            retStatus = (<a onClick={() =>
              showCerticafite(certificateId, supplierOrgId)}
            >{supplierCertificateNo}</a>)
          }
          return retStatus
        }
        const status = getStatus()
        regist = certificateId ? status : supplierCertificateNo
        const array = [
          supplierName,
          factoryName,
        ]
        array.push(regist)
        return verticalContent(array)
      },
    },
    {
      title: '招标信息及价格',
      dataIndex: 'inviteType',
      render(inviteType, { inviteNo, price }) {
        return (
          <CustmTabelInfo
            logoUrl="nil"
            otherInfo={[
              segmentation([{ 1: '无', 2: '省标', 3: '市标', 4: '院标' }[inviteType], inviteNo]) ||
                '无招标信息',
              price,
            ]}
          />
        )
      },
    },
  ].filter(({ dataIndex }) => !excludeArr.includes(dataIndex))
// const showBarcode = text => text
const barcodeCol = ({ showBarcode }) => ({
  title: '条码数量',
  dataIndex: 'barcodeNumber',
  className: 'aek-text-center',
  render(text, { pscId }) {
    if (!!text && Number(text) > 0) {
      return <a onClick={() => showBarcode(pscId)}>{text}条</a>
    }
    return <span>0条</span>
    // return <a onClick={() => showBarcode(pscId)}>{text}条</a>
  },
})
// 使用中 已拒绝
const inUseColumns = ({
  editContact,
  more,
  tabStatus,
  showBarcode,
  showCerticafite,
  editButton,
  stopButton,
} = {}) => [
  ...baseColumns({ showCerticafite }),
  barcodeCol({ showBarcode }),
  {
    key: 'packageNumber',
    dataIndex: 'packageNumber',
    title: '包装/条码',
    width: 100,
    render: (value, record) => {
      console.log(record)
      // 维护条码
      let useType = 1
      return (
        <div>
          <p>
            包装：
            <a
              onClick={() => {
                dispatchAction({
                  type: 'purchase/updateState',
                  payload: {
                    rowSelectData: record,
                  },
                })
                dispatchAction({
                  type: 'purchase/getPackageList',
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
                  type: 'purchase/updateState',
                  payload: {
                    rowSelectData: record,
                  },
                })
                dispatchAction({
                  type: 'purchase/getPackageList',
                  payload: {
                    pscId: record.pscId,
                    useType: 1,
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
                  type: 'purchase/updateState',
                  payload: {
                    rowSelectData: record,
                  },
                })
                dispatchAction({
                  type: 'purchase/getCodeBarList',
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
                  type: 'purchase/updateState',
                  payload: {
                    rowSelectData: record,
                  },
                })
                dispatchAction({
                  type: 'purchase/getCodeBarList',
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
    title: '平台认证',
    dataIndex: 'platformAuthStatus',
    className: 'aek-text-center',
    width: 150,
    render(platformAuthStatus) {
      return {
        1: '已认证',
        2: '待认证',
        3: '已忽略',
      }[platformAuthStatus]
    },
  },
  {
    title: '最后修改时间',
    dataIndex: 'lastEditTime',
    className: 'aek-text-center',
    width: 200,
  },
  {
    title: '操作',
    dataIndex: 'operation',
    className: 'aek-text-center',
    width: 120,
    render: (text, all) => (
      <span>
        {editButton && (
          <span>
            <a
              onClick={() => {
                editContact(all)
              }}
            >
              编辑
            </a>
            <span className="ant-divider" />
          </span>
        )}
        <DropOption
          onMenuClick={(key) => {
            more(key, all)
          }}
          menuOptions={
            stopButton
              ? [
                {
                  key: 'maintain',
                  name: '维护包装',
                },
                {
                  key: 'stop',
                  name: tabStatus === 'inUse' ? '停用' : '启用',
                },
                {
                  key: 'history',
                  name: '修改历史',
                },
              ]
              : [
                {
                  key: 'maintain',
                  name: '维护包装',
                },
                {
                  key: 'history',
                  name: '修改历史',
                },
              ]
          }
        >
          <a>更多</a>
        </DropOption>
      </span>
    ),
  },
]
// 待审核
const pendingReviewColumns = ({
  itemChange,
  batchReceive,
  batchRefuse,
  seeChange,
  showBarcode,
  showCerticafite,
  tabStatus,
  showCerticaAudit,
}) => [
  {
    title: '变更类型',
    dataIndex: 'changeType',
    render(changeType, { pscId }) {
      return (
        <CustmTabelInfo
          logoUrl="nil"
          otherInfo={
            changeType < 2 ? (
              <p className="aek-green">新增</p>
            ) : (
              [
                <p className="aek-orange">修改</p>,
                <a
                  onClick={() => {
                    seeChange(pscId)
                  }}
                >
                  查看对比
                </a>,
              ]
            )
          }
        />
      )
    },
  },
  {
    title: '物资名称',
    dataIndex: 'materialsName',
    render(materialsName, { materialsCommenName, pscId }) {
      return (
        <CustmTabelInfo
          logoUrl="nil"
          otherInfo={[
            materialsName,
            getComponent({
              name: 'Input',
              props: {
                style: { width: 120, marginTop: 4 },
                placeholder: '通用名称',
                defaultValue: materialsCommenName,
                onChange: (e) => {
                  itemChange({
                    materialsCommenName: e.target.value,
                    pscId,
                  })
                },
              },
            }),
          ]}
        />
      )
    },
  },
  ...baseColumns({ excludeArr: ['materialsName', 'inviteType'], showCerticafite, tabStatus, showCerticaAudit }),
  {
    title: '招标信息',
    dataIndex: 'inviteType',
    className: 'aek-text-center',
    render(inviteType, { inviteNo, pscId }) {
      return (
        <span>
          {[
            getComponent(
              {
                name: 'Select',
                props: {
                  style: { width: 120, marginBottom: 6 },
                  defaultValue: inviteType ? String(inviteType) : '1',
                  children: getOption([
                    {
                      id: 1,
                      name: '无',
                    },
                    {
                      id: 2,
                      name: '省标',
                    },
                    {
                      id: 3,
                      name: '市标',
                    },
                    {
                      id: 4,
                      name: '院标',
                    },
                  ]),
                  onChange: (value) => {
                    itemChange({
                      inviteType: value - 0,
                      pscId,
                    })
                  },
                },
              },
              1,
            ),
            <br key={2} />,
            getComponent(
              {
                name: 'Input',
                props: {
                  style: { width: 120 },
                  placeholder: '招标编号',
                  defaultValue: inviteNo,
                  onChange: (e) => {
                    itemChange({
                      inviteNo: e.target.value,
                      pscId,
                    })
                  },
                },
              },
              3,
            ),
          ]}
        </span>
      )
    },
  },
  {
    title: (
      <span>
        <span className="aek-red">*</span>单价
      </span>
    ),
    dataIndex: 'price',
    className: 'aek-text-center',
    render: (price, { pscId }) =>
      getComponent({
        name: 'LkcInputNumber',
        props: {
          value: price,
          placeholder: '请输入',
          style: { width: 80 },
          min: 0,
          onChange: (value) => {
            itemChange({
              price: value ? String(value) : value,
              pscId,
            })
          },
        },
      }),
  },
  barcodeCol({ showBarcode }),
  {
    title: '修改时间',
    className: 'aek-text-center',
    dataIndex: 'lastEditTime',
  },
  {
    title: '操作',
    dataIndex: 'operation',
    className: 'aek-text-center',
    width: 120,
    render: (
      text,
      {
        pscId,
        changeType,
        price,
        materialsCommenName,
        inviteType,
        inviteNo,
        supplierOrgId,
        materialsSku,
        materialsName,
        materialsUnit,
        materialsUnitText,
      },
    ) => {
      const data = { pscId, changeType, price, materialsCommenName, inviteType, inviteNo, materialsUnit, materialsUnitText }
      return (
        <span>
          <a
            onClick={() => {
              batchReceive([data])
            }}
          >
            接收
          </a>
          <span className="ant-divider" />
          <a
            onClick={() => {
              batchRefuse({
                supplierOrgId,
                pscId,
                materialsSku,
                materialsName,
                changeTypeStr: { 1: '新增', 2: '修改' }[changeType],
              })
            }}
          >
            拒绝
          </a>
        </span>
      )
    },
  },
]
// 拒绝
const refusedColumns = ({ showBarcode, showCerticafite, tabStatus, showCerticaAudit }) => [
  {
    title: '序号',
    dataIndex: 'order',
    className: 'aek-text-center',
    width: 60,
  },
  ...baseColumns({ excludeArr: ['inviteType'], showCerticafite, tabStatus, showCerticaAudit }),
  {
    title: '招标信息及价格',
    dataIndex: 'inviteType',
    render(inviteType, { inviteNo, price }) {
      return (
        <CustmTabelInfo
          logoUrl="nil"
          otherInfo={[segmentation([INVITE_TYPE[inviteType], inviteNo]) || '无招标信息', price]}
        />
      )
    },
  },
  barcodeCol({ showBarcode }),
  {
    title: '拒绝时间',
    dataIndex: 'refuseTime',
    className: 'aek-text-center',
    width: 200,
  },
  {
    title: '拒绝原因',
    dataIndex: 'refuseReason',
  },
]

const historyColumns = viewModal => [
  {
    title: '版本号',
    dataIndex: 'historyId',
    key: 'historyId',
  },
  {
    title: '修改时间',
    dataIndex: 'lastEditTime',
    key: 'lastEditTime',
  },
  {
    title: '修改人',
    dataIndex: 'lastEditName',
    key: 'lastEditName',
  },
  {
    title: '审核人',
    dataIndex: 'reviewName',
    key: 'reviewName',
  },
  {
    title: '操作',
    key: 'action',
    width: 100,
    className: 'aek-text-center',
    render: (text, record) => <a onClick={() => viewModal(record)}>查看</a>,
  },
]

const addOrder = (arr, callback) =>
  arr.map((item, index) => {
    callback && callback(item, index)
    item.order = index + 1
    return item
  })

const getFormData = (type, suppliersSelect) =>
  ({
    inUse: formData(['changeType'], suppliersSelect),
    pendingReview: formData(['platformAuthStatus'], suppliersSelect),
    refused: formData(['changeType', 'platformAuthStatus'], suppliersSelect),
    disabled: formData(['changeType'], suppliersSelect),
  }[type])

const getColumns = (
  type,
  {
    editContact,
    more,
    tabStatus,
    itemChange,
    batchReceive,
    batchRefuse,
    seeChange,
    showBarcode,
    showCerticafite,
    editButton,
    stopButton,
    showCerticaAudit,
  },
) =>
  ({
    inUse: inUseColumns({ // 使用中
      editContact,
      more,
      tabStatus,
      showBarcode,
      showCerticafite,
      editButton,
      stopButton,
    }),
    pendingReview: pendingReviewColumns({ // 待审核
      itemChange,
      batchReceive,
      batchRefuse,
      seeChange,
      showBarcode,
      showCerticafite,
      tabStatus,
      showCerticaAudit,
    }),
    refused: refusedColumns({ showBarcode, showCerticafite, tabStatus, showCerticaAudit }), // 已拒绝
    disabled: inUseColumns({ // 已停用
      editContact,
      more,
      tabStatus,
      showBarcode,
      showCerticafite,
      editButton,
      stopButton,
    }),
  }[type])

const verify = (data, chgArr) => {
  const srq = data.map((item) => {
    const find = getTreeItem(chgArr, 'pscId', item.pscId)
    if (find) {
      return { ...item, ...find }
    }
    return item
  })
  let errorStr = ''
  for (let i = 0; i < srq.length; i++) {
    const item = srq[i]
    if (!item.price) {
      errorStr = 'price'
      break
    }
    if ((item.inviteType === 1) ^ !item.inviteNo) {
      errorStr = 'tender'
      break
    }
  }
  if (errorStr === 'price') {
    Modal.error({
      title: '请检查价格',
      content: '价格为必填项',
    })
    return false
  } else if (errorStr === 'tender') {
    Modal.error({
      title: '请检查招标信息',
      content: '招标方式、编号填写一项后，另一项必填',
    })
    return false
  }
  return srq
}

const rowsColumns = [
  {
    title: '物料名称',
    dataIndex: 'materialsName',
  },
  {
    title: '通用名称',
    dataIndex: 'materialsCommenName',
  },
  {
    title: '注册证号',
    dataIndex: 'certificateNo',
  },
  {
    title: '生产厂家',
    dataIndex: 'factoryName',
  },
  {
    title: '规格',
    dataIndex: 'materialsSku',
  },
  {
    title: '单位',
    dataIndex: 'materialsUnitText',
  },
  {
    title: '品牌',
    dataIndex: 'brandName',
  },
  {
    title: '招标信息',
    dataIndex: 'inviteType',
    render: (text, { inviteNo }) => segmentation([INVITE_TYPE[text], inviteNo], '：'),
  },
  {
    title: '单价',
    dataIndex: 'price',
  },
]

export default {
  addOrder,
  getFormData,
  getColumns,
  historyColumns,
  verify,
  rowsColumns,
}
