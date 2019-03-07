import React from 'react'
import Decimal from 'decimal.js-light'
import { concat, uniqBy } from 'lodash'
import { thousandSplit, formatNum } from '../../../../../utils'

const formExcludeType = ['invoiceNo', 'invoiceDate', 'remark'] // 跟台发货需要过滤的字段
const genColumns = ({ formType, personalColumns }) => {
  const base = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      render: (text, _, index) => index + 1,
    },
    {
      title: '注册证名称',
      dataIndex: 'materialsName',
      key: 'materialsName',
    },
    {
      title: '规格型号',
      dataIndex: 'materialsSku',
      key: 'materialsSku',
    },
    {
      title: '批号',
      dataIndex: 'batchNo',
      key: 'batchNo',
    },
    // {
    //   title: '跟踪码',
    //   dataIndex: 'trackCode',
    //   key: 'trackCode',
    // },
    {
      title: '单价',
      dataIndex: 'materialsPrice',
      key: 'materialsPrice',
      render: text => <span>{formatNum(text, { unit: '', format: false })}</span>,
    },
    {
      title: '数量',
      dataIndex: 'deliverQty',
      key: 'deliverQty',
    },
    {
      title: '单位',
      dataIndex: 'skuUnitText',
      key: 'skuUnitText',
    },
    {
      title: '金额',
      dataIndex: 'concatPrice',
      key: 'concatPrice',
      render: (text, { deliverQty, materialsPrice }) => (
        <span>{thousandSplit(new Decimal(materialsPrice).times(deliverQty))}</span>
      ),
    },

    {
      title: '有效期',
      dataIndex: 'expiredDate',
      key: 'expiredDate',
    },
    {
      title: '注册证号',
      dataIndex: 'certificateNo',
      key: 'certificateNo',
    },
  ]
  const remarkRender = (_, { rowSpan, implantType, waitDeliverQty }) => {
    const getNumText = () => {
      if (!Number(waitDeliverQty)) {
        return ''
      }
      const absoluteValue = Math.abs(Number(waitDeliverQty))
      if (Number(waitDeliverQty) > 0) {
        return `剩${absoluteValue}`
      }
      return `多${absoluteValue}`
    }
    const getType = () => {
      let retStr = ''
      if (implantType !== undefined) {
        switch (implantType) {
          case 0:
            retStr = '跟台材料'
            break
          case 1:
            retStr = '植入材料'
            break
          case 2:
            retStr = '非植入材料'
            break
          case 3:
            retStr = '普耗'
            break
          default:
            retStr = ''
            break
        }
      }
      return retStr
    }
    const num = getNumText()
    const type = getType()
    return {
      children: <span>{num && type ? `${num},${type}` : `${num}${type}`}</span>,
      props: { rowSpan },
    }
  }
  const other = [
    {
      title: '生产厂家',
      dataIndex: 'factoryName',
      key: 'factoryName',
    },
    // {
    //   title: '省标编号',
    //   dataIndex: 'inviteNo',
    //   key: 'inviteNo',
    // },
    {
      title: '发票号码',
      dataIndex: 'invoiceNo',
      key: 'invoiceNo',
      exclude: Number(formType) !== 1,
    },
    {
      title: '发票日期',
      dataIndex: 'invoiceDate',
      key: 'invoiceDate',
      exclude: Number(formType) !== 1,
    },
    {
      title: '备注',
      key: 'remark',
      exclude: Number(formType) === 3,
      render: remarkRender,
    },
  ]
  let retArray = []
  if (personalColumns && personalColumns.length) {
    const newArr = personalColumns.map((item) => {
      const obj = {
        title: item.printValue,
      }
      obj.dataIndex = item.printKey
      obj.key = item.printKey
      // 跟台
      if (Number(formType) === 3) {
        if (formExcludeType.indexOf(item.printKey) > -1) {
          obj.exclude = true
        }
      } else if (Number(formType) !== 1) {
        // 普耗
        if (['invoiceNo', 'invoiceDate'].indexOf(item.printKey) > -1) {
          obj.exclude = true
        }
      }
      if (['remark'].indexOf(item.printKey) > -1) {
        obj.render = remarkRender
      }
      return obj
    })
    retArray = concat(base, newArr)
  } else {
    retArray = concat(base, other)
  }
  return uniqBy(retArray.filter(item => !item.exclude), 'key')
}

const getDetailData = (detailPageData, personalColumns) => {
  const {
    customerOrgName,
    formAmount,
    formType,
    originalFormNo,
    deliverRemark,
    purchaseName,
    purchaseTime,
    senderName,
    senderPhone,
    senderTime,
    receiveOrgName,
    receiveDeptName,
    purchaseRemark,
    formQty,
  } = detailPageData

  let purchaseRemarkData = {}
  if (purchaseRemark) {
    purchaseRemarkData = {
      '采购备注|fill': <span className="aek-word-break">{purchaseRemark}</span>,
    }
  }
  const commonData = {
    合计金额: <span>¥{formAmount}</span>,
    发货人: senderName,
    联系电话: senderPhone,
    发货时间: senderTime,
    '发货备注|colspan-2': (
      <span className="aek-word-break">
        <span className="aek-mr-20">合计发货数量 （{formQty}）</span>
        {deliverRemark}
      </span>
    ),
    ...purchaseRemarkData,
  }
  let purchaseNameData = {}
  if (personalColumns.find(itm => itm.printKey === 'purchaseName')) {
    purchaseNameData = {
      采购人: purchaseName,
    }
  }
  if (Number(formType) !== 3) {
    // 普耗--寄销配送明细
    return {
      客户名称: customerOrgName,
      客户订单号: originalFormNo,
      ...purchaseNameData,
      采购时间: purchaseTime,
      ...commonData,
    }
  }
  // 跟台--配送明细
  return {
    客户名称: receiveOrgName,
    科室: receiveDeptName,
    ...commonData,
  }
}
export default {
  genColumns,
  getDetailData,
}
