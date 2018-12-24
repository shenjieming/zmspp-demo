import { MATERIALS_TYPE_ARRAY } from '../../../../utils/constant'

export default {
  genList(arr) {
    const [
      {
        materialsStatus,
        brandName, // 品牌名称
        materialsAttribute, // 物料属性
        materialsImageUrls, // 物料图片地址
        materialsName, // 物料名称
        produceFactoryName, // 生产厂家名称
        registerCertificateNo, // 注册证编号
        remark, // 备注
        standardCategoryName, // 标准分类名称
      },
      {
        materialsStatus: materialsStatus2,
        brandName: brandName2, // 品牌名称
        materialsAttribute: materialsAttribute2, // 物料属性
        materialsImageUrls: materialsImageUrls2, // 物料图片地址
        materialsName: materialsName2, // 物料名称
        produceFactoryName: produceFactoryName2, // 生产厂家名称
        registerCertificateNo: registerCertificateNo2, // 注册证编号
        remark: remark2, // 备注
        standardCategoryName: standardCategoryName2, // 标准分类名称
      },
    ] = arr
    return [
      {
        title: '物资名称',
        editNo: materialsName,
        editNo2: materialsName2,
        exclude: 1,
      },
      {
        title: '属性',
        editNo: materialsAttribute && MATERIALS_TYPE_ARRAY[Number(materialsAttribute)],
        editNo2: materialsAttribute2 && MATERIALS_TYPE_ARRAY[Number(materialsAttribute2)],
        exclude: 1,
      },
      {
        title: '标准分类',
        editNo: standardCategoryName,
        editNo2: standardCategoryName2,
        exclude: 1,
      },
      {
        title: '注册证号',
        editNo: registerCertificateNo,
        editNo2: registerCertificateNo2,
        exclude: 1,
      },
      {
        title: '厂家',
        editNo: produceFactoryName,
        editNo2: produceFactoryName2,
        exclude: 1,
      },
      {
        title: '品牌',
        editNo: brandName,
        editNo2: brandName2,
        exclude: 1,
      },
      {
        title: '状态',
        editNo: materialsStatus ? '停用' : '启用',
        editNo2: materialsStatus2 ? '停用' : '启用',
        exclude: 1,
      },
      {
        title: '备注',
        editNo: remark,
        editNo2: remark2,
        exclude: 1,
      },
      {
        title: '证件图片',
        editNo: materialsImageUrls,
        editNo2: materialsImageUrls2,
        imgUrlsFlag: true,
        exclude: 1,
      },
    ]
  },
}

