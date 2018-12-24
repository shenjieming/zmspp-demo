/*
*  路由匹配文件
* */
const routesTree = [
  /* 看板 */
  {
    path: 'dashboard',
    name: '看板',
    models: () => [import('../models/dashboard')],
    component: () => import('../routes/dashboard'),
  },
  /* 机构信息 */
  {
    path: 'organInfo',
    name: '机构信息',
    models: () => [import('../models/organInfo')],
    component: () => import('../routes/organInfo'),
  },
  {
    path: 'personInfo',
    name: '个人信息',
    models: () => [import('../models/personInfo')],
    component: () => import('../routes/personInfo'),
  },
  /* H5 */
  {
    path: 'confirmOrder',
    name: '订单确认',
    models: () => [import('../models/H5/confirmOrder')],
    component: () => import('../routes/H5/confirmOrder'),
  },
  /* 基础配置 */
  {
    path: 'base',
    name: '基础配置',
    children: [
      {
        path: 'dictionaryAdmin',
        name: '字典表管理',
        back: true,
        models: () => [import('../models/base/dictionaryAdmin')],
        component: () => import('../routes/base/dictionaryAdmin'),
        children: [
          {
            path: 'detail/:id',
            name: '字典值管理',
            models: () => [import('../models/base/dictionaryAdmin/dictionaryDetail.js')],
            component: () => import('../routes/base/dictionaryAdmin/dictionaryDetail'),
          },
        ],
      },
    ],
  },
  /* 人员管理 */
  {
    name: '人员管理',
    path: 'personAdmin',
    back: true,
    models: () => [import('../models/personAdmin/index.js')],
    component: () => import('../routes/personAdmin/index.js'),
    children: [
      {
        name: '人员详情',
        path: 'detail/:id',
        models: () => [import('../models/personAdmin/detail.js')],
        component: () => import('../routes/personAdmin/detail.js'),
      },
    ],
  },
  /* 往来管理 */
  {
    name: '往来管理',
    path: 'contacts',
    children: [
      {
        name: '我的客户',
        path: 'myCustomer',
        back: true,
        models: () => [import('../models/contacts/myCustomer/index.js')],
        component: () => import('../routes/contacts/myCustomer/index.js'),
        children: [
          {
            name: '我的客户详情',
            path: 'detail/:id',
            models: () => [import('../models/contacts/myCustomer/detail.js')],
            component: () => import('../routes/contacts/myCustomer/detail.js'),
          },
        ],
      },
      {
        name: '我的供应商',
        path: 'mySupplier',
        back: true,
        models: () => [import('../models/contacts/mySupplier/index.js')],
        component: () => import('../routes/contacts/mySupplier/index.js'),
        children: [
          {
            name: '我的供应商详情',
            path: 'detail/:id',
            models: () => [import('../models/contacts/mySupplier/detail.js')],
            component: () => import('../routes/contacts/mySupplier/detail.js'),
          },
        ],
      },
      {
        name: '供应商对照',
        path: 'supplierContrast',
        models: () => [import('../models/contacts/supplierContrast')],
        component: () => import('../routes/contacts/supplierContrast'),
      },
      {
        name: '新的往来关系',
        path: 'newContactsRelation',
        back: true,
        models: () => [import('../models/contacts/newContactsRelation')],
        component: () => import('../routes/contacts/newContactsRelation'),
        children: [
          {
            name: '客户详情',
            path: 'customerDetail/:id',
            models: () => [import('../models/contacts/myCustomer/detail.js')],
            component: () => import('../routes/contacts/myCustomer/detail.js'),
          },
          {
            name: '供应商详情',
            path: 'supplierDetail/:id',
            models: () => [import('../models/contacts/mySupplier/detail.js')],
            component: () => import('../routes/contacts/mySupplier/detail.js'),
          },
        ],
      },
    ],
  },
  /* 消息管理 */
  {
    name: '消息管理',
    path: 'message',
    children: [
      {
        name: '消息列表',
        path: 'list',
        models: () => [import('../models/message/list.js')],
        component: () => import('../routes/message/list/index.js'),
      },
      {
        name: '消息配置',
        path: 'configuration',
        models: () => [import('../models/message/configuration.js')],
        component: () => import('../routes/message/configuration/index.js'),
      },
    ],
  },
  /* 证件档案管理 */
  {
    name: '证件档案管理',
    path: 'credentials',
    children: [
      {
        name: '我的证件',
        path: 'myCertificate',
        models: () => [import('../models/credentials/myCertificate/index.js')],
        component: () => import('../routes/credentials/myCertificate/index.js'),
      },
      {
        name: '供应商证件',
        path: 'customerCertificate',
        models: () => [import('../models/credentials/customerCertificate/index.js')],
        component: () => import('../routes/credentials/customerCertificate/index.js'),
      },
    ],
  },
  /* 新证件档案管理 */
  {
    name: '新证件档案管理',
    path: 'newCredentials',
    children: [
      {
        name: '我的证件',
        path: 'newMyCertificate',
        models: () => [import('../models/newCredentials/myCertificate/index.js')],
        component: () => import('../routes/newCredentials/myCertificate/index.js'),
      },
      {
        name: '供应商证件',
        path: 'newCustomerCertificate',
        models: () => [import('../models/newCredentials/customerCertificate/index.js')],
        component: () => import('../routes/newCredentials/customerCertificate/index.js'),
      },
      {
        name: '证件推送',
        path: 'certificatePush',
        models: () => [import('../models/newCredentials/certificatePush/index.js')],
        component: () => import('../routes/newCredentials/certificatePush/index.js'),
        back: true,
        children: [
          {
            name: '推送详情',
            path: 'detail/:id',
            models: () => [import('../models/newCredentials/certificatePush/pushDetail.js')],
            component: () => import('../routes/newCredentials/certificatePush/pushDetail/index.js'),
          },
          {
            name: '推送证件',
            path: 'push/:id',
            models: () => [import('../models/newCredentials/certificatePush/pushCertificate.js')],
            component: () =>
              import('../routes/newCredentials/certificatePush/pushCertificate/index.js'),
          },
        ],
      },
      {
        name: '证件审核',
        path: 'newCertificateAudit',
        models: () => [import('../models/newCredentials/certificateAudit')],
        component: () => import('../routes/newCredentials/certificateAudit'),
      },
    ],
  },
  /* 采购目录 */
  {
    name: '采购目录',
    path: 'purchase',
    models: () => [import('../models/purchase/index.js')],
    component: () => import('../routes/purchase/index.js'),
    back: true,
    children: [
      {
        name: '从平台标准数据中选择',
        path: 'addForDic',
        models: () => [import('../models/purchase/addForDic')],
        component: () => import('../routes/purchase/addForDic/index.js'),
      },
    ],
  },
  /* 供货目录 */
  {
    name: '供货目录',
    path: 'supplyCatalogue',
    models: () => [import('../models/supplyCatalogue/index.js')],
    component: () => import('../routes/supplyCatalogue/index.js'),
    back: true,
    children: [
      {
        name: '医院目录详情',
        path: 'detail/:id',
        back: true,
        models: () => [import('../models/supplyCatalogue/detail.js')],
        component: () => import('../routes/supplyCatalogue/detail.js'),
        children: [
          {
            name: '从平台标准字典中选择',
            path: 'dictionSelect',
            models: () => [import('../models/supplyCatalogue/dictionSelect.js')],
            component: () => import('../routes/supplyCatalogue/dictionSelect.js'),
          },
        ],
      },
    ],
  },
  /* 物料管理 */
  {
    name: '物料管理',
    path: 'materials',
    children: [
      {
        name: '条码管理',
        path: 'barcode',
        models: () => [import('../models/materials/barcode.js')],
        component: () => import('../routes/materials/barcode/index.js'),
      },
      {
        name: '物料',
        path: 'material',
        models: () => [import('../models/materials/material.js')],
        component: () => import('../routes/materials/material'),
        back: true,
        children: [
          {
            name: '物料详情',
            path: 'materialDetail/:id',
            models: () => [import('../models/materials/materialDetail.js')],
            component: () => import('../routes/materials/materailDetail/index.js'),
          },
        ],
      },
      {
        name: '注册证',
        path: 'certificate',
        models: () => [import('../models/materials/certificate.js')],
        component: () => import('../routes/materials/certificate'),
      },
      {
        name: '厂商品牌库',
        path: 'brand',
        models: () => [import('../models/materials/brand.js')],
        component: () => import('../routes/materials/brand'),
      },
      {
        name: '标准分类',
        path: 'standardCategory',
        models: () => [import('../models/materials/standardCategory.js')],
        component: () => import('../routes/materials/standardCategory'),
      },
      {
        name: '注册证对照',
        path: 'registContrast',
        back: true,
        models: () => [import('../models/materials/registContrast.js')],
        component: () => import('../routes/materials/registContrast'),
        children: [
          {
            name: '对照',
            path: 'detail/:id',
            models: () => [import('../models/materials/registContrastDetail.js')],
            component: () => import('../routes/materials/registContrast/detail.js'),
          },
        ],
      },
      {
        name: '物料对照',
        path: 'materialCompare',
        models: () => [import('../models/materials/materialCompare.js')],
        component: () => import('../routes/materials/materialCompare'),
        back: true,
        children: [
          {
            name: '对照',
            path: 'materialCompareDetail/:id',
            models: () => [import('../models/materials/materialCompareDetail.js')],
            component: () => import('../routes/materials/materialCompareDetail'),
          },
        ],
      },
    ],
  },
  /* 组织机构管理 */
  {
    name: '组织机构管理',
    path: 'organization',
    models: () => [import('../models/organization/organization.js')],
    component: () => import('../routes/organization/organization'),
    back: true,
    children: [
      {
        name: '组织机构详情',
        path: 'detail/:id',
        models: () => [import('../models/organization/orgDetail.js')],
        component: () => import('../routes/organization/orgDetail'),
        back: true,
        children: [
          {
            name: '人员详情',
            path: 'personDetail/:id',
            models: () => [import('../models/organization/personDetail.js')],
            component: () => import('../routes/organization/personDetail/index.js'),
          },
        ],
      },
    ],
  },
  /* 角色管理 */
  {
    name: '角色管理',
    path: 'roleAdmin',
    models: () => [import('../models/roleAdmin/roleAdmin.js')],
    component: () => import('../routes/roleAdmin/index.js'),
    back: true,
    children: [
      {
        name: '角色详情',
        path: 'detail/:id',
        models: () => [import('../models/roleAdmin/roleDetail.js')],
        component: () => import('../routes/roleAdmin/roleDetail'),
      },
    ],
  },
  /* 预设角色管理 */
  {
    name: '预设角色管理',
    path: 'presetRoleAdmin',
    models: () => [import('../models/presetRoleAdmin/roleAdmin.js')],
    component: () => import('../routes/presetRoleAdmin/index.js'),
    back: true,
    children: [
      {
        name: '角色详情',
        path: 'detail/:id',
        models: () => [import('../models/presetRoleAdmin/roleDetail.js')],
        component: () => import('../routes/presetRoleAdmin/presetRoleDetail/index.js'),
      },
    ],
  },
  /* 菜单管理 */
  {
    name: '菜单管理',
    path: 'menuManage',
    models: () => [import('../models/menuManage.js')],
    component: () => import('../routes/menuManage/index.js'),
  },
  /* 登录功能页 */
  {
    name: '登录',
    path: 'login',
    models: () => [import('../models/login.js')],
    component: () => import('../routes/login/index.js'),
  },
  /* 注册功能页 */
  {
    name: '注册',
    path: 'regist',
    models: () => [import('../models/regist.js')],
    component: () => import('../routes/regist/index.js'),
  },
  /* 注册使用手册 */
  {
    name: '使用手册',
    path: 'useClause',
    models: () => [import('../models/regist.js')],
    component: () => import('../routes/regist/useClause.js'),
  },
  /* 忘记密码 */
  {
    name: '忘记密码',
    path: 'forgetPasd',
    models: () => [import('../models/forgetPasd.js')],
    component: () => import('../routes/forgetPasd/index.js'),
  },
  /* 订单管理 */
  {
    name: '订单管理',
    path: 'orderManage',
    children: [
      {
        name: '客户订单',
        path: 'customerOrder',
        models: () => [import('../models/orderManage/customerOrder/customerOrder.js')],
        component: () => import('../routes/orderManage/customerOrder/index.js'),
        back: true,
        children: [
          {
            name: '客户订单详情',
            path: 'detail/:id',
            models: () => [import('../models/orderManage/customerOrder/orderDetail.js')],
            component: () => import('../routes/orderManage/customerOrder/orderDetail/index.js'),
          },
          {
            name: '订单配送',
            path: 'delivery/:id',
            models: () => [
              import('../models/orderManage/customerOrder/orderDelivery.js'),
              import('../models/orderManage/printDetail.js'),
            ],
            component: () => import('../routes/orderManage/customerOrder/orderDelivery/index.js'),
          },
          {
            name: '查看物流',
            path: 'logistics/:id',
            models: () => [import('../models/orderManage/deliveryOrder/logistics')],
            component: () => import('../routes/orderManage/deliveryOrder/logistics'),
          },
        ],
      },
      {
        name: '配送单',
        path: 'deliveryOrder',
        models: () => [
          import('../models/orderManage/deliveryOrder/deliveryOrder.js'),
          import('../models/orderManage/printDetail.js'),
        ],
        component: () => import('../routes/orderManage/deliveryOrder/index.js'),
        back: true,
        children: [
          {
            name: '配送明细',
            path: 'deliveryDetail/:id',
            models: () => [
              import('../models/orderManage/deliveryOrder/deliveryDetail.js'),
              import('../models/orderManage/printDetail.js'),
            ],
            component: () => import('../routes/orderManage/deliveryOrder/deliveryDetail'),
          },
          {
            name: '查看物流',
            path: 'logistics/:id',
            models: () => [import('../models/orderManage/deliveryOrder/logistics')],
            component: () => import('../routes/orderManage/deliveryOrder/logistics'),
          },
        ],
      },
      {
        name: '跟台发货',
        path: 'ship',
        models: () => [
          import('../models/orderManage/ship'),
          import('../models/orderManage/printDetail.js'),
        ],
        component: () => import('../routes/orderManage/ship'),
      },
      {
        name: '退货单',
        path: 'cancelOrder',
        models: () => [import('../models/orderManage/cancelOrder')],
        component: () => import('../routes/orderManage/cancelOrder'),
        back: true,
        children: [
          {
            name: '退货单详情',
            path: 'detail/:id',
            models: () => [import('../models/orderManage/cancelOrder/detail.js')],
            component: () => import('../routes/orderManage/cancelOrder/detail'),
          },
        ],
      },
      {
        name: '业务权限设置',
        path: 'auth',
        models: () => [import('../models/orderManage/auth')],
        component: () => import('../routes/orderManage/auth'),
      },
      {
        name: '临时标签打印',
        path: 'tabPrint',
        models: () => [import('../models/orderManage/tabPrint')],
        component: () => import('../routes/orderManage/tabPrint'),
      },
    ],
  },
  /* 采购管理 */
  {
    name: '采购管理',
    path: 'purchaseManage',
    children: [
      {
        name: '手工采购',
        path: 'handPurchase',
        models: () => [import('../models/purchaseManage/handPurchase')],
        component: () => import('../routes/purchaseManage/handPurchase'),
        back: true,
        children: [
          {
            name: '订单确认',
            path: 'orderConfirmation',
            models: () => [import('../models/purchaseManage/handPurchase/orderConfirmation')],
            component: () => import('../routes/purchaseManage/handPurchase/orderConfirmation'),
          },
        ],
      },
      {
        name: '采购订单',
        path: 'purchaseOrder',
        models: () => [import('../models/purchaseManage/purchaseOrder/purchaseOrder')],
        component: () => import('../routes/purchaseManage/purchaseOrder'),
        back: true,
        children: [
          {
            name: '订单详情',
            path: 'detail/:id',
            models: () => [import('../models/purchaseManage/purchaseOrder/orderDetail')],
            component: () => import('../routes/purchaseManage/purchaseOrder/orderDetail'),
          },
          {
            name: '订单评价',
            path: 'rate/:id',
            models: () => [import('../models/purchaseManage/purchaseOrder/orderRate')],
            component: () => import('../routes/purchaseManage/purchaseOrder/orderRate'),
          },
          {
            name: '查看物流',
            path: 'logistics/:id',
            models: () => [import('../models/orderManage/deliveryOrder/logistics')],
            component: () => import('../routes/orderManage/deliveryOrder/logistics'),
          },
        ],
      },
      {
        name: '配送单',
        path: 'deliveryOrder',
        models: () => [import('../models/purchaseManage/purchaseDelivery/purchaseDelivery')],
        component: () => import('../routes/purchaseManage/deliveryOrder'),
        back: true,
        children: [
          {
            name: '配送明细',
            path: 'deliveryDetail/:id',
            models: () => [
              import('../models/purchaseManage/purchaseDelivery/purchaseDeliveryDetail'),
            ],
            component: () => import('../routes/purchaseManage/deliveryOrder/deliveryDetail'),
          },
          {
            name: '查看物流',
            path: 'purchaseLogistics/:id',
            models: () => [import('../models/orderManage/deliveryOrder/logistics')],
            component: () => import('../routes/orderManage/deliveryOrder/logistics'),
          },
        ],
      },
      {
        name: '收货地址',
        path: 'receiptAddress',
        models: () => [import('../models/purchaseManage/receiptAddress.js')],
        component: () => import('../routes/purchaseManage/receiptAddress'),
      },
      {
        name: '扫描验收',
        path: 'scanAcceptance',
        models: () => [import('../models/purchaseManage/scanAcceptance')],
        component: () => import('../routes/purchaseManage/scanAcceptance'),
      },
      {
        name: '采购退货',
        path: 'purchaseCancel',
        models: () => [import('../models/purchaseManage/purchaseCancel')],
        component: () => import('../routes/purchaseManage/purchaseCancel'),
        back: true,
        children: [
          {
            name: '退货单详情',
            path: 'detail/:id',
            models: () => [import('../models/purchaseManage/purchaseCancel/detail.js')],
            component: () => import('../routes/purchaseManage/purchaseCancel/detail'),
          },
        ],
      },
    ],
  },
  /* 分销管理 */
  {
    name: '分销管理',
    path: 'distributeManage',
    children: [
      {
        name: '订单分发',
        path: 'orderDistribute',
        models: () => [import('../models/distributeManage/orderDistribute/distributeList.js')],
        component: () => import('../routes/distributeManage/orderDistribute'),
        back: true,
        children: [
          {
            name: '调度',
            path: 'distribute/:id',
            models: () => [import('../models/distributeManage/orderDistribute/orderDistribute.js')],
            component: () => import('../routes/distributeManage/orderDistribute/distribute.js'),
          },
        ],
      },
      {
        name: '分销配送设置',
        path: 'distributeSet',
        back: true,
        models: () => [import('../models/distributeManage/distributeSet')],
        component: () => import('../routes/distributeManage/distributeSet'),
        children: [
          {
            name: '配送目录维护',
            path: 'safeguard/:id',
            models: () => [import('../models/distributeManage/distributeSet/safeguard')],
            component: () => import('../routes/distributeManage/distributeSet/safeguard'),
          },
        ],
      },
    ],
  },
  /* 运营后台 */
  {
    name: '证件档案审核',
    path: 'certificateAudit',
    models: () => [import('../models/certificateAudit/certificateAudit')],
    component: () => import('../routes/certificateAudit'),
  },
  /* 后台日志 */
  {
    name: '后台日志',
    path: 'log',
    back: true,
    models: () => [import('../models/log/log')],
    component: () => import('../routes/log'),
  },
  /* 统计与报表 */
  {
    path: 'provinceControl',
    name: '省采对接监控',
    children: [
      {
        name: '对账看板',
        path: 'accountBoard',
        models: () => [import('../models/provinceControl/accountBoard.js')],
        component: () => import('../routes/provinceControl/accountBoard'),
      },
      {
        name: '单据查询',
        path: 'billQuery',
        models: () => [import('../models/provinceControl/billQuery.js')],
        component: () => import('../routes/provinceControl/billQuery'),
      },
    ],
  },
  /* 医贝-运营后台 */
  {
    path: 'financeManage',
    name: '融资管理',
    children: [
      {
        name: '贷款订单',
        path: 'loanOrders',
        back: true,
        models: () => [import('../models/financeManage/loanOrders')],
        component: () => import('../routes/financeManage/loanOrders'),
        children: [
          {
            name: '订单详情',
            path: 'loanOrderDetail/:id',
            models: () => [import('../models/financeManage/loanOrders/loanOrderDetail.js')],
            component: () => import('../routes/financeManage/loanOrders/loanOrderDetail'),
          },
        ],
      },
      {
        name: '还款明细',
        path: 'repayManage',
        back: true,
        models: () => [import('../models/financeManage/repayManage.js')],
        component: () => import('../routes/financeManage/repayManage'),
        children: [
          {
            name: '详情',
            path: 'repayManageDetail/:id',
            models: () => [import('../models/financeManage/repayManageDetail.js')],
            component: () => import('../routes/financeManage/repayManage/repayManageDetail'),
          },
        ],
      },
      {
        name: '授信管理',
        path: 'platCreditAudit',
        back: true,
        models: () => [import('../models/financeManage/platCreditAudit')],
        component: () => import('../routes/financeManage/platCreditAudit'),
        children: [
          {
            name: '详情',
            path: 'detail/:id',
            models: () => [import('../models/financeManage/platCreditAudit/detail.js')],
            component: () => import('../routes/financeManage/platCreditAudit/detail'),
          },
        ],
      },
    ],
  },
  /* 医贝-供应商 */
  {
    path: 'financeLoan',
    name: '金融贷款',
    children: [
      {
        name: '贷款首页',
        path: 'loanDashboard',
        back: true,
        models: () => [import('../models/financeLoan/loanDashboard.js')],
        component: () => import('../routes/financeLoan/loanDashboard'),
        children: [
          {
            name: '贷款申请',
            path: 'loanApply',
            models: () => [import('../models/financeLoan/loanApply.js')],
            component: () => import('../routes/financeLoan/loanApply'),
          },
        ],
      },
      {
        name: '我的贷款',
        path: 'loanOrders',
        back: true,
        models: () => [import('../models/financeManage/loanOrders')],
        component: () => import('../routes/financeManage/loanOrders'),
        children: [
          {
            name: '订单详情',
            path: 'loanOrderDetail/:id',
            models: () => [import('../models/financeManage/loanOrders/loanOrderDetail.js')],
            component: () => import('../routes/financeManage/loanOrders/loanOrderDetail'),
          },
        ],
      },
      {
        name: '还款',
        path: 'repayLoan',
        back: true,
        models: () => [import('../models/financeLoan/repayLoan.js')],
        component: () => import('../routes/financeLoan/repayLoan'),
        children: [
          {
            name: '详情',
            path: 'repayLoanDetail/:id',
            models: () => [import('../models/financeLoan/repayLoanDetail.js')],
            component: () => import('../routes/financeLoan/repayLoan/repayLoanDetail'),
          },
          {
            name: '还款申请',
            path: 'repayApplyDetail/:id',
            models: () => [import('../models/financeLoan/repayApplyDetail.js')],
            component: () => import('../routes/financeLoan/repayLoan/repayApplyDetail'),
          },
        ],
      },
      {
        name: '授信管理',
        path: 'supplierCreditAudit',
        models: () => [import('../models/financeLoan/supplierCreditAudit')],
        component: () => import('../routes/financeLoan/supplierCreditAudit'),
      },
      {
        path: 'accountBalance',
        name: '账户余额',
        models: () => [import('../models/financeLoan/accountBalance')],
        component: () => import('../routes/financeLoan/accountBalance'),
        back: true,
        children: [
          {
            name: '提现申请',
            path: 'detail',
            models: () => [import('../models/financeLoan/accountBalance/detail.js')],
            component: () => import('../routes/financeLoan/accountBalance/detail.js'),
          },
        ],
      },
    ],
  },
  /* 医贝-银行 */
  {
    path: 'financeAudit',
    name: '贷款审批',
    children: [
      {
        name: '贷款订单',
        path: 'loanOrders',
        back: true,
        models: () => [import('../models/financeManage/loanOrders')],
        component: () => import('../routes/financeManage/loanOrders'),
        children: [
          {
            name: '订单详情',
            path: 'loanOrderDetail/:id',
            models: () => [import('../models/financeManage/loanOrders/loanOrderDetail.js')],
            component: () => import('../routes/financeManage/loanOrders/loanOrderDetail'),
          },
        ],
      },
      {
        name: '还款明细',
        path: 'repayAudit',
        back: true,
        models: () => [import('../models/financeAudit/repayAudit.js')],
        component: () => import('../routes/financeAudit/repayAudit'),
        children: [
          {
            name: '详情',
            path: 'repayAuditDetail/:id',
            models: () => [import('../models/financeAudit/repayAuditDetail.js')],
            component: () => import('../routes/financeAudit/repayAudit/repayAuditDetail'),
          },
        ],
      },
      {
        name: '授信管理',
        path: 'bankCreditAudit',
        back: true,
        models: () => [import('../models/financeAudit/bankCreditAudit')],
        component: () => import('../routes/financeAudit/bankCreditAudit'),
        children: [
          {
            name: '详情',
            path: 'detail/:id',
            models: () => [import('../models/financeAudit/bankCreditAudit/detail.js')],
            component: () => import('../routes/financeAudit/bankCreditAudit/detail'),
          },
        ],
      },
    ],
  },
  /* 业务查询 */
  {
    path: 'businessQuery',
    name: '业务查询',
    children: [
      {
        name: '采购单查询',
        path: 'purchaseOrderQuery',
        back: true,
        models: () => [import('../models/businessQuery/purchaseOrderQuery/platPurchaseOrder.js')],
        component: () => import('../routes/businessQuery/purchaseOrderQuery'),
        children: [
          {
            name: '采购单详情',
            path: 'detail/:id',
            back: true,
            models: () => [import('../models/businessQuery/purchaseOrderQuery/platOrderDetail.js')],
            component: () => import('../routes/businessQuery/purchaseOrderQuery/orderDetail'),
            children: [
              {
                name: '查看物流',
                path: 'logistics/:id',
                models: () => [import('../models/orderManage/deliveryOrder/logistics')],
                component: () => import('../routes/orderManage/deliveryOrder/logistics'),
              },
              {
                name: '配送明细',
                path: 'deliveryDetail/:id',
                models: () => [
                  import('../models/businessQuery/purchaseOrderQuery/purchaseDeliveryDetail'),
                ],
                component: () =>
                  import('../routes/businessQuery/purchaseOrderQuery/deliveryDetail'),
              },
            ],
          },
        ],
      },
    ],
  },
  /**
   * 内容管理
   */
  {
    path: 'websiteManage',
    name: '内容管理',
    children: [
      {
        name: '招聘信息管理',
        path: 'recruitManage',
        back: true,
        models: () => [import('../models/websiteManage/recruitManage')],
        component: () => import('../routes/websiteManage/recruitManage'),
      },
      {
        name: '文章管理',
        path: 'articleManage',
        back: true,
        models: () => [import('../models/articleManage')],
        component: () => import('../routes/articleManage'),
        children: [
          {
            name: '编辑文章',
            path: 'eidtDetail/:id',
            models: () => [import('../models/articleManage/detail.js')],
            component: () => import('../routes/articleManage/detail.js'),
          },
          {
            name: '新增文章',
            path: 'detail',
            models: () => [import('../models/articleManage/detail.js')],
            component: () => import('../routes/articleManage/detail.js'),
          },
        ],
      },
    ],
  },
  /** 客户查错 */
  {
    name: '客户查错',
    path: 'customerManage',
    models: () => [import('../models/customerManage')],
    component: () => import('../routes/customerManage'),
  },
  /** 商机 */
  {
    name: '商机',
    path: 'business',
    children: [
      {
        name: '商机列表',
        path: 'list',
        models: () => [import('../models/business/list')],
        component: () => import('../routes/business/list'),
        back: true,
        children: [
          {
            path: 'detail',
            name: '详情',
            models: () => [import('../models/business/list/detail')],
            component: () => import('../routes/business/list/detail'),
          },
          {
            path: 'release',
            name: '需求发布',
            models: () => [import('../models/business/myRelease/release')],
            component: () => import('../routes/business/myRelease/release'),
          },
        ],
      },
      {
        name: '我的发布',
        path: 'myRelease',
        back: true,
        models: () => [import('../models/business/myRelease')],
        component: () => import('../routes/business/myRelease'),
        children: [
          {
            path: 'release',
            name: '需求发布',
            models: () => [import('../models/business/myRelease/release')],
            component: () => import('../routes/business/myRelease/release'),
          },
          {
            path: 'detail',
            name: '详情',
            models: () => [import('../models/business/myRelease/detail')],
            component: () => import('../routes/business/myRelease/detail'),
          },
        ],
      },
      {
        name: '我参与的',
        path: 'myReply',
        back: true,
        models: () => [import('../models/business/myReply')],
        component: () => import('../routes/business/myReply'),
        children: [
          {
            path: 'release',
            name: '需求发布',
            models: () => [import('../models/business/myRelease/release')],
            component: () => import('../routes/business/myRelease/release'),
          },
          {
            path: 'detail',
            name: '详情',
            models: () => [import('../models/business/myReply/detail')],
            component: () => import('../routes/business/myReply/detail'),
          },
        ],
      },
      {
        name: '达成合作',
        path: 'mySuccess',
        back: true,
        models: () => [import('../models/business/mySuccess')],
        component: () => import('../routes/business/mySuccess'),
        children: [
          {
            path: 'release',
            name: '需求发布',
            models: () => [import('../models/business/myRelease/release')],
            component: () => import('../routes/business/myRelease/release'),
          },
          {
            path: 'detail',
            name: '详情',
            models: () => [import('../models/business/mySuccess/detail')],
            component: () => import('../routes/business/mySuccess/detail'),
          },
        ],
      },
      {
        name: '积分商城',
        path: 'mall',
        back: true,
        models: () => [import('../models/business/mall')],
        component: () => import('../routes/business/mall'),
      },
    ],
  },
  {
    name: '商机审核',
    path: 'businessExamine',
    models: () => [import('../models/businessExamine')],
    component: () => import('../routes/businessExamine'),
    back: true,
    children: [
      {
        path: ':id',
        name: '详情',
        models: () => [import('../models/businessExamine/detail')],
        component: () => import('../routes/businessExamine/detail'),
      },
    ],
  },
  {
    name: '增值服务',
    path: 'vipService',
    children: [
      {
        name: '客户入库查询',
        path: 'stockInQuery',
        back: true,
        models: () => [import('../models/vipService/stockInQuery')],
        component: () => import('../routes/vipService/stockInQuery'),
        children: [
          {
            path: 'detail/:id',
            name: '详情',
            models: () => [import('../models/vipService/stockInQuery/detail')],
            component: () => import('../routes/vipService/stockInQuery/detail'),
          },
        ],
      },
      {
        name: '客户应付查询',
        path: 'paymentQuery',
        back: true,
        models: () => [import('../models/vipService/paymentQuery')],
        component: () => import('../routes/vipService/paymentQuery'),
        children: [
          {
            path: 'detail/:id',
            name: '详情',
            models: () => [import('../models/vipService/paymentQuery/detail')],
            component: () => import('../routes/vipService/paymentQuery/detail'),
          },
        ],
      },
      {
        name: '寄销库存',
        path: 'consignmentStock',
        models: () => [import('../models/vipService/consignmentStock.js')],
        component: () => import('../routes/vipService/consignmentStock'),
      },
    ],
  },
  {
    name: 'VIP审核',
    path: 'vipApprove',
    models: () => [import('../models/vipApprove')],
    component: () => import('../routes/vipApprove'),
  },
  {
    name: '开通会员',
    path: 'vipPage',
    models: () => [import('../models/vipService/vipPage')],
    component: () => import('../routes/vipService/vipPage'),
  },
  {
    name: '开通会员',
    path: 'vipPage/:id',
    models: () => [import('../models/vipService/vipPage')],
    component: () => import('../routes/vipService/vipPage'),
  },
]

const routes = []

function loopRoutes(list, parentKey = '') {
  for (const item of list) {
    const { path, models, component, children } = item

    const pathProp = `${parentKey}/${path}`

    if (models && component) {
      routes.push({ path: pathProp, models, component })
    }

    if (Array.isArray(children) && children.length) {
      loopRoutes(children, pathProp)
    }
  }
}

// 生成路由树
loopRoutes(routesTree)

const breadcrumbs = {}

function loopBreadcrumb(list, parentKey = '') {
  for (const item of list) {
    const { path, back, name, children } = item

    const pathProp = `${parentKey}/${path}`

    breadcrumbs[pathProp] = { name, back }

    if (Array.isArray(children) && children.length) {
      loopBreadcrumb(children, pathProp)
    }
  }
}

// 生成面包屑对象
loopBreadcrumb(routesTree)

export default { routes, breadcrumbs }
