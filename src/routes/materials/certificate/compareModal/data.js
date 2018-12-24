import React from 'react'
import { find } from 'lodash'

const certificateTypeStr = (value, registTypeList) => {
  const obj = find(registTypeList, item => Number(value) === Number(item.dicValue))
  return obj && obj.dicValueText
}
export default {
  genList(arr, registTypeList) {
    const [
      {
        certificateStatus,
        afterSaleAddress, // 售后服务地址
        afterSaleService, // 售后服务商
        agentSupplierName, // 代理商名称
        applicableScope, // 适用范围
        certificateImageUrls, // 注册证图片地址
        certificateNo, // 注册证编号
        certificateSku, // 注册证规格
        certificateType, // 注册证类型
        customerServiceHotline, // 客服热线
        delayedCertificateNo, // 延期注册证号
        delayedDateEnd, // 延期结束日期
        delayedFlag, // 是否延期,
        importedFlag, // 是否进口,
        legalManufacturer, // 法定制造商
        performanceComposition, // 产品性能结构及构成
        produceAddress, // 生产地址
        produceFactoryAliasName, // 生产厂家别名
        produceFactoryName, // 生产厂家名称
        producePlaceAddress, // 生产场所地址
        productContraindications, // 产品禁忌症
        productEnglishName, // 产品英文名称
        productName, // 产品名称
        productStandardNo, // 产品标准编号
        registerAddress, // 注册地址
        registerAgent, // 注册代理
        registerNo, // 注册号
        remark, // 备注
        replacedCertificateNo, // 新的注册证号
        replacedFlag, // 是否换证
        reviewOrgName, // 审核单位
        validDateEnd, // 有效期结束日期
        validDateLongFlag, // 是否长期有效
        validDateStart, // 有效期起始日期
      },
      {
        certificateStatus: certificateStatus2,
        afterSaleAddress: afterSaleAddress2,
        afterSaleService: afterSaleService2,
        agentSupplierName: agentSupplierName2,
        applicableScope: applicableScope2,
        certificateImageUrls: certificateImageUrls2,
        certificateNo: certificateNo2,
        certificateSku: certificateSku2,
        certificateType: certificateType2,
        customerServiceHotline: customerServiceHotline2,
        delayedCertificateNo: delayedCertificateNo2,
        delayedDateEnd: delayedDateEnd2,
        delayedFlag: delayedFlag2,
        importedFlag: importedFlag2,
        legalManceufacturer: legalManufacturer2,
        performanceComposition: performanceComposition2,
        produceAddress: produceAddress2,
        produceFactoryAliasName: produceFactoryAliasName2,
        produceFactoryName: produceFactoryName2,
        producePlaceAddress: producePlaceAddress2,
        productContraindications: productContraindications2,
        productEnglishName: productEnglishName2,
        productName: productName2,
        productStandardNo: productStandardNo2,
        registerAddress: registerAddress2,
        registerAgent: registerAgent2,
        registerNo: registerNo2,
        remark: remark2,
        replacedCertificateNo: replacedCertificateNo2,
        replacedFlag: replacedFlag2,
        reviewOrgName: reviewOrgName2,
        validDateEnd: validDateEnd2,
        validDateLongFlag: validDateLongFlag2,
        validDateStart: validDateStart2,
      },
    ] = arr
    let effectTime = ''
    const effectTime2 = ''
    if (validDateLongFlag) {
      effectTime = <span>{validDateStart} 至 长期有效</span>
    } else if (delayedFlag) {
      effectTime = <span>{validDateStart} 至 {delayedDateEnd}</span>
    } else {
      effectTime = <span>{validDateStart} 至 {validDateEnd}</span>
    }
    if (validDateLongFlag2) {
      effectTime = <span>{validDateStart2} 至 长期有效</span>
    } else if (delayedFlag2) {
      effectTime = <span>{validDateStart2} 至 {delayedDateEnd2}</span>
    } else {
      effectTime = <span>{validDateStart2} 至 {validDateEnd2}</span>
    }
    return [
      {
        title: '证件类型',
        editNo: certificateType && certificateTypeStr(certificateType, registTypeList),
        editNo2: certificateType2 && certificateTypeStr(certificateType2, registTypeList),
        exclude: 1,
      },
      {
        title: '证号',
        editNo: certificateNo,
        editNo2: certificateNo2,
        exclude: 1,
      },
      {
        title: '产品名称',
        editNo: productName,
        editNo2: productName2,
        exclude: 1,
      },
      {
        title: '有效期',
        editNo: effectTime,
        editNo2: effectTime2,
        exclude: 1,
      },
      {
        title: '生产企业',
        editNo: produceFactoryName,
        editNo2: produceFactoryName2,
        exclude: 1,
      },
      {
        title: '注册证生产企业',
        editNo: produceFactoryAliasName,
        editNo2: produceFactoryAliasName2,
        exclude: certificateType,
      },
      {
        title: '状态',
        editNo: certificateStatus ? '停用' : '启用',
        editNo2: certificateStatus2 ? '停用' : '启用',
        exclude: certificateType,
      },
      {
        title: '是否进口',
        editNo: importedFlag ? '是' : '否',
        editNo2: importedFlag2 ? '是' : '否',
        exclude: certificateType,
      },
      {
        title: '总代',
        editNo: agentSupplierName,
        editNo2: agentSupplierName2,
        exclude: certificateType,
      },
      {
        title: '延期标识',
        editNo: delayedFlag ? '是' : '否',
        editNo2: delayedFlag2 ? '是' : '否',
        exclude: certificateType,
      },
      {
        title: '延期证号',
        editNo: delayedCertificateNo,
        editNo2: delayedCertificateNo2,
        exclude: certificateType,
      },
      {
        title: '延期至',
        editNo: delayedDateEnd,
        editNo2: delayedDateEnd2,
        exclude: certificateType,
      },
      {
        title: '换证标识',
        editNo: replacedFlag ? '是' : '否',
        editNo2: replacedFlag2 ? '是' : '否',
        exclude: certificateType,
      },
      {
        title: '新证号',
        editNo: replacedCertificateNo,
        editNo2: replacedCertificateNo2,
        exclude: certificateType,
      },
      {
        title: '产品英文名称',
        editNo: productEnglishName,
        editNo2: productEnglishName2,
        exclude: certificateType,
      },
      {
        title: 'REG,NO',
        editNo: registerNo,
        editNo2: registerNo2,
        exclude: certificateType,
      },
      {
        title: '注册地址',
        editNo: registerAddress,
        editNo2: registerAddress2,
        exclude: certificateType,
      },
      {
        title: '法定制造商',
        editNo: legalManufacturer,
        editNo2: legalManufacturer2,
        exclude: certificateType,
      },
      {
        title: '生产场所地址',
        editNo: producePlaceAddress,
        editNo2: producePlaceAddress2,
        exclude: certificateType,
      },
      {
        title: '生产地址（厂商）',
        editNo: produceAddress,
        editNo2: produceAddress2,
        exclude: certificateType,
      },
      {
        title: '售后服务商',
        editNo: afterSaleService,
        editNo2: afterSaleService2,
        exclude: certificateType,
      },
      {
        title: '产品标准编号',
        editNo: productStandardNo,
        editNo2: productStandardNo2,
        exclude: certificateType,
      },
      {
        title: '产品禁忌症',
        editNo: productContraindications,
        editNo2: productContraindications2,
        exclude: certificateType,
      },
      {
        title: '客服热线',
        editNo: customerServiceHotline,
        editNo2: customerServiceHotline2,
        exclude: certificateType,
      },
      {
        title: '售后服务地址',
        editNo: afterSaleAddress,
        editNo2: afterSaleAddress2,
        exclude: certificateType,
      },
      {
        title: '注册代理',
        editNo: registerAgent,
        editNo2: registerAgent2,
        exclude: certificateType,
      },
      {
        title: '审核单位',
        editNo: reviewOrgName,
        editNo2: reviewOrgName2,
        exclude: certificateType,
      },
      {
        title: '注册证规格',
        editNo: certificateSku,
        editNo2: certificateSku2,
        exclude: certificateType,
      },
      {
        title: '适用范围',
        editNo: applicableScope,
        editNo2: applicableScope2,
        exclude: certificateType,
      },
      {
        title: '产品性能结构及构成',
        editNo: performanceComposition,
        editNo2: performanceComposition2,
        exclude: certificateType,
      },
      {
        title: '备注',
        editNo: remark,
        editNo2: remark2,
        exclude: certificateType,
      },
      {
        title: '证件图片',
        editNo: certificateImageUrls,
        editNo2: certificateImageUrls2,
        imgUrlsFlag: true,
        exclude: 1,
      },
    ]
  },
}
