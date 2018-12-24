export default {
  genList(arr) {
    const [
      {
        materialsSku, // 物料规格
        materialsSkuCode, // 物料规格编号
        materialsModel, // 物料规格型号
        materialsSkuStatus, // 物料规格状态
        productCode, // 产品编号
        remark, // 备注
        skuUnitName, // 物料规格单位名称
      },
      {
        materialsSku: materialsSku2,
        materialsSkuCode: materialsSkuCode2,
        materialsModel: materialsModel2,
        materialsSkuStatus: materialsSkuStatus2,
        productCode: productCode2, // 产品编号
        remark: remark2, // 备注
        skuUnitName: skuUnitName2, // 物料规格单位名称
      },
    ] = arr
    return [
      {
        title: '规格编码',
        editNo: materialsSkuCode,
        editNo2: materialsSkuCode2,
        exclude: 1,
      },
      {
        title: '产品编号',
        editNo: productCode,
        editNo2: productCode2,
        exclude: 1,
      },
      {
        title: '规格单位',
        editNo: skuUnitName,
        editNo2: skuUnitName2,
        exclude: 1,
      },
      {
        title: '规格',
        editNo: materialsSku,
        editNo2: materialsSku2,
        exclude: 1,
      },
      {
        title: '型号',
        editNo: materialsModel,
        editNo2: materialsModel2,
        exclude: 1,
      },
      {
        title: '状态',
        editNo: materialsSkuStatus ? '停用' : '启用',
        editNo2: materialsSkuStatus2 ? '停用' : '启用',
        exclude: 1,
      },
      {
        title: '备注',
        editNo: remark,
        editNo2: remark2,
        exclude: 1,
      },
    ]
  },
}

