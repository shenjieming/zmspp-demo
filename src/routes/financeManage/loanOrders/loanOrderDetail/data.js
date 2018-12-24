import React from 'react'
import { formatNum, verticalContent, segmentation } from '../../../../utils'
import { tabInfoArr } from '../data'

const formStatusInfo = {
  // 运营后台
  financeManage: {
    [tabInfoArr[0].tabKey]: ['使用中', '请您在贷款订单到期之前作好提醒服务，避免顾客出现还款逾期现象'],
    [tabInfoArr[1].tabKey]: ['申请中', '顾客的贷款订单已成功提交，银行正在审核.....'],
    [tabInfoArr[2].tabKey]: ['申请失败'],
    [tabInfoArr[3].tabKey]: ['已结清', '感谢您的耐心服务，才能让顾客做的这么好.....'],
  },
  // 供应商
  financeLoan: {
    [tabInfoArr[0].tabKey]: ['使用中', '确保您账户信誉持续保持良好，请您在贷款到期之前还款......'],
    [tabInfoArr[1].tabKey]: ['申请中', '您的贷款支付申请已成功提交，请耐心等待银行审核......'],
    [tabInfoArr[2].tabKey]: ['申请失败'],
    [tabInfoArr[3].tabKey]: ['已结清', '感谢您按时还贷，良好的还贷记录会为您的账户信用加分哦！'],
  },
  // 银行
  financeAudit: {
    [tabInfoArr[0].tabKey]: ['使用中', '请您在贷款订单到期之前作好提醒服务，避免顾客出现还款逾期现象'],
    [tabInfoArr[1].tabKey]: ['申请中', '顾客的贷款订单已成功提交，请及时审核.....'],
    [tabInfoArr[2].tabKey]: ['申请失败'],
    [tabInfoArr[3].tabKey]: ['已结清', '感谢您的耐心服务，才能让顾客做的这么好.....'],
  },
}

// 还款信息
const refundColumns = view => [{
  title: '创建时间',
  dataIndex: 'addTime',
  className: 'aek-text-center',
}, {
  title: '还款申请编号',
  dataIndex: 'formNo',
  render: (formNo, { formId }) => <a onClick={() => { view(formId) }}>{formNo}</a>,
}, {
  title: '还款金额',
  dataIndex: 'repayAmount',
  className: 'aek-text-right',
  render: text => formatNum(text),
}, {
  title: '状态',
  dataIndex: 'formStatus',
  className: 'aek-text-center',
  render: status => ({
    1: '还款申请中',
    2: '申请失败',
    3: '还款成功',
    4: '还款失败',
  }[status]),
}]

// 入库单与发票信息
const stockListColumns = view => [{
  title: '序号',
  dataIndex: 'order',
  className: 'aek-text-center',
  width: 60,
  render: (_, __, idx) => idx + 1,
}, {
  title: '入库单号',
  dataIndex: 'formNo',
}, {
  title: '入库时间',
  dataIndex: 'stockInTime',
  className: 'aek-text-center',
}, {
  title: '入库单金额',
  dataIndex: 'formAmount',
  className: 'aek-text-right',
  render: text => formatNum(text),
}, {
  title: '可贷金额',
  dataIndex: 'balance',
  className: 'aek-text-right',
  render: text => formatNum(text),
}, {
  title: '明细',
  dataIndex: 'formId',
  className: 'aek-text-center',
  width: 100,
  render: formId => (
    <a onClick={() => view(formId)}>查看</a>
  ),
}]

const getName = (urlStr = '') => {
  const firstIdx = urlStr.lastIndexOf('/')
  const fendIdx = urlStr.lastIndexOf('.')
  if (firstIdx > 0 && fendIdx > 0) {
    return urlStr.substring(firstIdx + 1, fendIdx + 4)
  }
  return urlStr
}

// 发票信息
const invoiceColumns = view => [{
  title: '序号',
  dataIndex: 'order',
  className: 'aek-text-center',
  width: 60,
  render: (_, __, idx) => idx + 1,
}, {
  title: '发票号码',
  dataIndex: 'invoiceNo',
}, {
  title: '发票金额',
  dataIndex: 'invoiceAmount',
  className: 'aek-text-right',
  render: text => formatNum(text),
}, {
  title: '发票日期',
  dataIndex: 'invoiceDate',
  className: 'aek-text-center',
}, {
  title: '发票名称',
  dataIndex: 'invoiceUrl',
  render: url => (
    <a onClick={() => view(url)}>{getName(url)}</a>
  ),
}]

// 入库单明细
const modalColumns = [{
  title: '产品名称/规格',
  dataIndex: 'goodsName',
  render: (goodsName, { specSize }) => verticalContent([goodsName, specSize]),
}, {
  title: '单价',
  dataIndex: 'stockInPrice',
  className: 'aek-text-right',
  render: text => formatNum(text),
}, {
  title: '数量/单位',
  dataIndex: 'stockInQty',
  className: 'aek-text-center',
  render: (stockInQty, { specUnit }) => segmentation([stockInQty, specUnit], '/'),
}, {
  title: '厂家',
  dataIndex: 'factoryName',
}, {
  title: '产品品牌',
  dataIndex: 'specBrand',
}, {
  title: '发票号码',
  dataIndex: 'invoiceNo',
}]

// 操作记录
const operationRecordListColumns = [{
  title: '操作类型',
  dataIndex: 'operationTypeDiscription',
}, {
  title: '操作人',
  dataIndex: 'operationByName',
  className: 'aek-text-right',
}, {
  title: '操作时间',
  dataIndex: 'operationTime',
  className: 'aek-text-center',
}, {
  title: '备注',
  dataIndex: 'remark',
}]

export default {
  formStatusInfo,
  refundColumns,
  stockListColumns,
  invoiceColumns,
  modalColumns,
  operationRecordListColumns,
  tabInfoArr,
}
