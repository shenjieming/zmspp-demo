import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Spin } from 'antd'
import { find } from 'lodash'
import PlainForm from '../../../../components/PlainForm'

const propTypes = {
  dispatchAction: PropTypes.func,
  getLoading: PropTypes.func,
  viewModalVisible: PropTypes.bool,
  viewCurrentData: PropTypes.object,
  registTypeList: PropTypes.array,
}
const certificateTypeStr = (value, registTypeList) => {
  const obj = find(registTypeList, item => Number(value) === Number(item.dicValue))
  return obj && obj.dicValueText
}
const ViewModal = (
  {
    viewCurrentData,
    viewModalVisible,
    dispatchAction,
    getLoading,
    registTypeList,
  }) => {
  const {
    certificateStatus,
    afterSaleAddress, // 售后服务地址
    afterSaleService, // 售后服务商
    applicableScope, // 适用范围
    certificateImageUrls, // 注册证图片地址
    certificateNo, // 注册证编号
    certificateSku, // 注册证规格
    certificateType, // 证件类型
    certificateVersionCode, // 注册证版本号
    customerServiceHotline, // 客服热线
    delayedCertificateNo, // 延期注册证号
    delayedDateEnd, // 延期结束日期
    delayedFlag, // 是否延期
    importedFlag, // 是否进口
    lastEditName, // 最后编辑人
    lastEditTime, // 最后编辑时间
    legalManufacturer, // 法定制造商
    performanceComposition, // 产品性能结构及构成
    produceAddress, // 生产地址
    produceFactoryAliasName, // 生产厂家别名
    producePlaceAddress, // 生产场所地址
    productContraindications, // 产品禁忌症
    productEnglishName, // 产品英文名称
    productName, // 产品名称
    productStandardNo, // 产品标准编号
    registerAddress, // 注册地址
    registerAgent, // 注册代理
    registerNo, // 注册号
    remark, // 备注
    replacedFlag, // 是否换证
    reviewOrgName, // 审核单位
    validDateEnd, // 有效期结束日期
    validDateLongFlag, // 是否长期有效
    validDateStart, // 有效期起始日期
    produceFactoryName, // 生产企业
    agentSupplierName, // 总代
    replacedCertificateNo, // 新证号
  } = viewCurrentData
  const modalOpts = {
    title: '查看',
    visible: viewModalVisible,
    onCancel() {
      dispatchAction({
        payload: {
          viewModalVisible: false,
        },
      })
    },
    width: 800,
    footer: false,
    maskClosable: true,
    wrapClassName: 'aek-modal',
  }
  let timeStr = ''
  if (validDateLongFlag) {
    timeStr = `${validDateStart} 至 长期有效`
  } else if (delayedFlag) {
    timeStr = `${validDateStart} 至 ${delayedDateEnd}`
  } else {
    timeStr = `${validDateStart} 至 ${validDateEnd}`
  }
  const otherFile = {
    '证件类型|fill': certificateType && certificateTypeStr(certificateType, registTypeList),
    证号: certificateNo,
    产品名称: productName,
    状态: certificateStatus ? '停用' : '启用',
    有效期: timeStr,
    生产企业: produceFactoryName,
    最后编辑人: lastEditName,
    最后编辑时间: lastEditTime,
    '注册证版本号|fill': certificateVersionCode,
    '证件图片|img': certificateImageUrls,
  }
  const regFile = {
    '证件类型|fill': certificateType && certificateTypeStr(certificateType, registTypeList),
    证号: certificateNo,
    产品名称: productName,
    状态: certificateStatus ? '停用' : '启用',
    '有效期|fill': timeStr,
    标准生产企业: produceFactoryName,
    注册证生产企业: produceFactoryAliasName,
    是否进口: importedFlag ? '是' : '否',
    总代: agentSupplierName,
    '延期标识|fill': delayedFlag ? '是' : '否',
    延期证号: delayedCertificateNo,
    延期至: delayedDateEnd,
    换证标识: replacedFlag ? '是' : '否',
    新证号: replacedCertificateNo,
    产品英文名称: productEnglishName,
    'REG,NO': registerNo,
    '注册地址|fill': registerAddress,
    法定制造商: legalManufacturer,
    '生产地址（厂商）': produceAddress,
    生产场所地址: producePlaceAddress,
    售后服务商: afterSaleService,
    产品标准编号: productStandardNo,
    产品禁忌症: productContraindications,
    客服热线: customerServiceHotline,
    售后服务地址: afterSaleAddress,
    注册代理: registerAgent,
    审核单位: reviewOrgName,
    注册证规格: certificateSku,
    适用范围: applicableScope,
    备注: remark,
    产品性能结构及构成: performanceComposition,
    '最后编辑人|fill': lastEditName,
    '最后编辑时间|fill': lastEditTime,
    '注册证版本号|fill': certificateVersionCode,
    '证件图片|img': certificateImageUrls,
  }
  return (
    <Modal {...modalOpts}>
      <Spin spinning={getLoading('getCertNoDetail')}>
        <PlainForm
          data={Number(certificateType) !== 1 ? otherFile : regFile}
        />
      </Spin>
    </Modal>
  )
}
ViewModal.propTypes = propTypes
export default ViewModal
