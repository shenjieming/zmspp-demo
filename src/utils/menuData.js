// 开发使用的模拟数据

export default {
  mockMenuData: [
    {
      key: 'dashboard',
      name: '看板',
    },
    {
      key: 'organInfo',
      name: '机构信息',
    },
    {
      key: 'personInfo',
      name: '个人信息',
    },
    {
      key: 'base',
      name: '基础配置',
      icon: 'jichupeizhi',
      help: '基础配置',
      commonFlag: true,
      hasMenu: true,
      children: [
        {
          key: 'dictionaryAdmin',
          name: '字典表管理',
        },
      ],
    },
    {
      key: 'personAdmin',
      name: '人员管理',
      icon: 'renyuanguanli',
      help: 'personAdmin',
      commonFlag: false,
      hasMenu: false,
    },
    {
      key: 'roleAdmin',
      name: '角色管理',
      icon: 'jiaoseguanli',
      commonFlag: false,
      hasMenu: false,
    },
    {
      key: 'presetRoleAdmin',
      name: '预设角色管理',
      icon: 'yuxuanjiaoseguanli',
      commonFlag: false,
      hasMenu: false,
    },
    {
      name: '往来管理',
      key: 'contacts',
      icon: 'team',
      help: '往来管理',
      commonFlag: false,
      hasMenu: true,
      children: [
        {
          key: 'myCustomer',
          name: '我的客户',
        },
        {
          key: 'mySupplier',
          name: '我的供应商',
        },
        {
          key: 'supplierContrast',
          name: '供应商对照',
        },
        {
          key: 'newContactsRelation',
          name: '新的往来关系',
        },
      ],
    },
    // {
    //   name: '证件档案管理',
    //   key: 'credentials',
    //   icon: 'zhengjianguanli',
    //   help: '证件档案管理',
    //   commonFlag: false,
    //   hasMenu: true,
    //   children: [
    //     {
    //       key: 'myCertificate',
    //       name: '我的证件',
    //     },
    //     {
    //       key: 'customerCertificate',
    //       name: '供应商证件',
    //     },
    //   ],
    // },
    {
      name: '新证件档案管理',
      key: 'newCredentials',
      icon: 'zhengjianguanli',
      help: '新证件档案管理',
      commonFlag: false,
      hasMenu: true,
      children: [
        {
          key: 'newMyCertificate',
          name: '我的证件',
        },
        {
          key: 'newCustomerCertificate',
          name: '供应商证件',
        },
        {
          key: 'certificatePush',
          name: '证件推送',
        },
        {
          key: 'newCertificateAudit',
          name: '证件审核',
        },
      ],
    },
    {
      name: '消息管理',
      key: 'message',
      icon: 'tongzhi',
      commonFlag: false,
      hasMenu: true,
      children: [
        {
          name: '消息列表',
          key: 'list',
        },
        {
          name: '消息配置',
          key: 'configuration',
        },
      ],
    },
    {
      name: '采购目录',
      help: '采购目录',
      key: 'purchase',
      icon: 'caigoudingdan',
      // hasMenu: true,
      commonFlag: false,
      // children: [],
    },
    {
      name: '供货目录',
      help: '供货目录',
      key: 'supplyCatalogue',
      icon: 'inbox',
      hasMenu: false,
    },
    {
      name: '物料管理',
      help: '物料管理',
      key: 'materials',
      icon: 'wuliaoguanli',
      hasMenu: true,
      children: [
        {
          name: '条码管理',
          key: 'barcode',
        },
        {
          name: '物料',
          key: 'material',
        },
        {
          name: '注册证',
          key: 'certificate',
        },
        {
          name: '厂商品牌库',
          key: 'brand',
        },
        {
          name: '标准分类维护',
          key: 'standardCategory',
        },
        {
          name: '注册证对照',
          key: 'registContrast',
        },
        {
          name: '物料对照',
          key: 'materialCompare',
        },
      ],
    },
    {
      name: '组织机构管理',
      help: '组织机构管理',
      key: 'organization',
      icon: 'team',
      hasMenu: false,
    },
    {
      name: '菜单管理',
      help: '菜单管理',
      key: 'menuManage',
      icon: 'caidanguanli',
      hasMenu: false,
    },
    {
      name: '订单管理',
      help: '订单管理',
      key: 'orderManage',
      icon: 'dingdanguanli',
      hasMenu: true,
      children: [
        {
          name: '客户订单',
          key: 'customerOrder',
        },
        {
          name: '配送单',
          key: 'deliveryOrder',
        },
        {
          name: '跟台发货',
          key: 'ship',
        },
        {
          name: '退货单',
          key: 'cancelOrder',
        },
        {
          name: '业务权限设置',
          key: 'auth',
        },
        {
          name: '临时标签打印',
          key: 'tabPrint',
        },
      ],
    },
    {
      name: '采购管理',
      help: '采购管理',
      key: 'purchaseManage',
      icon: 'caigoudingdan',
      hasMenu: true,
      children: [
        {
          name: '手工采购',
          key: 'handPurchase',
        },
        {
          name: '采购订单',
          key: 'purchaseOrder',
        },
        {
          name: '配送单',
          key: 'deliveryOrder',
        },
        {
          name: '收货地址',
          key: 'receiptAddress',
        },
        {
          name: '扫描验收',
          key: 'scanAcceptance',
        },
        {
          name: '采购退货',
          key: 'purchaseCancel',
        },
      ],
    },
    {
      name: '分销管理',
      help: '分销管理',
      key: 'distributeManage',
      icon: 'setting',
      hasMenu: true,
      children: [
        {
          name: '订单分发',
          key: 'orderDistribute',
        },
        {
          name: '分销配送设置',
          key: 'distributeSet',
        },
      ],
    },
    {
      name: '统计与报表',
      key: 'statistics',
      icon: 'baobiao',
      hasMenu: true,
      children: [
        {
          name: '寄销库存',
          key: 'consignmentStock',
        },
      ],
    },
    {
      name: '证件档案审核',
      key: 'certificateAudit',
      icon: 'shenhe',
    },
    {
      name: '后台日志',
      key: 'log',
    },
    {
      name: '省采对接监控',
      key: 'provinceControl',
      hasMenu: true,
      children: [
        {
          name: '对账看板',
          key: 'accountBoard',
        },
        {
          name: '单据查询',
          key: 'billQuery',
        },
      ],
    },
    {
      name: '融资管理',
      key: 'financeManage',
      hasMenu: true,
      children: [
        {
          name: '贷款订单',
          key: 'loanOrders',
        },
        {
          name: '还款明细',
          key: 'repayManage',
        },
        {
          name: '授信管理',
          key: 'platCreditAudit',
        },
      ],
    },
    {
      name: '金融贷款',
      key: 'financeLoan',
      hasMenu: true,
      children: [
        {
          name: '贷款申请',
          key: 'loanDashboard',
          children: [
            {
              name: '贷款申请',
              key: 'loanApply',
            },
          ],
        },
        {
          name: '我的贷款',
          key: 'loanOrders',
        },
        {
          name: '还款',
          key: 'repayLoan',
        },
        {
          name: '授信管理',
          key: 'supplierCreditAudit',
        },
        {
          name: '账户余额',
          key: 'accountBalance',
          hasMenu: false,
          children: [{
            name: '提现申请',
            key: 'accountBalanceDetail',
          }],
        },
      ],
    },
    {
      name: '贷款审批',
      key: 'financeAudit',
      hasMenu: true,
      children: [
        {
          name: '贷款订单',
          key: 'loanOrders',
        },
        {
          name: '还款明细',
          key: 'repayAudit',
        },
        {
          name: '授信管理',
          key: 'bankCreditAudit',
        },
      ],
    },
    {
      name: '业务查询',
      key: 'businessQuery',
      hasMenu: true,
      children: [
        {
          name: '采购单查询',
          key: 'purchaseOrderQuery',
        },
      ],
    },

    /**
   * 内容管理
   */
    {
      name: '内容管理',
      key: 'websiteManage',
      hasMenu: true,
      children: [
        {
          name: '招聘信息管理',
          key: 'recruitManage',
        },
        {
          name: '文章管理',
          key: 'articleManage',
          children: [
            {
              name: '新增文章',
              key: 'detail',
            },
            {
              name: '编辑文章',
              key: 'eidtDetail',
            },
          ],
        },
      ],
    },
    {
      name: '客户查错',
      key: 'customerManage',
      hasMenu: false,
      help: '客户查错',
    },
    /** 商机 */
    {
      name: '商机',
      key: 'business',
      hasMenu: true,
      children: [
        {
          name: '商机列表',
          key: 'list',
        },
        {
          name: '我的发布',
          key: 'myRelease',
        },
        {
          name: '我参与的',
          key: 'myReply',
        },
      ],
    },
    {
      name: '商机审核',
      key: 'businessExamine',
    },
    {
      name: '增值服务',
      key: 'vipService',
      hasMenu: true,
      children: [
        {
          name: '客户入库查询',
          key: 'stockInQuery',
        },
        {
          name: '客户应付查询',
          key: 'payQuery',
        },
        {
          name: '开通会员',
          key: 'vipPage',
        },
      ],
    },
    {
      name: 'VIP审核',
      key: 'vipApprove',
    },
  ],
  mockUser: {
    userId: 'E5176C0086224850A71337B3B9FC2AF5',
    userRealName: '小明',
    userImageUrl: '',
    token: '23123123hdjksfhisd',
  },
  mockOrgInfo: {
    orgId: 'C26E2359251E413EB90D7006274D8B25',
    orgName: '零库存',
    accuracy: 2,
    accuracyDecimal: 0.01,
    orgType: '02',
  },
  mockOrgList: [
    {
      orgAccuracy: '4',
      orgId: 'C26E2359251E413EB90D7006274D8B25',
      orgName: '零库存',
      orgType: '02',
      isDefaultOrg: true,
    },
  ],
}
