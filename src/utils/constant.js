/*
该文件保存普通常量
*/
import parseDomain from 'parse-domain'
import { EXCEL_DOWNLOAD } from './config'

const domain = parseDomain(window.location.hostname)

// 一级域名
const FIRST_LEVEL_DOMAIN = domain ? `${domain.domain}.${domain.tld}` : undefined

const REGEXP_TELEPHONE = '^1[3|4|5|6|7|8|9][0-9]{9}$'
// const REGEXP_FAX = '^(\\d{3,4})?(\\-)?\\d{7,8}?(\\-)?\\d{1,4}'
const REGEXP_FAX = '^(0\\d{2,3}-\\d{7,8}(-\\d{1,4})?)$'

export default {
  /* 常用FormItem布局 */
  FORM_ITEM_LAYOUT: {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  },
  /* 高级搜索无标题布局 */
  NO_LABEL_LAYOUT: {
    wrapperCol: { span: 22 },
  },
  /* 数字英文汉字组合 */
  REGEXP_NUMLETTERCHAR: '^[a-zA-Z0-9\u4e00-\u9fa5]+$',

  /* 手机号校验 */
  REGEXP_TELEPHONE,

  /* 邮箱校验 */
  REGEXP_EMAIL: '^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$',

  /* 固话和手机(联系方式)校验 */
  REGEXP_PHONE: `(${REGEXP_TELEPHONE})|(${REGEXP_FAX})`,

  /* 传真(传真号===固话)校验 */
  // REGEXP_FAX: '^(0[0-9]{2,3}\\-)?([2-9][0-9]{6,7})+(\\-[0-9]{1,4})?$',
  REGEXP_FAX,
  // 临时保存用户信息
  USER_INFO_TEMP: 'USER_INFO_TEMP_TOKEN=',
  // 通用reducer
  COMMON_REDUCER: 'updateState',
  // 组织机构类型
  ORG_TYPE: [
    {
      id: '03',
      name: '供应商',
      manageButtonFlag: true,
    },
    {
      id: '04',
      name: '厂家',
      manageButtonFlag: true,
    },
    {
      id: '07',
      name: '供应商&厂家',
      manageButtonFlag: true,
    },
    {
      id: '02',
      name: '医疗机构',
      manageButtonFlag: false,
    },
    {
      id: '06',
      name: '监管机构',
      manageButtonFlag: false,
    },
    {
      id: '05',
      name: '银行',
      manageButtonFlag: false, // 无经营范围
    },
  ],
  // 物料属性数组格式
  MATERIALS_TYPE_ARRAY: ['', '耗材', '药品', '试剂', '设备', '其他'],
  // 物料属性
  MATERIALS_TYPE: [
    {
      id: '1',
      name: '耗材',
    },
    {
      id: '2',
      name: '药品',
    },
    {
      id: '3',
      name: '试剂',
    },
    {
      id: '4',
      name: '设备',
    },
    {
      id: '5',
      name: '其他',
    },
  ],
  // 物料注册证
  MATERIALS_CERTIFICATE_TYPE: [
    {
      id: '1',
      name: '注册证',
    },
    {
      id: '2',
      name: '备案证',
    },
    {
      id: '3',
      name: '消毒证',
    },
  ],
  // 证件类型
  CERTIFICATE_TYPE: {
    '01': '营业执照',
    '02': '医疗器械经营许可证',
    '03': '税务登记证',
    '04': '医疗器械生产许可证',
    '05': '医疗机构执业许可证',
    '06': '医疗器械经营备案证',
  },
  // 导入物料模板路径
  IMPORT_TEMPLATE_URL: `${EXCEL_DOWNLOAD}/excel/template/MaterialsImportTemplate.xls`,
  // 授信模板地址
  CREDIT_TEMPLATE_URL: 'http://res.prod.youcdn.aek56.com/finance/%E6%8E%88%E4%BF%A1%E8%B5%84%E6%96%99%E6%A8%A1%E6%9D%BF.rar',
  FIRST_LEVEL_DOMAIN,
  // 销售类型
  SALE_TYPE: {
    1: '直销',
    2: '过票',
    3: '分销',
  },
  // 管理模式
  MANAGE_MODEL: {
    1: '普耗',
    2: '寄销',
    3: '跟台',
  },
  // 招标类型
  INVITE_TYPE: {
    1: '无',
    2: '省标',
    3: '市标',
    4: '院标',
  },
  // 退货单状态
  CANCEL_STATUS: {
    1: '暂存',
    2: '待退货审核',
    3: '待退货确认',
    4: '已完成',
    5: '审核不通过',
    6: '已作废',
  },
  // 订单状态
  ORDER_STATUS: [
    { value: '1', label: '尚未配送' },
    { value: '2', label: '部分配送' },
    { value: '3', label: '配送完结' },
    { value: '4', label: '订单完结' },
    { value: '5', label: '已终止' },
    { value: '6', label: '已作废' },
  ],
}
